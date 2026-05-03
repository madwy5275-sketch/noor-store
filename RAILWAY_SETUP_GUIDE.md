# Railway Deployment Guide — Noor Store

## Step 1 — Push code to GitHub

Make sure your GitHub repo has ALL of these folders:
```
noor-deploy/
├── artifacts/          ← backend + frontend source
├── lib/                ← database + API shared code
├── scripts/            ← seed and utility scripts
├── railway.json        ← Railway config
├── nixpacks.toml       ← build config
├── start.sh            ← startup script (runs migrations + seed)
└── ...
```

---

## Step 2 — Create a PostgreSQL database on Railway

**Option A — Free: Use Neon.tech**
1. Go to https://neon.tech and sign up (free)
2. Create a new project → copy the connection string
3. It looks like: `postgresql://user:pass@host.neon.tech/noor?sslmode=require`

**Option B — Railway PostgreSQL plugin**
1. In your Railway project, click **"+ New"**
2. Choose **"Database" → "PostgreSQL"**
3. Railway auto-creates `DATABASE_URL` in your service variables

---

## Step 3 — Create a Railway service from GitHub

1. In Railway, click **"+ New Service"**
2. Choose **"GitHub Repo"**
3. Select your `noor-store` repo
4. Railway will detect `nixpacks.toml` automatically

---

## Step 4 — Add environment variables

Go to your service → **Variables** tab → add these:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `SESSION_SECRET` | Any random string (e.g. `noor-abc-xyz-2024`) |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `MH@Store2024` |
| `PORT` | `8080` |
| `NODE_ENV` | `production` |
| `PUBLIC_URL` | Your Railway URL after first deploy (e.g. `https://noor-store.up.railway.app`) |

**Optional:**
| Variable | Value |
|---|---|
| `BRAVE_SEARCH_API_KEY` | Get free at https://api.search.brave.com — enables image search in admin |
| `UPLOADS_DIR` | `/app/uploads` — set this if you add a Railway volume for persistent images |

---

## Step 5 — Deploy

Click **"Deploy"** — Railway will:
1. Install dependencies (`pnpm install`)
2. Build the backend
3. Build the frontend
4. Run `start.sh` which automatically:
   - Creates all database tables
   - Seeds 28 sample products (only on first run when DB is empty)
   - Starts the server

**First deployment takes ~3-5 minutes.**

---

## Step 6 — Access your store

After deployment, your store is live at:
- **Store**: `https://your-app.up.railway.app/`
- **Admin**: `https://your-app.up.railway.app/seller`
- **Login**: username `admin` / password `MH@Store2024`

Set `PUBLIC_URL` to your Railway URL so uploaded images have correct links.

---

## Persistent Image Storage (optional)

By default, uploaded images are stored inside the container and **lost on redeployment**.
URL-based images are always safe (they link to external sites).

To keep uploaded images permanently:
1. In Railway, go to your service → **"+ New Volume"**
2. Mount path: `/app/uploads`
3. Set env var `UPLOADS_DIR=/app/uploads`

---

## Troubleshooting

**Build fails:**
- Check that `artifacts/`, `lib/`, `scripts/` folders are in your GitHub repo
- Make sure `DATABASE_URL` is set before deploying

**Server crashes on startup:**
- Check Railway logs for the error
- Usually means `DATABASE_URL` is wrong or DB is unreachable

**Images not showing:**
- Set `PUBLIC_URL` to your Railway domain
- Re-upload or re-enter image URLs in the admin panel

**Admin login not working:**
- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars
- Default: `admin` / `MH@Store2024`
