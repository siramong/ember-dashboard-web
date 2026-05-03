const EMBER_SERVER_REST = import.meta.env.VITE_EMBER_SERVER_REST || 'https://api.aureliainteractive.me';
const EMBER_SERVER_WS = import.meta.env.VITE_EMBER_SERVER_WS || 'wss://ws.aureliainteractive.me';
const OTA_SERVER = import.meta.env.VITE_OTA_SERVER || 'https://api.aureliainteractive.me';

export const api = {
  server: {
    getState: () => fetch(`${EMBER_SERVER_REST}/dashboard/state`).then(r => r.json()),
    getHealth: () => fetch(`${EMBER_SERVER_REST}/health`).then(r => r.json()),
    stopSimulation: (reason = 'emergency_stop') => fetch(`${EMBER_SERVER_REST}/simulation/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'dashboard-web',
        reason,
      }),
    }).then(async r => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      return data;
    }),
  },
  ota: {
    getStatus: () => fetch(`${OTA_SERVER}/status`).then(r => r.json()),
    getLogs: (n = 100) => fetch(`${OTA_SERVER}/logs?n=${n}`).then(r => r.text()),
    getVersion: () => fetch(`${OTA_SERVER}/version`).then(r => r.json()),
  },
  network: {
    getLocalIP: () => api.server.getHealth().then(() => EMBER_SERVER_REST).catch(() => null),
    getDevices: (force = false) => fetch(`${EMBER_SERVER_REST}/network/devices${force ? '?force=true' : ''}`).then(async r => {
      const data = await r.json().catch(() => ({ devices: [] }));
      if (!r.ok) {
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      return data;
    }),
  }
};

export const WS_URL = EMBER_SERVER_WS;
export { EMBER_SERVER_REST, OTA_SERVER };
