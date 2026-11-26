# Kaffiika Animal Feeds Website

Vite + React + TypeScript + Tailwind static website.

## Local development

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

## Production build

```bash
npm run build
npm run preview
```

## Environment variables

Copy `.env.example` to `.env` for local development. For Vercel, add the same variables in **Project Settings > Environment Variables** and redeploy.

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Enables Google sign-in in the auth modal via Google Identity Services. |
| `VITE_ADMIN_EMAIL` | Optional client-side admin default (not secure backend auth). |
| `VITE_ADMIN_PASSWORD` | Optional client-side admin default (not secure backend auth). |

## Google sign-in setup

Google sign-in is shown in the Sign In / Create Account modal only when `VITE_GOOGLE_CLIENT_ID` is configured.

1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Create or select a project.
3. Configure the OAuth consent screen if prompted.
4. Create **OAuth client ID** > **Web application**.
5. Add **Authorized JavaScript origins** for every environment where the app runs:
   - `http://127.0.0.1:5173`
   - `http://localhost:5173`
   - `https://your-production-domain`
   - `https://your-project.vercel.app` (if used)
6. Copy the generated Client ID.
7. Set `VITE_GOOGLE_CLIENT_ID=<your-client-id>` in `.env` locally, or in Vercel Environment Variables.
8. Redeploy/restart the app. Vite env vars are baked in at build time.

Notes:
- No client secret is needed for Google Identity Services browser sign-in.
- If the button does not appear, check the browser console, ad/script blockers, and that the current site origin is listed in Google Cloud authorized JavaScript origins.
- User accounts are stored client-side in browser localStorage; this is not a secure production authentication backend.

## Deploy on Vercel

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` is included with SPA rewrites and basic security headers.
- Add `VITE_GOOGLE_CLIENT_ID` in Vercel environment variables to enable Google sign-in.

## Production notes

- Company contact/details are centralized in `src/data/kaffiikaData.ts` (`COMPANY_INFO`).
- Branch model is currently configured as **Head Office only** in `src/data/kaffiikaData.ts` (`BRANCHES`).
- Contact form currently uses `mailto:` for static deployment. For production lead capture, connect a form service (Vercel Forms/Formspree/API endpoint) or CRM.
- Admin portal is a client-side management UI using browser local storage; it is not a secure backend CMS. For production, replace with authenticated backend/admin.
- Product/catalog/blog/testimonial data is static in `src/data/kaffiikaData.ts`; connect a CMS/database for live operations.
