# MERN App Deployment Fix on Render

## Issues Identified
- Backend uses ES modules but __dirname not defined, causing errors.
- No static file serving for frontend build (client/dist).
- API routes not prioritized before static serving, causing frontend fallback to block APIs.
- Frontend axios baseURL uses VITE_BASE_URL, but needs to point to Render backend.
- Test-mail route exists but may be blocked by missing static setup.

## Plan
1. Update server/server.js to define __dirname for ES modules.
2. Add static file serving for client/dist after API routes.
3. Add SPA fallback route to serve index.html for non-API routes.
4. Ensure /api/auth/test-mail route is working (already exists).
5. Update client/src/utils/axiosInstance.js to use VITE_BASE_URL (already does).
6. Provide deployment instructions for Render.

## Steps
- [ ] Update server/server.js with __dirname, static serving, and fallback.
- [ ] Verify /api/auth/test-mail route (read authRoutes.js and authController.js).
- [ ] Update axiosInstance.js if needed (already uses VITE_BASE_URL).
- [ ] Test locally: build client, start server, check routes.
- [ ] Provide Render deployment steps.
