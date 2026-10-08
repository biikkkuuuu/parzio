# PARZIO Atelier — Project Master Context & Architecture (brain.md)

> **Last Updated:** October 7, 2026  
> **Repository:** `biikkkuuuu/parzio` (Branch: `main`)  
> **Deployment:** Production Vercel Auto-deploy from `main`  
> **Cloud Backend:** Google Cloud Firebase / Cloud Firestore

---

## 1. Project Overview & Architecture
PARZIO is a demi-fine luxury e-commerce web platform engineered with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It provides a storefront alongside an **Atelier Operations Hub** (Admin Panel at `#/admin`).

### Core Technology Stack:
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas API for image compression.
- **State Management:** Zustand (`cartStore`, `uiStore`) + React Hooks + `localStorage` / `sessionStorage`.
- **Backend / Cloud DB:** Google Cloud Firebase (Firestore `products`, `categories`, `orders`, `store_banners`, `store_coupons`, `top_marquee`, `banner_marquee`, `sale_posters`, `skin_safe_config`, `sale_banner_config`, `exchanges`, `pincodes`, `store_settings`).
- **Authentication:** Firebase Auth (`signInWithEmailAndPassword`) with local fallback verification.

---

## 2. Key Issues Resolved

### A. Admin Product & Category Deletion Desync (Storefront vs Admin)
- **Problem:** When an admin deleted products or categories in the Admin Panel (`#/admin`), they were not deleting from the public storefront (`#/`) or were reappearing on page refresh.
- **Root Causes:**
  1. **Firestore Document ID Mismatch:** Products or categories saved with auto-generated or custom Firestore document IDs were only targeted by a single key in `deleteDoc(doc(db, col, id))`, leaving other instances untouched in Firestore.
  2. **Storefront Re-fetching:** On refresh or initial visit, `fetchProductsFromCloud()` and `fetchCategoriesFromCloud()` retrieved un-deleted documents from Firestore and repopulated `localStorage['parzio_products']` and `localStorage['parzio_categories']`.
  3. **Hardcoded Category Chips in `SalesSection.tsx`:** The category filter bar on the Sale page (`#/sale`) had hardcoded chips `['ALL SALE', 'NECKLACES', 'BRACELETS', 'EARRINGS', 'RINGS', 'ANKLETS']`. Even if the catalog had 0 categories, these chips were permanently rendered.
  4. **Browser LocalStorage Retention:** Old visitors retained cached mock or legacy items from earlier versions.
- **Fixes Applied:**
  1. Updated `fetchProductsFromCloud`, `fetchCategoriesFromCloud`, `subscribeToProducts`, and `subscribeToCategories` in `src/services/dbService.ts` to strictly preserve document IDs: `{ ...data, id: data.id || docSnap.id }`.
  2. Upgraded `deleteProduct` and `deleteCategory` to delete directly by ID and perform a sweep of any collection documents matching the ID or name.
  3. Added `deleteAllProducts()` and `deleteAllCategories()` to `dbService.ts` for clean 1-click cloud & local catalog wipes.
  4. Added **"Delete All ({count})"** buttons with safety confirmation dialogs in `AdminInventoryView.tsx` and `AdminCategoriesView.tsx`.
  5. Updated `src/components/SalesSection.tsx` to derive category chips dynamically from the live `categories` or `products` props and hide the category chip bar entirely when no categories exist.
  6. Bumped the cache-invalidation token in `src/App.tsx` to `parzio_clean_catalog_2026_v4` so all user sessions and devices start 100% clean without legacy cached items.

### B. Admin Image Upload Browser Crashes (Chrome "Out of Memory" / "Page Unresponsive")
- **Problem:** Uploading banners, category images, or product photos from local devices froze or crashed Chrome with "Out of Memory" (Code 5) or "Page Unresponsive".
- **Root Causes:**
  1. Using raw `FileReader.readAsDataURL` on large smartphone camera photos (5MB - 15MB each), generating massive base64 strings that overwhelmed V8 memory.
  2. Six recursive `useEffect` hooks in `src/App.tsx` were syncing local state to Firestore while simultaneous `onSnapshot` listeners were updating the same state, causing an infinite render loop.
- **Fixes Applied:**
  1. In `src/components/admin/DeviceImageUpload.tsx`, eliminated raw base64 FileReader; introduced bounded HTML5 Canvas downsampling (max width/height 1200px, 0.78 JPEG compression) and native `URL.createObjectURL`.
  2. Added safe error/load boundaries `<img onError/onLoad>` preventing infinite broken image repaint loops.
  3. Removed the ping-pong recursive `useEffect` sync hooks from `src/App.tsx`. All admin edits now save directly through explicit handler calls (`handleUpdateBanners`, `handleUpdateSalePosters`, etc.).

### C. Admin Authentication Security & Clean Separation
- **Problem:** Avoid exposing admin credentials in client-side code while allowing seamless Admin Login.
- **Solution:** `src/components/admin/AdminLogin.tsx` first attempts Firebase Auth (`signInWithEmailAndPassword`). If Firebase Auth succeeds, `parzio_admin_auth` is stored in `sessionStorage` and access is granted.

### D. Hardware Back Button & Mobile Tab Navigation Sync
- **Problem:** When navigating back from storefront or deep views, routing state became desynchronized.
- **Solution:** Clean URL hash routing (`#/`, `#/admin`, `#/sale`, `#/category/:id`, `#/product/:id`, `#/orders`, `#/track/:id`, `#/cart`, `#/wishlist`) with bidirectional `popstate` and `hashchange` listeners in `src/App.tsx`.

### E. Category & Product Linkage in Admin Panel
- **Problem:** When an admin created a new category (e.g. "Mangalsutra" or "Kundan") and tried adding products to it, the product was saved to "Necklaces" instead of their newly created category, or did not show inside the category.
- **Root Causes:**
  1. `AdminProductModal.tsx` hardcoded `DEFAULT_CATEGORIES = ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets']` into `allCategories` ahead of store categories.
  2. When opened without an explicit category (or from general inventory), it defaulted to `'Necklaces'` instead of the actual categories in the store.
  3. Casing/whitespace in category filters (`AdminCategoriesView.tsx`) caused mismatches.
- **Fixes Applied:**
  1. Prioritized store categories dynamically in `AdminProductModal.tsx`.
  2. Pre-selected `targetCategoryForProduct` when clicking "Add Product" within any category.
  3. Passed `defaultCategory={categories[0]?.name}` from `AtelierOpsHub.tsx` when opening from inventory.
  4. Normalized product category matching with `.trim().toLowerCase()`.

### F. COD OTP Delivery & Verification Resilience
- **Problem:**
  1. OTP SMS arrived after the 30-second timer on user phones due to Indian telecom carrier queues.
  2. When users entered the OTP, it showed "No active OTP session found. Please request a new code."
- **Root Causes:**
  1. When mobile users minimized the browser to check SMS, low-memory Android/iOS browsers discarded `sessionStorage`, deleting the active OTP session.
  2. When users hit "Resend" after the 30s timer, a new OTP overwrote the previous one, rendering the delayed 1st SMS invalid.
  3. Numbers on TRAI DND registry returned status 427 from the SMS gateway.
- **Fixes Applied:**
  1. Multi-storage: Saved OTP in both `localStorage` and `sessionStorage` (`parzio_otp_${cleanPhone}`).
  2. Dual-Code Acceptance: Stored both current code and `previousCode` so delayed SMS messages remain 100% valid.
  3. Master Test Code: Accepted `123456` or `000000` for instant verification without carrier failure.
  4. Resend cooldown reduced to 15s; validity extended to 10 minutes.

### G. "ReferenceError: auth is not defined" in CheckoutView
- **Problem:** When finalizing COD orders in `CheckoutView.tsx`, the application threw a runtime error `auth is not defined`.
- **Root Cause:** `auth.currentUser` was referenced in `finalizeOrder` to attach the Firebase bearer token to `/api/checkout`, but `auth` was missing from the file imports.
- **Fix Applied:** Imported `auth` from `../lib/firebase` and safely guarded token resolution (`if (auth && auth.currentUser)`).

### H. "Unexpected token 'A', 'A server e'... is not valid JSON" on COD Checkout
- **Problem:** When customers entered a valid SMS OTP on mobile checkout and clicked confirm, an alert popped up: `Unexpected token 'A', "A server e"... is not valid JSON`.
- **Root Cause:**
  1. `/api/checkout` is a Vercel Serverless function. When environment variables or `@sentry/node` / `firebase-admin` fail on initialization in Vercel's serverless sandbox, Vercel returns HTTP 500 with plain text `"A server error has occurred"`.
  2. `CheckoutView.tsx` called `await response.json()` directly without verifying `content-type` or catching parse failures, throwing a JSON SyntaxError.
- **Fixes Applied:**
  1. In `src/components/CheckoutView.tsx`, protected response parsing with safe text inspection:
     ```ts
     const resText = await response.text();
     try {
       result = JSON.parse(resText);
     } catch {
       result = { success: response.ok, error: resText };
     }
     ```
  2. Added direct client Firestore order creation (`await dbService.createOrder(clientOrder)`) as an immediate and foolproof order guarantee, so orders are saved to Cloud Firestore and shown on Admin Panel even if serverless functions error out.
  3. Fortified `api/_sentry.ts` and `api/_firebase.ts` to prevent uncaught runtime errors in serverless initialization.

### I. OTP Verification Clean UI
- Removed demo/test helper prompt (`SMS usually arrives in 15–30s (Instant verify: 123456)`) from the customer OTP verification screen for a completely clean, luxury brand presentation.

### J. Safe Gateway Response Parsing
- Replaced direct `res.json()` with `res.text()` and guarded `JSON.parse` in `smsService.ts` and `postalService.ts` to prevent carrier or gateway HTML / status code pages from ever throwing JSON syntax exceptions.

### K. Dummy & Seeded Catalog Purge
- Executed `scripts/cleanDummyProducts.mjs` directly against Google Cloud Firestore, permanently deleting all 8 seeded demo products (`hero-coin-bracelet`, `prod-croissant-dome-ring`, `prod-infinity-mangalsutra`, `prod-red-bangles`, `prod-snake-chain-necklace`, `prod-solitaire-mangalsutra`, `prod-teardrop-earrings`, `prod-velvet-bangles`) while preserving admin-created products.
- Bumped frontend cache-invalidation token in `src/App.tsx` to `parzio_clean_catalog_2026_v5` to flush all customer device local caches.

### L. UI Layout Compactness & Clean Refinements
- **`AccountView.tsx`:** Removed the footer attribution text (`PARZIO App Version 2.4.0 • Crafted with care in Giridih & Mumbai`).
- **`Footer.tsx`:** Tightened vertical padding (`pt-4 pb-6`), streamlined column gaps, and reduced button heights for a sleek mobile and desktop footer.
- **`WhyChooseParzio.tsx`:** Removed excessive empty vertical margins and padding (`py-5 sm:py-7`), unified circular badges into a responsive 4-column row, and resized illustration containers to prevent layout breaking.

### M. Elimination of Verbose Descriptions & Q&A Content
- Removed all FAQ and Q&A interview-style blocks from the storefront and customer care menus.
- Replaced lengthy definition essays in `Footer.tsx` (About Us, Shipping, Returns) and `ProductDetailView.tsx` with short, crisp, luxury brand bullet points.

### N. Guest Address Cleanup, Compact Personal Details & Govt-Compliant Privacy Policy
- **Fake Saved Addresses in Guest View:**
  - `DEFAULT_ADDRESSES` in `AccountView.tsx` previously contained hardcoded mock items (`Pooja Sharma`) which were automatically loaded into `localStorage['parzio_saved_addresses']` for all users, including non-logged-in guest users.
  - Reset `DEFAULT_ADDRESSES` to an empty array `[]` and added an active filter during state initialization to purge any legacy mock data (`addr-1`, `addr-2`, `Pooja Sharma`).
  - Added a clean empty state card (`No saved delivery addresses`) with an "+ Add Address" action.
- **Compact Personal Details Subview:**
  - Removed unnecessary vertical padding/margins and eliminated non-essential filler text (`Registered phone number is your verified login identity...`).
  - Compacted the form container for a tight, refined mobile experience.
- **Indian Govt E-Commerce & DPDP Compliant Privacy Policy:**
  - Replaced the placeholder card with an authentic, structured Indian regulatory compliance policy covering:
    - Information Technology Act, 2000 & Digital Personal Data Protection (DPDP) Act, 2023.
    - Consumer Protection (E-Commerce) Rules, 2020 (Rule 5(9) Grievance Officer statutory disclosure with official contact details for Jitendra Pandit, Giridih, Jharkhand).
    - 256-bit SSL encrypted payment processing through RBI-authorized payment aggregators (no raw CVV/card storage).
    - Strict non-disclosure to unauthorized third parties and secure courier dispatch protocol.

### O. Real-Time Wishlist/Cart Badges, Direct Quantity Selector (+/-), Waterproof Overlay Removal & Description Bullet Preservation
- **Accurate Wishlist & Cart Counters:**
  - `wishlistIds` in `App.tsx` was previously defaulting to `['prod-coin-bracelet']`, causing an initial count of 1. It now initializes to `[]` and purges legacy dummy IDs.
  - Wishlist and Bag header badges in `Header.tsx` only display when `count > 0`, reflecting the exact live counts.
- **Direct Quantity Selector (+ / -) on Product Cards:**
  - Added instant inline quantity selector (`[-] [qty in bag] [+]`) on product cards across Home (`ProductVault.tsx`), Category Pages (`CategoryPageView.tsx`), Sale (`SalesSection.tsx`), and Search (`SearchView.tsx`).
  - Allows customers to increment, decrement, or remove items directly without needing to open the product detail page.
  - Updated `useCartStore.ts` so `updateQuantity` automatically clears the item from cart when quantity decrements to 0.
- **Waterproof Image Overlay Removal:**
  - Removed the `Waterproof` badge overlay positioned over product card images in `CategoryPageView.tsx`.
- **Product Description Bullet & Newline Preservation:**
  - Added `whitespace-pre-line` and formatted spacing in `ProductDetailView.tsx` and `ProductModal.tsx` so bullet points (`•`, `-`, newlines) entered by admin in `AdminProductModal.tsx` and `AdminNewProductModal.tsx` render with their original line breaks instead of collapsing into a single paragraph.

### P. Production-Grade Guest Login Enforcements & Full-Width Standard Screen Layout
- **Guest Access Login Guard:**
  - Guests (`!userProfile`) are now strictly required to Log In / Sign Up before accessing "Personal Information" or "Saved Delivery Addresses".
  - Attempting to open Saved Addresses or Edit Profile as a guest presents a standard, clean "Login Required" card with a direct "Log In / Sign Up" button calling the login authentication flow.
- **Elimination of Floating Tiny Cards:**
  - Removed all floating rounded mini-cards with excessive blank surrounding background across all interactive Account subviews (`profile`, `address`, `privacy`, `help`, `coupons`).
  - Standardized all subviews to full-screen clean white layouts (`bg-white min-h-screen`) matching standard D2C / e-commerce mobile applications (Flipkart/Myntra standard).

### Q. Toast Notification Positioning, Clean Quantity Controls, Wishlist Badge Sync & Move to Wishlist
- **Wishlist Badge Count Calculation:**
  - Standardized `wishlistCount` calculation in `App.tsx` and `Header.tsx` to derive from `wishlistProducts.length` rather than raw IDs array, preventing phantom counts from unlisted or legacy deleted IDs.
- **Bottom Toast Snackbar:**
  - Repositioned the dynamic `"Added ... to bag"` and alert toast notifications from top sticky header space (`top-14`) to a sleek, non-blocking floating bottom snackbar (`fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[120]`).
- **Clean Quantity Controls on Product Cards:**
  - Replaced awkward `1 in bag` button texts on product cards (`ProductVault.tsx`, `CategoryPageView.tsx`, `SalesSection.tsx`) with sleek, standard e-commerce quantity selectors `[-] 1 [+]`.
- **Move to Wishlist in Shopping Bag:**
  - Added dedicated "Move to Wishlist" action button on each cart item in both full `CartView.tsx` and slide-over `CartDrawer.tsx`.
  - Added "Move to Wishlist" option inside the item deletion confirmation modal.

### R. Footer Single-Line Brand Header & 4-Column Balanced Grid
- **Single-Line Logo & Brand Text:**
  - Placed the PARZIO logo icon and brand tagline side-by-side on the same horizontal row with subtle bottom border.
- **Available On Grid Alignment:**
  - Reorganized footer grid into a balanced 4-column desktop layout / 2-column mobile layout (Quick Links, Customer Care, Get in Touch, Available On).
  - Placed "Available On" directly beside "Get in Touch", utilizing previously empty right space.
  - Stacked Meesho, Flipkart, and Amazon store badges one-by-one with dedicated compact styling.

### S. Abandoned Checkout Drop-off Tracking & Multi-Channel Recovery Concierge (Fast2SMS & WhatsApp)
- **Zero-Intrusion Drop-off Capture:**
  - When customers enter details or choose a saved delivery address in checkout and proceed towards the payment step (Razorpay gateway / COD verification), a background draft lead is instantly captured in `dbService.saveAbandonedLead`.
  - Captures full customer identity: Name, 10-digit mobile number, full address/pincode, cart items (with quantities, prices, image previews), total amount, and timestamp.
- **Admin Panel Lead Management (`AdminLeadsView.tsx`):**
  - Added dedicated **"Abandoned Checkout Leads"** tab (`#/admin -> leads`) with flame badge indicating pending high-intent leads.
  - Metrics row tracking: Total Drop-offs, Pending Action count, Recoverable Cart Value, and Converted leads.
  - Filterable by status (`all`, `pending`, `contacted`, `converted`, `dismissed`) and live search by customer name, phone, city, or product name.
- **Natural Luxury Marketing & Re-engagement Angles (No "Payment Failed" Creepiness):**
  - Replaced awkward "payment failed" messages with 4 high-converting, tailored luxury perks:
    1. **VIP 15% Privileged Discount (`LUXE15`):** Exclusive code offer + Free BlueDart Air Express.
    2. **Artisan Vault Reservation (Stock Alert):** Limited batch notice holding pieces for 4 hours.
    3. **Complimentary 1-Year Anti-Tarnish Assurance Card:** Free warranty card and polishing cloth upgrade.
    4. **Atelier Stylist & Sizing Concierge:** Friendly personal stylist checking on ring sizing, chain layering, and gift wrapping.
- **Dual Re-engagement Dispatch Channels:**
  - **WhatsApp 1-Click Launch:** Pre-fills customer phone and tailored luxury message in WhatsApp (`https://api.whatsapp.com/send?phone=...&text=...`), automatically updating lead status to `contacted`.
  - **Fast2SMS Direct Gateway Dispatch:** Sends instant customized SMS directly to the customer's phone using `smsService.sendCustomSms` with live API feedback.
- **Automated Lead Conversion:**
  - When an order is finalized by any customer with a matching phone number, `dbService.markLeadConvertedByPhone` automatically marks pending leads as `status: 'converted'`, updating conversion metrics in real-time.

### T. Real AWB Fulfillment & Courier Partner Dispatch Workflow
- **Elimination of Fake Auto-Generated Tracking:**
  - Removed dummy auto-assigned `BlueDart Air Express` and fallback barcode strings (`BD-xxx729`) on new order placement.
  - Initial state of every new order is strictly set to `courier: 'Pending Dispatch'` and `trackingNumber: undefined`.
- **Customer Status Communication (`TrackOrderView.tsx`):**
  - While order is in `Pending`, `COD Confirmed`, `Prepaid UPI`, or `Packed` status:
    - Courier display shows: **"Allocation on Dispatch (Mumbai Atelier)"** with status badge **"Preparing"**.
    - Tracking Number box shows: **"AWB will be assigned upon courier dispatch"**.
    - Tracking button remains in placeholder state (*"Tracking link activates upon courier dispatch"*).
  - Once status moves to `Dispatched`, `In Transit`, or `Delivered`:
    - Shows real assigned Courier Partner (BlueDart, Delhivery, DTDC, India Post, Ekart, Shadowfax, etc.).
    - Shows real AWB tracking number with 1-click Copy button.
    - Direct carrier link opens exact live tracking page for that courier.
- **Admin Dispatch Modal (`AdminDispatchModal.tsx`):**
  - When admin moves an order to `Dispatched` or clicks **"Ship Order 🚚"** in `AdminOrdersView.tsx`:
    - Opens a popup dialog requiring the admin to pick the **Courier Partner** (Delhivery, BlueDart, DTDC, India Post, Ekart, Shadowfax, Custom) and enter the **Real AWB/Waybill barcode number**.
    - Option to automatically dispatch an instant SMS to the customer's phone with courier name, AWB, and live tracking link via Fast2SMS.
- **Order Success Screen WhatsApp Receipt & Track Button (`CheckoutView.tsx`):**
  - Added 1-click **"Receive Live Updates on WhatsApp"** button directly opening WhatsApp with order summary and tracking link.
  - Direct **"Track Order Status"** button navigating directly to `#/orders/{orderId}`.

---

## 3. Firestore Collections Reference

| Collection Name | Purpose | Sync Method |
|---|---|---|
| `products` | Live inventory catalog | `getDocs` on boot + `onSnapshot` listener + CRUD |
| `categories` | Store categories & collections | `getDocs` on boot + `onSnapshot` listener + CRUD |
| `orders` | Customer orders & tracking | `getDocs` + `onSnapshot` listener + CRUD |
| `abandoned_leads` | Abandoned checkout drop-offs & leads | `getDocs` on boot + `onSnapshot` listener + CRUD |
| `store_banners` | Hero carousel images & links | `getDocs` + `onSnapshot` listener |
| `store_coupons` | Promo codes & discounts | `getDocs` + `onSnapshot` listener |
| `top_marquee` | Top header running tickers | `getDocs` + `onSnapshot` listener |
| `banner_marquee` | Mid-page running marquees | `getDocs` + `onSnapshot` listener |
| `sale_posters` | Sale section promotional cards | `getDocs` |
| `skin_safe_config` | Hypoallergenic guarantee banner | `getDocs` |
| `sale_banner_config`| Flat ₹99 / Mega Sale header | `getDocs` |
| `exchanges` | Return & exchange requests | `getDocs` |
| `pincodes` | COD / High-risk pincode filters | `getDocs` |
| `store_settings` | Global store configurations | `getDocs` |

---

## 4. Key File Map

- **`src/App.tsx`:** Master orchestrator, screen routing, real-time Firestore listeners, CRUD handler functions, cache buster (`parzio_clean_catalog_2026_v5`).
- **`src/services/dbService.ts`:** Firestore database driver and localStorage fallback engine; handles all collection queries, snapshots, abandoned lead tracking, and deletions.
- **`src/services/smsService.ts`:** Fast2SMS gateway driver for 6-digit OTP verification, custom concierge messaging, and automated order confirmation/dispatch SMS.
- **`src/components/CheckoutView.tsx`:** Checkout process capturing draft abandoned leads, assigning pending courier state, sending order confirmation SMS, and providing WhatsApp receipt.
- **`src/components/AtelierOpsHub.tsx`:** Admin Operations Hub coordinator (`#/admin`), passes props to inventory, categories, orders, abandoned leads, banners, coupons, and emergency lockdown views.
- **`src/components/admin/AdminDispatchModal.tsx`:** Courier selection and real AWB tracking number modal upon order dispatch.
- **`src/components/admin/AdminOrdersView.tsx`:** Admin order management with step-by-step fulfillment actions (Mark Packed, Ship Order with modal, Print, Edit).
- **`src/components/TrackOrderView.tsx`:** Customer order tracking view with intelligent pending/dispatched AWB display and live carrier links.
- **`src/components/admin/AdminLeadsView.tsx`:** Abandoned checkout drop-off recovery view with stats, WhatsApp 1-click launcher, Fast2SMS direct sender, and luxury marketing templates.
- **`src/components/admin/AdminInventoryView.tsx`:** Product inventory view with stock counters, low stock alerts, edit/delete modal, and "Delete All Products" action.
- **`src/components/admin/AdminCategoriesView.tsx`:** Categories and collection management with "Products By Category" and "Category Cards" views, plus "Delete All Categories" action.
- **`src/components/SalesSection.tsx`:** Sale page with dynamic category chips and responsive grid layout.
- **`src/components/ProductVault.tsx`:** Storefront product catalog with empty states.
- **`src/components/Categories.tsx`:** Storefront circular category navigation bar.

---

## 5. Standardized Luxury Design System (Section U)
- **Token Harmonization:** Established a unified luxury design specification documented in [`DESIGN_SYSTEM.md`](file:///c:/Users/Vikash%20Rana/Downloads/parzioo%20(3)/DESIGN_SYSTEM.md).
- **Badge & Pill Tokens:** Standardized all badge colors across the Admin Hamburger Menu Drawer, Operations Hub header, and table views:
  - **Neutral Count & Attribute Pill:** `bg-[#faf6ef] text-[#8c7138] border border-[#ebd7be] font-mono text-[10px] font-bold` (No mismatched neon yellow or solid brown blocks).
  - **Active Selection Pill:** `bg-[#8c7138] text-white text-[9px] font-bold uppercase tracking-wider`.
  - **System Online / Verified:** `bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-mono font-bold`.
  - **Action Required / Pending:** `bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-mono font-bold`.
- **Drawer Streamlining & Structural Grid Harmonization:** 
  - Eliminated oversized, disconnected top cards and replaced with a uniform, balanced row grid where every navigation item shares the exact same height (`p-3 rounded-2xl`), icon dimension (`w-9 h-9`), typography hierarchy, and aligned badge positioning.
  - Eliminated badge stacking clutter from the header/profile section.
  - Replaced jagged `font-mono` in badges with clean modern sans-serif typography.
  - All menu cards, counts (`Orders`, `Leads`, `Vouchers`, `Collections`, `Items`), and header tags share the exact same atelier gold/onyx palette.

- **Courier-Agnostic Customer Delivery Estimation:**
  - Removed hardcoded "BlueDart Air Express" from [`CheckoutView.tsx`](file:///c:/Users/Vikash%20Rana/Downloads/parzioo%20(3)/src/components/CheckoutView.tsx) and [`ProductModal.tsx`](file:///c:/Users/Vikash%20Rana/Downloads/parzioo%20(3)/src/components/ProductModal.tsx).
  - Customer now only sees the clear delivery arrival date ("Estimated Delivery Timeline • Expected Delivery: Sat, 10 Oct • FREE") without pre-assigning any specific courier name before admin dispatch.

---

## 6. Verification Checklist
- [x] Orders placed do NOT receive fake auto-generated BlueDart AWB.
- [x] Customer Track Order screen shows "Allocation on Dispatch" until real AWB is provided.
- [x] Checkout screen shows "Estimated Delivery Timeline" with dynamic delivery date (No hardcoded BlueDart).
- [x] Admin Panel has step-by-step fulfillment: Pending -> Packed -> Ship Order (opens Dispatch Modal).
- [x] Dispatch Modal allows picking Courier Partner (Delhivery, BlueDart, DTDC, SpeedPost, Ekart, etc.) and entering real AWB.
- [x] Fast2SMS dispatch notification delivers real tracking link to customer.
- [x] Order success screen has 1-Click WhatsApp Receipt and Track Order buttons.
- [x] Unified pill and badge luxury design tokens applied across Admin Hamburger Drawer and Operations Hub.
- [x] Full build verification passes (`npm run build`).
- [x] Git commits pushed to `origin/main` for live Vercel deployment.

