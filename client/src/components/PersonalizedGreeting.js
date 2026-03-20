import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import GoldDust from './GoldDust';
import AnimatedText from './AnimatedText';
import Hero from './Hero';
import EventsTimeline from './EventsTimeline';
import Venue from './Venue';
import Gallery from './Gallery';
import RSVP from './RSVP';
import AdexPromoSection from './AdexPromoSection';
import AdexPopup from './AdexPopup';

const Mandala = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
    <path d="M100 20 L110 40 L130 40 L120 60 L130 80 L110 80 L100 100 L90 80 L70 80 L80 60 L70 40 L90 40 Z" stroke="currentColor" strokeWidth="0.5" />
    <path d="M100 10 L120 30 L150 30 L140 60 L160 90 L130 90 L120 120 L100 100 L80 120 L70 90 L40 90 L60 60 L50 30 L80 30 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
    <circle cx="100" cy="100" r="2" fill="currentColor" />
  </svg>
);

const PersonalizedGreeting = () => {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const nextSectionRef = useRef(null);

  useEffect(() => {
    const fetchGuest = async () => {
      if (!guestId) return;
      try {
        const res = await axios.get(`/api/guests/${guestId}`);
        setGuest(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGuest();
  }, [guestId]);

  const scrollToContent = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const coupleNames = {
    bride: "Renu Singh",
    groom: "Pushpendra Kumar Singh (Lalla Bhaiya)"
  };

  return (
    <div className="bg-[#fdfbf7]">
      <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <GoldDust count={30} />
        
        {/* Royal Mandala Background - smaller on mobile */}
        <motion.div 
          className="absolute top-[-5%] left-[-5%] w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] text-maroon-700 opacity-[0.04] pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <Mandala className="w-full h-full" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[-5%] right-[-5%] w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] text-gold-500 opacity-[0.05] pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        >
          <Mandala className="w-full h-full" />
        </motion.div>

        {/* Decorative Side Patterns - desktop only */}
        <div className="absolute top-0 left-0 w-24 md:w-32 h-full opacity-[0.03] pointer-events-none hidden md:block" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
        <div className="absolute top-0 right-0 w-24 md:w-32 h-full opacity-[0.03] pointer-events-none hidden md:block" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl w-full relative z-10"
        >
          {/* Main Invitation Card */}
          <div className="bg-white p-1 sm:p-2 shadow-[0_20px_60px_rgba(0,0,0,0.1)] sm:shadow-[0_40px_100px_rgba(0,0,0,0.12)] relative rounded-sm">
            {/* Double Border Effect - tighter padding on mobile */}
            <div className="border-[1px] border-gold-500/20 p-5 sm:p-8 md:p-12 lg:p-20 relative overflow-hidden">
              {/* Corner Ornaments - smaller on mobile */}
              <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-t-2 border-l-2 border-gold-500/30 rounded-tl-2xl sm:rounded-tl-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-t-2 border-r-2 border-gold-500/30 rounded-tr-2xl sm:rounded-tr-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-b-2 border-l-2 border-gold-500/30 rounded-bl-2xl sm:rounded-bl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-b-2 border-r-2 border-gold-500/30 rounded-br-2xl sm:rounded-br-3xl pointer-events-none" />

              <div className="text-center relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Atithi Devo Bhava Section */}
                  <div className="mb-12">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="inline-block"
                    >
                      <span className="font-serif italic text-maroon-700 text-xl sm:text-2xl md:text-4xl mb-2 block gold-glow">
                        Atithi Devo Bhava
                      </span>
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                    </motion.div>
                  </div>
                  
                  {/* Guest Greeting */}
                  <div className="mb-12 min-h-[100px] flex flex-col items-center justify-center">
                    {guest ? (
                      <>
                        <AnimatedText 
                          text={`प्रिय ${guest.name} जी,`}
                          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 leading-tight mb-4 gold-gradient-text"
                          delay={0.5}
                        />
                        <div className="w-24 h-[1px] bg-gold-500/40 mx-auto" />
                      </>
                    ) : (
                      <>
                        <AnimatedText 
                          text="Our Dear Guest,"
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight mb-4"
                          delay={0.5}
                        />
                        <div className="w-24 h-[1px] bg-gold-500/40 mx-auto" />
                      </>
                    )}
                  </div>
                  
                  {/* Invitation Message */}
                  <div className="max-w-2xl mx-auto mb-16">
                    <AnimatedText 
                      text={guest?.family === 'Yes' ? 'आपको सपरिवार सादर आमंत्रित किया जाता है' : 'आपको सादर आमंत्रित किया जाता है'}
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-gray-700 mb-6 sm:mb-8 leading-relaxed italic"
                      delay={1.5}
                    />
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      className="text-maroon-700 font-serif text-base sm:text-lg md:text-xl lg:text-2xl mt-4 sm:mt-6"
                    >
                      "Join us as we celebrate the union of two hearts"
                    </motion.p>
                  </div>

                  {/* Couple Names & Date Banner */}
                  <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 mb-10 sm:mb-12">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="h-[1px] w-8 sm:w-12 md:w-20 bg-gold-500/30" />
                      <span className="text-gold-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs md:text-sm font-light text-center max-w-xs">
                        {coupleNames.groom} <br/> & <br/> {coupleNames.bride}
                      </span>
                      <div className="h-[1px] w-8 sm:w-12 md:w-20 bg-gold-500/30" />
                    </div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-maroon-700 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-sm shadow-xl shadow-maroon-700/20 border border-gold-500/30 relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gold-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="text-base sm:text-lg md:text-xl font-serif tracking-[0.15em] sm:tracking-[0.2em] relative z-10">
                        12 May 2026
                      </span>
                    </motion.div>
                  </div>

                  {/* Discover More Button */}
                  <motion.button
                    onClick={scrollToContent}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex flex-col items-center mx-auto mt-12 sm:mt-16 transition-all duration-500 py-3"
                  >
                    <span className="text-gold-500 font-serif tracking-[0.3em] uppercase text-[10px] mb-4 group-hover:text-maroon-700 transition-colors">
                      Discover the Celebration
                    </span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-gold-500 to-transparent group-hover:h-20 transition-all duration-500" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Decorative Bottom Quote */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            transition={{ delay: 1 }}
            className="text-center mt-12 sm:mt-16 font-serif italic text-gray-600 tracking-widest text-base sm:text-lg px-2"
          >
            Your presence will make our celebration complete.
          </motion.p>
        </motion.div>
      </div>

      {/* Remaining Sections */}
      <div ref={nextSectionRef} className="relative">
        <Hero />
        <EventsTimeline />
        <Venue />
        <Gallery />
        <RSVP guestId={guestId} guestName={guest?.name} />
        <AdexPromoSection />
        <footer className="py-16 sm:py-20 md:py-24 text-center bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <h4 className="text-gold-500 font-serif italic text-xl sm:text-2xl mb-4 sm:mb-6">Pushpendra & Renu</h4>
            <p className="text-white/30 text-[10px] tracking-[0.8em] uppercase">Together Forever • 2026</p>
            <div className="mt-12 h-[1px] w-32 bg-gold-500/20 mx-auto" />
            <p className="text-white/10 text-[8px] mt-8 uppercase tracking-[0.2em]">Designed for a Cinematic Wedding Experience</p>
          </div>
        </footer>
      </div>

      <AdexPopup />
    </div>
  );
};

export default PersonalizedGreeting;
