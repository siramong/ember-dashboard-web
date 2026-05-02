import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { api } from '../services/api';
import { AppIcon } from './UiIcons';

export function CabinControl({ isMinimized = false }) {
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

  if (loading && isMinimized) return <div className="card widget-card loading">Cargando...</div>;

  // Modo minimizado
  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="cabin" className="widget-title-icon" /> Cabina</h3>
          <span className={`badge ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
        <div className="widget-body">
          <div className="widget-stat">
            <span className="stat-label">Estado</span>
            <span className="stat-value">{state.event || state.simulation}</span>
          </div>
          <div className="quick-actions">
            <button className="btn-mini" onClick={() => handleSimulation('earthquake')}><AppIcon name="wave" className="btn-icon" size={14} /> Sismo</button>
            <button className="btn-mini" onClick={() => handleSimulation('fire')}><AppIcon name="fire" className="btn-icon" size={14} /> Fuego</button>
          </div>
        </div>
      </div>
    );
  }

  // Modo detalle
  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
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
            <AppIcon name="wave" className="btn-icon" size={15} /> Sismo
          </button>
          <button 
            className={`btn ${state.simulation !== 'stopped' ? 'active' : ''}`}
            onClick={() => handleSimulation('fire')}
          >
            <AppIcon name="fire" className="btn-icon" size={15} /> Fuego
          </button>
          <button 
            className="btn stop"
            onClick={handleSimulation}
            disabled={state.simulation === 'stopped'}
          >
            <AppIcon name="stop" className="btn-icon" size={15} /> Detener
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
          <button onClick={() => handleActuator('led_red')}><AppIcon name="led" className="btn-icon led-red" size={15} /> Rojo</button>
          <button onClick={() => handleActuator('led_green')}><AppIcon name="led" className="btn-icon led-green" size={15} /> Verde</button>
          <button onClick={() => handleActuator('led_blue')}><AppIcon name="led" className="btn-icon led-blue" size={15} /> Azul</button>
          <button onClick={() => handleActuator('led_earthquake')}><AppIcon name="wave" className="btn-icon" size={15} /> Sismo</button>
          <button onClick={() => handleActuator('led_off')}><AppIcon name="power" className="btn-icon" size={15} /> Apagar</button>
        </div>
      </div>
    </div>
  );
}