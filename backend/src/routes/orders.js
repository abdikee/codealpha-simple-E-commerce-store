import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

// GET /api/orders — user's own orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/admin/all — admin only (must be before /:id)
router.get('/admin/all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        ...(req.user.role !== 'ADMIN' && { userId: req.user.id }),
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// POST /api/orders — create order from cart
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check all items are in stock
    const outOfStock = cartItems.filter(i => !i.product.inStock);
    if (outOfStock.length > 0) {
      return res.status(400).json({
        error: `The following items are out of stock: ${outOfStock.map(i => i.product.name).join(', ')}`,
      });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 12.5;
    const total = subtotal + shipping;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          status: 'PENDING',
          total,
          shippingAddress,
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: item.product.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      await tx.cartItem.deleteMany({ where: { userId: req.user.id } });
      return newOrder;
    });

    // Send order confirmation email (non-blocking)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const itemRows = order.items
      .map(i => `<tr><td>${i.product.name}</td><td>${i.size} / ${i.color}</td><td>×${i.quantity}</td><td>$${Number(i.price).toFixed(2)}</td></tr>`)
      .join('');

    sendEmail({
      to: user.email,
      subject: `Order Confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <h2>Thank you for your order, ${user.firstName}!</h2>
        <p>Your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> has been received and is being processed.</p>
        <table border="0" cellpadding="8" style="width:100%;border-collapse:collapse;">
          <thead><tr style="background:#f3f4f6"><th>Product</th><th>Variant</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
        <p>We'll notify you when your order ships.</p>
      `,
    }).catch(console.error);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// PUT /api/orders/:id/status — admin only
router.put('/:id/status', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    // Notify customer on key status changes
    if (['SHIPPED', 'DELIVERED'].includes(status)) {
      sendEmail({
        to: order.user.email,
        subject: `Your order has been ${status.toLowerCase()} — #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <h2>Order Update</h2>
          <p>Hi ${order.user.firstName}, your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> 
          has been <strong>${status.toLowerCase()}</strong>.</p>
          ${status === 'SHIPPED' ? '<p>Your package is on its way!</p>' : '<p>Enjoy your purchase!</p>'}
        `,
      }).catch(console.error);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
