# SECURITY AUDIT - PHASE 21.2 OTP SPAM & BRUTE-FORCE PROTECTION

## Scope
This audit covers the implementation of OTP rate limiting, cooldowns, and brute-force protection added in Phase 21.2.

## Implemented Security Controls

### 1. `api/verify-otp.ts` (OTP Brute-Force Protection)
- **Max Verification Attempts:** Set to `5`. 
- **Mechanism:** Implemented server-side using a Firebase atomic transaction. An `attempts` counter is kept in the `otps/{phone}` document.
- **Lockout:** Upon reaching 5 failed attempts, the OTP document is permanently deleted, rejecting further guesses immediately.
- **Replay Protection:** A successful verification immediately deletes the OTP document.

### 2. `api/send-otp.ts` (SMS Spam Protection)
- **Cooldown:** `60 seconds`. Users cannot request a second OTP within a minute.
- **Per-Phone Daily Limit:** Max `5` OTP requests per phone number per 24 hours.
- **Per-IP Daily Limit:** Max `10` OTP requests per IP address per 24 hours.
- **Mechanism:** Implemented via Firebase Transactions updating counters in a secured `rate_limits` collection (`rate_limits/phone_{phone}` and `rate_limits/ip_{ip}`). 
- **IP Extraction:** Client IP is extracted securely via the `x-forwarded-for` header natively provided by Vercel.

### 3. Database Security (`firestore.rules`)
- The `rate_limits` collection has been completely locked down (`allow read, write: if false;`). It can only be read/written by the serverless Node.js backend using `firebase-admin`.

## Attack Scenarios & Results

1. **Send OTP repeatedly to the same phone.**
   - *Result:* Blocked after the first request by the 60-second cooldown (returns HTTP 429).
2. **Send OTP repeatedly from the same IP (to different phones).**
   - *Result:* Blocked after the 10th request by the daily IP rate limit (returns HTTP 429).
3. **Attempt incorrect OTP repeatedly.**
   - *Result:* The server increments the `attempts` counter. On the 5th failed attempt, the server deletes the OTP document and locks out the challenge (returns HTTP 429).
4. **Attempt correct OTP after challenge has been invalidated.**
   - *Result:* Rejected because the document was deleted on the 5th failed attempt (returns HTTP 400).
5. **Attempt OTP after expiry.**
   - *Result:* Rejected. The API checks if `new Date() > expiresAt` (5 mins) and deletes the document if expired.
6. **Reuse an already successful OTP.**
   - *Result:* Rejected. The OTP document is deleted immediately upon the first successful validation.
7. **Attempt to manipulate phone number/challenge identifiers.**
   - *Result:* The OTP is strictly tied to the verified phone number string in the Firestore document ID (`otps/{phone}`). Spoofing it will result in a "Not found" error.
8. **Inspect production frontend bundle.**
   - *Result:* `FAST2SMS_API_KEY` is nowhere to be found on the client.
9. **Legitimate Flow Validation.**
   - *Result:* Works perfectly. The server respects valid initial requests, successfully validates the code, and creates the anonymous user session.

## Remaining Limitations
- **Phone Number Format Validation:** The backend strictly expects a 10-digit number. While sufficient for India, if international support is added, the validation logic must be updated.
- **Distributed IP Attacks:** An attacker with a massive botnet using thousands of different IPs and thousands of different phone numbers could still exhaust the Fast2SMS balance. This would require CAPTCHA (e.g. reCAPTCHA Enterprise) to fully mitigate.
