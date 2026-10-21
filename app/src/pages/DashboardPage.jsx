import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { gsap } from 'gsap';
import {
  Package, User, MapPin, Calendar, Clock, ChevronRight,
  Bell, ShieldCheck, CreditCard, Box, TrendingUp, Zap,
  Settings, LogOut, Info, CheckCircle2, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { loading, error, request } = useFetch();
  const [orders, setOrders] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // First try real backend
        const data = await request('/api/orders/myorders');
        if (data && Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error('Fallback to local');
        }
      } catch (err) {
        // Fallback to ssm_demo_orders
        try {
          const localOrders = JSON.parse(localStorage.getItem('ssm_demo_orders') || '[]');
          // If we have a logged in user, maybe filter by user ID if available,
          // but for demo we show all local orders if backend fails
          setOrders(localOrders);
        } catch (localErr) {
          console.error(localErr);
          setOrders([]);
        }
      }
    };
    fetchOrders();

    // GSAP Entrance
    const ctx = gsap.context(() => {
      gsap.from('.dash-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power4.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, [request]);

  if (!user) return null;

  const safeOrders = Array.isArray(orders) ? orders : [];
  const confirmedOrders = safeOrders.filter(o => o.isPaid || true); // Default true for display fallback if needed
  const pendingDelivery = safeOrders.filter(o => !o.isDelivered);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] pt-36 pb-24 px-4 sm:px-8 lg:px-16" ref={containerRef}>
      {/* Background Matrix Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-[0.02]"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* --- TOP HEADER: WELCOME & STATUS --- */}
        <header className="mb-16 dash-reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px bg-[#8B0000]"></div>
                <p className="text-[10px] font-sans font-bold text-[#8B0000] uppercase tracking-[0.4em]">COLLECTOR VAULT CONTROL</p>
              </div>
              <h1 className="text-5xl md:text-7xl font-editorial font-black text-[#111111] tracking-tighter leading-none uppercase">
                WELCOME, <span className="italic font-light text-[#8B0000]">{user.name}</span>
              </h1>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-[#111111]/5 shadow-sm">
              <div className="flex items-center gap-3 pl-4 pr-6">
                <div className="w-10 h-10 bg-[#111111] rounded-full flex items-center justify-center text-white shadow-md">
                  <ShieldCheck size={18} className="text-[#8B0000]" />
                </div>
                <div>
                  <p className="text-[9px] font-sans font-bold text-[#111111]/40 uppercase tracking-widest">Account Security</p>
                  <p className="text-xs font-sans font-bold text-[#111111] uppercase tracking-wider">SECURED CREDENTIALS</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-[#F7F5F0] text-[#111111]/40 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'ACQUISITIONS', value: confirmedOrders.length, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'LOGISTICS EN ROUTE', value: pendingDelivery.length, icon: Truck, color: 'text-[#8B0000]', bg: 'bg-[#8B0000]/5' },
            { label: 'VAULT VALUE', value: '₹' + safeOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0).toLocaleString(), icon: TrendingUp, color: 'text-[#111111]', bg: 'bg-white' },
            { label: 'LOYALTY RECOGNITION', value: '3,840 PTS', icon: Zap, color: 'text-amber-700', bg: 'bg-amber-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-[#111111]/5 shadow-[0_30px_60px_rgba(0,0,0,0.015)] hover:shadow-2xl transition-all duration-500 group dash-reveal">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500`}>
                <stat.icon size={22} />
              </div>
              <p className="text-[10px] font-sans font-bold text-[#111111]/40 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-sans font-bold text-[#111111] tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT: MAIN ACTIVITY (ORDERS) --- */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#111111]/5 shadow-[0_30px_60px_rgba(0,0,0,0.015)] dash-reveal">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-editorial font-bold text-[#111111] tracking-tight flex items-center gap-3">
                  <Box className="text-[#8B0000]" size={22} /> VERIFIED ACQUISITIONS
                </h2>
                <div className="px-4 py-2 bg-[#F7F5F0] rounded-full text-[9px] font-sans font-bold text-[#111111]/40 uppercase tracking-widest">
                  {safeOrders.length} TOTAL ARCHIVES
                </div>
              </div>

              {loading ? (
                <div className="py-24 flex flex-col items-center gap-3">
                   <div className="w-8 h-8 border-2 border-[#8B0000] border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-[10px] font-sans font-bold text-[#111111]/40 uppercase tracking-widest">Querying Secure Protocol...</p>
                </div>
              ) : safeOrders.length === 0 ? (
                <div className="text-center py-24 bg-[#F7F5F0] rounded-2xl border border-dashed border-[#111111]/10">
                  <Package className="w-12 h-12 text-[#111111]/20 mx-auto mb-4" />
                  <p className="text-[#111111]/40 text-xs font-medium mb-6 italic">No luxury items registered in this sequence.</p>
                  <Link to="/products" className="bg-[#111111] text-white px-10 py-4.5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-[#8B0000] transition-all">
                    Access Premium Vault
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeOrders.map((order) => (
                    <div key={order._id} className="group relative bg-[#F7F5F0] rounded-2xl overflow-hidden border border-transparent hover:border-[#8B0000]/10 hover:bg-white hover:shadow-xl transition-all duration-500">
                      <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                        {/* Order Preview Images */}
                        <div className="flex -space-x-6">
                          {order.orderItems?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-16 h-16 bg-white rounded-xl border-2 border-white overflow-hidden shadow-md relative group-hover:scale-105 transition-transform duration-500" style={{ zIndex: 3 - idx }}>
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                          ))}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                           <p className="text-[9px] font-mono text-[#8B0000] uppercase tracking-wider mb-0.5">ID: #{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                           <h4 className="text-base font-sans font-bold text-[#111111] truncate max-w-xs">
                             {order.orderItems?.length || 1} Premium Asset Ordered
                           </h4>
                           <div className="flex items-center justify-center md:justify-start gap-4 text-[#111111]/40 mt-1">
                             <div className="flex items-center gap-1">
                               <Calendar size={12} />
                               <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</span>
                             </div>
                             <div className="w-1 h-1 bg-[#111111]/10 rounded-full"></div>
                             <div className="flex items-center gap-1">
                               <CreditCard size={12} />
                               <span className="text-[10px] font-bold uppercase tracking-wider">₹{(order.totalPrice || 0).toLocaleString()}</span>
                             </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="text-right hidden sm:block">
                              <p className="text-[8px] font-sans font-bold text-[#111111]/30 uppercase tracking-widest mb-1">Transit Matrix</p>
                              <div className="w-24 h-1 bg-[#111111]/10 rounded-full overflow-hidden">
                                 <div className={`h-full bg-[#8B0000] transition-all duration-1000 ${order.isDelivered ? 'w-full' : 'w-1/2'}`}></div>
                              </div>
                           </div>
                           <Link
                            to={`/checkout`}
                            className="w-11 h-11 bg-white text-[#111111] rounded-xl flex items-center justify-center border border-[#111111]/10 hover:bg-[#111111] hover:text-white transition-all shadow-sm"
                           >
                              <ChevronRight size={18} />
                           </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT: NOTIFICATIONS & LOCATION --- */}
          <div className="lg:col-span-4 space-y-8">

            {/* NOTIFICATION CENTER */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#111111]/5 shadow-[0_30px_60px_rgba(0,0,0,0.015)] dash-reveal">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-sans font-bold text-[#111111] tracking-widest flex items-center gap-2">
                  <Bell className="text-amber-600" size={16} /> RADAR INTELLIGENCE
                </h3>
                <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-ping"></span>
              </div>
              <div className="space-y-6">
                {[
                  { title: 'New Grail Horizon', time: '1h ago', desc: 'The Limited Premium Silhouette collection releases tomorrow at 10:00 AM IST.', icon: Zap, color: 'text-[#8B0000]', bg: 'bg-[#8B0000]/5' },
                  { title: 'WhatsApp Matrix Synced', time: '4h ago', desc: 'Dual shopkeeper route initialized for ultra-premium verification.', icon: Truck, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                  { title: 'Aesthetic Upgrade Done', time: '1d ago', desc: 'The entire showroom interface has been refactored to Light Luxury #F7F5F0.', icon: TrendingUp, color: 'text-indigo-700', bg: 'bg-indigo-50' }
                ].map((note, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer p-2 rounded-xl hover:bg-[#F7F5F0] transition-colors">
                    <div className={`w-10 h-10 ${note.bg} ${note.color} rounded-lg flex-shrink-0 flex items-center justify-center`}>
                      <note.icon size={16} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="text-xs font-sans font-bold text-[#111111] uppercase tracking-tight">{note.title}</p>
                        <span className="text-[9px] font-sans font-bold text-[#111111]/30">{note.time}</span>
                      </div>
                      <p className="text-[10px] text-[#111111]/50 leading-relaxed line-clamp-2">{note.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOCATION CARD */}
            <div className="bg-[#111111] rounded-[2.5rem] p-8 text-white relative overflow-hidden dash-reveal shadow-xl">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] select-none pointer-events-none">
                <MapPin size={100} />
              </div>
              <h3 className="text-sm font-sans font-bold tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <MapPin className="text-[#8B0000]" size={16} /> ACCESS SECTOR Node
              </h3>
              <div className="relative z-10">
                <p className="text-[9px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-1">AUTHENTICATED TERMINAL</p>
                <h4 className="text-xl font-sans font-bold tracking-tight mb-6">MAHARASHTRA, INDIA</h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[9px] font-sans font-bold text-white/40 uppercase tracking-widest">Network Speed</span>
                    <span className="text-[11px] font-sans font-bold text-emerald-400">OPTIMAL LAYER</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[9px] font-sans font-bold text-white/40 uppercase tracking-widest">Encryption Sequence</span>
                    <span className="text-[11px] font-sans font-bold text-[#8B0000]">ACTIVE VAULT</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
