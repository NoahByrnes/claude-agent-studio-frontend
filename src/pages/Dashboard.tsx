import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Send, Zap, Activity, Terminal, Box, Clock } from 'lucide-react';

// Utility functions
const formatUptime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

const formatRelativeTime = (timestamp: string): string => {
  const now = new Date().getTime();
  const then = new Date(timestamp).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};

const truncateId = (id: string): string => {
  return id.length > 8 ? `${id.substring(0, 8)}...` : id;
};

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const queryClient = useQueryClient();

  // Auto-refresh every 2 seconds
  const { data: status, isLoading } = useQuery({
    queryKey: ['monitoring-status'],
    queryFn: () => api.getMonitoringStatus(),
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => api.sendConductorMessage(content),
    onSuccess: (data) => {
      setLastResponse(data.conductorResponse);
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['monitoring-status'] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const isOnline = status?.status === 'online';
  const conductor = status?.conductor;
  const workers = status?.workers || [];

  return (
    <div className="space-y-6">
      {/* Header with live status */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div
              className="text-[10px] mb-2 tracking-[0.2em] flex items-center gap-3"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
              }}
            >
              <span>MISSION CONTROL</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full relative"
                  style={{
                    backgroundColor: isOnline ? '#22C55E' : '#666666',
                    boxShadow: isOnline ? '0 0 12px rgba(34, 197, 94, 0.6)' : 'none',
                  }}
                >
                  {isOnline && (
                    <>
                      <div
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ backgroundColor: '#22C55E' }}
                      />
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: '#22C55E' }}
                      />
                    </>
                  )}
                </div>
                <span
                  style={{
                    color: isOnline ? '#22C55E' : '#666666',
                    letterSpacing: '0.1em',
                  }}
                >
                  {isOnline ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                textShadow: isOnline ? '0 0 40px rgba(255, 107, 53, 0.3)' : 'none',
              }}
            >
              CONDUCTOR
              <span style={{ color: '#FF6B35' }}> ORCHESTRATION</span>
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#999999',
              }}
            >
              Autonomous agent infrastructure monitoring
            </p>
          </div>
          {conductor && (
            <div
              className="px-4 py-3"
              style={{
                border: '2px solid #FF6B35',
                backgroundColor: 'rgba(255, 107, 53, 0.05)',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              <div className="text-[10px] tracking-[0.15em] text-[#999999] mb-1">UPTIME</div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {formatUptime(conductor.uptime || 0)}
              </div>
            </div>
          )}
        </div>

        {/* Decorative scanline effect */}
        {isOnline && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ mixBlendMode: 'overlay', opacity: 0.03 }}
          >
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, #FF6B35 2px, #FF6B35 4px)',
              }}
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div
          className="py-32 text-center"
          style={{
            border: '1px solid #333333',
            backgroundColor: '#0F0F0F',
          }}
        >
          <Activity
            className="w-8 h-8 mx-auto mb-4 animate-pulse"
            style={{ color: '#FF6B35' }}
          />
          <p
            className="text-sm tracking-[0.1em]"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
            }}
          >
            INITIALIZING SYSTEMS...
          </p>
        </div>
      ) : !isOnline ? (
        <div
          className="py-32 text-center relative overflow-hidden"
          style={{
            border: '1px solid #333333',
            backgroundColor: '#0F0F0F',
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background:
                'repeating-linear-gradient(45deg, transparent, transparent 20px, #666666 20px, #666666 40px)',
            }}
          />
          <Box className="w-12 h-12 mx-auto mb-4" style={{ color: '#666666' }} />
          <p
            className="text-sm tracking-[0.1em]"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
            }}
          >
            CONDUCTOR OFFLINE
          </p>
          <p
            className="text-xs mt-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#444444',
            }}
          >
            Awaiting first message to initialize
          </p>
        </div>
      ) : (
        <>
          {/* Conductor Status Panel */}
          <div
            className="relative overflow-hidden"
            style={{
              border: '2px solid #FF6B35',
              backgroundColor: '#0F0F0F',
            }}
          >
            {/* Glowing top border animation */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] animate-pulse"
              style={{
                background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
              }}
            />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="p-2"
                  style={{
                    border: '2px solid #FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  }}
                >
                  <Zap className="w-5 h-5" style={{ color: '#FF6B35' }} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold tracking-tight"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#FFFFFF',
                    }}
                  >
                    CONDUCTOR STATUS
                  </h2>
                  <p
                    className="text-[10px] tracking-[0.15em]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#999999',
                    }}
                  >
                    PRIMARY ORCHESTRATION NODE
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className="p-4"
                  style={{
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                  }}
                >
                  <div
                    className="text-[10px] tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#666666',
                    }}
                  >
                    SESSION ID
                  </div>
                  <div
                    className="text-sm font-bold truncate"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#FFFFFF',
                    }}
                    title={conductor?.sessionId}
                  >
                    {truncateId(conductor?.sessionId || 'N/A')}
                  </div>
                </div>

                <div
                  className="p-4"
                  style={{
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                  }}
                >
                  <div
                    className="text-[10px] tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#666666',
                    }}
                  >
                    SANDBOX ID
                  </div>
                  <div
                    className="text-sm font-bold truncate"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#FFFFFF',
                    }}
                    title={conductor?.sandboxId}
                  >
                    {truncateId(conductor?.sandboxId || 'N/A')}
                  </div>
                </div>

                <div
                  className="p-4"
                  style={{
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                  }}
                >
                  <div
                    className="text-[10px] tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#666666',
                    }}
                  >
                    ACTIVE WORKERS
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: conductor?.activeWorkerCount ? '#FF6B35' : '#FFFFFF',
                    }}
                  >
                    {conductor?.activeWorkerCount || 0}
                  </div>
                </div>

                <div
                  className="p-4"
                  style={{
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                  }}
                >
                  <div
                    className="text-[10px] tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#666666',
                    }}
                  >
                    LAST ACTIVITY
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#FFFFFF',
                    }}
                  >
                    {conductor?.lastActivity
                      ? formatRelativeTime(conductor.lastActivity)
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workers Grid */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2"
                style={{
                  border: '1px solid #333333',
                  backgroundColor: '#1A1A1A',
                }}
              >
                <Activity className="w-4 h-4" style={{ color: '#FF6B35' }} />
              </div>
              <h2
                className="text-lg font-bold tracking-tight"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#FFFFFF',
                }}
              >
                ACTIVE WORKERS
                <span
                  className="ml-3 text-sm"
                  style={{
                    color: '#666666',
                  }}
                >
                  [{workers.length}]
                </span>
              </h2>
            </div>

            {workers.length === 0 ? (
              <div
                className="py-16 text-center"
                style={{
                  border: '1px dashed #333333',
                  backgroundColor: '#0F0F0F',
                }}
              >
                <Terminal className="w-8 h-8 mx-auto mb-3" style={{ color: '#444444' }} />
                <p
                  className="text-sm tracking-[0.1em]"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#666666',
                  }}
                >
                  NO ACTIVE WORKERS
                </p>
                <p
                  className="text-xs mt-2"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#444444',
                  }}
                >
                  Send a message to spawn workers
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workers.map((worker, index) => (
                  <Link
                    key={worker.id}
                    to={`/worker/${worker.id}`}
                    className="group relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    style={{
                      border: '1px solid #333333',
                      backgroundColor: '#0F0F0F',
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Animated left border */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 group-hover:w-[4px]"
                      style={{
                        backgroundColor:
                          worker.status === 'running' ? '#22C55E' : '#FF6B35',
                        boxShadow:
                          worker.status === 'running'
                            ? '0 0 10px rgba(34, 197, 94, 0.5)'
                            : '0 0 10px rgba(255, 107, 53, 0.5)',
                      }}
                    />

                    <div className="p-5 pl-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div
                            className="text-[10px] tracking-[0.15em] mb-1"
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              color: '#666666',
                            }}
                          >
                            WORKER ID
                          </div>
                          <div
                            className="text-sm font-bold truncate"
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              color: '#FFFFFF',
                            }}
                            title={worker.id}
                          >
                            {truncateId(worker.id)}
                          </div>
                        </div>
                        <div
                          className="px-3 py-1 text-[10px] tracking-[0.1em] font-bold"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            border: `1px solid ${
                              worker.status === 'running' ? '#22C55E' : '#FF6B35'
                            }`,
                            backgroundColor:
                              worker.status === 'running'
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(255, 107, 53, 0.1)',
                            color: worker.status === 'running' ? '#22C55E' : '#FF6B35',
                          }}
                        >
                          {worker.status.toUpperCase()}
                        </div>
                      </div>

                      {worker.task && (
                        <div className="mb-3">
                          <div
                            className="text-[10px] tracking-[0.15em] mb-1"
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              color: '#666666',
                            }}
                          >
                            TASK
                          </div>
                          <div
                            className="text-xs line-clamp-2"
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              color: '#CCCCCC',
                              lineHeight: '1.5',
                            }}
                          >
                            {worker.task}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-[10px]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" style={{ color: '#666666' }} />
                          <span
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              color: '#999999',
                            }}
                          >
                            {formatRelativeTime(worker.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Box className="w-3 h-3" style={{ color: '#666666' }} />
                          <span
                            className="truncate max-w-[120px]"
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              color: '#999999',
                            }}
                            title={worker.sandboxId}
                          >
                            {truncateId(worker.sandboxId)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Message Interface */}
          <div
            className="relative"
            style={{
              border: '1px solid #333333',
              backgroundColor: '#0F0F0F',
            }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2"
                  style={{
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                  }}
                >
                  <Terminal className="w-4 h-4" style={{ color: '#FF6B35' }} />
                </div>
                <h2
                  className="text-lg font-bold tracking-tight"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#FFFFFF',
                  }}
                >
                  TEST INTERFACE
                </h2>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label
                    className="block text-[10px] tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#666666',
                    }}
                  >
                    MESSAGE CONTENT
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter task for conductor orchestration..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm resize-none focus:outline-none transition-all duration-200"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      border: '1px solid #333333',
                      backgroundColor: '#1A1A1A',
                      color: '#FFFFFF',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#FF6B35';
                      e.currentTarget.style.backgroundColor = '#0A0A0A';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#333333';
                      e.currentTarget.style.backgroundColor = '#1A1A1A';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="inline-flex items-center gap-3 px-6 py-3 font-bold text-sm tracking-[0.05em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    backgroundColor: '#FF6B35',
                    color: '#0A0A0A',
                    border: '2px solid #FF6B35',
                  }}
                  onMouseEnter={(e) => {
                    if (!sendMessageMutation.isPending && message.trim()) {
                      e.currentTarget.style.backgroundColor = '#0A0A0A';
                      e.currentTarget.style.color = '#FF6B35';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF6B35';
                    e.currentTarget.style.color = '#0A0A0A';
                  }}
                >
                  <Send className="w-4 h-4" />
                  {sendMessageMutation.isPending ? 'TRANSMITTING...' : 'SEND TO CONDUCTOR'}
                </button>
              </form>

              {lastResponse && (
                <div
                  className="mt-6 p-4 relative overflow-hidden"
                  style={{
                    border: '1px solid #22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.05)',
                  }}
                >
                  <div
                    className="text-[10px] tracking-[0.15em] mb-2 flex items-center gap-2"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#22C55E',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: '#22C55E' }}
                    />
                    CONDUCTOR RESPONSE
                  </div>
                  <div
                    className="text-sm whitespace-pre-wrap"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#FFFFFF',
                      lineHeight: '1.6',
                    }}
                  >
                    {lastResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
