import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Play, Square, Trash2, ArrowLeft } from 'lucide-react';

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', id],
    queryFn: () => api.getAgent(id!),
    enabled: !!id,
  });

  const { data: logs } = useQuery({
    queryKey: ['agent-logs', id],
    queryFn: () => api.getAgentLogs(id!),
    enabled: !!id,
    refetchInterval: 5000,
  });

  const { data: metrics } = useQuery({
    queryKey: ['agent-metrics', id],
    queryFn: () => api.getAgentMetrics(id!),
    enabled: !!id,
    refetchInterval: 10000,
  });

  const deployMutation = useMutation({
    mutationFn: () => api.deployAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: () => api.stopAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteAgent(id!),
    onSuccess: () => {
      navigate('/');
    },
  });

  if (isLoading) {
    return (
      <div
        className="text-center py-16"
        style={{
          border: '1px solid #333333',
          backgroundColor: '#1A1A1A',
        }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#666666',
            letterSpacing: '0.05em',
          }}
        >
          LOADING AGENT...
        </p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div
        className="text-center py-16"
        style={{
          border: '1px solid #333333',
          backgroundColor: '#1A1A1A',
        }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#EF4444',
            letterSpacing: '0.05em',
          }}
        >
          AGENT NOT FOUND
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => navigate('/')}
            className="p-2 transition-colors duration-150"
            style={{
              border: '1px solid #333333',
              color: '#CCCCCC',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FF6B35';
              e.currentTarget.style.color = '#FF6B35';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333333';
              e.currentTarget.style.color = '#CCCCCC';
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div
              className="text-xs mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
                letterSpacing: '0.1em',
              }}
            >
              AGENT://{agent.id.toUpperCase().slice(0, 8)}
            </div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              {agent.name}
            </h1>
            {agent.config.description && (
              <p
                className="text-sm"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  color: '#999999',
                }}
              >
                {agent.config.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {agent.status === 'running' ? (
            <button
              onClick={() => stopMutation.mutate()}
              disabled={stopMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-150 disabled:opacity-50"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                if (!stopMutation.isPending) {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
              }}
            >
              <Square className="w-4 h-4" />
              STOP
            </button>
          ) : (
            <button
              onClick={() => deployMutation.mutate()}
              disabled={deployMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-150 disabled:opacity-50"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                backgroundColor: '#FF6B35',
                color: '#0A0A0A',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                if (!deployMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#FF8555';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF6B35';
              }}
            >
              <Play className="w-4 h-4" />
              DEPLOY
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this agent?')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-150 disabled:opacity-50"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => {
              if (!deleteMutation.isPending) {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <Trash2 className="w-4 h-4" />
            DELETE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-6"
          style={{
            border: '1px solid #333333',
            backgroundColor: '#1A1A1A',
          }}
        >
          <div
            className="text-xs mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em',
            }}
          >
            STATUS
          </div>
          <div
            className="text-2xl font-semibold capitalize"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color:
                agent.status === 'running'
                  ? '#22C55E'
                  : agent.status === 'error'
                  ? '#EF4444'
                  : '#FFFFFF',
              letterSpacing: '-0.01em',
            }}
          >
            {agent.status}
          </div>
        </div>
        <div
          className="p-6"
          style={{
            border: '1px solid #333333',
            backgroundColor: '#1A1A1A',
          }}
        >
          <div
            className="text-xs mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em',
            }}
          >
            TASKS COMPLETED
          </div>
          <div
            className="text-2xl font-semibold"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}
          >
            {metrics?.tasks_completed || 0}
          </div>
        </div>
        <div
          className="p-6"
          style={{
            border: '1px solid #333333',
            backgroundColor: '#1A1A1A',
          }}
        >
          <div
            className="text-xs mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em',
            }}
          >
            UPTIME
          </div>
          <div
            className="text-2xl font-semibold"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}
          >
            {metrics?.uptime_seconds ? `${Math.floor(metrics.uptime_seconds / 60)}m` : '0m'}
          </div>
        </div>
      </div>

      <div
        className="p-8 space-y-6"
        style={{
          border: '1px solid #333333',
          backgroundColor: '#1A1A1A',
        }}
      >
        <div
          className="pb-4"
          style={{
            borderBottom: '1px solid #333333',
          }}
        >
          <div
            className="text-xs mb-1"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em',
            }}
          >
            CONFIGURATION
          </div>
          <div
            className="text-sm"
            style={{
              fontFamily: "'Archivo', sans-serif",
              color: '#CCCCCC',
            }}
          >
            Agent deployment and runtime parameters
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <span
              className="text-xs block mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
                letterSpacing: '0.05em',
              }}
            >
              MODEL
            </span>
            <span
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#FFFFFF',
              }}
            >
              {agent.config.model}
            </span>
          </div>
          <div>
            <span
              className="text-xs block mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
                letterSpacing: '0.05em',
              }}
            >
              TEMPERATURE
            </span>
            <span
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#FFFFFF',
              }}
            >
              {agent.config.temperature}
            </span>
          </div>
          <div>
            <span
              className="text-xs block mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
                letterSpacing: '0.05em',
              }}
            >
              DEPLOYMENT TYPE
            </span>
            <span
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#FFFFFF',
              }}
            >
              {agent.config.deployment.type}
            </span>
          </div>
          <div>
            <span
              className="text-xs block mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
                letterSpacing: '0.05em',
              }}
            >
              SANDBOX
            </span>
            <span
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#FFFFFF',
              }}
            >
              {agent.config.deployment.sandbox}
            </span>
          </div>
        </div>

        <div>
          <span
            className="text-xs block mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.05em',
            }}
          >
            SYSTEM PROMPT
          </span>
          <pre
            className="text-sm p-4 overflow-auto whitespace-pre-wrap"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              backgroundColor: '#0A0A0A',
              border: '1px solid #333333',
              color: '#CCCCCC',
              lineHeight: '1.6',
            }}
          >
            {agent.config.system_prompt}
          </pre>
        </div>
      </div>

      <div
        className="overflow-hidden"
        style={{
          border: '1px solid #333333',
          backgroundColor: '#1A1A1A',
        }}
      >
        <div
          className="p-6 pb-4"
          style={{
            borderBottom: '1px solid #333333',
          }}
        >
          <div
            className="text-xs mb-1"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em',
            }}
          >
            ACTIVITY LOG
          </div>
          <div
            className="text-sm"
            style={{
              fontFamily: "'Archivo', sans-serif",
              color: '#CCCCCC',
            }}
          >
            Real-time agent execution events
          </div>
        </div>

        {logs?.logs.length === 0 ? (
          <div
            className="p-8 text-center"
            style={{
              color: '#666666',
            }}
          >
            <p
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
              }}
            >
              No activity recorded
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-auto">
            {logs?.logs.map((log) => (
              <div
                key={log.id}
                className="p-4 transition-colors duration-150"
                style={{
                  borderBottom: '1px solid #333333',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F1F1F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div
                      className="text-sm font-medium mb-1"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#FFFFFF',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {log.action_type}
                    </div>
                    {log.tool_name && (
                      <div
                        className="text-xs"
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          color: '#999999',
                        }}
                      >
                        Tool: {log.tool_name}
                      </div>
                    )}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#666666',
                    }}
                  >
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
