# PARZIO Demi-Fine Jewellery — Project Context & Architecture Guide

Welcome to the **PARZIO Demi-Fine Jewellery** application codebase. This document provides a comprehensive architectural and functional overview for developers, AI assistants, and maintainers.

---

## 🚀 1. Overview & Purpose
**PARZIO** is an elite, high-conversion e-commerce web application specializing in 18K gold-finished anti-tarnish demi-fine jewellery. It features:
- **Dual Storefront Experience**: Fully responsive Mobile App view (framed with device mockup toggle) and full-screen PC Desktop storefront.
- **The ₹99 Anti-Tarnish Vault**: Curated collections (Necklaces, Earrings, Rings, Bracelets, Anklets, Minimalist Designs, Charms, Best Sellers).
- **Atelier Operations Hub (Admin Panel)**: Full production operations suite including sales analytics, customer order management with status updates and invoice printing, live stock/inventory management, RTO/COD safety shields, exchange & return tracking, discount coupons, emergency storefront shutdown, and **Dynamic Banners & Marquee Manager**.
- **Continuous Right-to-Left Marquee Tickers**: Dynamic RTL scrolling banners in both the header and hero sections.

---

## 🛠️ 2. Tech Stack
- **Frontend**: React 18+ with TypeScript, Vite.
- **Styling**: Tailwind CSS (with custom warm luxury palette: `#fbf9f6` canvas, `#8c7138` gold, `#fed488` highlights, `#141414` onyx, `#eae5dc` borders).
- **Animations**: `motion/react` and custom CSS keyframe animations (`marquee-rtl`).
- **Icons**: `lucide-react`.

---

## 📁 3. Project Structure
- `/src/App.tsx`: Main application root containing routing between storefront and admin ops, responsive mode switches, cart/wishlist state, and localStorage persistence for custom banners/marquees.
- `/src/types.ts`: Shared TypeScript interfaces (`Product`, `OrderItem`, `StoreBanner`, `MarqueeItem`, `EmergencyShutdownConfig`, `AdminTab`).
- `/src/data/`:
  - `products.ts`: Vault products catalogue.
  - `orders.ts`: Seeded customer orders.
  - `bannerData.ts`: Initial marquee announcements and hero banners.
- `/src/components/`:
  - `Header.tsx`, `MobileHeader.tsx`: Navigation bars with integrated RTL marquee ticker.
  - `HeroBanner.tsx`: Dynamic banner carousel with promotional marquee.
  - `ProductVault.tsx`, `ProductModal.tsx`: Catalog browsing and interactive product views.
  - `AtelierOpsHub.tsx`: Master administrative dashboard container.
  - `/admin/`: Individual admin modules (`AdminAnalyticsView`, `AdminOrdersView`, `AdminInventoryView`, `AdminBannersView`, `AdminInvoiceModal`, etc.).

---

## 📦 4. How to Export as ZIP
To download/export this project as a ZIP archive:
1. Open the **Settings / Menu** dropdown in the top right corner of the Google AI Studio Build interface.
2. Click on **"Export to GitHub"** or **"Download ZIP"**.
3. Save the generated `.zip` file to your local computer.
