import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles, X } from 'lucide-react';

const POPUP_STORAGE_KEY = 'adex_popup_seen';
const DELAY_MS = 25000;

const AdexPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappUrl = `https://wa.me/917355259901?text=${encodeURIComponent(`Mujhe bhi apni shaadi ke liye aisa premium, personalized wedding invite chahiye ✨\n\nLink: ${currentUrl}`)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <motion.button
            type="button"
            aria-label="Close promotional popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-md"
            onClick={() => setIsVisible(false)}
          />

          <motion.aside
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-4 z-[9999] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
          >
            <div className="panel-luxe relative overflow-hidden rounded-[28px] border border-yellow-400/15 shadow-[0_30px_80px_rgba(0,0,0,0.58)]">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at top right, rgba(229,168,48,0.18), transparent 34%), radial-gradient(circle at bottom left, rgba(118,10,36,0.22), transparent 42%)',
                }}
              />

              <div className="absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent" />

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition-colors duration-200 hover:bg-white/10 hover:text-yellow-200"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="relative z-10 p-5 sm:p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/15 bg-white/5 px-3 py-1.5">
                  <Sparkles size={14} className="text-yellow-300/80" />
                  <span className="section-label !text-[9px] !tracking-[0.32em] !text-yellow-200/75">
                    Crafted by Adex
                  </span>
                </div>

                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-gradient-to-br from-yellow-300/20 to-yellow-500/5 text-yellow-200 shadow-[0_0_30px_rgba(229,168,48,0.12)]">
                    <MessageCircle size={20} />
                  </div>

                  <div className="pr-8">
                    <h3
                      className="gold-text mb-1"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(1.7rem, 4vw, 2.15rem)',
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      Want this style for your wedding?
                    </h3>
                    <p className="text-sm leading-6 text-yellow-100/62 sm:text-[0.95rem]">
                      A tailored wedding invite with elegant motion, thoughtful details, and a guest journey that feels truly special.
                    </p>
                  </div>
                </div>

                <div className="panel-soft mb-5 rounded-[22px] px-4 py-4 sm:px-5">
                  <p
                    className="italic text-yellow-50/86"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.15rem',
                      lineHeight: 1.55,
                    }}
                  >
                    "Yeh sirf ek invite nahi..."
                  </p>
                  <p
                    className="mt-1 text-yellow-300/82"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.05rem',
                    }}
                  >
                    yeh aapki shaadi ka pehla impression hai.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsVisible(false)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-luxury flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[11px]"
                  >
                    Chat on WhatsApp
                    <ArrowRight size={14} />
                  </motion.a>

                  <button
                    type="button"
                    onClick={() => setIsVisible(false)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-medium uppercase tracking-[0.24em] text-white/60 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white/85"
                  >
                    Maybe later
                  </button>
                </div>

                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.28em] text-white/28">
                  Custom wedding invite websites
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdexPopup;
