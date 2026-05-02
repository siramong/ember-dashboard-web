import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppIcon } from './UiIcons';

export function ActuatorStatus({ isMinimized = false }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const data = await api.server.getState();
        setState(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading && isMinimized) return <div className="card widget-card loading">Cargando...</div>;
  if (!state && isMinimized) return <div className="card widget-card error">Sin datos</div>;

  const actuators = [
    { key: 'motor', label: 'Motor', active: state?.motor_on },
    { key: 'heater', label: 'Calentador', active: state?.heater_on },
    { key: 'led', label: 'LED', active: state?.led_color && state.led_color !== 'off' },
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
        </div>
      </div>
    );
  }

  // Modo detalle
  if (loading) return <div className="loading">Cargando estado...</div>;
  if (!state) return <div className="error">Sin datos del servidor</div>;

  return (
    <div>
      <div className="actuator-grid">
        {actuators.map(act => (
          <div key={act.key} className={`actuator-item ${act.active ? 'active' : 'inactive'}`}>
            <span className="actuator-label">{act.label}</span>
            <span className="actuator-status">
              {act.active ? 'ACTIVADO' : 'DESACTIVADO'}
            </span>
          </div>
        ))}
      </div>
      {state.led_color && (
        <div className="led-indicator">
          <span>Color LED: </span>
          <span className={`led-color ${state.led_color}`}>{state.led_color}</span>
        </div>
      )}
    </div>
  );
}