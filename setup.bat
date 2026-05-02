@echo off
REM ============================================================
REM NOOR STORE — Automated Local Setup Script (Windows)
REM Double-click this file OR run: setup.bat
REM ============================================================

echo.
echo ============================================
echo   NOOR STORE — Local Setup
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is not installed.
  echo Please download it from https://nodejs.org ^(choose LTS version^)
  pause
  exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [1/6] Node.js %NODE_VER% found

REM Install pnpm if needed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [2/6] Installing pnpm...
  call npm install -g pnpm
) else (
  echo [2/6] pnpm found
)

REM Create .env for API server
if not exist "artifacts\api-server\.env" (
  echo.
  echo ============================================
  echo   DATABASE SETUP REQUIRED
  echo ============================================
  echo.
  echo You need a free PostgreSQL database.
  echo.
  echo Steps:
  echo   1. Go to https://neon.tech
  echo   2. Sign up free ^(use Google or GitHub^)
  echo   3. Create a project named: noor
  echo   4. Copy the connection string
  echo.
  set /p DB_URL="Paste your DATABASE_URL here: "
  set /p ADMIN_PASS="Choose admin password (Enter for default MH@Store2024): "
  if "%ADMIN_PASS%"=="" set ADMIN_PASS=MH@Store2024

  (
    echo DATABASE_URL=%DB_URL%
    echo SESSION_SECRET=noor-secret-change-this
    echo ADMIN_USERNAME=admin
    echo ADMIN_PASSWORD=%ADMIN_PASS%
    echo PORT=8080
    echo NODE_ENV=development
  ) > artifacts\api-server\.env
  echo [3/6] Created artifacts\api-server\.env
) else (
  echo [3/6] artifacts\api-server\.env already exists
)

if not exist "artifacts\mh-store\.env" (
  (
    echo PORT=3000
    echo BASE_PATH=/
  ) > artifacts\mh-store\.env
)

REM Install dependencies
echo [4/6] Installing dependencies ^(this may take 2-3 minutes^)...
call pnpm install

REM Build lib packages
echo [5/6] Building library packages...
call pnpm --filter @workspace/db run build
call pnpm --filter @workspace/api-zod run build
call pnpm --filter @workspace/api-client-react run build

REM Push database schema
echo [6/6] Creating database tables...
call pnpm --filter @workspace/db run push

echo.
echo ============================================
echo   SETUP COMPLETE!
echo ============================================
echo.
echo To start your website, open TWO Command Prompt windows:
echo.
echo   Window 1 ^(Backend^):
echo     cd artifacts\api-server ^&^& pnpm run dev
echo.
echo   Window 2 ^(Frontend^):
echo     cd artifacts\mh-store ^&^& pnpm run dev
echo.
echo Then open: http://localhost:3000
echo Admin panel: http://localhost:3000/seller/login
echo.
pause
