import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import GaneshaIntro from './GaneshaIntro';

/* ── Particle field ── */
const Particles = ({ count = 60 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.8 + Math.random() * 2.2,
    delay: Math.random() * 6,
    dur: 3 + Math.random() * 5,
    opacity: 0.1 + Math.random() * 0.6,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: i % 4 === 0
              ? `rgba(253, 230, 138, ${p.opacity})`
              : i % 4 === 1
                ? `rgba(229, 168, 48, ${p.opacity * 0.7})`
                : i % 4 === 2
                  ? `rgba(255, 255, 220, ${p.opacity * 0.5})`
                  : `rgba(200, 134, 14, ${p.opacity * 0.4})`,
            animation: `twinkle ${p.dur}s ease-in-out ${p.delay}s infinite`,
            filter: p.size > 1.5 ? 'blur(0.5px)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

/* ── Gold burst on click ── */
const GoldBurst = ({ position }) => (
  <div className="absolute inset-0 pointer-events-none z-50" style={{ left: position.x, top: position.y }}>
    {Array.from({ length: 70 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${1.5 + Math.random() * 3}px`,
          height: `${1.5 + Math.random() * 3}px`,
          background: ['#fde68a', '#e5a830', '#fff8e7', '#c8860e'][i % 4],
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 600, scale: [1, 0], opacity: [1, 0] }}
        transition={{ delay: Math.random() * 0.1, duration: 1 + Math.random() * 0.8, ease: 'easeOut' }}
      />
    ))}
  </div>
);

/* ── Cinematic horizontal lines ── */
const ScanLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-full"
        style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, rgba(229,168,48,${0.04 + i * 0.02}), transparent)`,
          top: `${25 + i * 25}%`,
          animation: `scanline ${8 + i * 3}s linear ${i * 2}s infinite`,
          opacity: 0.3,
        }}
      />
    ))}
  </div>
);

const CinematicEntry = ({ onFinish }) => {
  const [guest, setGuest] = useState(null);
  const [showGanesha, setShowGanesha] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [parallax, setParallax]  = useState({ x: 0, y: 0 });
  const [burst, setBurst]        = useState(null);
  const rafRef = useRef(null);

  useEffect(() => {
    (async () => {
      const m = window.location.pathname.match(/\/invite\/(.+)/);
      if (m) {
        try { const r = await axios.get(`/api/guests/${m[1]}`); setGuest(r.data); } catch {}
      }
    })();
    const t1 = setTimeout(() => setShowGanesha(false), 5500);
    const t2 = setTimeout(() => setShowButton(true), 9800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleMouse = (e) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setParallax({
        x: (e.clientX / window.innerWidth - 0.5) * 22,
        y: (e.clientY / window.innerHeight - 0.5) * 22,
      });
    });
  };

  const groom = 'Pushpendra Kumar Singh';
  const bride = 'Rinu Singh';
  const welcome = guest
    ? `Your exclusive invitation, ${guest.honorific !== 'None' ? guest.honorific + ' ' : ''}${guest.name}`
    : 'You are cordially invited to witness';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center animated-bg"
      onMouseMove={handleMouse}
    >
      <AnimatePresence mode="wait">
        {showGanesha ? (
          <GaneshaIntro key="ganesha" />
        ) : (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(18px)' }}
            transition={{ duration: 1 }}
            className="w-full h-full relative flex items-center justify-center"
          >
            <Particles count={70} />
            <ScanLines />

            {/* Huge ambient orbs */}
            <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.07) 0%, transparent 65%)', animation: 'orb-pulse 8s ease-in-out infinite' }} />
            <div className="absolute bottom-[-20%] right-[-15%] w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(200,134,14,0.05) 0%, transparent 65%)', animation: 'orb-pulse 11s ease-in-out 3s infinite' }} />

            {/* Vignette overlay */}
            <div className="absolute inset-0 pointer-events-none z-10"
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)' }} />

            {/* Burst */}
            {burst && <GoldBurst position={burst} />}

            {/* Main content */}
            <motion.div
              className="relative z-20 text-center px-6 max-w-[92vw] mx-auto"
              style={{ translateX: parallax.x, translateY: parallax.y, transition: 'translate 0.08s linear' }}
            >
              {/* Welcome line */}
              <motion.p
                initial={{ opacity: 0, y: -20, letterSpacing: '0.6em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0.22em' }}
                transition={{ delay: 0.6, duration: 1.4 }}
                className="section-label mb-8 sm:mb-10 block text-[10px] sm:text-xs"
              >
                {welcome}
              </motion.p>

              {/* Horizontal gold rule */}
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 1.2 }}
                className="gold-divider mx-auto mb-8 sm:mb-10"
                style={{ width: '120px', transformOrigin: 'center' }}
              />

              {/* Groom name */}
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                transition={{ delay: 1.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="gold-text-animate text-glow-gold block"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.2rem, 7vw, 6rem)',
                  lineHeight: 1.1,
                  letterSpacing: '0.04em',
                }}
              >
                {groom}
              </motion.h1>

              {/* Ampersand */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, duration: 0.8, type: 'spring', damping: 14 }}
                className="my-3 sm:my-4"
              >
                <span
                  className="gold-text block leading-none"
                  style={{ fontFamily: "'Tangerine', cursive", fontWeight: 700, fontSize: 'clamp(3rem, 8vw, 6rem)' }}
                >
                  &amp;
                </span>
              </motion.div>

              {/* Bride name */}
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                transition={{ delay: 2.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="gold-text-animate text-glow-gold block"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.2rem, 7vw, 6rem)',
                  lineHeight: 1.1,
                  letterSpacing: '0.04em',
                }}
              >
                {bride}
              </motion.h1>

              {/* Gold rule */}
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 3.5, duration: 1.5 }}
                className="gold-divider mx-auto mt-8 sm:mt-10 mb-6"
                style={{ width: '180px', transformOrigin: 'center' }}
              />

              {/* Date */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 4.2, duration: 1 }}
                style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.4em', fontSize: '0.7rem', color: 'rgba(229,168,48,0.65)' }}
                className="uppercase mb-1"
              >
                12 · May · 2026
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 4.5, duration: 1 }}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 200, letterSpacing: '0.25em', fontSize: '0.55rem', color: 'rgba(240,230,208,0.35)' }}
                className="uppercase"
              >
                An Unforgettable Celebration
              </motion.p>

              {/* Begin button */}
              <AnimatePresence>
                {showButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-12 sm:mt-14"
                  >
                    <motion.button
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
                        setTimeout(onFinish, 900);
                      }}
                      className="btn-luxury relative px-12 sm:px-16 py-4 sm:py-5 rounded-full ring-glow"
                    >
                      Begin Your Invitation
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinematicEntry;
