
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

const MandalaBg = () => {
  return (
    <svg
      className="w-[560px] h-[560px] opacity-25"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <path
        d="M100 20 L110 40 L130 40 L120 60 L130 80 L110 80 L100 100 L90 80 L70 80 L80 60 L70 40 L90 40 Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <path
        d="M100 10 L120 30 L150 30 L140 60 L160 90 L130 90 L120 120 L100 100 L80 120 L70 90 L40 90 L60 60 L50 30 L80 30 Z"
        stroke="currentColor"
        strokeWidth="0.35"
        opacity="0.65"
      />
      <circle cx="100" cy="100" r="2" fill="currentColor" />
    </svg>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const particles = useMemo(() => {
    const count = 28;
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = 1.5 + Math.random() * 2.2;
      const delay = Math.random() * 1.8;
      const duration = 4.5 + Math.random() * 4.5;
      return { id: i, left, top, size, delay, duration };
    });
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden flex items-center justify-center px-4 sm:px-6 py-8 bg-gradient-to-br from-[#070203] via-[#160406] to-[#0b0103]">
      {/* Cinematic gold glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,215,0,0.22),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(128,0,0,0.25),transparent_35%)]" />
      <div className="absolute inset-0 pointer-events-none login-noise" />

      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-500/40"
        initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ duration: 55, ease: 'linear', repeat: Infinity }}
      >
        <MandalaBg />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gold-500/50"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: [0, 0.55, 0], y: [8, -18, 8], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-gold-500 shadow-[0_0_36px_rgba(255,215,0,0.12)] mb-4"
          >
            <ShieldCheck size={32} />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            <span className="gold-gradient-text gold-glow">Admin Portal</span>
          </h1>
          <p className="text-white/60 mt-2">Enter to access Pushpendra & Renu's Wedding Control</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
          onSubmit={onSubmit}
          className="relative bg-white/7 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          <div
            className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at 20% 0%, rgba(255,215,0,0.18), transparent 45%),radial-gradient(circle at 100% 50%, rgba(128,0,0,0.22), transparent 45%)',
            }}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm font-medium rounded-xl"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-semibold text-white/75 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
                <input
                  type="email"
                  name="email"
                  id="admin-email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/35 outline-none transition-all focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/35 shadow-[0_0_0_1px_rgba(255,215,0,0.10)] focus:shadow-[0_0_0_1px_rgba(255,215,0,0.18),0_0_34px_rgba(255,215,0,0.12)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-semibold text-white/75 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
                <input
                  type="password"
                  name="password"
                  id="admin-password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/35 outline-none transition-all focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/35 shadow-[0_0_0_1px_rgba(255,215,0,0.10)] focus:shadow-[0_0_0_1px_rgba(255,215,0,0.18),0_0_34px_rgba(255,215,0,0.12)]"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className={`group w-full py-4 bg-gradient-to-r from-maroon-700 via-maroon-800 to-gold-500/80 text-white font-bold rounded-2xl transition-all shadow-lg shadow-maroon-700/20 flex justify-center items-center gap-2 relative overflow-hidden ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] translate-x-[-120%] group-hover:translate-x-[0%] transition-transform duration-700" />
              <div className="relative z-10 flex items-center gap-2 justify-center">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In to Dashboard'
                )}
              </div>
            </motion.button>
          </div>
        </motion.form>

        <p className="text-center text-white/40 text-xs mt-8 uppercase tracking-widest font-medium">
          Secure Wedding Administration Panel
        </p>

        {/* Adex promotional section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="mt-10 pt-8 border-t border-white/5"
        >
          <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] mb-4">
            Built with Adex ✨
          </p>
          <div
            className="h-[1px] w-16 mx-auto mb-4 opacity-40"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.5), transparent)' }}
          />
          <p className="text-center text-white/50 font-serif text-sm leading-relaxed mb-2">
            Yeh sirf website nahi hai…
            <br />
            <span className="text-gold-500/70">ek cinematic wedding experience hai</span> 💍
          </p>
          <p className="text-center text-white/35 text-xs font-light italic mb-6">
            Apni shaadi ke liye bhi aisa invite chahiye?
          </p>
          <motion.a
            href="https://wa.me/917355259901?text=I want a wedding website like this 😍"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-gold-500/20 text-gold-500 font-serif tracking-[0.2em] uppercase text-[10px] font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-gold-500/40 hover:shadow-[0_0_24px_rgba(255,215,0,0.1)]"
          >
            {/* Golden Sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            
            <span className="relative z-10">Create Yours</span>
            <span className="text-gold-500 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
