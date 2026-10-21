import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, X, ChevronRight, Eye, ShieldCheck,
  Award, ArrowRight, Layers, ZoomIn, Check, MessageSquare,
  Image as ImageIcon, Filter, Grid, Layout
} from 'lucide-react';
import { resolveImageUrl } from '../utils/urlConfig';
import { useTheme } from '../context/ThemeContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  {
    id: 'g1',
    title: 'Imperial Wingtip Derby',
    category: 'Studio Showcase',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0006.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0006.jpg'),
    leather: 'Tuscan Full-Grain Calfskin',
    construction: '360° Goodyear Welted',
    sole: 'Oak-Bark Tanned Leather Sole',
    hours: '42 Handcraft Hours',
    price: '₹5,499',
    description: 'Precision brogued with intricate medallion toe perforations. Hand-dyed in Nashik with natural walnut stain and carnauba wax polish.',
  },
  {
    id: 'g2',
    title: 'Monarch Cap-Toe Oxford',
    category: 'Studio Showcase',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0010.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0010.jpg'),
    leather: 'French Boxcalf Navy Patina',
    construction: 'Hand-Welted Closed Channel',
    sole: 'Beveled Waist Leather Sole',
    hours: '38 Handcraft Hours',
    price: '₹5,999',
    description: 'Classic formal elegance. Closed lacing system with 6 brass eyelets, cushioned orthopedic footbed, and mirror gloss toe burnish.',
  },
  {
    id: 'g3',
    title: 'Sahyadri Expedition Boot',
    category: 'Goodyear Boots',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0225.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0225.jpg'),
    leather: 'Oiled Pull-Up Bison Leather',
    construction: 'Storm Welted Waterproof',
    sole: 'Vibram Commando Lug Sole',
    hours: '48 Handcraft Hours',
    price: '₹6,499',
    description: 'Engineered for rugged terrain while preserving refined boardroom lines. Triple-stitched stress zones with gusseted leather tongue.',
  },
  {
    id: 'g4',
    title: 'Venetian Tassel Loafer',
    category: 'Italian Loafers',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0040.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0040.jpg'),
    leather: 'Chocolate Suede & Calf Trim',
    construction: 'Blake-Rapid Flexible Stitch',
    sole: 'Half-Rubber Inset Leather',
    hours: '28 Handcraft Hours',
    price: '₹4,499',
    description: 'Unlined forefoot for effortless summer breathability. Hand-knotted leather tassels and reinforced heel counters.',
  },
  {
    id: 'g5',
    title: 'Aero Minimalist Sneaker',
    category: 'Minimalist Sneakers',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0050.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0050.jpg'),
    leather: 'Nappa White Glove Leather',
    construction: 'Margom Side-Stitched Cupsole',
    sole: 'Vulcanized Natural Rubber',
    hours: '24 Handcraft Hours',
    price: '₹3,899',
    description: 'Stripped of all logos. 100% full leather lining with zero synthetic foam. Removable memory arch support insole.',
  },
  {
    id: 'g6',
    title: 'Chelsea Noir Classic',
    category: 'Goodyear Boots',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0030.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0030.jpg'),
    leather: 'Aniline Black Calfskin',
    construction: 'Goodyear Welt with Cork Bed',
    sole: 'Dainite Studded Rubber',
    hours: '36 Handcraft Hours',
    price: '₹5,899',
    description: 'Clean single-piece vamp cut without side seams. Heavy-duty Italian woven side elastics and pull loops for a sleek silhouette.',
  },
  {
    id: 'g7',
    title: 'The Master Lasting Process',
    category: 'Workshop Action',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0100.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0100.jpg'),
    leather: 'Hardwood Hornbeam Lasts',
    construction: 'Hand Pliers & Brass Tack Tension',
    sole: 'Anatomical Sculpting',
    hours: 'Active Atelier Stage',
    price: 'Bespoke Order',
    description: 'Artisan pulling the wet leather upper over the wooden last with lasting pliers, securing tension millimeter by millimeter.',
  },
  {
    id: 'g8',
    title: 'Goodyear Welt Channel Stitching',
    category: 'Workshop Action',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0110.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0110.jpg'),
    leather: 'Natural Portuguese Cork Fill',
    construction: 'Chain-Stitch Welt Binding',
    sole: 'Goodyear Machine Calibration',
    hours: 'Active Atelier Stage',
    price: 'Bespoke Order',
    description: 'Lockstitching the welt strip into the curved rib of the insole before packing the bottom cavity with natural thermal cork.',
  },
  {
    id: 'g9',
    title: 'Cognac Penny Loafer',
    category: 'Italian Loafers',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0045.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0045.jpg'),
    leather: 'French Cognac Box Calf',
    construction: 'Hand-Sewn Moccasin Apron',
    sole: 'Flex Leather Sole with Rubber Inset',
    hours: '30 Handcraft Hours',
    price: '₹4,799',
    description: 'Features traditional hand-pinched apron stitching. Subtle burnishing along the strap slot and penny saddle.',
  },
  {
    id: 'g10',
    title: 'Milan Velvet Stiletto Heel',
    category: "Women's Edition",
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0200.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0200.jpg'),
    leather: 'Italian Suede & Rose Gold Accents',
    construction: 'Ergonomic Cushion Stiletto Arch',
    sole: 'Non-Slip Micro-Ribbed Heel Sole',
    hours: '32 Handcraft Hours',
    price: '₹6,499',
    description: 'Elegantly proportioned women’s stiletto with dual-density memory arch support designed for pain-free galas.',
  },
  {
    id: 'g11',
    title: 'Parisian Quilted Ballet Flat',
    category: "Women's Edition",
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0210.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0210.jpg'),
    leather: 'Full-Grain Tuscan Lambskin',
    construction: 'Hand-Pleated Glove Fit Sacchetto',
    sole: 'Supple Split Vegetable Leather Sole',
    hours: '26 Handcraft Hours',
    price: '₹3,999',
    description: 'Featherweight glove construction that rolls effortlessly with your foot. Finished with a discreet grosgrain bow.',
  },
  {
    id: 'g12',
    title: 'Verona Artisan Chelsea Boot',
    category: "Women's Edition",
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0220.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0220.jpg'),
    leather: 'Burnished Tuscan Tan Calfskin',
    construction: 'Storm Welted Waterproof Last',
    sole: 'Dainite Anti-Slip Low Profile Rubber',
    hours: '40 Handcraft Hours',
    price: '₹6,899',
    description: 'Women’s equestrian-inspired silhouette with contoured heel grip and breathable organic calf lining.',
  },
  {
    id: 'g13',
    title: 'Nashik Academy School Derby',
    category: 'Kids Edition',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0300.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0300.jpg'),
    leather: 'Indestructible Full-Grain Leather',
    construction: 'Heavy-Duty Reinforced Lockstitch',
    sole: 'Shock-Absorbing Natural Rubber',
    hours: '20 Handcraft Hours',
    price: '₹2,199',
    description: 'Engineered to withstand rigorous school playgrounds with double-stitched eyelet stays and scuff guards.',
  },
  {
    id: 'g14',
    title: 'Junior Courier Retro Runner',
    category: 'Kids Edition',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0310.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0310.jpg'),
    leather: 'Breathable Leather & Suede Mesh',
    construction: 'Flexible Strobel Contoured Construction',
    sole: 'Non-Marking Natural Gum Rubber',
    hours: '18 Handcraft Hours',
    price: '₹2,499',
    description: 'Contoured natural toe-box allowing growing children toes to spread naturally with zero pinched nerves.',
  },
  {
    id: 'g15',
    title: 'Little Artisan Heritage Oxford',
    category: 'Kids Edition',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0320.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/IMG-20260928-WA0320.jpg'),
    leather: 'Chestnut Smooth Calfskin',
    construction: 'Goodyear Welt Junior Contoured Last',
    sole: 'Soft Leather with Rubber Traction Cap',
    hours: '24 Handcraft Hours',
    price: '₹2,899',
    description: 'A miniature generational heirloom for celebrations and ceremonies, made with genuine cobbler welt technique.',
  },
  {
    id: 'g16',
    title: 'Heritage of Service: Police Honor',
    category: 'Heritage Collection',
    image: resolveImageUrl('/New-Samadhan-Shoe-Mart/Police Family 1.jpg'),
    thumbnail: resolveImageUrl('/New-Samadhan-Shoe-Mart/Police Family 1.jpg'),
    leather: 'Military-Grade Box Calf',
    construction: 'Double-Welted Duty Build',
    sole: 'Anti-Skid Tactical Rubber',
    hours: 'Generational Archive',
    price: 'Honorary',
    description: 'A tribute to our 34-year relationship with Nashik\'s police and defense forces. Handcrafting reliability for those who serve.',
  },
];


const CATEGORIES = [
  'All',
  'Heritage Collection',
  'Awards & Recognition',
  'Studio Showcase',
  "Women's Edition",
  'Kids Edition',
  'Bespoke Derbies',
  'Goodyear Boots',
  'Italian Loafers',
  'Minimalist Sneakers',
  'Workshop Action',
];

const PATINA_STAGES = [
  {
    stage: 'Day 1: Unboxing',
    desc: 'Crisp factory luster, rich uniform pigment, firm structural hold ready to mold to your walking anatomy.',
    characteristics: 'High mirror shine, pristine surface, structured arch',
  },
  {
    stage: 'Year 1: The Mold',
    desc: 'Micro-flex creasing develops harmoniously along foot break lines. Cork footbed conforms 100% to foot shape.',
    characteristics: 'Individual character creases, deeper honey/amber tones, custom arch comfort',
  },
  {
    stage: 'Year 5+: True Vintage Patina',
    desc: 'Full-grain leather absorbs organic oils and conditioning waxes, developing an irreplaceable heirloom luster.',
    characteristics: 'Irreplaceable tonal depth, ultra-supple fit, resoled 1-2 times with full integrity',
  },
];

const GalleryPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleItems, setVisibleItems] = useState(12);

  // Dynamically generate more items from the asset list for the "massive" feel
  const EXTENDED_GALLERY = React.useMemo(() => {
    return [
      ...GALLERY_ITEMS,
      // Add Family Heritage items
      ...[1, 2, 3, 4].map(n => ({
        id: `family-${n}`,
        title: `Family Heritage Archive #${n}`,
        category: 'Heritage Collection',
        image: resolveImageUrl(`/New-Samadhan-Shoe-Mart/Family ${n}.jpg`),
        thumbnail: resolveImageUrl(`/New-Samadhan-Shoe-Mart/Family ${n}.jpg`),
        leather: 'Generational Craft',
        construction: 'Traditional Hand-Stitch',
        sole: 'Classic Comfort',
        hours: 'Heritage Piece',
        price: 'Archive',
        description: 'A tribute to the generational legacy of New Samadhan Shoes, captured in our family archives.',
      })),
      // Add Satkar Excellence items
      ...[1, 2, 3, 4, 5, 6].map(n => ({
        id: `satkar-${n}`,
        title: `Satkar Excellence #${n}`,
        category: 'Awards & Recognition',
        image: resolveImageUrl(`/New-Samadhan-Shoe-Mart/Satkar${n >= 5 ? '-' : ' '}${n}.jpg`),
        thumbnail: resolveImageUrl(`/New-Samadhan-Shoe-Mart/Satkar${n >= 5 ? '-' : ' '}${n}.jpg`),
        leather: 'Premium Achievement',
        construction: 'Elite Standards',
        sole: 'Foundation of Trust',
        hours: 'Honored Craft',
        price: 'Excellence',
        description: 'Moments of recognition for our commitment to footwear excellence in Nashik.',
      })),
      // Add more items using the WA sequence to fill the "massive" gallery
      // Starting from WA0006 as per user file sequence
      ...Array.from({ length: 353 - 5 }, (_, i) => i + 6)
        .filter(n => ![6, 10, 225, 40, 50, 30, 100, 110, 45, 200, 210, 220, 300, 310, 320].includes(n))
        .map(n => {
          const pad = n.toString().padStart(4, '0');
          const categories = ['Studio Showcase', 'Workshop Action', 'Bespoke Derbies', 'Goodyear Boots', 'Italian Loafers'];
          return {
            id: `wa-${n}`,
            title: `Artisan Discovery #${n}`,
            category: categories[n % categories.length],
            image: resolveImageUrl(`/New-Samadhan-Shoe-Mart/IMG-20260928-WA${pad}.jpg`),
            thumbnail: resolveImageUrl(`/New-Samadhan-Shoe-Mart/IMG-20260928-WA${pad}.jpg`),
            leather: 'Premium Selected Hide',
            construction: 'Handcrafted Assembly',
            sole: 'Samadhan Signature',
            hours: 'Handcraft Detail',
            price: 'Custom',
            description: 'A high-fidelity capture of our artisan process, showcasing the detailed textures and structural integrity of Samadhan footwear.',
          };
        })
    ];
  }, []);

  const filteredItems = React.useMemo(() => {
    return activeCategory === 'All'
      ? EXTENDED_GALLERY
      : EXTENDED_GALLERY.filter((item) => item.category === activeCategory);
  }, [activeCategory, EXTENDED_GALLERY]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Only animate the new items that were just added to the DOM
      const items = gsap.utils.toArray(".gallery-item").slice(visibleItems - 12);
      if (items.length > 0) {
        gsap.from(items, {
          y: 30,
          opacity: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    });
    return () => ctx.revert();
  }, [visibleItems, activeCategory]);

  // Optimized Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleItems < filteredItems.length) {
          // Add a small delay for smoother UX
          setTimeout(() => {
            setVisibleItems(prev => Math.min(prev + 12, filteredItems.length));
          }, 100);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const loader = document.querySelector('#gallery-loader');
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [filteredItems.length, visibleItems]);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen pt-32 pb-20 font-sans selection:bg-[var(--accent)] selection:text-white no-blur-zone transition-colors duration-500">

      {/* Hero Section */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto py-20 md:py-28 relative overflow-hidden">
        {/* Background Accent Text */}
        <div className="absolute top-0 right-[-5%] text-[20vw] font-editorial font-black text-[var(--text-primary)] opacity-[0.03] select-none pointer-events-none whitespace-nowrap">
          ATELIER
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[var(--accent)]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)]">
                  Archive Vol. 01 / Nashik Showcase
                </span>
              </div>

              <h1 className="font-editorial font-black uppercase tracking-tighter leading-[0.85] text-5xl sm:text-7xl lg:text-9xl">
                Visual <br />
                <span className="italic font-light text-[var(--accent)]">Atelier</span> <br />
                <span>Archive.</span>
              </h1>
            </div>

            <div className="flex flex-col gap-8">
              <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-medium max-w-xl">
                A curated photographic record of bespoke footwear commissions, artisan processes, and heritage milestones captured within our Nashik workshop. Each image represents a chapter of our 34-year dedication to the craft.
              </p>
              <div className="flex flex-col gap-2 border-l border-[var(--text-primary)]/10 pl-6 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]">Archive Stats</span>
                <div className="flex gap-6">
                  <div>
                    <div className="text-2xl font-editorial font-bold text-[var(--accent)]">350+</div>
                    <div className="text-[9px] font-bold uppercase tracking-tighter text-[var(--text-secondary)]">Captures</div>
                  </div>
                  <div>
                    <div className="text-2xl font-editorial font-bold text-[var(--accent)]">1990</div>
                    <div className="text-[9px] font-bold uppercase tracking-tighter text-[var(--text-secondary)]">Origin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
             <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse"></div>
             <img
               src={resolveImageUrl('/New-Samadhan-Shoe-Mart/Main-Shoe.png')}
               alt="Masterpiece Shoe"
               className="w-full h-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-700 pointer-events-none"
             />
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-3 overflow-x-auto py-10 mt-12 border-t border-b border-[var(--text-primary)]/10 no-scrollbar">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] mr-4 shrink-0">Filter By:</span>
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleItems(12);
              }}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 border-2 ${
                activeCategory === cat
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xl shadow-red-900/20 -translate-y-1'
                  : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--text-primary)]/5 hover:border-[var(--text-primary)]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto py-8">
        <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.slice(0, visibleItems).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="gallery-item group cursor-pointer bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--text-primary)]/10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--text-primary)]">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/Shoes.png'; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[#111111] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <ZoomIn size={20} />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/75 text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold tracking-wider shadow-md">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] block mb-1">
                  {item.hours}
                </span>
                <h3 className="font-editorial text-xl font-bold uppercase text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-[var(--text-primary)]/5 flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <span className="text-[11px] text-[var(--text-secondary)] truncate max-w-[200px]">
                    {item.leather}
                  </span>
                  <span className="text-[var(--accent)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                    Inspect <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Trigger / Loader */}
        <div id="gallery-loader" className="w-full h-20 flex items-center justify-center mt-10">
          {visibleItems < filteredItems.length ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Unveiling more masterpieces...
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-50">
              End of Visual Archive
            </span>
          )}
        </div>
      </section>

      {/* Patina Aging Over Time Feature */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto py-24">
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-[3rem] p-8 sm:p-20 border border-[var(--text-primary)]/10 shadow-3xl overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--gold)]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />

          <div className="max-w-3xl mb-16 relative z-10">
            <div className="inline-flex items-center gap-3 mb-6 bg-[var(--bg-primary)]/5 px-4 py-2 rounded-full border border-[var(--bg-primary)]/10">
              <Sparkles size={14} className="text-[var(--accent)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">
                Heirloom Longevity
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              The Alchemy of <br />
              <span className="italic font-light text-[var(--accent)]">Full-Grain Patina.</span>
            </h2>
            <p className="text-lg opacity-60 leading-relaxed font-medium">
              Unlike synthetic footwear that degrades with use, authentic Samadhan leather is a living material. It evolves, absorbing its environment and your journey to create a unique visual history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {PATINA_STAGES.map((st, i) => (
              <div key={i} className="group bg-[var(--bg-primary)]/5 border border-[var(--bg-primary)]/10 p-10 rounded-[2rem] flex flex-col justify-between hover:bg-[var(--bg-primary)]/10 transition-all duration-500 hover:-translate-y-2">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white font-editorial text-2xl font-bold mb-8 shadow-lg shadow-red-900/40 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <h3 className="font-editorial text-2xl font-bold uppercase text-[var(--bg-primary)] mb-4 tracking-tight">
                    {st.stage}
                  </h3>
                  <p className="text-sm opacity-50 leading-relaxed mb-8 font-medium">
                    {st.desc}
                  </p>
                </div>
                <div className="pt-6 border-t border-[var(--bg-primary)]/10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] block mb-2">
                    Visual Hallmarks:
                  </span>
                  <p className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider">
                    {st.characteristics}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Inquiry CTA Banner */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto py-12">
        <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--text-primary)]/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] block mb-2">
              Custom Commissions
            </span>
            <h3 className="font-editorial text-2xl sm:text-4xl font-black uppercase text-[var(--text-primary)]">
              Have a Dream Silhouette in Mind?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              Share your reference photograph or sketch with our Nashik atelier cobblers. We can customize leather shade, welt width, and sole configuration to your exact preference.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/workshop#booking"
              className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--accent)] transition-colors shadow-lg"
            >
              Consult an Artisan
            </Link>
            <button
              onClick={() => {
                const message = "Hello New Samadhan Shoe Mart, I am interested in a bespoke shoe order";
                const targetNum = Math.random() > 0.5 ? '9423228843' : '8888644021';
                window.open(`https://wa.me/91${targetNum}?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="bg-[#25D366] text-white px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1EBE5D] transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <MessageSquare size={16} /> WhatsApp Us
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[10001] bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="bg-[var(--bg-primary)] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-white/20 shadow-2xl relative grid grid-cols-1 md:grid-cols-12">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>

            {/* Modal Image */}
            <div className="md:col-span-7 bg-[var(--text-primary)] relative min-h-[340px] md:min-h-full flex items-center justify-center p-4">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-contain max-h-[500px]"
                onError={(e) => { e.target.src = '/Shoes.png'; }}
              />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                  {selectedItem.category}
                </span>
              </div>
            </div>

            {/* Modal Details */}
            <div className="md:col-span-5 p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] block mb-1">
                  {selectedItem.hours}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-black uppercase text-[var(--text-primary)] mb-2 leading-tight">
                  {selectedItem.title}
                </h3>
                <span className="text-xl font-bold text-[var(--accent)] block mb-4">
                  {selectedItem.price}
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                  {selectedItem.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--text-primary)]/5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block">Leather Tannery:</span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{selectedItem.leather}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--text-primary)]/5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block">Welt Construction:</span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{selectedItem.construction}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--text-primary)]/5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block">Sole Architecture:</span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{selectedItem.sole}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--text-primary)]/10 flex flex-col gap-3">
                <Link
                  to={
                    selectedItem.category === "Women's Edition"
                      ? "/products?category=Women"
                      : selectedItem.category === "Kids Edition"
                      ? "/products?category=Kids"
                      : "/products"
                  }
                  onClick={() => setSelectedItem(null)}
                  className="w-full bg-[var(--text-primary)] text-[var(--bg-primary)] py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-all text-center"
                >
                  Explore in Catalog
                </Link>
                <button
                  onClick={() => {
                    const message = `Hello New Samadhan, I am inquiring about the ${selectedItem.title} from your Gallery`;
                    const targetNum = Math.random() > 0.5 ? '9423228843' : '8888644021';
                    window.open(`https://wa.me/91${targetNum}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> Inquire On WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryPage;
