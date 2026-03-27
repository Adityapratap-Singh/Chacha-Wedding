import React from 'react';
import { motion } from 'framer-motion';

const AdexPromoSection = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const WHATSAPP_URL = `https://wa.me/917355259901?text=${encodeURIComponent(`I want a wedding website like this 😍\n\nLink: ${currentUrl}`)}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="section-shell relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-0) 0%, var(--bg-2) 50%, var(--bg-0) 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(229,168,48,0.06) 0%, transparent 70%)' }} />

      {/* Twinkling stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${5 + Math.sin(i * 2.5) * 42 + 42}%`,
            top: `${5 + Math.cos(i * 1.9) * 36 + 36}%`,
            width: `${0.8 + (i % 3) * 0.5}px`, height: `${0.8 + (i % 3) * 0.5}px`,
            background: 'rgba(229,168,48,0.45)',
            animation: `twinkle ${2.5 + (i % 6)}s ease-in-out ${i * 0.3}s infinite`,
          }} />
      ))}

      <div className="section-inner relative z-10 max-w-3xl mx-auto text-center">
        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-label block mb-6"
        >
          <span className="eyebrow-chip">Crafted with Love · By Adex</span>
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="gold-divider mx-auto mb-10"
          style={{ width: '100px', transformOrigin: 'center' }}
        />

        {/* Heading */}
        <div className="panel-luxe px-6 py-10 sm:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="gold-text text-glow-gold italic mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          }}
        >
          A New Way to Invite
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-yellow-100/65 italic leading-relaxed mb-8 sm:mb-10"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}
        >
          Yeh sirf invitation nahi hai…
          <br />
          <span className="text-yellow-300/80">yeh ek cinematic experience hai 💍</span>
        </motion.p>

        {/* CTA */}
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          whileHover={{ y: -4, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="btn-luxury inline-flex items-center gap-3 px-12 sm:px-16 py-4 rounded-full ring-glow"
        >
          Create Yours
          <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
        </motion.a>

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="gold-divider mx-auto mt-14"
          style={{ width: '80px', transformOrigin: 'center', opacity: 0.4 }}
        />
        </div>
      </div>
    </motion.section>
  );
};

export default AdexPromoSection;
