import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POPUP_STORAGE_KEY = 'adex_popup_seen';
const DELAY_MS = 25000; // 25 seconds
const AdexPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const WHATSAPP_URL = `https://wa.me/917355259901?text=${encodeURIComponent(`Yeh cinematic experience mujhe bhi chahiye 😍\n\nLink: ${currentUrl}`)}`;

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
          {/* Backdrop - extremely subtle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9998] bg-black/5 backdrop-blur-[1px] pointer-events-none sm:pointer-events-auto"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
            className="fixed z-[9999] left-4 right-4 sm:left-auto sm:right-6 md:right-8 sm:w-[360px] bottom-6 sm:bottom-8 md:bottom-10"
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-theme-accent/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] group"
              style={{
                background: 'var(--color-secondary)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-theme-text/40 hover:text-theme-primary hover:bg-theme-primary/5 transition-all duration-300 z-10"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="p-7">
                {/* Accent icon */}
                <div className="text-theme-accent text-xl mb-3">🎬</div>

                {/* Content */}
                <div className="mb-6">
                  <p className="font-serif text-theme-text text-lg leading-relaxed italic">
                    "Yeh sirf invitation nahi hai…
                    <br />
                    <span className="text-theme-primary font-medium not-italic">yeh ek cinematic experience hai 💍</span>"
                  </p>
                </div>

                {/* CTA - WhatsApp Button with hover effect */}
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center justify-center gap-3 w-full py-4.5 px-6 bg-theme-primary text-gold-500 font-serif tracking-[0.1em] text-sm uppercase rounded-full shadow-xl shadow-theme-primary/30 overflow-hidden transition-all duration-500 border border-gold-500/20"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-theme-primary via-maroon-800 to-theme-primary transition-all duration-500" />
                  
                  {/* Golden Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  
                  <span className="relative z-10">Get Yours on WhatsApp</span>
                  <span className="text-gold-500 relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                </motion.a>
              </div>

              {/* Progress bar animation for attention */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-theme-accent/50 to-transparent"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdexPopup;
