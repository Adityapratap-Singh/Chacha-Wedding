import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Hero from './Hero';
import EventsTimeline from './EventsTimeline';
import Venue from './Venue';
import Gallery from './Gallery';
import RSVP from './RSVP';
import CelebrationTeam from './CelebrationTeam';
import BalAagrah from './BalAagrah';
import Presak from './Presak';
import AdexPromoSection from './AdexPromoSection';
import AdexPopup from './AdexPopup';
import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const { settings } = useSettings();
  const { visibility } = settings;

  useEffect(() => {
    const fetchGuest = async () => {
      if (!guestId) return;
      try {
        const res = await axios.get(`/api/guests/${guestId}`);
        setGuest(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGuest();
  }, [guestId]);

  return (
    <div>
      <Hero />
      {visibility.events && <EventsTimeline />}
      {visibility.venue && <Venue />}
      {visibility.gallery && <Gallery />}
      {visibility.celebrationTeam && <CelebrationTeam />}
      {visibility.baalAagrah && <BalAagrah />}
      {visibility.preshak && <Presak />}
      {visibility.rsvp && <RSVP guestId={guestId} guest={guest} />}
      {visibility.adexPromo && <AdexPromoSection />}
      {visibility.adexPopup && <AdexPopup />}
    </div>
  );
};

export default Home;
