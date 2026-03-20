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
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } },
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] text-gold-500 opacity-[0.05]"
              style={{ 
                translateX: parallaxOffset.x * 2, 
                translateY: parallaxOffset.y * 2 
              }}
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
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
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 10, ease: "linear" }}
              style={{
                background: "url('https://www.transparenttextures.com/patterns/black-paper.png')"
              }}
            />
            
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 1.3, filter: "blur(30px) brightness(3)" }}
              transition={{ duration: 2, ease: [0.6, 0.01, -0.05, 0.9] }}
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
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif tracking-widest gold-gradient-text gold-glow italic px-2 sm:px-4"
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
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif tracking-widest gold-gradient-text gold-glow italic px-2 sm:px-4"
                    delay={2.5}
                  />
                </div>
              </div>
              
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 3, duration: 2.5 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-12 mx-auto max-w-lg"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.5, duration: 1.5 }}
                className="mt-10"
              >
                <p className="text-white/40 text-[10px] md:text-xs tracking-[0.6em] uppercase font-light">
                  An Unforgettable Journey Begins
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="h-[1px] w-8 bg-gold-500/20" />
                  <span className="text-gold-500/60 font-serif text-lg tracking-widest uppercase">12.05.2026</span>
                  <div className="h-[1px] w-8 bg-gold-500/20" />
                </div>
              </motion.div>

              <AnimatePresence>
                {showButton && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="mt-12"
                  >
                    <button
                      onClick={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        setBurstPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                        setShowBurst(true);
                        
                        setTimeout(() => onFinish(), 500);
                      }}
                      className="group relative px-8 sm:px-10 py-3.5 sm:py-4 min-h-[48px] bg-transparent border border-gold-500/30 text-gold-500 font-serif tracking-[0.3em] sm:tracking-[0.4em] uppercase text-xs overflow-hidden transition-all duration-700 hover:border-gold-500"
                    >
                      <div className="absolute inset-0 bg-gold-500/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-700" />
                      <span className="relative z-10">Begin Experience</span>
                    </button>
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
