import type { VercelRequest, VercelResponse } from '@vercel/node';
import { otpStore } from './_otpStore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { phone, otp } = req.body || {};
    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone number and OTP code are required' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp).trim();

    const result = await otpStore.verifyOtp(cleanPhone, cleanOtp);

    if (result.success) {
      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ success: false, error: result.error || 'Invalid OTP' });
    }
  } catch (error: any) {
    console.error('Verify OTP handler error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Server error during OTP verification' });
  }
}
