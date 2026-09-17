import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbAdmin } from './_firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  if (!dbAdmin) {
    return res.status(500).json({ error: 'Database not initialized' });
  }

  try {
    const docRef = dbAdmin.collection('otps').doc(phone);
    
    const result = await dbAdmin.runTransaction(async (t) => {
      const docSnap = await t.get(docRef);
      if (!docSnap.exists) {
        return { status: 400, body: { success: false, error: 'OTP expired or not found' } };
      }
      
      const data = docSnap.data()!;
      const currentAttempts = data.attempts || 0;
      
      if (currentAttempts >= 5) {
        t.delete(docRef);
        return { status: 429, body: { success: false, error: 'Maximum attempts exceeded. Please request a new OTP.' } };
      }

      // Check expiry
      let expiryDate = data.expiresAt;
      if (expiryDate.toDate) {
        expiryDate = expiryDate.toDate();
      } else if (typeof expiryDate === 'string') {
        expiryDate = new Date(expiryDate);
      }
      
      if (new Date() > expiryDate) {
        t.delete(docRef);
        return { status: 401, body: { success: false, error: 'OTP has expired' } };
      }

      if (data.otp === otp) {
        // OTP verified successfully, delete it to prevent reuse
        t.delete(docRef);
        return { status: 200, body: { success: true, message: 'OTP verified' } };
      } else {
        const newAttempts = currentAttempts + 1;
        if (newAttempts >= 5) {
          t.delete(docRef);
          return { status: 429, body: { success: false, error: 'Maximum attempts exceeded. Please request a new OTP.' } };
        } else {
          t.update(docRef, { attempts: newAttempts });
          return { status: 401, body: { success: false, error: `Invalid OTP. ${5 - newAttempts} attempts remaining.` } };
        }
      }
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
