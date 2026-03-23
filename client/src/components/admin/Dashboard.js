
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserMinus, LayoutDashboard, LogOut, Menu, X, MapPin, CheckCircle, XCircle, Clock, Settings, Image } from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';

const formatDate = (d) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const Dashboard = () => {
  const socket = useSocket();
  const [stats, setStats] = useState({
    totalGuests: 0,
    attending: 0,
    notAttending: 0,
    pending: 0
  });
  const [guests, setGuests] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/$/, '');

  const clamp01 = (n) => Math.max(0, Math.min(1, n));

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get('/api/guests', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setGuests(data);
      setStats({
        totalGuests: data.length,
        attending: data.filter((g) => g.rsvpStatus === 'Attending').length,
        notAttending: data.filter((g) => g.rsvpStatus === 'Not Attending').length,
        pending: data.filter((g) => g.rsvpStatus === 'Pending' || !g.rsvpStatus).length
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchData();
    socket.on('guests:updated', handler);
    return () => socket.off('guests:updated', handler);
  }, [socket, fetchData]);

  const statContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const guestsByLocation = React.useMemo(() => {
    const groups = {};
    const sorted = [...guests].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    sorted.forEach((g) => {
      const loc = (g.location || '').trim() || 'Unspecified';
      if (!groups[loc]) groups[loc] = [];
      groups[loc].push(g);
    });
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Unspecified') return 1;
      if (b === 'Unspecified') return -1;
      return a.localeCompare(b);
    });
  }, [guests]);

  const rsvpBadge = (status) => {
    const s = status || 'Pending';
    if (s === 'Attending') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-700"><CheckCircle size={10} /> Attending</span>;
    if (s === 'Not Attending') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/15 text-rose-700"><XCircle size={10} /> Declined</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-700"><Clock size={10} /> Pending</span>;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = pathname === to.replace(/\/$/, '');
    return (
      <Link
        to={to}
        className={`relative group flex items-center py-3 rounded-xl border transition-all duration-200 ${
          isSidebarOpen ? 'px-4 gap-3 justify-start' : 'px-3 justify-center'
        } ${
          isActive
            ? 'text-white border-gold-500/30 bg-gradient-to-r from-gold-500/15 via-maroon-700/35 to-gold-500/10 shadow-[0_0_34px_rgba(255,215,0,0.18)]'
            : 'border-transparent text-gray-200/70 hover:text-white hover:bg-white/5 hover:border-white/10'
        }`}
      >
        {/* Active glow highlight */}
        <span
          aria-hidden
          className={`absolute inset-0 rounded-xl bg-gradient-to-r from-gold-500/20 via-maroon-700/25 to-gold-500/10 pointer-events-none transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />

        <Icon size={20} className="relative z-10" />
        {isSidebarOpen && <span className="relative z-10 font-medium">{label}</span>}
      </Link>
    );
  };

  const StatCard = ({ label, value, icon: Icon, color, progress, progressLabel }) => {
    const percent = Math.round(clamp01(progress) * 100);
    return (
      <motion.div
        variants={statCardVariants}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/55 backdrop-blur-xl shadow-sm"
      >
        {/* Hover sheen */}
        <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-60%] group-hover:animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </div>

        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</h3>
            </div>

            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
              <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{progressLabel}</span>
              <span className={`font-semibold ${color.replace('bg-', 'text-')} text-xs`}>{percent}%</span>
            </div>

            <div className="h-2 mt-2 bg-gray-900/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-screen min-h-[100dvh] md:h-screen bg-[#fdfbf7] dashboard-noise relative">
      {/* Premium background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(128,0,0,0.18),transparent_55%),radial-gradient(circle_at_90%_15%,rgba(255,215,0,0.18),transparent_45%),radial-gradient(circle_at_60%_120%,rgba(128,0,0,0.10),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-maroon-700/5 via-transparent to-gold-500/10" />

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - overlay on mobile, inline on md+ */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 md:z-10 bg-gray-900/95 md:bg-gray-900/60 backdrop-blur-xl border-r border-white/10 text-white flex flex-col w-64 transform transition-transform duration-300 ease-out md:transition-none md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}`}
      >
        {/* Top gradient strip */}
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-gold-500/50 via-maroon-700/50 to-gold-500/30" />

        <div className="p-4 sm:p-6 flex items-center justify-between relative z-10">
          {isSidebarOpen && (
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gold-500 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,215,0,0.22)]">
              Royal Wedding
            </h1>
          )}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 min-w-[44px] min-h-[44px] md:hidden hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 hover:bg-white/5 rounded-lg transition-colors items-center justify-center"
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 relative z-10" onClick={() => setIsMobileMenuOpen(false)}>
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label={isSidebarOpen ? "Overview" : ""} />
          <NavItem to="/admin/dashboard/guests" icon={Users} label={isSidebarOpen ? "Guest List" : ""} />
          <NavItem to="/admin/dashboard/content" icon={Settings} label={isSidebarOpen ? "CMS" : ""} />
          <NavItem to="/admin/dashboard/images" icon={Image} label={isSidebarOpen ? "Image Manager" : ""} />
        </nav>

        <div className="p-4 mt-auto relative z-10">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors ${
              isSidebarOpen ? '' : 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="backdrop-blur-xl bg-white/60 border-b border-white/70 px-4 sm:px-6 md:px-10 py-4 sm:py-6 flex justify-between items-center sticky top-0 z-10 shadow-sm gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 min-w-[44px] min-h-[44px] -ml-2 rounded-lg hover:bg-white/50 flex items-center justify-center text-gray-700"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </motion.button>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Dashboard Overview</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Pushpendra & Renu</p>
              <p className="text-xs text-gray-500">Wedding Date: 12 May 2026</p>
            </div>
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold border border-gold-500/25 shadow-[0_0_24px_rgba(255,215,0,0.15)]"
            >
              PR
            </motion.div>
          </div>
        </motion.header>

        <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
          {pathname === '/admin/dashboard' && (
            <>
              <motion.div
                variants={statContainerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                <StatCard
                  label="Total Guests"
                  value={stats.totalGuests}
                  icon={Users}
                  color="bg-blue-500"
                  progress={stats.totalGuests ? (stats.totalGuests - stats.pending) / stats.totalGuests : 0}
                  progressLabel="RSVP confirmed"
                />
                <StatCard
                  label="Attending"
                  value={stats.attending}
                  icon={UserCheck}
                  color="bg-green-500"
                  progress={stats.totalGuests ? stats.attending / stats.totalGuests : 0}
                  progressLabel="Attending share"
                />
                <StatCard
                  label="Not Attending"
                  value={stats.notAttending}
                  icon={UserMinus}
                  color="bg-red-500"
                  progress={stats.totalGuests ? stats.notAttending / stats.totalGuests : 0}
                  progressLabel="Declined share"
                />
              </motion.div>

              {/* Guests by location */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gold-500/90 rounded-xl text-white shadow-[0_0_28px_rgba(255,215,0,0.22)]">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Guests by Location</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {guestsByLocation.map(([loc, list]) => (
                    <motion.div
                      key={loc}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/55 backdrop-blur-xl border border-white/70 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <div className="px-5 py-3 bg-white/40 border-b border-white/60">
                        <span className="font-semibold text-gray-800">{loc}</span>
                        <span className="ml-2 text-sm text-gray-500">({list.length} guest{list.length !== 1 ? 's' : ''})</span>
                      </div>
                      <ul className="divide-y divide-white/40 max-h-[220px] sm:max-h-[280px] overflow-y-auto">
                        {list.map((g) => (
                          <li key={g._id} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-white/30 transition-colors">
                            <div>
                              <p className="font-medium text-gray-900">{g.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(g.createdAt)}</p>
                            </div>
                            {rsvpBadge(g.rsvpStatus)}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
                {guestsByLocation.length === 0 && (
                  <div className="text-center py-12 text-gray-500 bg-white/30 rounded-2xl border border-white/60">
                    No guests yet. Add guests from the Guest List.
                  </div>
                )}
              </motion.div>
            </>
          )}

          {pathname !== '/admin/dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-sm min-h-[400px] overflow-hidden"
            >
              <Outlet />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
