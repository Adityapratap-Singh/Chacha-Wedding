import React from 'react';
import { motion } from 'framer-motion';
import GoldDust from './GoldDust';
import { useSettings } from '../context/SettingsContext';

const Mandala = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
    <path d="M100 20 L110 40 L130 40 L120 60 L130 80 L110 80 L100 100 L90 80 L70 80 L80 60 L70 40 L90 40 Z" stroke="currentColor" strokeWidth="0.5" />
    <path d="M100 10 L120 30 L150 30 L140 60 L160 90 L130 90 L120 120 L100 100 L80 120 L70 90 L40 90 L60 60 L50 30 L80 30 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
    <circle cx="100" cy="100" r="2" fill="currentColor" />
  </svg>
);

const EventsTimeline = () => {
  const { settings } = useSettings();
  const { events } = settings;

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#fdfbf7] relative overflow-hidden">
      <GoldDust count={15} />
      
      {/* Royal Mandala Background Elements */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] text-maroon-700 opacity-[0.02] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      >
        <Mandala className="w-full h-full" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] text-gold-500 opacity-[0.03] pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      >
        <Mandala className="w-full h-full" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gold-500 uppercase tracking-[0.4em] text-xs font-semibold block mb-3"
          >
            {settings.messages.eventsJourney}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-maroon-700 mb-2"
          >
            {settings.messages.eventsTitle}
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-xl sm:text-2xl md:text-3xl font-serif text-gray-700 mb-8"
          >
            {settings.messages.eventsSubtitle}
          </motion.h3>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "4rem", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" 
          />
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <motion.div 
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-gold-500/40 via-gold-500/20 to-transparent hidden md:block" 
          />

          <div className="space-y-10 sm:space-y-14 md:space-y-0">
            {events.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * index, ease: [0.34, 1.56, 0.64, 1] }}
                className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 sm:gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} mb-10 sm:mb-14`}
              >
                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                  className="w-full md:w-[45%] bg-white p-6 sm:p-7 md:p-8 rounded-sm shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-gray-100/50 hover:border-gold-500/40 hover:shadow-[0_12px_36px_rgba(255,215,0,0.08)] transition-all duration-500 group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">{event.icon}</span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-maroon-700 tracking-[0.02em]">{event.name}</h3>
                  </div>
                  
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: "100%", opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + 0.1 * index }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mb-4"
                  />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 pb-4 border-b border-gray-50/80">
                    <span className="text-sm font-semibold text-gray-900 tracking-[0.05em] uppercase">{event.date}</span>
                    <span className="text-xs text-gold-500 font-light tracking-[0.08em] uppercase">{event.time}</span>
                  </div>
                  
                  <p className="text-gray-600 font-serif italic text-base sm:text-lg leading-[1.8] tracking-[0.005em]">
                    {event.description}
                  </p>
                </motion.div>

                {/* Center Marker */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + 0.1 * index }}
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10"
                >
                  <motion.div 
                    whileHover={{ scale: 1.3, boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
                    className="w-4 h-4 rounded-full bg-white border-[2.5px] border-gold-500 shadow-[0_0_12px_rgba(255,215,0,0.4)] transition-all"
                  />
                </motion.div>

                {/* Spacer for empty side */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsTimeline;

