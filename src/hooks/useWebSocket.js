import { useCallback, useState } from 'react';

// El WebSocket del servidor EMBER esta reservado para la cabina ESP32.
// El dashboard web debe usar REST polling con /state y /health para no
// reemplazar accidentalmente la conexion fisica de la cabina.
export function useWebSocket() {
  const [error] = useState('WebSocket reservado para cabina ESP32');

  const noop = useCallback(() => {
    console.warn('EMBER dashboard: usa REST; el WebSocket esta reservado para la cabina.');
  }, []);

  return {
    socket: null,
    connected: false,
    lastMessage: null,
    error,
    send: noop,
    connect: noop,
    disconnect: noop,
  };
}
