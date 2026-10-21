import React, { useState, useEffect, useRef } from 'react';
import ShopCard from '../components/Shop/ShopCard';
import { Search, MapPin, SlidersHorizontal, ArrowRight, LayoutGrid, List, Compass, Sparkles } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { gsap } from 'gsap';

const ShopListing = () => {
  const [shops, setShops] = useState([]);
  const { loading, request } = useFetch();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    fetchShops();
  }, [search, city]);

  const fetchShops = async () => {
    try {
      const data = await request(`/api/shops?search=${search}&city=${city}`);
      setShops(data || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  useEffect(() => {
    gsap.fromTo('.shop-reveal',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power4.out' }
    );
  }, [shops, loading]);

  return (
    <div ref={containerRef} className="bg-[#F7F5F0] text-[#111111] min-h-screen pt-36 pb-24 relative overflow-hidden no-blur-zone">
      {/* Background Micro Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-[0.02]"></div>

      {/* --- ELITE SEARCH HEADER --- */}
      <div className="container mx-auto px-6 max-w-7xl relative z-10 mb-24 shop-reveal">
         <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-[#111111]/5 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">

             {/* Search Input */}
             <div className="flex-1 w-full flex items-center gap-4 px-6 py-4 bg-[#F7F5F0] rounded-xl border border-transparent focus-within:border-[#111111]/20 transition-all group">
                <Search size={18} className="text-[#8B0000]" />
                <input
                  type="text"
                  placeholder="SEARCH EXCLUSIVE DEALERS..."
                  className="bg-transparent border-none outline-none w-full text-[11px] font-sans font-bold uppercase tracking-widest text-[#111111] placeholder:text-[#111111]/30"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>

             {/* Location Input */}
             <div className="flex-1 w-full flex items-center gap-4 px-6 py-4 bg-[#F7F5F0] rounded-xl border border-transparent focus-within:border-[#111111]/20 transition-all group">
                <MapPin size={18} className="text-[#111111]/60" />
                <input
                  type="text"
                  placeholder="CITY REGION NODE..."
                  className="bg-transparent border-none outline-none w-full text-[11px] font-sans font-bold uppercase tracking-widest text-[#111111] placeholder:text-[#111111]/30"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
             </div>

             {/* Action Button */}
             <button className="w-full md:w-auto bg-[#111111] text-white px-10 py-4.5 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#8B0000] transition-all shadow-md">
                SCAN VERIFIED MARTS <ArrowRight size={14} />
             </button>
         </div>
      </div>

      {/* --- DIRECTORY CONTENT --- */}
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 shop-reveal">
           <div>
              <div className="flex items-center gap-2 mb-3">
                 <Compass size={14} className="text-[#8B0000] animate-spin-[duration:10s]" />
                 <p className="text-[10px] font-sans font-bold text-[#8B0000] uppercase tracking-[0.4em]">DISTRIBUTION NETWORKS</p>
              </div>
              <h1 className="text-5xl md:text-7xl font-editorial font-black text-[#111111] tracking-tighter uppercase leading-none">
                {city ? `NODES IN ${city.toUpperCase()}` : 'THE VERIFIED NETWORKS'}
              </h1>
           </div>

           <div className="flex gap-3 w-full md:w-auto justify-end">
              <button className="p-3.5 bg-white border border-[#111111]/10 rounded-xl text-[#111111]/50 hover:text-[#111111] transition-all">
                 <SlidersHorizontal size={16} />
              </button>
              <div className="flex items-center bg-white border border-[#111111]/10 p-1 rounded-xl">
                 <button className="p-2.5 bg-[#111111] text-white rounded-lg shadow-sm"><LayoutGrid size={16} /></button>
                 <button className="p-2.5 text-[#111111]/30 hover:text-[#111111]"><List size={16} /></button>
              </div>
           </div>
        </div>

        {/* --- LISTING GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-white rounded-[2rem] animate-pulse border border-[#111111]/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 shop-reveal">
            {shops.length > 0 ? (
              shops.map((shop) => (
                <div key={shop._id} className="bg-white rounded-[2rem] p-8 border border-[#111111]/5 shadow-[0_30px_60px_rgba(0,0,0,0.015)] transition-all hover:border-[#8B0000]/20 duration-500">
                  <ShopCard shop={shop} />
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-white rounded-[2.5rem] border border-[#111111]/5 shadow-inner flex flex-col items-center justify-center">
                 <Sparkles size={36} className="text-[#8B0000] opacity-40 mb-4" />
                 <h3 className="text-xl font-editorial font-bold text-[#111111] uppercase tracking-wide">No Regional Nodes Found</h3>
                 <p className="text-[#111111]/40 text-[10px] font-sans font-bold uppercase tracking-widest mt-2">Try searching for main authorized flagship hubs</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopListing;
