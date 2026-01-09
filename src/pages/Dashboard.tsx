import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api.getAgents(),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-xs mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em',
            }}
          >
            OVERVIEW
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            DEPLOYMENT <span style={{ color: '#FF6B35' }}>DASHBOARD</span>
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'Archivo', sans-serif",
              color: '#999999',
            }}
          >
            Manage autonomous agent infrastructure
          </p>
        </div>
        <Link
          to="/agents/new"
          className="inline-flex items-center gap-2 px-5 py-3 font-medium transition-all duration-150"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            backgroundColor: '#FF6B35',
            color: '#0A0A0A',
            letterSpacing: '0.05em',
            fontSize: '0.8125rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF8555';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF6B35';
          }}
        >
          <Plus className="w-4 h-4" />
          NEW AGENT
        </Link>
      </div>

      {isLoading ? (
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
            LOADING AGENTS...
          </p>
        </div>
      ) : data?.agents.length === 0 ? (
        <div
          className="text-center py-16"
          style={{
            border: '1px dashed #333333',
            backgroundColor: '#1A1A1A',
          }}
        >
          <p
            className="text-sm mb-6"
            style={{
              fontFamily: "'Archivo', sans-serif",
              color: '#999999',
            }}
          >
            No agents deployed
          </p>
          <Link
            to="/agents/new"
            className="inline-flex items-center gap-2 px-5 py-3 font-medium transition-all duration-150"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              backgroundColor: '#FF6B35',
              color: '#0A0A0A',
              letterSpacing: '0.05em',
              fontSize: '0.8125rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF8555';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B35';
            }}
          >
            <Plus className="w-4 h-4" />
            DEPLOY FIRST AGENT
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.agents.map((agent) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.id}`}
              className="block p-6 transition-all duration-150"
              style={{
                border: '1px solid #333333',
                backgroundColor: '#1A1A1A',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF6B35';
                e.currentTarget.style.backgroundColor = '#1F1F1F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333333';
                e.currentTarget.style.backgroundColor = '#1A1A1A';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="font-semibold text-base"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {agent.name}
                </h3>
                <span
                  className="text-xs px-2 py-1"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    letterSpacing: '0.05em',
                    border: '1px solid',
                    ...(agent.status === 'running'
                      ? {
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          borderColor: 'rgba(34, 197, 94, 0.3)',
                          color: '#22C55E',
                        }
                      : agent.status === 'stopped'
                      ? {
                          backgroundColor: 'rgba(156, 163, 175, 0.1)',
                          borderColor: 'rgba(156, 163, 175, 0.3)',
                          color: '#9CA3AF',
                        }
                      : agent.status === 'error'
                      ? {
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          color: '#EF4444',
                        }
                      : {
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderColor: 'rgba(59, 130, 246, 0.3)',
                          color: '#3B82F6',
                        }),
                  }}
                >
                  {agent.status.toUpperCase()}
                </span>
              </div>
              {agent.config.description && (
                <p
                  className="text-sm line-clamp-2"
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    color: '#999999',
                  }}
                >
                  {agent.config.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
