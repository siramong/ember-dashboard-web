const ICONS = {
  network: (
    <>
      <path d="M3.8 9.5A12.5 12.5 0 0 1 20.2 9.5" />
      <path d="M6.8 12.5a8.5 8.5 0 0 1 10.4 0" />
      <path d="M10 15.6a4.2 4.2 0 0 1 4 0" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  cabin: (
    <>
      <path d="M4 11.5 12 5l8 6.5V20H4z" />
      <path d="M8 20v-5h8v5" />
      <path d="M10 20v-3h4v3" />
    </>
  ),
  wave: (
    <>
      <path d="M4 14c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4" />
      <path d="M4 18c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4" />
    </>
  ),
  fire: (
    <path d="M13.5 4.5c.7 3.1-1.3 4.3-1.3 6.2 0 1.4.9 2.2 2.1 2.2 1.4 0 2.7-1.3 2.7-3.5 0-3.6-3.6-6.2-3.6-6.2s-2.1 1.1-3.4 3c-1.5 2.2-2.3 4.6-2.3 7 0 3.2 2.4 5.8 5.4 5.8s5.5-2.4 5.5-5.5c0-2.4-1.1-4.2-2.8-5.8-.5 1.6-1.6 2.7-2.9 2.7-.8 0-1.4-.5-1.4-1.3 0-1.1 1.1-1.9 1-4.6z" />
  ),
  stop: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <rect x="9" y="9" width="6" height="6" rx="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  actuator: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4.5v2.2M12 15.3v2.2M4.5 12h2.2M15.3 12h2.2M6.5 6.5l1.6 1.6M15.9 15.9l1.6 1.6M17.5 6.5l-1.6 1.6M8.1 15.9l-1.6 1.6" />
    </>
  ),
  motor: (
    <>
      <rect x="5" y="8" width="11" height="8" rx="2" />
      <path d="M16 10h1.6a1.4 1.4 0 0 1 1.4 1.4v1.2a1.4 1.4 0 0 1-1.4 1.4H16" />
      <path d="M5 10.5H3.8M5 13.5H3.8" />
      <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M10.5 12h3.5" />
    </>
  ),
  ledTower: (
    <>
      <rect x="9" y="4.5" width="6" height="14" rx="2" />
      <path d="M9 9h6M9 13h6M10.5 19.5h3" />
      <circle cx="12" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  ledStrip: (
    <>
      <rect x="4.5" y="10" width="15" height="4" rx="2" />
      <circle cx="8" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  device: (
    <>
      <rect x="5" y="6" width="14" height="12" rx="2.5" />
      <path d="M8 18v2M16 18v2M9 9h6M9 12h4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 6v5h-5" />
      <path d="M20 11a8 8 0 1 0 2 5.4" />
    </>
  ),
  service: (
    <>
      <path d="M4 12h16" />
      <path d="M6 12a6 6 0 0 1 12 0" />
      <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  bell: (
    <>
      <path d="M8 17h8" />
      <path d="M10 19a2 2 0 0 0 4 0" />
      <path d="M6.5 17c1.2-1.3 1.5-2.6 1.5-4.5a4 4 0 0 1 8 0c0 1.9.3 3.2 1.5 4.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.5v4l2.8 1.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4.5" y="6" width="15" height="13" rx="2" />
      <path d="M4.5 10h15M8 4.8V7.2M16 4.8V7.2" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <rect x="5" y="5" width="10" height="10" rx="2" />
    </>
  ),
  external: (
    <>
      <path d="M14 5h5v5" />
      <path d="M11 13 19 5" />
      <rect x="5" y="8" width="11" height="11" rx="2" />
    </>
  ),
  close: (
    <>
      <path d="m7 7 10 10M17 7 7 17" />
    </>
  ),
  logs: (
    <>
      <rect x="4.5" y="5" width="15" height="14" rx="2" />
      <path d="M8 9h8M8 12h8M8 15h5" />
    </>
  ),
  check: (
    <path d="M6.5 12.5 10.2 16l7.3-8" />
  ),
  x: (
    <path d="m7 7 10 10M17 7 7 17" />
  ),
  ota: (
    <>
      <rect x="4.5" y="6" width="15" height="12" rx="2.5" />
      <path d="M8 10h8M8 13h5M6.5 18h11" />
      <path d="M7 6V4.5M17 6V4.5" />
    </>
  ),
  led: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2" />
    </>
  ),
  power: (
    <>
      <path d="M12 4.5v7" />
      <path d="M8 6.5a7 7 0 1 0 8 0" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a3.5 3.5 0 0 1 0-5l1.3-1.3a3.5 3.5 0 0 1 5 5L15.6 13" />
      <path d="M14 11a3.5 3.5 0 0 1 0 5L12.7 17.3a3.5 3.5 0 0 1-5-5L8.4 11" />
    </>
  ),
};

export function AppIcon({ name, className = '', size = 20 }) {
  return (
    <svg
      className={`app-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name] || ICONS.device}
    </svg>
  );
}