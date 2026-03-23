import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const BalAagrah = () => {
  const { settings } = useSettings();
  const { baalAagrah } = settings;
  const { names, poem } = baalAagrah;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };

  const nameVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Split poem by lines if it's a single string with newlines, or use it as is
  const poemLines = poem.includes('\n') ? poem.split('\n') : [poem];

  return (
    <section className="py-20 sm:py-28 bg-[#fefcf9] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center"
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="mb-12">
            <span className="text-gold-500 text-3xl mb-2 block">✨</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-maroon-700 mb-4 tracking-wide">
              बाल आग्रह
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gold-500/30" />
              <p className="text-xs sm:text-sm text-gold-600/60 uppercase tracking-[0.3em] font-light">
                With Innocent Hearts
              </p>
              <div className="h-px w-12 bg-gold-500/30" />
            </div>
          </motion.div>

          {/* Highlighted Poem Card */}
          <motion.div 
            variants={itemVariants}
            className="relative mb-16 group"
          >
            {/* Soft Glow Effect */}
            <div className="absolute inset-0 bg-gold-500/5 blur-3xl rounded-full scale-75 group-hover:scale-90 transition-transform duration-1000" />
            
            <div className="relative bg-white/70 backdrop-blur-md border border-gold-500/20 rounded-[2rem] p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(184,134,11,0.05)] overflow-hidden">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-gold-500/10 rounded-tl-[2rem]" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-gold-500/10 rounded-br-[2rem]" />
              
              <div className="italic text-gray-800 leading-relaxed text-xl sm:text-2xl md:text-3xl font-serif font-medium space-y-4">
                {poemLines.map((line, idx) => (
                  <p key={idx} className="drop-shadow-sm">{line}</p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Names & Images Cards Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
          >
            {names.map((name, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group flex flex-col items-center"
              >
                {/* Child Photo Card */}
                <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden border-2 border-gold-500/20 group-hover:border-gold-500/80 transition-all duration-500 shadow-lg group-hover:shadow-gold-500/20">
                  <img 
                    src={baalAagrah.images && baalAagrah.images[index] && baalAagrah.images[index].url ? baalAagrah.images[index].url : `https://res.cloudinary.com/do4z0pybd/image/upload/w_400,h_400,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=${encodeURIComponent(name.split(' ')[0])}&bg_8B0000&co_FFFDD0&f_png`} 
                    alt={name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ objectPosition: `center ${baalAagrah.images && baalAagrah.images[index] ? baalAagrah.images[index].objectPosition || 'center' : 'center'}` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Child Name */}
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-lg sm:text-xl font-serif text-maroon-700 group-hover:text-gold-600 transition-colors duration-300">
                    {name}
                  </span>
                  <div className="h-px w-0 group-hover:w-full bg-gold-500/40 transition-all duration-500 mx-auto mt-1" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Sentiment */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 opacity-40 font-serif italic text-sm tracking-widest text-gray-500"
          >
            "बच्चों की मासूमियत से किया गया निमंत्रण ❤️"
          </motion.div>
        </motion.div>
      </div>

      {/* Floating background petals/elements (Optional subtle feel) */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-gold-500/20 rounded-full blur-sm" />
      <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-maroon-700/10 rounded-full blur-sm" />
    </section>
  );
};

export default BalAagrah;

