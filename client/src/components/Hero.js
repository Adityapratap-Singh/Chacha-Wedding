import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import { useSettings } from '../context/SettingsContext';

const Hero = () => {
  const { settings } = useSettings();
  const { coupleNames, weddingDate, messages } = settings;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -6,
      y: ((e.clientX - r.left) / r.width - 0.5) * 6,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  /* Particles */
  const stars = Array.from({ length: 25 }, (_, i) => ({
    left: `${5 + Math.sin(i * 2.4) * 42 + 42}%`,
    top:  `${5 + Math.cos(i * 1.7) * 36 + 36}%`,
    size: 0.8 + (i % 3) * 0.6,
    dur:  3 + (i % 6),
    delay: i * 0.3,
  }));

  return (
    <section className="section-shell relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-12"
      style={{ background: 'linear-gradient(180deg, rgba(10,10,15,0.82) 0%, rgba(5,5,8,0.94) 100%)' }}>

      {/* Stars */}
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px`,
            background: 'rgba(229,168,48,0.5)', animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}

      {/* Ambient orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none sm:w-[600px] sm:h-[600px]"
        style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.065) 0%, transparent 65%)', animation: 'orb-pulse 10s ease-in-out infinite' }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] rounded-full pointer-events-none sm:w-[500px] sm:h-[500px]"
        style={{ background: 'radial-gradient(circle, rgba(200,134,14,0.04) 0%, transparent 65%)', animation: 'orb-pulse 14s ease-in-out 5s infinite' }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />

      {/* Content with 3D tilt */}
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="section-inner text-center w-full max-w-5xl"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div className="panel-luxe px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: -10, letterSpacing: '0.6em' }}
            whileInView={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            className="mb-8 inline-flex eyebrow-chip"
          >
            <span className="section-label">{messages.heroSubtitle}</span>
          </motion.div>

          <div className="mx-auto mb-10 max-w-4xl">
            <div className="flex flex-col items-center gap-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="title-display gold-text-animate text-glow-gold"
                style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}
              >
                {coupleNames.groom}
              </motion.h1>

              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8, type: 'spring', damping: 12 }}
                className="gold-text leading-none"
                style={{ fontFamily: "'Tangerine', cursive", fontWeight: 700, fontSize: 'clamp(3.4rem, 8vw, 5.6rem)' }}
              >
                &
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="title-display gold-text-animate text-glow-gold"
                style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}
              >
                {coupleNames.bride}
              </motion.h1>
            </div>
          </div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, delay: 1.8 }}
            className="gold-divider mx-auto mb-8"
            style={{ width: '180px', transformOrigin: 'center' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 2.2 }}
            className="space-y-5"
          >
            <h2
              className="text-yellow-100/75 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.35rem, 3vw, 2rem)' }}
            >
              {messages.saveTheDate}
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2.6 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <span className="metric-pill section-label">{weddingDate}</span>
              <span className="metric-pill section-label">RSVP +91 {settings.contactNumbers.primary}</span>
            </motion.div>

            <CountdownTimer />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="section-label" style={{ fontSize: '0.55rem' }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-yellow-400/60 to-transparent" />
      </motion.div>

      {/* Corner frames */}
      {[
        'top-6 left-6 sm:top-10 sm:left-10 border-t border-l rounded-tl-lg',
        'top-6 right-6 sm:top-10 sm:right-10 border-t border-r rounded-tr-lg',
        'bottom-6 left-6 sm:bottom-10 sm:left-10 border-b border-l rounded-bl-lg',
        'bottom-6 right-6 sm:bottom-10 sm:right-10 border-b border-r rounded-br-lg',
      ].map((cls, i) => (
        <div key={i} className={`absolute w-10 h-10 sm:w-14 sm:h-14 border-yellow-400/15 pointer-events-none ${cls}`} />
      ))}
    </section>
  );
};

export default Hero;
