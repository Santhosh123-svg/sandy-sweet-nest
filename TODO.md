# Magic Link Email Update Tasks

## Server Updates
- [ ] Update server/utils/sendEmail.js: Change EMAIL_USER to MAIL_USER and EMAIL_PASS to MAIL_PASS
- [ ] Update server/controllers/authController.js: Change magic link URL to /magic-verify?token=... in signup
- [ ] Update server/controllers/authController.js: Modify verifyMagicLink to return JSON {token, profileCompleted, email} instead of redirect
- [ ] Add sendMagicLinkForLogin function in server/controllers/authController.js for existing users
- [ ] Update server/routes/authRoutes.js: Add POST /magic/send-link route calling sendMagicLinkForLogin

## Client Updates
- [ ] Update client/src/pages/Auth/MagicLink.jsx: Ensure it calls /auth/magic/send-link (if needed, but seems correct)
- [ ] Update client/src/pages/Auth/MagicVerify.jsx: Handle new JSON response and store token in localStorage, navigate based on profileCompleted

## Testing
- [ ] Test signup magic link flow
- [ ] Test login magic link flow
- [ ] Test verify endpoint returns correct JSON
