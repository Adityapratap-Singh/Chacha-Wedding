import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DURATION_PER = 5;

const Card = ({ image, onClick, coupleNames }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -10,
      y: ((e.clientX - r.left) / r.width - 0.5) * 10,
    });
  }, []);

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <div
      className="relative inline-block w-[220px] sm:w-[280px] md:w-[340px] aspect-[3/4] mx-3 sm:mx-4 flex-shrink-0 cursor-pointer"
      style={{ perspective: '900px' }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="w-full h-full rounded-2xl overflow-hidden relative group"
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: tilt.x !== 0
            ? '0 30px 70px rgba(0,0,0,0.6), 0 0 30px rgba(229,168,48,0.12)'
            : '0 10px 30px rgba(0,0,0,0.4)',
          border: '1px solid rgba(229,168,48,0.1)',
        }}
      >
        <img
          src={image.url}
          alt={image.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5 sm:p-6">
          <span className="section-label mb-1 text-[8px]">{image.title}</span>
          <p className="text-yellow-200/80"
            style={{ fontFamily: "'Tangerine', cursive", fontWeight: 700, fontSize: '1.6rem' }}>
            {coupleNames.groom.split(' ')[0]} &amp; {coupleNames.bride.split(' ')[0]}
          </p>
        </div>
        {/* Gold border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border border-yellow-400/0 group-hover:border-yellow-400/30 transition-all duration-500 pointer-events-none" />
      </div>
    </div>
  );
};

const Gallery = () => {
  const { settings } = useSettings();
  const { gallery: images } = settings;
  const [selected, setSelected] = useState(null);
  const [paused, setPaused] = useState(false);

  const half     = Math.ceil(images.length / 2);
  const row1     = [...images.slice(0, half), ...images.slice(0, half), ...images.slice(0, half)];
  const row2     = [...images.slice(half), ...images.slice(half), ...images.slice(half)];
  const safeRow1 = row1.length ? row1 : [...images, ...images, ...images];
  const safeRow2 = row2.length ? row2 : [...images, ...images, ...images];
  const dur      = Math.max((images.length || 8) * DURATION_PER, 14);

  return (
    <section
      className="section-shell relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%)' }}
    >
      {/* Header */}
      <div className="section-inner mb-12 sm:mb-16 relative z-10">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-label block mb-4"
        >
          <span className="eyebrow-chip">Gallery</span>
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 1 }}
          className="gold-text text-glow-gold italic"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          {settings.messages.galleryTitle}
          <span className="text-yellow-400/25 font-light mx-4">|</span>
          <span className="text-yellow-100/50" style={{ fontWeight: 300 }}>{settings.messages.gallerySubtitle}</span>
        </motion.h2>
      </div>

      {/* Dual scroll rows */}
      {images.length > 0 ? (
        <div
          className="relative py-3 space-y-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <style>{`
            @keyframes scroll-left  { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
            @keyframes scroll-right { from { transform: translateX(-33.333%); } to { transform: translateX(0); } }
            .row-left  { animation: scroll-left  ${dur}s linear infinite; }
            .row-right { animation: scroll-right ${dur * 1.25}s linear infinite; }
            .gallery-paused .row-left,
            .gallery-paused .row-right { animation-play-state: paused; }
          `}</style>

          <div className={paused ? 'gallery-paused' : ''}>
          <div className="flex overflow-hidden">
            <div className="flex row-left whitespace-nowrap">
                {safeRow1.map((img, i) => (
                  <Card key={`r1-${i}`} image={img} onClick={() => setSelected(img)} coupleNames={settings.coupleNames} />
                ))}
              </div>
            </div>
            <div className="flex overflow-hidden mt-4">
              <div className="flex row-right whitespace-nowrap">
                {safeRow2.map((img, i) => (
                  <Card key={`r2-${i}`} image={img} onClick={() => setSelected(img)} coupleNames={settings.coupleNames} />
                ))}
              </div>
            </div>
          </div>

          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-40 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, var(--bg-0), transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-40 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to left, var(--bg-0), transparent)' }} />

          {paused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              <div className="panel-soft px-5 py-2.5 rounded-full section-label text-[9px]">Paused</div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Camera className="mx-auto text-yellow-400/20 mb-4" size={48} />
          <p className="text-yellow-100/30 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Gallery is being curated. Check back soon!
          </p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="relative z-10 max-w-4xl w-full"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 p-2 section-label text-[10px] flex items-center gap-2 hover:text-yellow-300 transition-colors"
              >
                <X size={16} /> Close
              </button>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid rgba(229,168,48,0.2)',
                  boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 30px rgba(229,168,48,0.06)',
                }}
              >
                <img src={selected.url} alt={selected.title} className="w-full max-h-[75vh] object-contain" />
              </div>
              <div className="text-center mt-6">
                <h3 className="text-yellow-100/80 italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem' }}>
                  {selected.title}
                </h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
