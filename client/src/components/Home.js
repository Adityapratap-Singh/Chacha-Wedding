import React from 'react';
import Hero from './Hero';
import EventsTimeline from './EventsTimeline';
import Venue from './Venue';
import Gallery from './Gallery';

const Home = () => {
  return (
    <div>
      <Hero />
      <EventsTimeline />
      <Venue />
      <Gallery />
    </div>
  );
};

export default Home;
