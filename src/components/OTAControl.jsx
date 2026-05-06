import { useState, useEffect, useCallback, useId } from 'react';
import { api, OTA_SERVER } from '../services/api';
import { AppIcon } from './UiIcons';

function polarXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: (cx + r * Math.cos(rad)).toFixed(2),
    y: (cy + r * Math.sin(rad)).toFixed(2),
  };
}

function arcPath(cx, cy, r, fromDeg, toDeg) {
  const s = polarXY(cx, cy, r, fromDeg);
  const e = polarXY(cx, cy, r, toDeg);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function ArcGauge({ value, maxVal, label, color = 'var(--accent)', healthy = true }) {
  const id = useId().replace(/:/g, '');
  const cx = 44, cy = 44, r = 30;
  const START = 135, END = 405; // 270° sweep
  const pct = Math.min(1, Math.max(0, value / maxVal));
  const fillEnd = START + pct * (END - START);
  const gColor = healthy ? 'var(--success)' : 'var(--warning)';

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" aria-label={`${label}: ${value}`}>
      {/* Track */}
      <path
        d={arcPath(cx, cy, r, START, END)}
        fill="none"
        stroke="var(--bg-3)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Fill */}
      {pct > 0.005 && (
        <path
          d={arcPath(cx, cy, r, START, fillEnd)}
          fill="none"
          stroke={gColor}
          strokeWidth="6"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${gColor})` }}
        />
      )}
      {/* Center text */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill="var(--text-h)"
        fontFamily="var(--font-display)"
        fontSize="18"
        fontWeight="700"
        dominantBaseline="auto"
      >
        {value}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="var(--text-dim)"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="0.1"
        dominantBaseline="auto"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

export function OTAControl({ isMinimized = false }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState('');
  const [otaStatus, setOtaStatus] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [serverOk, setServerOk] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [statusData, networkData, versionData] = await Promise.all([
        api.ota.getStatus(),
        api.network.getDevices(),
        api.ota.getVersion(),
      ]);
      const logsText = await api.ota.getLogs(20).catch(() => '');

      setDevices(networkData.devices || []);
      setVersion(versionData.version || 'N/A');
      setOtaStatus(statusData || null);
      setRecentLogs(
        logsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(-4)
          .reverse()
      );
      setServerOk(true);
      setError(null);
    } catch {
      setError('No se pudo conectar al servidor OTA');
      setServerOk(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && isMinimized) return <div className="card widget-card loading">Cargando...</div>;

  const pendingJobs = Number(otaStatus?.pending ?? otaStatus?.queue ?? 0);
  const healthyState = String(otaStatus?.status || otaStatus?.state || '').toLowerCase();
  const stateLabel = healthyState || (serverOk ? 'active' : 'offline');

  const handleCopyVersion = async () => {
    if (!version || version === 'N/A') return;
    try {
      await navigator.clipboard.writeText(version);
      setCopyFeedback('Versión copiada');
    } catch {
      setCopyFeedback('No se pudo copiar');
    } finally {
      window.setTimeout(() => setCopyFeedback(''), 1200);
    }
  };

  if (isMinimized) {
    const gaugeVal = serverOk ? Math.max(1, devices.length) : 0;
    const gaugeMax = Math.max(gaugeVal, 5);

    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="ota" className="widget-title-icon" /> OTA Sistema</h3>
          <span className="badge">v{version || '···'}</span>
        </div>

        <div className="ota-gauge-row">
          <ArcGauge
            value={gaugeVal}
            maxVal={gaugeMax}
            label="dispositivos"
            healthy={serverOk}
          />
          <div className="ota-gauge-stats">
            <div className="widget-stat">
              <span className="stat-label">Versión</span>
              <span className="stat-value mono">{version || '···'}</span>
            </div>
            <div className="widget-stat">
              <span className="stat-label">Estado</span>
              <span className={`stat-value ${serverOk ? 'status-ok' : ''}`}>
                {serverOk ? stateLabel : 'Offline'}
              </span>
            </div>
            <div className="widget-stat">
              <span className="stat-label">Pendientes</span>
              <span className="stat-value">{pendingJobs}</span>
            </div>
          </div>
        </div>

        {error && <p className="widget-note error-text">{error}</p>}
      </div>
    );
  }

  if (loading) return <div className="loading">Cargando estado OTA...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <button onClick={fetchData} className="refresh-btn">
        <AppIcon name="refresh" className="btn-icon" size={14} /> Actualizar
      </button>

      <div className="ota-status">
        <div className="ota-item">
          <span className="label">Versión Actual</span>
          <span className="value">{version}</span>
        </div>
        <div className="ota-item">
          <span className="label">Dispositivos</span>
          <span className="value">{devices.length}</span>
        </div>
        <div className="ota-item">
          <span className="label">Estado</span>
          <span className={`value ${serverOk ? 'status-ok' : ''}`}>{serverOk ? stateLabel : 'Offline'}</span>
        </div>
        <div className="ota-item">
          <span className="label">Pendientes</span>
          <span className="value">{pendingJobs}</span>
        </div>
      </div>

      <div className="inline-actions">
        <button type="button" className="refresh-btn" onClick={handleCopyVersion}>
          <AppIcon name="copy" className="btn-icon" size={13} /> Copiar versión
        </button>
        {copyFeedback && <span className="inline-feedback">{copyFeedback}</span>}
      </div>

      <div className="section">
        <h3>Dispositivos Registrados</h3>
        {devices.length === 0 ? (
          <p className="empty">No hay dispositivos</p>
        ) : (
          <div className="device-list">
            {devices.map((device, i) => (
              <div key={device.ip || i} className="device-item">
                <span className="device-id">{device.hostname || device.ip}</span>
                <span className="device-version">{device.mac || device.source || 'sin MAC'}</span>
                <span className="device-last-seen">
                  {device.lastSeen
                    ? new Date(device.lastSeen).toLocaleTimeString('es-EC')
                    : device.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3><AppIcon name="logs" className="widget-title-icon" /> Logs recientes</h3>
        {recentLogs.length === 0 ? (
          <p className="empty">No hay logs recientes</p>
        ) : (
          <div className="ota-log-list">
            {recentLogs.map((line, i) => (
              <p key={`${line}-${i}`} className="ota-log-line">{line}</p>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3>Actualizar Firmware</h3>
        <p className="info-text">Para actualizar el firmware, sube el archivo .bin desde el dashboard del servidor OTA.</p>
        <a href={OTA_SERVER} target="_blank" rel="noopener noreferrer" className="btn">
          <AppIcon name="external" className="btn-icon" size={14} /> Abrir Dashboard OTA
        </a>
      </div>
    </div>
  );
}