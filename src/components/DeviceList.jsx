import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { AppIcon } from './UiIcons';
import { Sparkline } from './Sparkline';

export function DeviceList({ isMinimized = false }) {
  const [devices, setDevices] = useState([]);
  const [scanInfo, setScanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchDevices = useCallback(async (force = false) => {
    try {
      const data = await api.network.getDevices(force);
      setDevices(data.devices || []);
      setScanInfo(data);
      setError(null);
    } catch {
      setError('No se pudo escanear la red');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const getStatusColor = (device) => {
    if (device.status === 'online') return 'online';
    if (device.status === 'seen') return 'warning';
    return 'offline';
  };

  const onlineCount = devices.filter(d => getStatusColor(d) === 'online').length;
  const filteredDevices = devices.filter((device) => {
    const status = getStatusColor(device);
    if (filter === 'all') return true;
    return status === filter;
  });

  const filterCounts = {
    all: devices.length,
    online: devices.filter(d => getStatusColor(d) === 'online').length,
    warning: devices.filter(d => getStatusColor(d) === 'warning').length,
    offline: devices.filter(d => getStatusColor(d) === 'offline').length,
  };

  const formatDeviceName = (device) => device.hostname || device.ip || 'Dispositivo';
  const formatDeviceMeta = (device) => device.mac || device.source || 'sin MAC';

  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="device" className="widget-title-icon" /> Dispositivos</h3>
          <span className="badge">{onlineCount}/{devices.length} en línea</span>
        </div>

        {/* Network activity sparkline */}
        <Sparkline
          color="var(--cyan)"
          height={42}
          pointCount={28}
          updateInterval={1100}
        />

        <div className="widget-body">
          {error ? (
            <p className="error-text">{error}</p>
          ) : devices.length === 0 ? (
            <p className="empty-text">Sin dispositivos</p>
          ) : (
            <div className="widget-preview">
              {devices.slice(0, 3).map((device, i) => (
                <div key={device.ip || i} className={`preview-item ${getStatusColor(device)}`}>
                  <span className="device-id">{formatDeviceName(device)}</span>
                  <span className="device-status">
                    {getStatusColor(device) === 'online'
                      ? '● En línea'
                      : getStatusColor(device) === 'warning'
                        ? '● Visto'
                        : '○ Offline'}
                  </span>
                </div>
              ))}
              {devices.length > 3 && (
                <p className="more-text">+{devices.length - 3} más</p>
              )}
              {scanInfo?.interface && (
                <p className="more-text">{scanInfo.interface.address}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Cargando dispositivos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <button onClick={() => fetchDevices(true)} className="refresh-btn">
        <AppIcon name="refresh" className="btn-icon" size={14} /> Escanear ahora
      </button>
      <div className="inline-actions">
        <button type="button" className={`btn-mini ${filter === 'all' ? 'selected' : ''}`} onClick={() => setFilter('all')}>
          Todos ({filterCounts.all})
        </button>
        <button type="button" className={`btn-mini ${filter === 'online' ? 'selected' : ''}`} onClick={() => setFilter('online')}>
          En línea ({filterCounts.online})
        </button>
        <button type="button" className={`btn-mini ${filter === 'warning' ? 'selected' : ''}`} onClick={() => setFilter('warning')}>
          Vistos ({filterCounts.warning})
        </button>
        <button type="button" className={`btn-mini ${filter === 'offline' ? 'selected' : ''}`} onClick={() => setFilter('offline')}>
          Offline ({filterCounts.offline})
        </button>
      </div>
      {scanInfo?.interface && (
        <p className="last-check">
          Red escaneada desde {scanInfo.interface.name} · {scanInfo.interface.address}
          {scanInfo.cached ? ' · cache' : ''}
        </p>
      )}
      <div className="device-list">
        {filteredDevices.length === 0 ? (
          <p className="empty">No hay dispositivos registrados</p>
        ) : (
          filteredDevices.map((device, i) => (
            <div key={device.ip || i} className={`device-item ${getStatusColor(device)}`}>
              <span className="device-id">{formatDeviceName(device)}</span>
              <span className="device-version">{formatDeviceMeta(device)}</span>
              <span className="device-status">
                {getStatusColor(device) === 'online'
                  ? `En línea${device.latencyMs !== null ? ` · ${device.latencyMs}ms` : ''}`
                  : getStatusColor(device) === 'warning'
                    ? 'Visto por ARP'
                    : 'Fuera de línea'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}