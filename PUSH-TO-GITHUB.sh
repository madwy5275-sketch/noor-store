#!/bin/bash
echo "============================================"
echo "  Noor Store - Push to GitHub"
echo "============================================"

if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed."
    echo "Install it from: https://git-scm.com"
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "Initializing repository..."
    git init
    git branch -M main
fi

git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/madwy5275-sketch/noor-store.git

echo "Adding all files..."
git add -A

git commit -m "Deploy noor-store with auto-migration and auto-seed"

echo ""
echo "NOTE: When asked for password, use a GitHub Personal Access Token."
echo "Get one at: github.com/settings/tokens  (check the 'repo' box)"
echo ""

git push -u origin main --force

if [ $? -ne 0 ]; then
    echo ""
    echo "FAILED. Use a Personal Access Token as your password."
    echo "Go to github.com/settings/tokens and generate one (check 'repo')"
    exit 1
fi

echo ""
echo "SUCCESS! Now go to Railway and deploy!"
