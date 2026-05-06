import { useState, useEffect, useRef } from 'react';

const COLOR_MAP = [
  'accent','cyan','success','accent','success','cyan',
  'accent','warning','cyan','success','accent','cyan',
  'success','accent','cyan','warning','success','accent',
  'cyan','accent','success','cyan','accent','success',
  'warning','cyan','accent','success','cyan','accent',
  'success','accent','cyan','warning','accent','cyan',
];

export function ServerLights({ rows = 3, cols = 12 }) {
  const count = rows * cols;
  const colors = useRef(COLOR_MAP.slice(0, count));

  const [states, setStates] = useState(() =>
    Array.from({ length: count }, () => Math.random() > 0.4)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setStates(prev => {
        const next = [...prev];
        const flips = 2 + Math.floor(Math.random() * 3);
        for (let f = 0; f < flips; f++) {
          const i = Math.floor(Math.random() * count);
          next[i] = Math.random() > 0.35;
        }
        return next;
      });
    }, 160);
    return () => clearInterval(id);
  }, [count]);

  return (
    <div
      className="server-lights"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      aria-hidden="true"
    >
      {states.map((on, i) => (
        <span
          key={i}
          className={`server-led ${on ? `led-on led-${colors.current[i]}` : 'led-off'}`}
        />
      ))}
    </div>
  );
}