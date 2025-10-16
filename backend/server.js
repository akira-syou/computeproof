// server.js - ComputeProof Backend API
// GPU Job Receipt Pipeline with Numbers Protocol

// Load environment variables from .env file
require('dotenv').config();

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

// Middleware to extract and attach the CAPTURE token from request headers
app.use((req, res, next) => {
  // Check for token in X-Capture-Token header, fall back to config
  const headerToken = req.headers['x-capture-token'];
  req.captureToken = headerToken || CONFIG.CAPTURE_TOKEN;
  next();
});

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

console.log('Configuration:');
console.log(`  MOCK_NUMBERS_API: ${MOCK}`);
console.log(`  CAPTURE_TOKEN: ${CONFIG.CAPTURE_TOKEN ? '***' + CONFIG.CAPTURE_TOKEN.slice(-4) : 'NOT SET'}`);
console.log(`  API_BASE: ${CONFIG.API_BASE}`);
console.log('');

// Helper: Generate SHA256 hash
function generateSHA256(data) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
}

// Helper: Commit event to blockchain
async function commitEvent(jobNid, eventData, commitMessage, captureToken) {
  if (MOCK) {
    // Return a fake commit result
    return {
      success: true,
      txHash: `0xMOCK_TX_${eventData.eventType}_${Math.random().toString(36).substring(2,10)}`
    };
  }

  console.log(`Committing event: ${eventData.eventType} for NID: ${jobNid}`);

  const response = await fetch(CONFIG.COMMIT_API, {
    method: 'POST',
    headers: {
      'Authorization': `token ${captureToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      encodingFormat: 'application/json',
      assetCid: jobNid,
      assetTimestampCreated: new Date(eventData.timestamp * 1000).toISOString(),
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

  const result = await response.json();
  console.log(`✓ Committed: ${eventData.eventType}, TX: ${result.txHash || result.transaction_hash || 'pending'}`);
  return result;
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

    // Register job as asset
    let result;
    if (MOCK) {
      // Mock mode: generate a fake NID
      result = {
        nid: `bafybei${generateSHA256({ jobId, timestamp: Date.now() }).substring(0, 45)}`
      };
      console.log(`[MOCK MODE] Generated NID: ${result.nid}`);
    } else {
      // Real API mode
      // For hackathon demo, use a publicly accessible placeholder image
      // In production, you would host your actual job data files
      const assetFileUrl = 'https://picsum.photos/200/300';
      
      console.log(`Registering asset with asset_file URL: ${assetFileUrl}`);

      const response = await fetch(`${CONFIG.API_BASE}/assets/`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${req.captureToken}`,
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
        console.error('Asset registration failed:', error);
        throw new Error(`Failed to register job: ${error}`);
      }

      result = await response.json();
      console.log('✓ Asset registration response:', JSON.stringify(result, null, 2));
      console.log(`✓ Asset registered: CID=${result.cid}`);
      // Numbers API returns 'cid', not 'nid', so we normalize it
      result.nid = result.cid;
    }

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

    console.log(`Committing JobSubmitted event for NID: ${result.nid}`);
    const commitResult = await commitEvent(result.nid, eventData, 'Job submitted to queue', req.captureToken);

    const txHash = commitResult.txHash || commitResult.transaction_hash || commitResult.cid || 'pending';

    // Register job in memory
    registerJob(jobId, result.nid, {
      jobType: jobData.jobType,
      submittedBy: jobData.submittedBy,
      gpuRequirement: jobData.gpuRequirement,
      status: 'submitted',
      events: [{
        eventType: 'JobSubmitted',
        txHash: txHash,
        timestamp: jobData.timestamp
      }]
    });

    res.json({
      success: true,
      jobNid: result.nid,
      jobId,
      txHash: txHash,
      explorerUrl: `https://mainnet.num.network/tx/${txHash}`,
      assetUrl: `https://verify.numbersprotocol.io/asset-profile/${result.nid}`,
      message: 'Job submitted successfully and committed to blockchain'
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
      `Job scheduled on ${eventData.scheduledNode}`,
      req.captureToken
    );

    // Update job in registry
    const job = jobRegistry.get(nid);
    if (job) {
      job.events.push({
        eventType: 'JobScheduled',
        txHash: result.txHash || result.transaction_hash || result.cid || 'pending',
        timestamp: eventData.timestamp,
        scheduledNode: eventData.scheduledNode
      });
      job.status = 'scheduled';
    }

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
      'Job execution started',
      req.captureToken
    );

    // Update job in registry
    const job = jobRegistry.get(nid);
    if (job) {
      job.events.push({
        eventType: 'JobStarted',
        txHash: result.txHash || result.transaction_hash || result.cid || 'pending',
        timestamp: eventData.timestamp,
        executorNode: eventData.executorNode
      });
      job.status = 'running';
    }

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
      `Progress checkpoint at ${eventData.progress}%`,
      req.captureToken
    );

    // Update job in registry
    const job = jobRegistry.get(nid);
    if (job) {
      job.events.push({
        eventType: 'JobProgressUpdate',
        txHash: result.txHash || result.transaction_hash || result.cid || 'pending',
        timestamp: eventData.timestamp,
        progress: eventData.progress,
        currentEpoch: eventData.currentEpoch,
        totalEpochs: eventData.totalEpochs
      });
    }

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
      'Job completed successfully',
      req.captureToken
    );

    // Update job in registry
    const job = jobRegistry.get(nid);
    if (job) {
      job.events.push({
        eventType: 'JobCompleted',
        txHash: result.txHash || result.transaction_hash || result.cid || 'pending',
        timestamp: eventData.timestamp,
        completionStatus: eventData.completionStatus,
        totalDuration: eventData.totalDuration,
        gpuHoursUsed: eventData.gpuHoursUsed
      });
      job.status = 'completed';
    }

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
      `Job failed: ${eventData.errorCode}`,
      req.captureToken
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

    // First, get the job from our registry
    const job = jobRegistry.get(nid);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found in registry'
      });
    }

    // Return job data with events from registry
    // We use the in-memory events instead of fetching from blockchain
    // because they're faster and we already have them
    res.json({
      success: true,
      jobId: job.jobId,
      jobNid: nid,
      jobType: job.jobType,
      status: job.status,
      submittedBy: job.submittedBy,
      gpuRequirement: job.gpuRequirement,
      events: job.events || [],
      totalEvents: (job.events || []).length,
      createdAt: job.createdAt
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
const jobRegistry = new Map(); // Store jobs in memory for demo

app.get('/api/jobs', async (req, res) => {
  try {
    // Return all registered jobs
    const jobs = Array.from(jobRegistry.values());
    
    res.json({
      success: true,
      jobs: jobs,
      count: jobs.length
    });
  } catch (error) {
    console.error('Error listing jobs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Store job when submitted
function registerJob(jobId, jobNid, jobData) {
  jobRegistry.set(jobNid, {
    jobId,
    jobNid,
    ...jobData,
    events: [],
    createdAt: new Date().toISOString()
  });
}

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
