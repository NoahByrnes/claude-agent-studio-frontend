import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { CreateAgentRequest } from '../shared-types/index.js';
import { ArrowLeft } from 'lucide-react';

export default function AgentNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAgentRequest>({
    name: '',
    description: '',
    system_prompt: '',
    model: 'claude-sonnet-4-5',
    temperature: 0.2,
    mcp_servers: [],
    deployment: {
      type: 'event-driven',
      sandbox: 'cloudflare',
      auto_restart: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAgentRequest) => api.createAgent(data),
    onSuccess: (agent) => {
      navigate(`/agents/${agent.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
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
        <div>
          <div
            className="text-xs mb-1"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em',
            }}
          >
            CONFIGURE
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            NEW <span style={{ color: '#FF6B35' }}>AGENT</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div
          className="p-8 space-y-6"
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
          }}
        >
          <div
            className="pb-4 mb-6"
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
              AGENT IDENTITY
            </div>
            <div
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#CCCCCC',
              }}
            >
              Basic agent configuration and metadata
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="block text-xs font-medium"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#CCCCCC',
                letterSpacing: '0.05em',
              }}
            >
              NAME
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 transition-all duration-150"
              style={{
                fontFamily: "'Archivo', sans-serif",
                backgroundColor: '#0A0A0A',
                border: '1px solid #333333',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.9375rem',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 0 0 1px #FF6B35';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333333';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="e.g., AP Invoice Processor"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-xs font-medium"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#CCCCCC',
                letterSpacing: '0.05em',
              }}
            >
              DESCRIPTION
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 transition-all duration-150"
              style={{
                fontFamily: "'Archivo', sans-serif",
                backgroundColor: '#0A0A0A',
                border: '1px solid #333333',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.9375rem',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 0 0 1px #FF6B35';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333333';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Brief description of agent functionality"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-xs font-medium"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#CCCCCC',
                letterSpacing: '0.05em',
              }}
            >
              SYSTEM PROMPT
            </label>
            <textarea
              value={formData.system_prompt}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              className="w-full px-4 py-3 h-32 transition-all duration-150"
              style={{
                fontFamily: "'Archivo', sans-serif",
                backgroundColor: '#0A0A0A',
                border: '1px solid #333333',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.9375rem',
                resize: 'vertical',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 0 0 1px #FF6B35';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333333';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="You are an AI assistant that..."
              required
            />
          </div>
        </div>

        <div
          className="p-8 space-y-6"
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
          }}
        >
          <div
            className="pb-4 mb-6"
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
              MODEL PARAMETERS
            </div>
            <div
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#CCCCCC',
              }}
            >
              AI model selection and configuration
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="block text-xs font-medium"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#CCCCCC',
                  letterSpacing: '0.05em',
                }}
              >
                MODEL
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 transition-all duration-150"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9375rem',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
                <option value="claude-opus-4-5">Claude Opus 4.5</option>
                <option value="claude-haiku-4">Claude Haiku 4</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-xs font-medium"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#CCCCCC',
                  letterSpacing: '0.05em',
                }}
              >
                TEMPERATURE
              </label>
              <input
                type="number"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-3 transition-all duration-150"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9375rem',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333';
                  e.target.style.boxShadow = 'none';
                }}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div
          className="p-8 space-y-6"
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
          }}
        >
          <div
            className="pb-4 mb-6"
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
              DEPLOYMENT CONFIG
            </div>
            <div
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#CCCCCC',
              }}
            >
              Runtime environment and execution settings
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="block text-xs font-medium"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#CCCCCC',
                  letterSpacing: '0.05em',
                }}
              >
                DEPLOYMENT TYPE
              </label>
              <select
                value={formData.deployment.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deployment: {
                      ...formData.deployment,
                      type: e.target.value as 'long-running' | 'event-driven',
                    },
                  })
                }
                className="w-full px-4 py-3 transition-all duration-150"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9375rem',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="event-driven">Event-driven</option>
                <option value="long-running">Long-running</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-xs font-medium"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#CCCCCC',
                  letterSpacing: '0.05em',
                }}
              >
                SANDBOX
              </label>
              <select
                value={formData.deployment.sandbox}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deployment: {
                      ...formData.deployment,
                      sandbox: e.target.value as 'cloudflare' | 'e2b' | 'local',
                    },
                  })
                }
                className="w-full px-4 py-3 transition-all duration-150"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9375rem',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="cloudflare">Cloudflare</option>
                <option value="e2b">E2B</option>
                <option value="local">Local</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="auto_restart"
              checked={formData.deployment.auto_restart}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deployment: {
                    ...formData.deployment,
                    auto_restart: e.target.checked,
                  },
                })
              }
              className="w-4 h-4"
              style={{
                accentColor: '#FF6B35',
              }}
            />
            <label
              htmlFor="auto_restart"
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#CCCCCC',
              }}
            >
              Auto-restart on failure
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-3.5 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              backgroundColor: '#FF6B35',
              color: '#0A0A0A',
              letterSpacing: '0.05em',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              if (!createMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#FF8555';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B35';
            }}
          >
            {createMutation.isPending ? 'CREATING...' : 'CREATE AGENT'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3.5 font-medium transition-colors duration-150"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              border: '1px solid #333333',
              color: '#CCCCCC',
              letterSpacing: '0.05em',
              fontSize: '0.875rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#666666';
              e.currentTarget.style.backgroundColor = '#1A1A1A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333333';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            CANCEL
          </button>
        </div>

        {createMutation.isError && (
          <div
            className="p-3 text-sm"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontFamily: "'Archivo', sans-serif",
            }}
          >
            Error: {(createMutation.error as Error).message}
          </div>
        )}
      </form>
    </div>
  );
}
