const ICONS = {
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
      {ICONS[name]}
    </svg>
  );
}