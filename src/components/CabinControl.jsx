import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { AppIcon } from './UiIcons';

const SIMULATIONS = [
  { mode: 'FireSimulation', label: 'Fuego', icon: 'fire' },
  { mode: 'EarthquakeSimulation', label: 'Sismo', icon: 'wave' },
  { mode: 'ArmedGroupsSimulation', label: 'Grupos armados', icon: 'cabin' },
  { mode: 'ExplorationSimulation', label: 'Exploración', icon: 'led' },
];

export function CabinControl({ isMinimized = false }) {
  const [state, setState] = useState({ simulation: 'idle', difficulty: null, movement: 'idle', event: null, actuators: {} });
  const [health, setHealth] = useState({ cabina: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchState = useCallback(async () => {
    try {
      const [data, healthData] = await Promise.all([
        api.server.getState(),
        api.server.getHealth(),
      ]);
      setState(prev => ({ ...prev, ...data }));
      setHealth(healthData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con ember-server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const handleStop = async () => {
    try {
      await api.server.stopSimulation();
      await fetchState();
    } catch (err) {
      console.error(err);
      setError('No se pudo detener la simulación');
    }
  };

  const cabinaConnected = Boolean(health.cabina);
  const simulationActive = state.simulation && state.simulation !== 'idle';
  const currentSimulation = SIMULATIONS.find(s => s.mode === state.simulation);

  if (loading && isMinimized) return <div className="card widget-card loading">Cargando...</div>;

  // Modo minimizado
  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="cabin" className="widget-title-icon" /> Cabina</h3>
          <span className={`badge ${cabinaConnected ? 'connected' : 'disconnected'}`}>
            {cabinaConnected ? 'Cabina conectada' : 'Cabina offline'}
          </span>
        </div>
        <div className="widget-body">
          <div className="widget-stat">
            <span className="stat-label">Simulación</span>
            <span className="stat-value">{currentSimulation?.label || 'IDLE'}</span>
          </div>
          <div className="widget-stat">
            <span className="stat-label">Movimiento</span>
            <span className="stat-value">{state.movement || 'idle'}</span>
          </div>
        </div>
      </div>
    );
  }

  // Modo detalle
  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className={`connection-bar ${cabinaConnected ? 'is-connected' : ''}`}>
        <span className={`status-dot ${cabinaConnected ? 'connected' : 'disconnected'}`}></span>
        <span>{cabinaConnected ? 'Cabina ESP32 conectada' : 'Cabina ESP32 desconectada'}</span>
      </div>
      {error && <p className="error-text">{error}</p>}
      
      <div className="section">
        <h3>Estado de simulación</h3>
        <div className="simulation-readout">
          <div className={`sim-readout-card ${simulationActive ? 'active' : ''}`}>
            <AppIcon name={currentSimulation?.icon || 'cabin'} className="sim-readout-icon" size={24} />
            <div>
              <span className="stat-label">Modo</span>
              <strong>{currentSimulation?.label || 'IDLE'}</strong>
            </div>
          </div>
          <div className="sim-readout-card">
            <div>
              <span className="stat-label">Dificultad</span>
              <strong>{state.difficulty || 'N/A'}</strong>
            </div>
          </div>
          <div className="sim-readout-card">
            <div>
              <span className="stat-label">Movimiento</span>
              <strong>{state.movement || 'idle'}</strong>
            </div>
          </div>
        </div>
        <p className="status-text">Evento: {state.event || 'sin evento reciente'}</p>
      </div>

      <div className="section">
        <h3>Seguridad</h3>
        <button
          className="btn btn-danger"
          onClick={handleStop}
          disabled={!simulationActive}
        >
          <AppIcon name="stop" className="btn-icon" size={15} /> Parada de emergencia
        </button>
        <p className="status-text">El dashboard web solo puede detener una simulación activa. El inicio y los comandos de simulación viven en el servidor/Roblox.</p>
      </div>
    </div>
  );
}
