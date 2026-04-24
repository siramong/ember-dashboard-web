import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { api } from '../services/api';

export function CabinControl() {
  const { connected, lastMessage } = useWebSocket();
  const [state, setState] = useState({ simulation: 'stopped', movement: 'idle', event: null });
  const [loading, setLoading] = useState(true);

  const fetchState = useCallback(async () => {
    try {
      const data = await api.server.getState();
      setState(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  useEffect(() => {
    if (lastMessage?.type === 'event') {
      setState(prev => ({ ...prev, event: lastMessage.event }));
    }
  }, [lastMessage]);

  const handleSimulation = async (mode) => {
    try {
      if (state.simulation === 'stopped') {
        await api.server.startSimulation(mode);
      } else {
        await api.server.stopSimulation();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleActuator = async (action) => {
    try {
      await api.server.controlActuator(action);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="card loading">Cargando...</div>;

  return (
    <div className="card">
      <h2>Control de Cabina</h2>
      <div className="connection-status">
        <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
        <span>{connected ? 'Conectado' : 'Desconectado'}</span>
      </div>
      
      <div className="section">
        <h3>Simulación</h3>
        <div className="button-group">
          <button 
            className={`btn ${state.simulation !== 'stopped' ? 'active' : ''}`}
            onClick={() => handleSimulation('earthquake')}
          >
            🌊 Sismo
          </button>
          <button 
            className={`btn ${state.simulation !== 'stopped' ? 'active' : ''}`}
            onClick={() => handleSimulation('fire')}
          >
            🔥 Fuego
          </button>
          <button 
            className="btn stop"
            onClick={handleSimulation}
            disabled={state.simulation === 'stopped'}
          >
            ⏹ Detener
          </button>
        </div>
        <p className="status-text">Estado: {state.event || state.simulation}</p>
      </div>

      <div className="section">
        <h3>Actuadores</h3>
        <div className="button-group actuators">
          <button onClick={() => handleActuator('motor_on')}>Motor ON</button>
          <button onClick={() => handleActuator('motor_off')}>Motor OFF</button>
          <button onClick={() => handleActuator('heater_on')}>Calentador ON</button>
          <button onClick={() => handleActuator('heater_off')}>Calentador OFF</button>
        </div>
      </div>

      <div className="section">
        <h3>LEDs</h3>
        <div className="button-group leds">
          <button onClick={() => handleActuator('led_red')}>🔴 Rojo</button>
          <button onClick={() => handleActuator('led_green')}>🟢 Verde</button>
          <button onClick={() => handleActuator('led_blue')}>🔵 Azul</button>
          <button onClick={() => handleActuator('led_earthquake')}>🌊 Sismo</button>
          <button onClick={() => handleActuator('led_off')}>⚫ Apagar</button>
        </div>
      </div>
    </div>
  );
}