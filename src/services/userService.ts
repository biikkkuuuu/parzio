import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  createdAt?: any;
  lastLogin?: any;
}

export const userService = {
  // Check if a user exists and return their profile
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  // Create or update a user profile
  saveUserProfile: async (uid: string, phone: string, name: string): Promise<boolean> => {
    if (!db) return false;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      const payload: Partial<UserProfile> = {
        uid,
        phone,
        name,
        lastLogin: serverTimestamp()
      };

      if (!docSnap.exists()) {
        payload.createdAt = serverTimestamp();
      }

      await setDoc(docRef, payload, { merge: true });
      return true;
    } catch (error) {
      console.error("Error saving user profile:", error);
      return false;
    }
  },
  
  // Update last login time
  updateLastLogin: async (uid: string): Promise<void> => {
    if (!db) return;
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  }
};
