import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Presak = () => {
  const { settings } = useSettings();
  const { preshak } = settings;

  return (
    <section className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      {/* Subtle Divider Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-theme-accent/20 to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-theme-title mb-2">
            प्रेषक
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-theme-accent to-transparent mx-auto mt-2"
          />
        </motion.div>

        {/* Profile Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="flex flex-col items-center"
        >
          {/* Circular Image Wrapper */}
          <div className="relative mb-6">
            {/* Soft Glow Background */}
            <div className="absolute inset-0 bg-theme-accent/10 blur-2xl rounded-full scale-110 pointer-events-none" />
            
            {/* Main Circular Profile Image */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-theme-secondary shadow-[0_15px_45px_rgba(var(--color-primary-rgb),0.12)] overflow-hidden bg-theme-secondary ring-1 ring-theme-accent/20"
            >
              <img
                src={preshak.image}
                alt={preshak.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Sender Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-theme-title tracking-wide drop-shadow-sm">
              {preshak.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-theme-accent/60 uppercase tracking-[0.4em] font-light mt-3">
              With Warm Regards
            </p>
          </motion.div>
        </motion.div>

        {/* Experience Quote Sentiment */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 font-serif italic text-xs sm:text-sm text-theme-text/60 tracking-widest max-w-xs sm:max-w-md"
        >
          "{preshak.quote}"
        </motion.p>

      </div>

      {/* Background Accent Textures */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-theme-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 -left-20 w-64 h-64 bg-theme-primary/5 rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
};

export default Presak;

