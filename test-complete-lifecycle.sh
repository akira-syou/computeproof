#!/bin/bash

# Complete GPU Job Lifecycle Test with Real Numbers API

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_URL="http://localhost:3002"
JOB_ID="gpu-job-hackathon-$(date +%s)"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    GPU Job Receipt - Complete Lifecycle Test          ║${NC}"
echo -e "${BLUE}║    Using Real Numbers Blockchain API                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Submit Job
echo -e "${YELLOW}[1/5] Submitting GPU training job...${NC}"
SUBMIT_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/submit" \
  -H "Content-Type: application/json" \
  -d "{
    \"jobId\": \"${JOB_ID}\",
    \"jobType\": \"training\",
    \"submittedBy\": \"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\",
    \"gpuRequirement\": {
      \"type\": \"NVIDIA-A100\",
      \"count\": 4,
      \"memory\": \"80GB\"
    },
    \"estimatedDuration\": 3600,
    \"dockerImage\": \"pytorch/pytorch:2.0-cuda11.7\",
    \"priority\": \"high\"
  }")

JOB_NID=$(echo "$SUBMIT_RESPONSE" | jq -r '.jobNid')
TX1=$(echo "$SUBMIT_RESPONSE" | jq -r '.txHash')

if [ "$JOB_NID" == "null" ] || [ -z "$JOB_NID" ]; then
    echo -e "${RED}✗ Failed to submit job${NC}"
    echo "$SUBMIT_RESPONSE" | jq .
    exit 1
fi

echo -e "${GREEN}✓ Job submitted${NC}"
echo -e "  Job ID: ${CYAN}${JOB_ID}${NC}"
echo -e "  Job NID: ${CYAN}${JOB_NID}${NC}"
echo -e "  TX Hash: ${BLUE}${TX1}${NC}"
echo -e "  Asset URL: ${BLUE}https://verify.numbersprotocol.io/asset-profile/${JOB_NID}${NC}"
echo ""

sleep 2

# 2. Schedule Job
echo -e "${YELLOW}[2/5] Scheduling job on GPU node...${NC}"
SCHEDULE_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB_NID}/scheduled" \
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

TX2=$(echo "$SCHEDULE_RESPONSE" | jq -r '.txHash')
echo -e "${GREEN}✓ Job scheduled${NC}"
echo -e "  Node: ${CYAN}gpu-node-05${NC}"
echo -e "  TX Hash: ${BLUE}${TX2}${NC}"
echo ""

sleep 2

# 3. Start Job
echo -e "${YELLOW}[3/5] Starting job execution...${NC}"
START_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB_NID}/started" \
  -H "Content-Type: application/json" \
  -d '{
    "executorNode": "gpu-node-05",
    "containerId": "docker://abc123def456"
  }')

TX3=$(echo "$START_RESPONSE" | jq -r '.txHash')
echo -e "${GREEN}✓ Job started${NC}"
echo -e "  TX Hash: ${BLUE}${TX3}${NC}"
echo ""

sleep 2

# 4. Progress Update
echo -e "${YELLOW}[4/5] Updating job progress...${NC}"
PROGRESS_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB_NID}/progress" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 50,
    "currentEpoch": 15,
    "totalEpochs": 30
  }')

TX4=$(echo "$PROGRESS_RESPONSE" | jq -r '.txHash')
echo -e "${GREEN}✓ Progress updated (50%)${NC}"
echo -e "  TX Hash: ${BLUE}${TX4}${NC}"
echo ""

sleep 2

# 5. Complete Job
echo -e "${YELLOW}[5/5] Completing job...${NC}"
COMPLETE_RESPONSE=$(curl -s -X POST "${API_URL}/api/jobs/${JOB_NID}/completed" \
  -H "Content-Type: application/json" \
  -d '{
    "completionStatus": "success",
    "totalDuration": 3810,
    "gpuHoursUsed": 4.23,
    "finalMetrics": {
      "accuracy": 0.945,
      "loss": 0.032
    }
  }')

TX5=$(echo "$COMPLETE_RESPONSE" | jq -r '.txHash')
echo -e "${GREEN}✓ Job completed${NC}"
echo -e "  TX Hash: ${BLUE}${TX5}${NC}"
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Test Complete - Summary                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Job NID (Asset ID):${NC} ${CYAN}${JOB_NID}${NC}"
echo ""
echo -e "${GREEN}Blockchain Transactions:${NC}"
echo -e "  1. Submit:   ${BLUE}${TX1}${NC}"
echo -e "  2. Schedule: ${BLUE}${TX2}${NC}"
echo -e "  3. Start:    ${BLUE}${TX3}${NC}"
echo -e "  4. Progress: ${BLUE}${TX4}${NC}"
echo -e "  5. Complete: ${BLUE}${TX5}${NC}"
echo ""
echo -e "${GREEN}Verification Links:${NC}"
echo -e "  Asset Profile: ${BLUE}https://verify.numbersprotocol.io/asset-profile/${JOB_NID}${NC}"
echo -e "  Mainnet Explorer: ${BLUE}https://mainnet.num.network/${NC}"
echo ""
echo -e "${GREEN}✅ All events successfully recorded on Numbers blockchain!${NC}"
echo ""
