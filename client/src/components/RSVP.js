import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Check, X, Heart } from 'lucide-react';

const RSVP = ({ guestId, guestName }) => {
  const [status, setStatus] = useState('Pending');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/guests/rsvp/${guestId}`, {
        rsvpStatus: status,
        guestCount: 0
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('RSVP Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 sm:p-8 md:p-12 border border-gold-500/20 rounded-lg max-w-md w-full shadow-2xl"
        >
          <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-maroon-700 w-10 h-10" fill="currentColor" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-3 sm:mb-4">Thank You!</h3>
          <p className="text-gray-600 font-light leading-relaxed">
            {status === 'Attending' 
              ? "We are delighted to know you'll be joining us. Your presence will make our celebration truly special."
              : "We'll miss you at the celebration, but we appreciate you letting us know. Your blessings are always with us."}
          </p>
          <div className="mt-8 h-[1px] w-24 bg-gold-500/30 mx-auto" />
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#fdfbf7] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-gold-500 uppercase tracking-[0.4em] text-xs font-medium mb-4 block"
          >
            Will You Join Us?
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-maroon-700 mb-4 sm:mb-6"
          >
            RSVP
          </motion.h2>
          <div className="h-[1px] w-24 bg-gold-500/40 mx-auto" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-white p-5 sm:p-6 md:p-8 lg:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-sm border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-10">
              <p className="text-gray-500 font-light italic mb-2">Responding for</p>
              <h4 className="text-2xl font-serif text-gray-900">{guestName || 'Our Guest'}</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setStatus('Attending')}
                className={`flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] p-4 sm:p-6 rounded-lg border-2 transition-all duration-300 ${
                  status === 'Attending' 
                  ? 'border-maroon-700 bg-maroon-700/5 text-maroon-700' 
                  : 'border-gray-100 hover:border-gold-500/30 text-gray-400'
                }`}
              >
                <Check className={`w-6 h-6 mb-2 ${status === 'Attending' ? 'opacity-100' : 'opacity-20'}`} />
                <span className="font-serif tracking-widest uppercase text-xs">Joyfully Attend</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('Not Attending')}
                className={`flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] p-4 sm:p-6 rounded-lg border-2 transition-all duration-300 ${
                  status === 'Not Attending' 
                  ? 'border-gray-400 bg-gray-50 text-gray-600' 
                  : 'border-gray-100 hover:border-gold-500/30 text-gray-400'
                }`}
              >
                <X className={`w-6 h-6 mb-2 ${status === 'Not Attending' ? 'opacity-100' : 'opacity-20'}`} />
                <span className="font-serif tracking-widest uppercase text-xs">Regretfully Decline</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || status === 'Pending'}
              className={`w-full min-h-[48px] py-3.5 sm:py-4 rounded-sm font-serif tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-all duration-500 ${
                status === 'Pending'
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-maroon-700 text-white shadow-xl shadow-maroon-700/20 hover:scale-[1.02]'
              }`}
            >
              {loading ? 'Processing...' : 'Submit Response'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVP;
