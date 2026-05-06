import { useState, useEffect, useCallback, useRef } from 'react';
import { api, EMBER_SERVER_REST } from '../services/api';
import { AppIcon } from './UiIcons';

const SIMULATIONS = [
  { mode: 'FireSimulation', label: 'Fuego', icon: 'fire' },
  { mode: 'EarthquakeSimulation', label: 'Sismo', icon: 'wave' },
  { mode: 'ArmedGroupsSimulation', label: 'Grupos armados', icon: 'cabin' },
  { mode: 'ExplorationSimulation', label: 'Exploración', icon: 'led' },
];

// One EKG cycle — normalized y values (0=top, 1=bottom in screen coords)
const EKG_CYCLE = [
  0.5,0.5,0.5,0.5,0.5,
  0.45,0.42,0.45,0.5,0.5,   // P wave
  0.52,0.58,0.64,            // Q descent
  0.05,                       // R peak spike UP
  0.82,0.72,0.6,0.53,0.5,   // S + recovery
  0.5,0.5,0.5,               // ST segment
  0.43,0.38,0.36,0.38,0.44,0.5, // T wave
  0.5,0.5,0.5,0.5,0.5,
];

function EKGMonitor({ active }) {
  const POINTS = 55;
  const idxRef = useRef(0);
  const [pts, setPts] = useState(() => Array(POINTS).fill(0.5));

  useEffect(() => {
    if (!active) {
      idxRef.current = 0;
      setPts(Array(POINTS).fill(0.5));
      return;
    }
    const id = setInterval(() => {
      setPts(prev => {
        const next = [...prev.slice(1), EKG_CYCLE[idxRef.current % EKG_CYCLE.length]];
        idxRef.current++;
        return next;
      });
    }, 38);
    return () => clearInterval(id);
  }, [active]);

  const W = 120, H = 32;
  const svgPts = pts
    .map((v, i) => {
      const x = ((i / (pts.length - 1)) * W).toFixed(1);
      const y = (2 + v * (H - 4)).toFixed(1);
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = active ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="ekg-monitor" aria-hidden="true">
      <span className={`ekg-label ${active ? 'ekg-live' : 'ekg-offline'}`}>
        {active ? '● LIVE' : '○ OFFLINE'}
      </span>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Glow trace */}
        {active && (
          <polyline
            points={svgPts}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.1"
          />
        )}
        <polyline
          points={svgPts}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function CabinControl({ isMinimized = false }) {
  const [state, setState] = useState({
    simulation: 'idle', difficulty: null, movement: 'idle', event: null, actuators: {},
  });
  const [health, setHealth] = useState({ cabina: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverControl, setServerControl] = useState({ pending: false, response: null });

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
    setServerControl({ pending: true, response: null });
    try {
      const response = await api.server.stopSimulation('emergency_stop');
      setServerControl({ pending: false, response });
      await fetchState();
    } catch (err) {
      console.error(err);
      setServerControl({ pending: false, response: null });
      setError('No se pudo detener la simulación');
    }
  };

  const cabinaConnected = Boolean(health.cabina);
  const simulationActive = state.simulation && state.simulation !== 'idle';
  const currentSimulation = SIMULATIONS.find(s => s.mode === state.simulation);

  if (loading && isMinimized) return <div className="card widget-card loading">Cargando...</div>;

  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="cabin" className="widget-title-icon" /> Cabina</h3>
          <span className={`badge ${cabinaConnected ? 'connected' : 'disconnected'}`}>
            {cabinaConnected ? 'Cabina conectada' : 'Cabina offline'}
          </span>
        </div>

        {/* EKG heartbeat monitor */}
        <EKGMonitor active={cabinaConnected} />

        <div className="widget-body">
          <div className="widget-stat">
            <span className="stat-label">Simulación</span>
            <span className={`stat-value ${simulationActive ? '' : 'stat-dim'}`}>
              {currentSimulation?.label || 'IDLE'}
            </span>
          </div>
          <div className="widget-stat">
            <span className="stat-label">Movimiento</span>
            <span className="stat-value">{state.movement || 'idle'}</span>
          </div>
        </div>
      </div>
    );
  }

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
        <h3>Control del servidor</h3>
        <div className="server-control-panel">
          <div className="server-endpoint">
            <span className="stat-label">Endpoint REST</span>
            <code>POST {EMBER_SERVER_REST}/simulation/stop</code>
          </div>
          <pre className="server-body-preview">{`{
  "source": "dashboard-web",
  "reason": "emergency_stop"
}`}</pre>
        </div>
        <button
          className="btn btn-danger"
          onClick={handleStop}
          disabled={serverControl.pending}
        >
          <AppIcon name="stop" className="btn-icon" size={15} />
          {serverControl.pending ? 'Enviando parada...' : 'Parada de emergencia'}
        </button>
        <p className="status-text">
          {serverControl.response
            ? `Respuesta servidor: ${serverControl.response.message || serverControl.response.status || 'stop recibido'}`
            : 'El dashboard web solo puede detener por emergencia.'}
        </p>
      </div>
    </div>
  );
}