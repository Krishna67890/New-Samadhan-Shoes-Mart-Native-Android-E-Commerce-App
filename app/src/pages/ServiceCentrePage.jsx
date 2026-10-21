import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Wrench, MapPin, Phone, Clock, ShieldCheck,
  HelpCircle, ArrowRight,
  ShieldAlert, Filter, Loader2,
  X, MessageCircle, Send, Search
} from 'lucide-react';
import ServiceCenterCard from '../components/ServiceCenterCard';
import useFetch from '../hooks/useFetch';
import localServiceCenters from '../utils/localServiceCenters';
import { resolveImageUrl } from '../utils/urlConfig';

const ServiceCentrePage = () => {
  const [centers, setCenters] = useState([]);
  const { loading, request } = useFetch();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);

  const containerRef = useRef(null);

  const fetchCenters = async () => {
    try {
      const data = await request(`/api/service-centers?search=${searchTerm}&city=${cityFilter}`);
      if (data && Array.isArray(data) && data.length > 0) {
        setCenters(data);
      } else {
        console.log("Using local fallback centers");
        setCenters(localServiceCenters.filter(c =>
          (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.city.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (cityFilter === '' || c.city === cityFilter)
        ));
      }
    } catch (err) {
      console.error("Service Centers Fetch Error, using local data:", err);
      setCenters(localServiceCenters.filter(c =>
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         c.city.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (cityFilter === '' || c.city === cityFilter)
      ));
    }
  };

  useEffect(() => {
    fetchCenters();
  }, [searchTerm, cityFilter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.svc-reveal', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power4.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const handleBookProtocol = (center) => {
    setSelectedCenter(center);
  };

  const services = [
    {
      title: 'Diamond Restoration',
      description: 'The ultimate rejuvenation for your premium leather and suede grails. Molecular-level deep cleaning.',
      icon: <ShieldCheck className="w-8 h-8 text-[#d4af37]" />,
      color: 'bg-[#d4af37]/10'
    },
    {
      title: 'Sole Reconstruction',
      description: 'Precision replacement of worn-out soles with high-durability performance rubber polymers.',
      icon: <Wrench className="w-8 h-8 text-[#111111]" />,
      color: 'bg-[#111111]/5'
    },
    {
      title: 'Fit Optimization',
      description: 'Ergonomic sizing adjustments for the perfect anatomical fit. We modify, you conquer.',
      icon: <HelpCircle className="w-8 h-8 text-[#111111]" />,
      color: 'bg-[#111111]/5'
    },
  ];

  return (
    <div className="bg-[#F7F5F0] text-[#111111] min-h-screen pt-36 pb-24 px-4 sm:px-10 lg:px-20 relative overflow-x-hidden" ref={containerRef}>
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-[0.02]"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* --- CINEMATIC HERO --- */}
        <section className="relative mb-20 svc-reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-[#111111]/10 pb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#d4af37]"></div>
                <p className="text-[10px] font-sans font-bold text-[#d4af37] uppercase tracking-[0.4em]">Maintenance Node 2026</p>
                <div className="ml-4 px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-full flex items-center gap-2 border border-[#d4af37]/20">
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-sans font-bold uppercase tracking-widest">Active</span>
                </div>
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-editorial font-black text-[#111111] tracking-tighter leading-[0.85] uppercase">
                ELITE <br />
                <span className="italic font-light text-[#d4af37]">RESTORATION.</span>
              </h1>
            </div>

            {/* Visiting Card Display */}
            <div className="relative group max-w-sm w-full">
               <div className="absolute -inset-2 bg-gradient-to-r from-[#d4af37] to-[#111111] rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-1000"></div>
               <img
                 src={resolveImageUrl("/New-Samadhan-Shoe-Mart/New-Card.jpg")}
                 alt="New Samadhan Shoes Mart Visiting Card"
                 className="relative rounded-[1.5rem] border border-white/20 shadow-2xl w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
               />
               <div className="absolute top-4 right-4 bg-[#111111] text-[#d4af37] p-2 rounded-full shadow-lg border border-[#d4af37]/30">
                  <ShieldCheck size={16} />
               </div>
            </div>
          </div>
        </section>

        {/* --- PREMIUM SERVICES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <div key={index} className="group bg-white p-10 rounded-[2.5rem] border border-[#111111]/5 hover:border-[#d4af37]/20 transition-all duration-700 svc-reveal shadow-[0_40px_80px_rgba(0,0,0,0.02)]">
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-[#111111]/5`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-editorial font-bold text-[#111111] mb-5 tracking-tight uppercase leading-none">{service.title}</h3>
              <p className="text-[#111111]/50 font-medium leading-relaxed italic mb-8 text-sm">"{service.description}"</p>
              <div className="flex items-center gap-2 text-[9px] font-sans font-bold text-[#d4af37] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                 Start Protocol <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* --- SEARCH & FILTER SECTION --- */}
        <div className="mb-12 svc-reveal">
           <div className="bg-white p-4 rounded-3xl border border-[#111111]/5 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#111111]/30 group-focus-within:text-[#d4af37] transition-colors" size={18} />
                 <input
                    type="text"
                    placeholder="Search maintenance node..."
                    className="w-full pl-16 pr-6 py-4 bg-[#F7F5F0] rounded-2xl font-sans font-bold text-[#111111] outline-none focus:bg-white border border-transparent focus:border-[#d4af37]/30 transition-all text-[11px] uppercase tracking-wider placeholder:text-[#111111]/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="relative group">
                 <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-[#111111]/30" size={16} />
                 <select
                    className="pl-14 pr-10 py-4 bg-[#F7F5F0] rounded-2xl font-sans font-bold text-[#111111] outline-none appearance-none focus:bg-white border border-transparent focus:border-[#111111]/10 transition-all min-w-[200px] text-[11px] uppercase tracking-wider cursor-pointer"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                 >
                    <option value="">Global Regions</option>
                    <option value="Pune">Pune Node</option>
                    <option value="Mumbai">Mumbai Node</option>
                    <option value="Nashik">Nashik Node</option>
                 </select>
              </div>
           </div>
        </div>

        {/* --- SERVICE CENTERS LIST --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 svc-reveal">
             <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-[#111111]/30 font-sans font-bold tracking-[0.4em] uppercase text-[9px]">Accessing Secure Protocols...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 svc-reveal">
             {centers.map(center => (
                <ServiceCenterCard key={center._id} center={center} onBook={handleBookProtocol} />
             ))}
          </div>
        )}

        {/* --- BOOKING MODAL OVERLAY --- */}
        {selectedCenter && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-[#111111]/90 transition-opacity" onClick={() => setSelectedCenter(null)}></div>
              <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl border border-[#111111]/5 animate-in slide-in-from-bottom-10 duration-700">
                 <button
                    onClick={() => setSelectedCenter(null)}
                    className="absolute top-8 right-8 w-10 h-10 bg-[#F7F5F0] rounded-full flex items-center justify-center text-[#111111]/40 hover:text-[#8B0000] transition-all border border-[#111111]/5"
                 >
                    <X size={20} />
                 </button>

                 <div className="p-10 sm:p-14">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-8 h-1 bg-[#d4af37] rounded-full"></div>
                       <p className="text-[9px] font-sans font-bold text-[#d4af37] uppercase tracking-[0.2em] italic">Direct Intervention Protocol</p>
                    </div>
                    <h2 className="text-4xl font-editorial font-bold text-[#111111] tracking-tight uppercase mb-6 leading-none">{selectedCenter.name}</h2>
                    <p className="text-[#111111]/50 font-medium mb-10 italic text-base leading-relaxed">"Your grail restoration starts here. Choose your secure communication channel for node access."</p>

                    <div className="space-y-6">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                          <div className="bg-[#F7F5F0] p-6 rounded-2xl border border-[#111111]/5">
                             <p className="text-[8px] font-sans font-bold text-[#111111]/40 uppercase tracking-widest mb-3">Location Matrix</p>
                             <div className="flex gap-3">
                                <MapPin size={20} className="text-[#d4af37] shrink-0" />
                                <p className="text-sm font-sans font-bold text-[#111111] leading-tight uppercase tracking-tight">{selectedCenter.address}, {selectedCenter.city}</p>
                             </div>
                          </div>
                          <div className="bg-[#d4af37]/10 p-6 rounded-2xl border border-[#d4af37]/20 flex flex-col justify-center">
                             <p className="text-[8px] font-sans font-bold text-[#d4af37] uppercase tracking-widest mb-3">Operational Status</p>
                             <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-pulse"></div>
                                <p className="text-sm font-sans font-bold text-[#d4af37] leading-tight uppercase tracking-tight">ACTIVE NODE</p>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <button
                             onClick={() => {
                                // Rotate between primary business numbers
                                const num = Math.random() > 0.5 ? '9423228843' : '8888644021';
                                window.location.href = `tel:+91${num}`;
                             }}
                             className="bg-[#111111] text-white py-5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#d4af37] hover:text-[#111111] transition-all shadow-md border border-white/10"
                          >
                             <Phone size={18} /> Call Node
                          </button>
                          <button
                             onClick={() => {
                                const message = `*ELITE RESTORATION REQUEST*\n\nNode: ${selectedCenter.name}\nProtocol: Diamond Restoration\n\nI need a professional service for my footwear. Please confirm the security clearance for a visit.`;
                                const encodedMsg = encodeURIComponent(message);
                                // Dual number protocol - ensures both store owners see it
                                window.open(`https://wa.me/919423228843?text=${encodedMsg}`, '_blank');
                                setTimeout(() => {
                                   window.open(`https://wa.me/918888644021?text=${encodedMsg}`, '_blank');
                                }, 600);
                             }}
                             className="bg-[#d4af37] text-[#111111] py-5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#111111] hover:text-[#d4af37] transition-all shadow-md border border-[#d4af37]/30"
                          >
                             <MessageCircle size={18} /> WhatsApp
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- TRUST BAR --- */}
        <div className="mt-32 pt-12 border-t border-[#111111]/5 flex flex-wrap justify-between items-center gap-8 svc-reveal opacity-30 hover:opacity-100 transition-all duration-1000">
           <div className="flex items-center gap-3 font-sans font-bold uppercase tracking-[0.2em] text-[9px] text-[#111111]/40">
              <ShieldAlert size={20} className="text-[#d4af37]" /> Global Craftsmanship Standards Applied
           </div>
           <div className="flex gap-8 font-sans font-bold uppercase tracking-widest text-[8px] text-[#111111]/30">
              <span>Vision 2026 Authorized</span>
              <span>Elite Maintenance Node</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceCentrePage;
