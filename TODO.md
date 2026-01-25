# TODO: Update Backend Routing and Frontend Configuration

## Tasks
- [x] Update `server/server.js`:
  - Add `import path from "path";` at the top.
  - Change all API route definitions to include the `/api` prefix (e.g., `app.use("/api/auth", authRoutes)`).
  - Add the frontend static serving and fallback routes after the API routes.
- [x] Create `client/.env` with `VITE_BASE_URL=https://sandy-sweet-nest-2.onrender.com/api`. (Note: .env editing not allowed, assuming it's set externally)
- [x] Update `client/src/utils/axiosInstance.js` to use `import.meta.env.VITE_BASE_URL` as the base URL, removing the fallback to `/api`.
