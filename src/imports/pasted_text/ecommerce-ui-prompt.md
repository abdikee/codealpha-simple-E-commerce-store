Here's a comprehensive UI/UX design prompt for Figma, structured specifically for designing an E-commerce store interface.

---

## 🎨 Figma UI/UX Design Prompt - E-Commerce Store

### Project Brief
Design a modern, conversion-focused e-commerce website UI/UX in Figma. The design should be clean, intuitive, and follow current e-commerce best practices. Include both desktop and mobile responsive versions.

---

## 📐 Design System Requirements

### 1. **Typography System**

```
Create text styles with the following hierarchy:

Heading 1 (H1)
- Font: Poppins Bold
- Size: 48px / 56px line-height
- Use: Homepage hero titles

Heading 2 (H2)
- Font: Poppins SemiBold
- Size: 36px / 44px line-height
- Use: Section headers

Heading 3 (H3)
- Font: Poppins Medium
- Size: 24px / 32px line-height
- Use: Product titles

Heading 4 (H4)
- Font: Poppins Medium
- Size: 18px / 26px line-height
- Use: Card titles

Body Large
- Font: Inter Regular
- Size: 18px / 28px line-height

Body Default
- Font: Inter Regular
- Size: 16px / 24px line-height

Body Small
- Font: Inter Regular
- Size: 14px / 20px line-height

Caption
- Font: Inter Medium
- Size: 12px / 16px line-height
- Use: Labels, badges

Button Text
- Font: Inter SemiBold
- Size: 16px / 24px line-height
- Letter-spacing: 0.5px
```

### 2. **Color System**

```
Primary Colors:
┌─────────────────────────────────────────────────┐
│ Primary-50:  #EBF5FF  │  Primary-600: #2563EB   │
│ Primary-100: #DBEAFE  │  Primary-700: #1D4ED8   │
│ Primary-200: #BFDBFE  │  Primary-800: #1E40AF   │
│ Primary-300: #93C5FD  │  Primary-900: #1E3A8A   │
│ Primary-400: #60A5FA  │                          │
│ Primary-500: #3B82F6  │                          │
└─────────────────────────────────────────────────┘

Neutral Colors:
┌─────────────────────────────────────────────────┐
│ Gray-50:  #F9FAFB   │  Gray-500: #6B7280        │
│ Gray-100: #F3F4F6   │  Gray-600: #4B5563        │
│ Gray-200: #E5E7EB   │  Gray-700: #374151        │
│ Gray-300: #D1D5DB   │  Gray-800: #1F2937        │
│ Gray-400: #9CA3AF   │  Gray-900: #111827        │
└─────────────────────────────────────────────────┘

Semantic Colors:
┌─────────────────────────────────────────────────┐
│ Success: #10B981 (Green)  │ Surface: #FFFFFF     │
│ Warning: #F59E0B (Amber)  │ Error: #EF4444 (Red) │
│ Info:    #3B82F6 (Blue)   │                      │
└─────────────────────────────────────────────────┘

Accent Colors (for badges and highlights):
┌─────────────────────────────────────────────────┐
│ Sale Badge:    #EF4444 (Red)                     │
│ New Badge:     #8B5CF6 (Purple)                  │
│ Best Seller:   #F59E0B (Amber)                   │
│ Low Stock:     #F97316 (Orange)                  │
└─────────────────────────────────────────────────┘
```

### 3. **Spacing & Grid System**

```
Base Unit: 4px

Spacing Scale:
├── xs:   4px
├── sm:   8px
├── md:   16px
├── lg:   24px
├── xl:   32px
├── 2xl:  48px
├── 3xl:  64px
├── 4xl:  80px
└── 5xl:  96px

Grid Settings (Desktop):
├── Container Max Width: 1280px
├── Columns: 12
├── Gutter: 24px
├── Margin: 32px (mobile: 16px)
└── Column Width: Flexible

Grid Settings (Mobile):
├── Container Max Width: 100%
├── Columns: 4
├── Gutter: 16px
└── Margin: 16px
```

### 4. **Component Library**

Create the following components with variants and states:

```
┌─────────────────────────────────────────────────────────────┐
│ BUTTON COMPONENT                                            │
├─────────────────────────────────────────────────────────────┤
│ Variants:                                                   │
│ • Primary (Solid)                                           │
│ • Secondary (Outline)                                       │
│ • Tertiary (Ghost/Text)                                     │
│ • Danger (Delete actions)                                   │
│                                                             │
│ Sizes:                                                      │
│ • Small (32px height)                                       │
│ • Medium (40px height) - Default                            │
│ • Large (48px height)                                       │
│ • Icon Only (40px × 40px)                                   │
│                                                             │
│ States:                                                     │
│ • Default, Hover, Active, Focus, Disabled, Loading          │
│                                                             │
│ With Icons: Left Icon / Right Icon                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INPUT FIELD COMPONENT                                       │
├─────────────────────────────────────────────────────────────┤
│ Variants:                                                   │
│ • Default                                                   │
│ • Filled Background                                         │
│                                                             │
│ States:                                                     │
│ • Default, Hover, Focus, Filled, Error, Disabled            │
│                                                             │
│ With:                                                       │
│ • Label (Top/Inside)                                        │
│ • Helper Text                                               │
│ • Error Message                                             │
│ • Leading Icon                                              │
│ • Trailing Icon (Clear/Show Password)                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRODUCT CARD COMPONENT                                      │
├─────────────────────────────────────────────────────────────┤
│ Variants:                                                   │
│ • Default (Vertical)                                        │
│ • Horizontal (For cart/mini-cart)                           │
│ • Compact (For related products)                            │
│ • Featured (With overlay badge)                             │
│                                                             │
│ Elements:                                                   │
│ • Product Image with Hover State                            │
│ • Badge (Sale/New/Best Seller)                              │
│ • Wishlist Icon Button                                      │
│ • Quick View Button (Appears on Hover)                      │
│ • Product Title                                             │
│ • Rating Display                                            │
│ • Price (Current + Original strikethrough)                  │
│ • Add to Cart Button                                        │
│                                                             │
│ States:                                                     │
│ • Default, Hover, Out of Stock                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CART ITEM COMPONENT                                         │
├─────────────────────────────────────────────────────────────┤
│ • Product Thumbnail (64px × 64px)                           │
│ • Product Title                                             │
│ • Variant/Size Selection (if applicable)                    │
│ • Price Display                                             │
│ • Quantity Selector (+ / - / Number / Remove)               │
│ • Item Total                                                │
│ • Remove Button                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MODAL / DRAWER COMPONENT                                    │
├─────────────────────────────────────────────────────────────┤
│ • Header with Title & Close Icon                            │
│ • Content Area (Scrollable)                                 │
│ • Footer with Actions                                       │
│ • Backdrop with Blur Effect                                 │
│                                                             │
│ Sizes:                                                      │
│ • Small (400px)                                             │
│ • Medium (600px)                                            │
│ • Large (800px)                                             │
│ • Full Screen (Mobile)                                      │
│                                                             │
│ Drawer Position: Right (Cart Drawer) / Bottom (Mobile Menu) │
└─────────────────────────────────────────────────────────────┘
```

### 5. **Icon Set**

```
Create/Import the following icon set (24px × 24px, Stroke: 2px):

Navigation Icons:
├── ☰ Menu (Hamburger)
├── 🔍 Search
├── 👤 User Profile
├── 🛒 Cart
├── ❤️ Wishlist
└── ✕ Close

Action Icons:
├── ➕ Add
├── ➖ Remove
├── 🗑️ Delete
├── ✏️ Edit
├── ✓ Check
├── ↩️ Back Arrow
├── → Forward Arrow
├── ↓ Chevron Down
├── ↑ Chevron Up
├── ↻ Refresh
├── ⭐ Star (Empty/Half/Full)
├── 🔔 Notification Bell
└── ⚙️ Settings

E-commerce Specific:
├── 📦 Box (Orders)
├── 🏷️ Tag (Discount)
├── 🚚 Truck (Shipping)
├── 💳 Card (Payment)
├── 🏠 Home
├── 📋 Clipboard (Order Summary)
├── 🔒 Lock (Security)
├── 📧 Mail (Newsletter)
├── 📱 Phone
└── 📍 Location Pin
```

---

## 📄 Page Designs Required

### Page 1: **Homepage** (Desktop & Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│ SECTION 1: HEADER / NAVIGATION                              │
├─────────────────────────────────────────────────────────────┤
│ Top Bar (Optional):                                         │
│ └── Announcement: "Free shipping on orders over $50"        │
│                                                             │
│ Main Header:                                                │
│ ├── Logo (Left)                                             │
│ ├── Main Navigation (Center):                               │
│ │   └── Shop, Categories, New Arrivals, Sale, About         │
│ ├── Search Bar                                              │
│ └── User Actions (Right):                                   │
│     └── Account, Wishlist, Cart (with count badge)          │
│                                                             │
│ Mega Menu (Hover state on "Shop"):                          │
│ └── Categories grid with images and featured items          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECTION 2: HERO BANNER                                      │
├─────────────────────────────────────────────────────────────┤
│ Full-width Carousel with:                                   │
│ • Background Image + Overlay                                │
│ • Headline: "Summer Collection 2024"                        │
│ • Subheadline: "Discover the latest trends"                 │
│ • Primary CTA Button: "Shop Now"                            │
│ • Secondary CTA: "View Lookbook"                            │
│ • Carousel Indicators (Dots)                                │
│ • Arrow Navigation                                          │
│ • Auto-rotate with pause on hover                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECTION 3: CATEGORY SHOWCASE                                │
├─────────────────────────────────────────────────────────────┤
│ Section Title: "Shop by Category"                           │
│ View All Link                                              │
│                                                             │
│ 4-Column Grid (Desktop) / 2-Column (Mobile):               │
│ Each Category Card:                                         │
│ └── Circular Image (Desktop) / Rounded Rectangle (Mobile)   │
│ └── Category Name Overlay                                   │
│ └── Item Count                                              │
│                                                             │
│ Categories to include:                                      │
│ ├── Women's Clothing                                        │
│ ├── Men's Clothing                                          │
│ ├── Accessories                                             │
│ └── Footwear                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECTION 4: FEATURED PRODUCTS                                │
├─────────────────────────────────────────────────────────────┤
│ Section Title: "Featured Products"                          │
│ Tab Navigation: "New Arrivals" | "Best Sellers" | "On Sale" │
│                                                             │
│ 4-Column Product Grid:                                      │
│ └── 8 Products displayed (2 rows)                           │
│                                                             │
│ Load More Button at bottom                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECTION 5: PROMOTIONAL BANNER                               │
├─────────────────────────────────────────────────────────────┤
│ Split Screen Layout:                                        │
│ Left (50%): Lifestyle Image                                 │
│ Right (50%):                                                │
│ └── Headline: "Limited Time Offer"                          │
│ └── Description: "Get 20% off your first order"             │
│ └── Countdown Timer Component                               │
│ └── Email Signup Form (Email + Subscribe Button)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECTION 6: BRAND / INSTAGRAM FEED                           │
├─────────────────────────────────────────────────────────────┤
│ Section Title: "Follow Us @brandname"                       │
│ 6-Column Image Grid (Desktop) / 3-Column (Mobile):          │
│ └── Instagram-style hover overlay with ❤️ icon              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECTION 7: FOOTER                                          │
├─────────────────────────────────────────────────────────────┤
│ 5-Column Layout:                                            │
│ ├── Column 1: Logo + About text + Social icons              │
│ ├── Column 2: Shop (Links)                                  │
│ ├── Column 3: Support (FAQ, Shipping, Returns, Contact)     │
│ ├── Column 4: Account (My Account, Orders, Wishlist)        │
│ └── Column 5: Newsletter Signup                             │
│                                                             │
│ Bottom Bar:                                                 │
│ └── Copyright, Payment Method Icons, Legal Links            │
└─────────────────────────────────────────────────────────────┘
```

### Page 2: **Product Listing Page (PLP)** (Desktop & Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (Same as homepage)                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ BREADCRUMB                                                  │
├─────────────────────────────────────────────────────────────┤
│ Home > Category > Subcategory                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                 │
├─────────────────────────────────────────────────────────────┤
│ Left: Category Title + Product Count                        │
│ Right: Sort Dropdown Component                              │
│ └── Options: Featured, Price: Low-High, Price: High-Low,    │
│              Newest, Best Rating                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FILTER SIDEBAR (Desktop - Left Column)                      │
│ ├── Filter Header with "Clear All" link                     │
│ ├── Categories Filter (Checkbox tree)                       │
│ ├── Price Range Slider Component                            │
│ │   └── Min: $0, Max: $500, Step: $10                       │
│ │   └── Input fields for manual entry                       │
│ ├── Brand Filter (Checkbox list with search)                │
│ ├── Size Filter (Button chips)                              │
│ ├── Color Filter (Color swatches)                           │
│ ├── Rating Filter (Star rating buttons)                     │
│ └── Availability Filter (In Stock toggle)                   │
│                                                             │
│ MOBILE VERSION:                                             │
│ └── Filter & Sort button that opens bottom sheet drawer     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRODUCT GRID (Desktop - Right Column)                       │
├─────────────────────────────────────────────────────────────┤
│ Active Filters Display (Chips with ✕)                       │
│                                                             │
│ 3-Column Product Grid:                                      │
│ └── Product Cards × 12                                      │
│                                                             │
│ Pagination Component:                                       │
│ └── < 1 2 3 4 5 ... 12 >                                   │
│ └── Items per page selector (24/48/96)                      │
└─────────────────────────────────────────────────────────────┘
```

### Page 3: **Product Details Page (PDP)** (Desktop & Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│ GALLERY SECTION (Desktop - 2 Columns)                       │
├─────────────────────────────────────────────────────────────┤
│ Left Column (60%):                                          │
│ ├── Main Image (Zoom on hover / Click for lightbox)         │
│ └── Thumbnail Strip (Horizontal scroll)                     │
│     └── 4-6 thumbnails with active state indicator          │
│                                                             │
│ Right Column (40%):                                         │
│ ├── Breadcrumb                                              │
│ ├── Product Title (H2)                                      │
│ ├── Rating Summary                                          │
│ │   └── ★★★★☆ (4.2) · 128 Reviews · 45 Q&A                 │
│ ├── Price Section                                           │
│ │   ├── Current Price: $89.99 (H3)                          │
│ │   ├── Original Price: $119.99 (Strikethrough, Muted)      │
│ │   └── Discount Badge: "-25%"                              │
│ ├── Short Description                                       │
│ ├── Variant Selection                                       │
│ │   ├── Size: Button chips (S, M, L, XL, XXL)               │
│ │   └── Color: Color swatches with name                     │
│ ├── Quantity Selector                                       │
│ │   └── (-) [ 1 ] (+) with "Only 5 left" warning            │
│ ├── Action Buttons                                          │
│ │   ├── Add to Cart (Primary, Full width)                   │
│ │   ├── Buy Now (Secondary, Full width)                     │
│ │   └── Wishlist (Icon button)                              │
│ ├── Shipping & Returns Info                                 │
│ │   └── Collapsible accordion or icons row                  │
│ └── Share Buttons                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRODUCT INFORMATION TABS (Full Width)                       │
├─────────────────────────────────────────────────────────────┤
│ Tab Component:                                              │
│ ├── Description                                             │
│ ├── Specifications                                          │
│ ├── Reviews (128)                                           │
│ └── Shipping & Returns                                      │
│                                                             │
│ Tab Content - Reviews:                                      │
│ ├── Rating Breakdown (Bar chart)                            │
│ ├── Review Cards with:                                      │
│ │   ├── User avatar & name                                  │
│ │   ├── Rating stars                                        │
│ │   ├── Verified Purchase badge                             │
│ │   ├── Review date                                         │
│ │   ├── Review title & body                                 │
│ │   └── Helpful? Yes/No buttons                             │
│ ├── Write Review Button                                     │
│ └── Load More Reviews                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ RELATED PRODUCTS                                            │
├─────────────────────────────────────────────────────────────┤
│ Section Title: "You May Also Like"                          │
│ 4-Column Product Carousel with arrow navigation             │
└─────────────────────────────────────────────────────────────┘
```

### Page 4: **Shopping Cart Page** (Desktop & Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                 │
├─────────────────────────────────────────────────────────────┤
│ Title: "Shopping Cart" (H2)                                 │
│ Item Count: "(3 items)"                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MAIN CONTENT (Desktop - 2 Columns)                          │
├─────────────────────────────────────────────────────────────┤
│ LEFT COLUMN (65%):                                          │
│ ├── Cart Items List                                         │
│ │   └── Cart Item Component × 3                             │
│ ├── Continue Shopping Link                                  │
│ └── Promo Code Section                                      │
│     └── Input field + "Apply" button                        │
│                                                             │
│ RIGHT COLUMN (35%):                                         │
│ ├── Order Summary Card                                      │
│ │   ├── Subtotal: $269.97                                   │
│ │   ├── Shipping: Calculated at next step                   │
│ │   ├── Tax: $21.60                                         │
│ │   ├── Discount: -$40.50 (Promo code applied)              │
│ │   ├── Divider                                             │
│ │   ├── Total: $251.07 (H3)                                 │
│ │   └── Checkout Button (Primary, Full width)               │
│ ├── Payment Method Icons (Trust badges)                     │
│ └── "We accept:" with card logos                            │
│                                                             │
│ MOBILE VERSION:                                             │
│ └── Order summary becomes sticky bottom bar or collapsible  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ EMPTY CART STATE                                            │
├─────────────────────────────────────────────────────────────┤
│ • Empty cart illustration/image                             │
│ • Message: "Your cart is empty"                             │
│ • Submessage: "Looks like you haven't added anything yet"   │
│ • Primary CTA: "Start Shopping"                             │
│ • Secondary: "View Saved Items" (if wishlist exists)        │
└─────────────────────────────────────────────────────────────┘
```

### Page 5: **Checkout Flow** (Desktop & Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT PROGRESS INDICATOR                                 │
├─────────────────────────────────────────────────────────────┤
│ Step Component:                                             │
│ ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐   │
│ │ 1. Cart │ -> │2. Shipping│-> │3. Payment│-> │4. Review │   │
│ └─────────┘    └─────────┘    └─────────┘    └─────────┘   │
│   (Active)       (Pending)      (Pending)      (Pending)    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT STEP 2: SHIPPING INFORMATION                       │
├─────────────────────────────────────────────────────────────┤
│ LEFT COLUMN (60%):                                          │
│ ├── Contact Information Section                             │
│ │   ├── Email Input (Required)                              │
│ │   └── Phone Input (Optional)                              │
│ ├── Shipping Address Form                                   │
│ │   ├── First Name / Last Name (Side by side)               │
│ │   ├── Address Line 1                                      │
│ │   ├── Address Line 2 (Optional)                           │
│ │   ├── City                                                │
│ │   ├── State/Province (Dropdown)                           │
│ │   ├── Postal Code                                         │
│ │   └── Country (Dropdown)                                  │
│ ├── Save this information checkbox                          │
│ └── Continue to Payment Button                              │
│                                                             │
│ RIGHT COLUMN (40%):                                         │
│ └── Order Summary (Mini Cart)                               │
│     ├── Product items (Collapsed view)                      │
│     ├── Show/Hide link                                      │
│     └── Total with breakdown                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT STEP 3: PAYMENT                                    │
├─────────────────────────────────────────────────────────────┤
│ LEFT COLUMN:                                                │
│ ├── Payment Method Selection                                │
│ │   ├── Credit Card (Radio, selected by default)            │
│ │   ├── PayPal (Radio)                                      │
│ │   └── Apple Pay / Google Pay (Radio)                      │
│ ├── Credit Card Form                                        │
│ │   ├── Card Number Input                                   │
│ │   ├── Expiry (MM/YY)                                      │
│ │   ├── CVC Input                                           │
│ │   └── Name on Card                                        │
│ ├── Billing Address                                         │
│ │   └── Same as shipping checkbox                           │
│ └── Continue to Review Button                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT STEP 4: ORDER REVIEW                               │
├─────────────────────────────────────────────────────────────┤
│ LEFT COLUMN:                                                │
│ ├── Shipping Address Summary (with Edit link)               │
│ ├── Payment Method Summary (with Edit link)                 │
│ ├── Items Summary Table                                     │
│ │   ├── Product | Price | Qty | Total                       │
│ │   └── Line items                                          │
│ ├── Additional Notes Textarea                               │
│ └── Place Order Button (Primary, Full width)                │
│                                                             │
│ RIGHT COLUMN:                                               │
│ └── Order Total Summary (Detailed breakdown)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ORDER CONFIRMATION PAGE                                     │
├─────────────────────────────────────────────────────────────┤
│ • Success Animation/Icon                                    │
│ • "Thank you for your order!" (H2)                          │
│ • Order Number: #ORD-2024-0123                              │
│ • Confirmation email sent message                           │
│ • Order Details Summary                                     │
│ • Estimated Delivery Date                                   │
│ • Continue Shopping Button                                  │
│ • Track Order Button                                        │
└─────────────────────────────────────────────────────────────┘
```

### Page 6: **Authentication Pages**

```
┌─────────────────────────────────────────────────────────────┐
│ LOGIN PAGE                                                  │
├─────────────────────────────────────────────────────────────┤
│ Centered Card (Max width: 440px)                            │
│ ├── Logo (Top)                                              │
│ ├── Title: "Welcome Back"                                   │
│ ├── Subtitle: "Sign in to your account"                     │
│ ├── Email Input Field                                       │
│ ├── Password Input Field with "Show/Hide" toggle            │
│ ├── Row: Remember me checkbox + Forgot password link        │
│ ├── Sign In Button (Primary)                                │
│ ├── Divider: "Or continue with"                             │
│ ├── Social Login Buttons (Google, Facebook, Apple)          │
│ └── Sign Up Link: "Don't have an account? Sign up"          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ REGISTRATION PAGE                                           │
├─────────────────────────────────────────────────────────────┤
│ Centered Card (Max width: 480px)                            │
│ ├── Title: "Create Account"                                 │
│ ├── First Name / Last Name (Side by side)                   │
│ ├── Email Input                                             │
│ ├── Password Input with strength indicator                  │
│ ├── Confirm Password Input                                  │
│ ├── Newsletter checkbox (Optional)                          │
│ ├── Terms & Conditions agreement checkbox                   │
│ ├── Create Account Button                                   │
│ └── Sign In Link                                            │
└─────────────────────────────────────────────────────────────┘
```

### Page 7: **User Account Dashboard**

```
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD LAYOUT                                            │
├─────────────────────────────────────────────────────────────┤
│ LEFT SIDEBAR (Navigation Menu)                              │
│ ├── Dashboard (Active)                                      │
│ ├── My Orders                                               │
│ ├── Wishlist                                                │
│ ├── Addresses                                               │
│ ├── Payment Methods                                         │
│ ├── Account Details                                         │
│ └── Logout                                                  │
│                                                             │
│ MAIN CONTENT AREA (Dashboard View):                         │
│ ├── Welcome message: "Hello, [User]!"                       │
│ ├── Stats Cards Row:                                        │
│ │   ├── Total Orders                                        │
│ │   ├── Wishlist Items                                      │
│ │   └── Store Credits                                       │
│ ├── Recent Orders Table                                     │
│ │   ├── Order # | Date | Status | Total | Action            │
│ │   └── 5 most recent orders with "View Details" link       │
│ └── Recommended Products Section                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ORDERS PAGE                                                 │
├─────────────────────────────────────────────────────────────┤
│ • Page Title: "My Orders"                                   │
│ • Filter Tabs: All | Processing | Shipped | Delivered       │
│ • Orders List:                                              │
│   └── Order Card Component with:                            │
│       ├── Order number and date                             │
│       ├── Status badge                                      │
│       ├── Items preview (Image thumbnails)                  │
│       ├── Total amount                                      │
│       └── Actions: View Details, Track, Buy Again           │
│ • Empty State (No orders)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Page 8: **Mobile Navigation Patterns**

```
┌─────────────────────────────────────────────────────────────┐
│ MOBILE BOTTOM NAVIGATION BAR                                │
├─────────────────────────────────────────────────────────────┤
│ Fixed at bottom of viewport:                                │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────┐         │
│ │  Home   │  Shop   │ Search  │  Cart   │ Account │         │
│ │   🏠    │   🛍️    │   🔍    │   🛒    │   👤    │         │
│ └─────────┴─────────┴─────────┴─────────┴─────────┘         │
│                                                             │
│ Cart icon shows item count badge                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MOBILE MENU DRAWER (Hamburger Menu)                         │
├─────────────────────────────────────────────────────────────┤
│ Slide from left:                                            │
│ ├── User Profile Header (Avatar + Name)                     │
│ ├── Main Navigation Links                                   │
│ │   └── With expandable subcategories (Accordion)           │
│ ├── Divider                                                 │
│ ├── Secondary Links (About, Contact, FAQ)                   │
│ └── Currency/Language Selector                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MOBILE SEARCH OVERLAY                                       │
├─────────────────────────────────────────────────────────────┤
│ Full-screen overlay:                                        │
│ ├── Search Bar with auto-focus                              │
│ ├── Recent Searches                                         │
│ ├── Trending Categories                                     │
│ ├── Search Results (As user types)                          │
│ │   ├── Products (With image)                               │
│ │   └── Categories                                          │
│ └── Cancel/Back button                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Interactive Components & States

### Micro-interactions to Design:

| Component | Interaction | Design Requirement |
|-----------|-------------|-------------------|
| Add to Cart Button | Click | Animation: Button text changes to "Added ✓" briefly, then reverts. Cart count badge increments |
| Wishlist Button | Click | Heart icon fills with red, pulse animation |
| Quantity Selector | Increment/Decrement | Smooth number update with disable state at min/max |
| Product Card | Hover | Quick view button appears, image slightly scales |
| Image Gallery | Thumbnail Click | Smooth transition to main image |
| Filter Chips | Remove | Chip slides out with delete animation |
| Form Validation | Error | Field border turns red, error message appears with shake |
| Loading States | Data Fetch | Skeleton loaders for product grids |
| Success Message | Action Complete | Toast notification slides from top/bottom |

---

## 📱 Responsive Breakpoints

```
Design frames required for:

Desktop: 1440px width
├── Homepage
├── Product Listing Page
├── Product Details Page
├── Cart Page
├── Checkout Flow (All steps)
└── Account Dashboard

Tablet: 768px width
├── Homepage
├── Product Listing Page (Filter as drawer)
└── Product Details Page

Mobile: 375px width
├── Homepage
├── Product Listing Page
├── Product Details Page
├── Cart Page
├── Checkout (Mobile optimized)
├── Login/Register
├── Account Dashboard
└── Mobile Menu & Search states
```

---

## 🎨 Additional Design Assets Required

### 1. **Illustrations / Graphics**
- Empty cart illustration
- Empty orders illustration
- 404 Page not found illustration
- Success/Checkout complete illustration
- Hero banner lifestyle images (×3)
- Category showcase images (×4)

### 2. **Product Images**
- Consistent style product photography
- At least 8 product images with multiple angles per product
- Lifestyle context images for PDP gallery

### 3. **UI Elements**
- Rating stars (Empty, Half, Full)
- Loading spinner
- Skeleton loader patterns
- Badge designs (Sale, New, Best Seller, Low Stock)
- Trust badges (Secure checkout, Money-back guarantee)
- Payment method icons (Visa, Mastercard, Amex, PayPal, Apple Pay)

### 4. **Animations (Describe in Figma Prototype)**
- Hover effects timing
- Page transitions
- Modal/drawer slide animations
- Add to cart success animation

---

## ✅ Design Handoff Checklist

- [ ] All text styles created and named
- [ ] Color styles defined as variables
- [ ] Grid and layout styles saved
- [ ] Effect styles saved (shadows, blurs)
- [ ] All components created with variants
- [ ] Auto-layout used for responsive components
- [ ] All states designed (hover, active, focus, disabled, error)
- [ ] Prototype connections established between key pages
- [ ] Component descriptions added in Figma
- [ ] Export assets properly named and organized
- [ ] Design tokens documented

---

## 🔗 Reference Inspiration

*Note: Do not copy directly. Use for inspiration only.*

- Clean layout: Everlane, Allbirds
- Product discovery: SSENSE, Farfetch
- Checkout flow: Apple Store, Warby Parker
- Mobile navigation: Nike, Adidas
- Filtering UX: ASOS, Zara

---

This design prompt provides everything needed to create a comprehensive e-commerce UI/UX design system in Figma. The design should prioritize clarity, trust-building elements, and smooth conversion paths. Let me know if you'd like me to elaborate on any specific component or page!