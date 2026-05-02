# Noor Store — Deploy to Railway in 10 Minutes

Your database is already configured. Follow these steps exactly.

---

## STEP 1 — Install Node.js on your computer

1. Go to https://nodejs.org
2. Click the big green "LTS" download button
3. Install it (click Next → Next → Install)
4. Open Command Prompt (Windows) or Terminal (Mac) and run:
   ```
   npm install -g pnpm
   ```

---

## STEP 2 — Create a GitHub account and upload your code

1. Go to https://github.com and click "Sign up" (it's free)
2. After signing up, click the "+" button → "New repository"
3. Name it: noor-store
4. Leave it Public
5. Click "Create repository"

Now upload your code:
- On the GitHub page that opens, click "uploading an existing file"
- Drag ALL files from this ZIP (extracted) into the upload area
- Click "Commit changes"

---

## STEP 3 — Deploy on Railway (FREE)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Click "Sign in with GitHub" → authorize Railway
4. Click "Deploy from GitHub repo"
5. Select your "noor-store" repository
6. Railway will start building automatically

---

## STEP 4 — Add environment variables in Railway

Click your service in Railway → Click "Variables" tab → Add these:

| Variable          | Value                                                                                              |
|-------------------|----------------------------------------------------------------------------------------------------|
| DATABASE_URL      | postgresql://neondb_owner:npg_JQEYOXNbL14H@ep-bold-field-amjhd11v.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require |
| SESSION_SECRET    | noor-secret-5529c645fd0d457cc1ba47edab46adfa                                                      |
| ADMIN_USERNAME    | admin                                                                                              |
| ADMIN_PASSWORD    | MH@Store2024                                                                                       |
| PORT              | 8080                                                                                               |
| NODE_ENV          | production                                                                                         |

After adding variables, Railway will automatically redeploy.

---

## STEP 5 — Get your live URL

1. In Railway, click "Settings" tab
2. Click "Networking" → "Generate Domain"
3. You get a URL like: https://noor-store-production.up.railway.app
4. Open it in your browser — YOUR WEBSITE IS LIVE!

---

## STEP 6 — Set up database tables (one time only)

After Railway finishes deploying:

1. In Railway, click your service → click "Settings" tab
2. Find the "Deploy" section → click "Run Command"
3. Enter this command and click Run:
   ```
   pnpm --filter @workspace/db run push
   ```
   This creates all your database tables (products, orders, etc.)

---

## Admin Panel

URL: https://YOUR-RAILWAY-URL/seller/login
Username: admin
Password: MH@Store2024

---

## Run locally on your computer (optional)

If you also want to run it on your computer:

1. Extract this ZIP
2. Open Command Prompt inside the folder
3. Run: pnpm install
4. Run: pnpm --filter @workspace/db run push
5. Open Terminal 1: cd artifacts/api-server && pnpm run dev
6. Open Terminal 2: cd artifacts/mh-store && pnpm run dev
7. Open browser: http://localhost:3000

The .env files are already created with your database credentials.

