import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { ArrowLeft } from 'lucide-react';
export default function AgentNew() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
        mutationFn: (data) => api.createAgent(data),
        onSuccess: (agent) => {
            navigate(`/agents/${agent.id}`);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/'), className: "p-2 transition-colors duration-150", style: {
                            border: '1px solid #333333',
                            color: '#CCCCCC',
                        }, onMouseEnter: (e) => {
                            e.currentTarget.style.borderColor = '#FF6B35';
                            e.currentTarget.style.color = '#FF6B35';
                        }, onMouseLeave: (e) => {
                            e.currentTarget.style.borderColor = '#333333';
                            e.currentTarget.style.color = '#CCCCCC';
                        }, children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-xs mb-1", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.1em',
                                }, children: "CONFIGURE" }), _jsxs("h1", { className: "text-3xl font-bold", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#FFFFFF',
                                    letterSpacing: '-0.02em',
                                }, children: ["NEW ", _jsx("span", { style: { color: '#FF6B35' }, children: "AGENT" })] })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { className: "p-8 space-y-6", style: {
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #333333',
                        }, children: [_jsxs("div", { className: "pb-4 mb-6", style: {
                                    borderBottom: '1px solid #333333',
                                }, children: [_jsx("div", { className: "text-xs mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.1em',
                                        }, children: "AGENT IDENTITY" }), _jsx("div", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#CCCCCC',
                                        }, children: "Basic agent configuration and metadata" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-xs font-medium", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#CCCCCC',
                                            letterSpacing: '0.05em',
                                        }, children: "NAME" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            backgroundColor: '#0A0A0A',
                                            border: '1px solid #333333',
                                            color: '#FFFFFF',
                                            outline: 'none',
                                            fontSize: '0.9375rem',
                                        }, onFocus: (e) => {
                                            e.target.style.borderColor = '#FF6B35';
                                            e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                        }, onBlur: (e) => {
                                            e.target.style.borderColor = '#333333';
                                            e.target.style.boxShadow = 'none';
                                        }, placeholder: "e.g., AP Invoice Processor", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-xs font-medium", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#CCCCCC',
                                            letterSpacing: '0.05em',
                                        }, children: "DESCRIPTION" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            backgroundColor: '#0A0A0A',
                                            border: '1px solid #333333',
                                            color: '#FFFFFF',
                                            outline: 'none',
                                            fontSize: '0.9375rem',
                                        }, onFocus: (e) => {
                                            e.target.style.borderColor = '#FF6B35';
                                            e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                        }, onBlur: (e) => {
                                            e.target.style.borderColor = '#333333';
                                            e.target.style.boxShadow = 'none';
                                        }, placeholder: "Brief description of agent functionality" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-xs font-medium", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#CCCCCC',
                                            letterSpacing: '0.05em',
                                        }, children: "SYSTEM PROMPT" }), _jsx("textarea", { value: formData.system_prompt, onChange: (e) => setFormData({ ...formData, system_prompt: e.target.value }), className: "w-full px-4 py-3 h-32 transition-all duration-150", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            backgroundColor: '#0A0A0A',
                                            border: '1px solid #333333',
                                            color: '#FFFFFF',
                                            outline: 'none',
                                            fontSize: '0.9375rem',
                                            resize: 'vertical',
                                        }, onFocus: (e) => {
                                            e.target.style.borderColor = '#FF6B35';
                                            e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                        }, onBlur: (e) => {
                                            e.target.style.borderColor = '#333333';
                                            e.target.style.boxShadow = 'none';
                                        }, placeholder: "You are an AI assistant that...", required: true })] })] }), _jsxs("div", { className: "p-8 space-y-6", style: {
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #333333',
                        }, children: [_jsxs("div", { className: "pb-4 mb-6", style: {
                                    borderBottom: '1px solid #333333',
                                }, children: [_jsx("div", { className: "text-xs mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.1em',
                                        }, children: "MODEL PARAMETERS" }), _jsx("div", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#CCCCCC',
                                        }, children: "AI model selection and configuration" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-xs font-medium", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#CCCCCC',
                                                    letterSpacing: '0.05em',
                                                }, children: "MODEL" }), _jsxs("select", { value: formData.model, onChange: (e) => setFormData({ ...formData, model: e.target.value }), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                                    fontFamily: "'Archivo', sans-serif",
                                                    backgroundColor: '#0A0A0A',
                                                    border: '1px solid #333333',
                                                    color: '#FFFFFF',
                                                    outline: 'none',
                                                    fontSize: '0.9375rem',
                                                }, onFocus: (e) => {
                                                    e.target.style.borderColor = '#FF6B35';
                                                    e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                                }, onBlur: (e) => {
                                                    e.target.style.borderColor = '#333333';
                                                    e.target.style.boxShadow = 'none';
                                                }, children: [_jsx("option", { value: "claude-sonnet-4-5", children: "Claude Sonnet 4.5" }), _jsx("option", { value: "claude-opus-4-5", children: "Claude Opus 4.5" }), _jsx("option", { value: "claude-haiku-4", children: "Claude Haiku 4" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-xs font-medium", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#CCCCCC',
                                                    letterSpacing: '0.05em',
                                                }, children: "TEMPERATURE" }), _jsx("input", { type: "number", value: formData.temperature, onChange: (e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) }), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                                    fontFamily: "'Archivo', sans-serif",
                                                    backgroundColor: '#0A0A0A',
                                                    border: '1px solid #333333',
                                                    color: '#FFFFFF',
                                                    outline: 'none',
                                                    fontSize: '0.9375rem',
                                                }, onFocus: (e) => {
                                                    e.target.style.borderColor = '#FF6B35';
                                                    e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                                }, onBlur: (e) => {
                                                    e.target.style.borderColor = '#333333';
                                                    e.target.style.boxShadow = 'none';
                                                }, min: "0", max: "1", step: "0.1" })] })] })] }), _jsxs("div", { className: "p-8 space-y-6", style: {
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #333333',
                        }, children: [_jsxs("div", { className: "pb-4 mb-6", style: {
                                    borderBottom: '1px solid #333333',
                                }, children: [_jsx("div", { className: "text-xs mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.1em',
                                        }, children: "DEPLOYMENT CONFIG" }), _jsx("div", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#CCCCCC',
                                        }, children: "Runtime environment and execution settings" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-xs font-medium", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#CCCCCC',
                                                    letterSpacing: '0.05em',
                                                }, children: "DEPLOYMENT TYPE" }), _jsxs("select", { value: formData.deployment.type, onChange: (e) => setFormData({
                                                    ...formData,
                                                    deployment: {
                                                        ...formData.deployment,
                                                        type: e.target.value,
                                                    },
                                                }), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                                    fontFamily: "'Archivo', sans-serif",
                                                    backgroundColor: '#0A0A0A',
                                                    border: '1px solid #333333',
                                                    color: '#FFFFFF',
                                                    outline: 'none',
                                                    fontSize: '0.9375rem',
                                                }, onFocus: (e) => {
                                                    e.target.style.borderColor = '#FF6B35';
                                                    e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                                }, onBlur: (e) => {
                                                    e.target.style.borderColor = '#333333';
                                                    e.target.style.boxShadow = 'none';
                                                }, children: [_jsx("option", { value: "event-driven", children: "Event-driven" }), _jsx("option", { value: "long-running", children: "Long-running" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-xs font-medium", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#CCCCCC',
                                                    letterSpacing: '0.05em',
                                                }, children: "SANDBOX" }), _jsxs("select", { value: formData.deployment.sandbox, onChange: (e) => setFormData({
                                                    ...formData,
                                                    deployment: {
                                                        ...formData.deployment,
                                                        sandbox: e.target.value,
                                                    },
                                                }), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                                    fontFamily: "'Archivo', sans-serif",
                                                    backgroundColor: '#0A0A0A',
                                                    border: '1px solid #333333',
                                                    color: '#FFFFFF',
                                                    outline: 'none',
                                                    fontSize: '0.9375rem',
                                                }, onFocus: (e) => {
                                                    e.target.style.borderColor = '#FF6B35';
                                                    e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                                }, onBlur: (e) => {
                                                    e.target.style.borderColor = '#333333';
                                                    e.target.style.boxShadow = 'none';
                                                }, children: [_jsx("option", { value: "cloudflare", children: "Cloudflare" }), _jsx("option", { value: "e2b", children: "E2B" }), _jsx("option", { value: "local", children: "Local" })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", id: "auto_restart", checked: formData.deployment.auto_restart, onChange: (e) => setFormData({
                                            ...formData,
                                            deployment: {
                                                ...formData.deployment,
                                                auto_restart: e.target.checked,
                                            },
                                        }), className: "w-4 h-4", style: {
                                            accentColor: '#FF6B35',
                                        } }), _jsx("label", { htmlFor: "auto_restart", className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#CCCCCC',
                                        }, children: "Auto-restart on failure" })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", disabled: createMutation.isPending, className: "px-6 py-3.5 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    backgroundColor: '#FF6B35',
                                    color: '#0A0A0A',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                }, onMouseEnter: (e) => {
                                    if (!createMutation.isPending) {
                                        e.currentTarget.style.backgroundColor = '#FF8555';
                                    }
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = '#FF6B35';
                                }, children: createMutation.isPending ? 'CREATING...' : 'CREATE AGENT' }), _jsx("button", { type: "button", onClick: () => navigate('/'), className: "px-6 py-3.5 font-medium transition-colors duration-150", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    border: '1px solid #333333',
                                    color: '#CCCCCC',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.875rem',
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.borderColor = '#666666';
                                    e.currentTarget.style.backgroundColor = '#1A1A1A';
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.borderColor = '#333333';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }, children: "CANCEL" })] }), createMutation.isError && (_jsxs("div", { className: "p-3 text-sm", style: {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#EF4444',
                            fontFamily: "'Archivo', sans-serif",
                        }, children: ["Error: ", createMutation.error.message] }))] })] }));
}
