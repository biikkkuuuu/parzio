import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Validates if the Firebase configuration has been properly set in environment variables.
 */
export const isFirebaseConfigured = (): boolean => {
  return (
    typeof firebaseConfig.apiKey === 'string' &&
    firebaseConfig.apiKey.trim().length > 0 &&
    !firebaseConfig.apiKey.includes('your-api-key') &&
    typeof firebaseConfig.projectId === 'string' &&
    firebaseConfig.projectId.trim().length > 0 &&
    !firebaseConfig.projectId.includes('your-project-id')
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (e) {
    console.error('Failed to initialize Firebase SDK', e);
  }
}

export { app, db, auth };
