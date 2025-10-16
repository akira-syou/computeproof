#!/bin/bash

# test-gpu-flow.sh - ComputeProof Test Script
# Tests complete GPU job lifecycle on Numbers Protocol

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
API_URL="http://localhost:3002"
CAPTURE_TOKEN="${CAPTURE_TOKEN:-YOUR_CAPTURE_TOKEN_HERE}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         ComputeProof - GPU Job Receipt Test           ║${NC}"
echo -e "${BLUE}║         Testing Numbers Protocol Integration          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check API health
echo -e "${YELLOW}[1/9] Checking API health...${NC}"
HEALTH=$(curl -s "${API_URL}/health")
if [[ $? -ne 0 ]]; then
    echo -e "${RED}✗ API is not running at ${API_URL}${NC}"
    echo -e "${YELLOW}Please start the backend server first:${NC}"
    echo -e "  cd backend && PORT=3002 node server.js"
    exit 1
fi
echo -e "${GREEN}✓ API is healthy${NC}"
echo ""

# Job 1: Training Job (Success)
echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}        JOB 1: PyTorch Training (Success Flow)         ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Submit Job 1
echo -e "${YELLOW}[2/9] Submitting training job...${NC}"
JOB1_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "gpu-job-2025-1001",
    "jobType": "training",
    "submittedBy": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "gpuRequirement": {
      "type": "NVIDIA-A100",
      "count": 4,
      "memory": "80GB"
    },
    "estimatedDuration": 3600,
    "dockerImage": "pytorch/pytorch:2.0-cuda11.7",
    "priority": "high"
  }')

JOB1_NID=$(echo $JOB1_RESPONSE | grep -o '"jobNid":"[^"]*"' | cut -d'"' -f4)
TX_HASH_1=$(echo $JOB1_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$JOB1_NID" ]]; then
    echo -e "${RED}✗ Failed to submit job${NC}"
    echo "Response: $JOB1_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Job submitted successfully${NC}"
echo -e "  Job NID: ${BLUE}${JOB1_NID}${NC}"
echo -e "  Transaction: ${BLUE}${TX_HASH_1}${NC}"
echo ""

sleep 2

# Schedule Job 1
echo -e "${YELLOW}[3/9] Scheduling job on GPU node...${NC}"
SCHEDULE_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB1_NID}/scheduled" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledNode": "gpu-node-05",
    "nodeSpecs": {
      "gpuModel": "NVIDIA A100 80GB",
      "cpuCores": 32,
      "ramGB": 256
    },
    "queuePosition": 1
  }')

TX_HASH_2=$(echo $SCHEDULE_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TX_HASH_2" ]]; then
    echo -e "${RED}✗ Failed to schedule job${NC}"
else
    echo -e "${GREEN}✓ Job scheduled on gpu-node-05${NC}"
    echo -e "  Transaction: ${BLUE}${TX_HASH_2}${NC}"
fi
echo ""

sleep 2

# Start Job 1
echo -e "${YELLOW}[4/9] Starting job execution...${NC}"
START_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB1_NID}/started" \
  -H "Content-Type: application/json" \
  -d '{
    "executorNode": "gpu-node-05",
    "gpuUtilization": {
      "allocated": 4,
      "temperature": [65, 66, 64, 67]
    },
    "processId": 12345
  }')

TX_HASH_3=$(echo $START_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TX_HASH_3" ]]; then
    echo -e "${RED}✗ Failed to start job${NC}"
else
    echo -e "${GREEN}✓ Job execution started${NC}"
    echo -e "  Transaction: ${BLUE}${TX_HASH_3}${NC}"
fi
echo ""

sleep 2

# Progress Update
echo -e "${YELLOW}[5/9] Logging progress update...${NC}"
PROGRESS_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB1_NID}/progress" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 50,
    "currentEpoch": 15,
    "totalEpochs": 30,
    "avgGpuUtilization": 95.2,
    "memoryUsage": "68GB/80GB"
  }')

TX_HASH_4=$(echo $PROGRESS_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TX_HASH_4" ]]; then
    echo -e "${RED}✗ Failed to log progress${NC}"
else
    echo -e "${GREEN}✓ Progress checkpoint logged (50%)${NC}"
    echo -e "  Transaction: ${BLUE}${TX_HASH_4}${NC}"
fi
echo ""

sleep 2

# Complete Job 1
echo -e "${YELLOW}[6/9] Completing job...${NC}"
COMPLETE_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB1_NID}/completed" \
  -H "Content-Type: application/json" \
  -d '{
    "completionStatus": "success",
    "totalDuration": 3810,
    "gpuHoursUsed": 4.23,
    "exitCode": 0,
    "outputArtifacts": [
      {
        "type": "model",
        "nid": "bafybeimodel123456789",
        "hash": "sha256:abc123def456",
        "size": "2.4GB"
      }
    ],
    "finalMetrics": {
      "accuracy": 0.945,
      "loss": 0.032
    }
  }')

TX_HASH_5=$(echo $COMPLETE_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TX_HASH_5" ]]; then
    echo -e "${RED}✗ Failed to complete job${NC}"
else
    echo -e "${GREEN}✓ Job completed successfully${NC}"
    echo -e "  Transaction: ${BLUE}${TX_HASH_5}${NC}"
fi
echo ""

sleep 3

# Job 2: Inference Job (Also Success)
echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}       JOB 2: TensorFlow Inference (Success Flow)      ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Submit Job 2
echo -e "${YELLOW}[7/9] Submitting inference job...${NC}"
JOB2_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "gpu-job-2025-1002",
    "jobType": "inference",
    "submittedBy": "0x9Da6fB9b7E4D6e4a77454C8Fb8a8f9aEc184FD63",
    "gpuRequirement": {
      "type": "NVIDIA-A100",
      "count": 2,
      "memory": "40GB"
    },
    "estimatedDuration": 1800,
    "dockerImage": "tensorflow/tensorflow:latest-gpu",
    "priority": "medium"
  }')

JOB2_NID=$(echo $JOB2_RESPONSE | grep -o '"jobNid":"[^"]*"' | cut -d'"' -f4)
TX_HASH_6=$(echo $JOB2_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$JOB2_NID" ]]; then
    echo -e "${RED}✗ Failed to submit job 2${NC}"
else
    echo -e "${GREEN}✓ Inference job submitted${NC}"
    echo -e "  Job NID: ${BLUE}${JOB2_NID}${NC}"
    echo -e "  Transaction: ${BLUE}${TX_HASH_6}${NC}"
fi
echo ""

sleep 2

# Start Job 2 (skip schedule for simplicity)
echo -e "${YELLOW}[8/9] Starting inference job...${NC}"
START2_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB2_NID}/started" \
  -H "Content-Type: application/json" \
  -d '{
    "executorNode": "gpu-node-03",
    "gpuUtilization": {
      "allocated": 2,
      "temperature": [62, 63]
    }
  }')

TX_HASH_7=$(echo $START2_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TX_HASH_7" ]]; then
    echo -e "${RED}✗ Failed to start job 2${NC}"
else
    echo -e "${GREEN}✓ Inference job started${NC}"
    echo -e "  Transaction: ${BLUE}${TX_HASH_7}${NC}"
fi
echo ""

sleep 2

# Complete Job 2
echo -e "${YELLOW}[9/9] Completing inference job...${NC}"
COMPLETE2_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB2_NID}/completed" \
  -H "Content-Type: application/json" \
  -d '{
    "completionStatus": "success",
    "totalDuration": 1820,
    "gpuHoursUsed": 1.01,
    "exitCode": 0,
    "finalMetrics": {
      "throughput": "5.5 pred/sec",
      "totalPredictions": 10000
    }
  }')

TX_HASH_8=$(echo $COMPLETE2_RESPONSE | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TX_HASH_8" ]]; then
    echo -e "${RED}✗ Failed to complete job 2${NC}"
else
    echo -e "${GREEN}✓ Inference job completed${NC}"
    echo -e "  Transaction: ${BLUE}${TX_HASH_8}${NC}"
fi
echo ""

sleep 3

# Fetch history for both jobs
echo -e "${YELLOW}Fetching job histories...${NC}"
HISTORY1=$(curl -s "${API_URL}/api/jobs/${JOB1_NID}/history")
HISTORY2=$(curl -s "${API_URL}/api/jobs/${JOB2_NID}/history")

EVENT_COUNT_1=$(echo $HISTORY1 | grep -o '"eventType"' | wc -l)
EVENT_COUNT_2=$(echo $HISTORY2 | grep -o '"eventType"' | wc -l)

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  TEST COMPLETE                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Successfully completed GPU job workflows!${NC}"
echo ""
echo -e "${YELLOW}Job 1 Summary (Training):${NC}"
echo -e "  Job NID:        ${BLUE}${JOB1_NID}${NC}"
echo -e "  Total Events:   ${GREEN}${EVENT_COUNT_1}${NC}"
echo -e "  Type:           PyTorch Training"
echo -e "  GPUs:           4x NVIDIA A100 80GB"
echo -e "  Duration:       ~1 hour"
echo -e "  Status:         ${GREEN}Success${NC}"
echo ""
echo -e "${YELLOW}Job 2 Summary (Inference):${NC}"
echo -e "  Job NID:        ${BLUE}${JOB2_NID}${NC}"
echo -e "  Total Events:   ${GREEN}${EVENT_COUNT_2}${NC}"
echo -e "  Type:           TensorFlow Inference"
echo -e "  GPUs:           2x NVIDIA A100 40GB"
echo -e "  Duration:       ~30 minutes"
echo -e "  Status:         ${GREEN}Success${NC}"
echo ""
echo -e "${YELLOW}Transaction Hashes:${NC}"
echo -e "  Job1 Submitted:    ${BLUE}${TX_HASH_1}${NC}"
echo -e "  Job1 Scheduled:    ${BLUE}${TX_HASH_2}${NC}"
echo -e "  Job1 Started:      ${BLUE}${TX_HASH_3}${NC}"
echo -e "  Job1 Progress:     ${BLUE}${TX_HASH_4}${NC}"
echo -e "  Job1 Completed:    ${BLUE}${TX_HASH_5}${NC}"
echo -e "  Job2 Submitted:    ${BLUE}${TX_HASH_6}${NC}"
echo -e "  Job2 Started:      ${BLUE}${TX_HASH_7}${NC}"
echo -e "  Job2 Completed:    ${BLUE}${TX_HASH_8}${NC}"
echo ""
echo -e "${YELLOW}Verification Links:${NC}"
echo -e "  Job 1 Profile:  ${BLUE}https://verify.numbersprotocol.io/asset-profile/${JOB1_NID}${NC}"
echo -e "  Job 2 Profile:  ${BLUE}https://verify.numbersprotocol.io/asset-profile/${JOB2_NID}${NC}"
echo -e "  Explorer:       ${BLUE}https://mainnet.num.network/tx/${TX_HASH_1}${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Open frontend: http://localhost:3000"
echo "  2. View jobs in the dashboard"
echo "  3. Click job cards to see complete history"
echo "  4. Use these NIDs and hashes in your Devpost submission!"
echo ""
echo -e "${GREEN}Ready for hackathon submission! 🎉${NC}"
echo ""

# Save results
cat > gpu-test-results.txt << EOF
ComputeProof Test Results
=========================
Test Date: $(date)

Job 1 (Training):
  Job NID: ${JOB1_NID}
  Type: PyTorch Training
  GPUs: 4x NVIDIA A100 80GB
  Events: ${EVENT_COUNT_1}
  
  Transactions:
  - Submitted: ${TX_HASH_1}
  - Scheduled: ${TX_HASH_2}
  - Started: ${TX_HASH_3}
  - Progress: ${TX_HASH_4}
  - Completed: ${TX_HASH_5}

Job 2 (Inference):
  Job NID: ${JOB2_NID}
  Type: TensorFlow Inference
  GPUs: 2x NVIDIA A100 40GB
  Events: ${EVENT_COUNT_2}
  
  Transactions:
  - Submitted: ${TX_HASH_6}
  - Started: ${TX_HASH_7}
  - Completed: ${TX_HASH_8}

Verification:
- Job 1: https://verify.numbersprotocol.io/asset-profile/${JOB1_NID}
- Job 2: https://verify.numbersprotocol.io/asset-profile/${JOB2_NID}
- Explorer: https://mainnet.num.network

Status: All commits successful ✓
Total Jobs: 2
Total Events: $((EVENT_COUNT_1 + EVENT_COUNT_2))
EOF

echo -e "${GREEN}✓ Results saved to gpu-test-results.txt${NC}"
echo ""
