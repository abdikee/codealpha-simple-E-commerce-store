import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { 
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    });

    // Format to include count
    const formatted = categories.map(cat => ({
      ...cat,
      count: cat._count.products
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
});

// Get category by ID
router.get('/:id', async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { products: true }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Create category (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// Update category (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Delete category (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
