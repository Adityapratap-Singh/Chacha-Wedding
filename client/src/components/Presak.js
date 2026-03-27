import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Presak = () => {
  const { settings } = useSettings();
  const { preshak } = settings;

  return (
    <section
      className="section-shell relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 50%, var(--bg-0) 100%)' }}
    >
      {/* Ambient glow centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.06) 0%, transparent 65%)', animation: 'orb-pulse 10s ease-in-out infinite' }} />

      <div className="section-inner relative z-10 max-w-5xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="mb-5 inline-flex eyebrow-chip">
            <p className="section-label">With Warm Regards</p>
          </div>
          <h2
            className="gold-text text-glow-gold italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
          >
            प्रेषक
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="gold-divider mx-auto mt-4"
            style={{ width: '70px', transformOrigin: 'center' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="panel-luxe p-6 sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className="absolute inset-[-12px] rounded-[2rem]"
                  style={{
                    border: '1px solid rgba(229,168,48,0.2)',
                    animation: 'ring-rotate 16s linear infinite',
                  }}
                />
                <div
                  className="absolute inset-[-18px] rounded-[2.3rem]"
                  style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.1) 0%, transparent 68%)' }}
                />

                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="relative w-[220px] h-[260px] sm:w-[260px] sm:h-[320px] rounded-[2rem] overflow-hidden glow-gold"
                  style={{
                    border: '1px solid rgba(229,168,48,0.3)',
                    boxShadow: '0 26px 70px rgba(0,0,0,0.48)',
                  }}
                >
                  <img
                    src={preshak.image}
                    alt={preshak.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </motion.div>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="section-label mb-4">प्रेषक</p>
              <h3
                className="title-display gold-text text-glow-gold mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                {preshak.name}
              </h3>
              <p
                className="body-copy mx-auto lg:mx-0 max-w-xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.05rem, 2vw, 1.28rem)' }}
              >
                With folded hands and warm affection, this invitation is sent as a personal gesture from the heart of the family.
              </p>

              <div className="gold-divider my-6 mx-auto lg:mx-0" style={{ width: '120px' }} />

              {preshak.quote && (
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="panel-soft px-5 py-5 italic leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(255,248,231,0.76)', fontSize: 'clamp(1.05rem, 2vw, 1.22rem)' }}
                >
                  "{preshak.quote}"
                </motion.blockquote>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Presak;
