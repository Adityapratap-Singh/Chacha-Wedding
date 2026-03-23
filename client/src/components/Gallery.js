import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { Plus, Loader2, Camera, Trash2 } from 'lucide-react';
import axios from 'axios';

const Gallery = () => {
  const { settings, refreshSettings } = useSettings();
  const { gallery: images } = settings;
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('token'));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const title = prompt("Enter a title for this memory:");
    if (!title) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });

      const updatedSettings = { ...settings };
      updatedSettings.gallery = [...updatedSettings.gallery, { url: res.data.url, title }];

      await axios.post('/api/content', { settings: updatedSettings }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });

      refreshSettings();
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (e, idx) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this memory?")) return;

    try {
      const updatedSettings = { ...settings };
      updatedSettings.gallery = updatedSettings.gallery.filter((_, i) => i !== idx);

      await axios.post('/api/content', { settings: updatedSettings }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      refreshSettings();
    } catch (err) {
      console.error(err);
      alert('Failed to remove image');
    }
  };

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-gold-500 uppercase tracking-[0.4em] text-xs font-semibold block mb-3"
            >
              Capturing Moments
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-maroon-700"
            >
              {settings.messages.galleryTitle} <span className="text-gray-400 font-light mx-2">|</span> <span className="italic">{settings.messages.gallerySubtitle}</span>
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Ticker */}
      {images.length > 0 ? (
        <div className="relative flex overflow-hidden group py-4">
          <motion.div 
            className="flex whitespace-nowrap"
            animate={{ x: [0, "-33.333%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: Math.max(images.length * 5, 10), 
                ease: "linear",
              },
            }}
            whileHover={{ animationPlayState: 'paused' }}
          >
            {duplicatedImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative inline-block w-[280px] sm:w-[350px] md:w-[450px] aspect-[4/5] mx-3 sm:mx-4 md:mx-6 rounded-2xl overflow-hidden shadow-2xl shadow-black/10 cursor-pointer group/item"
                onClick={() => setSelectedImg(image)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 sm:p-8">
                  <span className="text-gold-500 text-xs tracking-widest uppercase mb-2">{image.title}</span>
                  <p className="text-white font-serif italic text-lg sm:text-xl">{settings.coupleNames.groom} & {settings.coupleNames.bride}</p>
                  
                  {isAdmin && index < images.length && (
                    <button 
                      onClick={(e) => removeImage(e, index)}
                      className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
      ) : (
        <div className="py-20 text-center">
          <Camera className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-serif italic">Gallery is being updated. Check back soon!</p>
        </div>
      )}

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            >
              <button 
                onClick={() => setSelectedImg(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
              >
                CLOSE [X]
              </button>
              
              <img
                src={selectedImg.url}
                alt={selectedImg.title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              <div className="mt-6 text-center">
                <h3 className="text-white font-serif text-2xl mb-2">{selectedImg.title}</h3>
                <div className="h-[1px] w-12 bg-gold-500 mx-auto" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;

