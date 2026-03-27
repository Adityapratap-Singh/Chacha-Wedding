import React, { useMemo } from 'react';

const PETAL_SHAPES = ['🌸', '🌺', '✿', '❀', '🌼', '✦', '❋'];

const FloatingPetals = ({ count = 16 }) => {
  const petals = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    emoji: PETAL_SHAPES[i % PETAL_SHAPES.length],
    size: 0.7 + Math.random() * 0.8,
    delay: Math.random() * 20,
    dur: 18 + Math.random() * 20,
    anim: `petal-fall-${(i % 3) + 1}`,
    opacity: 0.12 + Math.random() * 0.2,
    blur: Math.random() > 0.65 ? '0.5px' : '0',
  })), [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p, i) => (
        <div
          key={i}
          className="absolute select-none"
          style={{
            left: p.left,
            top: 0,
            fontSize: `${p.size}rem`,
            opacity: p.opacity,
            animation: `${p.anim} ${p.dur}s ease-in ${p.delay}s infinite`,
            filter: p.blur !== '0' ? `blur(${p.blur})` : undefined,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingPetals;
