@echo off
echo ============================================
echo   Noor Store - Push to GitHub
echo ============================================
echo.

git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

if not exist ".git" (
    echo Initializing repository...
    git init
    git branch -M main
)

git remote remove origin 2>nul
git remote add origin https://github.com/madwy5275-sketch/noor-store.git

echo Adding all files...
git add -A

git commit -m "Deploy noor-store with auto-migration and auto-seed"

echo.
echo NOTE: When asked for password, use a GitHub Personal Access Token.
echo Get one at: github.com/settings/tokens  (check the 'repo' box)
echo.

git push -u origin main --force

if errorlevel 1 (
    echo.
    echo FAILED. Tip: use a Personal Access Token as your password.
    echo Go to github.com/settings/tokens and generate one (check 'repo')
    pause
    exit /b 1
)

echo.
echo SUCCESS! Now go to Railway and deploy!
pause
