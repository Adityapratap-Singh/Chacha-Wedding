import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  { url: '/images/image1.jpg', title: 'The Beginning' },
  { url: '/images/image2.jpg', title: 'Love & Laughter' },
  { url: '/images/image3.jpg', title: 'Eternal Bond' },
  // Adding placeholders for better grid
  { url: '/images/image1.jpg', title: 'Pre-Wedding' },
  { url: '/images/image2.jpg', title: 'Haldi Moments' },
  { url: '/images/image3.jpg', title: 'Together Forever' },
];

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gold-500 uppercase tracking-[0.4em] text-xs font-semibold block mb-4"
          >
            Capturing Moments
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900"
          >
            Our Gallery
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-[1px] bg-gold-500 mx-auto mt-6" 
          />
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-sm"
              onClick={() => setSelectedImg(image)}
            >
              <motion.img
                src={image.url}
                alt={image.title}
                className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-gold-500 text-xs tracking-widest uppercase mb-1">{image.title}</span>
                <p className="text-white font-serif italic">Pushpendra & Renu</p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-3 sm:p-4 md:p-10"
              onClick={() => setSelectedImg(null)}
            >
              <motion.button 
                className="absolute top-4 right-4 sm:top-10 sm:right-10 text-white/50 hover:text-white text-3xl sm:text-4xl min-w-[48px] min-h-[48px] flex items-center justify-center"
                onClick={() => setSelectedImg(null)}
              >
                &times;
              </motion.button>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImg.url}
                  alt={selectedImg.title}
                  className="w-full h-auto max-h-[85vh] object-contain shadow-2xl"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-white font-serif text-2xl tracking-wide">{selectedImg.title}</h3>
                  <div className="w-8 h-[1px] bg-gold-500 mx-auto mt-2" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
