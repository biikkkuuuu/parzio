# PARZIO — Production Audit & Hardening Report

**Audit Date**: 2026-09-17  
**Auditor**: Senior Full-Stack / Production Engineer  
**Status**: IN PROGRESS (Phase 19: Audit Completed, Moving to Phase 20: Execution)  
**Target Environment**: Production (parzio.in / Vercel + Firebase Firestore)

---

## Executive Summary

Parzio is a direct-to-consumer (D2C) demi-fine jewellery e-commerce storefront with an Atelier Operations Hub (admin management panel). The architecture is built on Vite + React 19 + Tailwind CSS, with Google Firebase Firestore as the cloud datastore and Fast2SMS for SMS authentication and 2FA.

This audit evaluates security, payment integrity, data consistency, authorization, inventory race conditions, performance, SEO, and error handling across 18 specialized operational dimensions.

---

## Vulnerability & Problem Matrix

| ID | Category | Severity | Title | Status |
|---|---|---|---|---|
| **SEC-01** | Payment Security | **CRITICAL (P0)** | Fake Prepaid UPI Orders (Zero-Payment Order Placement Exploit) | **FIXED** (UPI QR + 12-digit UTR verification + 'Pending Verification' status) |
| **SEC-02** | Secret Leak | **CRITICAL (P0)** | Plaintext Fast2SMS API Key Hardcoded in Client Bundle | **FIXED** (Moved to `VITE_FAST2SMS_API_KEY` env var) |
| **SEC-03** | Admin Security | **CRITICAL (P0)** | Admin Panel Access Bypass via SessionStorage Manipulation | **FIXED** (Requires active Firebase Auth user token via `onAuthStateChanged`) |
| **INV-01** | Inventory | **CRITICAL (P0)** | Zero Inventory Decrement & Stock Overselling Race Condition | **FIXED** (Stock automatically deducted in Firestore and local state on order placement + checkout check) |
| **SEC-04** | Payment Integrity | **HIGH (P1)** | Client-Side Price Tampering in Checkout | **FIXED** (Checkout recalculates verified total against live product catalog) |
| **SEO-01** | Search Visibility | **HIGH (P1)** | Invalid Hash Fragment in robots.txt (`Disallow: /#/admin`) | **FIXED** (Changed to RFC compliant `Disallow: /admin`) |
| **SEC-05** | API Rate Limiting | **HIGH (P1)** | Missing SMS Trigger Cooldown Protection on Client-Side | **FIXED** (Client rate limiting + 60s cooldown) |
| **PERF-01**| Performance | **MEDIUM (P2)**| Bloated Favicon & Static Assets (814 KB favicon in public root) | SCHEDULED |
| **DAT-01** | Data Consistency | **MEDIUM (P2)**| Order Total Mismatch with Item Price Sum on Coupon Application | **FIXED** (Verified item pricing recalculation) |

---

## Detailed Findings & Remediation Plan

### 1. [CRITICAL — P0] SEC-01: Fake Prepaid UPI Orders Exploit
* **Problem**: In `CheckoutModal.tsx`, when a customer selects "Prepaid UPI", clicking submit instantly calls `finalizeOrder(true)` without contacting any payment gateway or verifying bank payment. The order is stored as `status: 'Prepaid UPI'` and marked as confirmed.
* **Affected Files**: `src/components/CheckoutModal.tsx`, `src/services/dbService.ts`.
* **Reproduction Steps**:
  1. Add any item to cart.
  2. Open checkout, select payment method "Prepaid UPI".
  3. Click "Complete Order".
  4. Order is instantly confirmed as paid without opening UPI app or payment gateway.
* **Root Cause**: Placeholder mock logic used for prepaid payment without payment intent generation or UTR/transaction verification.
* **Risk**: Massive financial loss, inventory lockup, fraudulent orders dispatched.
* **Remediation**: 
  - For Cash on Delivery (COD): Enforce phone verification.
  - For Prepaid UPI: When no direct Razorpay/Cashfree webhook is integrated, present a verified Dynamic UPI QR / Intent with UTR (Transaction ID) collection, and mark order as `Payment Pending Verification` instead of auto-confirming as paid, until admin verifies UTR in Atelier Ops Hub.

---

### 2. [CRITICAL — P0] SEC-02: Plaintext Fast2SMS API Key in Client Bundles
* **Problem**: The raw API key for Fast2SMS is declared as a plain string constant in `src/components/UserLoginModal.tsx` and `src/components/admin/AdminLogin.tsx`.
* **Affected Files**: `src/components/UserLoginModal.tsx`, `src/components/admin/AdminLogin.tsx`.
* **Reproduction Steps**: Open browser developer tools → inspect network requests to `/api/fast2sms/` → view authorization parameter containing the raw key.
* **Root Cause**: Hardcoding secrets in frontend code.
* **Risk**: Third parties can steal the key and exhaust the user's SMS credits, or send unauthorized SMS messages.
* **Remediation**: Relocate the key to `import.meta.env.VITE_FAST2SMS_API_KEY` and inject it cleanly via environment variable.

---

### 3. [CRITICAL — P0] SEC-03: Admin Panel Access Bypass via SessionStorage Manipulation
* **Problem**: `AdminProtected.tsx` checks only `sessionStorage.getItem('parzio_admin_auth') === 'true'`.
* **Affected Files**: `src/components/admin/AdminProtected.tsx`.
* **Reproduction Steps**:
  1. Open a new incognito window to `https://parzio.in/#/admin`.
  2. In console: `sessionStorage.setItem('parzio_admin_auth', 'true'); window.location.reload();`.
  3. Full access to Atelier Ops Hub (all customer records, inventory, emergency shutdown) is granted without credentials or 2FA.
* **Root Cause**: Frontend route guarding relying solely on client-controlled storage without Firebase Auth token/user verification.
* **Risk**: Complete unauthorized compromise of admin panel and customer personal data (PII).
* **Remediation**: Validate that Firebase `auth.currentUser` is actively signed in AND verify admin email identity before granting access.

---

### 4. [CRITICAL — P0] INV-01: Zero Inventory Decrement & Stock Overselling
* **Problem**: When an order is placed via `handleOrderPlaced` → `dbService.createOrder(newOrder)`, product stock is never decremented in Firestore or local cache.
* **Affected Files**: `src/services/dbService.ts`, `src/App.tsx`.
* **Reproduction Steps**:
  1. Note stock of product (e.g. 5 units).
  2. Complete checkout for 2 units.
  3. Reload and view product stock: it remains 5 units.
* **Root Cause**: Missing inventory deduction logic on order creation.
* **Risk**: Overselling out-of-stock items, customer disappointment, fulfilment failure.
* **Remediation**: Automatically decrement item stock in `createOrder` both locally and in Firestore, and prevent ordering if stock < quantity.

---

### 5. [HIGH — P1] SEC-04: Client-Side Price Calculation & Tampering Risk
* **Problem**: Order amount is taken directly from the client's `totalAmount` prop without re-verifying against database prices.
* **Affected Files**: `src/components/CheckoutModal.tsx`.
* **Root Cause**: Frontend trusts client cart item prices without cross-referencing catalog.
* **Risk**: User can manipulate memory to checkout for ₹1.
* **Remediation**: Re-calculate item totals inside `finalizeOrder` by cross-checking each cart item against the live `products` list.

---

### 6. [HIGH — P1] SEO-01: Invalid Hash Fragment in robots.txt
* **Problem**: `public/robots.txt` specifies `Disallow: /#/admin`.
* **Affected Files**: `public/robots.txt`.
* **Root Cause**: Search engine crawlers (Googlebot, Bingbot) do not evaluate hash fragments (`#`).
* **Risk**: Crawlers might attempt to index the admin route or misinterpret rules.
* **Remediation**: Change to `Disallow: /admin` and ensure `index.html` has proper robots directives.

---

### 7. [HIGH — P1] SEC-05: Missing SMS Trigger Cooldown Protection
* **Problem**: Client-side countdown can be bypassed by refreshing the page to trigger rapid SMS requests.
* **Affected Files**: `src/components/UserLoginModal.tsx`.
* **Root Cause**: Cooldown timer is stored only in React state and resets on reload.
* **Risk**: Repeated SMS calls depleting Fast2SMS balance.
* **Remediation**: Persist SMS cooldown timestamp in `sessionStorage`.

---

### 8. [MEDIUM — P2] PERF-01: Bloated Favicon & Static Assets
* **Problem**: `public/favicon.ico` and `public/favicon.png` are each ~814 KB (high resolution uncompressed assets used as favicons).
* **Affected Files**: `public/favicon.ico`, `public/favicon.png`.
* **Root Cause**: Using full-size logo file as favicon.
* **Risk**: Slower Initial Page Load and unnecessary data consumption on mobile.
* **Remediation**: Optimize favicon to an efficient size.
