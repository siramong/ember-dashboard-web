import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function DeviceList() {
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

  if (loading) return <div className="card loading">Cargando dispositivos...</div>;
  if (error) return <div className="card error">{error}</div>;

  return (
    <div className="card">
      <h2>Dispositivos en Red</h2>
      <button onClick={fetchDevices} className="refresh-btn">⟳ Actualizar</button>
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