import React from 'react';
import { motion } from 'framer-motion';

const GaneshOpening = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="py-16 bg-theme-secondary flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
           style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />

      {/* Optional small Ganesh icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <span className="text-4xl">🛕</span>
      </motion.div>

      {/* Main text with gold gradient and glow */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
        className="text-4xl md:text-5xl lg:text-6xl font-serif text-center leading-tight"
        style={{
          background: 'linear-gradient(45deg, var(--color-accent), #FFA500, var(--color-accent))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(var(--color-accent-rgb), 0.5), 0 0 40px rgba(var(--color-accent-rgb), 0.3)',
          filter: 'drop-shadow(0 0 10px rgba(var(--color-accent-rgb), 0.2))'
        }}
      >
        श्री गणेशाय नमः
      </motion.h1>

      {/* Decorative line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
        className="h-[2px] bg-gradient-to-r from-transparent via-theme-accent to-transparent mt-8 mx-auto"
      />
    </motion.section>
  );
};

export default GaneshOpening;