# Noor Store — Fashion E-Commerce Platform

A full-stack Arabic/English fashion store with admin seller dashboard, built for Railway deployment.

## Tech Stack
- **Backend**: Express 5, Drizzle ORM, PostgreSQL (Neon)
- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui
- **Monorepo**: pnpm workspaces

## Quick Deploy to Railway

1. **Push this repo to GitHub**
2. **Create a Railway project** → New Service → GitHub Repo
3. **Add environment variables** (see `RAILWAY_ENV_VARIABLES.txt`)
4. **Deploy** — Railway auto-detects nixpacks config

## Environment Variables

See `RAILWAY_ENV_VARIABLES.txt` for all required variables.

Minimum required:
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Any random string
- `PORT` — Set to `8080`
- `NODE_ENV` — Set to `production`

## Features

### Storefront
- Arabic/English bilingual
- Product catalog with categories, filters, search
- Shopping cart with coupon codes
- Order placement (cash on delivery)
- Wishlist, product comparison, quick view
- Order tracking

### Admin Dashboard (`/seller`)
- **Products**: Add/edit/delete with image upload (3 methods)
  1. **Paste URL** — Any image URL (jpg, png, webp, gif, avif…)
  2. **Upload file** — Upload from your device (up to 10MB)
  3. **Search online** — Search Brave Images (requires `BRAVE_SEARCH_API_KEY`)
- **Import from Excel** — Bulk import products via tab-separated paste
- **Orders** — View and manage all orders, update status
- **Categories** — Manage product categories
- **Coupons** — Create/manage discount codes
- **Reviews** — Manage customer reviews
- **Settings** — Announcement bar, sale events

### Image Upload Notes
- Uploaded images are stored in `/uploads/` on the server
- Set `PUBLIC_URL` environment variable to your Railway domain for correct image URLs
- For **persistent storage** across deployments: add a Railway Volume mounted at `/app/uploads`
- Without a volume, uploaded images will be lost on redeployment (but URL-based images are unaffected)

## Local Development

```bash
# Install dependencies
pnpm install

# Set up environment
cp artifacts/api-server/.env.example artifacts/api-server/.env
# Edit .env with your DATABASE_URL

# Run migrations
pnpm --filter @workspace/db run push

# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend (in another terminal)
pnpm --filter @workspace/mh-store run dev
```

## Admin Login
- Default: `admin` / `MH@Store2024`
- Change via `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
