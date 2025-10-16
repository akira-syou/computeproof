#!/bin/bash

# start-demo.sh - Start ComputeProof Hackathon Demo
# Starts both backend and frontend servers

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       ComputeProof Hackathon Demo - Starting...       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Ensure backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${YELLOW}Error: 'backend' directory not found in the current working directory.${NC}"
    echo "Please run this script from the repository root (where 'backend' and 'frontend' folders live)."
    exit 1
fi

# Check if node_modules exists in backend and install if missing
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend
    if ! npm install; then
        echo -e "${YELLOW}npm install failed for backend. This is likely a network or proxy issue.${NC}"
        echo "Try running 'npm install' or 'npm ci' inside the backend folder manually and check your network/proxy settings."
        echo "If you are behind a proxy, configure npm proxy settings: 'npm config set proxy <url>' and 'npm config set https-proxy <url>'"
        exit 1
    fi
    cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    echo ""
fi

# Ensure frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${YELLOW}Error: 'frontend' directory not found in the current working directory.${NC}"
    echo "Please run this script from the repository root (where 'backend' and 'frontend' folders live)."
    exit 1
fi

# Check if node_modules exists in frontend and install if missing
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend
    if ! npm install; then
        echo -e "${YELLOW}npm install failed for frontend. This is likely a network or proxy issue.${NC}"
        echo "You can try:"
        echo "  cd frontend"
        echo "  npm ci                # clean install from package-lock.json"
        echo "  npm install --verbose # see detailed network errors"
        echo "If you are behind a proxy, configure npm via 'npm config set proxy <url>' and 'npm config set https-proxy <url>'"
        exit 1
    fi
    cd ..
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    echo ""
fi

# Start backend in background
echo -e "${YELLOW}Starting backend API server...${NC}"
cd backend
if [ -f .env ]; then
    echo -e "${GREEN}✓ Found .env file - using real Numbers API${NC}"
    PORT=3002 npm start &
else
    echo -e "${YELLOW}⚠ No .env file found - using MOCK mode${NC}"
    MOCK_NUMBERS_API=true PORT=3002 npm start &
fi
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend API running on port 3002 (PID: $BACKEND_PID)${NC}"
echo ""

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
sleep 3
echo -e "${GREEN}✓ Backend is ready${NC}"
echo ""

# Start frontend in background
echo -e "${YELLOW}Starting frontend dashboard...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend running on port 3000 (PID: $FRONTEND_PID)${NC}"
echo ""

# Store PIDs for cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Demo is now running!                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Backend API:${NC}      http://localhost:3002"
echo -e "${CYAN}Frontend Dashboard:${NC} http://localhost:3000"
echo ""
echo -e "${YELLOW}To test the API, run:${NC}"
echo -e "  ${CYAN}./test-complete-lifecycle.sh${NC}"
echo ""
echo -e "${YELLOW}To stop the demo, run:${NC}"
echo -e "  ${CYAN}./stop-demo.sh${NC}"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop all servers...${NC}"

# Wait for both processes
wait
