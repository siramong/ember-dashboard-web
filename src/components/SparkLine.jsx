import { useState, useEffect, useId } from 'react';

export function Sparkline({
  color = 'var(--accent)',
  height = 40,
  pointCount = 24,
  updateInterval = 900,
  className = '',
}) {
  const id = useId().replace(/:/g, '');
  const [data, setData] = useState(() =>
    Array.from({ length: pointCount }, () => 15 + Math.random() * 70)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const delta = (Math.random() - 0.47) * 22;
        const next = Math.min(92, Math.max(8, last + delta));
        return [...prev.slice(1), next];
      });
    }, updateInterval);
    return () => clearInterval(timer);
  }, [updateInterval]);

  const W = 120;
  const H = height;
  const vMax = Math.max(...data);
  const vMin = Math.min(...data);
  const range = vMax - vMin || 1;
  const pad = 3;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - pad - ((v - vMin) / range) * (H - pad * 2),
  }));

  const linePath = coords.reduce((acc, pt, i) => {
    if (i === 0) return `M${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    const prev = coords[i - 1];
    const mx = ((prev.x + pt.x) / 2).toFixed(1);
    return `${acc} C${mx},${prev.y.toFixed(1)} ${mx},${pt.y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }, '');

  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;
  const last = coords[coords.length - 1];

  return (
    <div className={`sparkline-wrapper ${className}`} style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="sparkline-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`spk-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#spk-${id})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r="3" fill={color} opacity="0.9" />
        <circle cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r="5.5" fill={color} opacity="0.2" />
      </svg>
    </div>
  );
}