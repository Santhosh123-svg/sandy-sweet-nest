# Mobile OTP Auth Implementation TODO

## Steps (Approved Plan):

### 1. Backend OTP Implementation
   - ✅ Updated User model (add otp, otpExpiry)
   - ✅ Added sendOtpEmail to utils/sendEmail.js
   - ✅ Added controller: registerOtp, verifyRegisterOtp
   - ✅ Added routes: POST /auth/register-otp, POST /auth/verify-register-otp
   - ✅ Backend endpoints ready

### 2. Update Register Screen (SignupScreen.jsx)
   - ✅ Changed API to /auth/register-otp
   - ✅ Button: Get OTP → navigate to Otp with email
   - ✅ Updated success message
   - ✅ Removed magic link references

### 3. Create OtpScreen.jsx
   - ✅ Created 6-digit OTP screen
   - ✅ POST /auth/verify-register-otp
   - ✅ Navigate to Login on success

### 4. Update AppNavigator.jsx
   - ✅ Added Otp screen import & route

### 5. Testing & Cleanup
   - [ ] Test full flow: Register → OTP → Login → Home
   - [ ] Keep MagicVerify for web deep link compatibility
   - [ ] Ready for completion
