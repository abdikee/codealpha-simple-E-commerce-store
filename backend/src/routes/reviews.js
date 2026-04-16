import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/product/:productId — public
router.get('/product/:productId', async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews — authenticated, one review per product per user
router.post(
  '/',
  authenticate,
  [
    body('productId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').trim().notEmpty().isLength({ max: 120 }),
    body('body').trim().notEmpty().isLength({ max: 2000 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { productId, rating, title, body: reviewBody } = req.body;

      // Check product exists
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Check user has ordered this product (verified purchase)
      const hasPurchased = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: { userId: req.user.id, status: { in: ['DELIVERED', 'SHIPPED'] } },
        },
      });

      const review = await prisma.review.create({
        data: {
          userId: req.user.id,
          productId,
          rating,
          title,
          body: reviewBody,
          verified: !!hasPurchased,
        },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
      });

      // Recalculate product rating
      const agg = await prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: Math.round((agg._avg.rating || 0) * 10) / 10,
          reviewCount: agg._count.id,
        },
      });

      res.status(201).json(review);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'You have already reviewed this product.' });
      }
      next(error);
    }
  }
);

// DELETE /api/reviews/:id — own review or admin
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.review.delete({ where: { id: req.params.id } });

    // Recalculate product rating
    const agg = await prisma.review.aggregate({
      where: { productId: review.productId },
      _avg: { rating: true },
      _count: { id: true },
    });
    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round((agg._avg.rating || 0) * 10) / 10,
        reviewCount: agg._count.id,
      },
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
