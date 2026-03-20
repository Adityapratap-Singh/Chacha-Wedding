import React from 'react';
import { motion } from 'framer-motion';
import GoldDust from './GoldDust';

const Mandala = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
    <path d="M100 20 L110 40 L130 40 L120 60 L130 80 L110 80 L100 100 L90 80 L70 80 L80 60 L70 40 L90 40 Z" stroke="currentColor" strokeWidth="0.5" />
    <path d="M100 10 L120 30 L150 30 L140 60 L160 90 L130 90 L120 120 L100 100 L80 120 L70 90 L40 90 L60 60 L50 30 L80 30 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
    <circle cx="100" cy="100" r="2" fill="currentColor" />
  </svg>
);

const events = [
  { 
    name: 'Haldi', 
    date: '10 May 2026', 
    time: '10:00 AM', 
    description: 'A ceremony of vibrant colors and joyous beginnings.',
    icon: '✨'
  },
  { 
    name: 'Sangeet', 
    date: '11 May 2026', 
    time: '07:00 PM', 
    description: 'An evening of music, dance, and celebration.',
    icon: '🎵'
  },
  { 
    name: 'Wedding', 
    date: '12 May 2026', 
    time: '08:00 PM', 
    description: 'The sacred union under the stars.',
    icon: '💍'
  },
  { 
    name: 'Reception', 
    date: '13 May 2026', 
    time: '07:30 PM', 
    description: 'A formal dinner to celebrate our new journey.',
    icon: '🥂'
  },
];

const EventsTimeline = () => {
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
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gold-500 uppercase tracking-[0.4em] text-xs font-semibold block mb-4"
          >
            The Journey
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900"
          >
            Wedding Events
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-[2px] bg-gold-500 mx-auto mt-6" 
          />
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-gold-500/30 to-transparent hidden md:block" />

          <div className="space-y-8 sm:space-y-12 md:space-y-16 md:space-y-0">
            {events.map((event, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} mb-8 sm:mb-12`}>
                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-full md:w-[45%] bg-white p-5 sm:p-6 md:p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-gold-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">{event.icon}</span>
                    <h3 className="text-xl sm:text-2xl font-serif text-maroon-700">{event.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                    <span className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{event.date}</span>
                    <span className="text-xs text-gold-500 font-light tracking-widest uppercase">{event.time}</span>
                  </div>
                  <p className="text-gray-600 font-serif italic text-base sm:text-lg leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>

                {/* Center Marker */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-gold-500 shadow-[0_0_10px_rgba(255,215,0,0.3)] group-hover:scale-125 transition-transform" />
                </div>

                {/* Spacer for empty side */}
                <div className="hidden md:block w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsTimeline;
