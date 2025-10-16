#!/bin/bash

# Open Dashboard in Browser
echo "🚀 Opening ComputeProof Dashboard..."
echo ""
echo "📊 Dashboard URL: https://expert-goldfish-69vgrw769qpfrjvg-8000.app.github.dev"
echo ""
echo "✨ To access the dashboard:"
echo "   1. Go to the PORTS tab (bottom panel in VS Code)"
echo "   2. Find port 8000"
echo "   3. Click the globe icon (🌐) to open in browser"
echo ""
echo "🔄 Dashboard auto-refreshes every 10 seconds"
echo "📝 Click any job card to see the complete event timeline"
echo ""

# Try to open in browser using environment variable
if [ -n "$BROWSER" ]; then
    "$BROWSER" "https://expert-goldfish-69vgrw769qpfrjvg-8000.app.github.dev" &
    echo "✅ Opening in browser..."
else
    echo "💡 Use the PORTS tab to open the dashboard"
fi
