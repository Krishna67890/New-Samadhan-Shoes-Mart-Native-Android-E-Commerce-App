import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { gsap } from 'gsap';
import { resolveImageUrl } from '../utils/urlConfig';
import {
  User, Mail, Lock, ShieldCheck, Save, ArrowLeft,
  Camera, CheckCircle2, AlertCircle, RefreshCw, Phone, MapPin, Sparkles, Package, List, Settings, ChevronRight,
  Zap, ShieldAlert, Fingerprint, Activity, Award, ExternalLink, MessageSquare, LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const { loading, error, request } = useFetch();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [activeTab, setActiveTab] = useState('identity'); // 'identity', 'orders', 'security'
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [gender, setGender] = useState(user?.gender || 'boy');
  const [shoeSize, setShoeSize] = useState(user?.shoeSize || 'UK 8');
  const [stylePreference, setStylePreference] = useState(user?.stylePreference || 'Minimalist');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      if (user?.isGuest) return;
      try {
        // Optimized request handling for potential network drops
        const response = await request('/api/orders/myorders');
        if (response && Array.isArray(response)) {
          setOrders(response);
        } else {
          setOrders([]);
        }
      } catch (err) {
        // Log locally but keep UI stable
        console.warn("Order Journal Sync: Operating in offline/cached mode.");
        setOrders([]);
      }
    };

    if (activeTab === 'orders' || activeTab === 'identity') {
       fetchOrders();
    }

    // GSAP Entrance
    const ctx = gsap.context(() => {
        gsap.from('.profile-reveal', {
            y: 30,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power4.out'
        });

        gsap.from('.stat-card', {
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            delay: 0.5,
            ease: 'back.out(1.7)'
        });
    }, containerRef);

    return () => ctx.revert();
  }, [user, navigate, activeTab, request]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const cleanPhone = phone ? phone.replace(/\s/g, '').replace('+91', '') : '';
    if (cleanPhone && !/^[0-9]{10}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setIsUpdating(true);

    const updatedUser = {
      ...user,
      name,
      phone: cleanPhone || phone,
      address,
      city,
      pincode,
      gender,
      shoeSize,
      stylePreference,
      identityVerified: true,
    };

    setUser(updatedUser);
    localStorage.setItem('ssm_user_identity', JSON.stringify(updatedUser));

    if (!user?.isGuest) {
      try {
        await request('/api/users/profile', 'PUT', {
          name,
          phone,
          address,
          city,
          pincode,
          gender,
          shoeSize,
          stylePreference
        });
      } catch (err) {
        console.error("Server sync failed:", err);
      }
    }

    setIsUpdating(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const displayAvatar = resolveImageUrl(user?.avatar || (gender === 'girl' ? '/girl.png' : '/boy.png'));

  const stats = [
    { label: 'Rank', value: user?.isGuest ? 'Elite Guest' : 'Prime Member', icon: Award, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/10' },
    { label: 'Drops', value: orders.length, icon: Package, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/10' },
    { label: 'Node Speed', value: '1.2ms', icon: Activity, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/10' },
    { label: 'Security', value: 'AES-256', icon: ShieldCheck, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/10' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] pt-32 pb-24 px-4 sm:px-10 lg:px-20 relative overflow-x-hidden font-sans no-blur-zone" ref={containerRef}>
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-[0.03]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 profile-reveal">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#d4af37]"></div>
              <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.4em]">Collector Identity Matrix</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-editorial font-black text-[#111111] tracking-tighter leading-none uppercase">
              THE <span className="italic font-light text-[#d4af37]">VAULT.</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/95 p-2 rounded-[2rem] border border-[#111111]/5 shadow-sm">
             {['identity', 'orders', 'security'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-[#111111] text-white shadow-xl' : 'text-[#111111]/40 hover:text-[#111111] hover:bg-white'}`}
               >
                  {tab === 'identity' ? 'Identity Node' : tab === 'orders' ? 'Order Journal' : 'Security Layer'}
               </button>
             ))}
          </div>
        </div>

        {/* --- QUICK STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 profile-reveal">
           {stats.map((stat, i) => (
             <div key={i} className="stat-card bg-white p-8 rounded-[2.5rem] border border-[#111111]/5 shadow-sm group hover:shadow-xl transition-all duration-700">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <stat.icon size={20} />
                </div>
                <p className="text-[9px] font-bold text-[#111111]/30 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-[#111111] tracking-tight">{stat.value}</p>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* --- LEFT WING: AVATAR & ARCHITECT --- */}
          <div className="lg:col-span-4 space-y-8 profile-reveal">
             {/* USER IDENTITY CARD */}
             <div className="bg-white rounded-[3rem] p-10 border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#d4af37]"></div>

                <div className="relative inline-block mt-8">
                   <div className="w-48 h-48 bg-[#F7F5F0] rounded-[3.5rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl transition-transform duration-1000 group-hover:scale-105">
                      <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                   </div>
                   <button
                     onClick={() => navigate('/identity')}
                     className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#111111] text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-white hover:bg-[#d4af37] transition-all hover:rotate-12"
                   >
                     <Camera size={20} />
                   </button>
                </div>

                <div className="mt-10 space-y-2">
                   <h2 className="text-3xl font-editorial font-bold text-[#111111] uppercase tracking-tight">{user?.name}</h2>
                   <div className="flex items-center justify-center gap-2 text-[#111111]/40 font-mono text-[10px] tracking-wider">
                      <Mail size={12} /> {user?.email}
                   </div>
                </div>

                <div className="mt-10 pt-8 border-t border-[#111111]/5 grid grid-cols-2 gap-4 text-left">
                   <div className="p-5 bg-[#F7F5F0] rounded-[1.5rem]">
                      <p className="text-[8px] font-bold text-[#111111]/40 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">ACTIVE</p>
                   </div>
                   <div className="p-5 bg-[#F7F5F0] rounded-[1.5rem]">
                      <p className="text-[8px] font-bold text-[#111111]/40 uppercase tracking-widest mb-1">Since</p>
                      <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">2026</p>
                   </div>
                </div>

                <button
                  onClick={logout}
                  className="w-full mt-8 py-5 bg-[#111111]/5 text-[#111111] rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#111111] hover:text-white transition-all border border-[#111111]/10 flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Terminate Session
                </button>
             </div>

             {/* ARCHITECT BADGE */}
             <div className="bg-[#111111] rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d4af37]/10 rounded-full"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                   <img
                     src={resolveImageUrl('/Devloper.jpg')}
                     alt="Architect"
                     className="w-14 h-14 rounded-[1.2rem] object-cover border-2 border-[#d4af37] shadow-xl"
                     onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=KR&background=d4af37&color=fff'; }}
                   />
                   <div>
                      <p className="text-[9px] font-bold text-[#d4af37] uppercase tracking-[0.3em] mb-1">Technical Architect</p>
                      <h4 className="text-base font-black uppercase tracking-tighter">Krishna Rajput</h4>
                   </div>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed font-medium italic relative z-10 mb-6">
                   "Architecting premium digital experiences for New Samadhan Shoes. Every pixel, every route, engineered for performance."
                </p>
                <div className="flex gap-2 relative z-10">
                   <a href="https://krishnablogy.blogspot.com/" target="_blank" rel="noreferrer" className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[9px] font-bold uppercase tracking-widest hover:bg-[#d4af37] transition-all">
                      Support
                   </a>
                   <a href="https://krishna-patil-rajput.vercel.app/" target="_blank" rel="noreferrer" className="w-12 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                      <ExternalLink size={14} />
                   </a>
                </div>
             </div>
          </div>

          {/* --- RIGHT WING: TAB CONTENT --- */}
          <div className="lg:col-span-8 space-y-8 profile-reveal">

            {activeTab === 'identity' && (
              <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-2xl font-editorial font-bold text-[#111111] uppercase tracking-tight flex items-center gap-4">
                      <Settings size={24} className="text-[#d4af37]" /> Credentials
                   </h3>
                   {success && (
                      <div className="px-6 py-3 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-3 border border-[#d4af37]/20 animate-in fade-in">
                         <CheckCircle2 size={14} /> Vault Synced
                      </div>
                   )}
                </div>

                <form onSubmit={submitHandler} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">Legal Designation</label>
                         <div className="relative">
                            <input
                               type="text"
                               className="w-full pl-14 pr-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111] uppercase tracking-wide"
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               onKeyDown={(e) => e.stopPropagation()}
                            />
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#111111]/30" size={18} />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">WhatsApp Channel</label>
                         <div className="relative">
                            <input
                               type="text"
                               className="w-full pl-14 pr-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111]"
                               value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                               onKeyDown={(e) => e.stopPropagation()}
                            />
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#111111]/30" size={18} />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">Physical Coordinates</label>
                      <div className="relative">
                         <input
                            type="text"
                            className="w-full pl-14 pr-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111]"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                         />
                         <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#111111]/30" size={18} />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">City Node</label>
                         <input
                            type="text"
                            className="w-full px-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111] uppercase tracking-wide"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">Pincode Vector</label>
                         <input
                            type="text"
                            className="w-full px-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111]"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">Identity Gender</label>
                         <div className="relative">
                            <select
                               className="w-full px-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111] appearance-none cursor-pointer"
                               value={gender}
                               onChange={(e) => setGender(e.target.value)}
                            >
                               <option value="boy">Masculine / Boy</option>
                               <option value="girl">Feminine / Girl</option>
                            </select>
                            <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[#111111]/30 pointer-events-none" />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">Anatomical Fit (Shoe Size)</label>
                         <div className="relative">
                            <select
                               className="w-full px-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111] appearance-none cursor-pointer"
                               value={shoeSize}
                               onChange={(e) => setShoeSize(e.target.value)}
                            >
                               {['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'].map(size => (
                                  <option key={size} value={size}>{size}</option>
                               ))}
                            </select>
                            <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[#111111]/30 pointer-events-none" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#111111]/40 uppercase tracking-widest ml-4">Aesthetic Preference</label>
                      <div className="relative">
                         <select
                            className="w-full px-8 py-5 bg-[#F7F5F0] rounded-[1.5rem] border-2 border-transparent focus:border-[#111111]/10 focus:bg-white outline-none transition-all font-bold text-sm text-[#111111] appearance-none cursor-pointer"
                            value={stylePreference}
                            onChange={(e) => setStylePreference(e.target.value)}
                         >
                            {['Minimalist', 'Avant-Garde', 'Classic Luxury', 'Streetwear Elite'].map(style => (
                               <option key={style} value={style}>{style}</option>
                            ))}
                         </select>
                         <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[#111111]/30 pointer-events-none" />
                      </div>
                   </div>

                   <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full py-6 bg-[#111111] text-white rounded-[1.8rem] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-[#d4af37] transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 relative overflow-hidden group"
                   >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : <><Save size={18} /> Commit Changes to Vault</>}
                   </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
               <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] min-h-[600px]">
                  <div className="flex justify-between items-center mb-12">
                     <h3 className="text-2xl font-editorial font-bold text-[#111111] uppercase tracking-tight flex items-center gap-4">
                        <Package size={24} className="text-[#d4af37]" /> Order Journal
                     </h3>
                     <div className="px-6 py-3 bg-[#F7F5F0] rounded-full text-[10px] font-black text-[#111111]/40 uppercase tracking-widest border border-[#111111]/5">
                        {orders.length} Verified Drops
                     </div>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                       <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-[10px] font-bold text-[#111111]/30 uppercase tracking-[0.4em]">Querying Secure Ledger...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-[#F7F5F0] rounded-[2.5rem] border-2 border-dashed border-[#111111]/5 text-center px-10">
                       <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-[#111111]/10 mb-8 shadow-sm">
                          <Package size={40} />
                       </div>
                       <h4 className="text-xl font-editorial font-bold text-[#111111] uppercase tracking-tight mb-4">No Acquisitions Recorded</h4>
                       <p className="text-[#111111]/40 text-sm font-medium italic mb-10 max-w-xs">"Your premium journey is awaiting initiation. Access the catalog to begin."</p>
                       <Link to="/products" className="px-12 py-5 bg-[#111111] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#d4af37] transition-all shadow-xl">
                          Access High-Tier Catalog
                       </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       {orders.map((order) => (
                          <div key={order._id} className="p-8 bg-[#F7F5F0] rounded-[2.5rem] border border-transparent hover:border-[#d4af37]/10 hover:bg-white hover:shadow-2xl transition-all duration-700 group cursor-pointer">
                             <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-6">
                                   <div className="w-24 h-24 bg-white rounded-[2rem] p-3 border border-[#111111]/5 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                                      <img src={resolveImageUrl(order.orderItems[0]?.image)} alt="Asset" className="w-full h-full object-contain rounded-xl" />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-3 mb-2">
                                         <p className="text-[9px] font-mono text-[#d4af37] uppercase tracking-[0.2em] font-black">DROP ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                         <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-[#d4af37]' : 'bg-amber-500'} animate-pulse`}></div>
                                      </div>
                                      <h4 className="text-xl font-editorial font-black text-[#111111] uppercase tracking-tight">{order.orderItems.length} Luxury Silhouettes</h4>
                                      <p className="text-[10px] font-bold text-[#111111]/40 uppercase tracking-widest mt-1">{new Date(order.createdAt).toDateString()}</p>
                                   </div>
                                </div>

                                <div className="flex items-center gap-10">
                                   <div className="text-right">
                                      <p className="text-[9px] font-bold text-[#111111]/30 uppercase tracking-widest mb-1">Total Value</p>
                                      <p className="text-2xl font-editorial font-black text-[#111111]">₹{(order.totalPrice || 0).toLocaleString()}</p>
                                   </div>
                                   <button className="w-14 h-14 bg-white text-[#111111]/40 rounded-[1.5rem] border border-[#111111]/10 flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-all shadow-sm">
                                      <ChevronRight size={20} />
                                   </button>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                  )}
               </div>
            )}

            {activeTab === 'security' && (
               <div className="bg-[#111111] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden border border-white/5 shadow-2xl min-h-[600px]">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                     <ShieldCheck size={300} />
                  </div>

                  <div className="relative z-10">
                     <h3 className="text-2xl font-editorial font-bold text-white uppercase tracking-tight flex items-center gap-4 mb-12">
                        <Fingerprint size={28} className="text-[#d4af37]" /> Security Matrix
                     </h3>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all">
                           <div className="w-12 h-12 bg-[#d4af37]/10 text-[#d4af37] rounded-2xl flex items-center justify-center mb-6">
                              <ShieldAlert size={22} />
                           </div>
                           <h4 className="text-lg font-bold uppercase tracking-tight mb-3">Identity Encryption</h4>
                           <p className="text-[11px] text-white/40 leading-relaxed italic mb-6">"Your profile data is secured via AES-256 local-first protocols. No unauthorized node can access your shipping coordinates."</p>
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37]">ENCRYPTED</span>
                           </div>
                        </div>

                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all">
                           <div className="w-12 h-12 bg-[#d4af37]/10 text-[#d4af37] rounded-2xl flex items-center justify-center mb-6">
                              <Zap size={22} />
                           </div>
                           <h4 className="text-lg font-bold uppercase tracking-tight mb-3">Session Integrity</h4>
                           <p className="text-[11px] text-white/40 leading-relaxed italic mb-6">"Advanced session monitoring ensures that your account remains protected during high-tier acquisitions."</p>
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37]">OPTIMAL</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/40">
                                 <Phone size={16} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-white uppercase tracking-widest">WhatsApp Multi-Factor</p>
                                 <p className="text-[9px] text-white/30 uppercase tracking-widest">Authorized for Direct Shopkeeper Route</p>
                              </div>
                           </div>
                           <div className="px-4 py-2 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-[8px] font-black uppercase tracking-widest border border-[#d4af37]/20">
                              VERIFIED
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/40">
                                 <MessageSquare size={16} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-white uppercase tracking-widest">AI Concierge Link</p>
                                 <p className="text-[9px] text-white/30 uppercase tracking-widest">Connected to Krishna's Tech Node</p>
                              </div>
                           </div>
                           <button className="text-[9px] font-black uppercase tracking-widest text-[#d4af37] hover:underline transition-all">
                              REFRESH SYNC
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* --- FOOTER TAG --- */}
        <div className="mt-20 text-center profile-reveal">
           <p className="text-[9px] font-black text-[#111111]/20 uppercase tracking-[0.5em] flex items-center justify-center gap-4">
              <ShieldCheck size={16} className="text-[#d4af37]" /> CRYPTOGRAPHIC LEDGER • NEW SAMADHAN DIVISION 2026
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

