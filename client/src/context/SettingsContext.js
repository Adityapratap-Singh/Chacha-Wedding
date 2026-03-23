
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    coupleNames: { bride: "Renu Singh", groom: "Pushpendra Kumar Singh (Lalla Bhaiya)" },
    weddingDate: "12 May 2026",
    venue: {
      name: "माँ अम्बे गेस्ट हाउस",
      address: "छानी",
      mapUrl: "https://www.google.com/maps",
      transportInfo: "सभी अतिथियों के लिए वाहन सेवा उपलब्ध है"
    },
    events: [
      { 
        name: 'मंडपाच्छादन', 
        date: '10 मई 2026', 
        time: 'प्रातः 10:00 बजे', 
        description: 'मंगलमय आरंभ और शुभ विधियों का आयोजन।',
        icon: '✨'
      },
      { 
        name: 'मायका पूजन', 
        date: '11 मई 2026', 
        time: 'संध्या 07:00 बजे', 
        description: 'पारिवारिक रीति-रिवाजों और प्रेम का सुंदर संगम।',
        icon: '🎵'
      },
      { 
        name: 'स्वागत बारात', 
        date: '12 मई 2026', 
        time: 'रात्रि 08:00 बजे', 
        description: 'खुशियों और उत्साह के साथ बारात का भव्य स्वागत।',
        icon: '💍'
      },
      { 
        name: 'भीगी पलकें', 
        date: '13 मई 2026', 
        time: 'संध्या 07:30 बजे', 
        description: 'भावनाओं से भरी विदाई का मधुर पल।',
        icon: '🥂'
      },
    ],
    baalAagrah: {
      poem: "चाचा की शादी का प्यारा सा मौका है, खुशियों से भरा ये हर एक झोंका है। आपका आना हमारे लिए विशेष रहेगा, आइए मिलकर इस पल को यादगार बनाएं ❤️",
      names: ['अभिनव सिंह', 'आराध्या सिंह', 'वैष्णवी सिंह', 'दिव्यांका सिंह', 'आर्य सिंह', 'अभ्योदय प्रताप सिंह', 'अविराज सिंह'],
      images: [
        { url: '', objectPosition: 'center' },
        { url: '', objectPosition: 'center' },
        { url: '', objectPosition: 'center' },
        { url: '', objectPosition: 'center' },
        { url: '', objectPosition: 'center' },
        { url: '', objectPosition: 'center' },
        { url: '', objectPosition: 'center' }
      ]
    },
    contactNumbers: { primary: "7355259901", secondary: "8953731369" },
    preshak: {
      name: "श्री अमर सिंह",
      image: "https://res.cloudinary.com/do4z0pybd/image/upload/w_400,h_400,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%85%E0%A4%AE%E0%A4%B0%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png",
      quote: "यह निमंत्रण व्यक्तिगत रूप से दिया गया है ❤️"
    },
    teams: [
      {
        title: 'विनीत',
        titleEn: 'Revered Elders',
        members: [
          { name: 'राकेश सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%B0%E0%A4%BE%E0%A4%95%E0%A5%87%E0%A4%B6%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
          { name: 'अंबरीश सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%82%E0%A4%AC%E0%A4%B0%E0%A5%80%E0%A4%B6%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
          { name: 'पुरंदर सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%AA%E0%A5%81%E0%A4%B0%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
          { name: 'धीरेन्द्र सिंह', photo: 'https://via.placeholder.com/200/8B0000/FFFDD0?text=धीरेन्द्र', objectPosition: 'center' },
          { name: 'कीरत सिंह', contact: '9001787742', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%95%E0%A5%80%E0%A4%B0%E0%A4%A4%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
          { name: 'गजेन्द्र प्रताप सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%97%E0%A4%9C%E0%A5%87%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%8D%E0%A4%B0%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A4%E0%A4%BE%E0%A4%AA%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
        ]
      },
      {
        title: 'दर्शनाभिलाषी',
        titleEn: 'Wish to Celebrate',
        members: [
          { name: 'आशु सिंह', subtitle: '(बी.एड एवं टीईटी)', contact: '8953731369', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774185956/image_2026-03-22_185552665_znqxuq.png?text=आशु', objectPosition: 'center' },
          { name: 'प्रियम सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774187830/image_2026-03-22_192704296_itlegs.png', objectPosition: 'center' },
          { name: 'आदित्यप्रताप सिंह', subtitle: '(आईटी इंजीनियर)', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/v1774186946/image_2026-03-22_191223763_xf9pgj.png', objectPosition: 'center' },
          { name: 'दीप सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%A6%E0%A5%80%E0%A4%AA%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
          { name: 'ओम सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%93%E0%A4%AE%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
        ]
      },
      {
        title: 'स्वागतकांक्षी',
        titleEn: 'Warm Welcomers',
        members: [
          { name: 'धीरेन्द्र प्रताप सिंह', subtitle: '(सीआरपीएफ इंस्पेक्टर)', photo: 'https://via.placeholder.com/200/8B0000/FFFDD0?text=धीरेन्द्र', objectPosition: 'center' },
          { name: 'राहुल सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%B0%E0%A4%BE%E0%A4%B9%E0%A5%81%E0%A4%B2%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' },
          { name: 'धीरज सिंह', photo: 'https://res.cloudinary.com/do4z0pybd/image/upload/w_300,h_300,c_fill,r_max,a_center,g_center/v1/wedding-avatar-gold?text=%E0%A4%A7%E0%A5%80%E0%A4%B0%E0%A4%9C%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9&bg_8B0000&co_FFFDD0&f_png', objectPosition: 'center' }
        ]
      }
    ],
    gallery: [
      { url: '/images/image1.jpg', title: 'The Beginning' },
      { url: '/images/image2.jpg', title: 'Love & Laughter' },
      { url: '/images/image3.jpg', title: 'Eternal Bond' },
      { url: '/images/image1.jpg', title: 'Pre-Wedding' },
      { url: '/images/image2.jpg', title: 'Haldi Moments' },
      { url: '/images/image3.jpg', title: 'Together Forever' },
    ],
    messages: {
      invitation: "Join us as we celebrate the union of two hearts",
      atithiDevoBhava: "Atithi Devo Bhava",
      bottomQuote: "Your presence will make our celebration complete.",
      heroSubtitle: "The Celebration of Love",
      saveTheDate: "Save the Date",
      venueTitle: "स्थान",
      viewOnMap: "मैप पर देखें",
      galleryTitle: "हमारी यादें",
      gallerySubtitle: "Our Gallery",
      eventsTitle: "कार्यक्रम",
      eventsSubtitle: "विवाह समारोह",
      eventsJourney: "The Journey"
    },
    visibility: {
      gallery: true,
      events: true,
      venue: true,
      rsvp: true,
      baalAagrah: true,
      celebrationTeam: true,
      preshak: true,
      adexPromo: true,
      adexPopup: true
    }
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/content');
      if (res.data && Object.keys(res.data).length > 0) {
        setSettings(prev => ({
          ...prev,
          ...res.data,
          messages: { ...prev.messages, ...(res.data.messages || {}) },
          visibility: { ...prev.visibility, ...(res.data.visibility || {}) },
          coupleNames: { ...prev.coupleNames, ...(res.data.coupleNames || {}) },
          venue: { ...prev.venue, ...(res.data.venue || {}) },
          baalAagrah: { ...prev.baalAagrah, ...(res.data.baalAagrah || {}) },
          preshak: { ...prev.preshak, ...(res.data.preshak || {}) }
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
