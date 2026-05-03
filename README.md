# EMBER Dashboard Web

Panel de control React para la tesis EMBER.

El dashboard web consume el servidor EMBER por REST. El WebSocket del servidor queda reservado para la cabina ESP32 fisica.

## Requisitos

- Node.js >= 16
- npm

## Configuración

Edita el archivo `.env` con los endpoints publicos del proyecto:

```env
VITE_EMBER_SERVER_REST=https://api.aureliainteractive.me
VITE_EMBER_SERVER_WS=wss://ws.aureliainteractive.me
VITE_OTA_SERVER=https://api.aureliainteractive.me
```

## Funciones integradas

- Consulta `GET /state` para simulacion, movimiento y actuadores.
- Consulta `GET /health` para saber si la cabina ESP32 esta conectada.
- Detiene simulaciones con `POST /simulation/stop` para parada de emergencia.
- Muestra estado de simulacion, dificultad, movimiento y actuadores.

Simulaciones soportadas:

- `FireSimulation`
- `EarthquakeSimulation`
- `ArmedGroupsSimulation`
- `ExplorationSimulation`

Dificultades soportadas:

- `Basico`
- `Medio`
- `Critico`

Importante:

- El dashboard web no debe abrir una conexion WebSocket al servidor EMBER, porque el WebSocket es la conexion persistente de la cabina.
- El dashboard web no debe iniciar simulaciones ni enviar comandos de motor. Es una version compacta/observadora del dashboard del servidor con parada de emergencia.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm run build
```

El build se genera en `dist/`.

---

**Nota:** Los servidores ember-server y OTA deben estar corriendo para que el dashboard funcione correctamente.
