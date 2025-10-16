# ComputeProof - Quick Start Guide

## 🚀 ComputeProof - Quick Start Guide

**Get running in 5 minutes!**

> 📚 **Other Guides:**
> - Full documentation → [`README.md`](README.md)
> - Dashboard guide → [`DASHBOARD.md`](DASHBOARD.md)
> - Project structure → [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)

---

## 📋 Prerequisites

- Node.js 18+ and npm
- **Capture Token** from Numbers Protocol ([Get one here](https://captureapp.xyz))

## ⚡ Quick Start (5 minutes)

### 1. Clone and Setup

```bash
git clone https://github.com/akira-syou/computeproof.git
cd computeproof
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env and add your CAPTURE_TOKEN
```

### 3. Start Everything

```bash
cd ..
./start-demo.sh
```

This will:
- ✅ Install all dependencies
- ✅ Start backend API (port 3002)
- ✅ Build and serve frontend (port 8000)
- ✅ Connect to Numbers Mainnet blockchain

### 4. Access Dashboard

Open http://localhost:8000 in your browser

### 5. Create Your First GPU Job

```bash
./test-complete-lifecycle.sh
```

Watch the dashboard! You'll see:
- New job card appears
- Status changes in real-time
- Click the card to see terminal-style execution log
- All blockchain transaction hashes are clickable!

---

## 📊 What You'll See

### Dashboard Features
- **Job Cards** with status badges (Submitted → Scheduled → Running → Completed)
- **Real-time Updates** every 10 seconds
- **GPU Requirements** and event counts
- **Blockchain Verification** links

### Execution Log (Click any card)
```
╔════════════════════════════════════════════════════════╗
║    GPU Job Receipt - Complete Lifecycle Log           ║
╚════════════════════════════════════════════════════════╝

[1/5] Submitting GPU training job...
✓ Job submitted
  Job ID: gpu-job-hackathon-1760641565
  Job NID: bafkreihzui3unrkr43zbmm3bcun3usimslixoszi43qkdln6k36qvvut5a
  TX Hash: 0x220f82df24da50e9b1ec2fc4c5c45cc16b08de05...
  
[2/5] Scheduling job on GPU node...
✓ Job Scheduled
  Node: gpu-node-05
  TX Hash: 0x61c09f75a9e8eac59ee0cd56599668f8ad77f3fc...
  
... and so on through completion!

✅ All events successfully recorded on Numbers blockchain!
```

---

## 🧪 Available Commands

| Command | Description |
|---------|-------------|
| `./start-demo.sh` | Start backend + frontend |
| `./stop-demo.sh` | Stop all services |
| `./test-complete-lifecycle.sh` | Create complete GPU job (5 events) |
| `./complete-job.sh <nid>` | Complete a submitted job |
| `./serve-dashboard.sh` | Rebuild and serve frontend |

---

## 🔗 Important URLs

| Service | URL | Notes |
|---------|-----|-------|
| **Dashboard** | http://localhost:8000 | Main UI |
| **Backend API** | http://localhost:3002 | REST API |
| **Health Check** | http://localhost:3002/health | Verify backend is running |
| **Asset Verification** | https://verify.numbersprotocol.io/asset-profile/{nid} | View on Numbers Protocol |
| **Blockchain Explorer** | https://mainnet.num.network/ | View transactions |

---

## 🎯 Next Steps

1. **Explore the Dashboard** - Click job cards to see execution logs
2. **Create More Jobs** - Run `./test-complete-lifecycle.sh` multiple times
3. **Verify on Blockchain** - Click any transaction hash or 🌐 icon
4. **Complete Partial Jobs** - Use `./complete-job.sh` to finish submitted jobs
5. **Check Documentation** - See `README.md` for API details and architecture

---

## ❓ Troubleshooting

**Dashboard shows nothing?**
- Verify backend is running: `curl http://localhost:3002/health`
- Check backend logs: `tail -f /tmp/backend.log`

**No jobs appearing?**
- Run `./test-complete-lifecycle.sh` to create a job
- Verify API responds: `curl http://localhost:3002/api/jobs`

**Connection errors?**
- Ensure both backend (port 3002) and frontend (port 8000) are running
- Check firewall settings if accessing remotely

---

**You're ready! Start creating verifiable GPU receipts on the blockchain! 🎉**

### Step 1: Start the Demo
```bash
./start-demo.sh
```

This will:
- Install all dependencies
- Start backend API on http://localhost:3002
- Start frontend dashboard on http://localhost:3000

### Step 2: Run the Test
```bash
# In a new terminal
./test-complete-lifecycle.sh
```

Watch as it:
- Submits a GPU job
- Records all lifecycle events (5 stages)
- Generates blockchain transaction hashes
- Creates complete audit trail

### Step 3: View the Dashboard
Open http://localhost:3000 in your browser

You'll see:
- GPU job receipts with full history
- Event timelines with timestamps
- Cost calculations and metrics
- Blockchain transaction links

### Stop the Demo
```bash
./stop-demo.sh
```

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `./start-demo.sh` | Start backend + frontend |
| `./stop-demo.sh` | Stop all servers |
| `./test-complete-lifecycle.sh` | Run automated test |

---

## 🔌 API Endpoints

**Submit Job:**
```bash
POST http://localhost:3002/api/jobs/submit
```

**Schedule Job:**
```bash
POST http://localhost:3002/api/jobs/{nid}/scheduled
```

**Start Job:**
```bash
POST http://localhost:3002/api/jobs/{nid}/started
```

**Update Progress:**
```bash
POST http://localhost:3002/api/jobs/{nid}/progress
```

**Complete Job:**
```bash
POST http://localhost:3002/api/jobs/{nid}/completed
```

**Get Job History:**
```bash
GET http://localhost:3002/api/jobs/{nid}/history
```

**Health Check:**
```bash
GET http://localhost:3002/health
```

---

## 🎯 What This Demo Shows

✅ **GPU Job Registration** - Submit jobs with GPU requirements  
✅ **Blockchain Receipts** - Every event recorded on Numbers Protocol  
✅ **Complete Lifecycle** - Track from submission to completion  
✅ **Cost Tracking** - Calculate GPU hours and costs  
✅ **Audit Trail** - Immutable history for compliance  
✅ **Mock Mode** - Works without external APIs or tokens  

---

## 🐛 Troubleshooting

**Backend won't start?**
```bash
# Check if port 3002 is in use
lsof -ti:3002 | xargs kill -9

# Restart
cd backend && npm start
```

**Frontend won't start?**
```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9

# Restart
cd frontend && npm start
```

**Dependencies issues?**
```bash
# Clean install
rm -rf backend/node_modules frontend/node_modules
./start-demo.sh
```

---

## 📚 Learn More

- Full README: `README.md`
- API Documentation: `docs/API.md`
- Devpost Submission: `docs/DEVPOST_SUBMISSION.md`
- Numbers Protocol: https://numbersprotocol.io
- ERC-7053 Standard: https://eips.ethereum.org/EIPS/eip-7053

---

## 💡 Quick Tips

1. **Mock Mode** is enabled by default (no API tokens needed)
2. **Test script** creates sample data automatically
3. **Dashboard** shows pre-loaded sample jobs
4. **All scripts** are executable - just run them!
5. **Check health** with `curl http://localhost:3002/health`

---

## 🎥 Recording a Demo

1. Start the demo: `./start-demo.sh`
2. Open dashboard: http://localhost:8000
3. Run test in split terminal: `./test-complete-lifecycle.sh`
4. Record your screen showing both!
5. Upload to YouTube for hackathon submission

---

**Need help?** Check the full README.md or open an issue!
