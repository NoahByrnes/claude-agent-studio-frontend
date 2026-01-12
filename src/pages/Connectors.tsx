import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export default function Connectors() {
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [smsExpanded, setSmsExpanded] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState<string | null>(null);

  const { data: status, isLoading } = useQuery({
    queryKey: ['connector-status'],
    queryFn: () => api.getConnectorStatus(),
    refetchInterval: 10000,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEnv(label);
    setTimeout(() => setCopiedEnv(null), 2000);
  };

  const emailConfigured = status?.email?.configured;
  const smsConfigured = status?.sms?.configured;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div
          className="text-[10px] mb-2 tracking-[0.2em]"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#666666',
          }}
        >
          SYSTEM INTEGRATION
        </div>
        <h1
          className="text-4xl font-bold mb-2"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          CONNECTOR
          <span style={{ color: '#FF6B35' }}> CONFIGURATION</span>
        </h1>
        <p
          className="text-sm"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#999999',
          }}
        >
          Configure email and SMS integrations for autonomous agent communication
        </p>
      </div>

      {/* Configuration Status Banner */}
      {!isLoading && (!emailConfigured || !smsConfigured) && (
        <div
          className="p-4 relative overflow-hidden"
          style={{
            border: '2px solid #FF6B35',
            backgroundColor: 'rgba(255, 107, 53, 0.05)',
          }}
        >
          <div
            className="absolute top-0 left-0 bottom-0 w-1"
            style={{ backgroundColor: '#FF6B35' }}
          />
          <div className="flex items-start gap-3 pl-3">
            <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#FF6B35' }} />
            <div>
              <div
                className="text-sm font-bold mb-1"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#FF6B35',
                  letterSpacing: '0.02em',
                }}
              >
                CONNECTORS REQUIRE CONFIGURATION
              </div>
              <p
                className="text-xs"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#CCCCCC',
                  lineHeight: '1.6',
                }}
              >
                {!emailConfigured && !smsConfigured
                  ? 'Both email and SMS connectors need to be configured.'
                  : !emailConfigured
                  ? 'Email connector needs to be configured.'
                  : 'SMS connector needs to be configured.'}
                {' Follow the setup instructions below to enable agent communication.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div
          className="py-32 text-center"
          style={{
            border: '1px solid #333333',
            backgroundColor: '#0F0F0F',
          }}
        >
          <p
            className="text-sm tracking-[0.1em]"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#666666',
            }}
          >
            LOADING CONNECTOR STATUS...
          </p>
        </div>
      ) : (
        <>
          {/* Connector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Connector */}
            <div
              className="relative overflow-hidden"
              style={{
                border: `2px solid ${emailConfigured ? '#22C55E' : '#333333'}`,
                backgroundColor: '#0F0F0F',
              }}
            >
              {/* Status indicator bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  backgroundColor: emailConfigured ? '#22C55E' : '#333333',
                  boxShadow: emailConfigured ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3"
                      style={{
                        border: `2px solid ${emailConfigured ? '#22C55E' : '#333333'}`,
                        backgroundColor: emailConfigured
                          ? 'rgba(34, 197, 94, 0.1)'
                          : '#1A1A1A',
                      }}
                    >
                      <Mail
                        className="w-6 h-6"
                        style={{ color: emailConfigured ? '#22C55E' : '#666666' }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#FFFFFF',
                        }}
                      >
                        EMAIL
                      </h3>
                      <p
                        className="text-[10px] tracking-[0.15em]"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#666666',
                        }}
                      >
                        SENDGRID INTEGRATION
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.1em] font-bold"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      border: `1px solid ${emailConfigured ? '#22C55E' : '#666666'}`,
                      backgroundColor: emailConfigured
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(102, 102, 102, 0.1)',
                      color: emailConfigured ? '#22C55E' : '#666666',
                    }}
                  >
                    {emailConfigured ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        ACTIVE
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        INACTIVE
                      </>
                    )}
                  </div>
                </div>

                {emailConfigured && status?.email?.fromAddress && (
                  <div
                    className="mb-4 p-3"
                    style={{
                      border: '1px solid #333333',
                      backgroundColor: '#1A1A1A',
                    }}
                  >
                    <div
                      className="text-[10px] tracking-[0.15em] mb-1"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#666666',
                      }}
                    >
                      FROM ADDRESS
                    </div>
                    <div
                      className="text-sm font-bold"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#FFFFFF',
                      }}
                    >
                      {status.email.fromAddress}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setEmailExpanded(!emailExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                    color: '#FF6B35',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF6B35';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333333';
                    e.currentTarget.style.backgroundColor = '#1A1A1A';
                  }}
                >
                  <span>VIEW SETUP INSTRUCTIONS</span>
                  {emailExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* SMS Connector */}
            <div
              className="relative overflow-hidden"
              style={{
                border: `2px solid ${smsConfigured ? '#22C55E' : '#333333'}`,
                backgroundColor: '#0F0F0F',
              }}
            >
              {/* Status indicator bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  backgroundColor: smsConfigured ? '#22C55E' : '#333333',
                  boxShadow: smsConfigured ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none',
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3"
                      style={{
                        border: `2px solid ${smsConfigured ? '#22C55E' : '#333333'}`,
                        backgroundColor: smsConfigured
                          ? 'rgba(34, 197, 94, 0.1)'
                          : '#1A1A1A',
                      }}
                    >
                      <MessageSquare
                        className="w-6 h-6"
                        style={{ color: smsConfigured ? '#22C55E' : '#666666' }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#FFFFFF',
                        }}
                      >
                        SMS
                      </h3>
                      <p
                        className="text-[10px] tracking-[0.15em]"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#666666',
                        }}
                      >
                        TWILIO INTEGRATION
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.1em] font-bold"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      border: `1px solid ${smsConfigured ? '#22C55E' : '#666666'}`,
                      backgroundColor: smsConfigured
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(102, 102, 102, 0.1)',
                      color: smsConfigured ? '#22C55E' : '#666666',
                    }}
                  >
                    {smsConfigured ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        ACTIVE
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        INACTIVE
                      </>
                    )}
                  </div>
                </div>

                {smsConfigured && status?.sms?.phoneNumber && (
                  <div
                    className="mb-4 p-3"
                    style={{
                      border: '1px solid #333333',
                      backgroundColor: '#1A1A1A',
                    }}
                  >
                    <div
                      className="text-[10px] tracking-[0.15em] mb-1"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#666666',
                      }}
                    >
                      PHONE NUMBER
                    </div>
                    <div
                      className="text-sm font-bold"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#FFFFFF',
                      }}
                    >
                      {status.sms.phoneNumber}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSmsExpanded(!smsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    border: '1px solid #333333',
                    backgroundColor: '#1A1A1A',
                    color: '#FF6B35',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF6B35';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333333';
                    e.currentTarget.style.backgroundColor = '#1A1A1A';
                  }}
                >
                  <span>VIEW SETUP INSTRUCTIONS</span>
                  {smsExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Email Setup Instructions */}
          {emailExpanded && (
            <div
              className="relative overflow-hidden"
              style={{
                border: '1px solid #333333',
                backgroundColor: '#0F0F0F',
              }}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-xl font-bold"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#FFFFFF',
                    }}
                  >
                    📧 SENDGRID EMAIL SETUP
                  </h2>
                  <a
                    href="https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs px-3 py-2 transition-all duration-200"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      border: '1px solid #333333',
                      color: '#999999',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF6B35';
                      e.currentTarget.style.color = '#FF6B35';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333333';
                      e.currentTarget.style.color = '#999999';
                    }}
                  >
                    FULL GUIDE
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {[
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
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="flex gap-4 p-4"
                      style={{
                        border: '1px solid #333333',
                        backgroundColor: '#1A1A1A',
                      }}
                    >
                      <div
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#FF6B35',
                          opacity: 0.3,
                        }}
                      >
                        {step.num}
                      </div>
                      <div>
                        <div
                          className="text-sm font-bold mb-1"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#FFFFFF',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {step.title}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#999999',
                          }}
                        >
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Environment Variables */}
                <div>
                  <div
                    className="text-xs mb-3 tracking-[0.15em]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#999999',
                    }}
                  >
                    RAILWAY ENVIRONMENT VARIABLES
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'SENDGRID_API_KEY', value: 'SG.xxxxxxxxxxxxxxxxxxxxx' },
                      { key: 'SENDGRID_FROM_EMAIL', value: 'agent@yourdomain.com' },
                    ].map((env) => (
                      <div
                        key={env.key}
                        className="group relative flex items-center justify-between p-3"
                        style={{
                          border: '1px solid #333333',
                          backgroundColor: '#0A0A0A',
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        <div className="flex-1">
                          <span style={{ color: '#22C55E' }}>{env.key}</span>
                          <span style={{ color: '#666666' }}>=</span>
                          <span style={{ color: '#FFFFFF' }}>{env.value}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${env.key}=${env.value}`, env.key)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
                          style={{
                            border: '1px solid #333333',
                            backgroundColor: '#1A1A1A',
                          }}
                        >
                          <Copy className="w-3 h-3" style={{ color: '#FF6B35' }} />
                        </button>
                        {copiedEnv === env.key && (
                          <div
                            className="absolute -top-8 right-0 px-2 py-1 text-[10px]"
                            style={{
                              backgroundColor: '#22C55E',
                              color: '#0A0A0A',
                              fontFamily: "'IBM Plex Mono', monospace",
                            }}
                          >
                            COPIED
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Webhook URL */}
                <div>
                  <div
                    className="text-xs mb-3 tracking-[0.15em]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#999999',
                    }}
                  >
                    INBOUND PARSE WEBHOOK URL
                  </div>
                  <div
                    className="group relative flex items-center justify-between p-3"
                    style={{
                      border: '2px solid #FF6B35',
                      backgroundColor: 'rgba(255, 107, 53, 0.05)',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    <div className="flex-1 text-sm" style={{ color: '#FFFFFF' }}>
                      https://backend-api-production-8b0b.up.railway.app/api/webhooks/email
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'https://backend-api-production-8b0b.up.railway.app/api/webhooks/email',
                          'webhook'
                        )
                      }
                      className="p-2"
                      style={{
                        border: '1px solid #FF6B35',
                        backgroundColor: '#0A0A0A',
                      }}
                    >
                      <Copy className="w-3 h-3" style={{ color: '#FF6B35' }} />
                    </button>
                    {copiedEnv === 'webhook' && (
                      <div
                        className="absolute -top-8 right-0 px-2 py-1 text-[10px]"
                        style={{
                          backgroundColor: '#22C55E',
                          color: '#0A0A0A',
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        COPIED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SMS Setup Instructions */}
          {smsExpanded && (
            <div
              className="relative overflow-hidden"
              style={{
                border: '1px solid #333333',
                backgroundColor: '#0F0F0F',
              }}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-xl font-bold"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#FFFFFF',
                    }}
                  >
                    📱 TWILIO SMS SETUP
                  </h2>
                  <a
                    href="https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs px-3 py-2 transition-all duration-200"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      border: '1px solid #333333',
                      color: '#999999',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF6B35';
                      e.currentTarget.style.color = '#FF6B35';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333333';
                      e.currentTarget.style.color = '#999999';
                    }}
                  >
                    FULL GUIDE
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {[
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
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="flex gap-4 p-4"
                      style={{
                        border: '1px solid #333333',
                        backgroundColor: '#1A1A1A',
                      }}
                    >
                      <div
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#FF6B35',
                          opacity: 0.3,
                        }}
                      >
                        {step.num}
                      </div>
                      <div>
                        <div
                          className="text-sm font-bold mb-1"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#FFFFFF',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {step.title}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#999999',
                          }}
                        >
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Environment Variables */}
                <div>
                  <div
                    className="text-xs mb-3 tracking-[0.15em]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#999999',
                    }}
                  >
                    RAILWAY ENVIRONMENT VARIABLES
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'TWILIO_ACCOUNT_SID', value: 'ACxxxxxxxxxxxxxxxxxxxx' },
                      { key: 'TWILIO_AUTH_TOKEN', value: 'xxxxxxxxxxxxxxxxxxxxxxx' },
                      { key: 'TWILIO_PHONE_NUMBER', value: '+1234567890' },
                    ].map((env) => (
                      <div
                        key={env.key}
                        className="group relative flex items-center justify-between p-3"
                        style={{
                          border: '1px solid #333333',
                          backgroundColor: '#0A0A0A',
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        <div className="flex-1">
                          <span style={{ color: '#22C55E' }}>{env.key}</span>
                          <span style={{ color: '#666666' }}>=</span>
                          <span style={{ color: '#FFFFFF' }}>{env.value}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${env.key}=${env.value}`, env.key)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
                          style={{
                            border: '1px solid #333333',
                            backgroundColor: '#1A1A1A',
                          }}
                        >
                          <Copy className="w-3 h-3" style={{ color: '#FF6B35' }} />
                        </button>
                        {copiedEnv === env.key && (
                          <div
                            className="absolute -top-8 right-0 px-2 py-1 text-[10px]"
                            style={{
                              backgroundColor: '#22C55E',
                              color: '#0A0A0A',
                              fontFamily: "'IBM Plex Mono', monospace",
                            }}
                          >
                            COPIED
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Webhook URL */}
                <div>
                  <div
                    className="text-xs mb-3 tracking-[0.15em]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#999999',
                    }}
                  >
                    MESSAGING WEBHOOK URL
                  </div>
                  <div
                    className="group relative flex items-center justify-between p-3"
                    style={{
                      border: '2px solid #FF6B35',
                      backgroundColor: 'rgba(255, 107, 53, 0.05)',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    <div className="flex-1 text-sm" style={{ color: '#FFFFFF' }}>
                      https://backend-api-production-8b0b.up.railway.app/api/webhooks/sms
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'https://backend-api-production-8b0b.up.railway.app/api/webhooks/sms',
                          'sms-webhook'
                        )
                      }
                      className="p-2"
                      style={{
                        border: '1px solid #FF6B35',
                        backgroundColor: '#0A0A0A',
                      }}
                    >
                      <Copy className="w-3 h-3" style={{ color: '#FF6B35' }} />
                    </button>
                    {copiedEnv === 'sms-webhook' && (
                      <div
                        className="absolute -top-8 right-0 px-2 py-1 text-[10px]"
                        style={{
                          backgroundColor: '#22C55E',
                          color: '#0A0A0A',
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        COPIED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
