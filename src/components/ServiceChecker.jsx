import { useState, useEffect, useCallback } from 'react';

const SERVICES = [
  { name: 'Roblox', url: 'https://roblox.com', checkUrl: 'https://roblox.com/' },
  { name: 'Roblox CDN', url: 'https://rbxcdn.com', checkUrl: 'https://rbxcdn.com' },
  { name: 'Cloudflare', url: 'https://cloudflare.com', checkUrl: 'https://cloudflare.com/' },
  { name: 'Empresa API', url: 'https://api.aureliainteractive.me', checkUrl: 'https://api.aureliainteractive.me/' },
];

async function checkService(service) {
  const start = Date.now();
  try {
    await fetch(service.checkUrl, { 
      mode: 'no-cors',
      cache: 'no-store'
    });
    const latency = Date.now() - start;
    return { status: 'online', latency };
  } catch {
    return { status: 'offline', latency: 0 };
  }
}

export function ServiceChecker() {
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

  return (
    <div className="card">
      <h2>Estado de Servicios</h2>
      <button onClick={handleManualCheck} className="refresh-btn">⟳ Verificar</button>
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