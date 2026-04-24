import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function OTAControl() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [, devicesData, versionData] = await Promise.all([
        api.ota.getStatus(),
        api.ota.getDevices(),
        api.ota.getVersion(),
      ]);
      setDevices(devicesData.devices || devicesData || []);
      setVersion(versionData.version || 'N/A');
      setError(null);
    } catch {
      setError('No se pudo conectar al servidor OTA');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return <div className="card loading">Cargando estado OTA...</div>;
  if (error) return <div className="card error">{error}</div>;

  return (
    <div className="card">
      <h2>Sistema OTA</h2>
      <button onClick={fetchData} className="refresh-btn">⟳ Actualizar</button>
      
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
          <span className="value status-ok">Activo</span>
        </div>
      </div>

      <div className="section">
        <h3>Dispositivos Registrados</h3>
        {devices.length === 0 ? (
          <p className="empty">No hay dispositivos</p>
        ) : (
          <div className="device-list">
            {devices.map((device, i) => (
              <div key={device.device_id || i} className="device-item">
                <span className="device-id">{device.device_id}</span>
                <span className="device-version">v{device.version || '?'}</span>
                <span className="device-last-seen">
                  {device.last_seen ? new Date(device.last_seen).toLocaleTimeString('es-EC') : 'Nunca'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3>Actualizar Firmware</h3>
        <p className="info-text">Para actualizar el firmware, sube el archivo .bin desde el dashboard del servidor OTA.</p>
        <a href={`${import.meta.env.VITE_OTA_SERVER || 'http://localhost:3000'}`} target="_blank" rel="noopener noreferrer" className="btn">
          Abrir Dashboard OTA
        </a>
      </div>
    </div>
  );
}