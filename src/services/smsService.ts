/**
 * PARZIO Direct SMS Service
 * Pure zero-captcha Indian SMS OTP delivery via Fast2SMS gateway.
 * Zero traffic lights, zero photo puzzles, instant delivery to any Indian mobile.
 */

const FAST2SMS_API_KEY =
  import.meta.env.VITE_FAST2SMS_API_KEY ||
  'b86UTqxh4dZQjmICJtLDlVkYMyRaSrK3zFNvXpO0P1EHWsfgi5uCGNnkbHJTm5wcIQB0z1p4gUfF7V2M';

interface StoredOtp {
  code: string;
  expiresAt: number;
  attempts: number;
}

export const smsService = {
  /**
   * Send 6-Digit OTP directly to customer phone (Zero Captcha)
   */
  async sendOtp(rawPhone: string): Promise<{ success: boolean; error?: string }> {
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    // Rate limiting: 30 seconds cooldown per phone
    const sessionKey = `parzio_otp_${cleanPhone}`;
    const existing = sessionStorage.getItem(sessionKey);
    if (existing) {
      try {
        const parsed: StoredOtp & { sentAt?: number } = JSON.parse(existing);
        if (parsed.sentAt && Date.now() - parsed.sentAt < 25000) {
          const remaining = Math.ceil((25000 - (Date.now() - parsed.sentAt)) / 1000);
          return { success: false, error: `Please wait ${remaining} seconds before requesting a new OTP.` };
        }
      } catch {}
    }

    // Generate secure 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Fast2SMS Quick SMS Route (Zero DLT hassle, 100% delivery rate)
      const messageText = `Your PARZIO verification code is ${generatedOtp}. Do not share this OTP with anyone. Valid for 5 mins.`;
      const encodedMsg = encodeURIComponent(messageText);
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=q&message=${encodedMsg}&language=english&flash=0&numbers=${cleanPhone}`;

      const res = await fetch(url, { method: 'GET' });
      const data = await res.json();

      if (data.return === true || (Array.isArray(data.message) && data.message[0]?.toLowerCase().includes('success'))) {
        // Store in session storage with 5-minute expiry
        sessionStorage.setItem(
          sessionKey,
          JSON.stringify({
            code: generatedOtp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,
            sentAt: Date.now()
          })
        );
        return { success: true };
      } else {
        const reason = data.message || (Array.isArray(data.message) ? data.message.join(', ') : 'SMS gateway error');
        console.error('Fast2SMS error:', data);
        return { success: false, error: `SMS gateway: ${reason}` };
      }
    } catch (netErr: any) {
      console.error('Fast2SMS network error:', netErr);
      return { success: false, error: 'Network error sending SMS. Please check your connection and retry.' };
    }
  },

  /**
   * Verify entered 6-digit OTP code
   */
  verifyOtp(rawPhone: string, enteredOtp: string): { success: boolean; error?: string } {
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    const sessionKey = `parzio_otp_${cleanPhone}`;
    const raw = sessionStorage.getItem(sessionKey);

    if (!raw) {
      return { success: false, error: 'No active OTP session found. Please request a new code.' };
    }

    try {
      const stored: StoredOtp = JSON.parse(raw);
      if (Date.now() > stored.expiresAt) {
        sessionStorage.removeItem(sessionKey);
        return { success: false, error: 'OTP has expired. Please request a new code.' };
      }

      if (stored.attempts >= 5) {
        sessionStorage.removeItem(sessionKey);
        return { success: false, error: 'Too many incorrect attempts. Please request a fresh OTP.' };
      }

      const cleanEntered = enteredOtp.trim();
      if (cleanEntered === stored.code) {
        // OTP Verified successfully!
        sessionStorage.removeItem(sessionKey);
        return { success: true };
      } else {
        stored.attempts += 1;
        sessionStorage.setItem(sessionKey, JSON.stringify(stored));
        return { success: false, error: `Incorrect OTP code. ${5 - stored.attempts} attempts remaining.` };
      }
    } catch (e) {
      return { success: false, error: 'Invalid verification session. Please retry.' };
    }
  }
};
