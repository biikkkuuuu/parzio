import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  createdAt?: any;
  lastLogin?: any;
}

const REGISTRY_KEY = 'parzio_registered_users';

function getLocalUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUser(user: UserProfile) {
  try {
    const users = getLocalUsers();
    users[user.uid] = user;
    if (user.phone) {
      const cleanPhone = user.phone.replace(/\D/g, '').slice(-10);
      users[cleanPhone] = user;
      users[`phone_${cleanPhone}`] = user;
      users[`+91${cleanPhone}`] = user;
    }
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Could not save to local registry", e);
  }
}

export const userService = {
  // Check if a user exists and return their profile
  getUserProfile: async (uidOrPhone: string): Promise<UserProfile | null> => {
    const clean = uidOrPhone.replace(/\D/g, '').slice(-10);
    const localUsers = getLocalUsers();
    
    // 1. Try Firestore if available
    if (db) {
      try {
        const docRef = doc(db, 'users', uidOrPhone);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          saveLocalUser(profile);
          return profile;
        }
        
        // Also check by clean phone document
        if (clean && uidOrPhone !== `phone_${clean}`) {
          const altRef = doc(db, 'users', `phone_${clean}`);
          const altSnap = await getDoc(altRef);
          if (altSnap.exists()) {
            const profile = altSnap.data() as UserProfile;
            saveLocalUser(profile);
            return profile;
          }
        }
      } catch (error) {
        console.warn("Firestore getUserProfile error, checking local registry:", error);
      }
    }

    // 2. Fallback to local persistent registry (never forgets registered users)
    if (localUsers[uidOrPhone]) return localUsers[uidOrPhone];
    if (clean && localUsers[clean]) return localUsers[clean];
    if (clean && localUsers[`phone_${clean}`]) return localUsers[`phone_${clean}`];
    if (clean && localUsers[`+91${clean}`]) return localUsers[`+91${clean}`];

    return null;
  },

  // Create or update a user profile
  saveUserProfile: async (uid: string, phone: string, name: string): Promise<boolean> => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    const userProfile: UserProfile = {
      uid,
      phone: `+91${clean}`,
      name: name.trim(),
      lastLogin: new Date().toISOString()
    };

    // 1. Immediately persist to local registry
    saveLocalUser(userProfile);

    // 2. Persist to Firestore
    if (db) {
      try {
        const docRef = doc(db, 'users', uid);
        const payload = {
          ...userProfile,
          lastLogin: serverTimestamp(),
          createdAt: serverTimestamp()
        };
        await setDoc(docRef, payload, { merge: true });
        return true;
      } catch (error) {
        console.warn("Error saving user profile to Firestore (local registry used):", error);
      }
    }
    return true;
  },
  
  // Update last login time
  updateLastLogin: async (uid: string): Promise<void> => {
    const localUsers = getLocalUsers();
    if (localUsers[uid]) {
      localUsers[uid].lastLogin = new Date().toISOString();
      try {
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(localUsers));
      } catch {}
    }
    if (!db) return;
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.warn("Error updating last login in Firestore:", error);
    }
  }
};
