
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, Loader2, Heart, Calendar, MapPin, Users, Baby, Phone, UserCircle, MessageSquare, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const ContentManager = () => {
  const { settings: initialSettings, refreshSettings } = useSettings();
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleDirectUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();

    formData.append('image', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      callback(res.data.url);
      setFeedback({ type: 'success', message: 'Image uploaded successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Upload failed.' });
    }
  };

  const updateTeamMember = (teamIdx, memberIdx, field, value) => {
    const newTeams = [...settings.teams];
    newTeams[teamIdx].members[memberIdx] = { ...newTeams[teamIdx].members[memberIdx], [field]: value };
    setSettings(prev => ({ ...prev, teams: newTeams }));
  };

  const addTeamMember = (teamIdx) => {
    const newTeams = [...settings.teams];
    newTeams[teamIdx].members.push({ name: '', photo: 'https://via.placeholder.com/150', contact: '' });
    setSettings(prev => ({ ...prev, teams: newTeams }));
  };

  const removeTeamMember = (teamIdx, memberIdx) => {
    const newTeams = [...settings.teams];
    newTeams[teamIdx].members = newTeams[teamIdx].members.filter((_, i) => i !== memberIdx);
    setSettings(prev => ({ ...prev, teams: newTeams }));
  };

  const updateTeamTitle = (teamIdx, field, value) => {
    const newTeams = [...settings.teams];
    newTeams[teamIdx] = { ...newTeams[teamIdx], [field]: value };
    setSettings(prev => ({ ...prev, teams: newTeams }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await axios.post('/api/content', { settings }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setFeedback({ type: 'success', message: 'Content updated successfully!' });
      refreshSettings();
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to update content.' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateEvent = (index, field, value) => {
    const newEvents = [...settings.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setSettings(prev => ({ ...prev, events: newEvents }));
  };

  const addEvent = () => {
    setSettings(prev => ({
      ...prev,
      events: [...prev.events, { name: '', date: '', time: '', description: '', icon: '✨' }]
    }));
  };

  const removeEvent = (index) => {
    const newEvents = settings.events.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, events: newEvents }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Save className="text-maroon-700" /> Content Management System
          </h2>
          <p className="text-gray-500 text-sm mt-1">Update your invitation content in real-time</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="bg-maroon-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-maroon-700/20 flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save All Changes
        </motion.button>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}
        >
          {feedback.message}
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-100 pb-px">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 font-bold transition-all border-b-2 ${activeTab === 'general' ? 'border-maroon-700 text-maroon-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          General Content
        </button>
        <button
          onClick={() => setActiveTab('visibility')}
          className={`px-6 py-3 font-bold transition-all border-b-2 ${activeTab === 'visibility' ? 'border-maroon-700 text-maroon-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Section Visibility
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Couple Names */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 text-maroon-700 border-b border-gray-50 pb-3">
              <Heart size={20} /> Couple Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Groom's Name</label>
                <input 
                  type="text" 
                  value={settings.coupleNames.groom} 
                  onChange={(e) => updateField('coupleNames', 'groom', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Bride's Name</label>
                <input 
                  type="text" 
                  value={settings.coupleNames.bride} 
                  onChange={(e) => updateField('coupleNames', 'bride', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Wedding Date Text</label>
                <input 
                  type="text" 
                  value={settings.weddingDate} 
                  onChange={(e) => setSettings({...settings, weddingDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                  placeholder="e.g. 12 May 2026"
                />
              </div>
            </div>
          </section>

          {/* Messages */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 text-maroon-700 border-b border-gray-50 pb-3">
              <MessageSquare size={20} /> Core Messages
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Atithi Devo Bhava Section Title</label>
                <input 
                  type="text" 
                  value={settings.messages.atithiDevoBhava} 
                  onChange={(e) => updateField('messages', 'atithiDevoBhava', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Invitation Tagline</label>
                <input 
                  type="text" 
                  value={settings.messages.invitation} 
                  onChange={(e) => updateField('messages', 'invitation', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Footer Quote</label>
                <textarea 
                  rows={2}
                  value={settings.messages.bottomQuote} 
                  onChange={(e) => updateField('messages', 'bottomQuote', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Hero Subtitle</label>
                <input 
                  type="text" 
                  value={settings.messages.heroSubtitle} 
                  onChange={(e) => updateField('messages', 'heroSubtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Save the Date Heading</label>
                <input 
                  type="text" 
                  value={settings.messages.saveTheDate} 
                  onChange={(e) => updateField('messages', 'saveTheDate', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Venue Section Title (Hindi)</label>
                <input 
                  type="text" 
                  value={settings.messages.venueTitle} 
                  onChange={(e) => updateField('messages', 'venueTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Map Button Text</label>
                <input 
                  type="text" 
                  value={settings.messages.viewOnMap} 
                  onChange={(e) => updateField('messages', 'viewOnMap', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Gallery Section Title (Hindi)</label>
                <input 
                  type="text" 
                  value={settings.messages.galleryTitle} 
                  onChange={(e) => updateField('messages', 'galleryTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Gallery Section Subtitle (English)</label>
                <input 
                  type="text" 
                  value={settings.messages.gallerySubtitle} 
                  onChange={(e) => updateField('messages', 'gallerySubtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Events Section Title (Hindi)</label>
                <input 
                  type="text" 
                  value={settings.messages.eventsTitle} 
                  onChange={(e) => updateField('messages', 'eventsTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Events Section Subtitle (Hindi)</label>
                <input 
                  type="text" 
                  value={settings.messages.eventsSubtitle} 
                  onChange={(e) => updateField('messages', 'eventsSubtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Events Section Journey Tag (English)</label>
                <input 
                  type="text" 
                  value={settings.messages.eventsJourney} 
                  onChange={(e) => updateField('messages', 'eventsJourney', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Venue */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 text-maroon-700 border-b border-gray-50 pb-3">
              <MapPin size={20} /> Venue Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Venue Name</label>
                <input 
                  type="text" 
                  value={settings.venue.name} 
                  onChange={(e) => updateField('venue', 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Location/Address</label>
                <input 
                  type="text" 
                  value={settings.venue.address} 
                  onChange={(e) => updateField('venue', 'address', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Google Maps URL</label>
                <input 
                  type="text" 
                  value={settings.venue.mapUrl} 
                  onChange={(e) => updateField('venue', 'mapUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Transport Info</label>
                <input 
                  type="text" 
                  value={settings.venue.transportInfo} 
                  onChange={(e) => updateField('venue', 'transportInfo', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Events Timeline */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 text-maroon-700">
                <Calendar size={20} /> Events Timeline
              </h3>
              <button 
                onClick={addEvent}
                className="text-maroon-700 hover:bg-maroon-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
              >
                <Plus size={18} /> Add Event
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.events.map((event, idx) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 relative group">
                  <button 
                    onClick={() => removeEvent(idx)}
                    className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Event Name</label>
                      <input 
                        type="text" 
                        value={event.name} 
                        onChange={(e) => updateEvent(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Date</label>
                      <input 
                        type="text" 
                        value={event.date} 
                        onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Time</label>
                      <input 
                        type="text" 
                        value={event.time} 
                        onChange={(e) => updateEvent(idx, 'time', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Description</label>
                      <textarea 
                        rows={2}
                        value={event.description} 
                        onChange={(e) => updateEvent(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Traditional Sections Management */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-8 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 text-maroon-700 border-b border-gray-50 pb-3">
              <Users size={20} /> Traditional Sections (Family & Elders)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {settings.teams && settings.teams.map((team, teamIdx) => (
                <div key={teamIdx} className="space-y-4 p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Section Title (Hindi)</label>
                      <input 
                        type="text" 
                        value={team.title} 
                        onChange={(e) => updateTeamTitle(teamIdx, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {team.members.map((member, memberIdx) => (
                      <div key={memberIdx} className="p-3 bg-white rounded-xl border border-gray-100 relative group shadow-sm">
                        <button 
                          onClick={() => removeTeamMember(teamIdx, memberIdx)}
                          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm flex-shrink-0">
                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                            <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                              <Plus size={12} className="text-white" />
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleDirectUpload(e, (url) => updateTeamMember(teamIdx, memberIdx, 'photo', url))}
                              />
                            </label>
                          </div>
                          <div className="flex-1">
                            <input 
                              type="text" 
                              placeholder="Name"
                              value={member.name} 
                              onChange={(e) => updateTeamMember(teamIdx, memberIdx, 'name', e.target.value)}
                              className="w-full text-sm font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <input 
                            type="text" 
                            placeholder="Subtitle (e.g. IT Engineer)"
                            value={member.subtitle || ''} 
                            onChange={(e) => updateTeamMember(teamIdx, memberIdx, 'subtitle', e.target.value)}
                            className="w-full text-[10px] text-gray-900 bg-gray-50 px-2 py-1 rounded border border-transparent focus:border-gray-200 transition-all outline-none"
                          />
                          <input 
                            type="text" 
                            placeholder="Contact (optional)"
                            value={member.contact || ''} 
                            onChange={(e) => updateTeamMember(teamIdx, memberIdx, 'contact', e.target.value)}
                            className="w-full text-[10px] text-gray-900 bg-gray-50 px-2 py-1 rounded border border-transparent focus:border-gray-200 transition-all outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => addTeamMember(teamIdx)}
                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-maroon-700 hover:border-maroon-700/30 hover:bg-maroon-50/30 transition-all text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Add Member to {team.title}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Baal Aagrah */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 text-maroon-700 border-b border-gray-50 pb-3">
              <Baby size={20} /> Baal Aagrah Content
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Invitation Poem (Use \n for new lines)</label>
                <textarea 
                  rows={4}
                  value={settings.baalAagrah.poem} 
                  onChange={(e) => updateField('baalAagrah', 'poem', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Children's Names (Comma separated)</label>
                <textarea 
                  rows={2}
                  value={settings.baalAagrah.names.join(', ')} 
                  onChange={(e) => updateField('baalAagrah', 'names', e.target.value.split(',').map(n => n.trim()))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Preshak */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 text-maroon-700 border-b border-gray-50 pb-3">
              <UserCircle size={20} /> Preshak Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-6 mb-2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md group">
                  <img src={settings.preshak.image} alt="Preshak" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                    <Plus size={20} />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleDirectUpload(e, (url) => updateField('preshak', 'image', url))}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Sender Name</label>
                  <input 
                    type="text" 
                    value={settings.preshak.name} 
                    onChange={(e) => updateField('preshak', 'name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Bottom Quote</label>
                <input 
                  type="text" 
                  value={settings.preshak.quote} 
                  onChange={(e) => updateField('preshak', 'quote', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Contact Numbers */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 text-maroon-700 border-b border-gray-50 pb-3">
              <Phone size={20} /> RSVP Contact Numbers
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Primary Contact</label>
                <input 
                  type="text" 
                  value={settings.contactNumbers.primary} 
                  onChange={(e) => updateField('contactNumbers', 'primary', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Secondary Contact</label>
                <input 
                  type="text" 
                  value={settings.contactNumbers.secondary} 
                  onChange={(e) => updateField('contactNumbers', 'secondary', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all"
                />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-8 text-maroon-700 border-b border-gray-50 pb-3">
            <Eye size={20} /> Section Visibility Control
          </h3>
          <p className="text-gray-500 text-sm mb-8">Toggle which sections are visible to your guests on the invitation page.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(settings.visibility || {})
              .filter(section => section !== 'adexPromo' && section !== 'adexPopup')
              .map((section) => (
              <div 
                key={section}
                className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${
                  settings.visibility[section] 
                    ? 'bg-emerald-50/30 border-emerald-100 shadow-sm' 
                    : 'bg-gray-50/50 border-gray-100 opacity-70'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${settings.visibility[section] ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {settings.visibility[section] ? <Eye size={20} /> : <EyeOff size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 capitalize">{section.replace(/([A-Z])/g, ' $1')}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {settings.visibility[section] ? 'Currently Visible' : 'Hidden from guests'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      visibility: {
                        ...prev.visibility,
                        [section]: !prev.visibility[section]
                      }
                    }));
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    settings.visibility[section] ? 'bg-maroon-700' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.visibility[section] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ContentManager;
