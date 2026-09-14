# PARZIO Demi-Fine Jewellery — Design & UX System

Welcome to the **PARZIO** design and user experience specification document. This guide details the visual identity, typography, color tokens, layout archetypes, and micro-interactions used across the application.

---

## 🎨 1. Visual Identity & Theme Philosophy
PARZIO adopts a **Warm Luxury Atelier** aesthetic, designed to evoke premium 18K gold-finished demi-fine jewellery without relying on generic AI templates.

- **Color Palette**:
  - **Canvas Background**: `#fbf9f6` (Warm off-white neutral, avoiding stark white `#ffffff`).
  - **Primary Gold**: `#8c7138` (Sophisticated satin gold).
  - **Highlight / Accent**: `#fed488` (Warm gold glow).
  - **Onyx Text & UI**: `#141414` (Deep luxury charcoal/black).
  - **Borders & Separators**: `#eae5dc` (Subtle warm stone gray).

- **Anti-Slop Guidelines Adhered To**:
  - No purple-to-blue gradients or glowing neon cyan drop-shadows.
  - Generous negative space and mathematical padding ratios.
  - Strict corner-radius capping (12px–16px standard container rounding).

---

## ✍️ 2. Typography Hierarchy
- **Headings & Display**: *Playfair Display* (Serif display typeface providing high-end editorial elegance).
- **Body & UI**: *Plus Jakarta Sans* (Clean, highly legible geometric sans-serif for prices, badges, and body text).
- **Scale**: Proportional fluid typography scale with consistent line heights (`1.5` to `1.7`) ensuring WCAG AA contrast compliance.

---

## 📱 3. Responsive Layout Archetypes
1. **Mobile Viewport Shell**:
   - Framed within a simulated mobile device container with a status bar.
   - Fixed top header and pinned bottom navigation bar (`Home`, `Sale`, `Track`, `Exchange`, `Account`).
   - Smooth vertical scrolling with `overscroll-contain`.
2. **PC Desktop Storefront**:
   - Full-width responsive container (`max-w-7xl`).
   - Rich multi-column product grids, interactive category filters, and sliding promotional banners.
3. **Atelier Operations Hub (Admin Panel)**:
   - Complete operations suite accessible via toggle.
   - Slide-out hamburger navigation drawer (`AdminHamburgerDrawer`).
   - Modular views for Sales Analytics, Customer Orders, Inventory, and Banners & Marquee.

---

## ✨ 4. Micro-Interactions & Motion
- **Continuous Right-to-Left Marquees**: Seamless infinite scrolling tickers for announcements and promotional banners.
- **Hover Transitions**: Smooth image zoom and shadow elevation on product cards.
- **Toast Notifications**: Floating feedback alerts with custom spring bounce effects (`animate-bounce`).
- **Interactive Modals**: Backdrop blur overlays for search, cart, checkout, product details, and invoice printing.
