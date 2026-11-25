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

## Deploy on Vercel

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` is included with SPA rewrites and basic security headers.

## Production notes

- Company contact/details are centralized in `src/data/kaffiikaData.ts` (`COMPANY_INFO`).
- Branch model is currently configured as **Head Office only** in `src/data/kaffiikaData.ts` (`BRANCHES`).
- Contact form currently uses `mailto:` for static deployment. For production lead capture, connect a form service (Vercel Forms/Formspree/API endpoint) or CRM.
- Admin portal is a client-side management UI using browser local storage; it is not a secure backend CMS. For production, replace with authenticated backend/admin.
- Product/catalog/blog/testimonial data is static in `src/data/kaffiikaData.ts`; connect a CMS/database for live operations.
