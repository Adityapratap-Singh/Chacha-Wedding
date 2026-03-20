
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import {
  UserPlus,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Search,
  MapPin,
} from 'lucide-react';

const GuestList = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [guests, setGuests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    family: 'No',
    honorific: 'None',
    specialMessage: '',
    location: '',
    locationOther: '',
  });
  const [copyStatus, setCopyStatus] = useState({});
  const [shareStatus, setShareStatus] = useState({});
  const [formFeedback, setFormFeedback] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState(null);

  const fetchGuests = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/guests', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      if (Array.isArray(res.data)) setGuests(res.data);
      else setGuests([]);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
      setGuests([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await axios.get('/api/guests/locations', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch {
      setLocations([]);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
    fetchLocations();
  }, [fetchGuests, fetchLocations]);

  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      fetchGuests();
      fetchLocations();
    };
    socket.on('guests:updated', handler);
    return () => socket.off('guests:updated', handler);
  }, [socket, fetchGuests, fetchLocations]);

  const getInviteLink = (guestId) => `${window.location.origin}/invite/${guestId}`;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getLocationValue = () => {
    if (formData.location === '_other_') return formData.locationOther.trim();
    return formData.location;
  };

  const doAddGuest = async (forceCreate = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormFeedback(null);
    setDuplicateModal(null);
    const payload = {
      ...formData,
      location: getLocationValue(),
      forceCreate,
    };
    delete payload.locationOther;
    try {
      const res = await axios.post('/api/guests', payload, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setGuests((prev) => [...prev, res.data]);
      const newLoc = getLocationValue();
      if (newLoc && !locations.includes(newLoc)) setLocations((p) => [...p, newLoc].sort());
      setFormData({ name: '', family: 'No', honorific: 'None', specialMessage: '', location: '', locationOther: '' });
      setFormFeedback({ type: 'success', message: 'Guest added successfully.' });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      } else if (err.response && err.response.status === 409 && err.response.data.duplicate) {
        setDuplicateModal({
          existing: err.response.data.existing,
          pendingData: { ...formData, location: getLocationValue() },
        });
      } else {
        setFormFeedback({
          type: 'error',
          message: err.response?.data?.msg || 'Error adding guest. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await doAddGuest(false);
  };

  const handleDuplicateNo = async () => {
    await doAddGuest(true);
  };

  const handleDuplicateYes = () => {
    setDuplicateModal(null);
    setFormFeedback({ type: 'info', message: 'No new guest added. Use a different name if this is someone else.' });
  };

  const deleteGuest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) return;
    try {
      await axios.delete(`/api/guests/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setGuests(guests.filter((guest) => guest._id !== id));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    }
  };

  const copyInviteLink = (guestId) => {
    const link = getInviteLink(guestId);
    navigator.clipboard.writeText(link).catch(() => {});
    setCopyStatus((prev) => ({ ...prev, [guestId]: true }));
    setTimeout(() => setCopyStatus((prev) => ({ ...prev, [guestId]: false })), 2000);
  };

  const shareInviteLink = (guestId) => {
    const link = getInviteLink(guestId);
    const text = encodeURIComponent(link);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    setShareStatus((prev) => ({ ...prev, [guestId]: true }));
    setTimeout(() => setShareStatus((p) => ({ ...p, [guestId]: false })), 2200);
  };

  const filteredGuests = guests.filter(guest =>
    guest && guest.name && guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rsvpBadge = (status) => {
    const s = status || 'Pending';
    if (s === 'Attending') {
      return (
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 backdrop-blur">
          <CheckCircle size={14} />
          Attending
        </span>
      );
    }
    if (s === 'Not Attending') {
      return (
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-700 border border-rose-500/25 backdrop-blur">
          <XCircle size={14} />
          Not Attending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 border border-amber-500/25 backdrop-blur">
        <Clock size={14} />
        Pending
      </span>
    );
  };

  const tbodyVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } };
  const rowVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.38, ease: 'easeOut' } },
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 dashboard-noise relative">
      {/* Duplicate confirmation modal */}
      <AnimatePresence>
        {duplicateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDuplicateModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-4 p-5 sm:p-6 border border-white/70"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Same person?</h4>
              <p className="text-gray-600 mb-4">
                We found a guest with the same name: <strong>{duplicateModal.existing.name}</strong>
                {duplicateModal.existing.location && ` (${duplicateModal.existing.location})`}. Is this the same person?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDuplicateYes}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                >
                  Yes, same person
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDuplicateNo}
                  disabled={isSubmitting}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-maroon-700 text-white font-semibold hover:bg-maroon-800"
                >
                  No, add as new
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Guest Form */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="p-2 bg-maroon-700/90 rounded-xl text-white shadow-[0_0_28px_rgba(128,0,0,0.25)]">
            <UserPlus size={20} />
          </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add New Guest</h3>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 bg-white/55 backdrop-blur-xl border border-white/70 shadow-sm rounded-2xl p-4 sm:p-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Honorific</label>
            <select name="honorific" value={formData.honorific} onChange={onChange}
              className="w-full px-4 py-2.5 bg-white/70 border border-white/60 rounded-xl focus:ring-2 focus:ring-maroon-700/25 focus:border-maroon-700 outline-none transition-all shadow-sm"
            >
              <option value="None">None</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Guest Name</label>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={onChange} required
              className="w-full px-4 py-2.5 bg-white/70 border border-white/60 rounded-xl focus:ring-2 focus:ring-maroon-700/25 focus:border-maroon-700 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Family Invite?</label>
            <select name="family" value={formData.family} onChange={onChange}
              className="w-full px-4 py-2.5 bg-white/70 border border-white/60 rounded-xl focus:ring-2 focus:ring-maroon-700/25 focus:border-maroon-700 outline-none transition-all shadow-sm"
            >
              <option value="No">Individual</option>
              <option value="Yes">Family</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1">
              <MapPin size={14} /> Location
            </label>
            <select name="location" value={formData.location} onChange={onChange}
              className="w-full px-4 py-2.5 bg-white/70 border border-white/60 rounded-xl focus:ring-2 focus:ring-maroon-700/25 focus:border-maroon-700 outline-none transition-all shadow-sm"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
              <option value="_other_">Other...</option>
            </select>
            {formData.location === '_other_' && (
              <input
                type="text"
                name="locationOther"
                placeholder="Type new location"
                value={formData.locationOther}
                onChange={onChange}
                className="mt-2 w-full px-4 py-2.5 bg-white/70 border border-white/60 rounded-xl focus:ring-2 focus:ring-maroon-700/25 outline-none transition-all shadow-sm"
              />
            )}
          </div>
          <div className="flex items-end">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || (formData.location === '_other_' && !formData.locationOther.trim())}
              className="group relative w-full py-2.5 bg-maroon-700 text-white font-bold rounded-xl hover:bg-maroon-800 transition-colors shadow-lg shadow-maroon-700/20 flex justify-center items-center gap-2"
            >
              <UserPlus size={18} />
              {isSubmitting ? 'Adding...' : 'Add Guest'}
            </motion.button>
          </div>
          {formFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`lg:col-span-5 rounded-xl px-4 py-3 border shadow-sm ${
                formFeedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' :
                formFeedback.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-700' :
                'bg-amber-500/10 border-amber-500/20 text-amber-700'
              }`}
            >
              {formFeedback.message}
            </motion.div>
          )}
        </motion.form>
      </section>

      {/* Guest List Table */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.06 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gold-500/90 rounded-xl text-white shadow-[0_0_28px_rgba(255,215,0,0.22)]">
              <Search size={20} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Guest List ({guests.length})</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 min-h-[44px] bg-white/60 border border-white/70 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-maroon-700/25 outline-none shadow-sm"
            />
          </div>
        </motion.div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl sm:rounded-2xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-sm">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="bg-white/30 border-b border-white/60">
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-700">Guest</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-700">Honorific</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-700">Type</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-700">Location</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-700">RSVP Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-700">Invite Link</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody className="divide-y divide-white/40">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-4 w-[58%] bg-white/35 rounded animate-pulse" /></td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-3 w-[44%] bg-white/30 rounded animate-pulse" /></td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-3 w-[52%] bg-white/30 rounded animate-pulse" /></td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-3 w-[40%] bg-white/30 rounded animate-pulse" /></td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-7 w-[70%] bg-white/25 rounded-full animate-pulse" /></td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="flex gap-3"><div className="h-7 w-[68px] bg-white/25 rounded-lg animate-pulse" /><div className="h-7 w-[68px] bg-white/25 rounded-lg animate-pulse" /></div></td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right"><div className="ml-auto h-7 w-7 bg-white/20 rounded-lg animate-pulse" /></td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <motion.tbody variants={tbodyVariants} initial="hidden" animate="show" className="divide-y divide-white/40">
                <AnimatePresence initial={false}>
                  {filteredGuests.map((guest) => (
                    <motion.tr
                      key={guest._id}
                      variants={rowVariants}
                      exit={{ opacity: 0, y: 6 }}
                      layout
                      whileHover={{ y: -2, scale: 1.005 }}
                      className="group"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-bold text-gray-900">{guest.name}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">{guest.honorific !== 'None' ? guest.honorific : '-'}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">{guest.family === 'Yes' ? 'Family' : 'Individual'}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">{guest.location || '-'}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">{rsvpBadge(guest.rsvpStatus)}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-wrap gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => copyInviteLink(guest.guestId)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                              copyStatus[guest.guestId] ? 'bg-emerald-500 text-white' : 'bg-white/60 text-gray-700 border border-white/70 hover:bg-white/80'
                            }`}
                          >
                            {copyStatus[guest.guestId] ? <CheckCircle size={14} /> : <Copy size={14} />}
                            {copyStatus[guest.guestId] ? 'Copied' : 'Copy'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => shareInviteLink(guest.guestId)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                              shareStatus[guest.guestId] ? 'bg-emerald-500 text-white' : 'bg-white/60 text-gray-700 border border-white/70 hover:bg-white/80'
                            }`}
                          >
                            <MessageCircle size={14} />
                            {shareStatus[guest.guestId] ? 'Shared' : 'WhatsApp'}
                          </motion.button>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteGuest(guest._id)}
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Delete guest"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 backdrop-blur-xl px-6 py-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-maroon-700/90 text-white flex items-center justify-center">
                          <Search size={18} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">No guests found</p>
                          <p className="text-sm text-gray-600">Try a different search or add a new guest.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            )}
          </table>
        </div>
      </section>
    </div>
  );
};

export default GuestList;
