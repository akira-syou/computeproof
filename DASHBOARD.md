# 📊 ComputeProof Dashboard Guide# 📊 Dashboard Guide



Complete guide to the GPU Job Receipt Dashboard with blockchain integration.Complete guide to using the ComputeProof GPU Job Receipt Dashboard.



## 🚀 Quick Start## 🚀 Quick Access



### Access Dashboard### Accessing the Dashboard



```bash**Local Development:**

./start-demo.sh  # Starts backend + frontend```

# Open: http://localhost:8000http://localhost:8000

``````



**Manual Setup:**The dashboard is served on port 8000 after running `./start-demo.sh`.

```bash

cd backend && npm start          # Port 3002---

cd frontend/dist && python3 -m http.server 8000

```## ✨ Dashboard Features



---### Main Dashboard View



## ✨ Dashboard Features**Job Cards** - Each GPU job displayed as a card with:

- 📛 **Job ID** and blockchain asset NID

### 1. 🔑 Token Management- 🎯 **Status Badge** with color coding:

  - 🔵 Blue = Submitted (waiting to be scheduled)

**Purple Configuration Panel (Top of Page)**  - 🟡 Yellow = Scheduled (assigned to GPU node)

  - 🟢 Green = Running (actively executing)

- 🔒 **Password-masked input** - Securely enter your CAPTURE API token  - ✅ Green checkmark = Completed (finished successfully)

- 💾 **Save button** - Stores token in browser localStorage- 💻 **GPU Requirements**: Type, count, memory (e.g., "NVIDIA-A100 x 4")

- 🔄 **Auto-load** - Token persists across refreshes- 📊 **Event Count**: Number of blockchain events recorded

- ✅ **Visual confirmation** - Shows "✓ Saved"- 🌐 **Verification Link**: Click to view asset on Numbers Protocol

- 🔐 **Secure** - Sent via `X-Capture-Token` header

**Auto-Refresh**

**How to Use:**- Dashboard updates every 10 seconds automatically

1. Paste Numbers Protocol CAPTURE API token- Manual refresh available with 🔄 button

2. Click "Save"

3. Token used for all blockchain operations### Terminal-Style Execution Log



### 2. 🎮 Interactive Demo**Click any job card** to see a beautiful terminal-style execution log:



**Run Complete Demo Button:****Features:**

- ▶️ One-click execution of full GPU job lifecycle- 📋 **Header with job details**: Job ID, NID, GPU requirements, status

- 📋 Executes 5 stages automatically:- 🖥️ **Terminal-style output**: Green borders, monospace font, colored text

  1. ✅ Submit Job → Register on blockchain- 📝 **Step-by-step log**: Shows each event with [1/5], [2/5] format

  2. 📅 Schedule Job → Assign to GPU node- 🔗 **Clickable transaction hashes**: All blockchain TXs are links

  3. ▶️ Start Execution → Begin training- 📊 **Progress tracking**: Shows epoch counts, percentages, durations

  4. 📊 Progress Updates (3x) → Track progress- ✅ **Summary section**: Complete list of all blockchain transactions

  5. ✅ Complete Job → Finalize results- 🔍 **Verification links**: Direct links to asset profile and explorer

- 🎨 Green-to-blue gradient styling

- 🔒 Disabled until token entered**Example Log View:**

- ⛓️ Creates real blockchain commits```

╔════════════════════════════════════════════════════════╗

**Refresh Jobs Button:**║    GPU Job Receipt - Complete Lifecycle Log           ║

- 🔄 Manual refresh╚════════════════════════════════════════════════════════╝

- ⏳ Spinning icon while loading

- Auto-refresh every 5 seconds[1/5] Submitting GPU training job...

✓ Job submitted

### 3. 📊 Real-time Status  Job ID: gpu-job-hackathon-1760641565

  Job NID: bafkreihzui3...

**Live Updates During Demo:**  Asset URL: https://verify.numbersprotocol.io/asset-profile/...

- "Submitting job..."

- "Job submitted! NID: bafybei..."[2/5] Scheduling job on GPU node...

- "Scheduling job..."✓ Job Scheduled

- "Starting job execution..."  Node: gpu-node-05

- "Progress update 1/3..." / "2/3..." / "3/3..."  TX Hash: 0x61c09f75a9e8eac...

- "Completing job..."

- "✅ Demo complete! Refreshing..."[3/5] Starting job execution...

✓ Job Started

**Color-Coded:**  Executor: gpu-node-05

- 🔵 Blue - In progress  TX Hash: 0x7ab74a67ed4187f...

- 🟢 Green - Success

- 🔴 Red - Error[4/5] Updating job progress...

✓ Job Progress Update

---  Progress: 50% (Epoch 15/30)

  TX Hash: 0x3b34c961657ba5f...

## 📋 Job Cards

[5/5] Completing job...

### Statistics Summary✓ Job Completed

  Status: success

Three cards show real-time metrics:  Duration: 3810s

1. **Total Jobs** (Blue)  GPU Hours: 4.23

2. **On Blockchain** (Green)   TX Hash: 0x24cbd202b4c286b...

3. **Total Events** (Purple)

╔════════════════════════════════════════════════════════╗

### Job Card Details║              Execution Complete - Summary              ║

╚════════════════════════════════════════════════════════╝

**Information Displayed:**

- 📛 Job ID✅ All events successfully recorded on Numbers blockchain!

- 🔗 NID (blockchain asset ID)```

- 🏷️ Type badge (training/inference)

- 🎯 Status badge:## 🚀 Try It Now!

  - 🟡 Submitted

  - 🟠 Scheduled### View Existing Jobs

  - 🔵 Running1. **Open your dashboard** (should already be open in Simple Browser)

  - 🟢 Completed2. **Click the completed job card** (the green one with ✅ status)

- 💻 GPU requirements3. **See the full terminal-style log** with all blockchain transactions!

- 👤 Submitted by (address)

- 📊 Event count### Complete a New Job

- 🌐 External verification linkRun this command to finish one of the submitted jobs:



**Interactions:**```bash

- 🖱️ **Click card** → Opens execution log modalcd /workspaces/computeproof-hackathon

- 🔗 **Click link** → Opens Numbers Protocol asset page

# Complete a specific job

**Sorting:**./complete-job.sh bafkreie5kh6cgt7da2afcpo4kdktu2pfvbqv7thrgfqapldihcaq3gfese

- ⬇️ Latest jobs first (descending by creation time)

- 🔄 Updates automatically# Or run without arguments to see available jobs

./complete-job.sh

---```



## 🖥️ Terminal-Style Execution Log**Watch the dashboard:**

- Job status will change: submitted → scheduled → running → completed

### Opening the Modal- Auto-refresh every 10 seconds (or click 🔄 Refresh button)

- Click the card to see the complete log!

**Click any job card** to see detailed execution log

### Create Brand New Job

### Modal Components```bash

# Run complete lifecycle test (creates new job with all events)

**Header:**./test-complete-lifecycle.sh

- Job ID, NID, type```

- GPU requirements

- Status (color-coded)## 📋 Dashboard Features Summary

- Verification link

- Close button (×)### Main Dashboard

- ✅ Real-time job cards with status colors

**Terminal Log:**- ✅ GPU requirement badges  

- 🟢 Green borders (classic terminal)- ✅ Event count indicators

- 📝 Monospace font- ✅ Auto-refresh every 10 seconds

- 🎨 Color-coded:- ✅ Manual refresh button

  - Yellow - Step headers [1/5]- ✅ Direct links to Numbers Protocol asset verification

  - Green - Success ✓

  - White - Details### Job Log Modal (Click any card)

  - Blue - Clickable links- ✅ Complete job metadata (ID, NID, GPU, status)

- 📊 Progress indicators- ✅ Terminal-style execution log with color-coded output

- ✅ Step-by-step event timeline with progress tracking

### Example Log- ✅ All blockchain transaction hashes (clickable)

- ✅ Event details (nodes, progress %, epochs, duration, GPU hours)

```- ✅ Summary with verification links

╔════════════════════════════════════════════════════════╗- ✅ Color-coded status indicators

║    GPU Job Receipt - Complete Lifecycle Log           ║

╚════════════════════════════════════════════════════════╝### Blockchain Integration

- ✅ Every event recorded on Numbers Protocol blockchain

[1/5] Submitting GPU training job...- ✅ Verifiable asset profiles at https://verify.numbersprotocol.io/

✓ Job submitted- ✅ Clickable transaction hashes to mainnet explorer

  Job ID: gpu-job-1729108665- ✅ Immutable audit trail for all GPU compute

  Job NID: bafkreih4obg6iozeseeh4svhyzioex4a4x2i7qcklegc7ponoioknvkpl4

  Asset URL: https://verify.numbersprotocol.io/asset-profile/bafk...---



[2/5] Scheduling job on GPU node...## 🧪 Try It Now

✓ Job Scheduled

  Node: gpu-node-7### 1. View Existing Jobs

  TX Hash: 0x61c09f75a9e8eac... (clickable)1. **Open your dashboard** at http://localhost:8000

2. **Click any job card** (try the completed one with ✅ status)

[3/5] Starting job execution...3. **See the full terminal-style log** with all blockchain transactions!

✓ Job Started

  Executor: gpu-node-7### 2. Create a New Complete Job

  TX Hash: 0x7ab74a67ed4187f... (clickable)```bash

cd /workspaces/computeproof-hackathon

[4/5] Updating job progress..../test-complete-lifecycle.sh

✓ Job Progress Update```

  Progress: 30% (Epoch 10/30)

  TX Hash: 0x3b34c961657ba5f... (clickable)**Watch the dashboard (auto-refreshes every 10s):**

- New job appears as "submitted" (blue badge)

[5/5] Completing job...- Wait for auto-refresh or click 🔄

✓ Job Completed- Click the card to see complete execution log

  Status: success

  Duration: 3810s### 3. Complete a Partial Job

  GPU Hours: 4.23```bash

  TX Hash: 0x24cbd202b4c286b... (clickable)# List available jobs

./complete-job.sh

╔════════════════════════════════════════════════════════╗

║              Execution Complete - Summary              ║# Complete a specific job

╚════════════════════════════════════════════════════════╝./complete-job.sh <job_nid>

```

Job NID: bafkreih4obg6iozeseeh4svhyzioex4a4x2i7q...

Blockchain Transactions:**Watch real-time updates:**

  • 0x61c09f75a9e8eac... → View on Explorer- Job status changes: submitted → scheduled → running → completed

  • 0x7ab74a67ed4187f... → View on Explorer- Event count increases with each step

  • 0x3b34c961657ba5f... → View on Explorer- Click card to see new events appearing in the log

  • 0x24cbd202b4c286b... → View on Explorer

---

✅ All events successfully recorded on Numbers blockchain!

```## 🔍 Troubleshooting



All TX hashes link to: `https://mainnet.num.network/tx/{txHash}`### Dashboard shows empty/blank page?



---**Check browser console (F12)** - You should see:

```

## 🐛 Troubleshooting🔧 API URL: http://localhost:3002

```

### Modal Doesn't Open

**If you see errors about CORS or network:**

**Debug Steps:**1. Verify backend is running: `curl http://localhost:3002/health`

1. Open browser console (F12 → Console)2. Check both services are started: `ps aux | grep -E "node|python"`

2. Click job card3. Restart services: `./stop-demo.sh && ./start-demo.sh`

3. Look for logs:

   ```### No jobs appearing?

   🔍 Fetching job history for: bafybei...

   ✅ Set selectedJob to: bafybei...**Verify backend is running:**

   📦 Received data: {success: true, ...}```bash

   ✅ Set jobHistory: {...}curl http://localhost:3002/health

   ```# Should return: {"status":"ok","service":"ComputeProof API","version":"1.0.0"}

```

**Solutions:**

- No logs? → Refresh page**Check if jobs exist:**

- API error? → Check backend (port 3002)```bash

- "Job not found"? → Run demo firstcurl http://localhost:3002/api/jobs | jq '.jobs | length'

# Should show number of jobs

**Test Manually:**```

```bash

# Check jobs**Create a test job:**

curl http://localhost:3002/api/jobs | jq '.count'```bash

./test-complete-lifecycle.sh

# Test history endpoint```

NID=$(curl -s http://localhost:3002/api/jobs | jq -r '.jobs[0].jobNid')

curl http://localhost:3002/api/jobs/$NID/history | jq '.'### Dashboard not updating?

```

- **Auto-refresh is 10 seconds** - wait a moment

### Demo Button Error- **Click the 🔄 refresh button** manually

- **Hard refresh browser**: Ctrl+Shift+R (Cmd+Shift+R on Mac)

**"❌ Error: Failed to submit job"**- **Restart frontend**: `./serve-dashboard.sh`



**Fixes:**### Events not showing in job log?

1. Enter CAPTURE token

2. Click "Save"- **Only works for jobs with recorded events**

3. Verify token (check `.env`)- **Create a new job**: `./test-complete-lifecycle.sh`

4. Try again- **Complete an existing submitted job**: `./complete-job.sh`



**Verify Backend:**### Cannot connect to backend?

```bash

tail -f /tmp/backend.log**Port conflicts:**

# Should see: "✓ Asset registered" and "✓ Committed"```bash

```# Check if ports are already in use

lsof -i :3002

### Jobs Not Sortedlsof -i :8000



**Solution:**# Kill conflicting processes if needed

```bashkill <PID>

cd frontend && npm run build```

# Hard refresh: Ctrl+Shift+R

```**Firewall issues:**

- Ensure ports 3002 and 8000 are not blocked

### No Jobs Displayed- Check your system firewall settings



**Solution:**---

```bash

./test-modal.sh  # Create test job## 🎯 What You Can See

# OR use "Run Complete Demo" button

```### Complete Job Lifecycle



---1. **Job Submission** 

   - Initial asset registration with unique NID

## 🔧 Technical Details   - GPU requirements recorded

   - Transaction hash for blockchain commit

### Backend

2. **Job Scheduling**

**Token Middleware:**   - GPU node assignment  

```javascript   - Scheduled node identifier

app.use((req, res, next) => {   - Transaction hash

  req.captureToken = req.headers['x-capture-token'] || CONFIG.CAPTURE_TOKEN;

  next();3. **Job Started**

});   - Execution begins

```   - Executor node details

   - Container/process IDs

**History Endpoint:**   - Transaction hash

```javascript

app.get('/api/jobs/:nid/history', async (req, res) => {4. **Progress Updates**

  const job = jobRegistry.get(nid);   - Real-time training progress

  res.json({   - Epoch counts (e.g., 15/30)

    success: true,   - Progress percentage (e.g., 50%)

    jobId: job.jobId,   - Transaction hash for each update

    jobNid: nid,

    events: job.events || []5. **Job Completion**

  });   - Final status (success/failure)

});   - Total duration and GPU hours

```   - Final metrics

   - Transaction hash

### Frontend

**Every single event has a blockchain transaction hash you can verify!**

**Token Storage:**

```javascript---

localStorage.setItem('CAPTURE_API_TOKEN', captureToken);

const savedToken = localStorage.getItem('CAPTURE_API_TOKEN');## 🔗 Verification Links

```

### In the Dashboard

**Sorting:**

```javascript**Job Card 🌐 Icon:**

jobs.sort((a, b) => {```

  const aTime = new Date(a.createdAt || 0).getTime();https://verify.numbersprotocol.io/asset-profile/{nid}

  const bTime = new Date(b.createdAt || 0).getTime();```

  return bTime - aTime; // Latest firstView the complete blockchain asset with all metadata

})

```**Transaction Hash Links:**

```

**Modal Trigger:**https://mainnet.num.network/tx/{txHash}

```javascript```

const fetchJobHistory = async (jobNid) => {View the actual blockchain transaction

  setSelectedJob(jobNid);  // Required

  const data = await fetch(`/api/jobs/${jobNid}/history`);**Mainnet Explorer:**

  setJobHistory(data);     // Required```

};https://mainnet.num.network/

```

// Renders when BOTH set:Browse all transactions on Numbers Protocol mainnet

{selectedJob && jobHistory && (<Modal ... />)}

```### Manual Verification



---**Check a specific asset:**

```bash

## 🔗 Important URLs# Replace with actual NID

https://verify.numbersprotocol.io/asset-profile/bafkreihzui3unrkr43zbmm3bcun3usimslixoszi43qkdln6k36qvvut5a

- **Dashboard**: http://localhost:8000```

- **Backend API**: http://localhost:3002

- **Asset Verification**: https://verify.numbersprotocol.io/asset-profile/{nid}**Check a transaction:**

- **Mainnet Explorer**: https://mainnet.num.network/```bash

# Replace with actual TX hash

---https://mainnet.num.network/tx/0x220f82df24da50e9b1ec2fc4c5c45cc16b08de05f0872c4f671b282fae34ddff

```

## 📝 Summary

---

**What Works:**

- ✅ Token input with localStorage persistence## 💡 Pro Tips

- ✅ One-click complete demo execution

- ✅ Real-time status updates1. **Multiple Jobs**: Run `./test-complete-lifecycle.sh` multiple times to see multiple job cards

- ✅ Jobs sorted latest first2. **Real-time Watching**: Keep dashboard open while running tests to see updates appear

- ✅ Click job → Terminal-style log modal3. **Blockchain Verification**: Click any TX hash to verify it's really on the blockchain

- ✅ All blockchain TXs verifiable on-chain4. **Event Timeline**: The terminal-style log shows exact chronological order of all events

- ✅ Beautiful UI with color coding5. **GPU Metrics**: Progress events show actual GPU utilization and memory usage from the job

- ✅ Auto-refresh every 5 seconds6. **Status Colors**: Quickly scan job status by color - green checkmark means successfully completed



**Key Features:**---

- 🎨 Terminal-style aesthetic

- ⛓️ Real blockchain integration**Your dashboard is production-ready with real blockchain integration! 🎉**

- 🔐 Secure token handling

- 📊 Real-time progress tracking### Main Dashboard

- 🔗 Clickable TX hashes- ✅ Real-time job cards with status colors

- ✅ Complete job lifecycle- ✅ GPU requirement badges

- ✅ Event count indicators

Ready to use! 🚀- ✅ Auto-refresh every 10 seconds

- ✅ Manual refresh button
- ✅ Direct links to Numbers Protocol asset verification

### Job Log Modal (Click any card)
- ✅ Complete job metadata (ID, NID, GPU, status)
- ✅ Terminal-style execution log
- ✅ Step-by-step event timeline with progress tracking
- ✅ All blockchain transaction hashes (clickable)
- ✅ Event details (nodes, progress %, epochs, duration, GPU hours)
- ✅ Summary with verification links
- ✅ Color-coded status indicators

### Blockchain Integration
- ✅ Every event recorded on Numbers Protocol blockchain
- ✅ Verifiable asset profiles
- ✅ Clickable transaction hashes to mainnet explorer
- ✅ C2PA-compatible receipts

## 🎯 What You Can See

1. **Job Submission**: Initial asset registration with NID
2. **Job Scheduling**: GPU node assignment
3. **Job Started**: Execution begins with executor details
4. **Progress Updates**: Real-time training progress with epochs
5. **Job Completion**: Final metrics (duration, GPU hours, status)

All with **clickable blockchain transaction hashes** and **verification links**!

## 🔗 Important URLs

- **Dashboard**: Check PORTS tab → port 8000 → click 🌐
- **Backend API**: Port 3002 (must be publicly accessible)
- **Asset Verification**: https://verify.numbersprotocol.io/asset-profile/{nid}
- **Mainnet Explorer**: https://mainnet.num.network/

---

**Your dashboard is now production-ready with terminal-style logs! 🎉**
