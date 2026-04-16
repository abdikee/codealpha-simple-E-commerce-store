Here's a complete all-in-one document combining both the Development and UI/UX Design specifications for the E-commerce store project.

---

# 🛍️ COMPLETE E-COMMERCE STORE SPECIFICATION
## Full-Stack Development & UI/UX Design Document

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Schema](#3-database-schema)
4. [Backend API Endpoints](#4-backend-api-endpoints)
5. [Frontend Page Requirements](#5-frontend-page-requirements)
6. [UI/UX Design System](#6-uiux-design-system)
7. [Component Specifications](#7-component-specifications)
8. [Figma Design Requirements](#8-figma-design-requirements)
9. [Functional Requirements](#9-functional-requirements)
10. [Security Requirements](#10-security-requirements)
11. [Development Phases](#11-development-phases)
12. [Deliverables Checklist](#12-deliverables-checklist)

---

## 1. Project Overview

### 1.1 Project Description
Build a full-stack e-commerce web application with product listings, user authentication, shopping cart functionality, and order processing. The application should feature a clean, modern UI inspired by leading e-commerce platforms with responsive design and smooth user experience.

### 1.2 Core Features
- Product catalog with categories and filtering
- Shopping cart with persistent storage
- User registration and authentication
- Order processing and checkout flow
- Product reviews and ratings
- User account dashboard
- Admin panel for management

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | HTML5, CSS3, JavaScript | - |
| CSS Framework | Custom CSS / Tailwind CSS (Optional) | 3.x |
| Backend Option 1 | Django (Python) | 4.x |
| Backend Option 2 | Express.js (Node.js) | 4.x |
| Database (Django) | PostgreSQL | 15+ |
| Database (Express) | PostgreSQL or MongoDB | Latest |
| Authentication | JWT or Session-based | - |
| Payment Processing | Stripe API (Mock for demo) | Latest |

---

## 3. Database Schema

### 3.1 Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    cost_per_item DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    additional_images JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    weight DECIMAL(8,2),
    dimensions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 Cart Items Table
```sql
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
```

### 3.5 Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.6 Order Items Table
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.7 Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);
```

### 3.8 Wishlist Table
```sql
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
```

---

## 4. Backend API Endpoints

### 4.1 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/refresh-token` | Refresh JWT token | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| GET | `/api/auth/verify-email/:token` | Verify email address | No |

### 4.2 Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | List products (with filters) | No |
| GET | `/api/products/:slug` | Get single product | No |
| GET | `/api/products/featured` | Get featured products | No |
| GET | `/api/products/search` | Search products | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

**Query Parameters for GET /api/products:**
```
?page=1&limit=24&category=clothing&minPrice=10&maxPrice=100&sort=price_asc&search=shirt
```

### 4.3 Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | List all categories | No |
| GET | `/api/categories/:slug` | Get category with products | No |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### 4.4 Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get current cart | No* |
| POST | `/api/cart/items` | Add item to cart | No* |
| PUT | `/api/cart/items/:id` | Update item quantity | No* |
| DELETE | `/api/cart/items/:id` | Remove item from cart | No* |
| DELETE | `/api/cart` | Clear cart | No* |
| POST | `/api/cart/coupon` | Apply coupon code | No* |

*Uses session ID for guest users

### 4.5 Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | List user orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |
| POST | `/api/orders` | Create new order | No* |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| GET | `/api/orders/track/:number` | Track order by number | No |

### 4.6 User Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| GET | `/api/users/addresses` | Get saved addresses | Yes |
| POST | `/api/users/addresses` | Add new address | Yes |
| PUT | `/api/users/addresses/:id` | Update address | Yes |
| DELETE | `/api/users/addresses/:id` | Delete address | Yes |

### 4.7 Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products/:id/reviews` | Get product reviews | No |
| POST | `/api/products/:id/reviews` | Add product review | Yes |
| PUT | `/api/reviews/:id` | Update review | Yes |
| DELETE | `/api/reviews/:id` | Delete review | Yes |

### 4.8 Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Get dashboard stats | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/orders` | List all orders | Admin |

---

## 5. Frontend Page Requirements

### 5.1 Page Structure Overview

```
├── Homepage (/)
├── Product Listing Page (/products, /category/:slug)
├── Product Details Page (/product/:slug)
├── Shopping Cart (/cart)
├── Checkout Flow (/checkout)
├── Authentication Pages
│   ├── Login (/login)
│   ├── Register (/register)
│   └── Forgot Password (/forgot-password)
├── User Account Dashboard
│   ├── Dashboard (/account)
│   ├── Orders (/account/orders)
│   ├── Addresses (/account/addresses)
│   ├── Wishlist (/account/wishlist)
│   └── Settings (/account/settings)
└── Admin Panel (/admin)
    ├── Dashboard (/admin)
    ├── Products (/admin/products)
    ├── Categories (/admin/categories)
    ├── Orders (/admin/orders)
    └── Users (/admin/users)
```

### 5.2 Detailed Page Specifications

#### HOMEPAGE (`/`)

**Sections (Top to Bottom):**
1. **Announcement Bar** - "Free shipping on orders over $50"
2. **Header/Navigation** - Logo, Search, Account, Cart
3. **Hero Carousel** - 3 slides with CTA buttons
4. **Category Showcase** - 4 categories with images
5. **Featured Products** - Tabbed: New Arrivals / Best Sellers / On Sale
6. **Promotional Banner** - Split layout with newsletter signup
7. **Instagram Feed** - 6 images grid
8. **Footer** - 5 columns with links and newsletter

#### PRODUCT LISTING PAGE (`/products`, `/category/:slug`)

**Layout (Desktop - 2 Columns):**
- **Left Sidebar (25%)** - Filters panel
  - Categories tree
  - Price range slider
  - Brand checkboxes
  - Size chips
  - Color swatches
  - Rating filters
  - Availability toggle
- **Right Content (75%)**
  - Breadcrumb navigation
  - Category title + product count
  - Sort dropdown
  - Active filter chips
  - Product grid (3 columns)
  - Pagination

**Mobile:** Filter button opens bottom drawer

#### PRODUCT DETAILS PAGE (`/product/:slug`)

**Layout (Desktop - 2 Columns):**
- **Left Column (60%)**
  - Main product image with zoom
  - Thumbnail gallery strip (4-6 images)
- **Right Column (40%)**
  - Breadcrumb
  - Product title
  - Rating summary with review count
  - Price (current + original with discount badge)
  - Short description
  - Variant selectors (Size, Color)
  - Quantity selector
  - Add to Cart / Buy Now buttons
  - Wishlist button
  - Shipping & returns accordion

**Below (Full Width):**
- Product tabs (Description, Specifications, Reviews)
- Related products carousel

#### SHOPPING CART (`/cart`)

**Layout (Desktop - 2 Columns):**
- **Left Column (65%)**
  - Cart items list
  - Continue shopping link
  - Promo code input
- **Right Column (35%)**
  - Order summary card
  - Subtotal, shipping, tax, total
  - Checkout button
  - Payment icons

**Empty State:** Illustration + "Start Shopping" button

#### CHECKOUT FLOW (`/checkout`)

**Progress Indicator:** Cart → Shipping → Payment → Review

**Step 1 - Shipping:**
- Email field
- Shipping address form
- Save information checkbox
- Continue button

**Step 2 - Payment:**
- Payment method selection (Card/PayPal)
- Credit card form
- Billing address (Same as shipping toggle)

**Step 3 - Review:**
- Address summaries with edit links
- Items table
- Order notes field
- Place order button

**Step 4 - Confirmation:**
- Success message with order number
- Order details summary
- Continue shopping / Track order buttons

#### AUTHENTICATION PAGES

**Login Page:**
```
┌──────────────────────────────────┐
│          [Logo]                  │
│                                  │
│      Welcome Back                │
│   Sign in to your account        │
│                                  │
│  ┌──────────────────────────┐   │
│  │ Email                    │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ Password          👁️     │   │
│  └──────────────────────────┘   │
│                                  │
│  ☐ Remember me    Forgot?       │
│                                  │
│  [    Sign In    ]              │
│                                  │
│  ─────── Or continue with ───────│
│                                  │
│  [G] [f] [Apple]                │
│                                  │
│  Don't have an account? Sign up  │
└──────────────────────────────────┘
```

**Register Page:**
- First/Last name (side by side)
- Email
- Password with strength indicator
- Confirm password
- Newsletter opt-in
- Terms agreement checkbox
- Create account button

#### USER ACCOUNT DASHBOARD

**Sidebar Navigation:**
- Dashboard (overview)
- My Orders
- Wishlist
- Addresses
- Payment Methods
- Account Details
- Logout

**Dashboard Overview:**
- Welcome message
- Stats cards (Orders, Wishlist, Credits)
- Recent orders table
- Recommended products

#### ADMIN PANEL

**Features:**
- Dashboard with sales chart and stats
- Product CRUD with image upload
- Category management
- Order management with status updates
- User management
- Basic analytics

---

## 6. UI/UX Design System

### 6.1 Color Palette

```css
/* Primary Colors */
--primary-50: #EBF5FF;
--primary-100: #DBEAFE;
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3B82F6;
--primary-600: #2563EB;
--primary-700: #1D4ED8;
--primary-800: #1E40AF;
--primary-900: #1E3A8A;

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5