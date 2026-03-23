import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CinematicEntry from './components/CinematicEntry';
import PersonalizedGreeting from './components/PersonalizedGreeting';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import GuestList from './components/admin/GuestList';
import ContentManager from './components/admin/ContentManager';
import ImageManager from './components/admin/ImageManager';
import PrivateRoute from './components/admin/PrivateRoute';
import { SettingsProvider } from './context/SettingsContext';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 2 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/invite/:guestId" element={<PersonalizedGreeting />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="guests" element={<GuestList />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="images" element={<ImageManager />} />
            <Route index element={null} />
          </Route>
        </Routes>

      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [serverReady, setServerReady] = useState(false);
  const serverUrl = useMemo(
    () => process.env.REACT_APP_SERVER_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001'),
    []
  );

  const handleFinishLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const waitForServer = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const res = await fetch(serverUrl, { method: 'GET', signal: controller.signal });
        if (!cancelled && res.ok) {
          setServerReady(true);
          return;
        }
      } catch (e) {
        // ignore and retry
      } finally {
        clearTimeout(timeoutId);
      }

      // Retry with a small delay for a “soft wait”
      setTimeout(() => {
        if (!cancelled) waitForServer();
      }, 1200);
    };

    waitForServer();

    return () => {
      cancelled = true;
    };
  }, [serverUrl]);

  return (
    <SettingsProvider>
      <Router>
        <div className="App">
          {!serverReady ? (
            <div className="min-h-screen min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-8 bg-[#070203]">
              <div className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 text-center shadow-[0_0_80px_rgba(255,215,0,0.07)]">
                <div className="mx-auto mb-5 w-12 h-12 rounded-2xl bg-maroon-700/60 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(128,0,0,0.25)]">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-gold-500/80 rounded-full animate-spin" />
                </div>
                <div className="text-white text-lg font-bold">Waiting for the server…</div>
                <div className="text-white/60 mt-2 text-sm">Please keep this tab open.</div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <CinematicEntry onFinish={handleFinishLoading} />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                >
                  <AnimatedRoutes />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;

