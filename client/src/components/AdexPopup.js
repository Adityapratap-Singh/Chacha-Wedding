import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const POPUP_STORAGE_KEY = 'adex_popup_seen';
const DELAY_MS = 25000;

const AdexPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const WHATSAPP_URL = `https://wa.me/917355259901?text=${encodeURIComponent(`Yeh cinematic experience mujhe bhi chahiye 😍\n\nLink: ${currentUrl}`)}`;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const seen = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (seen) return;
    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [mounted]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px] pointer-events-none sm:pointer-events-auto"
            onClick={() => setIsVisible(false)}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="fixed z-[9999] left-4 right-4 sm:left-auto sm:right-6 md:right-8 sm:w-[340px] bottom-6 sm:bottom-8"
          >
            <div
              className="panel-luxe relative overflow-hidden rounded-2xl"
            >
              {/* Gold top bar */}
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(229,168,48,0.7), transparent)' }} />

              {/* Progress bottom bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(229,168,48,0.4), transparent)',
                  transformOrigin: 'left',
                }}
              />

              {/* Corner ornaments */}
              {['top-3 left-3 border-t border-l', 'top-3 right-10 border-t border-r'].map((c, i) => (
                <div key={i} className={`absolute w-5 h-5 border-yellow-400/20 pointer-events-none ${c}`} />
              ))}

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 z-10"
                style={{ color: 'rgba(229,168,48,0.4)', border: '1px solid rgba(229,168,48,0.12)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(229,168,48,0.85)'; e.currentTarget.style.background = 'rgba(229,168,48,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(229,168,48,0.4)'; e.currentTarget.style.background = ''; }}
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="p-6 pt-7">
                {/* Icon */}
                <div className="text-2xl mb-4" style={{ filter: 'drop-shadow(0 0 8px rgba(229,168,48,0.4))' }}>🎬</div>

                {/* Content */}
                <p
                  className="italic leading-relaxed mb-5 text-yellow-100/75"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
                >
                  "Yeh sirf invitation nahi hai…
                  <br />
                  <span className="text-yellow-300/80 not-italic">yeh ek cinematic experience hai 💍"</span>
                </p>

                {/* CTA */}
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsVisible(false)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-luxury flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm"
                >
                  Get Yours on WhatsApp →
                </motion.a>

                <p className="section-label text-center mt-4 text-[8px] opacity-50">By Adex · adityaprataps406@gmail.com</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdexPopup;
