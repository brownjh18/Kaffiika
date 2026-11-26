# Kaffiika Animal Feeds Website

Full-stack Vite + React + TypeScript + Tailwind frontend with a Node/Express + SQLite backend.

## Local development

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Create `.env` from `.env.example` and set at least:
   ```env
   JWT_SECRET=replace-with-a-long-random-secret
   ADMIN_EMAIL=admin@kaffiikafeeds.com
   ADMIN_DEFAULT_PASSWORD=admin123
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```
3. Start the backend API:
   ```bash
   npm run dev:server
   ```
4. Start the frontend (in another terminal):
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```

Frontend: http://127.0.0.1:5173  
API: http://127.0.0.1:3001 (Vite proxies `/api` in dev)

## Production build (frontend)

```bash
npm run build
npm run preview
```

## Backend

- Entry: `server/index.js`
- DB: SQLite (`DB_PATH`, default `server/data/app.sqlite`)
- Seeds default products/branches/blogs/team from `server/defaults.json` on first run
- Seeds default admin user (`ADMIN_EMAIL` / `ADMIN_DEFAULT_PASSWORD`, default `admin123`)

### Main API areas
- `POST /api/auth/register`, `/login`, `/verify`, `/resend-code`, `/google`
- `GET /api/auth/me`, `PUT /api/auth/profile`
- `POST /api/orders`, `GET /api/orders/mine`
- `POST /api/admin/login`
- `GET /api/admin/users`, `/orders`, `/logs`
- Admin CRUD: `/api/admin/products|branches|blogs|team`
- `PUT /api/admin/orders/:id/status`, `DELETE /api/admin/orders/:id`
- `POST /api/admin/change-password`

## Google sign-in setup

Set `VITE_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_CLIENT_ID` (backend verification) to the same Google OAuth Web client ID. Add authorized JavaScript origins in Google Cloud Console for your local/dev and production domains.

## Admin

- Admin dashboard is at `/admin`.
- Admin signs in with backend admin credentials.
- Admin can manage products, branches, blogs, team, users, orders, and view system activity logs.
- Reset-defaults/lock controls were replaced by audit logs and admin sign-out.

## Deployment notes

- The frontend is Vite static and includes `vercel.json` rewrites for SPA routes.
- The backend is a Node/Express server; deploy it to a Node-capable host (Render/Railway/Fly/VM/VPS/etc.) or adapt to serverless + managed DB.
- For production, use a strong `JWT_SECRET`, HTTPS, a managed persistent database, and a real email provider for verification codes.