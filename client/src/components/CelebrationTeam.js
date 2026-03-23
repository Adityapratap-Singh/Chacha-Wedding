import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const CelebrationTeam = () => {
  const { settings } = useSettings();
  const { contactNumbers, teams: settingsTeams } = settings;

  const defaultTeams = [
    {
      title: 'विनीत',
      titleEn: 'Revered Elders',
      members: [
        { name: 'राकेश सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%B0%E0%A4%BE%E0%A4%95%E0%A5%87%E0%A4%B6%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
        { name: 'अंबरीश सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%85%E0%A4%82%E0%A4%AC%E0%A4%B0%E0%A5%80%E0%A4%B6%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
        { name: 'पुरंदर सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%AA%E0%A5%81%E0%A4%B0%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
        { name: 'धीरेन्द्र सिंह', contact: null, photo: 'https://via.placeholder.com/200/8B0000/FFFDD0?text=धीरेन्द्र' },
        { name: 'कीरत सिंह', contact: contactNumbers.primary || '9001787742', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%95%E0%A5%80%E0%A4%B0%E0%A4%A4%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
        { name: 'गजेन्द्र प्रताप सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%97%E0%A4%9C%E0%A5%87%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%8D%E0%A4%B0%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A4%E0%A4%BE%E0%A4%AA%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
      ]
    },
    {
      title: 'दर्शनाभिलाषी',
      titleEn: 'Wish to Celebrate',
      members: [
        { name: 'आशु सिंह', subtitle: '(बी.एड एवं टीईटी)', contact: contactNumbers.secondary || '8953731369', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774185956/image_2026-03-22_185552665_znqxuq.png?text=आशु' },
        { name: 'प्रियम सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774187830/image_2026-03-22_192704296_itlegs.png' },
        { name: 'आदित्यप्रताप सिंह', subtitle: '(आईटी इंजीनियर)', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774186946/image_2026-03-22_191223763_xf9pgj.png' },
        { name: 'दीप सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%A6%E0%A5%80%E0%A4%AA%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
        { name: 'ओम सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%93%E0%A4%AE%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
      ]
    },
    {
      title: 'स्वागतकांक्षी',
      titleEn: 'Warm Welcomers',
      members: [
        { name: 'धीरेन्द्र प्रताप सिंह', subtitle: '(सीआरपीएफ इंस्पेक्टर)', contact: null, photo: 'https://via.placeholder.com/200/8B0000/FFFDD0?text=धीरेन्द्र' },
        { name: 'राहुल सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%B0%E0%A4%BE%E0%A4%99%E0%A5%81%E0%A4%B2%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' },
        { name: 'धीरज सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%A7%E0%A5%80%E0%A4%B0%E0%A4%9C%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png' }
      ]
    }
  ];

  const teams = settingsTeams || defaultTeams;


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };

  const [imageErrors, setImageErrors] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});

  return (
    <>
      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        style={{ transformOrigin: "center" }}
        className="h-[2px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mx-auto my-8 sm:my-12 md:my-16 max-w-3xl"
      />

      <section className="py-16 sm:py-20 md:py-24 bg-[#fdfaf5] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="rounded-2xl border border-gold-500/20 bg-white/80 backdrop-blur-sm p-5 sm:p-8 md:p-10 shadow-[0_20px_45px_rgba(0,0,0,0.06)]">

            {/* Teams Container */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16 sm:space-y-20 md:space-y-24"
            >
              {teams.map((team, teamIndex) => (
                <motion.div key={teamIndex} variants={itemVariants} className="relative">
                  {/* Team Title */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: teamIndex * 0.1 + 0.1, duration: 0.6 }}
                    className="text-center mb-12 sm:mb-14 md:mb-16"
                  >
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-maroon-700 mb-1">
                      {team.title}
                    </h3>
                    <p className="text-sm text-gold-500 tracking-[0.1em] uppercase font-light">
                      {team.titleEn}
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "60px" }}
                      viewport={{ once: true }}
                      transition={{ delay: teamIndex * 0.1 + 0.3, duration: 0.8 }}
                      className="h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mt-3"
                    />
                  </motion.div>

                  {/* Team Members Grid */}
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {team.members.map((member, memberIndex) => (
                      <motion.div
                        key={memberIndex}
                        variants={itemVariants}
                        className="group flex flex-col items-center rounded-3xl border-2 border-maroon-200/50 bg-gradient-to-b from-white/90 to-cream-50/80 p-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-gold-500/40 hover:border-gold-500/80 hover:bg-gradient-to-b hover:from-gold-50/60 hover:to-cream-50 cursor-pointer relative overflow-hidden hover:rotate-[0.5deg]"
                      >
                        {/* Circular Photo */}
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.4 }}
                          className="relative mb-4 group"
                        >
                          {/* Glow Effect */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-500/30 to-transparent blur-lg -z-10 group-hover:blur-xl transition-all duration-500"
                          />

                          {/* Photo Container */}
                          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-square rounded-xl overflow-hidden border-2 border-gold-500/20 group-hover:border-gold-500/80 ring-2 ring-transparent group-hover:ring-gold-500/30 transition-all duration-500 shadow-[0_8px_24px_rgba(128,0,0,0.1)] group-hover:shadow-[0_20px_40px_rgba(255,215,0,0.25)] relative bg-gradient-to-br from-white to-cream-50">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105 group-hover:saturate-110 rounded-xl" 
                              style={{ objectPosition: `center ${member.objectPosition || 'top'}` }}
                              loading="lazy"
                              decoding="async"
                              onLoad={() => setImageLoaded(prev => ({ ...prev, [`${teamIndex}-${memberIndex}`]: true }))}
                              onError={() => setImageErrors(prev => ({ ...prev, [`${teamIndex}-${memberIndex}`]: true }))}
                            />
                            {!imageLoaded[`${teamIndex}-${memberIndex}`] && (
                              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl" />
                            )}
                            {imageErrors[`${teamIndex}-${memberIndex}`] && (
                              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-maroon-700/20 flex items-center justify-center rounded-xl">
                                <span className="text-xs text-gold-500 font-serif">👤</span>
                              </div>
                            )}

                            {/* Overlay on hover */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 bg-gradient-to-t from-maroon-700/40 to-transparent"
                            />
                          </div>
                        </motion.div>

                        {/* Name */}
                        <motion.h4
                          initial={{ opacity: 0, y: 5 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: memberIndex * 0.05 + teamIndex * 0.1 + 0.2, duration: 0.5 }}
                          className="text-sm sm:text-base md:text-lg font-serif text-maroon-700 text-center leading-snug tracking-[0.01em]"
                        >
                          {member.name}
                        </motion.h4>

                        {/* Subtitle (if exists) */}
                        {member.subtitle && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: memberIndex * 0.05 + teamIndex * 0.1 + 0.3, duration: 0.5 }}
                            className="text-xs text-gray-600 font-light mt-0.5 text-center"
                          >
                            {member.subtitle}
                          </motion.p>
                        )}

                        {/* Contact */}
                        {member.contact && (
                          <motion.a
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: memberIndex * 0.05 + teamIndex * 0.1 + 0.4, duration: 0.5 }}
                            href={`tel:${member.contact}`}
                            className="text-xs text-gold-500 font-light tracking-widest mt-1 hover:text-gold-600 transition-colors duration-300"
                          >
                            📞 {member.contact}
                          </motion.a>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Background Accents */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold-500/5 to-transparent rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-maroon-700/3 to-transparent rounded-full blur-3xl pointer-events-none"
        />
      </section>
    </>
  );
};

export default CelebrationTeam;
