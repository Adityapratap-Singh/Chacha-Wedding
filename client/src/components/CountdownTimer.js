import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const CountdownTimer = () => {
  const { settings } = useSettings();
  const weddingDateStr = settings?.weddingDate;

  const getTimeLeft = () => {
    const target = new Date('2026-05-12T00:00:00');
    const diff = target - new Date();
    if (diff <= 0) return null;
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) {
    return (
      <p className="text-yellow-300/70 italic mt-3"
        style={{ fontFamily: "'Tangerine', cursive", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
        ✨ The celebration has begun!
      </p>
    );
  }

  const units = [
    { label: 'Days',    value: timeLeft.days },
    { label: 'Hours',   value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5"
    >
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="flex flex-col items-center">
            <div
              className="panel-soft px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[72px] text-center"
            >
              <span
                className="gold-text text-glow-gold font-bold block"
                style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', lineHeight: 1 }}
              >
                {String(u.value).padStart(2, '0')}
              </span>
            </div>
            <span className="section-label mt-1.5 text-[7px] sm:text-[8px] tracking-[0.18em]">{u.label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-yellow-400/30 text-xl mb-5 font-light">·</span>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default CountdownTimer;
