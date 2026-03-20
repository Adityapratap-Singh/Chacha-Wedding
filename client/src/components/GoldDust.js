
import React from 'react';
import { motion } from 'framer-motion';

const GoldDust = ({ count = 30 }) => {
  const particles = Array.from({ length: count });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold-500 opacity-20 blur-[1px]"
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
              top: `${startY}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.4, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default GoldDust;
