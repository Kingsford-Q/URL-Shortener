# URL Shortener Pro

A production-quality URL shortening platform: custom aliases, password-protected and one-time-use links, expiration, QR codes, click analytics, and an admin panel.

## Stack

- **Backend**: Node.js, Express, Prisma (SQLite for dev, swap to Postgres for prod), JWT auth, bcrypt, express-rate-limit, qrcode
- **Frontend**: React 19, Vite, Tailwind CSS, React Router, TanStack Query, Recharts

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # edit JWT_SECRET, ADMIN_EMAIL/PASSWORD as needed
npx prisma migrate dev --name init
npm run seed            # creates the admin user from .env
npm run dev              # http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

Both dev servers must be running for the app to work. `BASE_URL` (backend) and `VITE_API_URL` (frontend) are both optional in development -- left unset, each derives the right host from the incoming request, so the app works automatically whether you open it via `localhost` or your machine's LAN IP (e.g. testing from a phone). Set them explicitly only to override that, e.g. in production.

## Deployment

Recommended split: **frontend on Vercel** (static Vite build), **backend on Render** (long-running Node process). The backend isn't a good fit for Vercel's serverless functions -- it uses SQLite (needs a real filesystem) and in-memory rate limiting/caching (needs a persistent process), both of which serverless invocations don't provide.

### Backend (Render)

1. On Render, "New +" -> "Blueprint", point it at this repo. It picks up [`backend/render.yaml`](backend/render.yaml) and creates the service (root directory `backend`, builds + runs migrations + seeds automatically).
2. When prompted, set `ADMIN_EMAIL` / `ADMIN_PASSWORD` to your real admin credentials. `FRONTEND_URL` and `CORS_ORIGINS` already default to this project's deployed Vercel URL, baked into `render.yaml` and into `app.js`'s CORS fallback -- nothing to fill in for those unless you're deploying your own fork to a different frontend URL, in which case update both places.
3. Note the service's `.onrender.com` URL -- you'll need it for the frontend.

`BASE_URL` is left unset deliberately: the backend derives it from the request host, so it'll automatically be your Render URL (or a custom domain if you add one later) with no redeploy needed.

The SQLite database on Render's free tier resets on every redeploy and sleep/wake cycle (no persistent disk on the free plan) -- fine for demoing, not for data you want to keep. See the comments in `backend/render.yaml` for the upgrade path (persistent disk on a paid plan, or migrate to Postgres).

### Frontend (Vercel)

1. Import this repo on Vercel and set **Root Directory** to `frontend` (it'll pick up [`frontend/vercel.json`](frontend/vercel.json) from there for the SPA routing rewrite).
2. Set the env var `VITE_API_URL` to your Render backend's URL, e.g. `https://url-shortener-backend.onrender.com`.
3. Deploy. If you get a different `.vercel.app` URL than the one already baked into the backend's CORS config (e.g. deploying your own fork), update `FRONTEND_URL`/`CORS_ORIGINS` in `backend/render.yaml` and the `DEFAULT_ORIGINS` fallback in `backend/src/app.js` to match, then push -- Render auto-redeploys on push.

## Features implemented

- Auth: register/login (JWT + bcrypt), `/api/auth/me`
- Link management: create (with or without an account), custom aliases, edit destination, delete, enable/disable
- Security: password-protected links, expiration, one-time-use links, private links (owner-only)
- Analytics: total clicks, unique visitors, daily click chart, browser/OS/device/referrer breakdowns, recent visits
- QR codes: PNG/SVG, regenerated on the fly from the current short code
- Dashboard: search, filter by status, sort by clicks/date, pagination
- Admin panel: list/disable users, delete abusive links, platform stats

## Project structure

```text
url-shortener/
├── backend/
│   └── src/{controllers,routes,middleware,services,database,utils}/
├── frontend/
│   └── src/{api,components,context,pages,lib}/
└── README.md
```
