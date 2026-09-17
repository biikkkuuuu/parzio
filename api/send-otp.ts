import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbAdmin } from './_firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone number required' });
  }

  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.error('FAST2SMS_API_KEY is not configured on the server.');
    return res.status(500).json({ error: 'SMS Gateway Configuration Error' });
  }

  if (!dbAdmin) {
    return res.status(500).json({ error: 'Database not initialized' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const ipStr = Array.isArray(clientIp) ? clientIp[0] : clientIp.split(',')[0].trim();

  let generatedOtp = '';

  try {
    const rateLimitResult = await dbAdmin.runTransaction(async (t) => {
      // 1. Resend Cooldown Check
      const otpRef = dbAdmin.collection('otps').doc(phone);
      const otpSnap = await t.get(otpRef);
      if (otpSnap.exists) {
        const otpData = otpSnap.data()!;
        const createdAt = otpData.createdAt?.toDate ? otpData.createdAt.toDate() : new Date(otpData.createdAt);
        if (Date.now() - createdAt.getTime() < 60000) {
          return { allowed: false, status: 429, error: 'Please wait 60 seconds before requesting a new OTP.' };
        }
      }

      // 2. Daily Rate Limits
      // IP limit prevents one IP from attacking many phones
      // Phone limit prevents attacking one phone from many IPs
      const ipRef = dbAdmin.collection('rate_limits').doc(`ip_${ipStr.replace(/[^a-zA-Z0-9.:-]/g, '_')}`);
      const phoneRef = dbAdmin.collection('rate_limits').doc(`phone_${phone}`);

      const [ipSnap, phoneSnap] = await t.getAll(ipRef, phoneRef);

      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      let ipCount = 1;
      let ipWindowStart = new Date();
      if (ipSnap.exists) {
        const data = ipSnap.data()!;
        const windowTime = data.windowStart?.toDate ? data.windowStart.toDate().getTime() : new Date(data.windowStart).getTime();
        if (now - windowTime < ONE_DAY) {
          ipCount = (data.count || 0) + 1;
          ipWindowStart = data.windowStart;
          if (ipCount > 10) {
            return { allowed: false, status: 429, error: 'Maximum daily SMS limit exceeded for this IP.' };
          }
        }
      }

      let phoneCount = 1;
      let phoneWindowStart = new Date();
      if (phoneSnap.exists) {
        const data = phoneSnap.data()!;
        const windowTime = data.windowStart?.toDate ? data.windowStart.toDate().getTime() : new Date(data.windowStart).getTime();
        if (now - windowTime < ONE_DAY) {
          phoneCount = (data.count || 0) + 1;
          phoneWindowStart = data.windowStart;
          if (phoneCount > 5) {
            return { allowed: false, status: 429, error: 'Maximum daily SMS limit exceeded for this phone number.' };
          }
        }
      }

      // All checks passed, generate and save
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      t.set(ipRef, { count: ipCount, windowStart: ipWindowStart });
      t.set(phoneRef, { count: phoneCount, windowStart: phoneWindowStart });
      t.set(otpRef, {
        otp: otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0
      });

      return { allowed: true, generatedOtp: otp };
    });

    if (!rateLimitResult.allowed) {
      return res.status(rateLimitResult.status!).json({ success: false, error: rateLimitResult.error });
    }
    
    generatedOtp = rateLimitResult.generatedOtp!;
  } catch (error) {
    console.error('Rate limit/Firestore error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

  const baseApi = 'https://www.fast2sms.com/dev/bulkV2';
  let smsSuccess = false;
  let errorReason = '';

  try {
    const otpUrl = `${baseApi}?authorization=${apiKey}&variables_values=${generatedOtp}&route=otp&numbers=${phone}`;
    let response = await fetch(otpUrl);
    let data = await response.json();

    if (data.return === true) {
      smsSuccess = true;
    } else {
      console.warn("route=otp failed, trying route=q:", data);
      const qMsg = encodeURIComponent(`Your Parzio verification code is ${generatedOtp}. Do not share this with anyone.`);
      const qUrl = `${baseApi}?authorization=${apiKey}&route=q&message=${qMsg}&language=english&flash=0&numbers=${phone}`;
      
      response = await fetch(qUrl);
      data = await response.json();
      
      if (data.return === true) {
        smsSuccess = true;
      } else {
        errorReason = data.message || 'SMS send failed';
      }
    }
  } catch (err: any) {
    errorReason = err.message || 'Network error';
  }

  if (smsSuccess) {
    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } else {
    // In test environment or if Fast2SMS fails, we could potentially return success for local testing, 
    // but for production hardening, it must fail properly.
    return res.status(500).json({ success: false, error: errorReason });
  }
}
