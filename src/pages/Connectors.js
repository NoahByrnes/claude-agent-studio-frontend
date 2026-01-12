import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Mail, MessageSquare, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Save, Trash2, Eye, EyeOff, } from 'lucide-react';
export default function Connectors() {
    const [emailExpanded, setEmailExpanded] = useState(false);
    const [smsExpanded, setSmsExpanded] = useState(false);
    const [copiedEnv, setCopiedEnv] = useState(null);
    const queryClient = useQueryClient();
    // Email form state
    const [emailApiKey, setEmailApiKey] = useState('');
    const [emailFrom, setEmailFrom] = useState('');
    const [showEmailKey, setShowEmailKey] = useState(false);
    // SMS form state
    const [smsAccountSid, setSmsAccountSid] = useState('');
    const [smsAuthToken, setSmsAuthToken] = useState('');
    const [smsPhone, setSmsPhone] = useState('');
    const [showSmsToken, setShowSmsToken] = useState(false);
    // Success/error messages
    const [emailMessage, setEmailMessage] = useState(null);
    const [smsMessage, setSmsMessage] = useState(null);
    const { data: status, isLoading } = useQuery({
        queryKey: ['connector-status'],
        queryFn: () => api.getConnectorStatus(),
        refetchInterval: 10000,
    });
    const { data: configs } = useQuery({
        queryKey: ['connector-configs'],
        queryFn: () => api.getConnectorConfigs(),
    });
    const saveEmailMutation = useMutation({
        mutationFn: () => api.saveEmailConfig(emailApiKey, emailFrom),
        onSuccess: (data) => {
            setEmailMessage({ type: 'success', text: data.message });
            setEmailApiKey('');
            setEmailFrom('');
            queryClient.invalidateQueries({ queryKey: ['connector-status'] });
            queryClient.invalidateQueries({ queryKey: ['connector-configs'] });
            setTimeout(() => setEmailMessage(null), 5000);
        },
        onError: (error) => {
            setEmailMessage({ type: 'error', text: error.message });
            setTimeout(() => setEmailMessage(null), 5000);
        },
    });
    const saveSmsMutation = useMutation({
        mutationFn: () => api.saveSmsConfig(smsAccountSid, smsAuthToken, smsPhone),
        onSuccess: (data) => {
            setSmsMessage({ type: 'success', text: data.message });
            setSmsAccountSid('');
            setSmsAuthToken('');
            setSmsPhone('');
            queryClient.invalidateQueries({ queryKey: ['connector-status'] });
            queryClient.invalidateQueries({ queryKey: ['connector-configs'] });
            setTimeout(() => setSmsMessage(null), 5000);
        },
        onError: (error) => {
            setSmsMessage({ type: 'error', text: error.message });
            setTimeout(() => setSmsMessage(null), 5000);
        },
    });
    const deleteConnectorMutation = useMutation({
        mutationFn: (type) => api.deleteConnectorConfig(type),
        onSuccess: (data, type) => {
            if (type === 'email') {
                setEmailMessage({ type: 'success', text: data.message });
                setTimeout(() => setEmailMessage(null), 5000);
            }
            else {
                setSmsMessage({ type: 'success', text: data.message });
                setTimeout(() => setSmsMessage(null), 5000);
            }
            queryClient.invalidateQueries({ queryKey: ['connector-status'] });
            queryClient.invalidateQueries({ queryKey: ['connector-configs'] });
        },
    });
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopiedEnv(label);
        setTimeout(() => setCopiedEnv(null), 2000);
    };
    const emailConfigured = status?.email?.configured || configs?.email?.enabled;
    const smsConfigured = status?.sms?.configured || configs?.sms?.enabled;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] mb-2 tracking-[0.2em]", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#666666',
                        }, children: "SYSTEM INTEGRATION" }), _jsxs("h1", { className: "text-4xl font-bold mb-2", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#FFFFFF',
                            letterSpacing: '-0.02em',
                        }, children: ["CONNECTOR", _jsx("span", { style: { color: '#FF6B35' }, children: " CONFIGURATION" })] }), _jsx("p", { className: "text-sm", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#999999',
                        }, children: "Configure email and SMS integrations for autonomous agent communication" })] }), !isLoading && (!emailConfigured || !smsConfigured) && (_jsxs("div", { className: "p-4 relative overflow-hidden", style: {
                    border: '2px solid #FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                }, children: [_jsx("div", { className: "absolute top-0 left-0 bottom-0 w-1", style: { backgroundColor: '#FF6B35' } }), _jsxs("div", { className: "flex items-start gap-3 pl-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 mt-0.5", style: { color: '#FF6B35' } }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#FF6B35',
                                            letterSpacing: '0.02em',
                                        }, children: "CONNECTORS REQUIRE CONFIGURATION" }), _jsxs("p", { className: "text-xs", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#CCCCCC',
                                            lineHeight: '1.6',
                                        }, children: [!emailConfigured && !smsConfigured
                                                ? 'Both email and SMS connectors need to be configured.'
                                                : !emailConfigured
                                                    ? 'Email connector needs to be configured.'
                                                    : 'SMS connector needs to be configured.', ' Enter your credentials below.'] })] })] })] })), isLoading ? (_jsx("div", { className: "py-32 text-center", style: {
                    border: '1px solid #333333',
                    backgroundColor: '#0F0F0F',
                }, children: _jsx("p", { className: "text-sm tracking-[0.1em]", style: {
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#666666',
                    }, children: "LOADING CONNECTOR STATUS..." }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative overflow-hidden", style: {
                            border: `2px solid ${emailConfigured ? '#22C55E' : '#333333'}`,
                            backgroundColor: '#0F0F0F',
                        }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-1", style: {
                                    backgroundColor: emailConfigured ? '#22C55E' : '#333333',
                                    boxShadow: emailConfigured ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
                                } }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3", style: {
                                                            border: `2px solid ${emailConfigured ? '#22C55E' : '#333333'}`,
                                                            backgroundColor: emailConfigured ? 'rgba(34, 197, 94, 0.1)' : '#1A1A1A',
                                                        }, children: _jsx(Mail, { className: "w-6 h-6", style: { color: emailConfigured ? '#22C55E' : '#666666' } }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", style: {
                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                    color: '#FFFFFF',
                                                                }, children: "EMAIL" }), _jsx("p", { className: "text-[10px] tracking-[0.15em]", style: {
                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                    color: '#666666',
                                                                }, children: "SENDGRID INTEGRATION" })] })] }), _jsx("div", { className: "flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.1em] font-bold", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    border: `1px solid ${emailConfigured ? '#22C55E' : '#666666'}`,
                                                    backgroundColor: emailConfigured
                                                        ? 'rgba(34, 197, 94, 0.1)'
                                                        : 'rgba(102, 102, 102, 0.1)',
                                                    color: emailConfigured ? '#22C55E' : '#666666',
                                                }, children: emailConfigured ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), "ACTIVE"] })) : (_jsxs(_Fragment, { children: [_jsx(AlertCircle, { className: "w-3 h-3" }), "INACTIVE"] })) })] }), _jsxs("div", { className: "space-y-4", children: [emailMessage && (_jsx("div", { className: "p-3", style: {
                                                    border: `1px solid ${emailMessage.type === 'success' ? '#22C55E' : '#EF4444'}`,
                                                    backgroundColor: emailMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                }, children: _jsx("p", { className: "text-xs", style: {
                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                        color: emailMessage.type === 'success' ? '#22C55E' : '#EF4444',
                                                    }, children: emailMessage.text }) })), configs?.email && (_jsx("div", { className: "p-4", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#666666',
                                                                    }, children: "API KEY (ENCRYPTED)" }), _jsx("div", { className: "text-sm font-mono", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#FFFFFF',
                                                                    }, children: configs.email.settings?.apiKey || '••••••••' })] }), _jsxs("div", { children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#666666',
                                                                    }, children: "FROM EMAIL" }), _jsx("div", { className: "text-sm font-mono", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#FFFFFF',
                                                                    }, children: configs.email.settings?.fromEmail || 'Not set' })] }), _jsxs("button", { onClick: () => deleteConnectorMutation.mutate('email'), disabled: deleteConnectorMutation.isPending, className: "flex items-center gap-2 px-3 py-2 text-xs font-bold transition-all", style: {
                                                                fontFamily: "'IBM Plex Mono', monospace",
                                                                border: '1px solid #EF4444',
                                                                color: '#EF4444',
                                                            }, onMouseEnter: (e) => {
                                                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                                            }, onMouseLeave: (e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }, children: [_jsx(Trash2, { className: "w-3 h-3" }), "DELETE CONFIG"] })] }) })), _jsxs("div", { children: [_jsxs("div", { className: "text-xs mb-2 tracking-[0.1em]", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#999999',
                                                        }, children: [configs?.email ? 'UPDATE' : 'CONFIGURE', " SENDGRID CREDENTIALS"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] tracking-[0.15em] mb-2", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            color: '#666666',
                                                                        }, children: "SENDGRID API KEY" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showEmailKey ? 'text' : 'password', value: emailApiKey, onChange: (e) => setEmailApiKey(e.target.value), placeholder: "SG.xxxxxxxxxxxxxxxxxxxxx", className: "w-full px-4 py-3 pr-12 text-sm focus:outline-none transition-all", style: {
                                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                                    border: '1px solid #333333',
                                                                                    backgroundColor: '#1A1A1A',
                                                                                    color: '#FFFFFF',
                                                                                }, onFocus: (e) => {
                                                                                    e.currentTarget.style.borderColor = '#FF6B35';
                                                                                }, onBlur: (e) => {
                                                                                    e.currentTarget.style.borderColor = '#333333';
                                                                                } }), _jsx("button", { type: "button", onClick: () => setShowEmailKey(!showEmailKey), className: "absolute right-3 top-1/2 -translate-y-1/2", style: { color: '#666666' }, children: showEmailKey ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] tracking-[0.15em] mb-2", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            color: '#666666',
                                                                        }, children: "FROM EMAIL ADDRESS" }), _jsx("input", { type: "email", value: emailFrom, onChange: (e) => setEmailFrom(e.target.value), placeholder: "agent@yourdomain.com", className: "w-full px-4 py-3 text-sm focus:outline-none transition-all", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            border: '1px solid #333333',
                                                                            backgroundColor: '#1A1A1A',
                                                                            color: '#FFFFFF',
                                                                        }, onFocus: (e) => {
                                                                            e.currentTarget.style.borderColor = '#FF6B35';
                                                                        }, onBlur: (e) => {
                                                                            e.currentTarget.style.borderColor = '#333333';
                                                                        } })] }), _jsxs("button", { onClick: () => saveEmailMutation.mutate(), disabled: !emailApiKey || !emailFrom || saveEmailMutation.isPending, className: "flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                    backgroundColor: '#FF6B35',
                                                                    color: '#0A0A0A',
                                                                    border: '2px solid #FF6B35',
                                                                }, onMouseEnter: (e) => {
                                                                    if (!saveEmailMutation.isPending && emailApiKey && emailFrom) {
                                                                        e.currentTarget.style.backgroundColor = '#0A0A0A';
                                                                        e.currentTarget.style.color = '#FF6B35';
                                                                    }
                                                                }, onMouseLeave: (e) => {
                                                                    e.currentTarget.style.backgroundColor = '#FF6B35';
                                                                    e.currentTarget.style.color = '#0A0A0A';
                                                                }, children: [_jsx(Save, { className: "w-4 h-4" }), saveEmailMutation.isPending ? 'SAVING...' : 'SAVE CONFIGURATION'] })] })] })] }), _jsxs("button", { onClick: () => setEmailExpanded(!emailExpanded), className: "w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200 mt-4", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            border: '1px solid #333333',
                                            backgroundColor: '#1A1A1A',
                                            color: '#FF6B35',
                                            letterSpacing: '0.05em',
                                        }, onMouseEnter: (e) => {
                                            e.currentTarget.style.borderColor = '#FF6B35';
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.borderColor = '#333333';
                                            e.currentTarget.style.backgroundColor = '#1A1A1A';
                                        }, children: [_jsx("span", { children: "SETUP INSTRUCTIONS" }), emailExpanded ? _jsx(ChevronDown, { className: "w-4 h-4" }) : _jsx(ChevronRight, { className: "w-4 h-4" })] })] })] }), _jsxs("div", { className: "relative overflow-hidden", style: {
                            border: `2px solid ${smsConfigured ? '#22C55E' : '#333333'}`,
                            backgroundColor: '#0F0F0F',
                        }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-1", style: {
                                    backgroundColor: smsConfigured ? '#22C55E' : '#333333',
                                    boxShadow: smsConfigured ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
                                } }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3", style: {
                                                            border: `2px solid ${smsConfigured ? '#22C55E' : '#333333'}`,
                                                            backgroundColor: smsConfigured ? 'rgba(34, 197, 94, 0.1)' : '#1A1A1A',
                                                        }, children: _jsx(MessageSquare, { className: "w-6 h-6", style: { color: smsConfigured ? '#22C55E' : '#666666' } }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", style: {
                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                    color: '#FFFFFF',
                                                                }, children: "SMS" }), _jsx("p", { className: "text-[10px] tracking-[0.15em]", style: {
                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                    color: '#666666',
                                                                }, children: "TWILIO INTEGRATION" })] })] }), _jsx("div", { className: "flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.1em] font-bold", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    border: `1px solid ${smsConfigured ? '#22C55E' : '#666666'}`,
                                                    backgroundColor: smsConfigured
                                                        ? 'rgba(34, 197, 94, 0.1)'
                                                        : 'rgba(102, 102, 102, 0.1)',
                                                    color: smsConfigured ? '#22C55E' : '#666666',
                                                }, children: smsConfigured ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), "ACTIVE"] })) : (_jsxs(_Fragment, { children: [_jsx(AlertCircle, { className: "w-3 h-3" }), "INACTIVE"] })) })] }), _jsxs("div", { className: "space-y-4", children: [smsMessage && (_jsx("div", { className: "p-3", style: {
                                                    border: `1px solid ${smsMessage.type === 'success' ? '#22C55E' : '#EF4444'}`,
                                                    backgroundColor: smsMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                }, children: _jsx("p", { className: "text-xs", style: {
                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                        color: smsMessage.type === 'success' ? '#22C55E' : '#EF4444',
                                                    }, children: smsMessage.text }) })), configs?.sms && (_jsx("div", { className: "p-4", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#666666',
                                                                    }, children: "ACCOUNT SID (ENCRYPTED)" }), _jsx("div", { className: "text-sm font-mono", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#FFFFFF',
                                                                    }, children: configs.sms.settings?.accountSid || '••••••••' })] }), _jsxs("div", { children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#666666',
                                                                    }, children: "PHONE NUMBER" }), _jsx("div", { className: "text-sm font-mono", style: {
                                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                                        color: '#FFFFFF',
                                                                    }, children: configs.sms.settings?.phoneNumber || 'Not set' })] }), _jsxs("button", { onClick: () => deleteConnectorMutation.mutate('sms'), disabled: deleteConnectorMutation.isPending, className: "flex items-center gap-2 px-3 py-2 text-xs font-bold transition-all", style: {
                                                                fontFamily: "'IBM Plex Mono', monospace",
                                                                border: '1px solid #EF4444',
                                                                color: '#EF4444',
                                                            }, onMouseEnter: (e) => {
                                                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                                            }, onMouseLeave: (e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }, children: [_jsx(Trash2, { className: "w-3 h-3" }), "DELETE CONFIG"] })] }) })), _jsxs("div", { children: [_jsxs("div", { className: "text-xs mb-2 tracking-[0.1em]", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#999999',
                                                        }, children: [configs?.sms ? 'UPDATE' : 'CONFIGURE', " TWILIO CREDENTIALS"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] tracking-[0.15em] mb-2", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            color: '#666666',
                                                                        }, children: "ACCOUNT SID" }), _jsx("input", { type: "text", value: smsAccountSid, onChange: (e) => setSmsAccountSid(e.target.value), placeholder: "ACxxxxxxxxxxxxxxxxxxxx", className: "w-full px-4 py-3 text-sm focus:outline-none transition-all", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            border: '1px solid #333333',
                                                                            backgroundColor: '#1A1A1A',
                                                                            color: '#FFFFFF',
                                                                        }, onFocus: (e) => {
                                                                            e.currentTarget.style.borderColor = '#FF6B35';
                                                                        }, onBlur: (e) => {
                                                                            e.currentTarget.style.borderColor = '#333333';
                                                                        } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] tracking-[0.15em] mb-2", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            color: '#666666',
                                                                        }, children: "AUTH TOKEN" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showSmsToken ? 'text' : 'password', value: smsAuthToken, onChange: (e) => setSmsAuthToken(e.target.value), placeholder: "xxxxxxxxxxxxxxxxxxxxxxx", className: "w-full px-4 py-3 pr-12 text-sm focus:outline-none transition-all", style: {
                                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                                    border: '1px solid #333333',
                                                                                    backgroundColor: '#1A1A1A',
                                                                                    color: '#FFFFFF',
                                                                                }, onFocus: (e) => {
                                                                                    e.currentTarget.style.borderColor = '#FF6B35';
                                                                                }, onBlur: (e) => {
                                                                                    e.currentTarget.style.borderColor = '#333333';
                                                                                } }), _jsx("button", { type: "button", onClick: () => setShowSmsToken(!showSmsToken), className: "absolute right-3 top-1/2 -translate-y-1/2", style: { color: '#666666' }, children: showSmsToken ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] tracking-[0.15em] mb-2", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            color: '#666666',
                                                                        }, children: "PHONE NUMBER (E.164)" }), _jsx("input", { type: "tel", value: smsPhone, onChange: (e) => setSmsPhone(e.target.value), placeholder: "+1234567890", className: "w-full px-4 py-3 text-sm focus:outline-none transition-all", style: {
                                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                                            border: '1px solid #333333',
                                                                            backgroundColor: '#1A1A1A',
                                                                            color: '#FFFFFF',
                                                                        }, onFocus: (e) => {
                                                                            e.currentTarget.style.borderColor = '#FF6B35';
                                                                        }, onBlur: (e) => {
                                                                            e.currentTarget.style.borderColor = '#333333';
                                                                        } })] }), _jsxs("button", { onClick: () => saveSmsMutation.mutate(), disabled: !smsAccountSid || !smsAuthToken || !smsPhone || saveSmsMutation.isPending, className: "flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                                    backgroundColor: '#FF6B35',
                                                                    color: '#0A0A0A',
                                                                    border: '2px solid #FF6B35',
                                                                }, onMouseEnter: (e) => {
                                                                    if (!saveSmsMutation.isPending && smsAccountSid && smsAuthToken && smsPhone) {
                                                                        e.currentTarget.style.backgroundColor = '#0A0A0A';
                                                                        e.currentTarget.style.color = '#FF6B35';
                                                                    }
                                                                }, onMouseLeave: (e) => {
                                                                    e.currentTarget.style.backgroundColor = '#FF6B35';
                                                                    e.currentTarget.style.color = '#0A0A0A';
                                                                }, children: [_jsx(Save, { className: "w-4 h-4" }), saveSmsMutation.isPending ? 'SAVING...' : 'SAVE CONFIGURATION'] })] })] })] }), _jsxs("button", { onClick: () => setSmsExpanded(!smsExpanded), className: "w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200 mt-4", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            border: '1px solid #333333',
                                            backgroundColor: '#1A1A1A',
                                            color: '#FF6B35',
                                            letterSpacing: '0.05em',
                                        }, onMouseEnter: (e) => {
                                            e.currentTarget.style.borderColor = '#FF6B35';
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.borderColor = '#333333';
                                            e.currentTarget.style.backgroundColor = '#1A1A1A';
                                        }, children: [_jsx("span", { children: "SETUP INSTRUCTIONS" }), smsExpanded ? _jsx(ChevronDown, { className: "w-4 h-4" }) : _jsx(ChevronRight, { className: "w-4 h-4" })] })] })] }), emailExpanded && (_jsxs("div", { className: "p-6", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#0F0F0F',
                        }, children: [_jsxs("p", { className: "text-xs mb-4", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#999999',
                                }, children: ["To get your SendGrid API key, visit", ' ', _jsx("a", { href: "https://app.sendgrid.com/settings/api_keys", target: "_blank", rel: "noopener noreferrer", className: "underline", style: { color: '#FF6B35' }, children: "SendGrid Dashboard" }), ". Create an API key with \"Full Access\" permissions."] }), _jsxs("p", { className: "text-xs", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#999999',
                                }, children: ["For detailed setup instructions including webhook configuration, see the", ' ', _jsx("a", { href: "https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md", target: "_blank", rel: "noopener noreferrer", className: "underline", style: { color: '#FF6B35' }, children: "full guide" }), "."] })] })), smsExpanded && (_jsxs("div", { className: "p-6", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#0F0F0F',
                        }, children: [_jsxs("p", { className: "text-xs mb-4", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#999999',
                                }, children: ["To get your Twilio credentials, visit", ' ', _jsx("a", { href: "https://console.twilio.com/", target: "_blank", rel: "noopener noreferrer", className: "underline", style: { color: '#FF6B35' }, children: "Twilio Console" }), ". Your Account SID and Auth Token are on the dashboard."] }), _jsxs("p", { className: "text-xs", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#999999',
                                }, children: ["For detailed setup instructions including webhook configuration, see the", ' ', _jsx("a", { href: "https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md", target: "_blank", rel: "noopener noreferrer", className: "underline", style: { color: '#FF6B35' }, children: "full guide" }), "."] })] }))] }))] }));
}
