# 📁 ComputeProof - Project Structure

## Repository Overview

```
computeproof-hackathon/
├── backend/                    # Node.js API server
│   ├── .env.example           # Environment template
│   ├── package.json           # Backend dependencies
│   └── server.js              # Main API server (Numbers integration)
│
├── frontend/                   # React dashboard
│   ├── src/
│   │   ├── App.jsx            # Main dashboard component
│   │   └── main.jsx           # React entry point
│   ├── dist/                  # Built production files
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite build configuration
│
├── docs/                       # Documentation
│   └── DEVPOST_SUBMISSION.md  # Hackathon submission details
│
├── start-demo.sh              # 🚀 One-command startup script
├── stop-demo.sh               # Stop all services
├── test-complete-lifecycle.sh # Test complete GPU job flow
├── complete-job.sh            # Complete individual job
├── serve-dashboard.sh         # Rebuild and serve frontend
├── open-dashboard.sh          # Open dashboard in browser
│
├── README.md                  # Main documentation
├── QUICKSTART.md              # Quick start guide
├── DASHBOARD_IMPROVEMENTS.md  # Dashboard features guide
└── REALTIME_DASHBOARD.md      # Real-time features guide
```

## Key Files Explained

### Backend (`backend/`)

**`server.js`** - Main API server
- Handles all GPU job lifecycle endpoints
- Integrates with Numbers Protocol Capture API
- Manages job registry (in-memory storage)
- Commits events to blockchain via ERC-7053

**`.env`** - Environment configuration (create from `.env.example`)
```
CAPTURE_TOKEN=your_numbers_protocol_token
PORT=3002
```

**`package.json`** - Dependencies
- express: Web framework
- axios: HTTP client for Numbers API
- dotenv: Environment variable management
- cors: Cross-origin resource sharing

### Frontend (`frontend/`)

**`src/App.jsx`** - Main React component
- Job card display with status badges
- Terminal-style execution log modal
- Real-time auto-refresh (10s intervals)
- Blockchain verification links

**`vite.config.js`** - Build configuration
- Port 3000 for dev server
- Optimized production builds

**`dist/`** - Production build
- Served by Python HTTP server on port 8000
- Contains compiled JavaScript and HTML

### Scripts

**`start-demo.sh`** - Complete startup automation
1. Installs backend dependencies
2. Starts backend on port 3002 (background with nohup)
3. Installs frontend dependencies
4. Builds frontend production bundle
5. Serves frontend on port 8000 (Python HTTP server)

**`stop-demo.sh`** - Cleanup
- Kills backend Node.js process
- Kills frontend Python server
- Cleans up PID files

**`test-complete-lifecycle.sh`** - Integration test
- Submits new GPU job
- Runs through all 5 lifecycle events
- Creates real blockchain transactions
- Displays formatted output

**`complete-job.sh`** - Utility script
- Takes a job NID as parameter
- Completes all remaining lifecycle steps
- Useful for finishing submitted jobs

**`serve-dashboard.sh`** - Frontend rebuild
- Rebuilds React app
- Starts Python HTTP server
- Useful for development

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/jobs` | GET | List all jobs |
| `/api/jobs/submit` | POST | Submit new GPU job |
| `/api/jobs/:nid/scheduled` | POST | Mark job as scheduled |
| `/api/jobs/:nid/started` | POST | Mark job as started |
| `/api/jobs/:nid/progress` | POST | Update job progress |
| `/api/jobs/:nid/completed` | POST | Mark job as completed |

## Data Flow

```
1. Job Submission
   └─> POST /api/jobs/submit
       └─> Create asset on Numbers Protocol
           └─> Returns NID (blockchain asset ID)
               └─> Store job in registry
                   └─> Return TX hash to client

2. Lifecycle Events
   └─> POST /api/jobs/:nid/{scheduled|started|progress|completed}
       └─> Commit event to blockchain
           └─> Update job in registry
               └─> Return TX hash to client

3. Dashboard Display
   └─> GET /api/jobs (every 10s)
       └─> Retrieve all jobs from registry
           └─> Display in React dashboard
               └─> Click card → Show execution log
```

## Storage Architecture

**Current: In-Memory Storage**
- Jobs stored in `Map()` in `backend/server.js`
- Data persists while server is running
- Lost on server restart

**Future: Database Integration**
- Add PostgreSQL or MongoDB
- Persistent storage across restarts
- Query historical data
- Scale to thousands of jobs

## Environment Variables

**Backend (`backend/.env`)**
```bash
# Required
CAPTURE_TOKEN=your_token_here       # Numbers Protocol API token

# Optional
PORT=3002                           # API server port (default: 3002)
ASSET_FILE_BASE_URL=https://...    # Base URL for asset files
```

## Development Workflow

### Local Development
```bash
# Terminal 1: Backend with hot reload
cd backend
npm install
npm start

# Terminal 2: Frontend with Vite dev server
cd frontend
npm install
npm run dev

# Terminal 3: Run tests
./test-complete-lifecycle.sh
```

### Production Build
```bash
# All-in-one
./start-demo.sh

# Or manually
cd backend && npm install && nohup node server.js > /tmp/backend.log 2>&1 &
cd frontend && npm install && npm run build
cd dist && python3 -m http.server 8000 &
```

## Port Configuration

| Port | Service | Access |
|------|---------|--------|
| 3002 | Backend API | REST API endpoint |
| 8000 | Frontend Dashboard | Main UI in browser |
| 3000 | Vite Dev Server | Development mode only |

## External Services

**Numbers Protocol**
- **Capture API**: https://api.numbersprotocol.io/api/v3
- **Asset Verification**: https://verify.numbersprotocol.io/asset-profile/{nid}
- **Mainnet Explorer**: https://mainnet.num.network/

## Testing Strategy

1. **Unit Tests** (Future)
   - Backend API endpoint validation
   - Event commit verification
   - Job registry operations

2. **Integration Tests**
   - `test-complete-lifecycle.sh` - Full lifecycle
   - Manual curl commands
   - Dashboard UI testing

3. **Blockchain Verification**
   - Check transaction hashes on explorer
   - Verify asset metadata
   - Confirm event commits

## Deployment Options

1. **Local Development**
   - Clone repository
   - Install Node.js 18+
   - Run `./start-demo.sh`
   - Access at http://localhost:8000

2. **Cloud Deployment** (Production-Ready)
   - Backend: Railway, Render, Heroku, or DigitalOcean
   - Frontend: Vercel, Netlify, or static hosting
   - Database: PostgreSQL on Supabase or AWS RDS
   - Database: PostgreSQL on Supabase

---

**This structure supports the complete GPU receipt verification pipeline with minimal dependencies and maximum clarity!** 🚀
