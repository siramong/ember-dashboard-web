import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_URL } from '../services/api';

export function useWebSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const reconnectTimeout = useRef(null);
  const wsRef = useRef(null);
  const connectRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        ws.send(JSON.stringify({ type: 'register', role: 'dashboard' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch {
          setLastMessage(event.data);
        }
      };

      ws.onerror = () => {
        setError('WebSocket error');
      };

      ws.onclose = () => {
        setConnected(false);
        setSocket(null);
        reconnectTimeout.current = setTimeout(() => {
          if (wsRef.current?.readyState !== WebSocket.OPEN && connectRef.current) {
            connectRef.current();
          }
        }, 5000);
      };

      setSocket(ws);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  connectRef.current = connect;

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimeout.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { socket, connected, lastMessage, error, send, connect, disconnect };
}