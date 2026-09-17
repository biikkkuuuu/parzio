# Production Hardening Phase 21 - Completion Report

## 1. Secrets Security (Fast2SMS API Key)
**Problem:** The `VITE_FAST2SMS_API_KEY` was being compiled directly into the client-side bundle in `dist/assets/index-*.js`, exposing it to potential scraping and misuse.
**Solution:**
- Created two Vercel serverless API endpoints: `/api/send-otp` and `/api/verify-otp`.
- Shifted all Fast2SMS API communication strictly to the backend.
- Refactored `UserLoginModal.tsx` and `AdminLogin.tsx` to call these secure APIs. The frontend no longer handles or exposes any secrets.

## 2. Server-Authoritative Checkout & Atomic Inventory
**Problem:** Order prices and stock availability were completely determined client-side in `CheckoutModal.tsx`. A malicious user could alter the DOM/network request to place an order for ₹1 or bypass stock limits.
**Solution:**
- Implemented `/api/checkout` using `firebase-admin`.
- Used Firestore Transactions to achieve **atomic inventory deductions** (preventing overselling).
- The server now recalculates the total price directly from the `products` database during checkout, completely ignoring any price data sent from the client.

## 3. Strict Firestore Security Rules
**Problem:** The Firestore rules were set to `allow read, write;` (Test Mode), meaning anyone with the project ID could read, write, or delete the entire database.
**Solution:**
- Implemented robust `firestore.rules` (see `firestore.rules` file in the root).
- Only authenticated admins can write to catalogs (`products`, `categories`, `coupons`).
- The `orders` collection cannot be created by *any* client directly. Client SDK order creation is now disabled. All new orders must securely pass through the `/api/checkout` backend logic.
- Implemented `signInAnonymously()` for customers, allowing them secure access to read only their own user data and orders using `request.auth.uid`.

## 4. OTP Spam & Brute-Force Protection
**Problem:** The OTP endpoints lacked rate limiting, allowing potential SMS cost exhaustion and brute-forcing of the 6-digit codes.
**Solution:**
- Implemented persistent rate limiting using a new `rate_limits` collection in Firestore.
- **Verification Brute-force Limit:** Maximum 5 incorrect OTP attempts per challenge. The code is invalidated on the 5th attempt.
- **Resend Cooldown:** Users must wait 60 seconds before requesting a new OTP for the same phone number.
- **Daily SMS Limits:** 
  - Max 5 SMS requests per phone number per 24 hours.
  - Max 10 SMS requests per IP address per 24 hours.
- **Security:** The `otps` and `rate_limits` collections are locked down via `firestore.rules` and are only accessible by the serverless Node.js API using `firebase-admin`.

## Deployment Instructions

1. **Deploy Frontend & APIs:**
   Push your changes to Vercel. Vercel will automatically detect the `/api` directory and deploy `send-otp`, `verify-otp`, and `checkout` as secure Node.js Serverless Functions.
   Make sure you have added `FAST2SMS_API_KEY` and `FIREBASE_SERVICE_ACCOUNT` (JSON format) to your Vercel Environment Variables.

2. **Deploy Firestore Rules:**
   Copy the contents of `firestore.rules` and paste them into your Firebase Console:
   `Firebase Console -> Firestore Database -> Rules tab -> Publish`.
   This is critical to lock down the database.

> [!WARNING]
> Do NOT use `VITE_FAST2SMS_API_KEY` in your `.env.local` or Vercel Environment Variables anymore. Ensure it is named **`FAST2SMS_API_KEY`** (without `VITE_`) so Vite does not bundle it!
