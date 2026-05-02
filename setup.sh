#!/bin/bash
# ============================================================
# NOOR STORE — Automated Local Setup Script (Mac / Linux)
# Run this once: bash setup.sh
# ============================================================

set -e

echo ""
echo "============================================"
echo "  NOOR STORE — Local Setup"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed."
  echo "Please download it from https://nodejs.org (choose LTS version)"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "ERROR: Node.js version 18+ required. You have $(node -v)"
  echo "Please update at https://nodejs.org"
  exit 1
fi

echo "[1/6] Node.js $(node -v) found"

# Install pnpm if needed
if ! command -v pnpm &> /dev/null; then
  echo "[2/6] Installing pnpm..."
  npm install -g pnpm
else
  echo "[2/6] pnpm $(pnpm -v) found"
fi

# Check for .env files
if [ ! -f "artifacts/api-server/.env" ]; then
  echo ""
  echo "============================================"
  echo "  DATABASE SETUP REQUIRED"
  echo "============================================"
  echo ""
  echo "You need a PostgreSQL database connection string."
  echo "Get a FREE database at: https://neon.tech"
  echo ""
  echo "1. Sign up at neon.tech"
  echo "2. Create a project named 'noor'"
  echo "3. Copy the connection string"
  echo ""
  read -p "Paste your DATABASE_URL here: " DB_URL

  if [ -z "$DB_URL" ]; then
    echo "ERROR: DATABASE_URL is required"
    exit 1
  fi

  read -p "Choose an admin password (or press Enter for default): " ADMIN_PASS
  ADMIN_PASS=${ADMIN_PASS:-MH@Store2024}

  cat > artifacts/api-server/.env << EOF
DATABASE_URL=$DB_URL
SESSION_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "noor-secret-$(date +%s)")
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$ADMIN_PASS
PORT=8080
NODE_ENV=development
EOF
  echo "[3/6] Created artifacts/api-server/.env"
else
  echo "[3/6] artifacts/api-server/.env already exists"
fi

if [ ! -f "artifacts/mh-store/.env" ]; then
  cat > artifacts/mh-store/.env << EOF
PORT=3000
BASE_PATH=/
EOF
  echo "      Created artifacts/mh-store/.env"
fi

# Install dependencies
echo "[4/6] Installing dependencies (this may take 2-3 minutes)..."
pnpm install

# Build lib packages
echo "[5/6] Building library packages..."
pnpm --filter @workspace/db run build 2>/dev/null || true
pnpm --filter @workspace/api-zod run build 2>/dev/null || true
pnpm --filter @workspace/api-client-react run build 2>/dev/null || true

# Push database schema
echo "[6/6] Creating database tables..."
pnpm --filter @workspace/db run push

echo ""
echo "============================================"
echo "  SETUP COMPLETE!"
echo "============================================"
echo ""
echo "To start your website, open TWO terminal windows:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd artifacts/api-server && pnpm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd artifacts/mh-store && pnpm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo "Admin panel: http://localhost:3000/seller/login"
echo ""
