import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserMinus, LayoutDashboard, LogOut,
  Menu, X, MapPin, CheckCircle, XCircle, Clock, Settings, Image
} from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

/* ── Design tokens ── */
const G = {
  sidebar: 'rgba(5,5,8,0.97)',
  card: 'rgba(255,255,255,0.9)',
  border: 'rgba(229,168,48,0.15)',
  borderHover: 'rgba(229,168,48,0.35)',
  gold: '#e5a830',
  gold200: '#fde68a',
  gold800: '#c8860e',
  text: '#111827',
  textSub: '#6b7280',
  mainBg: '#f6f0ea',
};

const Dashboard = () => {
  const socket = useSocket();
  const [stats, setStats] = useState({ totalGuests: 0, attending: 0, notAttending: 0, pending: 0 });
  const [guests, setGuests] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/$/, '');

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get('/api/guests', { headers: { 'x-auth-token': localStorage.getItem('token') } });
      const data = Array.isArray(res.data) ? res.data : [];
      setGuests(data);
      setStats({
        totalGuests: data.length,
        attending: data.filter(g => g.rsvpStatus === 'Attending').length,
        notAttending: data.filter(g => g.rsvpStatus === 'Not Attending').length,
        pending: data.filter(g => g.rsvpStatus === 'Pending' || !g.rsvpStatus).length,
      });
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/admin/login'); }
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (!socket) return;
    const h = () => fetchData();
    socket.on('guests:updated', h);
    return () => socket.off('guests:updated', h);
  }, [socket, fetchData]);

  const guestsByLocation = React.useMemo(() => {
    const groups = {};
    [...guests].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .forEach(g => {
        const loc = (g.location || '').trim() || 'Unspecified';
        if (!groups[loc]) groups[loc] = [];
        groups[loc].push(g);
      });
    return Object.entries(groups).sort(([a], [b]) => a === 'Unspecified' ? 1 : b === 'Unspecified' ? -1 : a.localeCompare(b));
  }, [guests]);

  const rsvpBadge = (status) => {
    const s = status || 'Pending';
    const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase';
    if (s === 'Attending') return <span className={`${base} bg-emerald-500/15 text-emerald-600`}><CheckCircle size={10} /> Attending</span>;
    if (s === 'Not Attending') return <span className={`${base} bg-rose-500/15 text-rose-600`}><XCircle size={10} /> Declined</span>;
    return <span className={`${base} bg-amber-500/15 text-amber-600`}><Clock size={10} /> Pending</span>;
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = pathname === to.replace(/\/$/, '');
    return (
      <Link
        to={to}
        className={`relative flex items-center py-2.5 rounded-xl transition-all duration-200 ${isSidebarOpen ? 'px-4 gap-3' : 'px-3 justify-center'}`}
        style={{
          background: isActive ? 'rgba(229,168,48,0.12)' : 'transparent',
          border: `1px solid ${isActive ? 'rgba(229,168,48,0.3)' : 'transparent'}`,
          color: isActive ? G.gold200 : 'rgba(255,255,255,0.55)',
          boxShadow: isActive ? '0 0 20px rgba(229,168,48,0.1)' : 'none',
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent'; } }}
      >
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: G.gold }} />}
        <Icon size={18} />
        {isSidebarOpen && <span className="text-sm font-medium">{label}</span>}
      </Link>
    );
  };

  const StatCard = ({ label, value, icon: Icon, color, progress, progressLabel }) => {
    const percent = Math.round(Math.max(0, Math.min(1, progress)) * 100);
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative overflow-hidden rounded-[1.6rem] p-5 sm:p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,250,245,0.84))',
          border: `1px solid ${G.border}`,
          boxShadow: '0 20px 45px rgba(60,29,18,0.07), 0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top gold accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: G.textSub }}>{label}</p>
            <h3 className="text-3xl font-bold" style={{ color: G.text }}>{value}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
            <Icon size={22} style={{ color }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1.5" style={{ color: G.textSub }}>
            <span>{progressLabel}</span>
            <span className="font-semibold" style={{ color }}>{percent}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              style={{ background: color }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-screen md:h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8f2eb 0%, #f1e8df 100%)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ background: 'radial-gradient(circle at top right, rgba(229,168,48,0.12), transparent 22%), radial-gradient(circle at bottom left, rgba(128,0,0,0.08), transparent 20%)' }} />
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 md:z-10 flex flex-col text-white
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          transform transition-transform duration-300 md:transition-none
          ${isSidebarOpen ? 'w-60' : 'w-[72px]'}`}
        style={{
          background: G.sidebar,
          borderRight: `1px solid rgba(229,168,48,0.1)`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Gold top strip */}
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(229,168,48,0.6), transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5">
          {isSidebarOpen && (
            <div>
              <h1 className="text-sm font-bold tracking-[0.15em] uppercase"
                style={{ background: 'linear-gradient(135deg, #c8860e, #fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Wedding Admin
              </h1>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(229,168,48,0.4)', letterSpacing: '0.05em' }}>Pushpendra &amp; Rinu</p>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <X size={18} />
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Gold divider */}
        <div className="mx-4 mb-3" style={{ height: '1px', background: 'rgba(229,168,48,0.1)' }} />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1" onClick={() => setIsMobileMenuOpen(false)}>
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Overview" />
          <NavItem to="/admin/dashboard/guests" icon={Users} label="Guest List" />
          <NavItem to="/admin/dashboard/content" icon={Settings} label="CMS" />
          <NavItem to="/admin/dashboard/images" icon={Image} label="Gallery" />
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 mt-auto">
          <div className="mx-0 mb-3" style={{ height: '1px', background: 'rgba(229,168,48,0.08)' }} />
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/admin/login'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${isSidebarOpen ? '' : 'justify-center'}`}
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = ''; }}
          >
            <LogOut size={17} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto relative z-[1]">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 gap-4"
          style={{
            background: 'rgba(255,248,239,0.76)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(229,168,48,0.14)',
            boxShadow: '0 12px 30px rgba(60,29,18,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-white/60 transition-colors" style={{ color: G.textSub }}>
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: G.text }}>
                {pathname === '/admin/dashboard' ? 'Dashboard Overview'
                  : pathname.includes('guests') ? 'Guest List'
                  : pathname.includes('content') ? 'Content Manager'
                  : pathname.includes('images') ? 'Image Manager' : 'Admin'}
              </h2>
              <p className="text-xs hidden sm:block" style={{ color: G.textSub }}>12 May 2026 · Pushpendra &amp; Rinu</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats pills */}
            {pathname === '/admin/dashboard' && (
              <div className="hidden lg:flex items-center gap-2">
                {[
                  { label: 'Total', val: stats.totalGuests, color: '#6366f1' },
                  { label: 'Attending', val: stats.attending, color: '#10b981' },
                  { label: 'Pending', val: stats.pending, color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border shadow-sm"
                    style={{ borderColor: `${s.color}30` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs font-semibold" style={{ color: G.textSub }}>{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: G.text }}>{s.val}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #c8860e, #fde68a)', color: '#050508' }}>
              PR
            </div>
          </div>
        </motion.header>

        {/* Content */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {pathname === '/admin/dashboard' && (
            <>
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <StatCard label="Total Guests" value={stats.totalGuests} icon={Users} color="#6366f1"
                  progress={stats.totalGuests ? (stats.totalGuests - stats.pending) / stats.totalGuests : 0}
                  progressLabel="RSVP confirmed" />
                <StatCard label="Attending" value={stats.attending} icon={UserCheck} color="#10b981"
                  progress={stats.totalGuests ? stats.attending / stats.totalGuests : 0}
                  progressLabel="Attending share" />
                <StatCard label="Not Attending" value={stats.notAttending} icon={UserMinus} color="#f43f5e"
                  progress={stats.totalGuests ? stats.notAttending / stats.totalGuests : 0}
                  progressLabel="Declined share" />
              </motion.div>

              {/* By Location */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #c8860e, #fde68a)' }}>
                    <MapPin size={16} style={{ color: '#050508' }} />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: G.text }}>Guests by Location</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {guestsByLocation.map(([loc, list]) => (
                    <motion.div key={loc} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="rounded-[1.6rem] overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.82)', border: `1px solid ${G.border}`, boxShadow: '0 18px 40px rgba(60,29,18,0.08)' }}>
                      <div className="px-5 py-3 flex items-center justify-between"
                        style={{ borderBottom: `1px solid rgba(229,168,48,0.1)`, background: 'rgba(229,168,48,0.03)' }}>
                        <span className="text-sm font-semibold" style={{ color: G.text }}>{loc}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(229,168,48,0.1)', color: G.gold800 }}>
                          {list.length} guest{list.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <ul className="divide-y divide-black/[0.04] max-h-[220px] overflow-y-auto">
                        {list.map(g => (
                          <li key={g._id} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-yellow-400/[0.02] transition-colors">
                            <div>
                              <p className="text-sm font-medium" style={{ color: G.text }}>{g.name}</p>
                              <p className="text-[11px]" style={{ color: G.textSub }}>{formatDate(g.createdAt)}</p>
                            </div>
                            {rsvpBadge(g.rsvpStatus)}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                  {guestsByLocation.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-sm italic rounded-2xl border border-dashed"
                      style={{ color: G.textSub, borderColor: G.border }}>
                      No guests yet. Add guests from the Guest List.
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}

          {pathname !== '/admin/dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.8rem] overflow-hidden min-h-[400px]"
              style={{ background: 'rgba(255,255,255,0.84)', border: `1px solid ${G.border}`, boxShadow: '0 24px 60px rgba(60,29,18,0.08)' }}
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
