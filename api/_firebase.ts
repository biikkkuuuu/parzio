import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // If FIREBASE_SERVICE_ACCOUNT is provided as a JSON string in Vercel Env
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback for local development if Google Application Default Credentials are set
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const dbAdmin = admin.apps.length ? admin.firestore() : null;
export const authAdmin = admin.apps.length ? admin.auth() : null;
export const FieldValue = admin.firestore.FieldValue;
