# EMBER Dashboard Web

Panel de control React para la tesis EMBER.

## Requisitos

- Node.js >= 16
- npm

## Configuración

Edita el archivo `.env` con las IPs de tus servidores:

```env
VITE_EMBER_SERVER_REST=http://192.168.1.X:3000
VITE_EMBER_SERVER_WS=ws://192.168.1.X:8080
VITE_OTA_SERVER=http://192.168.1.X:3000
```

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