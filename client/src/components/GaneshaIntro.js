import React from 'react';
import { motion } from 'framer-motion';

const GaneshaIntro = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to right top, #38438b, #944b94, #d75a88, #ff7e71, #ffb25f, #ffeb68)',
        zIndex: 100
      }}
    >
      <div className="relative w-full max-w-[90vw] max-h-[90vw] aspect-square flex items-center justify-center scale-[0.4] sm:scale-50 md:scale-75 lg:scale-100">
        {/* Outer Rotating SVG Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-40"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <svg 
            viewBox="0 0 500 500" 
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* We use a simplified version of the background SVG paths here for performance, 
                as the original file is very large. The main visuals are the rotating circles. */}
            <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="10 5" />
            <circle cx="250" cy="250" r="220" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* Second Rotating Circle Image */}
        <motion.img
          src="https://1.bp.blogspot.com/-zbTJP7CFU1o/XXiYo8bj14I/AAAAAAAATLc/YgdiMIILXq0LwaDbbyN-0Ew9katTRDUQQCLcBGAsYHQ/s1600/second_circle.png"
          alt="decoration"
          className="absolute w-[530px] h-[530px] z-10"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Third Rotating Circle Image */}
        <motion.img
          src="https://1.bp.blogspot.com/-_COGVBH4WyY/XXijt_rn5FI/AAAAAAAATL0/sCQhgcmjUl8amPCCquFtjEmmsxc_y_fyACLcBGAsYHQ/s1600/circle_third.png"
          alt="decoration"
          className="absolute w-[470px] h-[470px] z-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Central Ganesha Image */}
        <motion.img
          src="https://1.bp.blogspot.com/-SE1b77kYVek/XXnnVNN95NI/AAAAAAAATNY/44JshUd59xs9BG-jTUN-E6s3dgR0C3Q5ACLcBGAsYHQ/s1600/Ganesh.png"
          alt="Ganesh Jee"
          className="absolute w-[730px] h-[730px] z-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Cultural Respect Message Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-4 right-4 text-white text-center z-40"
      >
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest opacity-90 font-serif mb-2">
          श्री गणेशाय नमः
        </p>
        <p className="font-serif text-sm md:text-base tracking-[0.3em] uppercase opacity-60">
          Shree Ganeshay Namah
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GaneshaIntro;
