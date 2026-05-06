import { useState, useEffect, useCallback } from 'react';
import { AppIcon } from './UiIcons';
import { EMBER_SERVER_REST, OTA_SERVER } from '../services/api';

const SERVICES = [
  { name: 'Roblox',      url: 'https://roblox.com',    checkUrl: 'https://roblox.com/',                     mode: 'no-cors'  },
  { name: 'Cloudflare',  url: 'https://cloudflare.com', checkUrl: 'https://cloudflare.com/',                mode: 'no-cors'  },
  { name: 'EMBER REST',  url: EMBER_SERVER_REST,        checkUrl: `${EMBER_SERVER_REST}/health`,             mode: 'cors'     },
  { name: 'OTA',         url: OTA_SERVER,               checkUrl: `${OTA_SERVER}/status`,                   mode: 'cors'     },
];

const MAX_BAR_MS = 400; // reference for 100% bar width
const REQUEST_TIMEOUT_MS = 5000;

async function checkService(service) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const start = performance.now();
  try {
    await fetch(service.checkUrl, {
      mode: service.mode,
      cache: 'no-store',
      signal: controller.signal,
    });
    return { status: 'online', latency: Math.round(performance.now() - start) };
  } catch {
    return { status: 'offline', latency: 0 };
  } finally {
    clearTimeout(timer);
  }
}

function LatencyBar({ service }) {
  const pct =
    service.status === 'online'
      ? Math.max(4, Math.min(100, (service.latency / MAX_BAR_MS) * 100))
      : service.status === 'offline'
        ? 4
        : 40;

  return (
    <div className="lat-row">
      <span className="lat-name">{service.name}</span>
      <div className="lat-track">
        <div
          className={`lat-fill lat-fill-${service.status}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`lat-ms lat-ms-${service.status}`}>
        {service.status === 'online'
          ? `${service.latency}ms`
          : service.status === 'checking'
            ? '···'
            : '✗'}
      </span>
    </div>
  );
}

export function ServiceChecker({ isMinimized = false }) {
  const [services, setServices] = useState(
    SERVICES.map(s => ({ ...s, status: 'checking', latency: 0 }))
  );
  const [lastCheck, setLastCheck] = useState(null);

  const checkAll = useCallback(async () => {
    const results = await Promise.all(
      SERVICES.map(async s => ({ ...s, ...(await checkService(s)) }))
    );
    setServices(results);
    setLastCheck(new Date());
  }, []);

  useEffect(() => {
    checkAll();
    const interval = setInterval(checkAll, 30000);
    return () => clearInterval(interval);
  }, [checkAll]);

  const handleManualCheck = async () => {
    setServices(prev => prev.map(s => ({ ...s, status: 'checking' })));
    const results = await Promise.all(
      SERVICES.map(async s => ({ ...s, ...(await checkService(s)) }))
    );
    setServices(results);
    setLastCheck(new Date());
  };

  const onlineCount = services.filter(s => s.status === 'online').length;
  const handleOpenService = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isMinimized) {
    return (
      <div className="card widget-card">
        <div className="widget-header">
          <h3><AppIcon name="service" className="widget-title-icon" /> Servicios</h3>
          <span className={`badge ${onlineCount === services.length ? 'connected' : onlineCount === 0 ? 'disconnected' : ''}`}>
            {onlineCount}/{services.length} OK
          </span>
        </div>
        <div className="widget-body">
          <div className="lat-bars">
            {services.map(service => (
              <LatencyBar key={service.name} service={service} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleManualCheck} className="refresh-btn">
        <AppIcon name="refresh" className="btn-icon" size={14} /> Verificar
      </button>
      {lastCheck && (
        <p className="last-check">Última verificación: {lastCheck.toLocaleTimeString('es-EC')}</p>
      )}
      <div className="service-list">
        {services.map(service => (
          <div key={service.name} className={`service-item ${service.status}`}>
            <AppIcon
              name={service.status === 'online' ? 'check' : service.status === 'offline' ? 'x' : 'refresh'}
              className="service-icon"
              size={14}
            />
            <span className="service-name">{service.name}</span>
            <span className="service-status">
              {service.status === 'checking'
                ? 'Verificando...'
                : service.status === 'online'
                  ? `✓ ${service.latency}ms`
                  : '✗ Offline'}
            </span>
            <button type="button" className="refresh-btn service-open-btn" onClick={() => handleOpenService(service.url)}>
              <AppIcon name="external" className="btn-icon" size={12} /> Abrir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}