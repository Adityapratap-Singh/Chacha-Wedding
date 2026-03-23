import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import GoldDust from './GoldDust';
import AnimatedText from './AnimatedText';
import GaneshaIntro from './GaneshaIntro';

const Mandala = ({ className, analyser }) => {
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0.05);

  useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);

      const bass = dataArray.slice(0, 10).reduce((a, b) => a + b) / 10;
      const normalizedBass = bass / 255;

      const newScale = 1 + normalizedBass * 0.1;
      const newOpacity = 0.05 + normalizedBass * 0.05;

      setScale(newScale);
      setOpacity(newOpacity);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [analyser]);
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: `scale(${scale})`, opacity }}>
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M100 20 L110 40 L130 40 L120 60 L130 80 L110 80 L100 100 L90 80 L70 80 L80 60 L70 40 L90 40 Z" stroke="currentColor" strokeWidth="0.5" />
      <path d="M100 10 L120 30 L150 30 L140 60 L160 90 L130 90 L120 120 L100 100 L80 120 L70 90 L40 90 L60 60 L50 30 L80 30 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
      <circle cx="100" cy="100" r="2" fill="currentColor" />
    </svg>
  );
};

const ParticleBurst = ({ position }) => {
  const particles = Array.from({ length: 50 });

  return (
    <div className="absolute inset-0 pointer-events-none z-50" style={{ left: position.x, top: position.y }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold-500 rounded-full"
          style={{ width: `${2 + Math.random() * 2}px`, height: `${2 + Math.random() * 2}px` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 600,
            scale: [1, 0],
            opacity: [1, 0],
          }}
          transition={{
            delay: Math.random() * 0.2,
            duration: 1 + Math.random(),
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

const CinematicEntry = ({ onFinish }) => {
  const [guest, setGuest] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [showGanesha, setShowGanesha] = useState(true);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [showBurst, setShowBurst] = useState(false);
  const [burstPosition, setBurstPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchGuest = async () => {
      const path = window.location.pathname;
      const match = path.match(/\/invite\/(.+)/);
      if (match && match[1]) {
        try {
          const res = await axios.get(`/api/guests/${match[1]}`);
          setGuest(res.data);
        } catch (err) {
          console.error('Error fetching guest for loader:', err);
        }
      }
    };
    fetchGuest();

    const ganeshaTimer = setTimeout(() => {
      setShowGanesha(false);
    }, 6000);

    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 10500); // 6000 (ganesha) + 4500 (original delay)

    return () => {
      clearTimeout(ganeshaTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const coupleNames = {
    bride: "Renu Singh",
    groom: "Pushpendra Kumar Singh"
  };

  const welcomeText = guest 
    ? `Welcome <u>${guest.honorific !== 'None' ? guest.honorific : ''}</u> <u>${guest.name}</u> TO THE WEDDING OF`
    : "Welcome to the Wedding of";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.8, 
        ease: [0.34, 1.56, 0.64, 1]
      } 
    },
  };

  return (
    <div 
      className="fixed inset-0 bg-royal-maroon flex items-center justify-center z-50 overflow-hidden"
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        setParallaxOffset({ x, y });
      }}
    >
      <AnimatePresence mode="wait">
        {showGanesha ? (
          <GaneshaIntro key="ganesha" />
        ) : (
          <motion.div
            key="cinematic"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            <GoldDust count={60} />

            {showBurst && <ParticleBurst position={burstPosition} />}
            {showBurst && (
              <motion.div
                className="absolute inset-0 bg-gold-500 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 0], transition: { duration: 0.7 } }}
              />
            )}
            
            {/* Background Mandala - smaller on mobile */}
            <motion.div
              className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] text-gold-500 opacity-[0.08]"
              style={{ 
                translateX: parallaxOffset.x * 2, 
                translateY: parallaxOffset.y * 2,
                filter: "drop-shadow(0 0 30px rgba(255, 215, 0, 0.1))"
              }}
              animate={{ 
                rotate: 360,
                scale: [1, 1.08, 1],
              }}
              transition={{ 
                rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                scale: { duration: 25, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Mandala className="w-full h-full" analyser={null} />
            </motion.div>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 z-1 pointer-events-none">
              <div className="absolute inset-0 bg-noise opacity-[0.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
            </div>

            <motion.div 
              className="absolute inset-0 opacity-10"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.12 }}
              transition={{ duration: 12, ease: "easeInOut" }}
              style={{
                background: "url('https://www.transparenttextures.com/patterns/black-paper.png')"
              }}
            />
            
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 1.2, filter: "blur(20px) brightness(2)" }}
              transition={{ duration: 2.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center px-4 sm:px-6 relative z-10 w-full max-w-[95vw]"
              style={{
                translateX: parallaxOffset.x,
                translateY: parallaxOffset.y
              }}
            >
              <div className="flex flex-col items-center">
                <AnimatedText 
                  text={welcomeText}
                  className="text-sm sm:text-base md:text-lg lg:text-xl font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/60 mb-8 sm:mb-12"
                  delay={0.5}
                />
                <div className="flex flex-col items-center justify-center gap-y-4">
                  <AnimatedText 
                    text={coupleNames.groom} 
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif tracking-widest gold-gradient-text gold-glow italic px-2 sm:px-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                    delay={1.5}
                  />
                  <motion.span 
                    variants={item}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif gold-gradient-text gold-glow italic"
                  >
                    &
                  </motion.span>
                  <AnimatedText 
                    text={coupleNames.bride} 
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif tracking-widest gold-gradient-text gold-glow italic px-2 sm:px-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                    delay={2.5}
                  />
                </div>
              </div>
              
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 3.2, duration: 2.2, ease: "easeInOut" }}
                className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-12 mx-auto max-w-lg shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.7, duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="mt-10"
              >
                <p className="text-white/40 text-[10px] md:text-xs tracking-[0.6em] uppercase font-light drop-shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                  An Unforgettable Journey Begins
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="h-[1px] w-8 bg-gold-500/20" />
                  <span className="text-gold-500/60 font-serif text-lg tracking-widest uppercase drop-shadow-[0_0_12px_rgba(255,215,0,0.2)]">12.05.2026</span>
                  <div className="h-[1px] w-8 bg-gold-500/20" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showButton && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 5.2, duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="mt-12"
                  >
                    <motion.button
                      onClick={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        setBurstPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                        setShowBurst(true);
                        
                        setTimeout(() => onFinish(), 500);
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative px-10 sm:px-14 py-4 sm:py-5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-royal-maroon font-serif tracking-[0.4em] sm:tracking-[0.5em] uppercase text-[10px] sm:text-xs font-bold overflow-hidden transition-all duration-500 rounded-full shadow-[0_10px_30px_rgba(218,165,32,0.3)] hover:shadow-[0_15px_40px_rgba(218,165,32,0.5)] border border-gold-300/50"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      <span className="relative z-10 drop-shadow-sm">Begin Experience</span>
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
