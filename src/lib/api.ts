import type {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  AgentListResponse,
  LogsResponse,
  MetricsResponse,
  MonitoringStatusResponse,
  MonitoringMetricsResponse,
  WorkerStatus,
  SendMessageRequest,
  ConnectorStatus,
} from '../shared-types/index.js';
import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      };
    }

    return {
      'Content-Type': 'application/json',
    };
  }

  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Agent operations
  async getAgents(): Promise<AgentListResponse> {
    return this.fetch<AgentListResponse>('/agents');
  }

  async getAgent(id: string): Promise<Agent> {
    return this.fetch<Agent>(`/agents/${id}`);
  }

  async createAgent(config: CreateAgentRequest): Promise<Agent> {
    return this.fetch<Agent>('/agents', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async updateAgent(id: string, config: UpdateAgentRequest): Promise<Agent> {
    return this.fetch<Agent>(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async deleteAgent(id: string): Promise<void> {
    await this.fetch(`/agents/${id}`, {
      method: 'DELETE',
    });
  }

  async deployAgent(id: string): Promise<void> {
    await this.fetch(`/agents/${id}/deploy`, {
      method: 'POST',
    });
  }

  async stopAgent(id: string): Promise<void> {
    await this.fetch(`/agents/${id}/stop`, {
      method: 'POST',
    });
  }

  async getAgentLogs(
    id: string,
    params?: { limit?: number; offset?: number; action_type?: string; tool_name?: string }
  ): Promise<LogsResponse> {
    const query = new URLSearchParams(params as any).toString();
    return this.fetch<LogsResponse>(`/agents/${id}/logs${query ? `?${query}` : ''}`);
  }

  async getAgentMetrics(id: string): Promise<MetricsResponse> {
    return this.fetch<MetricsResponse>(`/agents/${id}/metrics`);
  }

  // WebSocket for live logs
  connectToLogs(agentId: string): WebSocket {
    const wsUrl = `${API_BASE.replace('http', 'ws')}/agents/${agentId}/logs/stream`;
    return new WebSocket(wsUrl);
  }

  // Conductor/Worker Monitoring
  async getMonitoringStatus(): Promise<MonitoringStatusResponse> {
    return this.fetch<MonitoringStatusResponse>('/monitoring/status');
  }

  async getMonitoringMetrics(): Promise<MonitoringMetricsResponse> {
    return this.fetch<MonitoringMetricsResponse>('/monitoring/metrics');
  }

  async getActiveWorkers(): Promise<{ workers: WorkerStatus[] }> {
    return this.fetch<{ workers: WorkerStatus[] }>('/monitoring/workers');
  }

  async sendTestMessage(message: SendMessageRequest): Promise<{ success: boolean; conductorResponse: string }> {
    return this.fetch<{ success: boolean; conductorResponse: string }>('/monitoring/test', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getMonitoringHealth(): Promise<{ status: string; timestamp: string }> {
    return this.fetch<{ status: string; timestamp: string }>('/monitoring/health');
  }

  async sendConductorMessage(content: string, source: 'USER' | 'EMAIL' | 'SMS' = 'USER'): Promise<{ success: boolean; conductorResponse: string }> {
    return this.fetch<{ success: boolean; conductorResponse: string }>('/webhooks/conductor/message', {
      method: 'POST',
      body: JSON.stringify({ source, content }),
    });
  }

  // Connector Configuration
  async getConnectorStatus(): Promise<ConnectorStatus> {
    return this.fetch<ConnectorStatus>('/monitoring/connectors');
  }

  async getConnectorConfigs(): Promise<any> {
    return this.fetch<any>('/config/connectors');
  }

  async saveEmailConfig(apiKey: string, fromEmail: string): Promise<{ success: boolean; message: string }> {
    return this.fetch<{ success: boolean; message: string }>('/config/connectors/email', {
      method: 'POST',
      body: JSON.stringify({ apiKey, fromEmail }),
    });
  }

  async saveSmsConfig(accountSid: string, authToken: string, phoneNumber: string): Promise<{ success: boolean; message: string }> {
    return this.fetch<{ success: boolean; message: string }>('/config/connectors/sms', {
      method: 'POST',
      body: JSON.stringify({ accountSid, authToken, phoneNumber }),
    });
  }

  async deleteConnectorConfig(type: 'email' | 'sms'): Promise<{ success: boolean; message: string }> {
    return this.fetch<{ success: boolean; message: string }>(`/config/connectors/${type}`, {
      method: 'DELETE',
    });
  }

  // CLI Feed
  async getCliFeed(limit?: number): Promise<{
    messages: Array<{
      timestamp: string;
      source: 'conductor' | 'worker';
      sourceId: string;
      content: string;
      type: 'input' | 'output' | 'system';
    }>;
    count: number;
    totalBuffered: number;
  }> {
    return this.fetch(`/monitoring/cli-feed${limit ? `?limit=${limit}` : ''}`);
  }

  connectToCliFeed(): WebSocket {
    const wsUrl = `${API_BASE.replace('http', 'ws')}/monitoring/cli-feed/stream`;
    return new WebSocket(wsUrl);
  }

  // Worker Details
  async getWorkerDetails(workerId: string, limit?: number): Promise<{
    workerId: string;
    messages: Array<{
      timestamp: string;
      workerId: string;
      sandboxId: string;
      messageType: 'init' | 'user' | 'assistant' | 'tool_use' | 'tool_result' | 'result';
      content: any;
    }>;
    count: number;
    totalBuffered: number;
  }> {
    return this.fetch(`/monitoring/workers/${workerId}/details${limit ? `?limit=${limit}` : ''}`);
  }

  connectToWorkerStream(workerId: string): WebSocket {
    const wsUrl = `${API_BASE.replace('http', 'ws')}/monitoring/workers/${workerId}/stream`;
    return new WebSocket(wsUrl);
  }
}

export const api = new ApiClient();
