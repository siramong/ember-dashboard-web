import { useState, useEffect } from 'react';
import { AppIcon } from './UiIcons';
import { ServerLights } from './ServerLights';

export function NetworkInfo({ isMinimized = false }) {
  const [time, setTime] = useState(new Date());
  const [ip, setIP] = useState('Cargando...');
  const [loading, setLoading] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');

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

  const handleCopyIP = async () => {
    if (!ip || ip === 'No disponible' || loading) return;
    try {
      await navigator.clipboard.writeText(ip);
      setCopyFeedback('IP copiada');
    } catch {
      setCopyFeedback('No se pudo copiar');
    } finally {
      window.setTimeout(() => setCopyFeedback(''), 1300);
    }
  };

  if (isMinimized) {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');

    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="network" className="widget-title-icon" /> Red</h3>
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
          <span className="label"><AppIcon name="clock" size={13} className="inline-icon" /> Hora Local</span>
          <span className="value time">{formatTime(time)}</span>
        </div>
        <div className="info-item">
          <span className="label"><AppIcon name="calendar" size={13} className="inline-icon" /> Fecha</span>
          <span className="value">{formatDate(time)}</span>
        </div>
        <div className="info-item">
          <span className="label"><AppIcon name="network" size={13} className="inline-icon" /> IP Pública</span>
          <span className="value">{loading ? 'Cargando...' : ip}</span>
        </div>
      </div>
      <div className="inline-actions">
        <button type="button" className="refresh-btn" onClick={handleCopyIP} disabled={loading || ip === 'No disponible'}>
          <AppIcon name="copy" className="btn-icon" size={13} /> Copiar IP
        </button>
        {copyFeedback && <span className="inline-feedback">{copyFeedback}</span>}
      </div>
    </div>
  );
}