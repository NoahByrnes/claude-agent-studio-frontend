import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Mail, MessageSquare, CheckCircle2, AlertCircle, Copy, ExternalLink, ChevronDown, ChevronRight, } from 'lucide-react';
export default function Connectors() {
    const [emailExpanded, setEmailExpanded] = useState(false);
    const [smsExpanded, setSmsExpanded] = useState(false);
    const [copiedEnv, setCopiedEnv] = useState(null);
    const { data: status, isLoading } = useQuery({
        queryKey: ['connector-status'],
        queryFn: () => api.getConnectorStatus(),
        refetchInterval: 10000,
    });
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopiedEnv(label);
        setTimeout(() => setCopiedEnv(null), 2000);
    };
    const emailConfigured = status?.email?.configured;
    const smsConfigured = status?.sms?.configured;
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
                                                    : 'SMS connector needs to be configured.', ' Follow the setup instructions below to enable agent communication.'] })] })] })] })), isLoading ? (_jsx("div", { className: "py-32 text-center", style: {
                    border: '1px solid #333333',
                    backgroundColor: '#0F0F0F',
                }, children: _jsx("p", { className: "text-sm tracking-[0.1em]", style: {
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#666666',
                    }, children: "LOADING CONNECTOR STATUS..." }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "relative overflow-hidden", style: {
                                    border: `2px solid ${emailConfigured ? '#22C55E' : '#333333'}`,
                                    backgroundColor: '#0F0F0F',
                                }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-1", style: {
                                            backgroundColor: emailConfigured ? '#22C55E' : '#333333',
                                            boxShadow: emailConfigured ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
                                        } }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3", style: {
                                                                    border: `2px solid ${emailConfigured ? '#22C55E' : '#333333'}`,
                                                                    backgroundColor: emailConfigured
                                                                        ? 'rgba(34, 197, 94, 0.1)'
                                                                        : '#1A1A1A',
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
                                                        }, children: emailConfigured ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), "ACTIVE"] })) : (_jsxs(_Fragment, { children: [_jsx(AlertCircle, { className: "w-3 h-3" }), "INACTIVE"] })) })] }), emailConfigured && status?.email?.fromAddress && (_jsxs("div", { className: "mb-4 p-3", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#666666',
                                                        }, children: "FROM ADDRESS" }), _jsx("div", { className: "text-sm font-bold", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                        }, children: status.email.fromAddress })] })), _jsxs("button", { onClick: () => setEmailExpanded(!emailExpanded), className: "w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200", style: {
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
                                                }, children: [_jsx("span", { children: "VIEW SETUP INSTRUCTIONS" }), emailExpanded ? (_jsx(ChevronDown, { className: "w-4 h-4" })) : (_jsx(ChevronRight, { className: "w-4 h-4" }))] })] })] }), _jsxs("div", { className: "relative overflow-hidden", style: {
                                    border: `2px solid ${smsConfigured ? '#22C55E' : '#333333'}`,
                                    backgroundColor: '#0F0F0F',
                                }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-1", style: {
                                            backgroundColor: smsConfigured ? '#22C55E' : '#333333',
                                            boxShadow: smsConfigured ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
                                        } }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3", style: {
                                                                    border: `2px solid ${smsConfigured ? '#22C55E' : '#333333'}`,
                                                                    backgroundColor: smsConfigured
                                                                        ? 'rgba(34, 197, 94, 0.1)'
                                                                        : '#1A1A1A',
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
                                                        }, children: smsConfigured ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), "ACTIVE"] })) : (_jsxs(_Fragment, { children: [_jsx(AlertCircle, { className: "w-3 h-3" }), "INACTIVE"] })) })] }), smsConfigured && status?.sms?.phoneNumber && (_jsxs("div", { className: "mb-4 p-3", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#1A1A1A',
                                                }, children: [_jsx("div", { className: "text-[10px] tracking-[0.15em] mb-1", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#666666',
                                                        }, children: "PHONE NUMBER" }), _jsx("div", { className: "text-sm font-bold", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                        }, children: status.sms.phoneNumber })] })), _jsxs("button", { onClick: () => setSmsExpanded(!smsExpanded), className: "w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200", style: {
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
                                                }, children: [_jsx("span", { children: "VIEW SETUP INSTRUCTIONS" }), smsExpanded ? (_jsx(ChevronDown, { className: "w-4 h-4" })) : (_jsx(ChevronRight, { className: "w-4 h-4" }))] })] })] })] }), emailExpanded && (_jsx("div", { className: "relative overflow-hidden", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#0F0F0F',
                        }, children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#FFFFFF',
                                            }, children: "\uD83D\uDCE7 SENDGRID EMAIL SETUP" }), _jsxs("a", { href: "https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 text-xs px-3 py-2 transition-all duration-200", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                border: '1px solid #333333',
                                                color: '#999999',
                                            }, onMouseEnter: (e) => {
                                                e.currentTarget.style.borderColor = '#FF6B35';
                                                e.currentTarget.style.color = '#FF6B35';
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.borderColor = '#333333';
                                                e.currentTarget.style.color = '#999999';
                                            }, children: ["FULL GUIDE", _jsx(ExternalLink, { className: "w-3 h-3" })] })] }), _jsx("div", { className: "space-y-4", children: [
                                        {
                                            num: '01',
                                            title: 'CREATE SENDGRID ACCOUNT',
                                            desc: 'Sign up at sendgrid.com (free tier: 100 emails/day)',
                                        },
                                        {
                                            num: '02',
                                            title: 'GENERATE API KEY',
                                            desc: 'Settings → API Keys → Create API Key (Full Access)',
                                        },
                                        {
                                            num: '03',
                                            title: 'CONFIGURE INBOUND PARSE',
                                            desc: 'Settings → Inbound Parse → Add webhook URL',
                                        },
                                        {
                                            num: '04',
                                            title: 'SET ENVIRONMENT VARIABLES',
                                            desc: 'Add credentials to Railway',
                                        },
                                    ].map((step) => (_jsxs("div", { className: "flex gap-4 p-4", style: {
                                            border: '1px solid #333333',
                                            backgroundColor: '#1A1A1A',
                                        }, children: [_jsx("div", { className: "text-2xl font-bold", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#FF6B35',
                                                    opacity: 0.3,
                                                }, children: step.num }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold mb-1", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                            letterSpacing: '0.05em',
                                                        }, children: step.title }), _jsx("div", { className: "text-xs", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#999999',
                                                        }, children: step.desc })] })] }, step.num))) }), _jsxs("div", { children: [_jsx("div", { className: "text-xs mb-3 tracking-[0.15em]", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#999999',
                                            }, children: "RAILWAY ENVIRONMENT VARIABLES" }), _jsx("div", { className: "space-y-2", children: [
                                                { key: 'SENDGRID_API_KEY', value: 'SG.xxxxxxxxxxxxxxxxxxxxx' },
                                                { key: 'SENDGRID_FROM_EMAIL', value: 'agent@yourdomain.com' },
                                            ].map((env) => (_jsxs("div", { className: "group relative flex items-center justify-between p-3", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#0A0A0A',
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                }, children: [_jsxs("div", { className: "flex-1", children: [_jsx("span", { style: { color: '#22C55E' }, children: env.key }), _jsx("span", { style: { color: '#666666' }, children: "=" }), _jsx("span", { style: { color: '#FFFFFF' }, children: env.value })] }), _jsx("button", { onClick: () => copyToClipboard(`${env.key}=${env.value}`, env.key), className: "opacity-0 group-hover:opacity-100 transition-opacity p-2", style: {
                                                            border: '1px solid #333333',
                                                            backgroundColor: '#1A1A1A',
                                                        }, children: _jsx(Copy, { className: "w-3 h-3", style: { color: '#FF6B35' } }) }), copiedEnv === env.key && (_jsx("div", { className: "absolute -top-8 right-0 px-2 py-1 text-[10px]", style: {
                                                            backgroundColor: '#22C55E',
                                                            color: '#0A0A0A',
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                        }, children: "COPIED" }))] }, env.key))) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs mb-3 tracking-[0.15em]", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#999999',
                                            }, children: "INBOUND PARSE WEBHOOK URL" }), _jsxs("div", { className: "group relative flex items-center justify-between p-3", style: {
                                                border: '2px solid #FF6B35',
                                                backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                                fontFamily: "'IBM Plex Mono', monospace",
                                            }, children: [_jsx("div", { className: "flex-1 text-sm", style: { color: '#FFFFFF' }, children: "https://backend-api-production-8b0b.up.railway.app/api/webhooks/email" }), _jsx("button", { onClick: () => copyToClipboard('https://backend-api-production-8b0b.up.railway.app/api/webhooks/email', 'webhook'), className: "p-2", style: {
                                                        border: '1px solid #FF6B35',
                                                        backgroundColor: '#0A0A0A',
                                                    }, children: _jsx(Copy, { className: "w-3 h-3", style: { color: '#FF6B35' } }) }), copiedEnv === 'webhook' && (_jsx("div", { className: "absolute -top-8 right-0 px-2 py-1 text-[10px]", style: {
                                                        backgroundColor: '#22C55E',
                                                        color: '#0A0A0A',
                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                    }, children: "COPIED" }))] })] })] }) })), smsExpanded && (_jsx("div", { className: "relative overflow-hidden", style: {
                            border: '1px solid #333333',
                            backgroundColor: '#0F0F0F',
                        }, children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#FFFFFF',
                                            }, children: "\uD83D\uDCF1 TWILIO SMS SETUP" }), _jsxs("a", { href: "https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 text-xs px-3 py-2 transition-all duration-200", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                border: '1px solid #333333',
                                                color: '#999999',
                                            }, onMouseEnter: (e) => {
                                                e.currentTarget.style.borderColor = '#FF6B35';
                                                e.currentTarget.style.color = '#FF6B35';
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.borderColor = '#333333';
                                                e.currentTarget.style.color = '#999999';
                                            }, children: ["FULL GUIDE", _jsx(ExternalLink, { className: "w-3 h-3" })] })] }), _jsx("div", { className: "space-y-4", children: [
                                        {
                                            num: '01',
                                            title: 'CREATE TWILIO ACCOUNT',
                                            desc: 'Sign up at twilio.com (free trial includes $15 credit)',
                                        },
                                        {
                                            num: '02',
                                            title: 'GET PHONE NUMBER',
                                            desc: 'Phone Numbers → Buy a number with SMS support',
                                        },
                                        {
                                            num: '03',
                                            title: 'CONFIGURE SMS WEBHOOK',
                                            desc: 'Set "A MESSAGE COMES IN" webhook URL',
                                        },
                                        {
                                            num: '04',
                                            title: 'SET ENVIRONMENT VARIABLES',
                                            desc: 'Add credentials to Railway',
                                        },
                                    ].map((step) => (_jsxs("div", { className: "flex gap-4 p-4", style: {
                                            border: '1px solid #333333',
                                            backgroundColor: '#1A1A1A',
                                        }, children: [_jsx("div", { className: "text-2xl font-bold", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#FF6B35',
                                                    opacity: 0.3,
                                                }, children: step.num }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold mb-1", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#FFFFFF',
                                                            letterSpacing: '0.05em',
                                                        }, children: step.title }), _jsx("div", { className: "text-xs", style: {
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                            color: '#999999',
                                                        }, children: step.desc })] })] }, step.num))) }), _jsxs("div", { children: [_jsx("div", { className: "text-xs mb-3 tracking-[0.15em]", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#999999',
                                            }, children: "RAILWAY ENVIRONMENT VARIABLES" }), _jsx("div", { className: "space-y-2", children: [
                                                { key: 'TWILIO_ACCOUNT_SID', value: 'ACxxxxxxxxxxxxxxxxxxxx' },
                                                { key: 'TWILIO_AUTH_TOKEN', value: 'xxxxxxxxxxxxxxxxxxxxxxx' },
                                                { key: 'TWILIO_PHONE_NUMBER', value: '+1234567890' },
                                            ].map((env) => (_jsxs("div", { className: "group relative flex items-center justify-between p-3", style: {
                                                    border: '1px solid #333333',
                                                    backgroundColor: '#0A0A0A',
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                }, children: [_jsxs("div", { className: "flex-1", children: [_jsx("span", { style: { color: '#22C55E' }, children: env.key }), _jsx("span", { style: { color: '#666666' }, children: "=" }), _jsx("span", { style: { color: '#FFFFFF' }, children: env.value })] }), _jsx("button", { onClick: () => copyToClipboard(`${env.key}=${env.value}`, env.key), className: "opacity-0 group-hover:opacity-100 transition-opacity p-2", style: {
                                                            border: '1px solid #333333',
                                                            backgroundColor: '#1A1A1A',
                                                        }, children: _jsx(Copy, { className: "w-3 h-3", style: { color: '#FF6B35' } }) }), copiedEnv === env.key && (_jsx("div", { className: "absolute -top-8 right-0 px-2 py-1 text-[10px]", style: {
                                                            backgroundColor: '#22C55E',
                                                            color: '#0A0A0A',
                                                            fontFamily: "'IBM Plex Mono', monospace",
                                                        }, children: "COPIED" }))] }, env.key))) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs mb-3 tracking-[0.15em]", style: {
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                color: '#999999',
                                            }, children: "MESSAGING WEBHOOK URL" }), _jsxs("div", { className: "group relative flex items-center justify-between p-3", style: {
                                                border: '2px solid #FF6B35',
                                                backgroundColor: 'rgba(255, 107, 53, 0.05)',
                                                fontFamily: "'IBM Plex Mono', monospace",
                                            }, children: [_jsx("div", { className: "flex-1 text-sm", style: { color: '#FFFFFF' }, children: "https://backend-api-production-8b0b.up.railway.app/api/webhooks/sms" }), _jsx("button", { onClick: () => copyToClipboard('https://backend-api-production-8b0b.up.railway.app/api/webhooks/sms', 'sms-webhook'), className: "p-2", style: {
                                                        border: '1px solid #FF6B35',
                                                        backgroundColor: '#0A0A0A',
                                                    }, children: _jsx(Copy, { className: "w-3 h-3", style: { color: '#FF6B35' } }) }), copiedEnv === 'sms-webhook' && (_jsx("div", { className: "absolute -top-8 right-0 px-2 py-1 text-[10px]", style: {
                                                        backgroundColor: '#22C55E',
                                                        color: '#0A0A0A',
                                                        fontFamily: "'IBM Plex Mono', monospace",
                                                    }, children: "COPIED" }))] })] })] }) }))] }))] }));
}
