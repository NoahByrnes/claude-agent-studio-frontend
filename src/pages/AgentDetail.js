import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Play, Square, Trash2, ArrowLeft } from 'lucide-react';
export default function AgentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: agent, isLoading } = useQuery({
        queryKey: ['agent', id],
        queryFn: () => api.getAgent(id),
        enabled: !!id,
    });
    const { data: logs } = useQuery({
        queryKey: ['agent-logs', id],
        queryFn: () => api.getAgentLogs(id),
        enabled: !!id,
        refetchInterval: 5000,
    });
    const { data: metrics } = useQuery({
        queryKey: ['agent-metrics', id],
        queryFn: () => api.getAgentMetrics(id),
        enabled: !!id,
        refetchInterval: 10000,
    });
    const deployMutation = useMutation({
        mutationFn: () => api.deployAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agent', id] });
        },
    });
    const stopMutation = useMutation({
        mutationFn: () => api.stopAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agent', id] });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => api.deleteAgent(id),
        onSuccess: () => {
            navigate('/');
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "text-center py-16", style: {
                border: '1px solid #333333',
                backgroundColor: '#1A1A1A',
            }, children: _jsx("p", { className: "text-sm", style: {
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#666666',
                    letterSpacing: '0.05em',
                }, children: "LOADING AGENT..." }) }));
    }
    if (!agent) {
        return (_jsx("div", { className: "text-center py-16", style: {
                border: '1px solid #333333',
                backgroundColor: '#1A1A1A',
            }, children: _jsx("p", { className: "text-sm", style: {
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#EF4444',
                    letterSpacing: '0.05em',
                }, children: "AGENT NOT FOUND" }) }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-4 flex-1", children: [_jsx("button", { onClick: () => navigate('/'), className: "p-2 transition-colors duration-150", style: {
                                    border: '1px solid #333333',
                                    color: '#CCCCCC',
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.borderColor = '#FF6B35';
                                    e.currentTarget.style.color = '#FF6B35';
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.borderColor = '#333333';
                                    e.currentTarget.style.color = '#CCCCCC';
                                }, children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "text-xs mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.1em',
                                        }, children: ["AGENT://", agent.id.toUpperCase().slice(0, 8)] }), _jsx("h1", { className: "text-3xl font-bold mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#FFFFFF',
                                            letterSpacing: '-0.02em',
                                        }, children: agent.name }), agent.config.description && (_jsx("p", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#999999',
                                        }, children: agent.config.description }))] })] }), _jsxs("div", { className: "flex gap-3", children: [agent.status === 'running' ? (_jsxs("button", { onClick: () => stopMutation.mutate(), disabled: stopMutation.isPending, className: "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-150 disabled:opacity-50", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#EF4444',
                                    letterSpacing: '0.05em',
                                }, onMouseEnter: (e) => {
                                    if (!stopMutation.isPending) {
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                                    }
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                                }, children: [_jsx(Square, { className: "w-4 h-4" }), "STOP"] })) : (_jsxs("button", { onClick: () => deployMutation.mutate(), disabled: deployMutation.isPending, className: "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-150 disabled:opacity-50", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    backgroundColor: '#FF6B35',
                                    color: '#0A0A0A',
                                    letterSpacing: '0.05em',
                                }, onMouseEnter: (e) => {
                                    if (!deployMutation.isPending) {
                                        e.currentTarget.style.backgroundColor = '#FF8555';
                                    }
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = '#FF6B35';
                                }, children: [_jsx(Play, { className: "w-4 h-4" }), "DEPLOY"] })), _jsxs("button", { onClick: () => {
                                    if (confirm('Are you sure you want to delete this agent?')) {
                                        deleteMutation.mutate();
                                    }
                                }, disabled: deleteMutation.isPending, className: "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-150 disabled:opacity-50", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#EF4444',
                                    letterSpacing: '0.05em',
                                }, onMouseEnter: (e) => {
                                    if (!deleteMutation.isPending) {
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                                    }
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                }, children: [_jsx(Trash2, { className: "w-4 h-4" }), "DELETE"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-6", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#1A1A1A',
                        }, children: [_jsx("div", { className: "text-xs mb-2", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.1em',
                                }, children: "STATUS" }), _jsx("div", { className: "text-2xl font-semibold capitalize", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: agent.status === 'running'
                                        ? '#22C55E'
                                        : agent.status === 'error'
                                            ? '#EF4444'
                                            : '#FFFFFF',
                                    letterSpacing: '-0.01em',
                                }, children: agent.status })] }), _jsxs("div", { className: "p-6", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#1A1A1A',
                        }, children: [_jsx("div", { className: "text-xs mb-2", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.1em',
                                }, children: "TASKS COMPLETED" }), _jsx("div", { className: "text-2xl font-semibold", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#FFFFFF',
                                    letterSpacing: '-0.01em',
                                }, children: metrics?.tasks_completed || 0 })] }), _jsxs("div", { className: "p-6", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#1A1A1A',
                        }, children: [_jsx("div", { className: "text-xs mb-2", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.1em',
                                }, children: "UPTIME" }), _jsx("div", { className: "text-2xl font-semibold", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#FFFFFF',
                                    letterSpacing: '-0.01em',
                                }, children: metrics?.uptime_seconds ? `${Math.floor(metrics.uptime_seconds / 60)}m` : '0m' })] })] }), _jsxs("div", { className: "p-8 space-y-6", style: {
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                }, children: [_jsxs("div", { className: "pb-4", style: {
                            borderBottom: '1px solid #333333',
                        }, children: [_jsx("div", { className: "text-xs mb-1", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.1em',
                                }, children: "CONFIGURATION" }), _jsx("div", { className: "text-sm", style: {
                                    fontFamily: "'Archivo', sans-serif",
                                    color: '#CCCCCC',
                                }, children: "Agent deployment and runtime parameters" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs block mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.05em',
                                        }, children: "MODEL" }), _jsx("span", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#FFFFFF',
                                        }, children: agent.config.model })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs block mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.05em',
                                        }, children: "TEMPERATURE" }), _jsx("span", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#FFFFFF',
                                        }, children: agent.config.temperature })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs block mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.05em',
                                        }, children: "DEPLOYMENT TYPE" }), _jsx("span", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#FFFFFF',
                                        }, children: agent.config.deployment.type })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs block mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.05em',
                                        }, children: "SANDBOX" }), _jsx("span", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#FFFFFF',
                                        }, children: agent.config.deployment.sandbox })] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs block mb-2", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.05em',
                                }, children: "SYSTEM PROMPT" }), _jsx("pre", { className: "text-sm p-4 overflow-auto whitespace-pre-wrap", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    backgroundColor: '#0A0A0A',
                                    border: '1px solid #333333',
                                    color: '#CCCCCC',
                                    lineHeight: '1.6',
                                }, children: agent.config.system_prompt })] })] }), _jsxs("div", { className: "overflow-hidden", style: {
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                }, children: [_jsxs("div", { className: "p-6 pb-4", style: {
                            borderBottom: '1px solid #333333',
                        }, children: [_jsx("div", { className: "text-xs mb-1", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.1em',
                                }, children: "ACTIVITY LOG" }), _jsx("div", { className: "text-sm", style: {
                                    fontFamily: "'Archivo', sans-serif",
                                    color: '#CCCCCC',
                                }, children: "Real-time agent execution events" })] }), logs?.logs.length === 0 ? (_jsx("div", { className: "p-8 text-center", style: {
                            color: '#666666',
                        }, children: _jsx("p", { className: "text-sm", style: {
                                fontFamily: "'Archivo', sans-serif",
                            }, children: "No activity recorded" }) })) : (_jsx("div", { className: "max-h-96 overflow-auto", children: logs?.logs.map((log) => (_jsx("div", { className: "p-4 transition-colors duration-150", style: {
                                borderBottom: '1px solid #333333',
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.backgroundColor = '#1F1F1F';
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }, children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium mb-1", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#FFFFFF',
                                                    letterSpacing: '-0.01em',
                                                }, children: log.action_type }), log.tool_name && (_jsxs("div", { className: "text-xs", style: {
                                                    fontFamily: "'Archivo', sans-serif",
                                                    color: '#999999',
                                                }, children: ["Tool: ", log.tool_name] }))] }), _jsx("div", { className: "text-xs", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                        }, children: new Date(log.timestamp).toLocaleString() })] }) }, log.id))) }))] })] }));
}
