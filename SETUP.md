# WorkTrack Dubai — Setup Guide

## Prerequisites
- Node.js 18+
- MySQL 8+ running locally
- Cloudinary account (free tier)

---

## 1. Database

```bash
# Create the database in MySQL
mysql -u root -p -e "CREATE DATABASE worktrack_dubai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## 2. Backend (worktrack-dubai-api)

```bash
cd worktrack-dubai-api
cp .env.example .env
# Edit .env with your MySQL credentials and Cloudinary keys
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed        # Populates with demo data (dev only)
npm run dev            # Starts on http://localhost:4000
```

**Default seed credentials:**
- Admin: `admin@worktrack.ae` / `Admin@1234`
- User:  `ahmed@example.ae`  / `User@1234`

---

## 3. Frontend (worktrack-dubai-web)

```bash
cd worktrack-dubai-web
cp .env.example .env
npm install
npm run dev            # Starts on http://localhost:5173
```

The Vite dev server proxies `/api` to `localhost:4000` — no CORS setup needed.

---

## Environment variables

### worktrack-dubai-api/.env
```
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/worktrack_dubai"
ACCESS_TOKEN_SECRET="change-me-access-secret-32chars"
REFRESH_TOKEN_SECRET="change-me-refresh-secret-32chars"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

### worktrack-dubai-web/.env
```
VITE_API_URL=http://localhost:4000
```

---

## Architecture notes

- Access tokens live in memory (React state) — never in localStorage.
- Refresh tokens live in an httpOnly cookie — invisible to JavaScript.
- On a 401, the Axios interceptor silently refreshes and retries once.
- Refreshing the browser re-runs the refresh flow on mount — session is preserved.
- Cloudinary handles avatar storage; avatarUrl is stored in the User row.
- PDF export uses Puppeteer (requires Chromium). On lightweight servers, the xlsx route is always available.
- The `seed.js` script is dev-only — delete it before any production deploy.
