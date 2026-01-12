import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Send, Zap, Activity, Terminal, Box, Clock } from 'lucide-react';
// Utility functions
const formatUptime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0)
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0)
        return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
};
const formatRelativeTime = (timestamp) => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0)
        return `${hours}h ago`;
    if (minutes > 0)
        return `${minutes}m ago`;
    return `${seconds}s ago`;
};
const truncateId = (id) => {
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
        mutationFn: (content) => api.sendConductorMessage(content),
        onSuccess: (data) => {
            setLastResponse(data.conductorResponse);
            setMessage('');
            queryClient.invalidateQueries({ queryKey: ['monitoring-status'] });
        },
    });
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessageMutation.mutate(message);
        }
    };
    const isOnline = status?.status === 'online';
    const conductor = status?.conductor;
    const workers = status?.workers || [];
    const getStatusColor = (status) => {
        switch (status) {
            case 'running':
                return '#22C55E'; // Green
            case 'initializing':
                return '#F59E0B'; // Amber/Yellow
            case 'complete':
                return '#3B82F6'; // Blue
            case 'error':
                return '#EF4444'; // Red
            case 'blocked':
                return '#FF6B35'; // Orange
            default:
                return '#666666'; // Gray
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-[10px] mb-2 tracking-[0.2em] flex items-center gap-3", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                        }, children: [_jsx("span", { children: "MISSION CONTROL" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full relative", style: {
                                                            backgroundColor: isOnline ? '#22C55E' : '#666666',
                                                            boxShadow: isOnline ? '0 0 12px rgba(34, 197, 94, 0.6)' : 'none',
                                                        }, children: isOnline && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute inset-0 rounded-full animate-ping", style: { backgroundColor: '#22C55E' } }), _jsx("div", { className: "absolute inset-0 rounded-full", style: { backgroundColor: '#22C55E' } })] })) }), _jsx("span", { style: {
                                                            color: isOnline ? '#22C55E' : '#666666',
                                                            letterSpacing: '0.1em',
                                                        }, children: isOnline ? 'LIVE' : 'OFFLINE' })] })] }), _jsxs("h1", { className: "text-4xl font-bold mb-2", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#FFFFFF',
                                            letterSpacing: '-0.02em',
                                            textShadow: isOnline ? '0 0 40px rgba(255, 107, 53, 0.3)' : 'none',
                                        }, children: ["CONDUCTOR", _jsx("span", { style: { color: '#FF6B35' }, children: " ORCHESTRATION" })] }), _jsx("p", { className: "text-sm", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#999999',
                                        }, children: "Autonomous agent infrastructure monitoring" })] }), conductor && (_jsxs("div", { className: "px-4 py-3", style: {
                                    border: '2px solid #FF6B35',
                                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                    fontFamily: "'IBM Plex Mono', monospace",
                                }, children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] text-[#999999] mb-1", children: "UPTIME" }), _jsx("div", { className: "text-2xl font-bold text-white tracking-tight", children: formatUptime(conductor.uptime || 0) })] }))] }), isOnline && (_jsx("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", style: { mixBlendMode: 'overlay', opacity: 0.03 }, children: _jsx("div", { className: "absolute inset-0 animate-pulse", style: {
                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #FF6B35 2px, #FF6B35 4px)',
                            } }) }))] }), isLoading ? (_jsxs("div", { className: "py-32 text-center", style: {
                    border: '1px solid #333333',
                    backgroundColor: '#0F0F0F',
                }, children: [_jsx(Activity, { className: "w-8 h-8 mx-auto mb-4 animate-pulse", style: { color: '#FF6B35' } }), _jsx("p", { className: "text-sm tracking-[0.1em]", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#666666',
                        }, children: "INITIALIZING SYSTEMS..." })] })) : !isOnline ? (_jsxs("div", { className: "py-32 text-center relative overflow-hidden", style: {
                    border: '1px solid #333333',
                    backgroundColor: '#0F0F0F',
                }, children: [_jsx("div", { className: "absolute inset-0 opacity-5", style: {
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #666666 20px, #666666 40px)',
                        } }), _jsx(Box, { className: "w-12 h-12 mx-auto mb-4", style: { color: '#666666' } }), _jsx("p", { className: "text-sm tracking-[0.1em]", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#666666',
                        }, children: "CONDUCTOR OFFLINE" }), _jsx("p", { className: "text-xs mt-2", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#444444',
                        }, children: "Awaiting first message to initialize" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative overflow-hidden", style: {
                            border: '2px solid #FF6B35',
                            backgroundColor: '#0F0F0F',
                        }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-[2px] animate-pulse", style: {
                                    background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
                                } }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-2", style: {
                                                    border: '2px solid #FF6B35',
                                                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                                }, children: _jsx(Zap, { className: "w-5 h-5", style: { color: '#FF6B35' } }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold tracking-tight", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                        }, children: "CONDUCTOR STATUS" }), _jsx("p", { className: "text-[10px] tracking-[0.15em]", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#999999',
                                                        }, children: "PRIMARY ORCHESTRATION NODE" })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-2", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#666666',
                                                        }, children: "SESSION ID" }), _jsx("div", { className: "text-sm font-bold truncate", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                        }, title: conductor?.sessionId, children: truncateId(conductor?.sessionId || 'N/A') })] }), _jsxs("div", { className: "p-4", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-2", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#666666',
                                                        }, children: "SANDBOX ID" }), _jsx("div", { className: "text-sm font-bold truncate", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                        }, title: conductor?.sandboxId, children: truncateId(conductor?.sandboxId || 'N/A') })] }), _jsxs("div", { className: "p-4", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-2", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#666666',
                                                        }, children: "ACTIVE WORKERS" }), _jsx("div", { className: "text-2xl font-bold", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: conductor?.activeWorkerCount ? '#FF6B35' : '#FFFFFF',
                                                        }, children: conductor?.activeWorkerCount || 0 })] }), _jsxs("div", { className: "p-4", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-2", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#666666',
                                                        }, children: "LAST ACTIVITY" }), _jsx("div", { className: "text-sm font-bold", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                        }, children: conductor?.lastActivity
                                                            ? formatRelativeTime(conductor.lastActivity)
                                                            : 'N/A' })] })] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-2", style: {
                                            border: '1px solid #333333',
                                            backgroundColor: '#1A1A1A',
                                        }, children: _jsx(Activity, { className: "w-4 h-4", style: { color: '#FF6B35' } }) }), _jsxs("h2", { className: "text-lg font-bold tracking-tight", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#FFFFFF',
                                        }, children: ["ACTIVE WORKERS", _jsxs("span", { className: "ml-3 text-sm", style: {
                                                    color: '#666666',
                                                }, children: ["[", workers.length, "]"] })] })] }), workers.length === 0 ? (_jsxs("div", { className: "py-16 text-center", style: {
                                    border: '1px dashed #333333',
                                    backgroundColor: '#0F0F0F',
                                }, children: [_jsx(Terminal, { className: "w-8 h-8 mx-auto mb-3", style: { color: '#444444' } }), _jsx("p", { className: "text-sm tracking-[0.1em]", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                        }, children: "NO ACTIVE WORKERS" }), _jsx("p", { className: "text-xs mt-2", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#444444',
                                        }, children: "Send a message to spawn workers" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: workers.map((worker, index) => (_jsxs(Link, { to: `/worker/${worker.id}`, className: "group relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]", style: {
                                        border: '1px solid #333333',
                                        backgroundColor: '#0F0F0F',
                                        animationDelay: `${index * 100}ms`,
                                    }, children: [_jsx("div", { className: "absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 group-hover:w-[4px]", style: {
                                                backgroundColor: getStatusColor(worker.status),
                                                boxShadow: `0 0 10px ${getStatusColor(worker.status)}80`,
                                            } }), _jsxs("div", { className: "p-5 pl-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#666666',
                                                                    }, children: "WORKER ID" }), _jsx("div", { className: "text-sm font-bold truncate", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#FFFFFF',
                                                                    }, title: worker.id, children: truncateId(worker.id) })] }), _jsx("div", { className: "px-3 py-1 text-[10px] tracking-[0.1em] font-bold", style: {
                                                                fontFamily: "'IBM Plex Mono', monospace",
                                                                border: `1px solid ${getStatusColor(worker.status)}`,
                                                                backgroundColor: `${getStatusColor(worker.status)}1A`,
                                                                color: getStatusColor(worker.status),
                                                            }, children: worker.status.toUpperCase() })] }), worker.task && (_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                                fontFamily: "'IBM Plex Mono', monospace",
                                                                color: '#666666',
                                                            }, children: "TASK" }), _jsx("div", { className: "text-xs line-clamp-2", style: {
                                                                fontFamily: "'IBM Plex Mono', monospace",
                                                                color: '#CCCCCC',
                                                                lineHeight: '1.5',
                                                            }, children: worker.task })] })), _jsxs("div", { className: "flex items-center gap-4 text-[10px]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-3 h-3", style: { color: '#666666' } }), _jsx("span", { style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#999999',
                                                                    }, children: formatRelativeTime(worker.createdAt) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Box, { className: "w-3 h-3", style: { color: '#666666' } }), _jsx("span", { className: "truncate max-w-[120px]", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#999999',
                                                                    }, title: worker.sandboxId, children: truncateId(worker.sandboxId) })] })] })] })] }, worker.id))) }))] }), _jsx("div", { className: "relative", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#0F0F0F',
                        }, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-2", style: {
                                                border: '1px solid #333333',
                                                backgroundColor: '#1A1A1A',
                                            }, children: _jsx(Terminal, { className: "w-4 h-4", style: { color: '#FF6B35' } }) }), _jsx("h2", { className: "text-lg font-bold tracking-tight", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#FFFFFF',
                                            }, children: "TEST INTERFACE" })] }), _jsxs("form", { onSubmit: handleSendMessage, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] tracking-[0.15em] mb-2", style: {
                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                        color: '#666666',
                                                    }, children: "MESSAGE CONTENT" }), _jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Enter task for conductor orchestration...", rows: 3, className: "w-full px-4 py-3 text-sm resize-none focus:outline-none transition-all duration-200", style: {
                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                        border: '1px solid #333333',
                                                        backgroundColor: '#1A1A1A',
                                                        color: '#FFFFFF',
                                                    }, onFocus: (e) => {
                                                        e.currentTarget.style.borderColor = '#FF6B35';
                                                        e.currentTarget.style.backgroundColor = '#0A0A0A';
                                                    }, onBlur: (e) => {
                                                        e.currentTarget.style.borderColor = '#333333';
                                                        e.currentTarget.style.backgroundColor = '#1A1A1A';
                                                    } })] }), _jsxs("button", { type: "submit", disabled: !message.trim() || sendMessageMutation.isPending, className: "inline-flex items-center gap-3 px-6 py-3 font-bold text-sm tracking-[0.05em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                backgroundColor: '#FF6B35',
                                                color: '#0A0A0A',
                                                border: '2px solid #FF6B35',
                                            }, onMouseEnter: (e) => {
                                                if (!sendMessageMutation.isPending && message.trim()) {
                                                    e.currentTarget.style.backgroundColor = '#0A0A0A';
                                                    e.currentTarget.style.color = '#FF6B35';
                                                }
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = '#FF6B35';
                                                e.currentTarget.style.color = '#0A0A0A';
                                            }, children: [_jsx(Send, { className: "w-4 h-4" }), sendMessageMutation.isPending ? 'TRANSMITTING...' : 'SEND TO CONDUCTOR'] })] }), lastResponse && (_jsxs("div", { className: "mt-6 p-4 relative overflow-hidden", style: {
                                        border: '1px solid #22C55E',
                                        backgroundColor: 'rgba(34, 197, 94, 0.05)',
                                    }, children: [_jsxs("div", { className: "text-[10px] tracking-[0.15em] mb-2 flex items-center gap-2", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#22C55E',
                                            }, children: [_jsx("div", { className: "w-2 h-2 rounded-full animate-pulse", style: { backgroundColor: '#22C55E' } }), "CONDUCTOR RESPONSE"] }), _jsx("div", { className: "text-sm whitespace-pre-wrap", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#FFFFFF',
                                                lineHeight: '1.6',
                                            }, children: lastResponse })] }))] }) })] }))] }));
}
