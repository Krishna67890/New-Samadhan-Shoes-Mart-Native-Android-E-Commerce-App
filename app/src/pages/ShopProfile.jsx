import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Star, MapPin, Phone, MessageCircle,
  Clock, ShieldCheck, Map, Heart, Share2,
  Info, Send
} from 'lucide-react';
import { resolveImageUrl } from '../utils/urlConfig';
import useFetch from '../hooks/useFetch';

const ShopProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [shop, setShop] = useState(null);
  const { loading, request } = useFetch();

  useEffect(() => {
    fetchShop();
  }, [id]);

  const fetchShop = async () => {
    try {
      const data = await request(`/api/shops/${id}`);
      setShop(data);
    } catch (error) {
      console.error('Error fetching shop details:', error);
    }
  };

  const buyNowWhatsApp = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', `/shop/${id}`);
      navigate('/login');
      return;
    }
    const userName = user ? user.name : 'Elite Guest';
    const userPhone = user?.phone || 'Not Provided';
    const userAddress = user?.address || 'Not Provided';
    const userCity = user?.city || 'Not Provided';
    const userPincode = user?.pincode || 'Not Provided';

    const message = `*NEW ELITE ORDER INQUIRY*\n\n` +
      `*Source:* New Samadhan Shoe Listing Profile\n` +
      `*Vendor:* ${shop.name}\n\n` +
      `*Client Name:* ${userName}\n` +
      `*Contact Number:* ${userPhone}\n` +
      `*Delivery Address:* ${userAddress}\n` +
      `*City:* ${userCity}\n` +
      `*Pincode:* ${userPincode}\n\n` +
      `*Product/Inquiry:* I am looking for premium footwear. Please share your UPI QR code and latest stock catalog.\n\n` +
      `_Automated by New Samadhan Shoe Mart 2026_`;

    const encodedMsg = encodeURIComponent(message);

    // Dual Shopkeeper Protocol - Use business numbers 9423228843 and 8888644021
    window.open(`https://wa.me/919423228843?text=${encodedMsg}`, '_blank');
    setTimeout(() => {
      window.open(`https://wa.me/918888644021?text=${encodedMsg}`, '_blank');
    }, 600);
  };

  if (loading) return (
    <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center">
       <div className="w-10 h-10 border-2 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!shop) return (
    <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center">
       <h1 className="text-xl font-sans font-bold text-[#111111]/30 uppercase tracking-[0.3em] italic">Node Not Detected</h1>
    </div>
  );

  return (
    <div className="bg-[#F7F5F0] text-[#111111] min-h-screen pt-36 pb-24 px-4 sm:px-10 lg:px-20 relative overflow-x-hidden no-blur-zone">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-[0.02]"></div>

      {/* --- HERO GALLERY SECTION --- */}
      <div className="h-[55vh] relative overflow-hidden group rounded-[2.5rem] border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] bg-white">
         <img
            src={resolveImageUrl(shop.images[0]) || '/Shoes.png'}
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103 opacity-95"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

         <div className="absolute bottom-12 left-0 w-full z-10">
            <div className="px-8 sm:px-12">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                     <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-1.5 bg-[#8B0000] text-white text-[9px] font-sans font-bold rounded-full uppercase tracking-widest shadow-md">Verified Partner</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white text-[9px] font-sans font-bold uppercase tracking-widest border border-white/20">
                           <Star size={12} className="fill-white text-white" /> {shop.rating || '4.8'} Elite Score
                        </div>
                     </div>
                     <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-black text-white tracking-tighter uppercase leading-[0.9]">
                        {shop.name}
                     </h1>
                     <div className="flex flex-wrap items-center gap-6 text-white/80 font-sans font-bold text-[10px] uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-white" /> {shop.city} Sector</span>
                        <span className="flex items-center gap-2"><Clock size={14} className="text-white" /> 09:00 - 22:00</span>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-[#8B0000] hover:border-transparent transition-all border border-white/20 shadow-md">
                        <Heart size={20} />
                     </button>
                     <button className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-[#8B0000] hover:border-transparent transition-all border border-white/20 shadow-md">
                        <Share2 size={20} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-6xl mx-auto mt-16 relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* --- LEFT: DETAILS --- */}
            <div className="lg:col-span-8 space-y-10">

               {/* Quick Info Bar */}
               <div className="bg-white rounded-[2.5rem] p-8 border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1 text-center border-r border-[#111111]/5">
                     <p className="text-[8px] font-sans font-bold text-[#111111]/40 uppercase tracking-[0.2em]">Experience</p>
                     <p className="text-xs font-sans font-bold text-[#111111] uppercase tracking-wider">12+ Years</p>
                  </div>
                  <div className="space-y-1 text-center border-r border-[#111111]/5">
                     <p className="text-[8px] font-sans font-bold text-[#111111]/40 uppercase tracking-[0.2em]">Clearance</p>
                     <p className="text-xs font-sans font-bold text-[#111111] uppercase tracking-wider">Priority</p>
                  </div>
                  <div className="space-y-1 text-center border-r border-[#111111]/5">
                     <p className="text-[8px] font-sans font-bold text-[#111111]/40 uppercase tracking-[0.2em]">Channels</p>
                     <p className="text-xs font-sans font-bold text-[#111111] uppercase tracking-wider">UPI / CASH</p>
                  </div>
                  <div className="space-y-1 text-center">
                     <p className="text-[8px] font-sans font-bold text-[#111111]/40 uppercase tracking-[0.2em]">Authenticity</p>
                     <p className="text-xs font-sans font-bold text-emerald-700 uppercase tracking-wider">Verified</p>
                  </div>
               </div>

               {/* Description */}
               <div className="bg-white rounded-[2.5rem] p-10 border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#8B0000]/5 flex items-center justify-center text-[#8B0000] border border-[#8B0000]/10">
                        <Info size={20} />
                     </div>
                     <h3 className="text-lg font-sans font-bold text-[#111111] uppercase tracking-[0.2em]">Dealer Intel</h3>
                  </div>
                  <p className="text-[#111111]/60 leading-relaxed font-medium text-base italic border-l-2 border-[#8B0000] pl-6">
                     "{shop.description || "The premier destination for high-end artisanal footwear and the latest sneaker drops. Specializing in luxury leather collections and performance sports shoes. We provide a curated shopping experience with expert sizing consultations."}"
                  </p>
               </div>

               {/* Location / Map Placeholder */}
               <div className="bg-white rounded-[2.5rem] p-10 border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] space-y-6 overflow-hidden">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#8B0000]/5 flex items-center justify-center text-[#8B0000] border border-[#8B0000]/10">
                        <Map size={20} />
                     </div>
                     <h3 className="text-lg font-sans font-bold text-[#111111] uppercase tracking-[0.2em]">Node Matrix</h3>
                  </div>
                  <div className="h-64 bg-[#F7F5F0] rounded-2xl flex flex-col items-center justify-center space-y-4 border border-[#111111]/5 relative group cursor-crosshair">
                     <MapPin size={36} className="text-[#111111]/30 group-hover:text-[#8B0000] transition-colors duration-500" />
                     <p className="text-[10px] font-sans font-bold text-[#111111]/50 uppercase tracking-[0.2em] px-6 text-center">{shop.address}</p>
                     <button className="bg-[#111111] text-white px-8 py-3 rounded-xl text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-[#8B0000] transition-all shadow-md z-10">Sync Coordinates</button>
                  </div>
               </div>

            </div>

            {/* --- RIGHT: SIDEBAR ACTIONS --- */}
            <div className="lg:col-span-4 space-y-10">

               {/* Contact Card */}
               <div className="bg-white rounded-[2.5rem] p-10 text-[#111111] border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] sticky top-36 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8B0000]"></div>

                  <p className="text-[9px] font-sans font-bold text-[#8B0000] uppercase tracking-[0.3em] mb-4">Secure Channel</p>
                  <h3 className="text-3xl font-editorial font-bold tracking-tight uppercase mb-8 leading-none">Connect <br/> with Agent</h3>

                  <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-4 p-4 bg-[#F7F5F0] rounded-xl border border-[#111111]/5 hover:border-[#111111]/20 transition-all cursor-pointer group" onClick={() => window.location.href = `tel:${shop.phone}`}>
                        <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center transition-transform group-hover:scale-105">
                           <Phone size={18} />
                        </div>
                        <div>
                           <p className="text-[8px] font-sans font-bold text-[#111111]/40 uppercase tracking-widest mb-0.5">Vocal Uplink</p>
                           <p className="text-xs font-sans font-bold text-[#111111]">+91 {shop.phone}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-4 bg-[#8B0000]/5 rounded-xl border border-[#8B0000]/10 hover:border-[#8B0000]/30 transition-all cursor-pointer group" onClick={buyNowWhatsApp}>
                        <div className="w-12 h-12 rounded-xl bg-[#8B0000] text-white flex items-center justify-center transition-transform group-hover:scale-105">
                           <MessageCircle size={18} />
                        </div>
                        <div>
                           <p className="text-[8px] font-sans font-bold text-[#8B0000] uppercase tracking-widest mb-0.5">WhatsApp Elite</p>
                           <p className="text-xs font-sans font-bold text-[#111111]">Encrypted Data</p>
                        </div>
                     </div>
                  </div>

                  <button
                     onClick={buyNowWhatsApp}
                     className="w-full bg-[#111111] text-white py-5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#8B0000] transition-all shadow-md group"
                  >
                     <Send size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                     Transmit Inquiry
                  </button>

                  <div className="mt-6 flex items-center gap-3 p-4 bg-[#F7F5F0] rounded-xl border border-[#111111]/5">
                      <ShieldCheck className="text-[#8B0000]" size={20} />
                      <p className="text-[9px] text-[#111111]/50 font-sans font-bold uppercase tracking-wider leading-relaxed">
                        Manual UPI verification required for elite clearance.
                      </p>
                  </div>
               </div>

            </div>

         </div>
      </div>
    </div>
  );
};

export default ShopProfile;
