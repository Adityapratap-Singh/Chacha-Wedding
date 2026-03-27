import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const C = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.2 } } },
  item: { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } } },
};

const MemberCard = ({ member, teamIndex, memberIndex }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      variants={C.item}
      className="flex flex-col items-center p-4 sm:p-5 rounded-2xl relative overflow-hidden cursor-default"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(229,168,48,0.07)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      }}
    >
      {/* Photo */}
      <div className="relative mb-4">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden relative"
          style={{
            border: '2px solid rgba(229,168,48,0.12)',
          }}
        >
          {!imgLoaded && !imgErr && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent animate-pulse" />
          )}
          {imgErr ? (
            <div className="w-full h-full flex items-center justify-center text-2xl"
              style={{ background: 'rgba(229,168,48,0.06)' }}>👤</div>
          ) : (
            <img
              src={member.photo}
              alt={member.name}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ objectPosition: `center ${member.objectPosition || 'top'}` }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgErr(true)}
            />
          )}
        </div>
      </div>

      {/* Name */}
      <h4
        className="text-center leading-snug transition-colors duration-400"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          color: 'rgba(240,230,208,0.80)',
        }}
      >
        {member.name}
      </h4>

      {member.subtitle && (
        <p className="text-yellow-400/40 font-light mt-0.5 text-center" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.05em' }}>
          {member.subtitle}
        </p>
      )}

      {member.contact && (
        <a href={`tel:${member.contact}`} className="mt-1.5 text-yellow-400/60"
          style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em' }}>
          {member.contact}
        </a>
      )}
    </motion.div>
  );
};

const CelebrationTeam = () => {
  const { settings } = useSettings();

  const defaultTeams = [
    {
      title: 'विनीत',
      titleEn: 'Revered Elders',
      members: [
        { name: 'राकेश सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=RS' },
        { name: 'अंबरीश सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=AS' },
        { name: 'पुरंदर सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=PS' },
        { name: 'धीरेन्द्र सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=DS' },
        { name: 'कीरत सिंह', contact: settings.contactNumbers.primary || '9001787742', photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=KS' },
        { name: 'गजेन्द्र प्रताप सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=GPS' },
      ],
    },
    {
      title: 'दर्शनाभिलाषी',
      titleEn: 'Wish to Celebrate',
      members: [
        { name: 'आशु सिंह', subtitle: 'बी.एड एवं टीईटी', contact: settings.contactNumbers.secondary || '8953731369', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774185956/image_2026-03-22_185552665_znqxuq.png' },
        { name: 'प्रियम सिंह', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774187830/image_2026-03-22_192704296_itlegs.png' },
        { name: 'आदित्यप्रताप सिंह', subtitle: 'आईटी इंजीनियर', contact: null, photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774186946/image_2026-03-22_191223763_xf9pgj.png' },
        { name: 'दीप सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=DS' },
        { name: 'ओम सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=OS' },
      ],
    },
    {
      title: 'स्वागतकांक्षी',
      titleEn: 'Warm Welcomers',
      members: [
        { name: 'धीरेन्द्र प्रताप सिंह', subtitle: 'सीआरपीएफ इंस्पेक्टर', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=DPS' },
        { name: 'राहुल सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=RS' },
        { name: 'धीरज सिंह', contact: null, photo: 'https://via.placeholder.com/200/0a0a0f/e5a830?text=DS2' },
      ],
    },
  ];

  const teams = settings.teams || defaultTeams;

  return (
    <>
      {/* Section divider */}
      <div className="gold-divider mx-auto my-4 opacity-20" style={{ width: '200px' }} />

      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}
      >
        {/* Ambient orbs */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(229,168,48,0.04) 0%, transparent 70%)', animation: 'orb-pulse 11s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,134,14,0.03) 0%, transparent 70%)', animation: 'orb-pulse 14s ease-in-out 6s infinite' }} />

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
          {/* Header */}
          <div className="text-center mb-14 sm:mb-18">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label block mb-4"
            >
              The Celebration Team
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 1 }}
              className="gold-text text-glow-gold italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              उत्सव परिवार
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="gold-divider mx-auto mt-5"
              style={{ width: '80px', transformOrigin: 'center' }}
            />
          </div>

          {/* Teams */}
          <div
            className="rounded-2xl p-5 sm:p-8 md:p-10"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(229,168,48,0.08)' }}
          >
            <motion.div
              variants={C.container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16 sm:space-y-20"
            >
              {teams.map((team, ti) => (
                <motion.div key={ti} variants={C.item}>
                  {/* Team title */}
                  <div className="text-center mb-10 sm:mb-12">
                    <h3
                      className="text-yellow-100/80 italic mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
                    >
                      {team.title}
                    </h3>
                    <p className="section-label text-[9px]">{team.titleEn}</p>
                    <div className="gold-divider mx-auto mt-3" style={{ width: '50px', opacity: 0.35 }} />
                  </div>

                  {/* Members */}
                  <motion.div
                    variants={C.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                  >
                    {team.members.map((m, mi) => (
                      <MemberCard key={mi} member={m} teamIndex={ti} memberIndex={mi} />
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CelebrationTeam;
