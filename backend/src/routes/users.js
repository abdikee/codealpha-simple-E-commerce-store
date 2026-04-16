import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    // Only allow viewing own profile or admin
    if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    // Only allow updating own profile or admin
    if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { firstName, lastName, email } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { firstName, lastName, email },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user role (Admin only)
router.put('/:id/role', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Update password
router.put('/:id/password', authenticate, async (req, res, next) => {
  try {
    // Only allow updating own password
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.params.id },
      data: { passwordHash }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
