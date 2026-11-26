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

## Single deployment (frontend + backend together)

The backend can serve the built frontend from `dist/`, so you can deploy as one Node service.

**Build command**
```bash
npm ci && npm run build
```

**Start command**
```bash
npm start
```

**Environment variables**
- `JWT_SECRET` (required, strong random value)
- `ADMIN_EMAIL` (default `admin@kaffiikafeeds.com`)
- `ADMIN_DEFAULT_PASSWORD` (default `admin123`, change after first login)
- `DB_PATH` (set to a persistent disk path on your host, e.g. `/var/data/app.sqlite`)
- `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` (same Google OAuth Web Client ID)
- `CORS_ORIGIN` (optional when same origin; set if using custom domains)

Works well on Render/Railway/Fly/VPS with a persistent disk. **Vercel static hosting alone is not enough** for this SQLite/Express backend; use a Node host or split into Vercel frontend + external backend with `VITE_API_URL`.

## Deployment notes

- For production, use HTTPS, a strong `JWT_SECRET`, a managed persistent database, rate limiting/monitoring, and a real email provider for verification codes.