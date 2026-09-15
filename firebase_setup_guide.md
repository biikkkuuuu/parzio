# Google Firebase Firestore (Pay-As-You-Go) Setup Guide for PARZIO

PARZIO is now fully integrated with **Google Cloud Firebase Firestore** — the industry standard **Pure Pay-As-You-Go (Usage-Based)** database.

---

## 💰 Billing Advantages for PARZIO:
- **Monthly Fixed Charge:** **₹0** (No $25/month mandatory subscription).
- **Daily Free Quota:**
  - **50,000 product reads every single day FREE**.
  - **20,000 orders/writes every single day FREE**.
  - **1 GB storage FREE**.
- **When Exceeded:** Micro-billing only (₹5 per 1,00,000 reads). If 5,000 visitors come in a month, your total monthly cost is **₹0 to ₹20**.

---

## 🛠️ Step-by-Step 3-Minute Setup:

### Step 1: Create a Free Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and log in with your Google account.
2. Click **"Add project"** (or **"Create a project"**).
3. Name it: `parzio-jewellery` (or any name you prefer).
4. Google Analytics: Optional (You can enable or skip). Click **Create Project**.

### Step 2: Create Firestore Database
1. In the left sidebar, click **Build > Firestore Database**.
2. Click **Create Database**.
3. Choose Database location: Select **`asia-south1 (Mumbai)`** for the fastest speed in India.
4. Security Rules: Choose **Start in test mode** (allows read/write during initial launch).
5. Click **Enable**.

### Step 3: Register Web App & Get Keys
1. In the Firebase Project Overview, click the **Web icon (`</>`)** to add an app.
2. App nickname: `parzio-web`. Click **Register app**.
3. Firebase will show your `firebaseConfig` keys:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "parzio-brand.firebaseapp.com",
     projectId: "parzio-brand",
     storageBucket: "parzio-brand.firebasestorage.app",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
4. In your project root, create a file named `.env.local` and paste these values:
   ```env
   VITE_FIREBASE_API_KEY="your-apiKey"
   VITE_FIREBASE_AUTH_DOMAIN="your-authDomain"
   VITE_FIREBASE_PROJECT_ID="your-projectId"
   VITE_FIREBASE_STORAGE_BUCKET="your-storageBucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-messagingSenderId"
   VITE_FIREBASE_APP_ID="your-appId"
   ```

5. Restart your dev server:
   ```bash
   bun run dev
   ```
   **That's it!** All product updates, category additions, promo badges (`NEW LAUNCH`, `BEST SELLER`), and customer orders will instantly sync live to Google Firebase Firestore!
