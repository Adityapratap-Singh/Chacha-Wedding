import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const FloralDivider = ({ flip = false }) => (
  <svg
    viewBox="0 0 200 24"
    className={`w-full max-w-xs mx-auto text-yellow-400/35 ${flip ? 'scale-x-[-1]' : ''}`}
    fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 12 Q25 0 50 12 Q75 24 100 12 Q125 0 150 12 Q175 24 200 12" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="100" cy="12" r="3" fill="currentColor" opacity="0.6" />
    <circle cx="50" cy="12" r="2" fill="currentColor" opacity="0.4" />
    <circle cx="150" cy="12" r="2" fill="currentColor" opacity="0.4" />
  </svg>
);

const Ornament = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8 text-yellow-400/50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4 L22 18 L36 20 L22 22 L20 36 L18 22 L4 20 L18 18 Z" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
  </svg>
);

const storyMoments = [
  {
    icon: '🌸',
    dateLabel: 'प्रथम मिलन',
    dateEn: 'The First Meeting',
    title: 'जब दो आत्माएं मिलीं',
    desc: 'किसी ने सही कहा है — नसीब में जो लिखा होता है, वो मिलकर ही रहता है। पुष्पेन्द्र और रिनु का मिलना भी कुछ ऐसा ही था, एक सहज, सुंदर और अविस्मरणीय पल — जैसे दो दीयों की रोशनी एक हो जाए।',
  },
  {
    icon: '💛',
    dateLabel: 'प्रेम का बंधन',
    dateEn: 'Bond of Love',
    title: 'दिल से दिल का रिश्ता',
    desc: 'धीरे-धीरे, हर बातचीत में, हर हँसी में, उनका रिश्ता गहरा होता गया। दो परिवारों ने एक स्वप्न देखा — एक ऐसे घर का, जहाँ प्रेम की सुगंध हर ओर फैली हो।',
  },
  {
    icon: '💍',
    dateLabel: 'सगाई',
    dateEn: 'The Promise',
    title: 'एक वादा, एक जीवन',
    desc: 'परिवार के आशीर्वाद और शुभकामनाओं के साथ, दोनों ने एक-दूसरे को जीवनसाथी बनाने का वादा किया। यह सिर्फ एक अंगूठी नहीं, बल्कि दो दिलों की सच्ची कसम थी।',
  },
  {
    icon: '✨',
    dateLabel: 'विवाह — 12 मई 2026',
    dateEn: 'Wedding — 12 May 2026',
    title: 'अब एक नई शुरुआत',
    desc: 'और अब वो पल आ गया है जिसका सभी को इंतज़ार था। 12 मई 2026 को, पुष्पेन्द्र और रिनु सात जन्मों के बंधन में बंधने जा रहे हैं। हम चाहते हैं कि आप भी इस यादगार सफर के साक्षी बनें।',
  },
];

const StoryCard = ({ moment, index }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isEven = index % 2 === 0;

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -6,
      y: ((e.clientX - cx) / (rect.width / 2)) * 6,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: 0.1 * index, ease: [0.34, 1.56, 0.64, 1] }}
      className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 mb-10 sm:mb-14 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Content Card with 3D tilt */}
      <div className="w-full md:w-[44%] group" style={{ perspective: '1000px' }}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
            boxShadow: tilt.x !== 0 || tilt.y !== 0
              ? '0 25px 60px rgba(0,0,0,0.35), 0 0 30px rgba(255,215,0,0.08)'
              : '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-yellow-400/15 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-yellow-400/15 rounded-bl-2xl" />

          {/* Floating icon */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-3xl sm:text-4xl select-none transition-transform duration-500"
              style={{
                transform: `translateZ(20px) scale(${tilt.x !== 0 || tilt.y !== 0 ? 1.15 : 1})`,
                transition: 'transform 0.4s ease',
                filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.4))',
              }}
            >
              {moment.icon}
            </span>
            <div>
              <p className="text-yellow-400 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold"
                style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                {moment.dateLabel}
              </p>
              <p className="text-white/35 text-[9px] tracking-[0.15em] uppercase font-light">{moment.dateEn}</p>
            </div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            className="h-px bg-gradient-to-r from-transparent via-yellow-400/35 to-transparent mb-4"
          />

          <h3
            className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-3 leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            {moment.title}
          </h3>

          <p className="text-white/60 italic text-sm sm:text-base leading-[1.9]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {moment.desc}
          </p>
        </div>
      </div>

      {/* Center node */}
      <div className="hidden md:flex flex-col items-center justify-center w-[12%] relative">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 + 0.1 * index, type: 'spring' }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-5 h-5 rounded-full bg-theme-secondary border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.6)] z-10" />
          <Ornament />
        </motion.div>
      </div>

      <div className="hidden md:block w-[44%]" />
    </motion.div>
  );
};

const OurStory = () => {
  const { settings } = useSettings();
  const { coupleNames } = settings;

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-theme-bg relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/[0.04] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/[0.06] rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-tag block mb-4"
          >
            Our Journey Together
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-6xl text-white/90 mb-2 italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            हमारी कहानी
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-white/45 italic text-2xl sm:text-3xl"
            style={{ fontFamily: "'Tangerine', cursive", fontWeight: 700 }}
          >
            {coupleNames.groom.split(' ')[0]} &amp; {coupleNames.bride.split(' ')[0]}
          </motion.p>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '4rem', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-4"
          />
        </div>

        {/* Story timeline */}
        <div className="relative">
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 w-px h-full hidden md:block"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.35) 20%, rgba(255,215,0,0.35) 80%, transparent)',
              transformOrigin: 'top',
            }}
          />
          <div className="space-y-12 sm:space-y-16 md:space-y-0">
            {storyMoments.map((moment, index) => (
              <StoryCard key={index} moment={moment} index={index} />
            ))}
          </div>
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mt-16 sm:mt-20"
        >
          <FloralDivider />
          <p
            className="mt-8 text-white/40 italic text-sm sm:text-base tracking-widest max-w-md mx-auto leading-[2]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            "दो दिलों की एक कहानी, जो अब होने जा रही है अमर।"
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;
