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
import CelebrationTeam from './CelebrationTeam';
import BalAagrah from './BalAagrah';
import Presak from './Presak';
import RSVP from './RSVP';
import AdexPromoSection from './AdexPromoSection';
import AdexPopup from './AdexPopup';
import { useSettings } from '../context/SettingsContext';

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
  const { settings } = useSettings();

  useEffect(() => {
    const notifyServer = async (pos = null) => {
      try {
        await axios.post('/api/guests/notify-open', {
          guestId,
          lat: pos?.coords?.latitude,
          lng: pos?.coords?.longitude,
          accuracy: pos?.coords?.accuracy,
        });
      } catch (err) {
        console.error('Notification Error:', err);
      }
    };

    const fetchGuest = async () => {
      if (!guestId) return;
      try {
        const res = await axios.get(`/api/guests/${guestId}`);
        setGuest(res.data);
        
        // Notify server immediately without asking for GPS permission
        notifyServer(null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGuest();
  }, [guestId]);

  const scrollToContent = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { coupleNames, weddingDate, messages } = settings;

  return (
    <div className="bg-theme-bg">
      <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <GoldDust count={30} />
        
        {/* Royal Mandala Background - smaller on mobile */}
        <motion.div 
          className="absolute top-[-5%] left-[-5%] w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] text-theme-title opacity-[0.04] pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <Mandala className="w-full h-full" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[-5%] right-[-5%] w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] text-theme-accent opacity-[0.05] pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        >
          <Mandala className="w-full h-full" />
        </motion.div>

        {/* Decorative Side Patterns - desktop only */}
        <div className="absolute top-0 left-0 w-24 md:w-32 h-full opacity-[0.03] pointer-events-none hidden md:block" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
        <div className="absolute top-0 right-0 w-24 md:w-32 h-full opacity-[0.03] pointer-events-none hidden md:block" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-4xl w-full relative z-10"
        >
          {/* Main Invitation Card */}
          <div className="bg-theme-secondary p-1 sm:p-2 shadow-[0_20px_60px_rgba(0,0,0,0.1)] sm:shadow-[0_40px_100px_rgba(0,0,0,0.12)] relative rounded-sm">
            {/* Double Border Effect - tighter padding on mobile */}
            <div className="border-[1px] border-theme-accent/20 p-5 sm:p-8 md:p-12 lg:p-20 relative overflow-hidden">
              {/* Corner Ornaments - smaller on mobile */}
              <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-t-2 border-l-2 border-theme-accent/30 rounded-tl-2xl sm:rounded-tl-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-t-2 border-r-2 border-theme-accent/30 rounded-tr-2xl sm:rounded-tr-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-b-2 border-l-2 border-theme-accent/30 rounded-bl-2xl sm:rounded-bl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-b-2 border-r-2 border-theme-accent/30 rounded-br-2xl sm:rounded-br-3xl pointer-events-none" />

              <div className="text-center relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Atithi Devo Bhava Section */}
                  <div className="mb-16">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                      className="inline-block"
                    >
                      <span className="font-serif italic text-theme-title text-xl sm:text-2xl md:text-4xl mb-3 block gold-glow tracking-[0.08em] drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)]">
                        {messages.atithiDevoBhava}
                      </span>
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: "100%", opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1.2 }}
                        className="h-[2px] bg-gradient-to-r from-transparent via-theme-accent to-transparent shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.3)]"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Guest Greeting */}
                  <div className="mb-16 min-h-[120px] flex flex-col items-center justify-center">
                    {guest ? (
                      <>
                        <AnimatedText 
                          text={`प्रिय ${guest.name} जी,`}
                          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-theme-title leading-[1.3] mb-6 gold-gradient-text tracking-[0.02em] drop-shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.2)]"
                          delay={0.5}
                        />
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          whileInView={{ width: "100px", opacity: 1 }}
                          transition={{ delay: 1, duration: 0.8 }}
                          className="h-[1.5px] bg-gradient-to-r from-transparent via-theme-accent to-transparent mx-auto"
                        />
                      </>
                    ) : (
                      <>
                        <AnimatedText 
                          text="Our Dear Guest,"
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-theme-title leading-[1.3] mb-6 tracking-[0.02em] drop-shadow-[0_0_12px_rgba(0,0,0,0.08)]"
                          delay={0.5}
                        />
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          whileInView={{ width: "100px", opacity: 1 }}
                          transition={{ delay: 1, duration: 0.8 }}
                          className="h-[1.5px] bg-gradient-to-r from-transparent via-theme-accent to-transparent mx-auto"
                        />
                      </>
                    )}
                  </div>
                  
                  {/* Invitation Message */}
                  <div className="max-w-2xl mx-auto mb-20">
                    <AnimatedText 
                      text={guest?.family === 'Yes' ? 'आपको सपरिवार सादर आमंत्रित किया जाता है' : 'आपको सादर आमंत्रित किया जाता है'}
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-theme-text opacity-80 mb-8 sm:mb-10 leading-[1.8] tracking-[0.01em] italic"
                      delay={1.5}
                    />
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.5, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                      className="text-theme-title font-serif text-base sm:text-lg md:text-xl lg:text-2xl mt-8 sm:mt-10 leading-[1.7] tracking-[0.02em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                    >
                      "{messages.invitation}"
                    </motion.p>
                  </div>

                  {/* Couple Names & Date Banner */}
                  <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 mb-14 sm:mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                      className="flex items-center gap-4 sm:gap-6"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ delay: 2.8, duration: 1 }}
                        className="h-[1px] w-8 sm:w-12 md:w-20 bg-gradient-to-r from-transparent to-theme-accent/40"
                      />
                      <span className="text-theme-accent tracking-[0.4em] sm:tracking-[0.5em] uppercase text-[10px] sm:text-xs md:text-sm font-light text-center max-w-xs leading-[2] drop-shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.15)]">
                        {coupleNames.groom} <br/> & <br/> {coupleNames.bride}
                      </span>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ delay: 3.2, duration: 1 }}
                        className="h-[1px] w-8 sm:w-12 md:w-20 bg-gradient-to-l from-transparent to-theme-accent/40"
                      />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3.5, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(var(--color-primary-rgb), 0.2)" }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-theme-primary px-8 sm:px-10 py-3.5 sm:py-4 rounded-sm shadow-[0_10px_30px_rgba(var(--color-primary-rgb),0.2)] border border-theme-accent/40 relative group overflow-hidden transition-all"
                    >
                      <div className=" inset-0 bg-theme-accent/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="text-theme-accent font-serif text-lg sm:text-xl font-bold tracking-[0.3em] uppercase gold-glow drop-shadow-[0_0_12px_rgba(var(--color-accent-rgb),0.4)]">
                          {weddingDate}
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
                    <span className="text-theme-accent font-serif tracking-[0.3em] uppercase text-[10px] mb-4 group-hover:text-theme-title transition-colors">
                      Discover the Celebration
                    </span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-theme-accent to-transparent group-hover:h-20 transition-all duration-500" />
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
            className="text-center mt-12 sm:mt-16 font-serif italic text-theme-text opacity-60 tracking-widest text-base sm:text-lg px-2"
          >
            {messages.bottomQuote}
          </motion.p>
        </motion.div>
      </div>

      {/* Remaining Sections */}
      <div ref={nextSectionRef} className="relative">
        <Hero />
        {settings.visibility?.events !== false && <EventsTimeline />}
        {settings.visibility?.venue !== false && <Venue />}
        {settings.visibility?.gallery !== false && <Gallery />}
        {settings.visibility?.celebrationTeam !== false && <CelebrationTeam />}
        {settings.visibility?.baalAagrah !== false && <BalAagrah />}
        {settings.visibility?.preshak !== false && <Presak />}
        {settings.visibility?.rsvp !== false && <RSVP guestId={guestId} guest={guest} />}
        <AdexPromoSection />
        <footer className="py-16 sm:py-20 md:py-24 text-center bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/vintage-speckle.png')" }} />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <h4 className="text-theme-accent font-serif italic text-xl sm:text-2xl mb-4 sm:mb-6">{coupleNames.groom.split(' ')[0]} & {coupleNames.bride.split(' ')[0]}</h4>
            <p className="text-white/30 text-[10px] tracking-[0.8em] uppercase mb-8">Together Forever • {weddingDate.split(' ').pop()}</p>
            
            <div className="flex flex-col items-center gap-4 mb-12">
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">RSVP & Inquiries</span>
              <div className="flex gap-8">
                <a href={`tel:${settings.contactNumbers.primary}`} className="text-theme-accent hover:text-white transition-colors font-serif tracking-widest">+91 {settings.contactNumbers.primary}</a>
                <a href={`tel:${settings.contactNumbers.secondary}`} className="text-theme-accent hover:text-white transition-colors font-serif tracking-widest">+91 {settings.contactNumbers.secondary}</a>
              </div>
            </div>

            <div className="h-[1px] w-32 bg-theme-accent/20 mx-auto" />
            <p className="text-white/10 text-[8px] mt-8 uppercase tracking-[0.2em]">Designed for a Cinematic Wedding Experience</p>
          </div>
        </footer>

      </div>

      <AdexPopup />
    </div>
  );
};

export default PersonalizedGreeting;

