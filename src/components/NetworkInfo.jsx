import { useState, useEffect } from 'react';
import { AppIcon } from './UiIcons';
import { ServerLights } from './ServerLights';

export function NetworkInfo({ isMinimized = false }) {
  const [time, setTime] = useState(new Date());
  const [ip, setIP] = useState('Cargando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => setIP(d.ip))
      .catch(() => setIP('No disponible'))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('es-EC', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (isMinimized) {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');

    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="link" className="widget-title-icon" /> Red</h3>
          <span className="badge">Conectada</span>
        </div>

        {/* Big clock */}
        <div className="net-clock-display" aria-label={`Hora: ${formatTime(time)}`}>
          <span className="clock-seg">{h}</span>
          <span className="clock-colon">:</span>
          <span className="clock-seg">{m}</span>
          <span className="clock-colon">:</span>
          <span className="clock-seg clock-sec">{s}</span>
        </div>

        {/* Server LED rack */}
        <ServerLights rows={3} cols={12} />

        <div className="widget-stat">
          <span className="stat-label">IP Pública</span>
          <span className="stat-value mono">{loading ? '···' : ip}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">Hora Local</span>
          <span className="value time">{formatTime(time)}</span>
        </div>
        <div className="info-item">
          <span className="label">Fecha</span>
          <span className="value">{formatDate(time)}</span>
        </div>
        <div className="info-item">
          <span className="label">IP Pública</span>
          <span className="value">{loading ? 'Cargando...' : ip}</span>
        </div>
      </div>
    </div>
  );
}