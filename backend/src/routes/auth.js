import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── Register ──────────────────────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email, password, firstName, lastName } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, passwordHash, firstName, lastName },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
      });

      const token = generateToken(user.id);

      // Welcome email (non-blocking)
      sendEmail({
        to: user.email,
        subject: 'Welcome to ChilaloShop!',
        html: `<h2>Welcome, ${user.firstName}!</h2><p>Your account has been created successfully.</p>`,
      }).catch(console.error);

      res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  }
);

// ── Login ─────────────────────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Constant-time response to prevent user enumeration
        await bcrypt.hash('dummy', 12);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);
      res.json({
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ── Get current user ──────────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ── Forgot password ───────────────────────────────────────────────────────────
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      const { email } = req.body;

      // Always return success to prevent email enumeration
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        // Invalidate any existing tokens for this user
        await prisma.passwordResetToken.updateMany({
          where: { userId: user.id, used: false },
          data: { used: true },
        });

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.passwordResetToken.create({
          data: { userId: user.id, token: hashedToken, expiresAt },
        });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;

        await sendEmail({
          to: user.email,
          subject: 'Reset your ChilaloShop password',
          html: `
            <h2>Password Reset Request</h2>
            <p>Hi ${user.firstName},</p>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
              Reset Password
            </a>
            <p>If you didn't request this, you can safely ignore this email.</p>
          `,
        });
      }

      res.json({ message: 'If that email is registered you will receive reset instructions shortly.' });
    } catch (error) {
      next(error);
    }
  }
);

// ── Reset password ────────────────────────────────────────────────────────────
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { token, password } = req.body;
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token: hashedToken },
        include: { user: true },
      });

      if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired reset token.' });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: resetToken.userId },
          data: { passwordHash },
        }),
        prisma.passwordResetToken.update({
          where: { id: resetToken.id },
          data: { used: true },
        }),
      ]);

      res.json({ message: 'Password reset successfully. You can now sign in.' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
