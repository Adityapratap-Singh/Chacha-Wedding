import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import {
  UserPlus, Trash2, Copy, CheckCircle, XCircle, Clock,
  MessageCircle, Search, MapPin, Edit, X, FileText, Upload, Download, Sheet
} from 'lucide-react';

/* ── PDF helpers ── */
const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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
    `  Rinu Singh\n\n` +
    `Dear ${honorific}${guest.name}${family},\n\n` +
    `You are cordially invited to grace us with your presence\n` +
    `and be a part of this cherished celebration.\n\n` +
    `📅  12 May 2026\n\n` +
    `🔗 Your personal invitation link:\n${inviteUrl}\n\n` +
    `आपकी उपस्थिति हमारे लिए अमूल्य है।\n` +
    `— Pushpendra & Rinu`
  );
};

const generatePDF = (guest, inviteUrl) => {
  const honorific = guest.honorific && guest.honorific !== 'None' ? `${guest.honorific} ` : '';
  const guestLine = `${honorific}${guest.name}${guest.family === 'Yes' ? ' & Family' : ''}`;
  const personalizedNote = guest.specialMessage?.trim()
    ? guest.specialMessage.trim()
    : 'Your presence, blessings, and warmth will make this celebration complete.';
  const locationLine = guest.location?.trim() || 'With love from our family';
  const fileSafeGuestName = guest.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(inviteUrl)}`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Invitation-${escapeHtml(fileSafeGuestName || 'Guest')}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Cinzel:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Tangerine:wght@700&display=swap');
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 210mm; min-height: 297mm; }
  body {
    color: #f7eedc;
    font-family: 'Cormorant Garamond', serif;
    background:
      radial-gradient(circle at top left, rgba(229,168,48,0.14), transparent 26%),
      radial-gradient(circle at top right, rgba(124,17,44,0.24), transparent 28%),
      linear-gradient(180deg, #120609 0%, #090308 42%, #13070b 100%);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    position: relative;
    width: 210mm;
    min-height: 297mm;
    padding: 18mm;
    overflow: hidden;
  }
  .frame {
    position: relative;
    min-height: calc(297mm - 36mm);
    padding: 14mm;
    border-radius: 20px;
    border: 1px solid rgba(229,168,48,0.22);
    background:
      linear-gradient(155deg, rgba(255,248,231,0.08), rgba(115,10,38,0.15) 42%, rgba(10,6,10,0.96) 92%);
    box-shadow: inset 0 0 0 1px rgba(255,248,231,0.04);
  }
  .frame::before,
  .frame::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
  }
  .frame::before {
    inset: -10% auto auto -18%;
    width: 150mm;
    height: 150mm;
    background: radial-gradient(circle, rgba(229,168,48,0.11), transparent 70%);
  }
  .frame::after {
    inset: auto -12% -10% auto;
    width: 120mm;
    height: 120mm;
    background: radial-gradient(circle, rgba(124,17,44,0.18), transparent 72%);
  }
  .border {
    position: absolute;
    inset: 10mm;
    border-radius: 14px;
    border: 1px solid rgba(229,168,48,0.12);
    pointer-events: none;
  }
  .ornament {
    position: absolute;
    width: 18mm;
    height: 18mm;
    border-color: rgba(229,168,48,0.26);
    pointer-events: none;
  }
  .tl { top: 14mm; left: 14mm; border-top: 1px solid; border-left: 1px solid; border-top-left-radius: 10px; }
  .tr { top: 14mm; right: 14mm; border-top: 1px solid; border-right: 1px solid; border-top-right-radius: 10px; }
  .bl { bottom: 14mm; left: 14mm; border-bottom: 1px solid; border-left: 1px solid; border-bottom-left-radius: 10px; }
  .br { bottom: 14mm; right: 14mm; border-bottom: 1px solid; border-right: 1px solid; border-bottom-right-radius: 10px; }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  .top {
    text-align: center;
    padding-top: 4mm;
  }
  .eyebrow {
    display: inline-block;
    padding: 3mm 6mm;
    border-radius: 999px;
    border: 1px solid rgba(229,168,48,0.16);
    background: rgba(255,248,231,0.04);
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: rgba(229,168,48,0.74);
  }
  .mantra {
    margin-top: 8mm;
    font-family: 'Tangerine', cursive;
    font-size: 24pt;
    color: #f2cf7a;
    text-shadow: 0 0 22px rgba(229,168,48,0.2);
  }
  .divider {
    width: 44mm;
    height: 1px;
    margin: 5mm auto 0;
    background: linear-gradient(90deg, transparent, rgba(229,168,48,0.72), transparent);
  }
  .couple-wrap {
    text-align: center;
    margin-top: 12mm;
  }
  .couple {
    font-size: 28pt;
    font-weight: 600;
    font-style: italic;
    line-height: 1.08;
    background: linear-gradient(135deg, #c8860e, #fff2c3 35%, #d69f2e 68%, #c8860e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .and {
    display: block;
    margin: 2mm 0;
    font-family: 'Tangerine', cursive;
    font-size: 30pt;
    color: rgba(229,168,48,0.88);
    line-height: 1;
  }
  .invitee {
    margin: 12mm auto 0;
    max-width: 130mm;
    padding: 5mm 6mm;
    border-radius: 14px;
    background: linear-gradient(180deg, rgba(255,248,231,0.05), rgba(255,255,255,0.02));
    border: 1px solid rgba(229,168,48,0.12);
    text-align: center;
  }
  .invitee-label {
    font-family: 'Cinzel', serif;
    font-size: 7px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: rgba(229,168,48,0.56);
  }
  .invitee-name {
    margin-top: 2.5mm;
    font-size: 20pt;
    font-style: italic;
    color: #fff4da;
  }
  .copy {
    margin: 8mm auto 0;
    max-width: 128mm;
    text-align: center;
    font-size: 14pt;
    line-height: 1.7;
    color: rgba(247,238,220,0.8);
  }
  .message {
    margin: 4mm auto 0;
    max-width: 128mm;
    text-align: center;
    font-size: 12.5pt;
    line-height: 1.7;
    color: rgba(247,238,220,0.62);
  }
  .details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 5mm;
    margin-top: 11mm;
  }
  .detail-card {
    padding: 5.5mm;
    border-radius: 16px;
    border: 1px solid rgba(229,168,48,0.12);
    background: linear-gradient(180deg, rgba(255,248,231,0.05), rgba(255,255,255,0.02));
  }
  .detail-label {
    font-family: 'Cinzel', serif;
    font-size: 7px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(229,168,48,0.6);
    margin-bottom: 2.5mm;
  }
  .detail-value {
    font-size: 15pt;
    color: #fff2d4;
    line-height: 1.45;
  }
  .detail-sub {
    margin-top: 1.2mm;
    font-family: 'Manrope', sans-serif;
    font-size: 9pt;
    color: rgba(247,238,220,0.5);
    line-height: 1.6;
  }
  .link-box {
    margin-top: 8mm;
    padding: 6mm;
    border-radius: 16px;
    background: rgba(229,168,48,0.07);
    border: 1px solid rgba(229,168,48,0.18);
  }
  .link-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(42mm, 52mm);
    gap: 5mm;
    align-items: center;
  }
  .link-label {
    font-family: 'Cinzel', serif;
    font-size: 7px;
    letter-spacing: 0.3em;
    color: rgba(229,168,48,0.62);
    text-transform: uppercase;
  }
  .link {
    display: block;
    margin-top: 2.5mm;
    font-family: 'Manrope', sans-serif;
    font-size: 9.2pt;
    line-height: 1.6;
    word-break: break-all;
    color: #f8d98e;
    text-decoration: none;
  }
  .qr-wrap {
    padding: 3mm;
    border-radius: 12px;
    background: rgba(255,248,231,0.05);
    border: 1px solid rgba(229,168,48,0.14);
    text-align: center;
  }
  .qr-box {
    width: 44mm;
    height: 44mm;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
    background: white;
    padding: 2.5mm;
  }
  .qr-caption {
    margin-top: 2mm;
    font-family: 'Cinzel', serif;
    font-size: 6.5px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(229,168,48,0.52);
  }
  .footer {
    margin-top: auto;
    padding-top: 10mm;
    text-align: center;
  }
  .hindi {
    font-size: 15pt;
    font-style: italic;
    color: rgba(242, 207, 122, 0.78);
  }
  .from {
    margin-top: 2.5mm;
    font-family: 'Manrope', sans-serif;
    font-size: 9pt;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(247,238,220,0.46);
  }
  @media print {
    .page { margin: 0; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="frame">
    <div class="border"></div>
    <div class="ornament tl"></div>
    <div class="ornament tr"></div>
    <div class="ornament bl"></div>
    <div class="ornament br"></div>

    <div class="content">
      <div class="top">
        <span class="eyebrow">Wedding Invitation</span>
        <p class="mantra">Atithi Devo Bhava</p>
        <div class="divider"></div>
      </div>

      <div class="couple-wrap">
        <div class="couple">Pushpendra Kumar Singh</div>
        <span class="and">&amp;</span>
        <div class="couple">Rinu Singh</div>
      </div>

      <div class="invitee">
        <div class="invitee-label">Honoured Guest</div>
        <div class="invitee-name">${escapeHtml(guestLine)}</div>
      </div>

      <p class="copy">
        You are warmly invited to celebrate with us as two families come together in joy, tradition, and blessing.
      </p>
      <p class="message">
        ${escapeHtml(personalizedNote)}
      </p>

      <div class="details">
        <div class="detail-card">
          <div class="detail-label">Ceremony Date</div>
          <div class="detail-value">12 May 2026</div>
          <div class="detail-sub">Tuesday · Baraat welcome from 8:00 PM</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">Venue</div>
          <div class="detail-value">Maa Ambe Guest House</div>
          <div class="detail-sub">Chhani · ${escapeHtml(locationLine)}</div>
        </div>
      </div>

      <div class="link-box">
        <div class="link-grid">
          <div>
            <div class="link-label">Personal Invitation Link</div>
            <a class="link" href="${escapeHtml(inviteUrl)}">${escapeHtml(inviteUrl)}</a>
          </div>
          <div class="qr-wrap">
            <img class="qr-box" src="${qrCodeUrl}" alt="QR code for invitation link" />
            <div class="qr-caption">Scan to open</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p class="hindi">आपकी उपस्थिति हमारे लिए अमूल्य है।</p>
        <p class="from">With Love · Pushpendra &amp; Rinu</p>
      </div>
    </div>
  </div>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;
  const w = window.open('', '_blank', 'width=700,height=900');
  if (w) { w.document.write(html); w.document.close(); }
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
                          onClick={() => generatePDF(guest, getInviteLink(guest.guestId))}
                          title="Export Invitation as PDF"
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
