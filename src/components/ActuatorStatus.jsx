import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ActuatorStatus() {
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

  if (loading) return <div className="card loading">Cargando estado...</div>;
  if (!state) return <div className="card error">Sin datos del servidor</div>;

  const actuators = [
    { key: 'motor', label: 'Motor', active: state.motor_on },
    { key: 'heater', label: 'Calentador', active: state.heater_on },
    { key: 'led', label: 'LED', active: state.led_color && state.led_color !== 'off' },
  ];

  return (
    <div className="card">
      <h2>Estado de Actuadores</h2>
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