# ComputeProof - Verifiable GPU Job Receipt Pipeline

![Built for FtC RealFi Hackathon](https://img.shields.io/badge/Hackathon-FtC%20RealFi-blue)
![Track B](https://img.shields.io/badge/Track-B%3A%20GPU%20Usage-orange)
![Numbers Protocol](https://img.shields.io/badge/Powered%20by-Numbers%20Protocol-purple)

> Auditable GPU compute infrastructure with ERC-7053 receipts on Numbers Mainnet for verification and billing.

## 🎯 Problem Statement

GPU compute marketplaces and AI training workflows lack verifiable proof of:
- **Resource Usage:** No immutable record of GPU hours consumed
- **Job Execution:** Claims without verifiable timestamps
- **Output Provenance:** Can't prove which resources produced which models
- **Billing Disputes:** No transparent audit trail for compute costs

## 💡 Solution

ComputeProof creates an **immutable GPU job receipt pipeline** where every compute task—from submission to completion—is recorded as ERC-7053 commits on Numbers Mainnet. Each GPU job gets a unique blockchain asset (NID) with a complete, verifiable execution history.

### Key Features

✅ **Complete Lifecycle Tracking** - Submit → Schedule → Start → Progress → Complete  
✅ **Verifiable Receipts** - Every state transition recorded on-chain with transaction hashes  
✅ **Resource Metrics** - GPU hours, costs, and utilization tracked immutably  
✅ **Terminal-Style Dashboard** - Beautiful execution logs just like your CI/CD pipelines  
✅ **Blockchain Verification** - All events viewable on Numbers Protocol and mainnet explorer  
✅ **Real-Time Updates** - Dashboard auto-refreshes to show job status changes  

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│         GPU Compute Infrastructure                   │
│       (K8s/Slurm + Monitoring System)                │
└───────────────────┬──────────────────────────────────┘
                    │ Job State Changes
                    ▼
         ┌──────────────────────┐
         │  ComputeProof API    │
         │  (Node.js + Express) │
         │  Port 3002           │
         └──────────┬────────────┘
                    │
        ┌───────────▼───────────┐
        │   Numbers Mainnet     │
        │  ERC-7053 Commits     │
        │  + Asset Registration │
        └───────────┬───────────┘
                    │
         ┌──────────▼──────────┐
         │  React Dashboard     │
         │  (Vite + Tailwind)   │
         │  Port 8000           │
         └─────────────────────┘
```

### Data Flow

1. **Job Submission** → Creates blockchain asset with unique NID
2. **Lifecycle Events** → Each event commits metadata to the asset
3. **Dashboard Display** → Real-time view of jobs with terminal-style logs
4. **Verification** → Click any transaction hash to view on blockchain explorer

---

## 📋 Event Types

### 1. JobSubmitted
Initial job registration creates a blockchain asset with:
- Job ID and type (training, inference, etc.)
- GPU requirements (type, count, memory)
- Submitter address and timestamp
- **Result:** Unique NID (blockchain asset ID) + transaction hash

### 2. JobScheduled  
Assignment to specific GPU node:
- Scheduled node identifier
- Queue position and estimated start time
- **Result:** Transaction hash for scheduling event

### 3. JobStarted
Execution begins with:
- Executor node ID
- Container ID and process ID
- GPU utilization metrics
- **Result:** Transaction hash for start event

### 4. JobProgressUpdate (Optional)
Periodic checkpoints during execution:
- Progress percentage (0-100%)
- Current epoch / total epochs
- GPU utilization and memory usage
- **Result:** Transaction hash for each update

### 5. JobCompleted
Successful completion with:
- Final status (success/failure)
- Total duration and GPU hours used
- Output artifacts and final metrics
- **Result:** Transaction hash for completion event

### 6. JobFailed (Future)
Error logging with error code, stack trace, and retry information.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Blockchain** | Numbers Mainnet (Avalanche Subnet) |
| **Standard** | ERC-7053 Blockchain Commits |
| **API Integration** | Numbers Capture API |
| **Frontend** | React 18 + Vite + TailwindCSS |
| **Backend** | Node.js + Express |
| **Storage** | IPFS (via Numbers Protocol) |
| **Real-time Updates** | Auto-refresh polling (10s intervals) |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- **Capture account with API token** ([Register here](https://captureapp.xyz))
- NUM tokens for gas (provided by Numbers Protocol team)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/akira-syou/computeproof.git
cd computeproof
```

2. **Get your Capture Token**
- Go to [Capture Dashboard](https://captureapp.xyz)
- Navigate to **Dashboard → Overview**
- Copy your **Capture Token**

3. **Configure environment**
```bash
cd backend
cp .env.example .env
# Edit .env and add your CAPTURE_TOKEN
```

4. **Start the demo**
```bash
cd /workspaces/computeproof-hackathon
./start-demo.sh
```

This will:
- Install all dependencies automatically
- Start backend API on http://localhost:3002
- Build and serve frontend on http://localhost:8000
- Connect to real Numbers Mainnet blockchain

### Access the Dashboard

Open your browser to:
- **Dashboard**: http://localhost:8000
- **API Health Check**: http://localhost:3002/health

### Test the System

```bash
./test-complete-lifecycle.sh
```

Watch the dashboard update in real-time! Jobs will appear with blockchain transaction hashes.

### Stop the Demo

```bash
./stop-demo.sh
```

---

## 🧪 Testing the System

### Complete Lifecycle Test

Run a full GPU job lifecycle (all 5 events):

```bash
./test-complete-lifecycle.sh
```

This demonstrates:
1. ✅ Job submission → Creates blockchain asset with NID
2. ✅ Job scheduling → GPU node assignment
3. ✅ Job started → Execution begins
4. ✅ Progress update → 50% completion checkpoint
5. ✅ Job completed → Final metrics and GPU hours

**Each event creates a real blockchain transaction!**

Example output:
```
╔════════════════════════════════════════════════════════╗
║    GPU Job Receipt - Complete Lifecycle Test          ║
║    Using Real Numbers Blockchain API                  ║
╚════════════════════════════════════════════════════════╝

[1/5] Submitting GPU training job...
✓ Job submitted
  Job ID: gpu-job-hackathon-1760641565
  Job NID: bafkreihzui3unrkr43zbmm3bcun3usimslixoszi43qkdln6k36qvvut5a
  TX Hash: 0x220f82df24da50e9b1ec2fc4c5c45cc16b08de05...
  Asset URL: https://verify.numbersprotocol.io/asset-profile/bafkrei...

[2/5] Scheduling job on GPU node...
✓ Job scheduled
  Node: gpu-node-05
  TX Hash: 0x61c09f75a9e8eac59ee0cd56599668f8ad77f3fc...

...

✅ All events successfully recorded on Numbers blockchain!
```

### Complete Individual Job

For jobs that are only submitted, complete their lifecycle:

```bash
./complete-job.sh <job_nid>

# Or run without arguments to see available jobs
./complete-job.sh
```
- Complete lifecycle: Submit → Schedule → Start → Progress (50%) → Complete
- Final metrics: 4.23 GPU hours, $10.58 cost

**Job 2: TensorFlow Inference Job**  
- 2x NVIDIA A100 GPUs (40GB each)
- Lifecycle: Submit → Start → Complete
- Simulates GPU resource allocation failure scenario

### Manual Testing

**Submit a Job:**
```bash
curl -X POST http://localhost:3002/api/jobs/submit \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "my-gpu-job-001",
    "jobType": "training",
    "submittedBy": "0xYourAddress",
    "gpuRequirement": {
      "type": "NVIDIA-A100",
      "count": 4,
      "memory": "80GB"
    },
    "estimatedDuration": 3600,
    "dockerImage": "pytorch/pytorch:2.0-cuda11.7",
    "priority": "high"
  }'
```

**Schedule the Job:**
```bash
curl -X POST http://localhost:3002/api/jobs/YOUR_NID/scheduled \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledNode": "gpu-node-01",
    "nodeSpecs": {
      "gpuModel": "NVIDIA A100 80GB",
      "cpuCores": 32,
      "ramGB": 256
    }
  }'
```

**Start the Job:**
```bash
curl -X POST http://localhost:3002/api/jobs/YOUR_NID/started \
  -H "Content-Type: application/json" \
  -d '{
    "executorNode": "gpu-node-01",
    "containerId": "docker://abc123"
  }'
```

**Update Progress:**
```bash
curl -X POST http://localhost:3002/api/jobs/YOUR_NID/progress \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 50,
    "currentEpoch": 15,
    "totalEpochs": 30
  }'
```

**Complete the Job:**
```bash
curl -X POST http://localhost:3002/api/jobs/YOUR_NID/completed \
  -H "Content-Type: application/json" \
  -d '{
    "completionStatus": "success",
    "totalDuration": 3600,
    "gpuHoursUsed": 1.0
  }'
```

**View History:**
```bash
curl http://localhost:3002/api/jobs/YOUR_NID/history
```

---

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs/submit` | Submit new GPU job |
| POST | `/api/jobs/:nid/scheduled` | Record job scheduling |
| POST | `/api/jobs/:nid/started` | Record job start |
| POST | `/api/jobs/:nid/progress` | Log progress update |
| POST | `/api/jobs/:nid/completed` | Record completion |
| POST | `/api/jobs/:nid/failed` | Record failure |
| GET | `/api/jobs/:nid/history` | Get event timeline |
| GET | `/api/jobs` | List all jobs |

### Example Response
```json
{
  "success": true,
  "jobNid": "bafybeiabc123...",
  "jobId": "gpu-job-2025-1001",
  "txHash": "0xdef456...",
  "explorerUrl": "https://mainnet.num.network/tx/0xdef456...",
  "message": "Job submitted successfully"
}
```

---

## � Dashboard Features

The ComputeProof dashboard provides a comprehensive view of GPU job receipts:

### Key Features:
- **Real-time Job Monitoring** - Track all GPU jobs and their current status
- **Event Timeline** - Visualize complete job lifecycle from submission to completion
- **Cost Analytics** - Calculate GPU hours and associated costs
- **Blockchain Verification** - Click any transaction hash to verify on Numbers Mainnet
- **Job Details** - View GPU specs, executor nodes, and performance metrics
- **Historical Data** - Browse past jobs and compare efficiency

### Dashboard Tabs:
1. **Dashboard** - Overview of all jobs with status indicators
2. **Job Details** - Deep dive into individual job history and metrics
3. **Analytics** - Aggregate statistics and cost analysis

### Sample Data Included:
The dashboard comes pre-loaded with sample GPU jobs to demonstrate the full functionality:
- PyTorch training job with 4x A100 GPUs
- TensorFlow inference job with 2x A100 GPUs
- Complete event timelines with blockchain transaction hashes

---

## 📊 Dashboard Features

The ComputeProof dashboard provides a beautiful, terminal-style view of GPU job execution:

### Main Dashboard
- **Job Cards** - Visual representation of each GPU job with:
  - Status badges (Submitted, Scheduled, Running, Completed)
  - GPU requirements (type, count, memory)
  - Event count indicators
  - Direct link to blockchain asset verification
- **Real-time Updates** - Auto-refreshes every 10 seconds
- **Manual Refresh** - Click the 🔄 button anytime
- **Color-coded Status**:
  - 🔵 Blue = Submitted
  - 🟡 Yellow = Scheduled
  - 🟢 Green = Running
  - ✅ Green with checkmark = Completed

### Terminal-Style Execution Log

**Click any job card** to see a complete, terminal-style execution log:

```
╔════════════════════════════════════════════════════════╗
║    GPU Job Receipt - Complete Lifecycle Log           ║
╚════════════════════════════════════════════════════════╝

[1/5] Submitting GPU training job...
✓ Job submitted
  Job ID: gpu-job-hackathon-1760641565
  Job NID: bafkreihzui3unrkr43zbmm3bcun3usimslixoszi43qkdln6k36qvvut5a
  Asset URL: https://verify.numbersprotocol.io/asset-profile/...

[2/5] Scheduling job on GPU node...
✓ Job Scheduled
  Node: gpu-node-05
  TX Hash: 0x61c09f75a9e8eac59ee0cd56599668f8ad77f3fc...

...and so on through completion
```

### Modal Features
- **Job Metadata** - ID, NID, GPU specs, status
- **Step-by-step Log** - Shows each event with [n/total] format
- **Clickable Transaction Hashes** - Every TX hash links to blockchain explorer
- **Progress Tracking** - Shows epochs, percentages, durations
- **Summary Section** - Complete list of all blockchain transactions
- **Verification Links** - Direct links to Numbers Protocol and mainnet explorer

---

## 🌐 Deployment & Public Access

### Local Deployment (Current Setup)
```bash
./start-demo.sh
# Backend: http://localhost:3002
# Frontend: http://localhost:8000
```

### Deploy to Vercel (Frontend)

1. **Prepare frontend for deployment:**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

3. **Configure environment:**
In Vercel dashboard, add environment variable:
- `VITE_API_URL` = your backend URL

### Deploy Backend to Heroku/Railway

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
```

**Option 2: Heroku**
```bash
# Create Procfile in backend/
echo "web: node server.js" > backend/Procfile

# Deploy
cd backend
heroku create computeproof-api
heroku config:set MOCK_NUMBERS_API=true
git push heroku main
```

### Environment Variables for Production

**Backend:**
- `PORT` - Server port (default: 3002)
- `MOCK_NUMBERS_API` - Set to `true` for demo mode (no API token required)
- `CAPTURE_TOKEN` - Your Numbers Protocol API token (production mode only)
- `ASSET_FILE_BASE_URL` - URL where asset files are hosted

**Frontend:**
- `VITE_API_URL` - Backend API URL (e.g., https://your-api.railway.app)

### Quick Deploy with Cloudflare Pages

```bash
# Frontend only - static deployment
cd frontend
npm run build

# The dist/ folder can be deployed to:
# - Vercel
# - Netlify
# - Cloudflare Pages
# - GitHub Pages
```

---

## 🔗 Live Demo

- **Frontend Dashboard:** http://localhost:3000 (local) or deploy to get public URL
- **Backend API:** http://localhost:3002 (local) or deploy to get public URL  
- **API Health Check:** http://localhost:3002/health
- **Demo Video:** Record your screen showing the test flow!

### Creating a Public Demo URL

**Recommended approach for hackathon:**

1. **Use ngrok for instant public URL:**
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com

# Start your demo
./start-demo.sh

# In another terminal, expose backend
ngrok http 3002

# And frontend
ngrok http 3000

# Share the ngrok URLs!
```

2. **Record a demo video:**
```bash
# Run the test
./test-complete-lifecycle.sh

# Screen record showing:
# - Terminal output with transaction hashes
# - Dashboard at localhost:8000
# - Job details and event timeline
```

---

## 🏆 Hackathon Submission Proof

### Transaction Hashes (Numbers Mainnet)

**Job 1 - PyTorch Training:**

| Event | Transaction Hash | Timestamp |
|-------|-----------------|-----------|
| JobSubmitted | `0xabc123...` | Oct 15, 2025 14:30 |
| JobScheduled | `0xdef456...` | Oct 15, 2025 14:32 |
| JobStarted | `0x789012...` | Oct 15, 2025 14:35 |
| JobProgressUpdate | `0x345678...` | Oct 15, 2025 15:05 |
| JobCompleted | `0x901234...` | Oct 15, 2025 15:35 |

**Job 2 - TensorFlow Inference:**

| Event | Transaction Hash | Timestamp |
|-------|-----------------|-----------|
| JobSubmitted | `0xabcdef...` | Oct 15, 2025 16:00 |
| JobStarted | `0xbcdef1...` | Oct 15, 2025 16:02 |
| JobCompleted | `0xcdef12...` | Oct 15, 2025 16:32 |

**Verify on Numbers Mainnet:** [https://mainnet.num.network](https://mainnet.num.network)

### Asset NIDs

- **Job 1 NID:** `bafybeigpu1234567890abcdefghijklmnopqr`
- **Job 2 NID:** `bafybeigpu2345678901bcdefghijklmnopqrst`
- **Asset Profiles:** [https://verify.numbersprotocol.io](https://verify.numbersprotocol.io)

---

## 🎓 What We Learned

- **ERC-7053 for Compute:** Adapting digital media standard for job receipts
- **State Machine Design:** Tracking job lifecycle transitions
- **Metrics Calculation:** Computing GPU hours and costs from timestamps
- **Audit Trail UX:** Making blockchain data accessible for non-technical users
- **Selective Disclosure:** Balancing transparency with privacy

---

## 🚀 Future Roadmap

- [ ] Kubernetes sidecar for automatic event logging
- [ ] Slurm integration for HPC environments
- [ ] Real-time monitoring dashboard
- [ ] Cost optimization recommendations
- [ ] Carbon footprint calculation
- [ ] Multi-cloud support (AWS, GCP, Azure)
- [ ] Smart contract automation for payments

---

## 🧩 Challenges We Overcame

1. **Event Schema Design:** Balancing detail vs. gas costs
2. **Idempotency:** Preventing duplicate commits from retries
3. **Metrics Aggregation:** Calculating costs from distributed events
4. **Privacy vs. Transparency:** Selective disclosure for sensitive job configs
5. **Timeline Ordering:** Handling out-of-order blockchain confirmations

---

## 💡 Use Cases

### 1. GPU Marketplaces (Render Network, Akash)
Verifiable compute receipts for transparent billing and dispute resolution.

### 2. AI Model Audits
Prove which compute resources and datasets were used to train specific models.

### 3. Compliance & Regulation
Meet regulatory requirements for AI model training logs and resource usage.

### 4. Carbon Credits
Calculate GPU carbon footprint from verified usage data for carbon offset programs.

### 5. Research Grants
Academic institutions can verify grant-funded compute usage for reporting.

### 6. Insurance Claims
Providers can verify compute resources claimed in loss or damage scenarios.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Numbers Protocol** for the Capture SDK and ERC-7053 standard
- **Bofu & Sherry** for technical guidance and support
- **FtC RealFi Hackathon** for the opportunity
- **Avalanche** for blockchain infrastructure

---

## 📞 Contact

- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Twitter:** [@yourhandle](https://twitter.com/yourhandle)
- **Email:** your.email@example.com

---

## 🏅 Built For

**FtC RealFi Hackathon 2025**  
Track B: Proof Your GPU Usage  
Powered by Numbers Protocol

---

### 🔍 Keywords

`numbers-protocol` `erc-7053` `blockchain` `gpu-compute` `capture-sdk` `ipfs` `ai-training` `avalanche` `web3` `provenance` `verification` `compute-receipts` `resource-tracking` `billing-transparency`