import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth-store';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const signIn = useAuthStore((state) => state.signIn);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/');
        }
        catch (err) {
            setError(err.message || 'Failed to sign in');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center relative overflow-hidden", style: {
            backgroundColor: '#0A0A0A',
            backgroundImage: `
          linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px)
        `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
        }, children: [_jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.8) 100%)'
                } }), _jsxs("div", { className: "w-full max-w-md relative z-10 px-6", children: [_jsxs("div", { className: "mb-12", children: [_jsx("div", { className: "text-xs mb-2", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#666666',
                                    letterSpacing: '0.1em'
                                }, children: "SYS://AUTH" }), _jsxs("h1", { className: "text-4xl font-bold mb-3", style: {
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    color: '#FFFFFF',
                                    letterSpacing: '-0.02em'
                                }, children: ["CLAUDE AGENT", _jsx("br", {}), _jsx("span", { style: { color: '#FF6B35' }, children: "STUDIO" })] }), _jsx("p", { className: "text-sm", style: {
                                    fontFamily: "'Archivo', sans-serif",
                                    color: '#999999',
                                    letterSpacing: '0.01em'
                                }, children: "Autonomous deployment infrastructure" })] }), _jsxs("div", { className: "p-8", style: {
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #333333'
                        }, children: [_jsxs("div", { className: "mb-6 pb-4", style: {
                                    borderBottom: '1px solid #333333'
                                }, children: [_jsx("div", { className: "text-xs mb-1", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            color: '#666666',
                                            letterSpacing: '0.1em'
                                        }, children: "AUTHENTICATE" }), _jsx("div", { className: "text-sm", style: {
                                            fontFamily: "'Archivo', sans-serif",
                                            color: '#CCCCCC'
                                        }, children: "Enter credentials to access system" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && (_jsx("div", { className: "p-3 text-sm", style: {
                                            backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                            border: '1px solid rgba(255, 107, 53, 0.3)',
                                            color: '#FF6B35',
                                            fontFamily: "'Archivo', sans-serif"
                                        }, children: error })), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "email", className: "block text-xs font-medium", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#CCCCCC',
                                                    letterSpacing: '0.05em'
                                                }, children: "EMAIL" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                                    fontFamily: "'Archivo', sans-serif",
                                                    backgroundColor: '#0A0A0A',
                                                    border: '1px solid #333333',
                                                    color: '#FFFFFF',
                                                    outline: 'none',
                                                    fontSize: '0.9375rem'
                                                }, onFocus: (e) => {
                                                    e.target.style.borderColor = '#FF6B35';
                                                    e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                                }, onBlur: (e) => {
                                                    e.target.style.borderColor = '#333333';
                                                    e.target.style.boxShadow = 'none';
                                                }, required: true, autoComplete: "email" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "password", className: "block text-xs font-medium", style: {
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    color: '#CCCCCC',
                                                    letterSpacing: '0.05em'
                                                }, children: "PASSWORD" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-3 transition-all duration-150", style: {
                                                    fontFamily: "'Archivo', sans-serif",
                                                    backgroundColor: '#0A0A0A',
                                                    border: '1px solid #333333',
                                                    color: '#FFFFFF',
                                                    outline: 'none',
                                                    fontSize: '0.9375rem'
                                                }, onFocus: (e) => {
                                                    e.target.style.borderColor = '#FF6B35';
                                                    e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                                                }, onBlur: (e) => {
                                                    e.target.style.borderColor = '#333333';
                                                    e.target.style.boxShadow = 'none';
                                                }, required: true, autoComplete: "current-password" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full px-6 py-3.5 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            backgroundColor: '#FF6B35',
                                            color: '#0A0A0A',
                                            letterSpacing: '0.05em',
                                            fontSize: '0.875rem',
                                            fontWeight: 600
                                        }, onMouseEnter: (e) => {
                                            if (!loading) {
                                                e.currentTarget.style.backgroundColor = '#FF8555';
                                            }
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = '#FF6B35';
                                        }, children: loading ? 'AUTHENTICATING...' : 'SIGN IN' }), _jsx("div", { className: "pt-4", style: {
                                            borderTop: '1px solid #333333'
                                        }, children: _jsxs("p", { className: "text-center text-xs", style: {
                                                fontFamily: "'Archivo', sans-serif",
                                                color: '#666666'
                                            }, children: ["No account?", ' ', _jsx(Link, { to: "/signup", className: "font-medium transition-colors", style: {
                                                        color: '#FF6B35',
                                                        textDecoration: 'none'
                                                    }, onMouseEnter: (e) => {
                                                        e.currentTarget.style.color = '#FF8555';
                                                    }, onMouseLeave: (e) => {
                                                        e.currentTarget.style.color = '#FF6B35';
                                                    }, children: "Create one" })] }) })] })] }), _jsx("div", { className: "mt-8 text-center text-xs", style: {
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#333333',
                            letterSpacing: '0.1em'
                        }, children: "49.2827\u00B0N / 123.1207\u00B0W" })] })] }));
}
