import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Save,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function Connectors() {
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [smsExpanded, setSmsExpanded] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState<string | null>(null);
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
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [smsMessage, setSmsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    onError: (error: any) => {
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
    onError: (error: any) => {
      setSmsMessage({ type: 'error', text: error.message });
      setTimeout(() => setSmsMessage(null), 5000);
    },
  });

  const deleteConnectorMutation = useMutation({
    mutationFn: (type: 'email' | 'sms') => api.deleteConnectorConfig(type),
    onSuccess: (data, type) => {
      if (type === 'email') {
        setEmailMessage({ type: 'success', text: data.message });
        setTimeout(() => setEmailMessage(null), 5000);
      } else {
        setSmsMessage({ type: 'success', text: data.message });
        setTimeout(() => setSmsMessage(null), 5000);
      }
      queryClient.invalidateQueries({ queryKey: ['connector-status'] });
      queryClient.invalidateQueries({ queryKey: ['connector-configs'] });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEnv(label);
    setTimeout(() => setCopiedEnv(null), 2000);
  };

  const emailConfigured = status?.email?.configured || configs?.email?.enabled;
  const smsConfigured = status?.sms?.configured || configs?.sms?.enabled;

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
                {' Enter your credentials below.'}
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
          {/* Email Connector */}
          <div
            className="relative overflow-hidden"
            style={{
              border: `2px solid ${emailConfigured ? '#22C55E' : '#333333'}`,
              backgroundColor: '#0F0F0F',
            }}
          >
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
                      backgroundColor: emailConfigured ? 'rgba(34, 197, 94, 0.1)' : '#1A1A1A',
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

              {/* Configuration Form */}
              <div className="space-y-4">
                {emailMessage && (
                  <div
                    className="p-3"
                    style={{
                      border: `1px solid ${emailMessage.type === 'success' ? '#22C55E' : '#EF4444'}`,
                      backgroundColor: emailMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: emailMessage.type === 'success' ? '#22C55E' : '#EF4444',
                      }}
                    >
                      {emailMessage.text}
                    </p>
                  </div>
                )}

                {configs?.email && (
                  <div
                    className="p-4"
                    style={{
                      border: '1px solid #333333',
                      backgroundColor: '#1A1A1A',
                    }}
                  >
                    <div className="space-y-3">
                      <div>
                        <div
                          className="text-[10px] tracking-[0.15em] mb-1"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#666666',
                          }}
                        >
                          API KEY (ENCRYPTED)
                        </div>
                        <div
                          className="text-sm font-mono"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#FFFFFF',
                          }}
                        >
                          {configs.email.settings?.apiKey || '••••••••'}
                        </div>
                      </div>
                      <div>
                        <div
                          className="text-[10px] tracking-[0.15em] mb-1"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#666666',
                          }}
                        >
                          FROM EMAIL
                        </div>
                        <div
                          className="text-sm font-mono"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#FFFFFF',
                          }}
                        >
                          {configs.email.settings?.fromEmail || 'Not set'}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteConnectorMutation.mutate('email')}
                        disabled={deleteConnectorMutation.isPending}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold transition-all"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          border: '1px solid #EF4444',
                          color: '#EF4444',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                        DELETE CONFIG
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div
                    className="text-xs mb-2 tracking-[0.1em]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#999999',
                    }}
                  >
                    {configs?.email ? 'UPDATE' : 'CONFIGURE'} SENDGRID CREDENTIALS
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] mb-2"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#666666',
                        }}
                      >
                        SENDGRID API KEY
                      </label>
                      <div className="relative">
                        <input
                          type={showEmailKey ? 'text' : 'password'}
                          value={emailApiKey}
                          onChange={(e) => setEmailApiKey(e.target.value)}
                          placeholder="SG.xxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-4 py-3 pr-12 text-sm focus:outline-none transition-all"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            border: '1px solid #333333',
                            backgroundColor: '#1A1A1A',
                            color: '#FFFFFF',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#FF6B35';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#333333';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowEmailKey(!showEmailKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: '#666666' }}
                        >
                          {showEmailKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] mb-2"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#666666',
                        }}
                      >
                        FROM EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={emailFrom}
                        onChange={(e) => setEmailFrom(e.target.value)}
                        placeholder="agent@yourdomain.com"
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-all"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          border: '1px solid #333333',
                          backgroundColor: '#1A1A1A',
                          color: '#FFFFFF',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FF6B35';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#333333';
                        }}
                      />
                    </div>

                    <button
                      onClick={() => saveEmailMutation.mutate()}
                      disabled={!emailApiKey || !emailFrom || saveEmailMutation.isPending}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        backgroundColor: '#FF6B35',
                        color: '#0A0A0A',
                        border: '2px solid #FF6B35',
                      }}
                      onMouseEnter={(e) => {
                        if (!saveEmailMutation.isPending && emailApiKey && emailFrom) {
                          e.currentTarget.style.backgroundColor = '#0A0A0A';
                          e.currentTarget.style.color = '#FF6B35';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FF6B35';
                        e.currentTarget.style.color = '#0A0A0A';
                      }}
                    >
                      <Save className="w-4 h-4" />
                      {saveEmailMutation.isPending ? 'SAVING...' : 'SAVE CONFIGURATION'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEmailExpanded(!emailExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200 mt-4"
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
                <span>SETUP INSTRUCTIONS</span>
                {emailExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SMS Connector - Similar structure */}
          <div
            className="relative overflow-hidden"
            style={{
              border: `2px solid ${smsConfigured ? '#22C55E' : '#333333'}`,
              backgroundColor: '#0F0F0F',
            }}
          >
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
                      backgroundColor: smsConfigured ? 'rgba(34, 197, 94, 0.1)' : '#1A1A1A',
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

              {/* Configuration Form */}
              <div className="space-y-4">
                {smsMessage && (
                  <div
                    className="p-3"
                    style={{
                      border: `1px solid ${smsMessage.type === 'success' ? '#22C55E' : '#EF4444'}`,
                      backgroundColor: smsMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: smsMessage.type === 'success' ? '#22C55E' : '#EF4444',
                      }}
                    >
                      {smsMessage.text}
                    </p>
                  </div>
                )}

                {configs?.sms && (
                  <div
                    className="p-4"
                    style={{
                      border: '1px solid #333333',
                      backgroundColor: '#1A1A1A',
                    }}
                  >
                    <div className="space-y-3">
                      <div>
                        <div
                          className="text-[10px] tracking-[0.15em] mb-1"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#666666',
                          }}
                        >
                          ACCOUNT SID (ENCRYPTED)
                        </div>
                        <div
                          className="text-sm font-mono"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#FFFFFF',
                          }}
                        >
                          {configs.sms.settings?.accountSid || '••••••••'}
                        </div>
                      </div>
                      <div>
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
                          className="text-sm font-mono"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: '#FFFFFF',
                          }}
                        >
                          {configs.sms.settings?.phoneNumber || 'Not set'}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteConnectorMutation.mutate('sms')}
                        disabled={deleteConnectorMutation.isPending}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold transition-all"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          border: '1px solid #EF4444',
                          color: '#EF4444',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                        DELETE CONFIG
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div
                    className="text-xs mb-2 tracking-[0.1em]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: '#999999',
                    }}
                  >
                    {configs?.sms ? 'UPDATE' : 'CONFIGURE'} TWILIO CREDENTIALS
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] mb-2"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#666666',
                        }}
                      >
                        ACCOUNT SID
                      </label>
                      <input
                        type="text"
                        value={smsAccountSid}
                        onChange={(e) => setSmsAccountSid(e.target.value)}
                        placeholder="ACxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-all"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          border: '1px solid #333333',
                          backgroundColor: '#1A1A1A',
                          color: '#FFFFFF',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FF6B35';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#333333';
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] mb-2"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#666666',
                        }}
                      >
                        AUTH TOKEN
                      </label>
                      <div className="relative">
                        <input
                          type={showSmsToken ? 'text' : 'password'}
                          value={smsAuthToken}
                          onChange={(e) => setSmsAuthToken(e.target.value)}
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-4 py-3 pr-12 text-sm focus:outline-none transition-all"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            border: '1px solid #333333',
                            backgroundColor: '#1A1A1A',
                            color: '#FFFFFF',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#FF6B35';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#333333';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmsToken(!showSmsToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: '#666666' }}
                        >
                          {showSmsToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] mb-2"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: '#666666',
                        }}
                      >
                        PHONE NUMBER (E.164)
                      </label>
                      <input
                        type="tel"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-all"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          border: '1px solid #333333',
                          backgroundColor: '#1A1A1A',
                          color: '#FFFFFF',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FF6B35';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#333333';
                        }}
                      />
                    </div>

                    <button
                      onClick={() => saveSmsMutation.mutate()}
                      disabled={!smsAccountSid || !smsAuthToken || !smsPhone || saveSmsMutation.isPending}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        backgroundColor: '#FF6B35',
                        color: '#0A0A0A',
                        border: '2px solid #FF6B35',
                      }}
                      onMouseEnter={(e) => {
                        if (!saveSmsMutation.isPending && smsAccountSid && smsAuthToken && smsPhone) {
                          e.currentTarget.style.backgroundColor = '#0A0A0A';
                          e.currentTarget.style.color = '#FF6B35';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FF6B35';
                        e.currentTarget.style.color = '#0A0A0A';
                      }}
                    >
                      <Save className="w-4 h-4" />
                      {saveSmsMutation.isPending ? 'SAVING...' : 'SAVE CONFIGURATION'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSmsExpanded(!smsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all duration-200 mt-4"
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
                <span>SETUP INSTRUCTIONS</span>
                {smsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expandable Instructions (collapsed by default) */}
          {emailExpanded && (
            <div
              className="p-6"
              style={{
                border: '1px solid #333333',
                backgroundColor: '#0F0F0F',
              }}
            >
              <p
                className="text-xs mb-4"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#999999',
                }}
              >
                To get your SendGrid API key, visit{' '}
                <a
                  href="https://app.sendgrid.com/settings/api_keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: '#FF6B35' }}
                >
                  SendGrid Dashboard
                </a>
                . Create an API key with "Full Access" permissions.
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#999999',
                }}
              >
                For detailed setup instructions including webhook configuration, see the{' '}
                <a
                  href="https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: '#FF6B35' }}
                >
                  full guide
                </a>
                .
              </p>
            </div>
          )}

          {smsExpanded && (
            <div
              className="p-6"
              style={{
                border: '1px solid #333333',
                backgroundColor: '#0F0F0F',
              }}
            >
              <p
                className="text-xs mb-4"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#999999',
                }}
              >
                To get your Twilio credentials, visit{' '}
                <a
                  href="https://console.twilio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: '#FF6B35' }}
                >
                  Twilio Console
                </a>
                . Your Account SID and Auth Token are on the dashboard.
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#999999',
                }}
              >
                For detailed setup instructions including webhook configuration, see the{' '}
                <a
                  href="https://github.com/NoahByrnes/claude-agent-studio-backend/blob/main/CONNECTOR_SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: '#FF6B35' }}
                >
                  full guide
                </a>
                .
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
