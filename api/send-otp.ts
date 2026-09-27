import type { VercelRequest, VercelResponse } from '@vercel/node';
import { otpStore } from './_otpStore';
import { Sentry } from './_sentry';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure response is always JSON
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { phone, turnstileToken } = req.body || {};
    if (!phone || String(phone).replace(/\D/g, '').length !== 10) {
      return res.status(400).json({ success: false, error: 'Valid 10-digit phone number required' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);

    // Fast2SMS API Key resolution
    const apiKey =
      process.env.FAST2SMS_API_KEY ||
      process.env.VITE_FAST2SMS_API_KEY ||
      'b86UTqxh4dZQjmICJtLDlVkYMyRaSrK3zFNvXpO0P1EHWsfgi5uCGNnkbHJTm5wcIQB0z1p4gUfF7V2M';

    // Verify Turnstile Token if provided
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
    if (turnstileToken && turnstileSecret && turnstileSecret !== '1x0000000000000000000000000000000AA') {
      try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
        const ipStr = Array.isArray(clientIp) ? clientIp[0] : clientIp.split(',')[0].trim();

        const tsFormData = new URLSearchParams();
        tsFormData.append('secret', turnstileSecret);
        tsFormData.append('response', turnstileToken);
        if (ipStr) tsFormData.append('remoteip', ipStr);

        const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          body: tsFormData,
        });
        const tsData = await tsRes.json();
        if (!tsData.success) {
          console.warn('Turnstile check failed:', tsData);
          return res.status(403).json({ success: false, error: 'Security verification failed. Please try again.' });
        }
      } catch (tsErr) {
        console.warn('Turnstile verification network warning:', tsErr);
      }
    }

    // Generate 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP securely in resilient store
    await otpStore.saveOtp(cleanPhone, generatedOtp);

    // Send SMS via Fast2SMS
    const baseApi = 'https://www.fast2sms.com/dev/bulkV2';
    let smsSuccess = false;
    let errorReason = '';

    try {
      // Route 1: Official OTP route
      const otpUrl = `${baseApi}?authorization=${apiKey}&variables_values=${generatedOtp}&route=otp&numbers=${cleanPhone}`;
      let response = await fetch(otpUrl);
      let data = await response.json();

      if (data.return === true) {
        smsSuccess = true;
      } else {
        console.warn('Fast2SMS route=otp notice:', data);
        // Route 2: Quick SMS fallback
        const qMsg = encodeURIComponent(`Your Parzio verification code is ${generatedOtp}. Do not share this OTP with anyone.`);
        const qUrl = `${baseApi}?authorization=${apiKey}&route=q&message=${qMsg}&language=english&flash=0&numbers=${cleanPhone}`;
        
        response = await fetch(qUrl);
        data = await response.json();
        if (data.return === true) {
          smsSuccess = true;
        } else {
          errorReason = data.message || (Array.isArray(data.message) ? data.message.join(', ') : 'SMS gateway rejected message');
        }
      }
    } catch (smsErr: any) {
      console.error('Fast2SMS network exception:', smsErr);
      errorReason = smsErr?.message || 'Gateway network error';
      Sentry.captureException(smsErr);
    }

    if (smsSuccess) {
      return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      return res.status(400).json({ success: false, error: `SMS Gateway: ${errorReason}` });
    }
  } catch (fatalError: any) {
    console.error('Fatal send-otp handler error:', fatalError);
    Sentry.captureException(fatalError);
    return res.status(500).json({ success: false, error: fatalError?.message || 'Server error while sending OTP' });
  }
}
