import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';

const Hero = lazy(() => import('./Hero'));
const EventsTimeline = lazy(() => import('./EventsTimeline'));
const Venue = lazy(() => import('./Venue'));
const Gallery = lazy(() => import('./Gallery'));
const RSVP = lazy(() => import('./RSVP'));
const CelebrationTeam = lazy(() => import('./CelebrationTeam'));
const BalAagrah = lazy(() => import('./BalAagrah'));
const Presak = lazy(() => import('./Presak'));
const AdexPromoSection = lazy(() => import('./AdexPromoSection'));
const AdexPopup = lazy(() => import('./AdexPopup'));

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
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
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
      </Suspense>
    </div>
  );
};

export default Home;
