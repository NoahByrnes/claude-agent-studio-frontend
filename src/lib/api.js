import { supabase } from './supabase';
const API_BASE = import.meta.env.VITE_API_BASE || '/api';
class ApiClient {
    async getAuthHeaders() {
        const { data: { session }, } = await supabase.auth.getSession();
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
    async fetch(url, options) {
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
    async getAgents() {
        return this.fetch('/agents');
    }
    async getAgent(id) {
        return this.fetch(`/agents/${id}`);
    }
    async createAgent(config) {
        return this.fetch('/agents', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }
    async updateAgent(id, config) {
        return this.fetch(`/agents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(config),
        });
    }
    async deleteAgent(id) {
        await this.fetch(`/agents/${id}`, {
            method: 'DELETE',
        });
    }
    async deployAgent(id) {
        await this.fetch(`/agents/${id}/deploy`, {
            method: 'POST',
        });
    }
    async stopAgent(id) {
        await this.fetch(`/agents/${id}/stop`, {
            method: 'POST',
        });
    }
    async getAgentLogs(id, params) {
        const query = new URLSearchParams(params).toString();
        return this.fetch(`/agents/${id}/logs${query ? `?${query}` : ''}`);
    }
    async getAgentMetrics(id) {
        return this.fetch(`/agents/${id}/metrics`);
    }
    // WebSocket for live logs
    connectToLogs(agentId) {
        const wsUrl = `${API_BASE.replace('http', 'ws')}/agents/${agentId}/logs/stream`;
        return new WebSocket(wsUrl);
    }
    // Conductor/Worker Monitoring
    async getMonitoringStatus() {
        return this.fetch('/monitoring/status');
    }
    async getMonitoringMetrics() {
        return this.fetch('/monitoring/metrics');
    }
    async getActiveWorkers() {
        return this.fetch('/monitoring/workers');
    }
    async sendTestMessage(message) {
        return this.fetch('/monitoring/test', {
            method: 'POST',
            body: JSON.stringify(message),
        });
    }
    async getMonitoringHealth() {
        return this.fetch('/monitoring/health');
    }
    async sendConductorMessage(content, source = 'USER') {
        return this.fetch('/webhooks/conductor/message', {
            method: 'POST',
            body: JSON.stringify({ source, content }),
        });
    }
    // Connector Configuration
    async getConnectorStatus() {
        return this.fetch('/monitoring/connectors');
    }
    async getConnectorConfigs() {
        return this.fetch('/config/connectors');
    }
    async saveEmailConfig(apiKey, fromEmail) {
        return this.fetch('/config/connectors/email', {
            method: 'POST',
            body: JSON.stringify({ apiKey, fromEmail }),
        });
    }
    async saveSmsConfig(accountSid, authToken, phoneNumber) {
        return this.fetch('/config/connectors/sms', {
            method: 'POST',
            body: JSON.stringify({ accountSid, authToken, phoneNumber }),
        });
    }
    async deleteConnectorConfig(type) {
        return this.fetch(`/config/connectors/${type}`, {
            method: 'DELETE',
        });
    }
}
export const api = new ApiClient();
