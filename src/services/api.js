const EMBER_SERVER_REST = import.meta.env.VITE_EMBER_SERVER_REST || 'http://localhost:3000';
const EMBER_SERVER_WS = import.meta.env.VITE_EMBER_SERVER_WS || 'ws://localhost:8080';
const OTA_SERVER = import.meta.env.VITE_OTA_SERVER || 'http://localhost:3000';

export const api = {
  server: {
    getState: () => fetch(`${EMBER_SERVER_REST}/state`).then(r => r.json()),
    getHealth: () => fetch(`${EMBER_SERVER_REST}/health`).then(r => r.json()),
    startSimulation: (mode) => fetch(`${EMBER_SERVER_REST}/simulation/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    }).then(r => r.json()),
    stopSimulation: () => fetch(`${EMBER_SERVER_REST}/simulation/stop`, {
      method: 'POST'
    }).then(r => r.json()),
    controlActuator: (action) => fetch(`${EMBER_SERVER_REST}/actuator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    }).then(r => r.json()),
  },
  ota: {
    getStatus: () => fetch(`${OTA_SERVER}/status`).then(r => r.json()),
    getDevices: () => fetch(`${OTA_SERVER}/devices`).then(r => r.json()),
    getLogs: (n = 100) => fetch(`${OTA_SERVER}/logs?n=${n}`).then(r => r.text()),
    getVersion: () => fetch(`${OTA_SERVER}/version`).then(r => r.json()),
  },
  network: {
    getLocalIP: () => {
      const s = new WebSocket(EMBER_SERVER_WS.replace('http', 'ws'));
      return new Promise((resolve) => {
        s.onopen = () => {
          resolve(s);
          s.close();
        };
        s.onerror = () => resolve(null);
      });
    },
  }
};

export const WS_URL = EMBER_SERVER_WS;
export { EMBER_SERVER_REST, OTA_SERVER };