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

---

## 3. Firestore Collections Reference

| Collection Name | Purpose | Sync Method |
|---|---|---|
| `products` | Live inventory catalog | `getDocs` on boot + `onSnapshot` listener + CRUD |
| `categories` | Store categories & collections | `getDocs` on boot + `onSnapshot` listener + CRUD |
| `orders` | Customer orders & tracking | `getDocs` + `onSnapshot` listener + CRUD |
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

- **`src/App.tsx`:** Master orchestrator, screen routing, real-time Firestore listeners, CRUD handler functions, cache buster (`parzio_clean_catalog_2026_v4`).
- **`src/services/dbService.ts`:** Firestore database driver and localStorage fallback engine; handles all collection queries, snapshots, and deletions.
- **`src/components/AtelierOpsHub.tsx`:** Admin Operations Hub coordinator (`#/admin`), passes props to inventory, categories, orders, banners, coupons, and emergency lockdown views.
- **`src/components/admin/AdminInventoryView.tsx`:** Product inventory view with stock counters, low stock alerts, edit/delete modal, and "Delete All Products" action.
- **`src/components/admin/AdminCategoriesView.tsx`:** Categories and collection management with "Products By Category" and "Category Cards" views, plus "Delete All Categories" action.
- **`src/components/SalesSection.tsx`:** Sale page with dynamic category chips and responsive grid layout.
- **`src/components/ProductVault.tsx`:** Storefront product catalog with empty states.
- **`src/components/Categories.tsx`:** Storefront circular category navigation bar.

---

## 5. Verification Checklist
- [x] Products deleted individually or in bulk disappear from storefront immediately.
- [x] Categories deleted individually or in bulk disappear from storefront immediately.
- [x] Dynamic category chips in `SalesSection` hide when no categories exist.
- [x] Device image uploads compress safely without crashing Chrome.
- [x] Full build verification passes (`bun run build`).
- [x] Git commits pushed to `origin/main` for live Vercel deployment.
