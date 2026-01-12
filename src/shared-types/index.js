import { z } from 'zod';
// Agent Status
export const AgentStatus = z.enum(['idle', 'running', 'stopped', 'error', 'deploying']);
// MCP Server Configuration
export const MCPServerConfig = z.object({
    name: z.string(),
    url: z.string().url(),
    permissions: z.array(z.string()),
});
// Hook Configuration
export const HookConfig = z.object({
    type: z.enum(['PreTurn', 'PostTurn', 'PreToolUse', 'PostToolUse']),
    handler: z.string(),
});
// Deployment Configuration
export const DeploymentConfig = z.object({
    type: z.enum(['long-running', 'event-driven']),
    sandbox: z.enum(['cloudflare', 'e2b', 'local']),
    auto_restart: z.boolean(),
});
// Agent Configuration
export const AgentConfig = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    system_prompt: z.string().min(1),
    model: z.string().default('claude-sonnet-4-5'),
    temperature: z.number().min(0).max(1).default(0.2),
    max_turns: z.number().int().positive().optional(),
    mcp_servers: z.array(MCPServerConfig),
    hooks: z.array(HookConfig).optional(),
    deployment: DeploymentConfig,
});
// Agent Entity
export const Agent = z.object({
    id: z.string().uuid(),
    name: z.string(),
    status: AgentStatus,
    config: AgentConfig,
    created_at: z.date(),
    updated_at: z.date(),
});
// Session
export const Session = z.object({
    id: z.string().uuid(),
    agent_id: z.string().uuid(),
    session_id: z.string(),
    state: z.record(z.unknown()),
    last_active: z.date(),
    created_at: z.date(),
});
// Audit Log
export const AuditLog = z.object({
    id: z.string().uuid(),
    agent_id: z.string().uuid(),
    session_id: z.string().optional(),
    action_type: z.string(),
    tool_name: z.string().optional(),
    input_data: z.record(z.unknown()).optional(),
    output_data: z.record(z.unknown()).optional(),
    timestamp: z.date(),
});
// API Request/Response Types
export const CreateAgentRequest = AgentConfig;
export const UpdateAgentRequest = AgentConfig.partial();
export const AgentResponse = Agent;
export const AgentListResponse = z.object({
    agents: z.array(Agent),
    total: z.number(),
});
export const DeployAgentRequest = z.object({
    agent_id: z.string().uuid(),
});
export const LogsRequest = z.object({
    agent_id: z.string().uuid(),
    limit: z.number().int().positive().default(100),
    offset: z.number().int().nonnegative().default(0),
    action_type: z.string().optional(),
    tool_name: z.string().optional(),
});
export const LogsResponse = z.object({
    logs: z.array(AuditLog),
    total: z.number(),
});
export const MetricsResponse = z.object({
    agent_id: z.string().uuid(),
    tasks_completed: z.number(),
    tasks_failed: z.number(),
    uptime_seconds: z.number(),
    last_active: z.date().nullable(),
});
// Event Types
export const AgentEvent = z.object({
    id: z.string().uuid(),
    agent_id: z.string().uuid(),
    event_type: z.enum(['email', 'sms', 'webhook', 'scheduled']),
    payload: z.record(z.unknown()),
    timestamp: z.date(),
});
// Error Response
export const ErrorResponse = z.object({
    error: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
});
// Conductor/Worker Monitoring Types
export const ConductorStatus = z.object({
    sessionId: z.string().optional(),
    sandboxId: z.string().optional(),
    uptime: z.number().optional(),
    lastActivity: z.string().optional(),
    activeWorkerCount: z.number().optional(),
});
export const WorkerStatus = z.object({
    id: z.string(),
    sandboxId: z.string(),
    task: z.string().optional(),
    status: z.string(),
    createdAt: z.string(),
});
export const MonitoringStatusResponse = z.object({
    status: z.enum(['online', 'offline']),
    conductor: ConductorStatus.nullable(),
    workers: z.array(WorkerStatus),
    timestamp: z.string(),
});
export const MonitoringMetricsResponse = z.object({
    status: z.string(),
    uptime: z.number(),
    totalMessages: z.number(),
    totalWorkers: z.number(),
    activeWorkers: z.number(),
    timestamp: z.string(),
});
export const SendMessageRequest = z.object({
    source: z.enum(['USER', 'EMAIL', 'SMS']),
    content: z.string(),
});
// Connector Configuration Types
export const ConnectorStatus = z.object({
    email: z.object({
        configured: z.boolean(),
        fromAddress: z.string().optional(),
    }),
    sms: z.object({
        configured: z.boolean(),
        phoneNumber: z.string().optional(),
    }),
});
