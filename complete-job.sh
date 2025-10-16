#!/bin/bash

# Complete a submitted job lifecycle
NID="$1"

if [ -z "$NID" ]; then
    echo "Usage: $0 <job_nid>"
    echo ""
    echo "Available submitted jobs:"
    curl -s http://localhost:3002/api/jobs | jq -r '.jobs[] | select(.status == "submitted") | "  - " + .jobNid + " (" + .jobId + ")"'
    exit 1
fi

echo "🚀 Completing job lifecycle for: $NID"
echo ""

echo "⏰ Step 1/4: Scheduling job..."
curl -s -X POST "http://localhost:3002/api/jobs/$NID/scheduled" \
  -H "Content-Type: application/json" \
  -d '{"scheduledNode":"gpu-node-07"}' | jq -r '.message'
sleep 3

echo ""
echo "▶️  Step 2/4: Starting job..."
curl -s -X POST "http://localhost:3002/api/jobs/$NID/started" \
  -H "Content-Type: application/json" \
  -d '{"executorNode":"gpu-node-07"}' | jq -r '.message'
sleep 3

echo ""
echo "📊 Step 3/4: Updating progress..."
curl -s -X POST "http://localhost:3002/api/jobs/$NID/progress" \
  -H "Content-Type: application/json" \
  -d '{"progress":75,"currentEpoch":22,"totalEpochs":30}' | jq -r '.message'
sleep 3

echo ""
echo "✅ Step 4/4: Completing job..."
curl -s -X POST "http://localhost:3002/api/jobs/$NID/completed" \
  -H "Content-Type: application/json" \
  -d '{"completionStatus":"success","totalDuration":4200,"gpuHoursUsed":4.67}' | jq -r '.message'

echo ""
echo "════════════════════════════════════════════════════════"
echo "✨ Job lifecycle complete!"
echo "📊 Refresh your dashboard and click the job card to see"
echo "   the complete terminal-style execution log!"
echo "════════════════════════════════════════════════════════"
