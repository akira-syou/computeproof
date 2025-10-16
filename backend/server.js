// server.js - ComputeProof Backend API
// GPU Job Receipt Pipeline with Numbers Protocol

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
// Prefer native fetch (Node 18+). If not available, load node-fetch and
// handle ESM default export compatibility.
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch.bind(globalThis);
} else {
  // node-fetch v3 is ESM and exposes the fetch function as the default export
  const _nf = require('node-fetch');
  fetch = _nf.default || _nf;
}

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const CONFIG = {
  CAPTURE_TOKEN: process.env.CAPTURE_TOKEN || 'YOUR_CAPTURE_TOKEN_HERE',
  API_BASE: 'https://api.numbersprotocol.io/api/v3',
  COMMIT_API: 'https://us-central1-numbers-protocol-api.cloudfunctions.net/nit-commit-to-jade'
};

// Base URL to use for mock asset files when registering with Numbers API.
// This should be a valid HTTPS URL. You can override with env var
// ASSET_FILE_BASE_URL. Default points to example.com for mock-up data.
CONFIG.ASSET_FILE_BASE_URL = process.env.ASSET_FILE_BASE_URL || 'https://example.com/assets';

// Local mock mode: when true, the server will not call external Numbers APIs
// and will instead return synthetic NIDs and transaction hashes. This is
// useful for offline testing. Enable by setting MOCK_NUMBERS_API=true.
const MOCK = (process.env.MOCK_NUMBERS_API === 'true');

// Helper: Generate SHA256 hash
function generateSHA256(data) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
}

// Helper: Commit event to blockchain
async function commitEvent(jobNid, eventData, commitMessage) {
  if (MOCK) {
    // Return a fake commit result
    return {
      success: true,
      txHash: `0xMOCK_TX_${eventData.eventType}_${Math.random().toString(36).substring(2,10)}`
    };
  }

  const response = await fetch(CONFIG.COMMIT_API, {
    method: 'POST',
    headers: {
      'Authorization': `token ${CONFIG.CAPTURE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      encodingFormat: 'application/json',
      assetCid: jobNid,
      assetTimestampCreated: eventData.timestamp,
      assetCreator: eventData.executor || 'system',
      assetSha256: generateSHA256(eventData),
      abstract: `Event: ${eventData.eventType}`,
      commitMessage: commitMessage,
      custom: eventData
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to commit event: ${error}`);
  }

  return await response.json();
}

// 1. Submit GPU Job
app.post('/api/jobs/submit', async (req, res) => {
  try {
    const {
      jobId,
      jobType,
      submittedBy,
      gpuRequirement,
      estimatedDuration,
      dockerImage,
      inputDataHash,
      priority
    } = req.body;

    const jobData = {
      jobId,
      jobType: jobType || 'training',
      submittedBy: submittedBy || '0xDefaultAddress',
      gpuRequirement: gpuRequirement || { type: 'NVIDIA-A100', count: 1, memory: '40GB' },
      estimatedDuration: estimatedDuration || 3600,
      dockerImage: dockerImage || 'pytorch/pytorch:2.0-cuda11.7',
      inputDataHash: inputDataHash || generateSHA256({ job: jobId }),
      priority: priority || 'medium',
      status: 'submitted',
      timestamp: Math.floor(Date.now() / 1000)
    };

    // Register job as asset. Use a valid HTTPS asset_file URL pointing to
    // mock-up data so the Numbers API validation accepts it. The actual
    // content can be stored externally; for testing we provide a placeholder
    // URL built from CONFIG.ASSET_FILE_BASE_URL.
  const assetFileUrl = `${CONFIG.ASSET_FILE_BASE_URL}/${encodeURIComponent(jobId)}.json`;
  console.log(`Registering asset with asset_file URL: ${assetFileUrl}`);

  const response = await fetch(`${CONFIG.API_BASE}/assets/`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${CONFIG.CAPTURE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asset_file: assetFileUrl,
        abstract: `GPU Job: ${jobId}`,
        custom_fields: jobData
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to register job: ${error}`);
    }

    const result = await response.json();

    // Commit JobSubmitted event
    const eventData = {
      eventType: 'JobSubmitted',
      jobId,
      jobType: jobData.jobType,
      submittedBy: jobData.submittedBy,
      gpuRequirement: jobData.gpuRequirement,
      estimatedDuration: jobData.estimatedDuration,
      priority: jobData.priority,
      timestamp: jobData.timestamp,
      executor: jobData.submittedBy
    };

    const commitResult = await commitEvent(result.nid, eventData, 'Job submitted to queue');

    res.json({
      success: true,
      jobNid: result.nid,
      jobId,
      txHash: commitResult.txHash,
      explorerUrl: `https://mainnet.num.network/tx/${commitResult.txHash}`,
      message: 'Job submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 2. Job Scheduled Event
app.post('/api/jobs/:nid/scheduled', async (req, res) => {
  try {
    const { nid } = req.params;
    const {
      scheduledNode,
      nodeSpecs,
      scheduledTime,
      queuePosition
    } = req.body;

    const eventData = {
      eventType: 'JobScheduled',
      jobNid: nid,
      scheduledNode: scheduledNode || 'gpu-node-01',
      nodeSpecs: nodeSpecs || {
        gpuModel: 'NVIDIA A100 80GB',
        cpuCores: 32,
        ramGB: 256
      },
      scheduledTime: scheduledTime || new Date().toISOString(),
      queuePosition: queuePosition || 1,
      timestamp: Math.floor(Date.now() / 1000),
      executor: 'scheduler'
    };

    const result = await commitEvent(
      nid,
      eventData,
      `Job scheduled on ${eventData.scheduledNode}`
    );

    res.json({
      success: true,
      txHash: result.txHash,
      explorerUrl: `https://mainnet.num.network/tx/${result.txHash}`,
      message: 'Job scheduled'
    });

  } catch (error) {
    console.error('Error scheduling job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. Job Started Event
app.post('/api/jobs/:nid/started', async (req, res) => {
  try {
    const { nid } = req.params;
    const {
      executorNode,
      containerId,
      gpuUtilization,
      processId
    } = req.body;

    const eventData = {
      eventType: 'JobStarted',
      jobNid: nid,
      executorNode: executorNode || 'gpu-node-01',
      actualStartTime: new Date().toISOString(),
      containerId: containerId || `docker://${generateSHA256({ nid }).substring(0, 12)}`,
      gpuUtilization: gpuUtilization || {
        allocated: 1,
        temperature: [65, 66]
      },
      processId: processId || Math.floor(Math.random() * 90000) + 10000,
      timestamp: Math.floor(Date.now() / 1000),
      executor: executorNode || 'gpu-node-01'
    };

    const result = await commitEvent(
      nid,
      eventData,
      'Job execution started'
    );

    res.json({
      success: true,
      txHash: result.txHash,
      explorerUrl: `https://mainnet.num.network/tx/${result.txHash}`,
      message: 'Job started'
    });

  } catch (error) {
    console.error('Error starting job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. Job Progress Update (Optional)
app.post('/api/jobs/:nid/progress', async (req, res) => {
  try {
    const { nid } = req.params;
    const {
      progress,
      currentEpoch,
      totalEpochs,
      avgGpuUtilization,
      memoryUsage
    } = req.body;

    const eventData = {
      eventType: 'JobProgressUpdate',
      jobNid: nid,
      progress: progress || 50,
      currentEpoch: currentEpoch || 15,
      totalEpochs: totalEpochs || 30,
      avgGpuUtilization: avgGpuUtilization || 92.5,
      memoryUsage: memoryUsage || '32GB/40GB',
      timestamp: Math.floor(Date.now() / 1000),
      executor: 'monitoring-system'
    };

    const result = await commitEvent(
      nid,
      eventData,
      `Progress checkpoint at ${eventData.progress}%`
    );

    res.json({
      success: true,
      txHash: result.txHash,
      message: 'Progress updated'
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 5. Job Completed Event
app.post('/api/jobs/:nid/completed', async (req, res) => {
  try {
    const { nid } = req.params;
    const {
      completionStatus,
      totalDuration,
      gpuHoursUsed,
      exitCode,
      outputArtifacts,
      finalMetrics
    } = req.body;

    const eventData = {
      eventType: 'JobCompleted',
      jobNid: nid,
      completionStatus: completionStatus || 'success',
      actualEndTime: new Date().toISOString(),
      totalDuration: totalDuration || 3600,
      gpuHoursUsed: gpuHoursUsed || (totalDuration || 3600) / 3600,
      exitCode: exitCode || 0,
      outputArtifacts: outputArtifacts || [],
      finalMetrics: finalMetrics || {
        accuracy: 0.945,
        loss: 0.032
      },
      c2paVerified: true,
      timestamp: Math.floor(Date.now() / 1000),
      executor: 'gpu-node-01'
    };

    const result = await commitEvent(
      nid,
      eventData,
      'Job completed successfully'
    );

    res.json({
      success: true,
      txHash: result.txHash,
      explorerUrl: `https://mainnet.num.network/tx/${result.txHash}`,
      message: 'Job completed'
    });

  } catch (error) {
    console.error('Error completing job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 6. Job Failed Event
app.post('/api/jobs/:nid/failed', async (req, res) => {
  try {
    const { nid } = req.params;
    const {
      errorCode,
      errorMessage,
      stackTrace,
      partialOutputNid,
      retryAttempt
    } = req.body;

    const eventData = {
      eventType: 'JobFailed',
      jobNid: nid,
      failureTime: new Date().toISOString(),
      errorCode: errorCode || 'UNKNOWN_ERROR',
      errorMessage: errorMessage || 'Job execution failed',
      stackTrace: stackTrace || 'No stack trace available',
      partialOutputNid: partialOutputNid || null,
      retryAttempt: retryAttempt || 1,
      timestamp: Math.floor(Date.now() / 1000),
      executor: 'error-handler'
    };

    const result = await commitEvent(
      nid,
      eventData,
      `Job failed: ${eventData.errorCode}`
    );

    res.json({
      success: true,
      txHash: result.txHash,
      message: 'Job failure recorded'
    });

  } catch (error) {
    console.error('Error recording failure:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 7. Get Job History
app.get('/api/jobs/:nid/history', async (req, res) => {
  try {
    const { nid } = req.params;

    const response = await fetch(
      `${CONFIG.API_BASE}/assets/${nid}/history/`,
      {
        headers: {
          'Authorization': `token ${CONFIG.CAPTURE_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job history');
    }

    const data = await response.json();

    // Parse commits and sort by timestamp
    const events = data.commits
      .map(commit => {
        try {
          return JSON.parse(commit.custom);
        } catch (e) {
          return null;
        }
      })
      .filter(e => e !== null)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Calculate metrics
    const submitted = events.find(e => e.eventType === 'JobSubmitted');
    const completed = events.find(e => e.eventType === 'JobCompleted');
    
    let metrics = null;
    if (submitted && completed) {
      const duration = completed.timestamp - submitted.timestamp;
      metrics = {
        duration: duration,
        gpuHoursUsed: completed.gpuHoursUsed || duration / 3600,
        cost: (completed.gpuHoursUsed || duration / 3600) * 2.5, // $2.5/GPU-hour
        efficiency: completed.completionStatus === 'success' ? 100 : 0
      };
    }

    res.json({
      success: true,
      jobNid: nid,
      events,
      metrics,
      totalEvents: events.length
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 8. List All Jobs (for dashboard)
app.get('/api/jobs', async (req, res) => {
  try {
    // In a real implementation, you'd query your database
    // For demo purposes, return sample data
    res.json({
      success: true,
      jobs: [
        {
          jobId: 'gpu-job-2025-1001',
          jobNid: 'bafybei...',
          status: 'completed',
          type: 'training',
          gpuHours: 2.5,
          cost: 6.25
        }
      ],
      message: 'Use individual job endpoints for full history'
    });
  } catch (error) {
    console.error('Error listing jobs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'ComputeProof API',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`ComputeProof API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`ASSET_FILE_BASE_URL: ${CONFIG.ASSET_FILE_BASE_URL}`);
  console.log(`Ready to process GPU job receipts!`);
});
