#!/bin/bash
# ============================================================
# NOOR STORE — Start Script
# Run: bash start.sh
# This starts both the backend and frontend together
# ============================================================

echo ""
echo "Starting Noor Store..."
echo "Press Ctrl+C to stop"
echo ""

# Start API server in background
echo "Starting backend API on port 8080..."
cd artifacts/api-server && pnpm run dev &
API_PID=$!

# Wait a moment for the API to start
sleep 3

# Start frontend
echo "Starting frontend on port 3000..."
cd ../../artifacts/mh-store && pnpm run dev &
FRONTEND_PID=$!

echo ""
echo "Both services are running!"
echo "Open: http://localhost:3000"
echo ""

# Wait for Ctrl+C
trap "echo 'Stopping...'; kill $API_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
