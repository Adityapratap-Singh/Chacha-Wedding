import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POPUP_STORAGE_KEY = 'adex_popup_seen';
const DELAY_MS = 25000; // 25 seconds (between 20-30)
const WHATSAPP_URL = 'https://wa.me/917355259901?text=I want a wedding website like this 😍';

const AdexPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if already shown this session
    const seen = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (seen) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [mounted]);

  const handleClose = () => setIsVisible(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop - subtle blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          {/* Popup - bottom-right on desktop, bottom-center on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              mass: 0.8
            }}
                className="fixed z-[9999] left-3 right-3 sm:left-4 sm:right-4 md:left-auto md:right-6 md:w-[380px] bottom-4 sm:bottom-6 md:bottom-8"
          >
            <div
              className="relative overflow-hidden rounded-xl border border-gold-500/20 shadow-[0_25px_80px_rgba(0,0,0,0.25),0_0_40px_rgba(255,215,0,0.06)]"
              style={{
                background: 'rgba(253, 251, 247, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-maroon-700 hover:bg-white/50 transition-colors z-10"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="p-6 pt-8">
                {/* Content */}
                <p className="font-serif text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed mb-5 sm:mb-6">
                  Pasand aaya? 😄
                  <br />
                  <span className="text-maroon-700/90">Apni shaadi ke liye bhi aisa hi invite chahiye?</span>
                </p>

                {/* CTA */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="block w-full min-h-[48px] py-3.5 px-5 text-center bg-maroon-700/90 hover:bg-maroon-700 text-white font-serif tracking-[0.15em] text-sm uppercase rounded-lg border border-gold-500/20 transition-all duration-300 hover:border-gold-500/40 flex items-center justify-center"
                >
                  Talk on WhatsApp
                </a>
              </div>

              {/* Subtle gold accent line */}
              <div
                className="h-[2px] w-full"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.4), transparent)'
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdexPopup;
