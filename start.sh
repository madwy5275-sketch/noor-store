#!/usr/bin/env bash
set -e

echo "============================================"
echo "  Noor Store — Startup"
echo "============================================"

# ── 1. Run database migrations ────────────────────────────────────────────────
if [ -n "$DATABASE_URL" ]; then
  echo "[startup] Running database migrations..."
  if pnpm --filter @workspace/db run push-force 2>&1; then
    echo "[startup] Migrations complete."
  else
    echo "[startup] Migration warning — continuing (tables may already exist)."
  fi
else
  echo "[startup] DATABASE_URL not set — skipping migrations."
fi

# ── 2. Auto-seed on first deployment (only if DB is empty) ───────────────────
if [ -n "$DATABASE_URL" ]; then
  echo "[startup] Running auto-seed check..."
  pnpm --filter @workspace/scripts run auto-seed || echo "[startup] Seed skipped or errored — continuing."
fi

# ── 3. Ensure uploads directory exists ───────────────────────────────────────
UPLOADS="${UPLOADS_DIR:-/app/uploads}"
mkdir -p "$UPLOADS"
echo "[startup] Uploads directory: $UPLOADS"

# ── 4. Start the API server ───────────────────────────────────────────────────
echo "[startup] Starting server..."
exec node artifacts/api-server/dist/index.mjs
