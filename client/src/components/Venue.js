import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Venue = () => {
  const { settings } = useSettings();
  const { venue } = settings;

  return (
    <section
      className="section-shell relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg-0) 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.045) 0%, transparent 65%)', animation: 'orb-pulse 12s ease-in-out infinite' }} />

      <div className="section-inner max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-18">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label block mb-5"
          >
            <span className="eyebrow-chip">Venue</span>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 1 }}
            className="gold-text text-glow-gold italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {settings.messages.venueTitle}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="gold-divider mx-auto mt-5"
            style={{ width: '80px', transformOrigin: 'center' }}
          />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -5 }}
          className="panel-luxe p-8 sm:p-12 md:p-14 text-center relative overflow-hidden group shimmer-sweep"
        >
          {/* Gold top line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(229,168,48,0.6), transparent)', transformOrigin: 'left' }}
          />

          {/* Corner frames */}
          {['top-4 left-4 border-t border-l', 'top-4 right-4 border-t border-r',
            'bottom-4 left-4 border-b border-l', 'bottom-4 right-4 border-b border-r'].map((cls, i) => (
            <div key={i} className={`absolute w-8 h-8 sm:w-10 sm:h-10 border-yellow-400/15 pointer-events-none ${cls} ${i < 2 ? 'rounded-t' : 'rounded-b'}${i % 2 === 0 ? 'l' : 'r'}-lg`} />
          ))}

          <div className="relative z-10">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-yellow-100/90 italic mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}
            >
              {venue.name}
            </motion.h3>

            <div className="gold-divider mx-auto mb-6" style={{ width: '60px', opacity: 0.4 }} />

            <p
              className="body-copy italic mb-10"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}
            >
              {venue.address}
            </p>

            {/* Map button */}
            <motion.a
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury relative inline-flex items-center gap-3 px-10 sm:px-14 py-4 rounded-full ring-glow"
            >
              <MapPin size={16} />
              {settings.messages.viewOnMap}
            </motion.a>

            {venue.transportInfo && (
              <p className="mt-8 text-yellow-100/35 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem' }}>
                {venue.transportInfo}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Venue;
