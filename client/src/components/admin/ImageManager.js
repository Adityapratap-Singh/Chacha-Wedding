
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, Trash2, Loader2, Image as ImageIcon, Users, Baby, UserCircle, Plus, Move } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const ImageManager = () => {
  const { settings, refreshSettings } = useSettings();
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpload = async (e, category, options = {}) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });

      const imageUrl = res.data.url;
      let updatedSettings = { ...settings };

      if (category === 'gallery') {
        updatedSettings.gallery = [...updatedSettings.gallery, { url: imageUrl, title: options.title || 'New Image' }];
      } else if (category === 'preshak') {
        updatedSettings.preshak = { ...updatedSettings.preshak, image: imageUrl };
      } else if (category === 'baalAagrah') {
        const { idx } = options;
        let newImages = [...(updatedSettings.baalAagrah.images || [])];
        while(newImages.length <= idx) newImages.push({ url: '', objectPosition: 'center' });
        newImages[idx] = { ...newImages[idx], url: imageUrl };
        updatedSettings.baalAagrah.images = newImages;
      } else if (category === 'teams') {
        const { teamIdx, memberIdx } = options;
        const newTeams = [...updatedSettings.teams];
        newTeams[teamIdx].members[memberIdx].photo = imageUrl;
        updatedSettings.teams = newTeams;
      }

      await axios.post('/api/content', { settings: updatedSettings }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });

      showFeedback('success', 'Image uploaded and saved!');
      refreshSettings();
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const updateObjectPosition = async (category, pos, options = {}) => {
    let updatedSettings = { ...settings };
    if (category === 'teams') {
      const { teamIdx, memberIdx } = options;
      updatedSettings.teams[teamIdx].members[memberIdx].objectPosition = pos;
    } else if (category === 'baalAagrah') {
      const { idx } = options;
      if (!updatedSettings.baalAagrah.images[idx]) {
        updatedSettings.baalAagrah.images[idx] = { url: '', objectPosition: 'center' };
      }
      updatedSettings.baalAagrah.images[idx].objectPosition = pos;
    }

    try {
      await axios.post('/api/content', { settings: updatedSettings }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      refreshSettings();
    } catch (err) {
      showFeedback('error', 'Failed to update position.');
    }
  };

  const removeImage = async (category, index, options = {}) => {
    let updatedSettings = { ...settings };

    if (category === 'gallery') {
      updatedSettings.gallery = updatedSettings.gallery.filter((_, i) => i !== index);
    } else if (category === 'baalAagrah') {
      if (updatedSettings.baalAagrah.images[index]) {
        updatedSettings.baalAagrah.images[index].url = '';
      }
    }

    try {
      await axios.post('/api/content', { settings: updatedSettings }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      showFeedback('success', 'Image removed!');
      refreshSettings();
    } catch (err) {
      showFeedback('error', 'Failed to remove image.');
    }
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        activeTab === id 
          ? 'bg-maroon-700 text-white shadow-lg shadow-maroon-700/20' 
          : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const PositionSlider = ({ value, onChange, label = "Adjust Focus" }) => {
    const numericValue = value === 'center' ? 50 : (parseInt(value) || 50);
    
    return (
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <label className="flex items-center gap-1"><Move size={10} /> {label}</label>
          <span>{numericValue}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={numericValue} 
          onChange={(e) => onChange(`${e.target.value}%`)}
          className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-maroon-700"
        />
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Upload className="text-maroon-700" /> Image Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">Upload and organize images for different sections</p>
        </div>
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <TabButton id="gallery" icon={ImageIcon} label="Gallery" />
        <TabButton id="teams" icon={Users} label="Traditional Section" />
        <TabButton id="baalAagrah" icon={Baby} label="Baal Aagrah" />
        <TabButton id="preshak" icon={UserCircle} label="Preshak" />
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-gray-800">Wedding Gallery</h3>
              <label className="cursor-pointer bg-maroon-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-maroon-800 transition-colors">
                <Plus size={16} /> Add to Gallery
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    const title = prompt("Enter image title:");
                    if (title) handleUpload(e, 'gallery', { title });
                  }} 
                />
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {settings.gallery.map((img, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                    <p className="text-white text-xs font-bold mb-2">{img.title}</p>
                    <button 
                      onClick={() => removeImage('gallery', idx)}
                      className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-12">
            {settings.teams.map((team, teamIdx) => (
              <div key={teamIdx} className="space-y-6">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-maroon-700 text-lg">{team.title}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{team.titleEn}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {team.members.map((member, memberIdx) => (
                    <div key={memberIdx} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/50 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                          <img 
                            src={member.photo} 
                            alt={member.name} 
                            className="w-full h-full object-cover" 
                            style={{ objectPosition: `center ${member.objectPosition || 'center'}` }}
                          />
                          <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Upload size={18} className="text-white" />
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => handleUpload(e, 'teams', { teamIdx, memberIdx })} 
                            />
                          </label>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{member.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Click photo to update</p>
                        </div>
                      </div>
                      <PositionSlider 
                        value={member.objectPosition || '50%'} 
                        onChange={(pos) => updateObjectPosition('teams', pos, { teamIdx, memberIdx })}
                        label="Vertical Focus"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'baalAagrah' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-gray-800">Baal Aagrah Cards</h3>
              <p className="text-sm text-gray-500 italic">Adjust focus to ensure heads are not cut off</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(settings.baalAagrah.names || []).map((name, idx) => {
                const imgData = settings.baalAagrah.images && settings.baalAagrah.images[idx] ? settings.baalAagrah.images[idx] : { url: '', objectPosition: 'center' };
                const displayUrl = imgData.url || `https://res.cloudinary.com/do4z0pybd/image/upload/w_200,h_200,c_fill,r_max/v1/wedding-avatar-gold?text=${encodeURIComponent(name.split(' ')[0])}&bg_8B0000&co_FFFDD0`;
                
                return (
                  <div key={idx} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/50 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0 group">
                        <img 
                          src={displayUrl} 
                          alt={name} 
                          className="w-full h-full object-cover" 
                          style={{ objectPosition: `center ${imgData.objectPosition || 'center'}` }}
                        />
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Upload size={20} className="text-white" />
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleUpload(e, 'baalAagrah', { idx })} 
                          />
                        </label>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate">{name}</p>
                        <button 
                          onClick={() => removeImage('baalAagrah', idx)}
                          className="text-[10px] text-rose-500 hover:text-rose-700 uppercase tracking-widest font-bold mt-1"
                        >
                          Reset Photo
                        </button>
                      </div>
                    </div>
                    {imgData.url && (
                      <PositionSlider 
                        value={imgData.objectPosition || '50%'} 
                        onChange={(pos) => updateObjectPosition('baalAagrah', pos, { idx })}
                        label="Vertical Focus"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {activeTab === 'preshak' && (
          <div className="max-w-md mx-auto py-12 flex flex-col items-center text-center space-y-6">
            <h3 className="font-bold text-gray-800">Preshak Profile Image</h3>
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img src={settings.preshak.image} alt={settings.preshak.name} className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                <Upload size={24} className="mb-2" />
                <span className="text-sm font-bold">Update Photo</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleUpload(e, 'preshak')} 
                />
              </label>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xl">{settings.preshak.name}</p>
              <p className="text-gray-500 text-sm italic mt-2">"{settings.preshak.quote}"</p>
            </div>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
            <Loader2 className="animate-spin text-maroon-700 mb-4" size={40} />
            <p className="font-bold text-gray-800">Uploading to Cloudinary...</p>
            <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
