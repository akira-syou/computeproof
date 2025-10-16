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

ComputeProof creates an **immutable GPU job receipt pipeline** where every compute task—from submission to completion—is recorded as ERC-7053 commits on Numbers Mainnet. Perfect for AI training verification, distributed computing marketplaces, and compliance auditing.

### Key Features

✅ **Complete Lifecycle Tracking** - Submit → Schedule → Start → Progress → Complete  
✅ **Verifiable Receipts** - Every state transition recorded on-chain  
✅ **Resource Metrics** - GPU hours, costs, and utilization tracked  
✅ **Output Provenance** - Link trained models to compute resources used  
✅ **Billing Transparency** - Immutable records for dispute resolution  

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
         │  Receipt Service API  │
         │  (Node.js + Express)  │
         └──────────┬────────────┘
                    │
        ┌───────────▼───────────┐
        │   Numbers Mainnet     │
        │  ERC-7053 Commits     │
        └───────────┬───────────┘
                    │
         ┌──────────▼──────────┐
         │   Audit Dashboard    │
         │  (React + Charts)    │
         └─────────────────────┘
```

---

## 📋 Event Types

### 1. JobSubmitted
Initial job registration with GPU requirements, docker image, and estimated duration.

### 2. JobScheduled  
Assignment to specific GPU node with specs and queue position.

### 3. JobStarted
Execution begins with container ID, process ID, and GPU allocation.

### 4. JobProgressUpdate (Optional)
Periodic checkpoints during execution with progress percentage and metrics.

### 5. JobCompleted
Success status with output artifacts, final metrics, and GPU hours used.

### 6. JobFailed
Error logging with error code, stack trace, and retry information.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Blockchain** | Numbers Mainnet (Avalanche Subnet) |
| **Standard** | ERC-7053 |
| **SDK** | Capture SDK |
| **Frontend** | React 18 + TailwindCSS |
| **Backend** | Node.js + Express |
| **Storage** | IPFS (via Capture API) |
| **Monitoring** | Job state watchers |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Capture account with API token ([Register here](https://captureapp.xyz))
- NUM tokens for gas (contact Numbers team)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/computeproof.git
cd computeproof
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment**
```bash
# In backend/.env
CAPTURE_TOKEN=your_capture_token_here
PORT=3002

# In frontend/.env
REACT_APP_API_URL=http://localhost:3002
```

4. **Get your Capture Token**
- Go to [Capture Dashboard](https://captureapp.xyz)
- Navigate to **Dashboard → Overview**
- Copy your **Capture Token**
- Paste it in `backend/.env`

5. **Run the application**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

6. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002
- Health check: http://localhost:3002/health

---

## 🧪 Testing the Demo

### Quick Test Flow

Run the automated test script:

```bash
chmod +x test-gpu-flow.sh
./test-gpu-flow.sh
```

This will:
1. Submit 2 GPU jobs (training + inference)
2. Record lifecycle events (submit → start → complete)
3. Generate transaction hashes
4. Save results to `gpu-test-results.txt`

### Manual Testing

**Submit a Job:**
```bash
curl -X POST http://localhost:3002/api/jobs/submit \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "gpu-job-2025-1001",
    "jobType": "training",
    "gpuRequirement": {
      "type": "NVIDIA-A100",
      "count": 4
    }
  }'
```

**Start the Job:**
```bash
curl -X POST http://localhost:3002/api/jobs/YOUR_NID/started \
  -H "Content-Type: application/json" \
  -d '{"executorNode": "gpu-node-01"}'
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

## 🔗 Live Demo

- **Demo Application:** [https://computeproof.vercel.app](https://computeproof.vercel.app)
- **Demo Video:** [https://youtu.be/YOUR_VIDEO_ID](https://youtu.be/YOUR_VIDEO_ID)
- **Sample Job:** [View on Numbers](https://verify.numbersprotocol.io/asset-profile/bafybei...)

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