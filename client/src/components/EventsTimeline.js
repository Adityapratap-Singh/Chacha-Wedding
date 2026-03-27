import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const EventsTimeline = () => {
  const { settings } = useSettings();
  const { events } = settings;

  return (
    <section
      className="section-shell relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-0) 0%, var(--bg-2) 50%, var(--bg-0) 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.04) 0%, transparent 70%)', animation: 'orb-pulse 10s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,134,14,0.04) 0%, transparent 70%)', animation: 'orb-pulse 13s ease-in-out 4s infinite' }} />

      <div className="section-inner max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label block mb-5"
          >
            <span className="eyebrow-chip">{settings.messages.eventsJourney}</span>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 1 }}
            className="gold-text text-glow-gold italic mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            }}
          >
            {settings.messages.eventsTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-yellow-300/50"
            style={{ fontFamily: "'Tangerine', cursive", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            {settings.messages.eventsSubtitle}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="gold-divider mx-auto mt-5"
            style={{ width: '80px', transformOrigin: 'center' }}
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute left-1/2 -translate-x-1/2 w-px h-full hidden md:block"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(229,168,48,0.3) 20%, rgba(229,168,48,0.3) 80%, transparent)',
              transformOrigin: 'top',
            }}
          />

          <div className="space-y-10 sm:space-y-14 md:space-y-0">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row items-stretch md:items-center gap-6 mb-12 sm:mb-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Event card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="w-full md:w-[45%] panel-luxe p-6 sm:p-8 relative overflow-hidden group shimmer-sweep"
                >
                  {/* Gold top bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 select-none flex-shrink-0"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(229,168,48,0.4))' }}>
                      {event.icon}
                    </span>
                    <div>
                      <h3
                        className="text-yellow-100/90 group-hover:text-yellow-200 transition-colors"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', fontStyle: 'italic' }}
                      >
                        {event.name}
                      </h3>
                      <div className="flex gap-3 mt-1 flex-wrap">
                        <span className="section-label text-[9px]">{event.date}</span>
                        <span className="text-yellow-400/40 text-[9px] font-light">{event.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="gold-divider mb-4 opacity-30" />

                  <p className="text-yellow-100/55 italic leading-relaxed"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>
                    {event.description}
                  </p>
                </motion.div>

                {/* Timeline node */}
                <div className="hidden md:flex flex-col items-center z-10 w-[10%]">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.5 }}
                    className="w-4 h-4 rounded-full glow-gold"
                    style={{ background: 'linear-gradient(135deg, #c8860e, #fde68a)', border: '2px solid rgba(229,168,48,0.5)' }}
                  />
                </div>

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
