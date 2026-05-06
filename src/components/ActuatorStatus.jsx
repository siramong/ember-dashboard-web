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

const ACTUATOR_DEFS = [
  { key: 'motor',     label: 'Motor',     icon: 'actuator' },
  { key: 'heater',    label: 'Calefactor', icon: 'fire'     },
  { key: 'ledTower',  label: 'Torre LED',  icon: 'led'      },
  { key: 'buzzer',    label: 'Buzzer',     icon: 'service'  },
  { key: 'ledStrips', label: 'Tira LED',   icon: 'led'      },
];

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
  const actuators = ACTUATOR_DEFS.map(a => ({ ...a, active: Boolean(values[a.key]) }));
  const activeCount = actuators.filter(a => a.active).length;

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
                {/* Outer ring glow for active */}
                {act.active && <span className="actuator-ring" aria-hidden="true" />}
                <AppIcon name={act.icon} size={14} className={act.active ? 'act-icon-on' : 'act-icon-off'} />
                <span>{act.label}</span>
              </div>
            ))}
          </div>
          {error && <p className="widget-note">Mostrando último estado conocido</p>}
        </div>
      </div>
    );
  }

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