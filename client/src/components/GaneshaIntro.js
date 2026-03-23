import React from 'react';
import { motion } from 'framer-motion';
import GoldDust from './GoldDust';

const GaneshaIntro = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(2px)' }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0a0000]"
      style={{
        zIndex: 100
      }}
    >
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-800/40 blur-[120px] rounded-full animate-blob-move-1" />
        <div className="absolute top-[20%] right-[-5%] w-[45%] h-[45%] bg-yellow-600/30 blur-[100px] rounded-full animate-blob-move-2" />
        <div className="absolute bottom-[10%] left-[-5%] w-[55%] h-[55%] bg-blue-900/40 blur-[130px] rounded-full animate-blob-move-3" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-green-800/30 blur-[110px] rounded-full animate-blob-move-4" />
      </div>

      {/* Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none animate-pattern-pulse"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.5 15.5L45 15l-12.5 10L45 45l-15-2.5L15 45l12.5-20L15 15l12.5.5L30 0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}
      />

      <GoldDust count={80} />
      
      <style>
        {`
          @keyframes blob-move-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30%, 20%) scale(1.1); }
            66% { transform: translate(-10%, 40%) scale(0.9); }
          }
          @keyframes blob-move-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-40%, 30%) scale(0.8); }
            66% { transform: translate(20%, -20%) scale(1.2); }
          }
          @keyframes blob-move-3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(20%, -40%) scale(1.15); }
            66% { transform: translate(50%, 10%) scale(0.85); }
          }
          @keyframes blob-move-4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-30%, -20%) scale(0.9); }
            66% { transform: translate(-50%, -50%) scale(1.1); }
          }
          @keyframes pattern-pulse {
            0%, 100% { transform: scale(1); opacity: 0.03; }
            50% { transform: scale(1.05); opacity: 0.05; }
          }
          .animate-blob-move-1 { animation: blob-move-1 25s infinite alternate ease-in-out; }
          .animate-blob-move-2 { animation: blob-move-2 30s infinite alternate ease-in-out; }
          .animate-blob-move-3 { animation: blob-move-3 28s infinite alternate ease-in-out; }
          .animate-blob-move-4 { animation: blob-move-4 32s infinite alternate ease-in-out; }
          .animate-pattern-pulse { animation: pattern-pulse 15s infinite ease-in-out; }
          
          .text-cold-white {
            color: #F8F9FF;
            text-shadow: 
              0 1px 0 #D1D5DB,
              0 2px 0 #C4C7CC,
              0 3px 0 #B7BAbF,
              0 4px 0 #A9ACB3,
              0 5px 0 #9C9EA6,
              0 6px 1px rgba(0,0,0,.15),
              0 0 5px rgba(255,255,255,0.2),
              0 1px 3px rgba(0,0,0,0.4),
              0 5px 15px rgba(0,0,0,0.3),
              0 10px 30px rgba(0,0,0,0.25);
          }
          .ganesha-glow {
            filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.3));
          }
        `}
      </style>
      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] lg:w-[620px] lg:h-[620px] max-w-[90vw] max-h-[90vw] aspect-square flex items-center justify-center">
        {/* Soft Radial Glow behind Ganesha */}
        <div className="absolute inset-0 bg-radial-gradient from-white/20 via-transparent to-transparent opacity-40 blur-3xl rounded-full scale-75" />
        
        {/* Outer Rotating SVG Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          <svg 
            viewBox="0 0 500 500" 
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="15 10" />
            <circle cx="250" cy="250" r="225" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* Second Rotating Circle Image */}
        <motion.img
          src="https://1.bp.blogspot.com/-zbTJP7CFU1o/XXiYo8bj14I/AAAAAAAATLc/YgdiMIILXq0LwaDbbyN-0Ew9katTRDUQQCLcBGAsYHQ/s1600/second_circle.png"
          alt="decoration"
          className="absolute w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] z-10 opacity-80"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Third Rotating Circle Image */}
        <motion.img
          src="https://1.bp.blogspot.com/-_COGVBH4WyY/XXijt_rn5FI/AAAAAAAATL0/sCQhgcmjUl8amPCCquFtjEmmsxc_y_fyACLcBGAsYHQ/s1600/circle_third.png"
          alt="decoration"
          className="absolute w-[180px] h-[180px] sm:w-[230px] sm:h-[230px] md:w-[290px] md:h-[290px] lg:w-[350px] lg:h-[350px] z-20 opacity-90"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Central Ganesha Image */}
        <motion.img
          src="https://1.bp.blogspot.com/-SE1b77kYVek/XXnnVNN95NI/AAAAAAAATNY/44JshUd59xs9BG-jTUN-E6s3dgR0C3Q5ACLcBGAsYHQ/s1600/Ganesh.png"
          alt="Ganesh Jee"
          className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[460px] md:h-[460px] lg:w-[540px] lg:h-[540px] z-30 object-contain ganesha-glow"
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      </div>

      {/* Cultural Respect Message Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 1, type: "spring", stiffness: 80 }}
        className="absolute bottom-6 sm:bottom-10 left-4 right-4 text-center z-40"
      >
        <p className="text-cold-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-normal font-serif mb-4 transform perspective-1000">
          श्री गणेशाय नमः
        </p>
        <p className="text-cold-white font-serif text-lg md:text-xl tracking-tight uppercase opacity-90 drop-shadow-xl">
          Shree Ganeshay Namah
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GaneshaIntro;
