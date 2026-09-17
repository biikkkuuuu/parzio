# SECURITY AUDIT - PHASE 21 DEEP HARDENING

## A. Executive Summary
The Phase 21 Hardening has significantly improved the security posture of Parzio by shifting critical logic (OTP and checkout) to server-side Node.js Vercel functions and implementing strict Firestore Rules. However, the audit reveals several critical oversights in the implementation of the checkout API and OTP validation logic that could lead to financial loss, abuse, or bypasses.

## B. Verified Secure Areas
1. **Secrets Management:** `FAST2SMS_API_KEY` is completely removed from the frontend bundle. It is now only utilized server-side.
2. **Database Access Control:** `firestore.rules` is strictly configured. The public cannot read/write arbitrarily. 
3. **Admin Firestore Authorization:** A user spoofing their way into the Admin Panel (via DevTools manipulation of `sessionStorage`) will be blocked by Firestore rules from actually modifying products, updating order statuses, or reading all orders.
4. **Order Creation:** Client SDK cannot create orders directly. All orders are forced through `/api/checkout`.
5. **Atomic Inventory:** The use of `runTransaction` in the backend correctly prevents overselling by atomically reading and updating stock.

## C. Remaining Vulnerabilities
1. **Checkout API Price Manipulation (Negative Quantity):** The `/api/checkout` endpoint does not validate if the requested item quantity is a positive integer. An attacker can send a negative quantity (e.g., `-1`), causing the backend to calculate a negative price (crediting the user) and increasing the stock artificially.
2. **Checkout API Authentication Spoofing:** The `/api/checkout` endpoint blindly trusts the `userId` passed in `req.body` and does not verify the Firebase ID Token using Firebase Admin SDK. An attacker can associate an order with any arbitrary user ID or create spam orders anonymously.
3. **OTP Brute-Forcing & Spam:** The `/api/verify-otp` endpoint does not implement rate limiting or a maximum retry limit. A 6-digit OTP (1,000,000 combinations) with a 5-minute expiry can be brute-forced programmatically. Furthermore, `/api/send-otp` lacks IP rate-limiting, allowing SMS cost exhaustion attacks.
4. **Client-side Admin UI Spoofing:** Any customer who is signed in anonymously can bypass `AdminProtected.tsx` by manually setting `sessionStorage.setItem('parzio_admin_auth', 'true')` in DevTools. While Firestore rules block backend access, the UI will still render.
5. **No Discount/Coupon Server-Side Validation:** The API does not accept or validate coupon codes. If the frontend applies a discount, the server will currently ignore it and charge the full price.

## D. Critical Findings
- **Negative Quantity Abuse:** In `/api/checkout.ts`, `verifiedAmount += liveData.price * requestedItem.quantity;`. If `quantity = -1`, `verifiedAmount` becomes negative.
- **Missing Token Verification:** In `/api/checkout.ts`, the server accepts `req.body.userId` without verifying a Bearer token via Firebase Admin.

## E. Medium/Low Findings
- **OTP Replay:** Once verified, the OTP is deleted, preventing direct replay. However, generating an OTP overwrites any existing OTP for that phone number, potentially disrupting an ongoing login attempt.

## F. Exact File + Function References
- **`api/checkout.ts` (Lines 44-58):** Quantity is read from `requestedItem.quantity` without checking `if (requestedItem.quantity > 0 && Number.isInteger(requestedItem.quantity))`.
- **`api/checkout.ts` (Line 72):** `userId` is directly assigned from `req.body.userId`.
- **`api/verify-otp.ts`:** Missing retry attempt increment/lockout logic.
- **`src/components/admin/AdminProtected.tsx` (Lines 22-26):** `onAuthStateChanged` triggers for anonymous users, and checks a manipulatable `sessionStorage` item.

## G. Recommended Fixes
1. **API Validation:** Add strict validation in `/api/checkout` to ensure `quantity` is a positive integer.
2. **Token Verification:** Require an `Authorization: Bearer <token>` header in `/api/checkout` and use `dbAdmin.auth().verifyIdToken()` to securely resolve the `uid`.
3. **Rate Limiting:** Implement IP/phone-based rate limiting in Vercel Edge Middleware or in the API functions for both `/api/send-otp` and `/api/verify-otp`.
4. **Admin UI Fix:** In `AdminProtected.tsx`, query a secure endpoint or attempt a dummy read of the `admins` collection to verify true admin capability before rendering the dashboard.

## H. Manual Firebase/Vercel Deployment Checks
- Ensure `FIREBASE_SERVICE_ACCOUNT` is properly formatted as a JSON string in Vercel.
- Deploy `firestore.rules` to Firebase Console.

## I. Final Production Readiness Checklist
- [ ] Fix Negative Quantity Vulnerability
- [ ] Implement Server-Side Token Verification for Checkout
- [ ] Implement Rate Limiting on OTP Endpoints
- [ ] Secure Admin UI Component
- [ ] Implement robust error handling on the client for API errors

---
### Answers to Questions:

1. **Can an unauthenticated attacker create an order?**
   Yes. The `/api/checkout` endpoint does not require authentication headers and blindly trusts the payload.
2. **Can one customer access another customer's order?**
   No. Firestore rules strictly prevent this: `allow read: if isAdmin() || (isAuthenticated() && resource.data.userId == request.auth.uid);`.
3. **Can a customer manipulate product price?**
   No. The API calculates the price server-side directly from `liveData.price`. However, they can manipulate the *Total* by sending a negative quantity.
4. **Can a customer manipulate inventory?**
   Yes. By sending negative quantities in checkout, they can artificially increase inventory.
5. **Can a customer mark an order as paid/verified?**
   No. Order updates are blocked by Firestore rules `allow update: if isAdmin();`.
6. **Can a customer impersonate an admin?**
   UI Impersonation: Yes (via `sessionStorage`). Database Impersonation: No (protected by Firestore rules).
7. **Can Fast2SMS API key be extracted from the frontend bundle?**
   No. It has been completely moved to the secure backend.
8. **Can two concurrent customers purchase the last available item?**
   No. Firestore Transactions in `/api/checkout.ts` handle concurrent atomic deductions perfectly.
9. **Can checkout totals be manipulated?**
   Yes. Due to the lack of quantity validation (negative quantities).
10. **Is any Firestore collection still publicly writable?**
    No. All collections require admin status to write, except `users` which securely requires the user to own their document.
