import React from 'react';
import { motion } from 'framer-motion';

const Venue = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gold-500 uppercase tracking-[0.4em] text-xs font-semibold block mb-4"
          >
            Location
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900"
          >
            The Venue
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-[1px] bg-gold-500 mx-auto mt-6" 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-[#fdfbf7] p-5 sm:p-6 md:p-8 lg:p-12 text-center border border-gray-100 shadow-sm overflow-hidden group"
        >
          {/* Decorative Background Element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-maroon-700 mb-3 sm:mb-4">Mohan Bakshu Guest House</h3>
            <div className="space-y-1 sm:space-y-2 mb-6 sm:mb-8">
              <p className="text-gray-600 text-base sm:text-lg">Hansi, Near Petrol Pump</p>
              <p className="text-gray-600 text-lg">Biwar Road, District Hamirpur</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <motion.a
                whileHover={{ y: -5 }}
                href="https://www.google.com/maps/search/?api=1&query=Mohan+Bakshu+Guest+House,+Hansi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block min-h-[48px] bg-white border border-gold-500 text-gold-500 px-8 sm:px-10 py-3.5 sm:py-4 rounded-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs font-bold hover:bg-gold-500 hover:text-white transition-all duration-500 flex items-center justify-center"
              >
                View on Google Maps
              </motion.a>
              
              <p className="text-gray-400 font-serif italic text-sm">
                Valet parking available for all guests.
              </p>
            </div>
          </div>

          {/* Abstract corner ornament */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl group-hover:bg-gold-500/10 transition-colors" />
        </motion.div>
      </div>
    </section>
  );
};

export default Venue;
