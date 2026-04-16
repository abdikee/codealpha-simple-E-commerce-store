import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', authenticate, async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { category: true } } }
    });

    res.json(cartItems);
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { productId, quantity, size, color } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.inStock) {
      return res.status(400).json({ error: 'Product is out of stock' });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId: req.user.id, productId, size, color }
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: { include: { category: true } } }
      });
      return res.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user.id,
        productId,
        quantity,
        size,
        color
      },
      include: { product: { include: { category: true } } }
    });

    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
});

// Update cart item quantity
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: req.params.id } });
      return res.json({ message: 'Item removed from cart' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity },
      include: { product: { include: { category: true } } }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/', authenticate, async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
});

export default router;
