import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppIcon } from './UiIcons';

const DEFAULT_STATE = {
  simulation: 'idle',
  difficulty: null,
  actuators: {
    motor: false,
    heater: false,
    ledTower: false,
    buzzer: false,
    ledStrips: false,
  },
};

export function ActuatorStatus({ isMinimized = false }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const data = await api.server.getState();
        setState(prev => ({
          ...prev,
          ...data,
          actuators: {
            ...DEFAULT_STATE.actuators,
            ...prev.actuators,
            ...(data.actuators || {}),
          },
        }));
        setError(false);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading && isMinimized) return <div className="card widget-card loading">Cargando...</div>;

  const values = state.actuators || DEFAULT_STATE.actuators;
  const actuators = [
    { key: 'motor', label: 'Motor', active: values.motor, icon: 'actuator' },
    { key: 'heater', label: 'Calefactor', active: values.heater, icon: 'fire' },
    { key: 'ledTower', label: 'Torre LED', active: values.ledTower, icon: 'led' },
    { key: 'buzzer', label: 'Buzzer', active: values.buzzer, icon: 'service' },
    { key: 'ledStrips', label: 'Tira LED', active: values.ledStrips, icon: 'led' },
  ];

  const activeCount = actuators.filter(a => a.active).length;

  // Modo minimizado
  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="actuator" className="widget-title-icon" /> Actuadores</h3>
          <span className="badge">{activeCount}/{actuators.length} activos</span>
        </div>
        <div className="widget-body">
          <div className="actuator-grid-mini">
            {actuators.map(act => (
              <div key={act.key} className={`actuator-mini ${act.active ? 'active' : 'inactive'}`}>
                <span className="actuator-dot"></span>
                <span>{act.label}</span>
              </div>
            ))}
          </div>
          {error && <p className="widget-note">Mostrando último estado conocido</p>}
        </div>
      </div>
    );
  }

  // Modo detalle
  if (loading) return <div className="loading">Cargando estado...</div>;

  return (
    <div>
      {error && <p className="error-text">No se pudo refrescar el estado. Mostrando último estado conocido.</p>}
      <div className="actuator-grid">
        {actuators.map(act => (
          <div key={act.key} className={`actuator-item ${act.active ? 'active' : 'inactive'}`}>
            <AppIcon name={act.icon} className="actuator-icon" size={22} />
            <span className="actuator-label">{act.label}</span>
            <span className={`actuator-badge ${act.active ? 'on' : 'off'}`}>
              {act.active ? 'ACTIVO' : 'INACTIVO'}
            </span>
          </div>
        ))}
      </div>
      <div className="event-display">
        <span className="event-label">Simulación</span>
        <span className={`event-value ${state.simulation !== 'idle' ? 'active' : ''}`}>
          {state.simulation || 'idle'} {state.difficulty ? `· ${state.difficulty}` : ''}
        </span>
      </div>
    </div>
  );
}
