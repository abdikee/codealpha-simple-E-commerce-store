# FigmaShop Backend API

Full-featured e-commerce backend built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Features

- **Authentication**: JWT-based auth with register/login
- **Products**: CRUD operations with filtering and search
- **Categories**: Organize products by category
- **Cart**: Persistent shopping cart per user
- **Orders**: Complete order lifecycle (pending → paid → shipped → delivered)
- **Admin**: Role-based access control for admin operations
- **Users**: User management and profile updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcryptjs
- **Validation**: express-validator

## Project Structure

```
backend/
├── src/
│   ├── server.js           # Entry point
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication
│   │   ├── products.js     # Products CRUD
│   │   ├── categories.js   # Categories
│   │   ├── cart.js         # Shopping cart
│   │   ├── orders.js       # Orders
│   │   └── users.js        # User management
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT verification
│   │   └── errorHandler.js # Error handling
│   └── utils/
│       └── prisma.js       # Database client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Seed data
├── .env                    # Environment variables
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   Edit `.env` file with your database credentials:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/figmashop?schema=public"
   JWT_SECRET="your-secret-key"
   PORT=3001
   ```

3. **Set up the database**:
   ```bash
   # Create database
   createdb figmashop
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

   Server runs at `http://localhost:3001`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

**Query Parameters for GET /api/products**:
- `category` - Filter by category name
- `search` - Search in name/description
- `minPrice`, `maxPrice` - Price range
- `inStock` - Filter by availability

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:id` | Get category with products |
| POST | `/api/categories` | Create category (Admin) |
| PUT | `/api/categories/:id` | Update category (Admin) |
| DELETE | `/api/categories/:id` | Delete category (Admin) |

### Cart (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |

### Orders (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders` | Create order from cart |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |
| GET | `/api/orders/admin/all` | Get all orders (Admin) |

### Users (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (Admin) |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update profile |
| PUT | `/api/users/:id/role` | Change role (Admin) |
| DELETE | `/api/users/:id` | Delete user (Admin) |
| PUT | `/api/users/:id/password` | Change password |

## Authentication

Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Test Credentials

After seeding the database:

- **Admin**: `admin@figmashop.com` / `admin123`
- **User**: `user@example.com` / `password123`

## Database Schema

### Models

- **User**: id, email, password, profile, role, cart, orders
- **Product**: id, name, price, category, sizes, colors, etc.
- **Category**: id, name, image, product count
- **CartItem**: user-product association with size/color
- **Order**: user order with items and shipping address
- **OrderItem**: individual items in an order

## Available Scripts

```bash
npm run dev          # Start with hot reload
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio (GUI)
```

## License

MIT
