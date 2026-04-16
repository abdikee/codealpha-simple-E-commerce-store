import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats — dashboard summary
router.get('/stats', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenueAgg,
      ordersByStatus,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    // Resolve top product names
    const topProductIds = topProducts.map(p => p.productId);
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, price: true, image: true },
    });

    const topProductsWithDetails = topProducts.map(tp => ({
      ...tp,
      product: topProductDetails.find(p => p.id === tp.productId),
      totalSold: tp._sum.quantity,
    }));

    res.json({
      totalRevenue: Number(revenueAgg._sum.total || 0),
      totalOrders,
      totalUsers,
      totalProducts,
      ordersByStatus: Object.fromEntries(ordersByStatus.map(s => [s.status, s._count.id])),
      recentOrders,
      topProducts: topProductsWithDetails,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
