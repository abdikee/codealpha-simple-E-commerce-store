import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@figmashop.com',
      passwordHash: await bcrypt.hash('admin123', 12),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });
  console.log('👤 Created admin user:', adminUser.email);

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: await bcrypt.hash('password123', 12),
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER'
    }
  });
  console.log('👤 Created test user:', testUser.email);

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Men's Clothing", image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80' },
      { name: "Women's Clothing", image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80' },
      { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
      { name: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' }
    ]
  });
  console.log('📁 Created', categories.count, 'categories');

  // Get category IDs
  const cats = await prisma.category.findMany();
  const getCategoryId = (name) => cats.find(c => c.name === name)?.id;

  // Create products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Classic White T-Shirt',
        price: 29.99,
        originalPrice: 39.99,
        rating: 4.5,
        reviewCount: 128,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId("Men's Clothing"),
        badge: 'Sale',
        description: 'A classic white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: JSON.stringify([
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Black', hex: '#000000' }
        ])
      },
      {
        name: 'Slim Fit Denim Jeans',
        price: 59.99,
        rating: 4.8,
        reviewCount: 85,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId("Men's Clothing"),
        badge: 'Best Seller',
        description: 'Durable and stylish slim fit denim jeans. Features a classic five-pocket design.',
        sizes: ['30', '32', '34', '36'],
        colors: JSON.stringify([
          { name: 'Indigo', hex: '#1E3A8A' },
          { name: 'Black', hex: '#1F2937' }
        ])
      },
      {
        name: 'Floral Summer Dress',
        price: 45.00,
        originalPrice: 60.00,
        rating: 4.2,
        reviewCount: 64,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId("Women's Clothing"),
        badge: 'New',
        description: 'Lightweight floral summer dress, perfect for beach days or garden parties.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: JSON.stringify([
          { name: 'Floral Red', hex: '#EF4444' },
          { name: 'Floral Blue', hex: '#3B82F6' }
        ])
      },
      {
        name: 'Canvas Sneakers',
        price: 35.00,
        rating: 4.6,
        reviewCount: 210,
        image: 'https://images.unsplash.com/photo-1544441893-675973e306a5?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId('Footwear'),
        description: 'Comfortable canvas sneakers with a rubber sole. Available in multiple colors.',
        sizes: ['7', '8', '9', '10', '11'],
        colors: JSON.stringify([
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Navy', hex: '#1E3A8A' }
        ])
      },
      {
        name: 'Leather Crossbody Bag',
        price: 89.99,
        originalPrice: 119.99,
        rating: 4.9,
        reviewCount: 45,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId('Accessories'),
        badge: 'Low Stock',
        description: 'Elegant leather crossbody bag with adjustable strap and gold-tone hardware.',
        sizes: ['One Size'],
        colors: JSON.stringify([
          { name: 'Tan', hex: '#B45309' },
          { name: 'Black', hex: '#000000' }
        ])
      },
      {
        name: 'Aviator Sunglasses',
        price: 25.00,
        rating: 4.4,
        reviewCount: 156,
        image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId('Accessories'),
        description: 'Classic aviator sunglasses with polarized lenses and UV protection.',
        sizes: ['One Size'],
        colors: JSON.stringify([
          { name: 'Gold', hex: '#FBBF24' },
          { name: 'Silver', hex: '#D1D5DB' }
        ])
      },
      {
        name: 'Knit Wool Sweater',
        price: 75.00,
        rating: 4.7,
        reviewCount: 92,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId("Men's Clothing"),
        description: 'Warm and cozy knit wool sweater for cold winter days.',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: JSON.stringify([
          { name: 'Grey', hex: '#6B7280' },
          { name: 'Navy', hex: '#1E3A8A' }
        ])
      },
      {
        name: 'Running Sports Shoes',
        price: 120.00,
        originalPrice: 150.00,
        rating: 4.8,
        reviewCount: 340,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        categoryId: getCategoryId('Footwear'),
        badge: 'Best Seller',
        description: 'High-performance running shoes with superior cushioning and breathability.',
        sizes: ['8', '9', '10', '11', '12'],
        colors: JSON.stringify([
          { name: 'Red/Black', hex: '#EF4444' },
          { name: 'Blue/White', hex: '#3B82F6' }
        ])
      }
    ]
  });
  console.log('📦 Created', products.count, 'products');

  // Update category counts
  for (const cat of cats) {
    const count = await prisma.product.count({ where: { categoryId: cat.id } });
    await prisma.category.update({
      where: { id: cat.id },
      data: { count }
    });
  }
  console.log('📊 Updated category counts');

  // Create sample cart items for test user
  const productList = await prisma.product.findMany();
  await prisma.cartItem.createMany({
    data: [
      {
        userId: testUser.id,
        productId: productList[0].id,
        quantity: 1,
        size: 'M',
        color: 'White'
      },
      {
        userId: testUser.id,
        productId: productList[3].id,
        quantity: 2,
        size: '9',
        color: 'Navy'
      }
    ]
  });
  console.log('🛒 Created sample cart items');

  // Create sample order
  await prisma.order.create({
    data: {
      userId: testUser.id,
      status: 'DELIVERED',
      total: 149.99,
      shippingAddress: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      }),
      items: {
        create: [
          {
            productId: productList[0].id,
            quantity: 1,
            size: 'M',
            color: 'White',
            price: 29.99
          },
          {
            productId: productList[4].id,
            quantity: 1,
            size: 'One Size',
            color: 'Black',
            price: 89.99
          }
        ]
      }
    }
  });
  console.log('📦 Created sample order');

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('🔑 Test Credentials:');
  console.log('   Admin: admin@figmashop.com / admin123');
  console.log('   User:  user@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
