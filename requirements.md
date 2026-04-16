# Requirements Document

## Introduction

CHILALOSHOP is a React/Vite e-commerce frontend with a Node.js/Express + Prisma backend. The current codebase has a solid visual foundation but suffers from non-functional UI elements, inconsistent design system usage, missing animations, runtime crash risks, dead navigation links, and significant dependency bloat (unused MUI packages). This overhaul targets a complete UI/UX upgrade: rich Motion-powered animations throughout, a fully redesigned Login/Register experience with micro-interactions, skeleton loading states, page transition system, consistent use of the existing `Input`/`Button` design system components, functional interactive elements (filters, sort, pagination, cart count, quick view), and removal of unused dependencies.

## Glossary

- **Animation_System**: The centralized Motion (Framer Motion) animation configuration providing shared variants, transitions, and orchestration utilities used across all pages and components.
- **Auth_Form**: The Login or Register page form, including all input fields, validation feedback, and submission controls.
- **Button**: The existing `src/app/components/Button.jsx` design system component.
- **Cart_Store**: The reactive client-side state that tracks cart item count and contents, sourced from the authenticated API or local state.
- **Design_System**: The set of shared components (`Button`, `Input`, `ProductCard`, etc.) and CSS custom properties defined in `theme.css`.
- **Filter_Panel**: The sidebar (desktop) or bottom-sheet drawer (mobile) containing category, price, size, color, rating, and availability filters on the Shop page.
- **Header**: The `src/app/components/Header.jsx` sticky navigation component.
- **Input**: The existing `src/app/components/Input.jsx` design system component.
- **Motion**: The `motion` npm package (Framer Motion v12) already installed and used in the project.
- **Page_Transition**: An animated wrapper applied at the route level that animates pages in and out when the route changes.
- **ProductCard**: The `src/app/components/ProductCard.jsx` component rendering a single product in grid or list view.
- **Quick_View_Modal**: A dialog overlay that displays key product details and an add-to-cart action without navigating away from the current page.
- **Skeleton**: A placeholder UI element that mimics the shape of loading content, displayed while data is being fetched.
- **Shop_Page**: The `src/app/pages/Shop.jsx` product listing page.
- **Toast**: A non-blocking notification rendered via the existing `sonner` library.

---

## Requirements

### Requirement 1: Animation System Foundation

**User Story:** As a developer, I want a centralized animation configuration, so that all pages and components share consistent, reusable motion behavior without duplicating animation logic.

#### Acceptance Criteria

1. THE Animation_System SHALL export a shared `pageVariants` object defining `initial`, `animate`, and `exit` states for page-level transitions.
2. THE Animation_System SHALL export a shared `staggerContainer` variant that staggers child animations with a configurable `staggerChildren` delay.
3. THE Animation_System SHALL export a shared `fadeInUp` variant for individual item entrance animations (opacity 0→1, y 20→0).
4. THE Animation_System SHALL export a shared `scaleIn` variant for modal and overlay entrance animations (opacity 0→1, scale 0.95→1).
5. WHEN the Animation_System variants are applied via Motion's `variants` prop, THE Motion library SHALL orchestrate parent-child stagger automatically without additional imperative code.
6. THE Animation_System SHALL define a `spring` transition preset with `type: "spring"`, `stiffness: 400`, and `damping: 30` for interactive micro-interactions.
7. THE Animation_System SHALL define a `smooth` transition preset with `type: "tween"`, `ease: "easeOut"`, and `duration: 0.35` for page-level transitions.

---

### Requirement 2: Page Transition System

**User Story:** As a user, I want smooth animated transitions between pages, so that navigation feels fluid and polished rather than abrupt.

#### Acceptance Criteria

1. THE Page_Transition SHALL wrap every route's page component and animate the page in on mount and out on unmount using `AnimatePresence` from Motion.
2. WHEN a route change occurs, THE Page_Transition SHALL play the exit animation of the leaving page before mounting the entering page.
3. THE Page_Transition SHALL use the `pageVariants` from the Animation_System for consistent enter/exit behavior.
4. THE Page_Transition SHALL complete its enter animation within 400ms to avoid perceptible delay.
5. IF a page transition is already in progress, THEN THE Page_Transition SHALL allow the new navigation to interrupt and begin immediately.
6. THE Page_Transition SHALL not cause layout shift or scrollbar flicker during the transition.

---

### Requirement 3: Login Form Redesign with Micro-interactions

**User Story:** As a user, I want a visually engaging and responsive login form, so that signing in feels modern and provides clear feedback at every step.

#### Acceptance Criteria

1. THE Auth_Form on the Login page SHALL use the `Input` design system component for all input fields, replacing the current raw `<input>` elements.
2. WHEN a user focuses an `Input` field on the Login page, THE Auth_Form SHALL animate the field's border color to `--primary` and scale the leading icon to 110% using a spring transition.
3. WHEN a user submits the Login form with invalid credentials, THE Auth_Form SHALL display an animated error banner that slides in from the top with a shake micro-animation (x: [-8, 8, -8, 8, 0]).
4. WHEN the Login form is in a loading state, THE Auth_Form SHALL display an animated spinner inside the submit Button and disable all form fields.
5. THE Auth_Form on the Login page SHALL animate the left visual panel's headline text using a staggered word-by-word entrance animation on initial mount.
6. WHEN a user hovers over the social login buttons (Google, GitHub), THE Auth_Form SHALL animate the button with a subtle scale-up (1.02) and border color transition to `--primary`.
7. THE Auth_Form SHALL display a floating label animation: WHEN a field has a value or is focused, THE label SHALL translate upward and reduce in font size using a smooth tween transition.
8. WHEN the Login page mounts, THE Auth_Form SHALL animate the form card in using `scaleIn` from the Animation_System with a 150ms delay after the page transition completes.
9. THE Auth_Form on the Login page SHALL update the copyright year dynamically using `new Date().getFullYear()`, replacing the hardcoded "© 2024".

---

### Requirement 4: Register Form Redesign with Micro-interactions

**User Story:** As a user, I want a rich registration experience with real-time feedback, so that creating an account is intuitive and encouraging.

#### Acceptance Criteria

1. THE Auth_Form on the Register page SHALL use the `Input` design system component for all input fields, replacing the current raw `<input>` elements.
2. WHEN a user types in the password field on the Register page, THE Auth_Form SHALL animate each password strength indicator pill: met requirements SHALL transition background to `--success/10` and text to `--success` with a spring animation; unmet requirements SHALL remain in the default gray state.
3. THE Auth_Form on the Register page SHALL include a confirm password field that validates the value matches the password field on blur.
4. WHEN the confirm password field value does not match the password field, THE Auth_Form SHALL display an inline error message below the confirm password `Input` using the `errorMessage` prop.
5. WHEN a user focuses an `Input` field on the Register page, THE Auth_Form SHALL animate the field's border color to `--primary` and scale the leading icon to 110% using a spring transition.
6. WHEN the Register form is in a loading state, THE Auth_Form SHALL display an animated spinner inside the submit Button and disable all form fields.
7. THE Auth_Form on the Register page SHALL animate the right visual panel's benefit badges using a staggered `fadeInUp` entrance animation with 100ms between each badge.
8. WHEN the Register page mounts, THE Auth_Form SHALL animate the form card in using `scaleIn` from the Animation_System with a 150ms delay after the page transition completes.
9. THE Auth_Form on the Register page SHALL update the copyright year dynamically using `new Date().getFullYear()`, replacing the hardcoded "© 2024".

---

### Requirement 5: Skeleton Loading States

**User Story:** As a user, I want to see skeleton placeholders while content loads, so that the page feels responsive and I understand the layout before data arrives.

#### Acceptance Criteria

1. WHEN the Shop page is loading products from the API, THE Shop_Page SHALL render a grid of `Skeleton` placeholder cards matching the product grid layout instead of a centered spinner.
2. WHEN the ProductDetail page is loading a product from the API, THE ProductDetail page SHALL render a `Skeleton` layout matching the two-column product detail structure (image gallery left, info right) instead of a centered spinner.
3. WHEN the Cart page is loading cart items from the API, THE Cart page SHALL render `Skeleton` rows matching the cart item list layout instead of a centered spinner.
4. WHEN the Account page is loading, THE Account page SHALL render `Skeleton` blocks for the stats grid and orders table instead of a blank content area.
5. THE Skeleton components SHALL use the existing `src/app/components/ui/skeleton.jsx` Radix UI component.
6. WHEN data finishes loading, THE Skeleton components SHALL be replaced by real content using an `AnimatePresence` fade transition with 200ms duration.
7. THE Skeleton layout for the Shop page SHALL render exactly 6 placeholder cards on mobile and 9 on desktop to match the expected grid density.

---

### Requirement 6: Header Cart Count Reactivity

**User Story:** As a user, I want the cart icon badge in the header to reflect my actual cart contents, so that I always know how many items I have without navigating to the cart page.

#### Acceptance Criteria

1. THE Header SHALL read the cart item count from the Cart_Store rather than a hardcoded constant.
2. WHEN a user adds an item to the cart, THE Cart_Store SHALL update the count and THE Header SHALL re-render the badge with the new value within 100ms.
3. WHEN a user removes an item from the cart, THE Cart_Store SHALL update the count and THE Header SHALL re-render the badge with the new value within 100ms.
4. WHEN the cart count changes, THE Header SHALL animate the badge with a brief scale pulse (1 → 1.4 → 1) using a spring transition.
5. WHEN the cart count is 0, THE Header SHALL hide the badge entirely using an `AnimatePresence` exit animation.
6. WHILE a user is not authenticated, THE Header SHALL not display a cart count badge.

---

### Requirement 7: Header Navigation Links

**User Story:** As a user, I want all navigation links in the header to route to real pages, so that I can explore the site without hitting dead ends.

#### Acceptance Criteria

1. THE Header SHALL route the "Categories" link to `/shop` with a pre-applied category filter query parameter.
2. THE Header SHALL route the "New Arrivals" link to `/shop?badge=New`.
3. THE Header SHALL route the "Sale" link to `/shop?badge=Sale`.
4. THE Header SHALL route the "About" link to a `/about` route or, WHERE no About page exists, THE Header SHALL route it to `/shop` as a fallback.
5. THE Header SHALL link the User icon button to `/account`.
6. THE Header SHALL link the Heart (wishlist) icon button to `/account/wishlist`.
7. WHEN a user is not authenticated and clicks the User icon or Heart icon, THE Header SHALL navigate to `/login`.
8. THE Header mega menu SHALL be keyboard-accessible: WHEN a user presses Enter or Space on the "Shop" nav item, THE mega menu SHALL open; WHEN a user presses Escape, THE mega menu SHALL close.

---

### Requirement 8: Shop Page Filter Functionality

**User Story:** As a user, I want all filter controls on the Shop page to actually filter the displayed products, so that I can find items matching my preferences.

#### Acceptance Criteria

1. WHEN a user adjusts the price range inputs on the Filter_Panel, THE Shop_Page SHALL filter `filteredProducts` to only include products whose `price` falls within the entered min and max values.
2. WHEN a user selects a size on the Filter_Panel, THE Shop_Page SHALL filter `filteredProducts` to only include products that have the selected size in their `sizes` array.
3. WHEN a user selects a color on the Filter_Panel, THE Shop_Page SHALL filter `filteredProducts` to only include products that have the selected color in their `colors` array, and THE selected color button SHALL display a checkmark indicator.
4. WHEN a user selects a minimum star rating on the Filter_Panel, THE Shop_Page SHALL filter `filteredProducts` to only include products whose `rating` is greater than or equal to the selected value.
5. WHEN the "In Stock Only" toggle is enabled, THE Shop_Page SHALL filter `filteredProducts` to only include products where `inStock` is `true`.
6. WHEN a user selects a sort option from the sort dropdown, THE Shop_Page SHALL sort `filteredProducts` accordingly: "Price: Low to High" by ascending `price`, "Price: High to Low" by descending `price`, "Newest Arrivals" by descending `createdAt`, "Highest Rated" by descending `rating`.
7. THE sort dropdown SHALL use a click-to-open state instead of CSS `group-hover`, so that it functions correctly on touch devices.
8. WHEN the grid/list view toggle is clicked, THE Shop_Page SHALL switch between a grid layout (2–3 columns) and a single-column list layout using the `ProductCard` `variant="horizontal"` prop.
9. WHEN active filters are applied, THE Shop_Page SHALL display filter chip tags above the product grid showing each active filter with a remove button.
10. WHEN a filter chip's remove button is clicked, THE Shop_Page SHALL remove that specific filter and re-filter the product list.

---

### Requirement 9: Shop Page Pagination

**User Story:** As a user, I want functional pagination on the Shop page, so that I can browse through all available products.

#### Acceptance Criteria

1. THE Shop_Page SHALL maintain a `currentPage` state variable initialized to 1.
2. THE Shop_Page SHALL define a `PAGE_SIZE` constant of 12 products per page.
3. WHEN `currentPage` or `filteredProducts` changes, THE Shop_Page SHALL compute `paginatedProducts` as the slice of `filteredProducts` from `(currentPage - 1) * PAGE_SIZE` to `currentPage * PAGE_SIZE`.
4. THE Shop_Page SHALL render `paginatedProducts` in the product grid instead of all `filteredProducts`.
5. WHEN a user clicks a page number button, THE Shop_Page SHALL update `currentPage` to the clicked page number and scroll to the top of the product grid.
6. WHEN `currentPage` is 1, THE Shop_Page SHALL disable the "previous page" button.
7. WHEN `currentPage` equals the total page count, THE Shop_Page SHALL disable the "next page" button.
8. THE Shop_Page SHALL display the correct "Showing X–Y of Z products" count based on `currentPage`, `PAGE_SIZE`, and total `filteredProducts` length.
9. WHEN filters change, THE Shop_Page SHALL reset `currentPage` to 1.

---

### Requirement 10: ProductCard Quick View Modal

**User Story:** As a user, I want to preview product details in a modal without leaving the current page, so that I can quickly evaluate products while browsing.

#### Acceptance Criteria

1. WHEN a user clicks the "Quick View" button on a ProductCard hover overlay, THE Quick_View_Modal SHALL open displaying the product's primary image, name, price, rating, available sizes, available colors, and an "Add to Cart" button.
2. THE Quick_View_Modal SHALL animate in using the `scaleIn` variant from the Animation_System.
3. WHEN a user clicks outside the Quick_View_Modal or presses Escape, THE Quick_View_Modal SHALL close with an exit animation.
4. WHEN a user clicks "Add to Cart" inside the Quick_View_Modal without selecting a required size or color, THE Quick_View_Modal SHALL display an inline validation message instead of calling the API.
5. WHEN a user successfully adds a product to cart from the Quick_View_Modal, THE Quick_View_Modal SHALL close and THE Toast SHALL display a success notification.
6. THE Quick_View_Modal SHALL use the existing `src/app/components/ui/dialog.jsx` Radix UI Dialog component.

---

### Requirement 11: ProductCard Add-to-Cart Action

**User Story:** As a user, I want the "Add to Cart" button on product cards to actually add the item to my cart, so that I can shop without navigating to each product detail page.

#### Acceptance Criteria

1. WHEN a user clicks "Add to Cart" on a ProductCard hover overlay and is authenticated, THE ProductCard SHALL call the cart API to add the product with a default quantity of 1.
2. WHEN the add-to-cart API call succeeds, THE Cart_Store SHALL increment the cart count and THE Toast SHALL display a success notification with the product name.
3. WHEN the add-to-cart API call fails, THE Toast SHALL display an error notification with the failure reason.
4. WHEN a user clicks "Add to Cart" on a ProductCard and is not authenticated, THE ProductCard SHALL navigate to `/login`.
5. WHILE the add-to-cart API call is in progress, THE ProductCard "Add to Cart" button SHALL display a loading spinner and be disabled.

---

### Requirement 12: ProductDetail Runtime Crash Fix

**User Story:** As a developer, I want the ProductDetail page to safely handle loading states, so that the page does not crash when accessing product properties before data is available.

#### Acceptance Criteria

1. THE ProductDetail page SHALL define the `images` array only after the `product` state is confirmed non-null (i.e., inside the post-loading render path, not at the top of the component body).
2. WHEN `product` is `null` and `loading` is `true`, THE ProductDetail page SHALL render the Skeleton loading layout defined in Requirement 5.
3. WHEN `product` is `null` and `loading` is `false`, THE ProductDetail page SHALL render the error state UI.
4. THE ProductDetail page SHALL import `ChevronLeft` and `ChevronRight` from `lucide-react` instead of defining local duplicate SVG components.
5. THE ProductDetail page SHALL fetch and render related products from the API in the "You May Also Like" section, replacing the "coming soon" placeholder.
6. THE ProductDetail "Specifications" tab SHALL render the product's `specifications` data if available, or display a "No specifications available" message.
7. THE ProductDetail "Shipping & Returns" tab SHALL render a static shipping policy block with delivery timeframes and return policy text.

---

### Requirement 13: Checkout Flow Completion

**User Story:** As a user, I want a complete multi-step checkout experience, so that I can review my cart, enter shipping details, pay, and confirm my order without encountering empty or broken steps.

#### Acceptance Criteria

1. THE Checkout page Step 1 (Cart) SHALL render the actual cart items fetched from the Cart API, matching the Cart page item list layout.
2. THE Checkout page Step 4 (Review) SHALL render a read-only summary of the shipping address entered in Step 2, the payment method selected in Step 3, and the cart items with totals.
3. WHEN a user clicks "Back" from Step 2, THE Checkout page SHALL navigate to Step 1 (Cart review), not to `/cart`.
4. WHEN a user clicks "Place Order" on Step 4, THE Checkout page SHALL call the order creation API and navigate to an order confirmation state displaying the order ID.
5. THE Checkout page SHALL use real cart data from the Cart API instead of hardcoded mock `products` array items.
6. WHEN a required shipping field is empty and the user attempts to proceed from Step 2, THE Checkout page SHALL display inline validation errors on the empty `Input` fields using the `errorMessage` prop.
7. WHEN a required payment field is empty and the user attempts to proceed from Step 3, THE Checkout page SHALL display inline validation errors on the empty `Input` fields using the `errorMessage` prop.
8. THE Checkout page step progress bar SHALL animate the fill width transition using Motion's `animate` prop with a `smooth` transition preset.

---

### Requirement 14: Account Sub-Route Navigation

**User Story:** As a user, I want each account sidebar link to navigate to a distinct page, so that I can manage my orders, wishlist, addresses, and payment methods independently.

#### Acceptance Criteria

1. THE Account page route `/account/orders` SHALL render a dedicated Orders sub-page displaying a paginated list of the user's orders fetched from the API.
2. THE Account page route `/account/wishlist` SHALL render a dedicated Wishlist sub-page displaying the user's saved products in a product grid.
3. THE Account page route `/account/addresses` SHALL render a dedicated Addresses sub-page with a form to add, edit, and delete saved shipping addresses.
4. THE Account page route `/account/payment` SHALL render a dedicated Payment Methods sub-page listing saved payment methods.
5. THE Account page route `/account/details` SHALL render a dedicated Account Details sub-page with a form to update the user's name, email, and password.
6. WHEN a user clicks "Edit Profile" on the Account Dashboard, THE Account page SHALL navigate to `/account/details`.
7. THE Account page sidebar SHALL animate the active link indicator using Motion's `layoutId` for a smooth sliding highlight transition between items.

---

### Requirement 15: Home Page Hero Auto-Play

**User Story:** As a user, I want the hero slider to advance automatically, so that I see all featured collections without manual interaction.

#### Acceptance Criteria

1. THE Home page hero slider SHALL auto-advance to the next slide every 5000ms using a `setInterval` that is cleared on component unmount.
2. WHEN a user manually clicks a dot indicator or arrow button, THE Home page SHALL reset the auto-play interval timer.
3. THE Home page hero slider SHALL display navigation arrows on mobile viewports (removing the `hidden lg:flex` restriction on arrow buttons).
4. WHEN the hero slide changes, THE Home page SHALL animate the outgoing slide's text content with an exit animation (opacity 1→0, x 0→-30) and the incoming slide's text with an entrance animation (opacity 0→1, x 30→0).
5. THE Home page "Load More Products" button SHALL fetch the next page of products from the API and append them to the displayed product list.

---

### Requirement 16: Design System Consistency

**User Story:** As a developer, I want all form inputs across the application to use the `Input` design system component, so that styling, accessibility, and behavior are consistent everywhere.

#### Acceptance Criteria

1. THE Login page SHALL use the `Input` component for the email and password fields, passing `leadingIcon`, `label`, and `errorMessage` props as appropriate.
2. THE Register page SHALL use the `Input` component for all fields (first name, last name, email, password, confirm password), passing `leadingIcon`, `label`, and `errorMessage` props as appropriate.
3. THE ForgotPassword page SHALL use the `Input` component for the email field.
4. THE `Input` component SHALL apply a `focus-within` color change to the `leadingIcon` container, transitioning the icon color to `--primary` when the input is focused.
5. THE `Button` component SHALL display the loading spinner for both `loading={true}` and when `disabled` is set due to a loading state passed from the parent.
6. WHERE a raw `<input>` or `<button>` element is used in place of the `Input` or `Button` design system components in any audited page or component, THE element SHALL be replaced with the corresponding design system component.

---

### Requirement 17: Dependency Cleanup

**User Story:** As a developer, I want unused dependencies removed from the project, so that bundle size is reduced and the dependency tree is easier to maintain.

#### Acceptance Criteria

1. THE project `package.json` SHALL NOT include `@mui/material` as a dependency after the overhaul.
2. THE project `package.json` SHALL NOT include `@mui/icons-material` as a dependency after the overhaul.
3. THE project `package.json` SHALL NOT include `@emotion/react` as a dependency after the overhaul.
4. THE project `package.json` SHALL NOT include `@emotion/styled` as a dependency after the overhaul.
5. WHEN the MUI packages are removed, THE application SHALL build without errors using `vite build`.
6. THE project SHALL NOT import from `@mui/*` or `@emotion/*` in any source file after the cleanup.

---

### Requirement 18: ForgotPassword Page Improvements

**User Story:** As a user, I want the Forgot Password page to feel consistent with the rest of the auth experience and show accurate information.

#### Acceptance Criteria

1. THE ForgotPassword page SHALL update the copyright year dynamically using `new Date().getFullYear()`, replacing the hardcoded "© 2024".
2. THE ForgotPassword page SHALL use the `Input` design system component for the email field.
3. WHEN the ForgotPassword form is submitted, THE ForgotPassword page SHALL call the real password reset API endpoint instead of using a `setTimeout` mock.
4. IF the password reset API call fails, THEN THE ForgotPassword page SHALL display an error message using the animated error banner pattern consistent with the Login page.
5. WHEN the ForgotPassword form is in a loading state, THE ForgotPassword page SHALL display an animated spinner inside the submit Button and disable the email field.

---

### Requirement 19: Stagger Animations on List Content

**User Story:** As a user, I want list and grid content to animate in with a stagger effect, so that the page feels dynamic and draws attention to the content.

#### Acceptance Criteria

1. WHEN the Shop page product grid renders, THE Shop_Page SHALL animate each ProductCard in using the `staggerContainer` and `fadeInUp` variants from the Animation_System, with a 50ms stagger between cards.
2. WHEN the Home page Featured Products grid renders, THE Home page SHALL animate each ProductCard in using the `staggerContainer` and `fadeInUp` variants.
3. WHEN the Home page Category grid renders, THE Home page SHALL animate each category card in using the `staggerContainer` and `fadeInUp` variants.
4. WHEN the Account page stats grid renders, THE Account page SHALL animate each stat card in using the `staggerContainer` and `fadeInUp` variants.
5. WHEN the Account page sidebar navigation renders, THE Account page SHALL animate each sidebar item in using the `staggerContainer` and `fadeInUp` variants.
6. WHEN a stagger animation is triggered, THE Animation_System SHALL ensure the total stagger duration for a 12-item grid does not exceed 600ms (50ms × 12 items).

---

### Requirement 20: Mobile-First Responsive Improvements

**User Story:** As a mobile user, I want all interactive elements to be touch-friendly and the layout to adapt correctly to small screens, so that I can shop comfortably on any device.

#### Acceptance Criteria

1. THE Header mega menu SHALL be replaced on mobile with the existing slide-out drawer, ensuring all category and trending links in the mega menu are also present in the mobile drawer.
2. THE Shop page sort dropdown SHALL open on click/tap rather than CSS hover, ensuring it is usable on touch devices.
3. THE ProductDetail page image thumbnail strip SHALL be horizontally scrollable on mobile with `overflow-x: auto` and hidden scrollbar styling.
4. THE Checkout page multi-step form SHALL stack the order summary sidebar below the form on mobile viewports.
5. THE Account page sidebar SHALL collapse into a horizontal scrollable tab bar on mobile viewports instead of a vertical sidebar.
6. THE Home page hero slider navigation arrows SHALL be visible and tappable on mobile viewports with a minimum touch target size of 44×44px.
7. WHEN the mobile filter drawer is open, THE Shop_Page SHALL prevent body scroll using `overflow: hidden` on the document body.
