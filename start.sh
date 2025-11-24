#!/bin/bash

# Square Item Lister - Quick Start Script

# Add npm to PATH
export PATH="/Users/abhiroop/.config/goose/mcp-hermit/bin:$PATH"

echo "🚀 Starting Square Item Lister..."
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env file not found!"
    echo "Please create server/.env with your API keys."
    echo "See SETUP.md for instructions."
    echo ""
    exit 1
fi

# Start server in background
echo "📦 Starting server..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait a bit for server to start
sleep 3

# Start client
echo "🎨 Starting client..."
cd client
npm run dev

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null" EXIT
