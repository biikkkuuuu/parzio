# PARZIO — Second-Pass Security & Production Verification

**Audit Date**: 2026-09-17  
**Auditor**: Senior Full-Stack / Production Engineer  
**Status**: VERIFICATION COMPLETED (Awaiting Approval for Phase 21: Deep Hardening)  

---

## Executive Summary
The initial production audit addressed UI-level protections, localized rate-limiting, and client-side logic. However, a deep second-pass verification confirms that **Parzio is fundamentally vulnerable at the architectural level**. Because the application relies entirely on client-side logic paired with an unsecured Firestore database (`allow read, write;`), almost all client-side protections can be bypassed by an attacker interacting directly with the Firestore REST API or SDK. Furthermore, Vite's environment variable system (`VITE_*`) statically injects secrets into the client bundle, meaning the Fast2SMS API key is still exposed.

---

## Verification Matrix

### 1. UPI/UTR Verification
* **Claim**: Can an unpaid user create a confirmed/paid order?
* **Status**: **VULNERABLE**
* **Evidence**: While the UI now requires a UTR and sets the status to "Pending Verification", an attacker can bypass `CheckoutModal.tsx` entirely. By executing `firebase.firestore().collection('orders').add({ status: 'COD Confirmed', ... })` in the browser console, a malicious user can instantly create a confirmed order without any UTR or payment.
* **Affected Area**: Firestore `orders` collection.
* **Recommended Fix**: Implement strict Firestore Security Rules that require orders to be created with specific statuses, and only allow Admins to change statuses. Alternatively, move order creation to a secure backend endpoint (e.g., Firebase Cloud Functions or Vercel Serverless Functions).

### 2. Inventory System
* **Claim**: Determine whether Firestore transaction/atomic operation prevents overselling.
* **Status**: **NOT VERIFIED (VULNERABLE)**
* **Evidence**: The inventory decrement logic in `dbService.ts` (`updateDoc`) is executed sequentially on the client-side. There is no atomic `runTransaction` or `FieldValue.increment(-quantity)`. If two users checkout simultaneously for the last item, both clients will read `stock: 1`, and both will write `stock: 0`, resulting in a successful checkout for both (overselling).
* **Affected Area**: `dbService.createOrder` / Firestore `products` collection.
* **Recommended Fix**: Use `FieldValue.increment(-quantity)` with Firestore Security Rules ensuring `stock >= 0`, or handle checkout atomically via a Cloud Function.

### 3. Admin Panel Security
* **Claim**: Verify admin authorization at backend/database security-rule level, not only UI level.
* **Status**: **VULNERABLE**
* **Evidence**: The UI correctly checks `onAuthStateChanged` and `sessionStorage`. However, the underlying Firestore database is in "Test Mode" (`allow read, write;`). Any user (even an anonymous one or a customer who logged in via SMS) can bypass the admin UI entirely and read/modify the entire database directly via the Firestore SDK in the DevTools console.
* **Affected Area**: Firestore Security Rules (`firestore.rules`).
* **Recommended Fix**: Lock down Firestore rules. Only users with a specific Admin UID or Custom Claim should be allowed to write to `products`, `categories`, and read all `orders`.

### 4. Fast2SMS API Key
* **Claim**: Determine whether VITE_FAST2SMS_API_KEY is exposed to the browser.
* **Status**: **VULNERABLE**
* **Evidence**: The Vite bundler statically replaces `import.meta.env.VITE_FAST2SMS_API_KEY` with its string value during the build process (`bun run build`). The plaintext key is compiled directly into the production JavaScript bundle (`dist/assets/index-*.js`). It is fully exposed to the public.
* **Affected Area**: `src/components/UserLoginModal.tsx` & Vite Build System.
* **Recommended Fix**: Remove the key from the client application entirely. Create a Vercel Serverless API Route (e.g., `/api/send-otp`) that securely reads `process.env.FAST2SMS_API_KEY` on the server and makes the request to Fast2SMS.

### 5. Client Price & Order Manipulation
* **Claim**: Verify server-side price calculation cannot be bypassed. Try modifying another user's order ID.
* **Status**: **VULNERABLE**
* **Evidence**: Because Firestore rules are completely open, a malicious user can write any price they want into an order document via the Firestore SDK. Furthermore, because there are no row-level security rules, a user can query `collection('orders')` and read, modify, or delete *every other customer's orders, addresses, and phone numbers*.
* **Affected Area**: Firestore Security Rules (`firestore.rules`).
* **Recommended Fix**: Implement Row-Level Security (RLS) in Firestore Rules:
  - Users can only `create` orders where `request.auth.uid == request.resource.data.userId`.
  - Users can only `read` their own orders.
  - Users cannot update/delete orders after creation.
  - Price verification must be handled by a secure backend function, or Firestore rules must enforce price matching (complex).

---

## Conclusion & Next Steps

The frontend UI protections added in Phase 1 are good for standard UX and deterring casual abuse, but they provide **zero security against intentional exploitation** due to the open nature of the Firestore database and the client-side execution environment.

### Recommended Execution Plan (Phase 21):
1. **Firestore Security Rules**: Draft and deploy a strict `firestore.rules` file to lock down read/write access.
2. **Serverless API for Fast2SMS**: Move SMS OTP generation to a secure Vercel API route (`/api/send-otp.ts` or `api/fast2sms.js`) to hide the API key.
3. **Atomic Inventory**: Refactor `dbService.ts` to use Firestore transactions or `FieldValue.increment` combined with security rules to prevent overselling.
4. **Order Integrity**: Bind Firebase Auth UIDs to orders and restrict order reading/writing strictly to the owner and admins.
