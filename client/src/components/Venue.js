import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Venue = () => {
  const { settings } = useSettings();
  const { venue } = settings;

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-theme-bg relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-14 sm:mb-16 md:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-theme-accent uppercase tracking-[0.4em] text-xs font-semibold block mb-3"
          >
            Location
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-theme-title"
          >
            {settings.messages.venueTitle}
          </motion.h2>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "4rem", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.35 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-theme-accent to-transparent mx-auto mt-6" 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative bg-theme-secondary/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 lg:p-14 text-center border border-theme-accent/10 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_48px_rgba(var(--color-accent-rgb),0.08)] transition-all duration-500 overflow-hidden group rounded-sm"
        >
          {/* Animated Top Border */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            style={{ transformOrigin: "left" }}
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-theme-accent/60 to-transparent"
          />
          
          <div className="relative z-10">
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl font-serif text-theme-title mb-5 sm:mb-6 tracking-[0.02em]"
            >
              {venue.name}
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-2 sm:space-y-3 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-white/10"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-theme-title font-serif italic tracking-[0.01em]">{venue.address}</p>
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "60px", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-theme-accent/40 to-transparent mx-auto"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative min-h-[52px] px-10 sm:px-16 py-4 rounded-full uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold overflow-hidden flex items-center justify-center shadow-[0_15px_35px_rgba(var(--color-primary-rgb),0.25)] hover:shadow-[0_20px_45px_rgba(var(--color-primary-rgb),0.35)] transition-all duration-500"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-theme-primary via-maroon-800 to-theme-primary group-hover/btn:from-maroon-800 group-hover/btn:to-maroon-700 transition-all duration-500" />
                
                {/* Golden Sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                
                {/* Animated Border */}
                <div className="absolute inset-0 border border-gold-500/30 rounded-full group-hover/btn:border-gold-400 transition-colors duration-500" />
                
                {/* Text */}
                <span className="relative z-10 text-gold-500 flex items-center gap-3">
                  <MapPin size={16} />
                  {settings.messages.viewOnMap}
                </span>
              </motion.a>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-theme-text/60 font-serif italic text-sm tracking-[0.01em]"
              >
                {venue.transportInfo}
              </motion.p>
            </motion.div>
          </div>

          {/* Animated Corner Accent */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-tl from-theme-accent/8 to-transparent rounded-full blur-3xl group-hover:from-theme-accent/12 transition-all duration-500"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 1 }}
            className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-theme-accent/5 to-transparent rounded-full blur-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Venue;

