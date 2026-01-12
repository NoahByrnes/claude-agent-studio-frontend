import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from './lib/auth-store';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AgentList from './pages/AgentList';
import AgentNew from './pages/AgentNew';
import AgentDetail from './pages/AgentDetail';
import Connectors from './pages/Connectors';
import { LogOut, Plug, Home } from 'lucide-react';

function App() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const showHomeButton = user && location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup');

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#0A0A0A',
        backgroundImage: user
          ? `
            linear-gradient(rgba(255, 107, 53, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 53, 0.02) 1px, transparent 1px)
          `
          : 'none',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center',
      }}
    >
      {user && (
        <header
          style={{
            borderBottom: '1px solid #333333',
            backgroundColor: '#0A0A0A',
          }}
        >
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div
                  className="text-xs mb-1"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#666666',
                    letterSpacing: '0.1em',
                  }}
                >
                  SYS://STUDIO
                </div>
                <h1
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  CLAUDE AGENT <span style={{ color: '#FF6B35' }}>STUDIO</span>
                </h1>
              </div>
              {showHomeButton && (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-150"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    border: '1px solid #333333',
                    color: '#CCCCCC',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF6B35';
                    e.currentTarget.style.color = '#FF6B35';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333333';
                    e.currentTarget.style.color = '#CCCCCC';
                  }}
                >
                  <Home className="w-4 h-4" />
                  HOME
                </Link>
              )}
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/connectors"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-150"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  border: '1px solid #333333',
                  color: '#CCCCCC',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF6B35';
                  e.currentTarget.style.color = '#FF6B35';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#CCCCCC';
                }}
              >
                <Plug className="w-4 h-4" />
                CONNECTORS
              </Link>
              <span
                className="text-xs"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#999999',
                }}
              >
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all duration-150"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  border: '1px solid #333333',
                  color: '#CCCCCC',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF6B35';
                  e.currentTarget.style.color = '#FF6B35';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#CCCCCC';
                }}
              >
                <LogOut className="w-4 h-4" />
                SIGN OUT
              </button>
            </div>
          </div>
        </header>
      )}
      <main className={user ? 'container mx-auto px-6 py-8' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AgentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents/new"
            element={
              <ProtectedRoute>
                <AgentNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents/:id"
            element={
              <ProtectedRoute>
                <AgentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connectors"
            element={
              <ProtectedRoute>
                <Connectors />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
