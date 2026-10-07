import * as admin from 'firebase-admin';

let isInitialized = false;

try {
  if (admin && !admin.apps?.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      isInitialized = true;
    }
  } else if (admin?.apps?.length) {
    isInitialized = true;
  }
} catch (error) {
  console.warn('Firebase admin initialization optional warning:', error);
}

export const dbAdmin = isInitialized && admin?.apps?.length ? admin.firestore() : null;
export const authAdmin = isInitialized && admin?.apps?.length ? admin.auth() : null;
export const FieldValue = admin?.firestore?.FieldValue || null;
