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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#0A0A0A',
        backgroundImage: `
          linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}
    >
      {/* Subtle grid overlay with fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.8) 100%)'
        }}
      />

      <div className="w-full max-w-md relative z-10 px-6">
        {/* Technical header */}
        <div className="mb-12">
          <div
            className="text-xs mb-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
              letterSpacing: '0.1em'
            }}
          >
            SYS://AUTH
          </div>
          <h1
            className="text-4xl font-bold mb-3"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}
          >
            CLAUDE AGENT
            <br />
            <span style={{ color: '#FF6B35' }}>STUDIO</span>
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "'Archivo', sans-serif",
              color: '#999999',
              letterSpacing: '0.01em'
            }}
          >
            Autonomous deployment infrastructure
          </p>
        </div>

        {/* Login card */}
        <div
          className="p-8"
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333'
          }}
        >
          {/* Card header */}
          <div
            className="mb-6 pb-4"
            style={{
              borderBottom: '1px solid #333333'
            }}
          >
            <div
              className="text-xs mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
                letterSpacing: '0.1em'
              }}
            >
              AUTHENTICATE
            </div>
            <div
              className="text-sm"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: '#CCCCCC'
              }}
            >
              Enter credentials to access system
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="p-3 text-sm"
                style={{
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  color: '#FF6B35',
                  fontFamily: "'Archivo', sans-serif"
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#CCCCCC',
                  letterSpacing: '0.05em'
                }}
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 transition-all duration-150"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9375rem'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333';
                  e.target.style.boxShadow = 'none';
                }}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#CCCCCC',
                  letterSpacing: '0.05em'
                }}
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 transition-all duration-150"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9375rem'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 1px #FF6B35';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333';
                  e.target.style.boxShadow = 'none';
                }}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                backgroundColor: '#FF6B35',
                color: '#0A0A0A',
                letterSpacing: '0.05em',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#FF8555';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF6B35';
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </button>

            <div
              className="pt-4"
              style={{
                borderTop: '1px solid #333333'
              }}
            >
              <p
                className="text-center text-xs"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  color: '#666666'
                }}
              >
                No account?{' '}
                <Link
                  to="/signup"
                  className="font-medium transition-colors"
                  style={{
                    color: '#FF6B35',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FF8555';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#FF6B35';
                  }}
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer coordinates */}
        <div
          className="mt-8 text-center text-xs"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#333333',
            letterSpacing: '0.1em'
          }}
        >
          49.2827°N / 123.1207°W
        </div>
      </div>
    </div>
  );
}
