#!/bin/bash

# serve-dashboard.sh - Serve the frontend dashboard with Python

echo "Building frontend..."
cd /workspaces/computeproof-hackathon/frontend
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Starting Python HTTP server on port 8000..."
    cd dist
    
    # Kill any existing server on port 8000
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    
    python3 -m http.server 8000 &
    SERVER_PID=$!
    
    sleep 2
    
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║     ✅ Dashboard is now running!                       ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "📍 Access the dashboard:"
    echo ""
    echo "1. Look at the PORTS tab at the bottom of VS Code"
    echo "2. Find port 8000"
    echo "3. Click the globe icon 🌐 next to it"
    echo ""
    echo "The built static files are being served from:"
    echo "  /workspaces/computeproof-hackathon/frontend/dist"
    echo ""
    echo "To stop the server:"
    echo "  kill $SERVER_PID"
    echo ""
    
    # Keep script running
    wait $SERVER_PID
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
