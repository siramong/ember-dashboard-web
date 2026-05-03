import { useState, useEffect, useCallback } from 'react';
import { AppIcon } from './UiIcons';
import { EMBER_SERVER_REST, OTA_SERVER } from '../services/api';

const SERVICES = [
  { name: 'Roblox', url: 'https://roblox.com', checkUrl: 'https://roblox.com/' },
  { name: 'Cloudflare', url: 'https://cloudflare.com', checkUrl: 'https://cloudflare.com/' },
  { name: 'EMBER REST', url: EMBER_SERVER_REST, checkUrl: `${EMBER_SERVER_REST}/health`, mode: 'cors' },
  { name: 'OTA', url: OTA_SERVER, checkUrl: `${OTA_SERVER}/status`, mode: 'cors' },
];

async function checkService(service) {
  const start = Date.now();
  try {
    await fetch(service.checkUrl, { 
      mode: service.mode || 'no-cors',
      cache: 'no-store'
    });
    const latency = Date.now() - start;
    return { status: 'online', latency };
  } catch {
    return { status: 'offline', latency: 0 };
  }
}

export function ServiceChecker({ isMinimized = false }) {
  const [services, setServices] = useState(SERVICES.map(s => ({ ...s, status: 'checking', latency: 0 })));
  const [lastCheck, setLastCheck] = useState(null);

  const checkAll = useCallback(async () => {
    const results = await Promise.all(
      services.map(async (s) => {
        const result = await checkService(s);
        return { ...s, ...result };
      })
    );
    setServices(results);
    setLastCheck(new Date());
  }, [services]);

  useEffect(() => {
    checkAll();
    const interval = setInterval(checkAll, 30000);
    return () => clearInterval(interval);
  }, [checkAll]);

  const handleManualCheck = async () => {
    setServices(services.map(s => ({ ...s, status: 'checking' })));
    const results = await Promise.all(
      services.map(async (s) => {
        const result = await checkService(s);
        return { ...s, ...result };
      })
    );
    setServices(results);
    setLastCheck(new Date());
  };

  const onlineCount = services.filter(s => s.status === 'online').length;

  // Modo minimizado
  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="link" className="widget-title-icon" /> Servicios</h3>
          <span className="badge">{onlineCount}/{services.length} OK</span>
        </div>
        <div className="widget-body">
          <div className="service-grid-mini">
            {services.slice(0, 3).map((service) => (
              <div key={service.name} className={`service-mini ${service.status}`}>
                <span className="service-dot"></span>
                <span className="service-name">{service.name}</span>
              </div>
            ))}
            {services.length > 3 && <div className="service-more">+{services.length - 3}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Modo detalle
  return (
    <div>
      <button onClick={handleManualCheck} className="refresh-btn"><AppIcon name="refresh" className="btn-icon" size={14} /> Verificar</button>
      {lastCheck && <p className="last-check">Última verificación: {lastCheck.toLocaleTimeString('es-EC')}</p>}
      <div className="service-list">
        {services.map((service) => (
          <div key={service.name} className={`service-item ${service.status}`}>
            <span className="service-name">{service.name}</span>
            <span className="service-status">
              {service.status === 'checking' ? 'Verificando...' : 
               service.status === 'online' ? `✓ ${service.latency}ms` : '✗ Offline'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
