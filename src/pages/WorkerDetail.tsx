import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Terminal, Activity, ArrowLeft, Box } from 'lucide-react';

interface WorkerDetailMessage {
  timestamp: string;
  workerId: string;
  sandboxId: string;
  messageType: 'init' | 'user' | 'assistant' | 'tool_use' | 'tool_result' | 'result';
  content: any;
}

export default function WorkerDetail() {
  const navigate = useNavigate();
  const { workerId } = useParams<{ workerId: string }>();
  const [messages, setMessages] = useState<WorkerDetailMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Load initial history
  const { data: initialData } = useQuery({
    queryKey: ['worker-details', workerId],
    queryFn: () => api.getWorkerDetails(workerId!, 500),
    enabled: !!workerId,
  });

  // Setup WebSocket connection
  useEffect(() => {
    if (!workerId) return;

    if (initialData?.messages) {
      setMessages(initialData.messages.map(m => ({ ...m, timestamp: m.timestamp.toString() })));
    }

    const ws = api.connectToWorkerStream(workerId);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`📡 Worker ${workerId} WebSocket connected`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'history') {
          // Initial history from server
          setMessages(data.messages.map((m: any) => ({ ...m, timestamp: m.timestamp.toString() })));
        } else if (data.type === 'message') {
          // New real-time message
          setMessages((prev) => [...prev, { ...data.data, timestamp: data.data.timestamp.toString() }]);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log(`📡 Worker ${workerId} WebSocket disconnected`);
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
  }, [initialData, workerId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMessageColor = (messageType: string): string => {
    switch (messageType) {
      case 'init':
        return '#9333EA'; // Purple
      case 'user':
        return '#3B82F6'; // Blue
      case 'assistant':
        return '#22C55E'; // Green
      case 'tool_use':
        return '#F59E0B'; // Amber
      case 'tool_result':
        return '#06B6D4'; // Cyan
      case 'result':
        return '#FF6B35'; // Orange
      default:
        return '#666666';
    }
  };

  const getMessageTypeLabel = (messageType: string): string => {
    switch (messageType) {
      case 'init':
        return 'INIT';
      case 'user':
        return 'USER';
      case 'assistant':
        return 'ASSISTANT';
      case 'tool_use':
        return 'TOOL USE';
      case 'tool_result':
        return 'TOOL RESULT';
      case 'result':
        return 'RESULT';
      default:
        return messageType.toUpperCase();
    }
  };

  const formatContent = (message: WorkerDetailMessage): string => {
    try {
      // If content is already a string, return it
      if (typeof message.content === 'string') {
        return message.content;
      }

      // For structured content, format it nicely
      if (message.messageType === 'tool_use') {
        return JSON.stringify(message.content, null, 2);
      }

      if (message.messageType === 'tool_result') {
        return JSON.stringify(message.content, null, 2);
      }

      // For other types, just stringify
      return JSON.stringify(message.content, null, 2);
    } catch {
      return String(message.content);
    }
  };

  const truncateId = (id: string): string => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 6)}...${id.slice(-6)}`;
  };

  if (!workerId) {
    return (
      <div className="text-center py-12" style={{ color: '#666666' }}>
        <p>Worker ID not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div
              className="text-[10px] mb-2 tracking-[0.2em] flex items-center gap-3"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
              }}
            >
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                style={{ color: '#FF6B35' }}
              >
                <ArrowLeft size={12} />
                <span>BACK TO MISSION CONTROL</span>
              </button>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#FFFFFF',
                textShadow: '2px 2px 0 rgba(255, 107, 53, 0.3)',
              }}
            >
              WORKER DETAIL
            </h1>
            <div className="flex items-center gap-3 mb-3">
              <Box size={16} style={{ color: '#666666' }} />
              <span
                className="text-sm"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#999999',
                }}
                title={workerId}
              >
                {truncateId(workerId)}
              </span>
            </div>
            <p
              className="text-base md:text-lg max-w-2xl leading-relaxed"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#999999',
              }}
            >
              Full CLI stream for this worker
            </p>
          </div>

          {/* Connection Status */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{
              backgroundColor: '#0F0F0F',
              border: `1px solid ${isConnected ? '#22C55E' : '#666666'}`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: isConnected ? '#22C55E' : '#666666',
                boxShadow: isConnected ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none',
              }}
            />
            <span
              className="text-xs tracking-wider"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: isConnected ? '#22C55E' : '#666666',
              }}
            >
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Glitchy underline */}
        <div
          className="h-[2px] mt-6"
          style={{
            background: 'linear-gradient(90deg, #FF6B35 0%, transparent 50%, #FF6B35 100%)',
            opacity: 0.3,
          }}
        />
      </div>

      {/* Terminal Feed */}
      <div
        className="relative"
        style={{
          backgroundColor: '#0A0A0A',
          border: '2px solid #1A1A1A',
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Terminal Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b-2"
          style={{
            borderColor: '#1A1A1A',
            backgroundColor: '#0F0F0F',
          }}
        >
          <Terminal size={16} style={{ color: '#FF6B35' }} />
          <span
            className="text-xs tracking-widest"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#999999',
            }}
          >
            WORKER CLI OUTPUT
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="text-xs"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#666666',
              }}
            >
              {messages.length} MESSAGES
            </span>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="p-4 space-y-2 overflow-y-auto"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            maxHeight: 'calc(100vh - 300px)',
            minHeight: '400px',
          }}
        >
          {messages.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ color: '#666666' }}
            >
              <Activity size={48} className="mx-auto mb-4" style={{ opacity: 0.3 }} />
              <p className="text-sm">Waiting for worker output...</p>
              <p className="text-xs mt-2" style={{ color: '#444444' }}>
                This worker may have completed or been killed
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-2 px-3 hover:bg-opacity-50 transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderLeft: `2px solid ${getMessageColor(message.messageType)}`,
                }}
              >
                {/* Timestamp */}
                <span
                  className="text-[10px] tracking-wider flex-shrink-0 pt-1"
                  style={{ color: '#666666', width: '80px' }}
                >
                  {formatTimestamp(message.timestamp)}
                </span>

                {/* Message Type Badge */}
                <div
                  className="flex items-center gap-2 px-2 py-1 flex-shrink-0"
                  style={{
                    backgroundColor: '#0F0F0F',
                    border: `1px solid ${getMessageColor(message.messageType)}`,
                    minWidth: '120px',
                  }}
                >
                  <Activity size={10} style={{ color: getMessageColor(message.messageType) }} />
                  <span
                    className="text-[10px] tracking-wider uppercase"
                    style={{ color: getMessageColor(message.messageType) }}
                  >
                    {getMessageTypeLabel(message.messageType)}
                  </span>
                </div>

                {/* Content */}
                <pre
                  className="flex-1 text-xs whitespace-pre-wrap break-words leading-relaxed"
                  style={{ color: '#CCCCCC' }}
                >
                  {formatContent(message)}
                </pre>
              </div>
            ))
          )}
        </div>

        {/* Scan line effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(255, 107, 53, 0.02) 50%)',
            backgroundSize: '100% 4px',
            animation: 'scan 8s linear infinite',
          }}
        />
      </div>

      {/* Stats Footer */}
      <div
        className="grid grid-cols-3 gap-4"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        <div
          className="p-4"
          style={{
            backgroundColor: '#0F0F0F',
            border: '1px solid #1A1A1A',
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: '#F59E0B' }}>
            {messages.filter((m) => m.messageType === 'tool_use').length}
          </div>
          <div className="text-xs tracking-wider" style={{ color: '#666666' }}>
            TOOL CALLS
          </div>
        </div>

        <div
          className="p-4"
          style={{
            backgroundColor: '#0F0F0F',
            border: '1px solid #1A1A1A',
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: '#22C55E' }}>
            {messages.filter((m) => m.messageType === 'assistant').length}
          </div>
          <div className="text-xs tracking-wider" style={{ color: '#666666' }}>
            ASSISTANT MESSAGES
          </div>
        </div>

        <div
          className="p-4"
          style={{
            backgroundColor: '#0F0F0F',
            border: '1px solid #1A1A1A',
          }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: '#FF6B35' }}>
            {messages.filter((m) => m.messageType === 'result').length}
          </div>
          <div className="text-xs tracking-wider" style={{ color: '#666666' }}>
            RESULTS
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
