import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Check, X, Heart, Loader2, Send, Edit2 } from 'lucide-react';

const RSVP = ({ guestId, guest }) => {
  const [status, setStatus] = useState('Pending');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (guest && guest.rsvpStatus && guest.rsvpStatus !== 'Pending') {
      setStatus(guest.rsvpStatus);
      setIsSubmitted(true);
    }
  }, [guest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'Pending') return;
    
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/rsvp/${guestId}`, {
        rsvpStatus: status,
        guestCount: guest?.guestCount || 0
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('RSVP Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted && !loading) {
    return (
      <section className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 sm:p-12 md:p-16 border border-theme-accent/20 rounded-3xl max-w-2xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-theme-secondary relative z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-24 h-24 bg-theme-primary/5 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Heart className="text-theme-title w-12 h-12" fill="currentColor" />
            </motion.div>
            
            <h3 className="text-3xl sm:text-4xl font-serif text-theme-text mb-6">Thank You!</h3>
            
            <p className="text-lg text-theme-text/80 font-light leading-relaxed mb-10 italic">
              {status === 'Attending' 
                ? "We are delighted to know you'll be joining us! Your presence will make our celebration truly special and memorable."
                : "We'll miss you at the celebration, but we truly appreciate you letting us know. Your blessings and well-wishes mean a lot to us."}
            </p>

            <div className="flex flex-col items-center gap-6">
              <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-theme-accent/40 to-transparent" />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="flex items-center gap-2 text-theme-accent hover:text-theme-title transition-colors font-serif tracking-widest text-sm uppercase"
              >
                <Edit2 size={16} />
                Update Response
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-theme-primary/5 rounded-full blur-3xl -z-10" />
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28 bg-theme-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-theme-accent uppercase tracking-[0.5em] text-xs font-semibold mb-4 block">
              Join the Celebration
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-theme-title mb-6">
              RSVP
            </h2>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-theme-accent to-transparent mx-auto" />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm p-8 sm:p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-2xl border border-theme-accent/10 relative"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="text-center">
              <p className="text-theme-accent/60 font-serif italic mb-2 tracking-widest">Responding for</p>
              <h4 className="text-3xl sm:text-4xl font-serif text-theme-title drop-shadow-sm">
                {guest?.name || 'Our Valued Guest'}
              </h4>
              <div className="mt-4 flex justify-center gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-theme-accent/20" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.button
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatus('Attending')}
                className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-500 overflow-hidden group ${
                  status === 'Attending' 
                  ? 'border-theme-primary bg-theme-primary/5 text-theme-title shadow-lg shadow-theme-primary/10' 
                  : 'border-white/10 hover:border-theme-accent/40 text-theme-text/40 bg-white/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${
                  status === 'Attending' ? 'bg-theme-primary text-theme-text' : 'bg-white/5 border border-white/10 text-theme-text/20'
                }`}>
                  <Check className="w-7 h-7" />
                </div>
                <span className="font-serif tracking-[0.2em] uppercase text-xs font-bold">Joyfully Attend</span>
                {status === 'Attending' && (
                  <motion.div layoutId="status-glow" className="absolute inset-0 bg-theme-accent/5 pointer-events-none" />
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatus('Not Attending')}
                className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-500 overflow-hidden group ${
                  status === 'Not Attending' 
                  ? 'border-gray-400 bg-gray-50/10 text-theme-text/80 shadow-lg shadow-black/5' 
                  : 'border-white/10 hover:border-theme-accent/40 text-theme-text/40 bg-white/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${
                  status === 'Not Attending' ? 'bg-gray-500 text-white' : 'bg-white/5 border border-white/10 text-theme-text/20'
                }`}>
                  <X className="w-7 h-7" />
                </div>
                <span className="font-serif tracking-[0.2em] uppercase text-xs font-bold">Regretfully Decline</span>
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-center text-sm font-light italic"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || status === 'Pending'}
              whileHover={status !== 'Pending' ? { scale: 1.02 } : {}}
              whileTap={status !== 'Pending' ? { scale: 0.98 } : {}}
              className={`w-full py-5 rounded-xl font-serif tracking-[0.3em] uppercase text-sm flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden group ${
                status === 'Pending'
                ? 'bg-white/5 text-theme-text/20 cursor-not-allowed border border-white/10'
                : 'bg-theme-primary text-theme-text shadow-2xl shadow-theme-primary/30'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  <span>{guest?.rsvpStatus && guest.rsvpStatus !== 'Pending' ? 'Update Response' : 'Confirm RSVP'}</span>
                </>
              )}
              
              {status !== 'Pending' && (
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              )}
            </motion.button>
          </form>

          {/* RSVP via Call Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-10 border-t border-white/10 text-center"
          >
            <p className="text-theme-text/40 font-serif italic text-sm mb-6 uppercase tracking-widest">
              Need assistance? Reach out to us
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              <a 
                href={`tel:${7355259901}`} 
                className="group flex flex-col items-center gap-2"
              >
                <span className="text-xs text-theme-accent uppercase tracking-[0.2em] font-bold group-hover:text-theme-title transition-colors">Call For RSVP</span>
                <span className="text-xl font-serif text-theme-title border-b border-transparent group-hover:border-theme-primary/30 transition-all tracking-wider">
                  +91 9198065015
                </span>
              </a>
              <div className="hidden sm:block w-[1px] h-10 bg-white/10" />
              <a 
                href={`tel:${8953731369}`} 
                className="group flex flex-col items-center gap-2"
              >
                <span className="text-xs text-theme-accent uppercase tracking-[0.2em] font-bold group-hover:text-theme-title transition-colors">Alternative Contact</span>
                <span className="text-xl font-serif text-theme-title border-b border-transparent group-hover:border-theme-primary/30 transition-all tracking-wider">
                  +91 9001787742
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default RSVP;
