import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';
import FloatingPetals from './FloatingPetals';
import Hero from './Hero';
import EventsTimeline from './EventsTimeline';
import Venue from './Venue';
import Gallery from './Gallery';
import CelebrationTeam from './CelebrationTeam';
import BalAagrah from './BalAagrah';
import Presak from './Presak';
import RSVP from './RSVP';
import AdexPromoSection from './AdexPromoSection';
import AdexPopup from './AdexPopup';
import { useSettings } from '../context/SettingsContext';

/* ── Section divider ── */
const Divider = () => (
  <div className="flex items-center justify-center gap-4 py-2">
    <div className="gold-divider flex-1 max-w-xs opacity-30" />
    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/40" />
    <div className="gold-divider flex-1 max-w-xs opacity-30" />
  </div>
);

const PersonalizedGreeting = () => {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const nextRef = useRef(null);
  const cardRef = useRef(null);
  const { settings } = useSettings();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowXY, setGlowXY] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!guestId) return;
    (async () => {
      try {
        const res = await axios.get(`/api/guests/${guestId}`);
        setGuest(res.data);
        await axios.post('/api/guests/notify-open', { guestId });
      } catch {}
    })();
  }, [guestId]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -10,
      y: ((e.clientX - r.left) / r.width - 0.5) * 10,
    });
    setGlowXY({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlowXY({ x: 50, y: 50 });
  }, []);

  const { coupleNames, weddingDate, messages } = settings;

  return (
    <div style={{ background: 'var(--bg-0)' }}>

      {/* ═══ INVITATION HERO ═══ */}
      <div className="section-shell min-h-screen min-h-[100dvh] flex flex-col items-center justify-center py-16 px-4 sm:px-6 relative overflow-hidden animated-bg">
        <FloatingPetals count={18} />

        {/* Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            left: `${5 + Math.sin(i * 2.3) * 42 + 42}%`,
            top: `${5 + Math.cos(i * 1.8) * 36 + 36}%`,
            width: `${0.8 + (i % 3) * 0.7}px`,
            height: `${0.8 + (i % 3) * 0.7}px`,
            background: 'rgba(229,168,48,0.5)',
            animation: `twinkle ${2.5 + (i % 6)}s ease-in-out ${i * 0.35}s infinite`,
          }} />
        ))}

        {/* Ambient orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.05) 0%, transparent 70%)', animation: 'orb-pulse 9s ease-in-out infinite' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,134,14,0.04) 0%, transparent 70%)', animation: 'orb-pulse 12s ease-in-out 4s infinite' }} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)' }} />

        {/* 3D Invitation Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-3xl"
          style={{ perspective: '1200px' }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative"
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Card */}
            <div className="panel-luxe p-8 sm:p-12 md:p-14 lg:p-16">
              {/* Mouse glow */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: `radial-gradient(circle at ${glowXY.x}% ${glowXY.y}%, rgba(229,168,48,0.1) 0%, transparent 60%)`,
                transition: 'background 0.12s ease',
              }} />

              {/* Corner ornaments */}
              {['top-0 left-0 border-t border-l rounded-tl-2xl', 'top-0 right-0 border-t border-r rounded-tr-2xl',
                'bottom-0 left-0 border-b border-l rounded-bl-2xl', 'bottom-0 right-0 border-b border-r rounded-br-2xl'].map((cls, i) => (
                <div key={i} className={`absolute w-16 h-16 sm:w-20 sm:h-20 pointer-events-none border-yellow-400/20 ${cls}`} />
              ))}

              <div className="text-center relative z-10">
                {/* Atithi Devo Bhava */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="mb-10 flex flex-col items-center"
                >
                  <div className="eyebrow-chip mb-5">
                    <span className="section-label">A Personal Invitation</span>
                  </div>
                  <p
                    className="text-glow-gold text-yellow-300/90 mb-3"
                    style={{
                      fontFamily: "'Tangerine', cursive",
                      fontWeight: 700,
                      fontSize: 'clamp(2.8rem, 7vw, 4.5rem)',
                    }}
                  >
                    {messages.atithiDevoBhava}
                  </p>
                  <div className="gold-divider mx-auto" style={{ width: '80px' }} />
                </motion.div>

                {/* Guest name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mb-10 min-h-[80px] flex flex-col items-center justify-center"
                >
                  <h1
                    className="title-display gold-text-animate mb-4 leading-tight"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    }}
                  >
                    {guest ? `प्रिय ${guest.name} जी,` : 'Our Dear Guest,'}
                  </h1>
                  <div className="gold-divider mx-auto" style={{ width: '60px' }} />
                </motion.div>

                {/* Invitation text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 1 }}
                  className="mb-10 space-y-4 max-w-2xl mx-auto"
                >
                  <p
                    className="text-yellow-100/78 leading-relaxed italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
                  >
                    {guest?.family === 'Yes'
                      ? 'आपको सपरिवार सादर आमंत्रित किया जाता है'
                      : 'आपको सादर आमंत्रित किया जाता है'}
                  </p>
                  <p
                    className="body-copy"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
                  >
                    "{messages.invitation}"
                  </p>
                </motion.div>

                {/* Couple + Date */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 justify-center flex-wrap">
                    <div className="gold-divider flex-1 max-w-[60px] opacity-50" />
                    <p className="section-label text-[9px] sm:text-[10px]">
                      {coupleNames.groom} &nbsp;· &nbsp;{coupleNames.bride}
                    </p>
                    <div className="gold-divider flex-1 max-w-[60px] opacity-50" />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="metric-pill glow-gold"
                  >
                    <span
                      className="gold-text text-glow-gold font-bold tracking-[0.3em] uppercase"
                      style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem' }}
                    >
                      {weddingDate}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Discover */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4, duration: 1 }}
                  onClick={() => nextRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col items-center mx-auto mt-12 py-2"
                >
                  <span className="section-label mb-3 group-hover:text-yellow-300/80 transition-colors">
                    Discover the Celebration
                  </span>
                  <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-yellow-400/60 to-transparent group-hover:h-16 transition-all duration-500" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="text-center mt-8 italic tracking-[0.25em] text-yellow-100/30"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem' }}
          >
            {messages.bottomQuote}
          </motion.p>
        </motion.div>
      </div>

      {/* ═══ REST OF SECTIONS ═══ */}
      <div ref={nextRef}>
        <Hero />
        {settings.visibility?.events   !== false && <EventsTimeline />}
        {settings.visibility?.venue    !== false && <Venue />}
        {settings.visibility?.gallery  !== false && <Gallery />}
        {settings.visibility?.celebrationTeam !== false && <CelebrationTeam />}
        {settings.visibility?.baalAagrah !== false && <BalAagrah />}
        {settings.visibility?.preshak  !== false && <Presak />}
        {settings.visibility?.rsvp     !== false && <RSVP guestId={guestId} guest={guest} />}
        <AdexPromoSection />

        {/* FOOTER */}
        <footer className="section-shell relative py-20 text-center overflow-hidden"
          style={{ background: 'linear-gradient(180deg, var(--bg-0) 0%, #030306 100%)' }}>
          <div className="gold-divider mx-auto mb-10" style={{ width: '200px', opacity: 0.3 }} />
          <div className="section-inner relative z-10">
            <p
              className="title-display gold-text text-glow-gold mb-2"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}
            >
              {coupleNames.groom.split(' ')[0]} &amp; {coupleNames.bride.split(' ')[0]}
            </p>
            <p className="section-label mb-8" style={{ fontSize: '0.55rem' }}>
              Together Forever · {weddingDate.split(' ').pop()}
            </p>
            <div className="flex justify-center gap-8 sm:gap-12 mb-8">
              {[settings.contactNumbers.primary, settings.contactNumbers.secondary].map((n, i) => (
                <a key={i} href={`tel:${n}`}
                  className="text-yellow-400/60 hover:text-yellow-300 transition-colors tracking-widest"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}>
                  +91 {n}
                </a>
              ))}
            </div>
            <div className="gold-divider mx-auto mb-6" style={{ width: '80px', opacity: 0.2 }} />
            <p className="text-white/10 uppercase tracking-[0.2em]" style={{ fontSize: '0.5rem' }}>
              Crafted for a Cinematic Experience
            </p>
          </div>
        </footer>
      </div>

      <AdexPopup />
    </div>
  );
};

export default PersonalizedGreeting;
