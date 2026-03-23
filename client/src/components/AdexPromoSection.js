import React from 'react';
import { motion } from 'framer-motion';

const WHATSAPP_URL = 'https://wa.me/917355259901?text=I want a wedding website like this 😍';

const AdexPromoSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-theme-bg"
    >
      {/* Subtle ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(var(--color-accent-rgb),0.06) 0%, transparent 70%)'
        }}
      />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Small line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-theme-text/60 font-serif italic text-sm tracking-widest mb-6"
        >
          Crafted with Love ✨
        </motion.p>

        {/* Gold gradient divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="h-[1px] w-32 mx-auto mb-10 origin-center"
          style={{
            background: 'linear-gradient(to right, transparent, var(--color-accent), var(--color-secondary), var(--color-accent), transparent)'
          }}
        />

        {/* Heading - gold gradient with subtle glow */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 sm:mb-8 gold-gradient-text"
          style={{
            textShadow: '0 0 30px rgba(var(--color-accent-rgb), 0.15), 0 0 60px rgba(var(--color-accent-rgb), 0.08)'
          }}
        >
          A New Way to Invite
        </motion.h2>

        {/* Description - Hinglish, premium tone */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-theme-text/80 font-serif text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto italic px-2"
        >
          Yeh sirf invitation nahi hai…
          <br />
          <span className="text-theme-primary/80">yeh ek cinematic experience hai 💍</span>
        </motion.p>

        {/* By Adex branding */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-theme-accent/70 text-xs tracking-[0.4em] uppercase font-light mb-12"
        >
          By Adex
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center justify-center gap-2 min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-theme-primary/90 hover:bg-theme-primary text-theme-secondary font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase text-sm rounded-sm border border-theme-accent/20 hover:border-theme-accent/40 transition-all duration-500 shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_25px_60px_rgba(var(--color-primary-rgb),0.25)]"
        >
          <span>Create Yours</span>
          <span className="text-theme-accent group-hover:translate-x-1 transition-transform">→</span>
        </motion.a>

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-[1px] w-32 mx-auto mt-16 origin-center"
          style={{
            background: 'linear-gradient(to right, transparent, var(--color-accent), var(--color-secondary), var(--color-accent), transparent)'
          }}
        />
      </div>
    </motion.section>
  );
};

export default AdexPromoSection;
