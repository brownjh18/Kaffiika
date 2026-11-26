# Kaffiika Animal Feeds Website

Full-stack Vite + React + TypeScript + Tailwind frontend with a Node/Express backend using Supabase (Postgres + Storage).

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

   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SECRET_KEY=your-supabase-secret-key
   SUPABASE_STORAGE_BUCKET=media
   DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres

   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```
3. In Supabase SQL Editor, run `server/schema.sql` to create tables/indexes.
4. Ensure a Supabase Storage bucket exists (default `media`) and is public for website media reads. The server also attempts to create it on startup if missing.
5. Start the backend API:
   ```bash
   npm run dev:server
   ```
6. Start the frontend (in another terminal):
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```

Frontend: http://127.0.0.1:5173  
API: http://127.0.0.1:3001 (Vite proxies `/api` in dev)

## Production build

```bash
npm run build
npm run preview
```

## Backend

- Entry: `server/index.js`
- Database: Direct Postgres via `DATABASE_URL` (Supabase Postgres; bypasses PostgREST schema cache) for users, orders, products, branches, blogs, team, audit logs
- Media: Supabase Storage bucket (`SUPABASE_STORAGE_BUCKET`, default `media`) via `POST /api/uploads`
- Seeds default products/branches/blogs/team from `server/defaults.json` on first run
- Seeds default admin user (`ADMIN_EMAIL` / `ADMIN_DEFAULT_PASSWORD`, default `admin123`)

### Main API areas
- `POST /api/auth/register`, `/login`, `/verify`, `/resend-code`, `/google`
- `GET /api/auth/me`, `PUT /api/auth/profile`
- `POST /api/orders`, `GET /api/orders/mine`
- `POST /api/uploads` (authenticated media upload to Supabase Storage)
- `POST /api/admin/login`
- `GET /api/admin/users`, `/orders`, `/logs`
- Admin CRUD: `/api/admin/products|branches|blogs|team`
- `PUT /api/admin/orders/:id/status`, `DELETE /api/admin/orders/:id`
- `POST /api/admin/change-password`

## Google sign-in setup

Set `VITE_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_CLIENT_ID` (backend verification) to the same Google OAuth Web client ID. Add authorized JavaScript origins in Google Cloud Console for your local/dev and production domains.

## Admin

- Admin dashboard: `/admin`
- Backend-authenticated admin login
- Manages products, branches, blogs, team, users, orders
- System activity logs replace reset-defaults/lock controls

## Single deployment (frontend + backend together)

The backend serves the built frontend from `dist/`, so you can deploy as one Node service.

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
- `ADMIN_EMAIL` / `ADMIN_DEFAULT_PASSWORD`
- `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_STORAGE_BUCKET`
- `DATABASE_URL` (direct Postgres connection string)
- `VITE_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_ID`
- `CORS_ORIGIN` (optional for same-origin; set for custom/cross domains)
- `VITE_API_URL` (only if frontend and backend are on different domains)

Works on Render/Railway/Fly/VPS. It can also be deployed as a single Vercel project (frontend + serverless API) using the included `api/[...path].js` and `vercel.json` rewrites.

## Deployment notes

- Use HTTPS, strong secrets, and rotate any keys exposed in chat/logs.
- Supabase handles persistent structured data and media storage.
- Email verification currently returns demo codes in API/UI; integrate a real email provider for production delivery.
