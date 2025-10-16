# DEVPOST SUBMISSION - TRACK B - COPY-PASTE READY

## 📌 PROJECT NAME
```
ComputeProof: Verifiable GPU Usage Audit System
```

## 📌 TAGLINE (Max 80 characters)
```
Immutable GPU job receipts with ERC-7053 commits for billing transparency
```

## 📌 WHICH TRACK?
☑️ **Track B: Proof Your GPU Usage** ($2,500 prize pool)

---

## 📌 PROJECT DESCRIPTION (Main Submission Text)

Copy everything below this line:

---

## 🎯 Inspiration

GPU compute marketplaces and AI training workflows suffer from a critical trust gap. How do you prove:
- That a job actually ran for 4.2 GPU hours, not 4.0?
- Which specific resources produced which AI model?
- That billing disputes have transparent, verifiable evidence?

With AI compute costs reaching thousands of dollars per training run, and distributed GPU marketplaces growing rapidly, we need **immutable receipts** for every compute job. Current systems rely on centralized logs that can be manipulated or disputed.

ComputeProof solves this by creating a **verifiable audit trail** using Numbers Protocol's ERC-7053 commits on blockchain, where every GPU job state is permanently recorded and independently verifiable.

## 💡 What it does

ComputeProof records the complete lifecycle of GPU compute jobs as verifiable on-chain receipts:

1. **Job Submission** → Creates a unique NID with GPU requirements and job config
2. **Job Scheduling** → Records which node received the job
3. **Job Execution** → Logs start time, container ID, and GPU allocation
4. **Progress Updates** → Optional checkpoints during long-running jobs
5. **Job Completion** → Records output artifacts, metrics, and actual resource usage
6. **Job Failure** → Captures error details for debugging

Each event is committed to Numbers Mainnet as an ERC-7053 commit, creating a transparent, tamper-proof timeline. Compute providers, users, and auditors can verify the complete history at any time.

**Key Innovation:** Unlike traditional logging systems, ComputeProof provides **cryptographically verifiable receipts** that no single party can manipulate, perfect for billing disputes and compliance auditing.

## 🏗️ How we built it

**Architecture:**
- **Backend API:** Node.js + Express handling job lifecycle events
- **Capture SDK Integration:** Asset registration and commit operations
- **Numbers Mainnet:** ERC-7053 commits for all state transitions
- **Audit Dashboard:** React + TailwindCSS with real-time metrics
- **Storage:** IPFS via Capture API for job configs and outputs

**Technical Flow:**
1. Job submitted via API → Registered as asset on Numbers Protocol
2. State transitions (schedule, start, progress, complete) → Each commits to blockchain
3. Dashboard queries asset history → Renders chronological timeline
4. Metrics calculated from on-chain data → GPU hours, costs, efficiency
5. All transactions verifiable on Numbers Mainnet explorer

**Implementation Highlights:**
- Event schema supporting 6 different job states
- Idempotency handling to prevent duplicate commits
- Selective disclosure for sensitive job configurations
- Metrics aggregation from distributed blockchain events
- Real-time dashboard with job filtering and search

## 🧩 Challenges we ran into

1. **State Machine Complexity:** Designing a flexible event schema that handles success, failure, and retry scenarios while keeping gas costs reasonable.

2. **Privacy vs. Transparency:** GPU job configs often contain proprietary information (docker images, datasets). We implemented selective disclosure using hash commitments—public metadata visible on-chain, sensitive data hashed.

3. **Metrics Calculation:** Computing accurate GPU hours and costs from blockchain timestamps required careful handling of time zones and potential clock drift between nodes.

4. **Ordering Guarantees:** Blockchain confirmations can arrive out-of-order. We implemented both on-chain ordering (block number) and application-level ordering (custom timestamps) for correct timeline display.

5. **Testing Without Real GPUs:** Simulating realistic GPU job workflows without actual Kubernetes/Slurm infrastructure. We created a comprehensive test script that mimics real job state transitions.

## 🎓 What we learned

- **ERC-7053 for Compute Workflows:** Adapting a digital media standard to track computational processes—an unexpected but powerful use case.

- **Blockchain as Audit Log:** Understanding when blockchain provides value over traditional databases (tamper-proof records vs. query performance).

- **Cost-Benefit Analysis:** Balancing the cost of on-chain commits against the value of immutable receipts. For expensive GPU jobs ($100+/hour), commit costs ($0.01) are negligible.

- **Numbers Protocol Ecosystem:** Deep understanding of Capture SDK workflows, parent-child asset relationships, and asset history queries.

- **Real-World Applicability:** GPU marketplaces like Render Network and Akash could benefit immediately from this verification layer. The AI training market alone is projected to exceed $100B by 2030.

## 🚀 What's next for ComputeProof

**Immediate Integrations:**
- Kubernetes sidecar container for automatic event logging
- Slurm adapter for HPC environment integration
- GitHub Actions for CI/CD GPU job tracking
- CLI tool for developers (`computeproof submit job.yaml`)

**Platform Expansion:**
- Integration with GPU marketplaces (Render, Akash, Vast.ai)
- Support for multi-cloud environments (AWS, GCP, Azure GPU instances)
- Carbon footprint calculation from verified GPU hours
- Smart contract automation for milestone-based payments

**Advanced Features:**
- ML model provenance linking (which compute → which model)
- Anomaly detection for suspicious resource usage
- Cost optimization recommendations based on historical data
- Insurance products backed by verifiable compute records

**Enterprise Use Cases:**
- **Research Institutions:** Grant reporting with verified compute usage
- **AI Companies:** Regulatory compliance for model training logs
- **Cloud Providers:** Dispute resolution with immutable evidence
- **Carbon Markets:** GPU carbon offset programs with verified data

ComputeProof demonstrates how Numbers Protocol can bring trust and transparency to any resource-intensive computational process, not just digital media.

---

## 📌 BUILT WITH (Tags)

Add these tags to your submission:

```
numbers-protocol
erc-7053
blockchain
capture-sdk
ipfs
gpu-compute
ai-training
nodejs
react
avalanche
web3
audit-trail
resource-tracking
billing-transparency
verification
```

---

## 📌 LINKS

**GitHub Repository:**
```
https://github.com/YOURUSERNAME/computeproof
```

**Demo Video (YouTube/Loom):**
```
https://youtu.be/YOUR_VIDEO_ID
```

**Live Demo:**
```
https://computeproof.vercel.app
```

**Sample Job on Numbers:**
```
https://verify.numbersprotocol.io/asset-profile/bafybei...
```

**Transaction Proof (Numbers Mainnet):**
```
https://mainnet.num.network/tx/0xYOUR_TX_HASH
```

**Documentation:**
```
https://github.com/YOURUSERNAME/computeproof/blob/main/README.md
```

---

## 📌 IMAGES TO UPLOAD

You need 3-5 screenshots showing:

1. **Dashboard Overview** (Cover Image - Most Important!)
   - Show job list with stats (GPU hours, costs, status)
   
2. **Job Detail View**
   - Display complete event timeline for a single job
   
3. **Event Detail**
   - Show specific commit with transaction hash and metrics
   
4. **Asset Profile on Numbers**
   - Screenshot from verify.numbersprotocol.io
   
5. **Transaction on Block Explorer**
   - Screenshot from mainnet.num.network showing on-chain proof

**Screenshot Tips:**
- Use dark theme (looks more professional for GPU/tech)
- Show real job data, not placeholders
- Include visible transaction hashes
- Make metrics prominent (GPU hours, costs)

---

## 📌 SUBMISSION REQUIREMENTS CHECKLIST

Before clicking "Submit Project", verify you have:

✅ **Working Demo:** 2 jobs with JobSubmitted → JobCompleted receipts  
✅ **On-chain Proof:** Real transaction hashes on Numbers Mainnet  
✅ **Audit UI:** Dashboard showing complete job history  
✅ **Documentation:** Comprehensive README with lifecycle diagram  
✅ **Demo Video:** ≤ 5 minutes showing submit → monitor → audit  
✅ **GitHub Repo:** Public with all code and setup instructions  
✅ **Screenshots:** 3-5 images uploaded to submission  
✅ **Transaction Links:** Explorer URLs included in description  

---

## 📌 BOUNTY REQUIREMENTS MET

**Track B: Proof Your GPU Usage**

✅ **Minimum 2 Jobs with 2 Events Each:** We have 2 jobs with 5 and 3 events respectively

✅ **JobSubmitted → JobCompleted Flow:** Both jobs show complete lifecycle

✅ **On-chain Proof:** All transaction hashes verifiable on mainnet.num.network

✅ **Audit UI:** React dashboard with job history and metrics visualization

✅ **Documentation:** README includes lifecycle diagram, event schema, API specs

✅ **Video Demo:** [5-minute walkthrough showing both jobs completing]

✅ **Numbers Mainnet:** All commits use Numbers Protocol infrastructure

✅ **Capture SDK:** Asset registration and commit API fully implemented

---

## 📌 NOTES FOR JUDGES

**Why ComputeProof Stands Out:**

1. **Complete Implementation:** Full job lifecycle with 6 event types (exceeded minimum requirement)
2. **Real-World Ready:** Solves actual problem in $100B+ AI training market
3. **Production Architecture:** Clean separation of concerns, proper error handling
4. **Metrics Dashboard:** Non-technical users can understand GPU usage and costs
5. **Extensible Design:** Easy to integrate with K8s, Slurm, cloud providers

**Technical Excellence:**
- Idempotency handling for reliable commits
- Selective disclosure for sensitive job data
- Comprehensive event schema covering success and failure paths
- Timeline ordering with multiple fallback strategies
- Real-time metrics calculation from blockchain data

**Numbers Protocol Mastery:**
- Deep understanding of ERC-7053 for compute workflows
- Correct Capture SDK integration
- Parent-child asset relationships (jobs → output artifacts)
- Asset history queries with filtering and aggregation

**Market Opportunity:**
- GPU marketplaces need transparent billing
- AI companies need audit trails for compliance
- Research institutions need verifiable grant reporting
- Carbon markets need verified compute usage data

We're excited to bring blockchain provenance to the compute industry!

---

**END OF SUBMISSION TEXT**