import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { AppIcon } from './UiIcons';

export function DeviceList({ isMinimized = false }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);

  const fetchDevices = useCallback(async () => {
    try {
      const data = await api.ota.getDevices();
      setDevices(data.devices || data || []);
      setError(null);
      setLastCheck(Date.now());
    } catch {
      setError('No se pudo obtener dispositivos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const getStatusColor = (lastSeen) => {
    if (!lastSeen || !lastCheck) return 'offline';
    const diff = lastCheck - new Date(lastSeen).getTime();
    return diff < 60000 ? 'online' : diff < 300000 ? 'warning' : 'offline';
  };

  const onlineCount = devices.filter(d => getStatusColor(d.last_seen) === 'online').length;

  // Modo minimizado (para dashboard principal)
  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="device" className="widget-title-icon" /> Dispositivos</h3>
          <span className="badge">{onlineCount} en línea</span>
        </div>
        <div className="widget-body">
          {error ? (
            <p className="error-text">{error}</p>
          ) : devices.length === 0 ? (
            <p className="empty-text">Sin dispositivos</p>
          ) : (
            <div className="widget-preview">
              {devices.slice(0, 3).map((device, i) => (
                <div key={device.device_id || i} className={`preview-item ${getStatusColor(device.last_seen)}`}>
                  <span className="device-id">{device.device_id}</span>
                  <span className="device-status">
                    {getStatusColor(device.last_seen) === 'online' ? '● En línea' : 
                     getStatusColor(device.last_seen) === 'warning' ? '● Inactivo' : '○ Offline'}
                  </span>
                </div>
              ))}
              {devices.length > 3 && <p className="more-text">+{devices.length - 3} más</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Modo detalle (modal)
  if (loading) return <div className="loading">Cargando dispositivos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <button onClick={fetchDevices} className="refresh-btn"><AppIcon name="refresh" className="btn-icon" size={14} /> Actualizar</button>
      <div className="device-list">
        {devices.length === 0 ? (
          <p className="empty">No hay dispositivos registrados</p>
        ) : (
          devices.map((device, i) => (
            <div key={device.device_id || i} className={`device-item ${getStatusColor(device.last_seen)}`}>
              <span className="device-id">{device.device_id}</span>
              <span className="device-version">v{device.version || 'desconocida'}</span>
              <span className="device-status">
                {getStatusColor(device.last_seen) === 'online' ? 'En línea' : 
                 getStatusColor(device.last_seen) === 'warning' ? 'Inactivo' : 'Fuera de línea'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}