import { useState, useEffect } from 'react';

export function NetworkInfo() {
  const [time, setTime] = useState(new Date());
  const [ip, setIP] = useState('Cargando...');
  const [loading, setLoading] = useState(true);

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

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-EC', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card">
      <h2>Información de Red</h2>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">Hora Local</span>
          <span className="value time">{formatTime(time)}</span>
        </div>
        <div className="info-item">
          <span className="label">Fecha</span>
          <span className="value">{formatDate(time)}</span>
        </div>
        <div className="info-item">
          <span className="label">IP Pública</span>
          <span className="value">{loading ? 'Cargando...' : ip}</span>
        </div>
      </div>
    </div>
  );
}