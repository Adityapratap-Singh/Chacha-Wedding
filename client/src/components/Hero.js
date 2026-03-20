import React from 'react';
import { motion } from 'framer-motion';
import GoldDust from './GoldDust';
import AnimatedText from './AnimatedText';

const Mandala = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
    <path d="M100 20 L110 40 L130 40 L120 60 L130 80 L110 80 L100 100 L90 80 L70 80 L80 60 L70 40 L90 40 Z" stroke="currentColor" strokeWidth="0.5" />
    <path d="M100 10 L120 30 L150 30 L140 60 L160 90 L130 90 L120 120 L100 100 L80 120 L70 90 L40 90 L60 60 L50 30 L80 30 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
    <circle cx="100" cy="100" r="2" fill="currentColor" />
  </svg>
);

const Hero = () => {

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
    <section className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-royal-maroon">
      <GoldDust count={40} />
      
      {/* Royal Mandala - smaller on mobile */}
      <motion.div 
        className="absolute top-[-10%] right-[-5%] w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] text-gold-500 opacity-[0.08] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      >
        <Mandala className="w-full h-full" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[-15%] left-[-10%] w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] text-gold-500 opacity-[0.05] pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
      >
        <Mandala className="w-full h-full" />
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

      {/* Content with Parallax */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="z-10 text-center px-4 sm:px-6 w-full max-w-[95vw]"
      >
        <div className="flex flex-col items-center">
          <AnimatedText 
            text="The Celebration of Love"
            className="text-sm sm:text-base md:text-lg lg:text-xl font-serif tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/60 mb-6 sm:mb-8"
            delay={0.5}
          />
          <div className="flex flex-col items-center justify-center gap-y-4">
            <AnimatedText 
              text="Pushpendra (Lalla Bhaiya)" 
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
              text="Renu" 
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
          
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white/90 italic tracking-wide">
              Save the Date
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-8 bg-gold-500/20" />
              <span className="text-gold-500/60 font-serif text-lg tracking-widest uppercase">12.05.2026</span>
              <div className="h-[1px] w-8 bg-gold-500/20" />
            </div>
          </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-[10px] uppercase tracking-widest">Discover More</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold-500/80 to-transparent" />
      </motion.div>

      {/* Corner Ornaments - smaller on mobile */}
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 border-t-2 border-l-2 border-gold-500/20 pointer-events-none rounded-tl-lg" />
      <div className="absolute top-4 right-4 sm:top-10 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 border-t-2 border-r-2 border-gold-500/20 pointer-events-none rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 border-b-2 border-l-2 border-gold-500/20 pointer-events-none rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 border-b-2 border-r-2 border-gold-500/20 pointer-events-none rounded-br-lg" />
    </section>
  );
};

export default Hero;
