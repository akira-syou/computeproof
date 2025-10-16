import React, { useState, useEffect } from 'react';
import { Cpu, Clock, CheckCircle, XCircle, Activity, TrendingUp, DollarSign, Zap } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobHistory, setJobHistory] = useState(null);

  // Sample job data
  const sampleJobs = [
    {
      jobId: 'gpu-job-2025-1001',
      jobNid: 'bafybeigpu1234567890abcdefghijklmnopqr',
      jobType: 'training',
      status: 'completed',
      submittedBy: '0x742d35Cc...',
      gpuType: 'NVIDIA A100 80GB',
      gpuCount: 4,
      duration: 3810,
      gpuHours: 4.23,
      cost: 10.58,
      events: [
        {
          eventType: 'JobSubmitted',
          timestamp: Date.now() - 7200000,
          txHash: '0xabc123def456789012345678901234567890abcd',
          executor: '0x742d35Cc...',
          details: 'PyTorch training job submitted'
        },
        {
          eventType: 'JobScheduled',
          timestamp: Date.now() - 7000000,
          txHash: '0xdef456789012345678901234567890abcdef1234',
          executor: 'scheduler',
          details: 'Scheduled on gpu-node-05',
          node: 'gpu-node-05'
        },
        {
          eventType: 'JobStarted',
          timestamp: Date.now() - 6800000,
          txHash: '0x789012345678901234567890abcdef123456789a',
          executor: 'gpu-node-05',
          details: 'Training started with 4x A100 GPUs'
        },
        {
          eventType: 'JobProgressUpdate',
          timestamp: Date.now() - 3400000,
          txHash: '0x901234567890abcdef123456789012345678abcd',
          executor: 'monitoring',
          details: 'Progress: 50% - Epoch 15/30',
          progress: 50
        },
        {
          eventType: 'JobCompleted',
          timestamp: Date.now() - 10000,
          txHash: '0xabcdef123456789012345678901234567890abcd',
          executor: 'gpu-node-05',
          details: 'Training completed successfully',
          metrics: { accuracy: 0.945, loss: 0.032 }
        }
      ]
    },
    {
      jobId: 'gpu-job-2025-1002',
      jobNid: 'bafybeigpu2345678901bcdefghijklmnopqrst',
      jobType: 'inference',
      status: 'completed',
      submittedBy: '0x9Da6fB9b...',
      gpuType: 'NVIDIA A100 40GB',
      gpuCount: 2,
      duration: 1820,
      gpuHours: 1.01,
      cost: 2.53,
      events: [
        {
          eventType: 'JobSubmitted',
          timestamp: Date.now() - 3600000,
          txHash: '0x111222333444555666777888999aaabbbcccddd',
          executor: '0x9Da6fB9b...',
          details: 'TensorFlow inference batch job'
        },
        {
          eventType: 'JobStarted',
          timestamp: Date.now() - 3400000,
          txHash: '0x222333444555666777888999aaabbbcccdddeee',
          executor: 'gpu-node-03',
          details: 'Inference started with 2x A100 GPUs'
        },
        {
          eventType: 'JobCompleted',
          timestamp: Date.now() - 1580000,
          txHash: '0x333444555666777888999aaabbbcccdddeeeeff',
          executor: 'gpu-node-03',
          details: 'Inference completed - 10,000 predictions',
          metrics: { throughput: '5.5 pred/sec' }
        }
      ]
    }
  ];

  useEffect(() => {
    if (selectedJob) {
      setJobHistory(selectedJob);
    }
  }, [selectedJob]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shortenHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'green',
      running: 'blue',
      failed: 'red',
      pending: 'yellow'
    };
    return colors[status] || 'gray';
  };

  const getEventIcon = (type) => {
    const icons = {
      JobSubmitted: Clock,
      JobScheduled: Activity,
      JobStarted: Zap,
      JobProgressUpdate: TrendingUp,
      JobCompleted: CheckCircle,
      JobFailed: XCircle
    };
    const Icon = icons[type] || Activity;
    return <Icon className="w-5 h-5" />;
  };

  const totalGpuHours = sampleJobs.reduce((sum, job) => sum + job.gpuHours, 0);
  const totalCost = sampleJobs.reduce((sum, job) => sum + job.cost, 0);
  const avgDuration = sampleJobs.reduce((sum, job) => sum + job.duration, 0) / sampleJobs.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ComputeProof</h1>
                <p className="text-xs text-gray-400">GPU Job Receipts on Numbers Protocol</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'docs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Documentation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Jobs</span>
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white">{sampleJobs.length}</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">GPU Hours</span>
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{totalGpuHours.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Cost</span>
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white">${totalCost.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Avg Duration</span>
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white">{formatDuration(avgDuration)}</div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">GPU Jobs</h2>
              <div className="space-y-4">
                {sampleJobs.map((job) => (
                  <div
                    key={job.jobId}
                    onClick={() => setSelectedJob(job)}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">{job.jobId}</h3>
                        <p className="text-sm text-gray-400">
                          {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)} • {job.gpuCount}x {job.gpuType}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium`}
                        style={{
                          backgroundColor: getStatusColor(job.status) === 'green' ? '#10b981' :
                                         getStatusColor(job.status) === 'blue' ? '#3b82f6' :
                                         getStatusColor(job.status) === 'red' ? '#ef4444' : '#eab308',
                          color: 'white'
                        }}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <p className="text-white font-medium">{formatDuration(job.duration)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">GPU Hours:</span>
                        <p className="text-white font-medium">{job.gpuHours.toFixed(2)}h</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Cost:</span>
                        <p className="text-white font-medium">${job.cost.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Events:</span>
                        <p className="text-white font-medium">{job.events.length}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <code className="bg-gray-800 px-2 py-1 rounded border border-gray-600 text-gray-300">
                        {shortenHash(job.jobNid)}
                      </code>
                      <a
                        href={`https://verify.numbersprotocol.io/asset-profile/${job.jobNid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View on Numbers →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Detail Modal */}
            {selectedJob && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.jobId}</h2>
                        <p className="text-gray-400">Job NID: {selectedJob.jobNid}</p>
                      </div>
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="text-gray-400 hover:text-white text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Event Timeline */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-4">Event Timeline</h3>
                        <div className="space-y-3">
                          {selectedJob.events.map((event, idx) => (
                            <div
                              key={idx}
                              className="relative pl-8 pb-4 border-l-2 border-gray-700 last:border-l-0 last:pb-0"
                            >
                              <div
                                className="absolute left-0 -ml-3 w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                  backgroundColor: event.eventType === 'JobCompleted' ? '#10b981' :
                                                 event.eventType === 'JobFailed' ? '#ef4444' :
                                                 event.eventType === 'JobStarted' ? '#3b82f6' : '#6b7280'
                                }}
                              >
                                {getEventIcon(event.eventType)}
                              </div>
                              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-bold text-white">{event.eventType}</h4>
                                    <p className="text-sm text-gray-400">{event.details}</p>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(event.timestamp)}
                                  </span>
                                </div>
                                {event.progress && (
                                  <div className="mt-2 mb-2">
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                      <span>Progress</span>
                                      <span>{event.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${event.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {event.metrics && (
                                  <div className="mt-2 flex gap-4 text-sm">
                                    {Object.entries(event.metrics).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="text-gray-400">{key}:</span>
                                        <span className="text-white ml-1">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-3 flex items-center gap-2 text-xs">
                                  <code className="bg-gray-800 px-2 py-1 rounded border border-gray-600 text-gray-300">
                                    {shortenHash(event.txHash)}
                                  </code>
                                  <a
                                    href={`https://mainnet.num.network/tx/${event.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    View Transaction →
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">ComputeProof Documentation</h2>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h3 className="text-xl font-bold text-white mb-3">🎯 What is ComputeProof?</h3>
                <p className="mb-3">
                  ComputeProof creates an auditable GPU compute infrastructure where every job—from 
                  submission to completion—is recorded as ERC-7053 commits on Numbers Mainnet. 
                  Perfect for AI training verification, distributed computing marketplaces, and 
                  compliance auditing.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">🏗️ How It Works</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Job submitted → Creates unique NID on Numbers Protocol</li>
                  <li>Job scheduled → Records which GPU node assigned</li>
                  <li>Job starts → Logs container ID and GPU allocation</li>
                  <li>Progress updates → Optional checkpoints during execution</li>
                  <li>Job completes → Records output artifacts and metrics</li>
                  <li>All events → Permanently stored on blockchain</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">📋 Event Types</h3>
                <ul className="space-y-2">
                  <li><strong className="text-blue-400">JobSubmitted:</strong> Initial job registration with requirements</li>
                  <li><strong className="text-green-400">JobScheduled:</strong> Assignment to GPU node</li>
                  <li><strong className="text-purple-400">JobStarted:</strong> Execution begins with resource allocation</li>
                  <li><strong className="text-yellow-400">JobProgressUpdate:</strong> Optional progress checkpoints</li>
                  <li><strong className="text-green-400">JobCompleted:</strong> Success with output artifacts</li>
                  <li><strong className="text-red-400">JobFailed:</strong> Error logging for debugging</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">🛠️ Tech Stack</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Numbers Protocol (ERC-7053 commits)</li>
                  <li>Capture SDK for asset registration</li>
                  <li>Numbers Mainnet (Avalanche Subnet)</li>
                  <li>React + TailwindCSS for dashboard</li>
                  <li>Node.js/Express for API</li>
                  <li>IPFS for decentralized storage</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">🔍 Use Cases</h3>
                <ul className="space-y-2">
                  <li><strong>AI Marketplaces:</strong> Verify compute resources for billing</li>
                  <li><strong>Model Audits:</strong> Prove training parameters and resources</li>
                  <li><strong>Compliance:</strong> Meet regulatory requirements for AI logs</li>
                  <li><strong>Carbon Credits:</strong> Calculate GPU carbon footprint</li>
                  <li><strong>Insurance:</strong> Dispute resolution with immutable history</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">🔗 Verification</h3>
                <p className="mb-3">
                  Every commit can be verified on Numbers Mainnet explorer. Click any transaction 
                  hash to see the immutable on-chain record. Asset profiles show complete job 
                  history with full provenance.
                </p>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">Built for FtC RealFi Hackathon - Track B: Proof Your GPU Usage</p>
            <p>Powered by <a href="https://numbersprotocol.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium">Numbers Protocol</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
