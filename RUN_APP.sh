#!/bin/bash

# Square Item Lister - Easy Startup Script
# This script will start both server and client for you

# Add npm to PATH
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH"

echo "╔════════════════════════════════════════════════╗"
echo "║   🚀 Square Item Lister - Starting App...     ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env file not found!"
    echo "The .env file should have been created with your API keys."
    echo ""
    exit 1
fi

echo "✅ Configuration found!"
echo ""

# Start server in background
echo "📦 Starting server on port 3001..."
cd server
npm run dev > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
sleep 5

# Check if server is running
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Server is running!"
    echo ""
else
    echo "❌ Server failed to start. Check server.log for errors."
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Start client
echo "🎨 Starting client on port 3000..."
echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  🎉 App is starting!                           ║"
echo "║                                                ║"
echo "║  Open your browser to:                         ║"
echo "║  👉 http://localhost:3000                      ║"
echo "║                                                ║"
echo "║  Press Ctrl+C to stop the app                  ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

cd client
npm run dev

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null; echo '✅ App stopped!'; exit 0" EXIT INT TERM
