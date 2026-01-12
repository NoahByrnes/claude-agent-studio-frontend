import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from './lib/auth-store';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AgentList from './pages/AgentList';
import AgentNew from './pages/AgentNew';
import AgentDetail from './pages/AgentDetail';
import Connectors from './pages/Connectors';
import { LogOut, Plug } from 'lucide-react';
function App() {
    const { user, signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen", style: {
            backgroundColor: '#0A0A0A',
            backgroundImage: user
                ? `
            linear-gradient(rgba(255, 107, 53, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 53, 0.02) 1px, transparent 1px)
          `
                : 'none',
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center',
        }, children: [user && (_jsx("header", { style: {
                    borderBottom: '1px solid #333333',
                    backgroundColor: '#0A0A0A',
                }, children: _jsxs("div", { className: "container mx-auto px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs mb-1", style: {
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        color: '#666666',
                                        letterSpacing: '0.1em',
                                    }, children: "SYS://STUDIO" }), _jsxs("h1", { className: "text-xl font-bold", style: {
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        color: '#FFFFFF',
                                        letterSpacing: '-0.01em',
                                    }, children: ["CLAUDE AGENT ", _jsx("span", { style: { color: '#FF6B35' }, children: "STUDIO" })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs(Link, { to: "/connectors", className: "flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-150", style: {
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        border: '1px solid #333333',
                                        color: '#CCCCCC',
                                        letterSpacing: '0.05em',
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.borderColor = '#FF6B35';
                                        e.currentTarget.style.color = '#FF6B35';
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.borderColor = '#333333';
                                        e.currentTarget.style.color = '#CCCCCC';
                                    }, children: [_jsx(Plug, { className: "w-4 h-4" }), "CONNECTORS"] }), _jsx("span", { className: "text-xs", style: {
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        color: '#999999',
                                    }, children: user.email }), _jsxs("button", { onClick: handleSignOut, className: "inline-flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all duration-150", style: {
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        border: '1px solid #333333',
                                        color: '#CCCCCC',
                                        letterSpacing: '0.05em',
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.borderColor = '#FF6B35';
                                        e.currentTarget.style.color = '#FF6B35';
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.borderColor = '#333333';
                                        e.currentTarget.style.color = '#CCCCCC';
                                    }, children: [_jsx(LogOut, { className: "w-4 h-4" }), "SIGN OUT"] })] })] }) })), _jsx("main", { className: user ? 'container mx-auto px-6 py-8' : '', children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/agents", element: _jsx(ProtectedRoute, { children: _jsx(AgentList, {}) }) }), _jsx(Route, { path: "/agents/new", element: _jsx(ProtectedRoute, { children: _jsx(AgentNew, {}) }) }), _jsx(Route, { path: "/agents/:id", element: _jsx(ProtectedRoute, { children: _jsx(AgentDetail, {}) }) }), _jsx(Route, { path: "/connectors", element: _jsx(ProtectedRoute, { children: _jsx(Connectors, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }));
}
export default App;
