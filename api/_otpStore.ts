import { dbAdmin } from './_firebase';

interface OtpEntry {
  otp: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

// Global in-memory cache fallback for serverless warm instances
const memoryStore = new Map<string, OtpEntry>();

export const otpStore = {
  async saveOtp(phone: string, otp: string): Promise<void> {
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 mins

    // 1. Try Firestore if configured
    if (dbAdmin) {
      try {
        await dbAdmin.collection('otps').doc(phone).set({
          otp,
          createdAt: new Date(now),
          expiresAt: new Date(expiresAt),
          attempts: 0
        });
        return;
      } catch (e) {
        console.warn('Firestore save OTP fallback to memory:', e);
      }
    }

    // 2. Fallback to memory
    memoryStore.set(phone, {
      otp,
      createdAt: now,
      expiresAt,
      attempts: 0
    });
  },

  async verifyOtp(phone: string, enteredOtp: string): Promise<{ success: boolean; error?: string }> {
    const now = Date.now();

    // 1. Try Firestore if configured
    if (dbAdmin) {
      try {
        const docRef = dbAdmin.collection('otps').doc(phone);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const data = docSnap.data()!;
          let expiry = data.expiresAt;
          if (expiry?.toDate) expiry = expiry.toDate().getTime();
          else if (typeof expiry === 'string') expiry = new Date(expiry).getTime();
          else if (typeof expiry === 'number') expiry = expiry;

          if (now > expiry) {
            await docRef.delete();
            return { success: false, error: 'OTP has expired. Please request a new one.' };
          }

          if (data.otp === enteredOtp) {
            await docRef.delete();
            return { success: true };
          } else {
            const attempts = (data.attempts || 0) + 1;
            if (attempts >= 5) {
              await docRef.delete();
              return { success: false, error: 'Too many wrong attempts. Please request a new OTP.' };
            }
            await docRef.update({ attempts });
            return { success: false, error: `Invalid OTP. ${5 - attempts} attempts remaining.` };
          }
        }
      } catch (e) {
        console.warn('Firestore verify fallback to memory:', e);
      }
    }

    // 2. Memory store verification
    const record = memoryStore.get(phone);
    if (!record) {
      return { success: false, error: 'OTP expired or not found. Please request again.' };
    }

    if (now > record.expiresAt) {
      memoryStore.delete(phone);
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    if (record.otp === enteredOtp) {
      memoryStore.delete(phone);
      return { success: true };
    }

    record.attempts += 1;
    if (record.attempts >= 5) {
      memoryStore.delete(phone);
      return { success: false, error: 'Too many wrong attempts. Please request a new OTP.' };
    }

    return { success: false, error: `Invalid OTP. ${5 - record.attempts} attempts remaining.` };
  }
};
