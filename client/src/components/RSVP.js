import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Check, X, Heart, Loader2, Send, Edit2 } from 'lucide-react';

const RSVP = ({ guestId, guest }) => {
  const [status, setStatus] = useState('Pending');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFamilyInvite = guest?.family === 'Yes';
  const responseLabel = isFamilyInvite ? `${guest?.name || 'Our Valued Guest'} & Family` : (guest?.name || 'Our Valued Guest');

  useEffect(() => {
    if (guest?.rsvpStatus && guest.rsvpStatus !== 'Pending') {
      setStatus(guest.rsvpStatus);
      setSubmitted(true);
    }
  }, [guest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'Pending') return;
    setLoading(true); setError(null);
    try {
      await axios.post(`/api/rsvp/${guestId}`, { rsvpStatus: status });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sharedSection = (children) => (
    <section
      className="section-shell relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-0) 0%, var(--bg-2) 50%, var(--bg-0) 100%)' }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.04) 0%, transparent 70%)', animation: 'orb-pulse 12s ease-in-out infinite' }} />
      <div className="section-inner relative z-10 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="mb-5 inline-flex eyebrow-chip">
            <p className="section-label">Join the Celebration</p>
          </div>
          <h2 className="gold-text text-glow-gold italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            RSVP
          </h2>
          <div className="gold-divider mx-auto mt-4" style={{ width: '80px', opacity: 0.5 }} />
        </div>
        {children}
      </div>
    </section>
  );

  if (submitted && !loading) {
    return sharedSection(
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel-luxe p-8 sm:p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-gold"
          style={{ background: 'linear-gradient(135deg, rgba(229,168,48,0.15), rgba(200,134,14,0.08))', border: '1px solid rgba(229,168,48,0.3)' }}
        >
          <Heart className="text-yellow-400 w-9 h-9" fill="currentColor" />
        </motion.div>
        <h3 className="text-yellow-100/90 italic mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}>
          Thank You!
        </h3>
        <p className="text-yellow-100/55 italic leading-relaxed mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
          {status === 'Attending'
            ? (isFamilyInvite
              ? 'We are overjoyed that your family will be joining us. Your presence will make this celebration truly unforgettable.'
              : 'We are overjoyed you will be joining us. Your presence will make this celebration truly unforgettable.')
            : (isFamilyInvite
              ? 'We will miss your family dearly. Your blessings and warm wishes mean the world to us.'
              : 'We\'ll miss you dearly. Your blessings and warm wishes mean the world to us.')}
        </p>
        <div className="gold-divider mx-auto mb-6" style={{ width: '60px', opacity: 0.4 }} />
        <button
          onClick={() => setSubmitted(false)}
          className="section-label flex items-center gap-2 mx-auto hover:text-yellow-300 transition-colors"
        >
          <Edit2 size={14} /> Update Response
        </button>
      </motion.div>
    );
  }

  return sharedSection(
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="panel-luxe p-8 sm:p-12"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Guest name */}
        <div className="text-center">
          <p className="section-label mb-2 text-[9px]">Responding for</p>
          <h4 className="text-yellow-100/90 italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
            {responseLabel}
          </h4>
          {isFamilyInvite && (
            <p
              className="mt-3 text-yellow-100/55 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(0.98rem, 2vw, 1.08rem)' }}
            >
              One RSVP here will be recorded for the full family invitation.
            </p>
          )}
        </div>

        {/* Choice buttons */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { val: 'Attending', icon: <Check className="w-6 h-6" />, label: isFamilyInvite ? 'Joyfully\nAttend Together' : 'Joyfully\nAttend' },
            { val: 'Not Attending', icon: <X className="w-6 h-6" />, label: isFamilyInvite ? 'Regretfully\nDecline Together' : 'Regretfully\nDecline' },
          ].map(({ val, icon, label }) => {
            const active = status === val;
            return (
              <motion.button
                key={val}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStatus(val)}
                className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-[1.35rem] transition-all duration-400 overflow-hidden"
                style={{
                  background: active ? 'linear-gradient(145deg, rgba(229,168,48,0.12), rgba(118,10,36,0.12))' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${active ? 'rgba(229,168,48,0.34)' : 'rgba(229,168,48,0.08)'}`,
                  boxShadow: active ? '0 20px 44px rgba(0,0,0,0.24), 0 0 26px rgba(229,168,48,0.08)' : 'none',
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-400"
                  style={{
                    background: active ? 'linear-gradient(135deg, #c8860e, #fde68a)' : 'rgba(255,255,255,0.04)',
                    color: active ? '#050508' : 'rgba(229,168,48,0.4)',
                  }}>
                  {icon}
                </div>
                <span className="section-label text-[8px] sm:text-[9px] text-center whitespace-pre-line leading-[1.8]">
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-center text-sm italic"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || status === 'Pending'}
          whileHover={status !== 'Pending' ? { scale: 1.02 } : {}}
          whileTap={status !== 'Pending' ? { scale: 0.98 } : {}}
          className={`w-full py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-400 ${
            status === 'Pending'
              ? 'opacity-30 cursor-not-allowed section-label'
              : 'btn-luxury ring-glow'
          }`}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
            <>
              <Send size={16} className={status !== 'Pending' ? 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' : ''} />
              <span>
                {guest?.rsvpStatus && guest.rsvpStatus !== 'Pending'
                  ? (isFamilyInvite ? 'Update Family RSVP' : 'Update Response')
                  : (isFamilyInvite ? 'Confirm Family RSVP' : 'Confirm RSVP')}
              </span>
            </>
          )}
        </motion.button>

        {/* Phone contacts */}
        <div className="pt-6 border-t border-yellow-400/[0.06] text-center">
          <p className="section-label mb-5 text-[9px]">Need assistance? Call us</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
            {[{ n: '9198065015', label: 'Primary' }, { n: '9001787742', label: 'Alternative' }].map(({ n, label }) => (
              <a key={n} href={`tel:${n}`} className="group flex flex-col items-center gap-1">
                <span className="section-label text-[8px] group-hover:text-yellow-300 transition-colors">{label}</span>
                <span className="text-yellow-400/70 group-hover:text-yellow-300 transition-colors tracking-widest"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                  +91 {n}
                </span>
              </a>
            ))}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default RSVP;
