import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Terminal, Activity, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function CLIFeed() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef(null);
    const wsRef = useRef(null);
    // Load initial history
    const { data: initialData } = useQuery({
        queryKey: ['cli-feed'],
        queryFn: () => api.getCliFeed(100),
    });
    // Setup WebSocket connection
    useEffect(() => {
        if (initialData?.messages) {
            setMessages(initialData.messages.map(m => ({ ...m, timestamp: m.timestamp.toString() })));
        }
        const ws = api.connectToCliFeed();
        wsRef.current = ws;
        ws.onopen = () => {
            console.log('📡 CLI feed WebSocket connected');
            setIsConnected(true);
        };
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'history') {
                    // Initial history from server
                    setMessages(data.messages.map((m) => ({ ...m, timestamp: m.timestamp.toString() })));
                }
                else if (data.type === 'message') {
                    // New real-time message
                    setMessages((prev) => [...prev, { ...data.data, timestamp: data.data.timestamp.toString() }]);
                }
            }
            catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };
        ws.onclose = () => {
            console.log('📡 CLI feed WebSocket disconnected');
            setIsConnected(false);
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [initialData]);
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    const getMessageColor = (message) => {
        if (message.type === 'system')
            return '#666666';
        if (message.source === 'conductor')
            return '#FF6B35'; // Orange
        return '#22C55E'; // Green for workers
    };
    const getSourceIcon = (message) => {
        if (message.source === 'conductor') {
            return _jsx(Zap, { size: 12, style: { color: '#FF6B35' } });
        }
        return _jsx(Activity, { size: 12, style: { color: '#22C55E' } });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] mb-2 tracking-[0.2em] flex items-center gap-3", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                        }, children: _jsxs("button", { onClick: () => navigate('/'), className: "flex items-center gap-2 hover:opacity-70 transition-opacity", style: { color: '#FF6B35' }, children: [_jsx(ArrowLeft, { size: 12 }), _jsx("span", { children: "BACK TO MISSION CONTROL" })] }) }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-3 tracking-tight", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#FFFFFF',
                                            textShadow: '2px 2px 0 rgba(255, 107, 53, 0.3)',
                                        }, children: "CLI FEED" }), _jsx("p", { className: "text-base md:text-lg max-w-2xl leading-relaxed", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#999999',
                                        }, children: "Real-time output from conductor and workers" })] }), _jsxs("div", { className: "flex items-center gap-2 px-3 py-2", style: {
                                    backgroundColor: '#0F0F0F',
                                    border: `1px solid ${isConnected ? '#22C55E' : '#666666'}`,
                                }, children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: {
                                            backgroundColor: isConnected ? '#22C55E' : '#666666',
                                            boxShadow: isConnected ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none',
                                        } }), _jsx("span", { className: "text-xs tracking-wider", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: isConnected ? '#22C55E' : '#666666',
                                        }, children: isConnected ? 'LIVE' : 'OFFLINE' })] })] }), _jsx("div", { className: "h-[2px] mt-6", style: {
                            background: 'linear-gradient(90deg, #FF6B35 0%, transparent 50%, #FF6B35 100%)',
                            opacity: 0.3,
                        } })] }), _jsxs("div", { className: "relative", style: {
                    backgroundColor: '#0A0A0A',
                    border: '2px solid #1A1A1A',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
                }, children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b-2", style: {
                            borderColor: '#1A1A1A',
                            backgroundColor: '#0F0F0F',
                        }, children: [_jsx(Terminal, { size: 16, style: { color: '#FF6B35' } }), _jsx("span", { className: "text-xs tracking-widest", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#999999',
                                }, children: "SYSTEM OUTPUT" }), _jsx("div", { className: "ml-auto flex items-center gap-2", children: _jsxs("span", { className: "text-xs", style: {
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        color: '#666666',
                                    }, children: [messages.length, " MESSAGES"] }) })] }), _jsx("div", { ref: scrollRef, className: "p-4 space-y-2 overflow-y-auto", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            maxHeight: 'calc(100vh - 300px)',
                            minHeight: '400px',
                        }, children: messages.length === 0 ? (_jsxs("div", { className: "text-center py-12", style: { color: '#666666' }, children: [_jsx(Terminal, { size: 48, className: "mx-auto mb-4", style: { opacity: 0.3 } }), _jsx("p", { className: "text-sm", children: "Waiting for CLI output..." })] })) : (messages.map((message, index) => (_jsxs("div", { className: "flex items-start gap-3 py-2 px-3 hover:bg-opacity-50 transition-all", style: {
                                backgroundColor: message.type === 'system' ? '#0F0F0F' : 'transparent',
                                borderLeft: `2px solid ${getMessageColor(message)}`,
                            }, children: [_jsx("span", { className: "text-[10px] tracking-wider flex-shrink-0 pt-1", style: { color: '#666666', width: '70px' }, children: formatTimestamp(message.timestamp) }), _jsxs("div", { className: "flex items-center gap-2 px-2 py-1 flex-shrink-0", style: {
                                        backgroundColor: '#0F0F0F',
                                        border: `1px solid ${getMessageColor(message)}`,
                                        minWidth: '120px',
                                    }, children: [getSourceIcon(message), _jsx("span", { className: "text-[10px] tracking-wider uppercase", style: { color: getMessageColor(message) }, children: message.source })] }), _jsx("pre", { className: "flex-1 text-xs whitespace-pre-wrap break-words leading-relaxed", style: { color: '#CCCCCC' }, children: message.content })] }, index)))) }), _jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
                            background: 'linear-gradient(transparent 50%, rgba(255, 107, 53, 0.02) 50%)',
                            backgroundSize: '100% 4px',
                            animation: 'scan 8s linear infinite',
                        } })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", style: {
                    fontFamily: "'IBM Plex Mono', monospace",
                }, children: [_jsxs("div", { className: "p-4", style: {
                            backgroundColor: '#0F0F0F',
                            border: '1px solid #1A1A1A',
                        }, children: [_jsx("div", { className: "text-2xl font-bold mb-1", style: { color: '#FF6B35' }, children: messages.filter((m) => m.source === 'conductor').length }), _jsx("div", { className: "text-xs tracking-wider", style: { color: '#666666' }, children: "CONDUCTOR MESSAGES" })] }), _jsxs("div", { className: "p-4", style: {
                            backgroundColor: '#0F0F0F',
                            border: '1px solid #1A1A1A',
                        }, children: [_jsx("div", { className: "text-2xl font-bold mb-1", style: { color: '#22C55E' }, children: messages.filter((m) => m.source === 'worker').length }), _jsx("div", { className: "text-xs tracking-wider", style: { color: '#666666' }, children: "WORKER MESSAGES" })] }), _jsxs("div", { className: "p-4", style: {
                            backgroundColor: '#0F0F0F',
                            border: '1px solid #1A1A1A',
                        }, children: [_jsx("div", { className: "text-2xl font-bold mb-1", style: { color: '#FFFFFF' }, children: new Set(messages.map((m) => m.sourceId)).size }), _jsx("div", { className: "text-xs tracking-wider", style: { color: '#666666' }, children: "ACTIVE SESSIONS" })] })] }), _jsx("style", { children: `
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      ` })] }));
}
