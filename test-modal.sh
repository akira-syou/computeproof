#!/bin/bash

# Quick test to create a single job for testing the modal

echo "Creating a test job..."

# Submit job
RESPONSE=$(curl -s -X POST http://localhost:3002/api/jobs/submit \
  -H "Content-Type: application/json" \
  -H "X-Capture-Token: ${CAPTURE_TOKEN}" \
  -d '{
    "jobId": "test-job-'$(date +%s)'",
    "model": "llama-3.1-70b",
    "dataset": "openwebtext",
    "gpu": "A100-80GB",
    "estimatedTime": "2h"
  }')

JOB_NID=$(echo $RESPONSE | jq -r '.jobNid')

if [ "$JOB_NID" != "null" ] && [ -n "$JOB_NID" ]; then
  echo "✅ Job created with NID: $JOB_NID"
  echo ""
  echo "Now:"
  echo "1. Open dashboard: http://localhost:8000"
  echo "2. Click on the job card"
  echo "3. Modal should open!"
  echo ""
  echo "Check browser console (F12) for debug logs"
else
  echo "❌ Failed to create job"
  echo "Response: $RESPONSE"
fi
