import { useState, useEffect, useCallback } from 'react';
import { api, OTA_SERVER } from '../services/api';
import { AppIcon } from './UiIcons';

export function OTAControl({ isMinimized = false }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [, networkData, versionData] = await Promise.all([
        api.ota.getStatus(),
        api.network.getDevices(),
        api.ota.getVersion(),
      ]);
      setDevices(networkData.devices || []);
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

  if (loading && isMinimized) return <div className="card widget-card loading">Cargando...</div>;
  if (error && isMinimized) return <div className="card widget-card error">{error}</div>;

  // Modo minimizado
  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="ota" className="widget-title-icon" /> OTA Sistema</h3>
          <span className="badge">v{version}</span>
        </div>
        <div className="widget-body">
          <div className="widget-stat">
            <span className="stat-label">Dispositivos</span>
            <span className="stat-value">{devices.length}</span>
          </div>
          <div className="widget-stat">
            <span className="stat-label">Estado</span>
            <span className="stat-value status-ok">Activo</span>
          </div>
        </div>
      </div>
    );
  }

  // Modo detalle
  if (loading) return <div className="loading">Cargando estado OTA...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <button onClick={fetchData} className="refresh-btn"><AppIcon name="refresh" className="btn-icon" size={14} /> Actualizar</button>
      
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
              <div key={device.ip || i} className="device-item">
                <span className="device-id">{device.hostname || device.ip}</span>
                <span className="device-version">{device.mac || device.source || 'sin MAC'}</span>
                <span className="device-last-seen">
                  {device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString('es-EC') : device.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3>Actualizar Firmware</h3>
        <p className="info-text">Para actualizar el firmware, sube el archivo .bin desde el dashboard del servidor OTA.</p>
        <a href={OTA_SERVER} target="_blank" rel="noopener noreferrer" className="btn">
          Abrir Dashboard OTA
        </a>
      </div>
    </div>
  );
}
