import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Save, Upload, Loader2, Image as ImageIcon, Video, CheckCircle, AlertCircle, PlusCircle, Trash2, Layout, Trash, Film, Camera } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { WORKSHOP_MEDIA, WORKSHOP_GALLERY } from '../utils/galleryData';

const AdminGalleryManager = () => {
  const navigate = useNavigate();
  const { loading, request } = useFetch();

  const [workshopMedia, setWorkshopMedia] = useState(WORKSHOP_MEDIA);
  const [workshopGallery, setWorkshopGallery] = useState(WORKSHOP_GALLERY);

  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const storedMedia = localStorage.getItem('ssm_workshop_media');
    const storedGallery = localStorage.getItem('ssm_workshop_gallery');
    if (storedMedia) setWorkshopMedia(JSON.parse(storedMedia));
    if (storedGallery) setWorkshopGallery(JSON.parse(storedGallery));
  }, []);

  const handleAddMedia = (type) => {
    if (type === 'video') {
      setWorkshopMedia([{ type: 'video', url: '', title: 'New Reel' }, ...workshopMedia]);
    } else {
      setWorkshopGallery([{ url: '', category: 'Men', title: 'New Capture', price: '₹1,500' }, ...workshopGallery]);
    }
  };

  const uploadHandler = async (e, type, idx) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const previewUrl = URL.createObjectURL(file);

    if (type === 'video') {
      const newMedia = [...workshopMedia];
      newMedia[idx].url = previewUrl;
      setWorkshopMedia(newMedia);
    } else {
      const newGallery = [...workshopGallery];
      newGallery[idx].url = previewUrl;
      setWorkshopGallery(newGallery);
    }
    setUploading(false);
  };

  const handleRemoveMedia = (idx, type) => {
    if (type === 'video') {
      setWorkshopMedia(workshopMedia.filter((_, i) => i !== idx));
    } else {
      setWorkshopGallery(workshopGallery.filter((_, i) => i !== idx));
    }
  };

  const handleSave = async () => {
    localStorage.setItem('ssm_workshop_media', JSON.stringify(workshopMedia));
    localStorage.setItem('ssm_workshop_gallery', JSON.stringify(workshopGallery));

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-32 pb-20 px-6 no-blur-zone">
      <div className="container mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6B6B6B] mb-4 hover:text-[#111]"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="text-5xl font-editorial font-black uppercase tracking-tighter text-[#111]">Gallery Hub</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Visual Asset Manager • Workshop & Atelier Feeds</p>
          </div>

          <div className="flex gap-4">
             <button
               onClick={handleSave}
               className="bg-[#111] text-white px-10 py-6 rounded-[2rem] flex items-center gap-3 hover:bg-[#8B0000] transition-all shadow-xl shadow-slate-200"
             >
                <Save size={20} />
                <span className="font-black uppercase tracking-widest text-xs">Deploy Changes</span>
             </button>
          </div>
        </div>

        {success && (
          <div className="bg-[#8B0000] text-white p-6 rounded-[2.5rem] mb-12 flex items-center shadow-xl border-4 border-white animate-in zoom-in-95 no-blur-zone">
            <CheckCircle className="w-8 h-8 mr-4" />
            <div>
              <p className="font-black uppercase tracking-widest text-lg">Update Successfull</p>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Live Atelier feeds synchronized with new media assets.</p>
            </div>
          </div>
        )}

        <div className="space-y-20">
          {/* Section: Videos */}
          <section>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-editorial font-black uppercase tracking-tight flex items-center gap-4">
                <Film className="text-[#8B0000]" size={32} /> Workshop Reels
              </h2>
              <button
                onClick={() => handleAddMedia('video')}
                className="text-[10px] font-black uppercase bg-white border border-[#111]/10 px-6 py-4 rounded-2xl hover:bg-[#111] hover:text-white transition-all shadow-sm"
              >
                + New Reel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(workshopMedia) && workshopMedia.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-[#111]/5 shadow-sm hover:shadow-xl transition-all group">
                  <div className="aspect-video bg-black rounded-[1.5rem] flex items-center justify-center overflow-hidden relative group/vid mb-6">
                    {item.url ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="text-white/20" size={48} />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/vid:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                      <Upload size={24} className="text-white mb-2" />
                      <span className="text-[10px] text-white font-black uppercase tracking-widest">Replace Video</span>
                      <input type="file" className="hidden" accept="video/*" onChange={(e) => uploadHandler(e, 'video', idx)} />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newMedia = [...workshopMedia];
                        newMedia[idx].title = e.target.value;
                        setWorkshopMedia(newMedia);
                      }}
                      placeholder="Enter Reel Title..."
                      className="w-full bg-[#F7F5F0] border-0 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-[#8B0000]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const newMedia = [...workshopMedia];
                          newMedia[idx].url = e.target.value;
                          setWorkshopMedia(newMedia);
                        }}
                        placeholder="Video Path (e.g. /video.mp4)"
                        className="flex-1 bg-[#F7F5F0] border-0 rounded-xl px-5 py-3 text-[10px] font-bold outline-none"
                      />
                      <button
                        onClick={() => handleRemoveMedia(idx, 'video')}
                        className="p-3 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Photos */}
          <section>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-editorial font-black uppercase tracking-tight flex items-center gap-4">
                <Camera className="text-blue-600" size={32} /> Atelier Gallery
              </h2>
              <button
                onClick={() => handleAddMedia('photo')}
                className="text-[10px] font-black uppercase bg-white border border-[#111]/10 px-6 py-4 rounded-2xl hover:bg-[#111] hover:text-white transition-all shadow-sm"
              >
                + New Capture
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(workshopGallery) && workshopGallery.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-[#111]/5 shadow-sm hover:shadow-xl transition-all group">
                  <div className="aspect-square bg-[#F7F5F0] rounded-[1.5rem] overflow-hidden relative group/img mb-6 shadow-inner border border-[#111]/5">
                    {item.url ? (
                      <img src={item.url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="text-[#111]/10" size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity gap-4">
                      <label className="p-4 bg-white/20 rounded-2xl cursor-pointer hover:bg-white/40 transition-colors">
                        <Upload size={24} className="text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadHandler(e, 'photo', idx)} />
                      </label>
                      <button
                        onClick={() => handleRemoveMedia(idx, 'photo')}
                        className="p-4 bg-rose-500/80 text-white rounded-2xl hover:bg-rose-600 transition-colors"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newGallery = [...workshopGallery];
                        newGallery[idx].title = e.target.value;
                        setWorkshopGallery(newGallery);
                      }}
                      placeholder="Capture Title"
                      className="w-full bg-[#F7F5F0] border-0 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
                    />
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const newGallery = [...workshopGallery];
                        newGallery[idx].category = e.target.value;
                        setWorkshopGallery(newGallery);
                      }}
                      className="w-full bg-[#F7F5F0] border-0 rounded-xl px-4 py-2 text-[8px] font-black uppercase tracking-widest outline-none cursor-pointer"
                    >
                      <option value="Heritage">Heritage</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Sneakers">Sneakers</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => {
                        const newGallery = [...workshopGallery];
                        newGallery[idx].price = e.target.value;
                        setWorkshopGallery(newGallery);
                      }}
                      placeholder="Label (e.g. ₹1,500)"
                      className="w-full bg-[#F7F5F0] border-0 rounded-xl px-4 py-2 text-[9px] font-bold outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryManager;
