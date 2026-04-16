import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products
// Query params: category, search, minPrice, maxPrice, inStock, exclude, limit, page, pageSize
router.get('/', async (req, res, next) => {
  try {
    const {
      category, search, minPrice, maxPrice,
      inStock, exclude, limit,
      page = 1, pageSize = 50,
    } = req.query;

    const where = {};

    if (category) {
      where.category = { name: category };
    }

    if (search) {
      where.OR = [
        { name:        { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    // Exclude a specific product (used for related products)
    if (exclude) {
      where.id = { not: exclude };
    }

    const take = limit ? Math.min(parseInt(limit), 100) : parseInt(pageSize);
    const skip = limit ? 0 : (parseInt(page) - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.product.count({ where }),
    ]);

    // If limit param used, return plain array (backwards compat)
    if (limit) {
      return res.json(products);
    }

    res.json({
      products,
      total,
      page: parseInt(page),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products (Admin)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { categoryId, name, description, price, originalPrice, badge, sizes, colors, inStock, stock, images } = req.body;
    const product = await prisma.product.create({
      data: { categoryId, name, description, price, originalPrice, badge, sizes, colors, inStock, stock: stock ?? 0, images: images ?? [] },
      include: { category: true },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { categoryId, name, description, price, originalPrice, badge, sizes, colors, inStock, stock, images } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { categoryId, name, description, price, originalPrice, badge, sizes, colors, inStock, stock, images },
      include: { category: true },
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
