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
cp .env.example .env    # VITE_API_URL should match the backend's BASE_URL
npm run dev               # http://localhost:5173
```

Both dev servers must be running for the app to work. The backend's `FRONTEND_URL` env var (CORS) and `BASE_URL` env var (used to build short links and QR codes) should match wherever the frontend/backend actually end up running.

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
