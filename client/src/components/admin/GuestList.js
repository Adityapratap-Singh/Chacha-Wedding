import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { useSocket } from '../../context/SocketContext';
import {
  UserPlus, Trash2, Copy, CheckCircle, XCircle, Clock,
  MessageCircle, Search, MapPin, Edit, X, FileText, Upload, Download, Sheet
} from 'lucide-react';

const csvHeaders = ['name', 'family', 'honorific', 'location', 'specialMessage'];

const escapeCsvValue = (value = '') => {
  const stringValue = String(value ?? '');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const parseCsv = (text) => {
  const rows = [];
  let current = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(current);
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = (cells[index] || '').trim();
    });
    return entry;
  });
};

const downloadTextFile = (filename, content, mimeType = 'text/plain;charset=utf-8;') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const generateInviteText = (guest, inviteUrl) => {
  const honorific = guest.honorific && guest.honorific !== 'None' ? guest.honorific + ' ' : '';
  const family = guest.family === 'Yes' ? ' (including family)' : '';
  return (
    `🌸 Wedding Invitation 🌸\n\n` +
    `We warmly welcome you to the marriage of\n\n` +
    `  Pushpendra Kumar Singh\n` +
    `       &\n` +
    `  Renu Singh\n\n` +
    `Dear ${honorific}${guest.name}${family},\n\n` +
    `You are cordially invited to grace us with your presence\n` +
    `and be a part of this cherished celebration.\n\n` +
    `📅  12 May 2026\n\n` +
    `🔗 Your personal invitation link:\n${inviteUrl}\n\n` +
    `आपकी उपस्थिति हमारे लिए अमूल्य है।\n` +
    `— Pushpendra & Renu`
  );
};

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

const fetchQrDataUrl = async (inviteUrl) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(inviteUrl)}`;
  const response = await fetch(qrCodeUrl);
  if (!response.ok) throw new Error('Unable to load QR code');
  const blob = await response.blob();
  return blobToDataUrl(blob);
};

const textToImageDataUrl = (text, {
  width = 1200,
  height = 120,
  font = "700 48px 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', sans-serif",
  color = '#f2cf7a',
} = {}) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.clearRect(0, 0, width, height);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL('image/png');
};

const downloadInvitationPdf = async (guest, inviteUrl) => {
  const honorific = guest.honorific && guest.honorific !== 'None' ? `${guest.honorific} ` : '';
  const guestLine = `${honorific}${guest.name}${guest.family === 'Yes' ? ' & Family' : ''}`;
  const personalizedNote = guest.specialMessage?.trim()
    ? guest.specialMessage.trim()
    : 'Your presence, blessings, and warmth will make this celebration complete.';
  const locationLine = guest.location?.trim() || 'With love from our family';
  const fileSafeGuestName = guest.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const cardX = margin;
  const cardY = margin;
  const cardW = pageWidth - margin * 2;
  const cardH = pageHeight - margin * 2;
  const centerX = pageWidth / 2;

  pdf.setFillColor(18, 6, 9);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setDrawColor(200, 134, 14);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(cardX, cardY, cardW, cardH, 6, 6, 'S');
  pdf.setDrawColor(229, 168, 48);
  pdf.setLineWidth(0.15);
  pdf.roundedRect(cardX + 4, cardY + 4, cardW - 8, cardH - 8, 4, 4, 'S');

  let y = 29;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(229, 168, 48);
  pdf.text('WEDDING INVITATION', centerX, y, { align: 'center' });

  y += 11;
  pdf.setFont('times', 'italic');
  pdf.setFontSize(23);
  pdf.setTextColor(242, 207, 122);
  pdf.text('Atithi Devo Bhava', centerX, y, { align: 'center' });

  y += 6;
  pdf.setDrawColor(229, 168, 48);
  pdf.line(centerX - 24, y, centerX + 24, y);

  y += 15;
  pdf.setFont('times', 'bolditalic');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 242, 212);
  pdf.text('Pushpendra Kumar Singh', centerX, y, { align: 'center' });

  y += 9;
  pdf.setFont('times', 'italic');
  pdf.setFontSize(26);
  pdf.setTextColor(229, 168, 48);
  pdf.text('&', centerX, y, { align: 'center' });

  y += 9;
  pdf.setFont('times', 'bolditalic');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 242, 212);
  pdf.text('Renu Singh', centerX, y, { align: 'center' });

  y += 12;
  pdf.setDrawColor(229, 168, 48);
  pdf.roundedRect(32, y, pageWidth - 64, 18, 3, 3, 'S');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(229, 168, 48);
  pdf.text('HONOURED GUEST', centerX, y + 5.5, { align: 'center' });
  pdf.setFont('times', 'italic');
  pdf.setFontSize(17);
  pdf.setTextColor(255, 244, 218);
  pdf.text(guestLine, centerX, y + 12.5, { align: 'center' });

  y += 28;
  pdf.setFont('times', 'italic');
  pdf.setFontSize(14);
  pdf.setTextColor(247, 238, 220);
  const inviteCopy = pdf.splitTextToSize(
    'You are warmly invited to celebrate with us as two families come together in joy, tradition, and blessing.',
    150
  );
  pdf.text(inviteCopy, centerX, y, { align: 'center' });

  y += inviteCopy.length * 7 + 3;
  pdf.setFont('times', 'normal');
  pdf.setFontSize(12.5);
  pdf.setTextColor(230, 220, 200);
  const noteLines = pdf.splitTextToSize(personalizedNote, 150);
  pdf.text(noteLines, centerX, y, { align: 'center' });

  y += noteLines.length * 6 + 10;
  const detailTop = y;
  const detailW = 78;
  const detailH = 28;
  const detailGap = 8;
  const leftX = 22;
  const rightX = leftX + detailW + detailGap;

  pdf.roundedRect(leftX, detailTop, detailW, detailH, 3, 3, 'S');
  pdf.roundedRect(rightX, detailTop, detailW, detailH, 3, 3, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(229, 168, 48);
  pdf.text('CEREMONY DATE', leftX + 5, detailTop + 6);
  pdf.text('VENUE', rightX + 5, detailTop + 6);

  pdf.setFont('times', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(255, 242, 212);
  pdf.text('12 May 2026', leftX + 5, detailTop + 14);
  pdf.text('Maa Ambe Guest House', rightX + 5, detailTop + 14);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(214, 204, 189);
  pdf.text('Tuesday · Baraat welcome from 8:00 PM', leftX + 5, detailTop + 21);
  const venueLines = pdf.splitTextToSize(`Chhani · ${locationLine}`, detailW - 10);
  pdf.text(venueLines, rightX + 5, detailTop + 21);

  y = detailTop + detailH + 10;
  pdf.roundedRect(22, y, pageWidth - 44, 45, 3, 3, 'S');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(229, 168, 48);
  pdf.text('PERSONAL INVITATION LINK', 28, y + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(248, 217, 142);
  const linkLines = pdf.splitTextToSize(inviteUrl, 92);
  pdf.text(linkLines, 28, y + 15);

  try {
    const qrDataUrl = await fetchQrDataUrl(inviteUrl);
    pdf.addImage(qrDataUrl, 'PNG', pageWidth - 58, y + 6, 28, 28);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(229, 168, 48);
    pdf.text('SCAN TO OPEN', pageWidth - 44, y + 38, { align: 'center' });
  } catch {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(214, 204, 189);
    pdf.text('QR unavailable', pageWidth - 44, y + 22, { align: 'center' });
  }

  try {
    const hindiFooter = textToImageDataUrl('आपकी उपस्थिति हमारे लिए अमूल्य है।');
    pdf.addImage(hindiFooter, 'PNG', 40, pageHeight - 36, pageWidth - 80, 10);
  } catch {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(242, 207, 122);
    pdf.text('Aapki upasthiti hamare liye amoolya hai.', centerX, pageHeight - 30, { align: 'center' });
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(214, 204, 189);
  pdf.text('With Love · Pushpendra & Renu', centerX, pageHeight - 22, { align: 'center' });

  pdf.save(`invitation-${fileSafeGuestName || 'guest'}.pdf`);
};

/* ─── Main Component ─── */
const GuestList = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [guests, setGuests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', family: 'No', honorific: 'None', specialMessage: '', location: '', locationOther: '' });
  const [editingGuest, setEditingGuest] = useState(null);
  const [copyStatus, setCopyStatus] = useState({});
  const [formFeedback, setFormFeedback] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const fetchGuests = useCallback(async () => {
    try {
      const res = await axios.get('/api/guests', { headers: { 'x-auth-token': localStorage.getItem('token') } });
      if (Array.isArray(res.data)) setGuests(res.data); else setGuests([]);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/admin/login'); }
      setGuests([]);
    }
  }, [navigate]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await axios.get('/api/guests/locations', { headers: { 'x-auth-token': localStorage.getItem('token') } });
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch { setLocations([]); }
  }, []);

  useEffect(() => { fetchGuests(); fetchLocations(); }, [fetchGuests, fetchLocations]);
  useEffect(() => {
    if (!socket) return;
    const h = () => { fetchGuests(); fetchLocations(); };
    socket.on('guests:updated', h);
    return () => socket.off('guests:updated', h);
  }, [socket, fetchGuests, fetchLocations]);

  const getInviteLink = (guestId) => `${window.location.origin}/invite/${guestId}`;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const getLocationValue = () => formData.location === '_other_' ? formData.locationOther.trim() : formData.location;

  const handleEditClick = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name, family: guest.family, honorific: guest.honorific,
      specialMessage: guest.specialMessage || '',
      location: locations.includes(guest.location) ? guest.location : (guest.location ? '_other_' : ''),
      locationOther: locations.includes(guest.location) ? '' : (guest.location || ''),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingGuest(null);
    setFormData({ name: '', family: 'No', honorific: 'None', specialMessage: '', location: '', locationOther: '' });
  };

  const doAddGuest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormFeedback(null);
    const payload = { ...formData, location: getLocationValue() };
    delete payload.locationOther;
    try {
      if (editingGuest) {
        const res = await axios.put(`/api/guests/${editingGuest._id}`, payload, { headers: { 'x-auth-token': localStorage.getItem('token') } });
        setGuests(prev => prev.map(g => g._id === editingGuest._id ? res.data : g));
        setFormFeedback({ type: 'success', message: 'Guest updated successfully.' });
        setEditingGuest(null);
      } else {
        const res = await axios.post('/api/guests', payload, { headers: { 'x-auth-token': localStorage.getItem('token') } });
        setGuests(prev => [...prev, res.data]);
        setFormFeedback({ type: 'success', message: 'Guest added successfully.' });
      }
      const newLoc = getLocationValue();
      if (newLoc && !locations.includes(newLoc)) setLocations(p => [...p, newLoc].sort());
      setFormData({ name: '', family: 'No', honorific: 'None', specialMessage: '', location: '', locationOther: '' });
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/admin/login'); }
      else {
        setFormFeedback({ type: 'error', message: err.response?.data?.msg || 'Error saving guest.' });
      }
    } finally { setIsSubmitting(false); }
  };

  const deleteGuest = async (id) => {
    if (!window.confirm('Delete this guest?')) return;
    try {
      await axios.delete(`/api/guests/${id}`, { headers: { 'x-auth-token': localStorage.getItem('token') } });
      setGuests(guests.filter(g => g._id !== id));
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/admin/login'); }
    }
  };

  const copyInviteLink = (guestId) => {
    navigator.clipboard.writeText(getInviteLink(guestId)).catch(() => {});
    setCopyStatus(p => ({ ...p, [guestId]: true }));
    setTimeout(() => setCopyStatus(p => ({ ...p, [guestId]: false })), 2000);
  };

  const shareInviteLink = (guestId) => {
    const link = getInviteLink(guestId);
    const guest = guests.find(g => g._id === guestId);
    const inviteText = generateInviteText(guest, link);
    window.open(`https://wa.me/?text=${encodeURIComponent(inviteText)}`, '_blank', 'noopener,noreferrer');
  };

  const filteredGuests = guests.filter(g => g?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const downloadCsvTemplate = () => {
    const templateRows = [
      csvHeaders.join(','),
      [
        escapeCsvValue('Aditya Pratap Singh'),
        escapeCsvValue('No'),
        escapeCsvValue('Mr'),
        escapeCsvValue('Lucknow'),
        escapeCsvValue('Please join us for the celebration.')
      ].join(','),
      [
        escapeCsvValue('Rajesh Singh'),
        escapeCsvValue('Yes'),
        escapeCsvValue('Mr'),
        escapeCsvValue('Kanpur'),
        escapeCsvValue('Saparivaar aamantrit hain.')
      ].join(',')
    ].join('\n');

    downloadTextFile('guest-import-template.csv', templateRows, 'text/csv;charset=utf-8;');
  };

  const exportGuestsCsv = () => {
    const rows = [
      ['name', 'family', 'honorific', 'location', 'specialMessage', 'guestId', 'rsvpStatus', 'createdAt'].join(','),
      ...guests.map((guest) => ([
        escapeCsvValue(guest.name),
        escapeCsvValue(guest.family),
        escapeCsvValue(guest.honorific),
        escapeCsvValue(guest.location || ''),
        escapeCsvValue(guest.specialMessage || ''),
        escapeCsvValue(guest.guestId || ''),
        escapeCsvValue(guest.rsvpStatus || 'Pending'),
        escapeCsvValue(guest.createdAt || '')
      ].join(',')))
    ].join('\n');

    const today = new Date().toISOString().slice(0, 10);
    downloadTextFile(`guests-export-${today}.csv`, rows, 'text/csv;charset=utf-8;');
  };

  const handleCsvImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || isImporting) return;

    setIsImporting(true);
    setFormFeedback(null);

    try {
      const text = await file.text();
      const records = parseCsv(text)
        .map((row) => ({
          name: row.name || '',
          family: row.family === 'Yes' ? 'Yes' : 'No',
          honorific: ['Mr', 'Mrs', 'None'].includes(row.honorific) ? row.honorific : 'None',
          location: row.location || '',
          specialMessage: row.specialMessage || '',
        }))
        .filter((row) => row.name.trim());

      if (!records.length) {
        setFormFeedback({ type: 'error', message: 'No valid guest rows found in the CSV file.' });
        return;
      }

      const headers = { 'x-auth-token': localStorage.getItem('token') };
      let imported = 0;
      let failed = 0;
      const importedLocations = new Set();

      for (const record of records) {
        try {
          await axios.post('/api/guests', record, { headers });
          imported += 1;
          if (record.location) importedLocations.add(record.location);
        } catch (err) {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/admin/login');
            return;
          }
          failed += 1;
        }
      }

      await fetchGuests();
      if (importedLocations.size) {
        setLocations((prev) => Array.from(new Set([...prev, ...importedLocations])).sort());
      } else {
        await fetchLocations();
      }

      setFormFeedback({
        type: failed ? 'error' : 'success',
        message: failed
          ? `Imported ${imported} guest(s). ${failed} row(s) could not be imported.`
          : `Imported ${imported} guest(s) successfully.`
      });
    } catch {
      setFormFeedback({ type: 'error', message: 'Unable to read the CSV file. Please use the provided template.' });
    } finally {
      setIsImporting(false);
    }
  };

  const rsvpBadge = (status) => {
    const s = status || 'Pending';
    const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider';
    if (s === 'Attending') return <span className={`${base} bg-emerald-500/15 text-emerald-400 border border-emerald-500/20`}><CheckCircle size={11} />Attending</span>;
    if (s === 'Not Attending') return <span className={`${base} bg-rose-500/15 text-rose-400 border border-rose-500/20`}><XCircle size={11} />Declined</span>;
    return <span className={`${base} bg-amber-500/15 text-amber-400 border border-amber-500/20`}><Clock size={11} />Pending</span>;
  };

  /* ── Input/Select shared style ── */
  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-800 bg-white/80 border border-white/60 
    focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400/50 outline-none transition-all shadow-sm`;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 dashboard-noise">

      {/* ── Add / Edit Form ── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #c8860e, #fde68a)' }}>
            {editingGuest ? <Edit size={16} /> : <UserPlus size={16} />}
          </div>
          <h3 className="text-base font-bold text-gray-900">{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h3>
          {editingGuest && (
            <button onClick={cancelEdit} className="ml-auto flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              <X size={15} /> Cancel
            </button>
          )}
        </div>

        <motion.form
          onSubmit={(e) => { e.preventDefault(); doAddGuest(); }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 bg-white/50 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-sm"
        >
          {/* Honorific */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 ml-0.5">Honorific</label>
            <select name="honorific" value={formData.honorific} onChange={onChange} className={inputCls}>
              <option value="None">None</option>
              <option value="Mr">Mr</option><option value="Mrs">Mrs</option><option value="Ms">Ms</option>
            </select>
          </div>
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 ml-0.5">Guest Name</label>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={onChange} required className={inputCls} />
          </div>
          {/* Family */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 ml-0.5">Type</label>
            <select name="family" value={formData.family} onChange={onChange} className={inputCls}>
              <option value="No">Individual</option><option value="Yes">Family</option>
            </select>
          </div>
          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 ml-0.5 flex items-center gap-1"><MapPin size={12} />Location</label>
            <select name="location" value={formData.location} onChange={onChange} className={inputCls}>
              <option value="">Select location</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              <option value="_other_">Other...</option>
            </select>
            {formData.location === '_other_' && (
              <input type="text" name="locationOther" placeholder="New location" value={formData.locationOther} onChange={onChange}
                className={`mt-1.5 ${inputCls}`} />
            )}
          </div>
          {/* Submit */}
          <div className="flex items-end">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || (formData.location === '_other_' && !formData.locationOther.trim())}
              className="w-full py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-40"
              style={{ background: editingGuest ? 'linear-gradient(135deg, #d97706, #f59e0b)' : 'linear-gradient(135deg, #c8860e, #fde68a)' }}
            >
              {editingGuest ? <Edit size={16} /> : <UserPlus size={16} />}
              {isSubmitting ? 'Saving...' : (editingGuest ? 'Update Guest' : 'Add Guest')}
            </motion.button>
          </div>

          {formFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`lg:col-span-5 rounded-xl px-4 py-3 text-sm border ${formFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}
            >
              {formFeedback.message}
            </motion.div>
          )}
        </motion.form>
      </section>

      {/* ── Guest List Table ── */}
      <section>
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #c8860e, #fde68a)' }}>
                <Search size={16} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Guest List ({guests.length})</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text" placeholder="Search guests..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white/60 border border-white/70 rounded-xl w-full sm:w-56 text-sm text-gray-800 focus:ring-2 focus:ring-yellow-400/30 outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadCsvTemplate}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 border border-white/80 text-sm font-semibold text-gray-700 hover:bg-white transition-colors shadow-sm"
            >
              <Sheet size={16} />
              Download CSV Template
            </button>
            <label className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold shadow-sm transition-colors cursor-pointer ${
              isImporting
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white/70 border-white/80 text-gray-700 hover:bg-white'
            }`}>
              <Upload size={16} />
              {isImporting ? 'Importing CSV...' : 'Import CSV'}
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleCsvImport}
                className="hidden"
                disabled={isImporting}
              />
            </label>
            <button
              type="button"
              onClick={exportGuestsCsv}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 border border-white/80 text-sm font-semibold text-gray-700 hover:bg-white transition-colors shadow-sm"
            >
              <Download size={16} />
              Export Guests CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl sm:rounded-2xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-sm">
          <table className="w-full min-w-[820px] text-left border-collapse">
            <thead>
              <tr style={{ background: 'rgba(229,168,48,0.05)', borderBottom: '1px solid rgba(229,168,48,0.12)' }}>
                {['Guest', 'Honorific', 'Type', 'Location', 'RSVP', 'Invite', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 sm:px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              <AnimatePresence initial={false}>
                {filteredGuests.map(guest => (
                  <motion.tr
                    key={guest._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="group hover:bg-yellow-400/[0.03] transition-colors"
                  >
                    <td className="px-4 sm:px-5 py-3.5">
                      <p className="font-semibold text-gray-900 text-sm">{guest.name}</p>
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-sm text-gray-600">{guest.honorific !== 'None' ? guest.honorific : '—'}</td>
                    <td className="px-4 sm:px-5 py-3.5 text-sm text-gray-600">{guest.family === 'Yes' ? 'Family' : 'Individual'}</td>
                    <td className="px-4 sm:px-5 py-3.5 text-sm text-gray-600">{guest.location || '—'}</td>
                    <td className="px-4 sm:px-5 py-3.5">{rsvpBadge(guest.rsvpStatus)}</td>
                    <td className="px-4 sm:px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {/* Copy */}
                        <button
                          onClick={() => copyInviteLink(guest.guestId)}
                          title="Copy Link"
                          className={`p-1.5 rounded-lg transition-all text-xs ${copyStatus[guest.guestId]
                            ? 'bg-emerald-500 text-white' : 'bg-white/60 text-gray-500 border border-white/70 hover:bg-white/80'}`}
                        >
                          {copyStatus[guest.guestId] ? <CheckCircle size={15} /> : <Copy size={15} />}
                        </button>
                        {/* WhatsApp */}
                        <button
                          onClick={() => shareInviteLink(guest._id)}
                          title="Share on WhatsApp"
                          className="p-1.5 rounded-lg bg-white/60 text-emerald-600 border border-white/70 hover:bg-emerald-50 transition-all"
                        >
                          <MessageCircle size={15} />
                        </button>
                        {/* PDF Export */}
                        <button
                          onClick={() => downloadInvitationPdf(guest, getInviteLink(guest.guestId))}
                          title="Download Invitation PDF"
                          className="p-1.5 rounded-lg bg-white/60 border border-white/70 hover:bg-yellow-50 transition-all"
                          style={{ color: '#c8860e' }}
                        >
                          <FileText size={15} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleEditClick(guest)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" aria-label="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => deleteGuest(guest._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400 italic">
                    {searchTerm ? 'No guests match your search.' : 'No guests yet. Add one above!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default GuestList;
