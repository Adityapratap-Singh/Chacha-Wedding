import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const BalAagrah = () => {
  const { settings } = useSettings();
  const { baalAagrah } = settings;
  const { names, poem } = baalAagrah;
  const poemLines = poem.includes('\n') ? poem.split('\n') : [poem];

  return (
    <section
      className="section-shell relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg-0) 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/3 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.04) 0%, transparent 70%)', animation: 'orb-pulse 9s ease-in-out infinite' }} />

      <div className="section-inner max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label block mb-5"
          >
            <span className="eyebrow-chip">With Innocent Hearts</span>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 1 }}
            className="gold-text text-glow-gold italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            बाल आग्रह
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="gold-divider mx-auto mt-4"
            style={{ width: '80px', transformOrigin: 'center' }}
          />
        </div>

        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="panel-luxe p-8 sm:p-10 lg:p-12 text-center relative overflow-hidden group shimmer-sweep"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(229,168,48,0.5), transparent)' }} />
            {['top-4 left-4 border-t border-l', 'top-4 right-4 border-t border-r',
              'bottom-4 left-4 border-b border-l', 'bottom-4 right-4 border-b border-r'].map((c, i) => (
              <div key={i} className={`absolute w-8 h-8 border-yellow-400/15 pointer-events-none ${c}`} />
            ))}

            <div className="relative z-10">
              <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-yellow-400/15 bg-white/[0.04] px-5 py-2">
                <span className="text-[0.65rem] uppercase tracking-[0.35em] text-yellow-300/70">बाल आग्रह</span>
              </div>

              <div className="space-y-4">
                {poemLines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.8 }}
                    className="text-yellow-100/85 italic leading-relaxed"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.15rem, 2.5vw, 1.65rem)' }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Children grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {names.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group panel-soft p-3 sm:p-4 flex flex-col items-center"
            >
              {/* Photo */}
              <div
                className="w-full aspect-[0.92] rounded-[1.35rem] overflow-hidden mb-4 relative"
                style={{
                  border: '1px solid rgba(229,168,48,0.15)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.28)',
                  transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                }}
              >
                <img
                  src={
                    baalAagrah.images?.[i]?.url
                      || `https://via.placeholder.com/300x300/0a0a0f/e5a830?text=${encodeURIComponent(name.split(' ')[0])}`
                  }
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ objectPosition: `center ${baalAagrah.images?.[i]?.objectPosition || 'center'}` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <span className="section-label text-[8px] mb-2 text-center">Little Invitation</span>
              <span
                className="text-yellow-100/80 group-hover:text-yellow-300/90 transition-colors text-center leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}
              >
                {name}
              </span>
              <div className="w-0 group-hover:w-full gold-divider transition-all duration-500 mt-2" style={{ height: '1px', opacity: 0.4 }} />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.35 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 italic tracking-widest"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(229,168,48,0.6)', fontSize: '0.9rem' }}
        >
          "बच्चों की मासूमियत से किया गया निमंत्रण ❤️"
        </motion.p>
      </div>
    </section>
  );
};

export default BalAagrah;
