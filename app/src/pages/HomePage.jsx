import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  Maximize2,
  X,
  Zap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Search,
  SlidersHorizontal,
  Share2,
  MapPin,
  Phone,
  Compass,
  Award,
  Layers,
  Eye,
  CheckCircle2,
  MessageSquare,
  Send,
  Trash2,
  Volume2
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveImageUrl } from '../utils/urlConfig';
import { getMergedProducts } from '../utils/productUtils';
import { getReviews, saveReview, deleteReview, syncReviewsWithServer, calculateOverallStats } from '../utils/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isOwner = user?.role === 'admin' || user?.email === 'admin@samadhanshoes.com' || (typeof window !== 'undefined' && Boolean(localStorage.getItem('samadhan_admin_token')));

  // Reset scroll on load to fix position issues
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Root container ref for GSAP context
  const containerRef = useRef(null);

  // ScrollTrigger pinned hero & shoe references
  const heroPinRef = useRef(null);
  const heroShoeRef = useRef(null);
  const heroShadowRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroBadgesRef = useRef(null);

  // Dynamic products list from unified catalog (includes owner added/edited products)
  const [productsList, setProductsList] = useState(() => getMergedProducts());

  // Listen to catalog updates across tabs and owner edits
  useEffect(() => {
    const handleUpdate = () => {
      setProductsList(getMergedProducts());
    };
    window.addEventListener('products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // 3D Viewer Interactive State
  const [viewerAngle, setViewerAngle] = useState(0); // 0: studio, 1: front, 2: left, 3: right, 4: back
  const [tiltCoords, setTiltCoords] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDraggingViewer, setIsDraggingViewer] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState(8);
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');

  // Full-Screen Preview Modals
  const [fullScreenModal, setFullScreenModal] = useState(null); // 'heroShoe' | 'visitingCard' | 'product' | null
  const [fullScreenProduct, setFullScreenProduct] = useState(null);

  // User Filter Tabs
  const filterTabs = [
    'All',
    'New Arrivals',
    'Limited Edition',
    'Retro',
    'Bestsellers',
    'Men',
    'Women',
    'Sneakers',
    'Formal',
    'Kids'
  ];
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Digital card flip & zoom
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardZoom, setCardZoom] = useState(1);

  // Modal Product State (Quick Detail Drawer)
  const [modalProduct, setModalProduct] = useState(null);
  const [modalSize, setModalSize] = useState(8);
  const [modalQty, setModalQty] = useState(1);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Wishlist state (stored in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Write Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    city: ''
  });

  // Customer Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [overallStats, setOverallStats] = useState({
    average: 4.8,
    total: 1420,
    breakdown: { 5: 78, 4: 16, 3: 4, 2: 1, 1: 1 },
    rawBreakdown: { 5: 1108, 4: 227, 3: 57, 2: 14, 1: 14 }
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Multi-angle real shoe assets for 3D Viewer
  const multiAngleAssets = [
    { label: 'Studio Hero', src: '/New-Samadhan-Shoe-Mart/Main-Shoe.png', angle: '0° Studio' },
    { label: 'Front Angle', src: '/New-Samadhan-Shoe-Mart/Shoes-black-Front-men-6.jpg', angle: 'Front Profile' },
    { label: 'Left Lateral', src: '/New-Samadhan-Shoe-Mart/Shoes-Black-left-men-2.jpg', angle: 'Left Lateral' },
    { label: 'Right Lateral', src: '/New-Samadhan-Shoe-Mart/Shoes-Black-men-right-3.jpg', angle: 'Right Lateral' },
    { label: 'Back Heel', src: '/New-Samadhan-Shoe-Mart/Shoes-Black-Back-men-4.jpg', angle: 'Heel Counter' }
  ];

  // Helper toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Toggle Wishlist
  const toggleWishlist = (productId, e) => {
    e?.stopPropagation();
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
      showToast('Removed from your wishlist');
    } else {
      updated = [...wishlist, productId];
      showToast('Added to your wishlist ❤️');
    }
    setWishlist(updated);
    try {
      localStorage.setItem('samadhan_wishlist', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Add to Cart with live toast
  const handleAddToCart = (product, size = 8, qty = 1, e = null) => {
    e?.stopPropagation();
    addToCart(product, qty, size);
    showToast(`Added ${product.name} (Size ${size}) to cart!`);
  };

  // ==========================================
  // COMPREHENSIVE FILTERING ENGINE
  // Covers: All, New Arrivals, Limited Edition, Retro, Bestsellers, Men, Women, Sneakers, Formal, Kids
  // ==========================================
  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      // 1. Tab Filter
      let matchesTab = true;
      const catLower = (p.category || '').toLowerCase();
      const genderLower = (p.targetGender || '').toLowerCase();
      const colLower = (p.collection || '').toLowerCase();
      const nameLower = (p.name || '').toLowerCase();
      const descLower = (p.description || '').toLowerCase();

      switch (activeTab) {
        case 'New Arrivals':
          matchesTab = colLower === 'new arrivals' || p.isNew || p.id === 'm1' || p.id === 'w1' || p.id === 's1';
          break;
        case 'Limited Edition':
          matchesTab = colLower === 'limited edition' || p.price >= 1800 || p.rating >= 4.9;
          break;
        case 'Retro':
          matchesTab = colLower === 'retro' || catLower === 'formal' || p.id === 's2' || p.id === 'm2';
          break;
        case 'Bestsellers':
          matchesTab = colLower === 'bestsellers' || (p.rating && p.rating >= 4.8);
          break;
        case 'Men':
          matchesTab = catLower === 'men' || genderLower === 'men' || (!genderLower.includes('women') && !catLower.includes('women') && !catLower.includes('kids'));
          break;
        case 'Women':
          matchesTab = catLower === 'women' || genderLower === 'women' || nameLower.includes('sandals') || nameLower.includes('chappal') || nameLower.includes('ladies') || nameLower.includes('heels');
          break;
        case 'Sneakers':
          matchesTab = catLower === 'sneakers' || nameLower.includes('sneaker') || nameLower.includes('runner') || p.purpose?.includes('Running') || p.purpose?.includes('Sports');
          break;
        case 'Formal':
          matchesTab = catLower === 'formal' || nameLower.includes('derby') || nameLower.includes('formal') || nameLower.includes('oxford') || p.purpose?.includes('Office');
          break;
        case 'Kids':
          matchesTab = catLower === 'kids' || genderLower === 'kids' || nameLower.includes('junior') || nameLower.includes('scholar');
          break;
        case 'All':
        default:
          matchesTab = true;
          break;
      }

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        nameLower.includes(q) ||
        catLower.includes(q) ||
        descLower.includes(q) ||
        (p.brand || '').toLowerCase().includes(q);

      // 3. Price filter
      let matchesPrice = true;
      if (priceFilter === 'under1000') matchesPrice = p.price < 1000;
      else if (priceFilter === '1000to2000') matchesPrice = p.price >= 1000 && p.price <= 2000;
      else if (priceFilter === 'above2000') matchesPrice = p.price > 2000;

      return matchesTab && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // default order
    });
  }, [productsList, activeTab, searchQuery, priceFilter, sortBy]);

  // ── Load & sync reviews across all browsers/devices ──
  const loadReviewsFromStorage = useCallback(() => {
    try {
      const saved = getReviews();
      if (saved && Array.isArray(saved)) {
        const formatted = saved.slice(0, 10).map(r => ({
          id: r.id || `rev_${Date.now()}_${Math.random()}`,
          name: r.name || 'Valued Customer',
          rating: Number(r.rating) || 5,
          comment: r.comment || r.review || 'Exceptional craftsmanship and comfortable fit.',
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          verified: true,
          city: r.city || 'Nashik'
        }));
        setReviewsList(formatted);

        // Update live stats from all synced reviews
        const stats = calculateOverallStats();
        if (stats.total > 0) {
          setOverallStats(stats);
        }
      }
    } catch (err) {
      console.warn('Review load error:', err);
    }
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    showToast('Synchronizing reviews across devices...');
    try {
      await syncReviewsWithServer();
      loadReviewsFromStorage();
      showToast('Reviews synced successfully! ✅');
    } catch (err) {
      showToast('Sync failed. Using cached reviews.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadReviewsFromStorage();
    // Synchronize cross-device reviews from backend server
    syncReviewsWithServer().then(() => loadReviewsFromStorage()).catch(() => {});

    // Real-time sync: listen to localStorage changes from other tabs
    const handleStorageSync = (e) => {
      if (!e.key || e.key === 'newSamadhanProductReviews') {
        loadReviewsFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageSync);
    window.addEventListener('reviews_updated', loadReviewsFromStorage);

    let bc;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('samadhan_reviews_channel');
        bc.onmessage = () => {
          loadReviewsFromStorage();
        };
      }
    } catch (_) {}

    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener('reviews_updated', loadReviewsFromStorage);
      try { bc?.close(); } catch (_) {}
    };
  }, [loadReviewsFromStorage]);

  // Owner Delete Review Handler
  const handleDeleteReview = async (reviewId, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      await deleteReview(reviewId);
      setReviewsList(prev => prev.filter(r => r.id !== reviewId));
      showToast('Review deleted by Owner. Synchronized across all devices.');
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewFormData.name.trim() || !reviewFormData.comment.trim()) {
      showToast('Please enter your name and review feedback.');
      return;
    }
    const newRev = {
      name: reviewFormData.name.trim(),
      rating: Number(reviewFormData.rating) || 5,
      review: reviewFormData.comment.trim(),
      comment: reviewFormData.comment.trim(),
      city: reviewFormData.city?.trim() || 'Nashik',
      createdAt: new Date().toISOString()
    };
    const saved = await saveReview(newRev);

    setReviewsList(prev => [
      {
        id: saved.id || `rev_${Date.now()}`,
        name: newRev.name,
        rating: newRev.rating,
        comment: newRev.comment,
        date: 'Just now',
        verified: true,
        city: newRev.city
      },
      ...prev
    ].slice(0, 10));

    setReviewFormData({ name: '', rating: 5, comment: '', city: '' });
    setIsReviewModalOpen(false);
    showToast('Thank you! Your verified review has been published across all devices. ✅');
  };

  // 3D Tilt handlers on Phase 4 Spotlight
  const handleMouseMoveViewer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTiltCoords({ x: x * 18, y: -y * 18 });
  };

  const handleMouseLeaveViewer = () => {
    setTiltCoords({ x: 0, y: 0 });
  };

  // Touch drag for 3D-feel
  const handleTouchStartViewer = (e) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDraggingViewer(true);
  };

  const handleTouchMoveViewer = (e) => {
    if (!isDraggingViewer) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;

    // Scale sensitivity by viewport width
    const sensitivity = window.innerWidth < 640 ? 0.6 : 0.4;

    setTiltCoords({
      x: Math.max(-30, Math.min(30, deltaX * sensitivity)),
      y: Math.max(-30, Math.min(30, -deltaY * sensitivity))
    });
  };

  const handleTouchEndViewer = () => {
    setIsDraggingViewer(false);
    setTiltCoords({ x: 0, y: 0 });
  };
  // ==========================================
  // GSAP SCROLLTRIGGER ORCHESTRATION
  // ==========================================
  useEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // DESKTOP & TABLET SCROLLTRIGGER TIMELINE (>= 768px)
      mm.add("(min-width: 768px)", () => {
        // Reduced hero pinning to focus more on product showcase
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: "top top",
            end: "+=800",
            pin: true,
            scrub: 1.2,
            anticipatePin: 1
          }
        });

        // 1. Initial State: Shoe scales up, rotates smoothly, moves to center
        heroTimeline
          .to(heroShoeRef.current, {
            scale: 1.2,
            y: 20,
            rotation: 0,
            ease: "power2.inOut"
          }, 0)
          .to(heroShadowRef.current, {
            scale: 1.2,
            opacity: 0.35,
            y: 30,
            ease: "power2.inOut"
          }, 0)
          .to(heroTextRef.current, {
            y: -80,
            opacity: 0,
            ease: "power2.in"
          }, 0)
          .to(heroBadgesRef.current, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "back.out(1.5)"
          }, 0.2)
          .to(heroShoeRef.current, {
            rotationY: 12,
            rotationZ: -2,
            scale: 1.1,
            x: -20,
            ease: "power2.out"
          }, 0.4)
          .to(".phase1-reveal-layer", {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.5);

        // Product Cards Scroll Reveals
        gsap.utils.toArray(".product-scroll-card").forEach((card, idx) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none reverse"
            },
            y: 40,
            scale: 0.98,
            opacity: 0,
            duration: 0.6,
            delay: (idx % 3) * 0.05,
            ease: "power2.out"
          });
        });

        // 3D Product View Parallax Entrance
        gsap.from(".spotlight-viewer-container", {
          scrollTrigger: {
            trigger: "#immersive-3d-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
          scale: 0.92,
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out"
        });

        // Review section trigger
        if (document.querySelectorAll(".review-card-item").length > 0) {
          gsap.from(".review-card-item", {
            scrollTrigger: {
              trigger: "#reviews-phase-section",
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out"
          });
        }

        // Conversion Banner
        gsap.from(".cta-conversion-box", {
          scrollTrigger: {
            trigger: "#conversion-phase-section",
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // MOBILE SCROLLTRIGGER SETUP (< 768px)
      mm.add("(max-width: 767px)", () => {
        gsap.to(heroShoeRef.current, {
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          },
          scale: 1.15,
          rotation: 0,
          y: 35
        });

        gsap.utils.toArray(".product-scroll-card, .review-card-item").forEach(el => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse"
            },
            y: 35,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
          });
        });
      });

    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [productsList]);

  return (
    <div
      ref={containerRef}
      className="bg-[#faf9f6] text-[#111111] font-sans selection:bg-[#d4af37] selection:text-black overflow-x-hidden pt-20"
    >
      {/* LUXURY TOP ANNOUNCEMENT TICKER */}
      <div className="bg-[#111111] text-white py-3 border-b border-[#d4af37]/30 select-none overflow-hidden relative z-30">
        <div className="flex whitespace-nowrap animate-marquee will-change-transform">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 mx-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] flex items-center gap-3 text-white">
                <Award size={15} className="text-[#d4af37]" /> NEW SAMADHAN SHOES MART • NASHIK HERITAGE SINCE 1998
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] flex items-center gap-3 text-[#d4af37]">
                <Zap size={15} className="fill-[#d4af37]" /> ONLINE STORE ACTIVE • FLAT ₹500 VOUCHER OVER ₹999
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] flex items-center gap-3 text-white">
                <Truck size={15} className="text-amber-400" /> FREE ALL-INDIA SHIPPING ON PREPAID FOOTWEAR
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] flex items-center gap-3 text-gray-300">
                <ShieldCheck size={15} className="text-emerald-400" /> 100% GENUINE LEATHER & ERGONOMIC ARCH SUPPORT
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK SUB-BAR WITH 10 WORKING FILTER TABS */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-black/10 py-2 md:py-3.5 px-4 md:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] hidden sm:inline-block">
              FILTERS:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    const el = document.getElementById('all-products-showcase');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#111111] text-white shadow-md shadow-black/10 scale-105'
                      : 'bg-black/5 text-gray-700 hover:bg-[#d4af37]/20 hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('immersive-3d-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[11px] font-black uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 hover:underline whitespace-nowrap"
            >
              <Compass size={14} /> 3D View
            </button>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#d4af37] text-black px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-black hover:text-white transition-all whitespace-nowrap shadow-sm"
            >
              Catalog View
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          PHASE 1 — HERO / SHOE ARRIVAL (PINNED SCROLLTRIGGER)
          ======================================================== */}
      <section
        ref={heroPinRef}
        id="hero-scroll-phase"
        className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#faf9f6] via-[#f7f5f0] to-[#f4f1ea]"
      >
        {/* Editorial Background Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden select-none">
          <span className="text-[clamp(6rem,18vw,22rem)] font-black uppercase tracking-tighter text-black/[0.03] leading-none whitespace-nowrap">
            SAMADHAN
          </span>
        </div>

        {/* Floating Architectural Ring Accents */}
        <div className="absolute w-[600px] h-[600px] border border-[#d4af37]/15 rounded-full pointer-events-none animate-[spin_40s_linear_infinite]" />
        <div className="absolute w-[450px] h-[450px] border border-black/5 rounded-full pointer-events-none animate-[spin_25s_linear_infinite_reverse]" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-8 xs:py-12 md:py-20">
          {/* Left Column: Brand & Editorial Typography */}
          <div ref={heroTextRef} className="lg:col-span-5 text-center lg:text-left px-4 sm:px-0">
            <div className="inline-flex items-center gap-2 xs:gap-3 px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-full bg-white border border-[#d4af37]/30 shadow-sm mb-4 xs:mb-6">
              <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-[#d4af37] animate-ping" />
              <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] text-[#111111]">
                EST. 1998 • NASHIK ATELIER
              </span>
            </div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] text-[#111111] mb-4 xs:mb-6">
              NEW SAMADHAN <br />
              <span className="text-[#d4af37] italic font-editorial">SHOES MART</span>
            </h1>

            <div className="h-1 w-16 xs:w-20 bg-[#d4af37] mb-4 xs:mb-6 rounded-full mx-auto lg:mx-0" />

            <h2 className="text-lg xs:text-xl sm:text-2xl font-black uppercase tracking-widest text-black/80 mb-3 xs:mb-4">
              STEP INTO YOUR STYLE.
            </h2>

            <p className="text-sm xs:text-base sm:text-lg text-gray-600 font-medium leading-relaxed mb-6 xs:mb-8 max-w-lg mx-auto lg:mx-0">
              Premium footwear for every occasion. Meticulously handcrafted silhouettes blending ergonomic comfort with high-fashion distinction.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 xs:gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('all-products-showcase');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#111111] text-white px-6 xs:px-8 py-3 xs:py-4 rounded-full text-[10px] xs:text-xs font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-xl shadow-black/15 flex items-center gap-2 xs:gap-3 group cursor-pointer"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight size={14} className="xs:w-4 xs:h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => setFullScreenModal('heroShoe')}
                className="bg-white text-[#111111] border border-black/15 px-6 xs:px-8 py-3 xs:py-4 rounded-full text-[10px] xs:text-xs font-black uppercase tracking-[0.2em] hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 shadow-sm flex items-center gap-1.5 xs:gap-2 cursor-pointer"
              >
                <Maximize2 size={13} className="xs:w-[15px] xs:h-[15px]" /> FULL SCREEN
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 xs:gap-6 mt-8 xs:mt-12 pt-6 xs:pt-8 border-t border-black/10">
              <div>
                <p className="text-2xl font-black text-[#111111]">26+</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Years Crafting</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#d4af37]">4.8 ★</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Customer Rating</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#111111]">{productsList.length}+</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Artisan Pairs</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Shoe 3D Arrival Canvas */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[420px] lg:min-h-[580px]">
            {/* Ambient Gold Glow Halo */}
            <div className="absolute w-[320px] md:w-[480px] h-[320px] md:h-[480px] bg-[#d4af37]/15 rounded-full blur-[90px] pointer-events-none" />

            {/* Dynamic Shoe Element with Full Screen Button */}
            <div
              ref={heroShoeRef}
              className="relative z-10 w-full max-w-[540px] transform -rotate-12 transition-transform duration-700 select-none cursor-pointer group animate-float-slow"
              onClick={() => setFullScreenModal('heroShoe')}
            >
              {/* Gemini / Star Style Decorative Overlays */}
              <div className="absolute -top-10 -left-6 text-[#d4af37] animate-pulse pointer-events-none z-20">
                <Sparkles size={48} className="drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
              </div>
              <div className="absolute -bottom-8 -right-4 text-[#d4af37] animate-bounce pointer-events-none z-20 delay-500">
                <Star size={32} fill="#d4af37" className="opacity-80" />
              </div>
              <div className="absolute top-1/2 -left-12 text-[#d4af37] animate-pulse pointer-events-none z-20 delay-300 opacity-50">
                <Sparkles size={24} />
              </div>

              {/* Animated Shoe Container */}
              <div className="animate-float-slow">
                <img
                  src={resolveImageUrl('/New-Samadhan-Shoe-Mart/Main-Shoe.png')}
                  alt="New Samadhan Shoes Mart Hero Shoe"
                  className="w-full h-auto object-contain drop-shadow-[0_45px_35px_rgba(0,0,0,0.25)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Expand to Full Screen overlay badge */}
              <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg">
                <Maximize2 size={13} /> Full Screen
              </div>
            </div>

            {/* Realistic Responsive Dynamic Shadow */}
            <div
              ref={heroShadowRef}
              className="w-3/4 h-8 bg-black/20 rounded-[100%] blur-xl mt-[-20px] transition-all"
            />

            {/* Floating Technical Feature Badges */}
            <div
              ref={heroBadgesRef}
              className="absolute inset-0 pointer-events-none flex flex-col justify-between py-4 xs:py-6 px-1 xs:px-2 opacity-90"
            >
              <div className="self-end bg-white/95 backdrop-blur-md border border-[#d4af37]/30 shadow-lg px-3 xs:px-4 py-2 xs:py-2.5 rounded-xl xs:rounded-2xl flex items-center gap-2 xs:gap-3 transform translate-y-2 xs:translate-y-4">
                <div className="w-6 h-6 xs:w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <Sparkles size={12} className="xs:w-4 xs:h-4" />
                </div>
                <div>
                  <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-widest text-[#d4af37] block">CRAFT STANDARD</span>
                  <span className="text-[10px] xs:text-xs font-bold text-gray-900">Anatomical Arch Balance</span>
                </div>
              </div>

              <div className="self-start bg-white/95 backdrop-blur-md border border-black/10 shadow-lg px-3 xs:px-4 py-2 xs:py-2.5 rounded-xl xs:rounded-2xl flex items-center gap-2 xs:gap-3 transform -translate-y-2 xs:-translate-y-4">
                <div className="w-6 h-6 xs:w-8 h-8 rounded-full bg-black text-[#d4af37] flex items-center justify-center">
                  <ShieldCheck size={12} className="xs:w-4 xs:h-4" />
                </div>
                <div>
                  <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-widest text-gray-500 block">DURABILITY GRADE</span>
                  <span className="text-[10px] xs:text-xs font-bold text-gray-900">Vulcanized High-Grip Sole</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator Prompt */}
            <div className="mt-8 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                SCROLL TO EXPLORE ALL PRODUCTS
              </span>
              <div className="w-5 h-8 rounded-full border-2 border-black/20 flex items-start justify-center p-1">
                <div className="w-1.5 h-2 bg-[#d4af37] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Phase Transition Overlay Text */}
        <div className="phase1-reveal-layer absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] block mb-1">
            ENTER THE FOOTWEAR VAULT
          </span>
          <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">
            Complete Artisan Catalog Below
          </p>
        </div>
      </section>

      {/* ========================================================
          ALL PRODUCTS SHOWCASE WITH 10 WORKING FILTER TABS
          (Categories and Featured removed & unified directly here)
          ======================================================== */}
      <section
        id="all-products-showcase"
        className="py-28 px-6 md:px-12 bg-white relative border-t border-black/5"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37] block mb-3">
              COMPLETE ARTISAN COLLECTION
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111] mb-6">
              ALL FOOTWEAR <span className="text-[#d4af37] italic font-editorial">MODELS</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Browse our complete range of handcrafted footwear. Filter by category, collection, or search your preferred style with live pricing.
            </p>
          </div>

          {/* Interactive Working 10 Tabs Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-black/5">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#111111] text-white shadow-lg shadow-black/15 scale-105 border-2 border-[#111111]'
                    : 'bg-[#faf9f6] text-gray-700 border border-black/10 hover:border-[#d4af37] hover:bg-[#d4af37]/15'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="bg-[#faf9f6] p-5 rounded-2xl border border-black/10 shadow-xs mb-12 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search by name, style, category, or price..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-black/15 text-sm font-medium focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Active Results Metric */}
            <div className="text-xs font-black uppercase tracking-wider text-gray-500">
              Showing <span className="text-[#111111] font-black">{filteredProducts.length}</span> shoes in{' '}
              <span className="text-[#d4af37]">{activeTab}</span>
            </div>

            {/* Sort & Price Filter */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-white border border-black/15 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">All Prices</option>
                <option value="under1000">Under ₹1,000</option>
                <option value="1000to2000">₹1,000 - ₹2,000</option>
                <option value="above2000">Above ₹2,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-black/15 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#d4af37]"
              >
                <option value="featured">Featured First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#faf9f6] rounded-3xl border border-black/5">
              <p className="text-xl font-black uppercase tracking-widest text-gray-400 mb-4">No matching shoes found</p>
              <button
                onClick={() => { setActiveTab('All'); setSearchQuery(''); setPriceFilter('all'); }}
                className="bg-[#111111] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#d4af37] hover:text-black transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => {
                const isFav = wishlist.includes(product.id || product._id);
                const displayImg = product.images?.[0] || product.image || '/New-Samadhan-Shoe-Mart/Main-Shoe.png';

                return (
                  <div
                    key={product.id || product._id}
                    onClick={() => setModalProduct(product)}
                    className="product-scroll-card group bg-[#faf9f6] rounded-3xl p-7 border border-black/10 hover:border-[#d4af37]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Top Row: Category, Rating & Actions */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d4af37] px-3 py-1 bg-[#d4af37]/10 rounded-full">
                          {product.category || product.collection || 'Atelier Signature'}
                        </span>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                            <Star size={13} className="text-[#d4af37] fill-[#d4af37]" />
                            <span>{product.rating || 4.8}</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullScreenProduct(product);
                              setFullScreenModal('product');
                            }}
                            className="w-9 h-9 rounded-full bg-white text-gray-700 hover:bg-black hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                            title="Full Screen View"
                          >
                            <Maximize2 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id || product._id, e);
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isFav
                                ? 'bg-red-50 text-red-500 scale-110 shadow-sm'
                                : 'bg-white text-gray-500 hover:bg-black hover:text-white'
                            }`}
                            title="Add to Wishlist"
                          >
                            <Heart size={15} className={isFav ? "fill-red-500" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Large Shoe Image with Parallax & Hover Rotation */}
                      <div
                        className="relative aspect-[4/3] rounded-2xl bg-white overflow-hidden mb-6 flex items-center justify-center p-6 group-hover:bg-[#f7f5f0] transition-colors border border-black/5"
                      >
                        <img
                          src={resolveImageUrl(displayImg)}
                          alt={product.name}
                          className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)]"
                          onError={(e) => {
                            e.target.src = resolveImageUrl('/New-Samadhan-Shoe-Mart/Main-Shoe.png');
                          }}
                        />

                        {/* Quick View Pill on Image */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="bg-white/95 backdrop-blur-md text-[#111111] px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg">
                            <Eye size={14} /> Quick View
                          </span>
                        </div>
                      </div>

                      {/* Product Name & Short Description */}
                      <h3
                        className="text-xl font-black uppercase tracking-tight text-[#111111] group-hover:text-[#d4af37] transition-colors mb-2"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {product.description || 'Lightweight everyday footwear designed for premium comfort and street style.'}
                      </p>

                      {/* Available Sizes Bar */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">SIZES:</span>
                        {(product.sizes || [6, 7, 8, 9, 10]).map((sz) => (
                          <span
                            key={sz}
                            className="w-6 h-6 rounded-md bg-white border border-black/10 text-[10px] font-bold flex items-center justify-center text-gray-700"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>

                      {/* Available Color Swatches */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">TONES:</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-black border border-white shadow-xs" title="Obsidian Black" />
                        <span className="w-3.5 h-3.5 rounded-full bg-gray-400 border border-white shadow-xs" title="Clean Ash" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#d4af37] border border-white shadow-xs" title="Heritage Gold" />
                      </div>
                    </div>

                    {/* Bottom Pricing & Action Buttons */}
                    <div className="pt-4 border-t border-black/10">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <span className="text-2xl font-black text-[#111111] tracking-tight">
                            ₹{product.price?.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400 line-through ml-2">
                            ₹{(Math.round((product.price || 0) * 1.45)).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Save 30%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalProduct(product);
                          }}
                          className="w-full py-3 rounded-full border border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-all text-center cursor-pointer"
                        >
                          VIEW PRODUCT
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, 8, 1, e)}
                          className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-black uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-black/10 cursor-pointer"
                        >
                          <ShoppingBag size={14} /> ADD TO CART
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          PHASE 4 — IMMERSIVE 3D PRODUCT VIEW (FEATURED SPOTLIGHT)
          ======================================================== */}
      <section
        id="immersive-3d-section"
        className="py-28 px-6 md:px-12 bg-[#faf9f6] relative overflow-hidden border-t border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37] block mb-3">
              PHASE 04 // INTERACTIVE 3D PERSPECTIVE STUDIO
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111] mb-6">
              360° SPATIAL <span className="text-[#d4af37] italic font-editorial">INSPECTION</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Experience the shoe from every vantage point. Tilt your mouse or drag with your finger to inspect sole ergonomics, full-grain stitching, and dynamic shadow profiles.
            </p>
          </div>

          {/* Interactive 3D Showcase Box */}
          <div className="spotlight-viewer-container bg-white rounded-[2rem] border border-black/10 p-6 sm:p-8 lg:p-14 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: 3D Shoe Visualizer with Perspective & Tilt */}
            <div className="lg:col-span-7 flex flex-col items-center w-full">
              {/* Studio Canvas with Perspective */}
              <div
                className="w-full aspect-square sm:aspect-[4/3] rounded-3xl bg-[#faf9f6] border border-black/10 relative flex items-center justify-center p-4 sm:p-8 select-none overflow-hidden cursor-grab active:cursor-grabbing perspective-1500"
                onMouseMove={handleMouseMoveViewer}
                onMouseLeave={handleMouseLeaveViewer}
                onTouchStart={handleTouchStartViewer}
                onTouchMove={handleTouchMoveViewer}
                onTouchEnd={handleTouchEndViewer}
              >
                {/* Visual grid watermark */}
                <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

                {/* Perspective Transformed Shoe */}
                <div
                  className="relative z-10 w-full max-w-lg transition-transform duration-200 ease-out preserve-3d"
                  style={{
                    transform: `rotateY(${tiltCoords.x}deg) rotateX(${tiltCoords.y}deg) scale(${zoomLevel})`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <img
                    src={resolveImageUrl(multiAngleAssets[viewerAngle].src)}
                    alt="Interactive 3D Shoe Inspection"
                    className="w-full h-auto object-contain drop-shadow-[0_45px_30px_rgba(0,0,0,0.22)] pointer-events-none"
                  />
                </div>

                {/* Dynamic Shadow that shifts counter to tilt */}
                <div
                  className="absolute bottom-8 w-2/3 h-6 bg-black/20 rounded-[100%] blur-xl transition-all"
                  style={{
                    transform: `translate(${-tiltCoords.x * 1.5}px, ${tiltCoords.y * 0.8}px) scale(${zoomLevel})`
                  }}
                />

                {/* Perspective Angle Label & Full Screen Trigger */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-wider text-gray-700 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                    {multiAngleAssets[viewerAngle].angle}
                  </div>

                  <button
                    onClick={() => setFullScreenModal('heroShoe')}
                    className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:bg-[#d4af37] hover:text-black transition-colors"
                  >
                    <Maximize2 size={12} /> Full Screen
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-black/10 shadow-sm">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-black hover:text-white flex items-center justify-center transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(0.85, prev - 0.15))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-black hover:text-white flex items-center justify-center transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={() => { setZoomLevel(1); setTiltCoords({ x: 0, y: 0 }); }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-black hover:text-white flex items-center justify-center transition-colors"
                    title="Reset View"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Multi-angle Thumbnail Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                {multiAngleAssets.map((asset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setViewerAngle(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      viewerAngle === idx
                        ? 'bg-[#111111] text-[#d4af37] shadow-md scale-105'
                        : 'bg-white text-gray-600 border border-black/10 hover:border-[#d4af37]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {asset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Technical Product Information & Direct Checkout */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#d4af37] mb-2">
                  <Award size={16} /> FLAGSHIP SILHOUETTE
                </div>

                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111] mb-3">
                  AERO-GLIDE OBSIDIAN LUXE
                </h3>

                {/* Rating Bar */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex text-[#d4af37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900">4.8 / 5</span>
                  <span className="text-xs font-medium text-gray-500">• 124 Customer Reviews</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-black text-[#111111]">₹1,499</span>
                  <span className="text-base text-gray-400 line-through">₹2,499</span>
                  <span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Special Launch Offer
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                  Premium lightweight footwear designed for everyday comfort and modern style. Features reinforced heel counters and adaptive cushioning.
                </p>

                {/* Features with Checks */}
                <div className="space-y-2.5 mb-8 bg-[#faf9f6] p-5 rounded-2xl border border-black/10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-2">
                    SIGNATURE CRAFT FEATURES:
                  </span>
                  {[
                    'Lightweight construction with aerodynamic upper',
                    'Comfortable anatomical sole engineered for Indian feet',
                    'Breathable micro-porous climate regulating fabric',
                    'Durable high-tensile vulcanized outsole',
                    'Everyday styling suitable for work, college & travel'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-800">
                      <CheckCircle2 size={16} className="text-[#d4af37] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                      SELECT SIZE (IND/UK):
                    </span>
                    <button
                      onClick={() => showToast('Standard Indian sizing. Order your usual dress shoe size.')}
                      className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider hover:underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {[6, 7, 8, 9, 10, 11].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-12 h-11 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#111111] text-[#d4af37] border-2 border-[#111111] shadow-md scale-105'
                            : 'bg-white text-gray-700 border border-black/15 hover:border-black'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="mb-8">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-900 block mb-2.5">
                    SELECT FINISH: <span className="text-[#d4af37]">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {[
                      { name: 'Obsidian Black', color: '#111111' },
                      { name: 'Clean White', color: '#ffffff' },
                      { name: 'Ash Grey', color: '#888888' }
                    ].map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-black bg-white shadow-sm'
                            : 'border-transparent text-gray-500 hover:text-black'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: c.color }}
                        />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const spotlightProd = productsList[0] || {
                      id: 'spotlight_prod',
                      name: 'AERO-GLIDE OBSIDIAN LUXE',
                      price: 1499,
                      image: '/New-Samadhan-Shoe-Mart/Main-Shoe.png'
                    };
                    handleAddToCart(spotlightProd, selectedSize, 1);
                  }}
                  className="py-4 rounded-full bg-[#111111] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/15 cursor-pointer"
                >
                  <ShoppingBag size={16} /> ADD TO CART
                </button>

                <a
                  href={`https://wa.me/919423228843?text=${encodeURIComponent(`Hello New Samadhan Shoe Mart, I would like to order the Spotlight Model: ${productsList[0]?.name || 'AERO-GLIDE OBSIDIAN LUXE'} (Size UK/IND ${selectedSize}, Price: ₹${productsList[0]?.price || 1499}). Please confirm order.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 rounded-full bg-[#25D366] text-black hover:bg-[#1ebe5d] hover:text-white text-xs font-black uppercase tracking-[0.2em] transition-all text-center shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> ORDER ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PHASE 5 — CUSTOMER RATINGS & REVIEWS
          ======================================================== */}
      <section
        id="reviews-phase-section"
        className="py-28 px-6 md:px-12 bg-white relative"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37] block mb-3">
                  PHASE 05 // VERIFIED VOICES
                </span>
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111]">
                  CUSTOMER <span className="text-[#d4af37] italic font-editorial">RATINGS & REVIEWS</span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="bg-white text-black border border-black/10 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? 'SYNCING...' : 'SYNC NOW'}
                </button>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-[#111111] text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all shadow-md cursor-pointer"
                >
                  WRITE A REVIEW
                </button>
              </div>
            </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left: Overall Score Card with Breakdown Bars */}
            <div className="lg:col-span-4 bg-[#faf9f6] p-8 rounded-3xl border border-black/10 shadow-xs">
              <div className="text-center pb-8 border-b border-black/10">
                <div className="text-6xl font-black text-[#111111] tracking-tighter mb-2">
                  {overallStats.average} <span className="text-2xl text-gray-400 font-normal">/ 5</span>
                </div>
                <div className="flex justify-center text-[#d4af37] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={22} className={i < Math.round(overallStats.average) ? "fill-[#d4af37]" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Based on {overallStats.total?.toLocaleString()}+ Customer Reviews
                </p>
              </div>

              {/* Breakdown Bars */}
              <div className="space-y-3 pt-6">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-black text-gray-800">{star} ★</span>
                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#d4af37] rounded-full transition-all duration-1000"
                        style={{ width: `${overallStats.breakdown[star]}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-gray-400 font-medium">{overallStats.breakdown[star]}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-black/10 bg-white p-4 rounded-2xl flex items-center gap-3 border border-black/5">
                <ShieldCheck size={24} className="text-emerald-600 shrink-0" />
                <p className="text-[11px] text-gray-600 leading-snug">
                  100% Verified Purchases from New Samadhan Shoes Mart Nashik Atelier & Digital Store.
                </p>
              </div>
            </div>

            {/* Right: Individual Verified Customer Reviews */}
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="review-card-item bg-[#faf9f6] p-7 rounded-3xl border border-black/10 hover:border-[#d4af37]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#111111] text-[#d4af37] font-black text-sm flex items-center justify-center">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">
                            {rev.name}
                          </h4>
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Verified Purchase
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {rev.date}
                        </span>
                        {isOwner && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteReview(rev.id, e)}
                            className="p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete this review (Owner Action)"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex text-[#d4af37] mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rev.rating ? "fill-[#d4af37]" : "text-gray-300"}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{rev.city || 'Nashik Customer'}</span>
                    <span className="text-emerald-700 font-black">Shoe Fit: Perfect (True to Size)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Review Management Bar if Logged in as Owner */}
          {isOwner && (
            <div className="mt-8 p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#d4af37]" />
                <span className="text-xs font-bold text-gray-800">Owner Access Active: You can delete reviews directly using the red trash icon.</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/reviews')}
                className="text-xs font-black uppercase tracking-wider text-[#111111] hover:text-[#d4af37] underline cursor-pointer"
              >
                Open Admin Review Dashboard →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          PHASE 6 — FINAL CONVERSION SECTION & BRAND CLOSING
          ======================================================== */}
      <section
        id="conversion-phase-section"
        className="py-28 px-6 md:px-12 bg-[#111111] text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="cta-conversion-box text-center max-w-4xl mx-auto mb-20">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37] block mb-4">
              PHASE 06 // ELEVATE YOUR FOOTWEAR
            </span>

            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.88] mb-8">
              YOUR NEXT STEP <br />
              <span className="text-[#d4af37] italic font-editorial">STARTS HERE.</span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              Discover footwear designed for your everyday moments, special occasions and everything in between.
            </p>

            {/* Five Category Conversion Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
              {[
                { label: 'SHOP MEN', cat: 'Men' },
                { label: 'SHOP WOMEN', cat: 'Women' },
                { label: 'SHOP SNEAKERS', cat: 'Sneakers' },
                { label: 'SHOP FORMAL', cat: 'Formal' },
                { label: 'SHOP KIDS', cat: 'Kids' }
              ].map((btn) => (
                <button
                  key={btn.cat}
                  onClick={() => {
                    setActiveTab(btn.cat);
                    const el = document.getElementById('all-products-showcase');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Brand Anchor Title */}
            <div className="pt-12 border-t border-white/10">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white mb-2">
                NEW SAMADHAN SHOES MART
              </h3>
              <p className="text-sm font-editorial italic text-[#d4af37] tracking-wider">
                Premium footwear. Every step. Every style.
              </p>
            </div>
          </div>

          {/* Flagship Showroom Banner with Radiant Gold Ambient Glow */}
          <div className="relative mb-14 max-w-5xl mx-auto rounded-3xl sm:rounded-[2.5rem] overflow-hidden p-1.5 bg-gradient-to-r from-[#d4af37]/70 via-[#ffecb3]/90 to-[#d4af37]/70 shadow-[0_0_55px_rgba(212,175,55,0.48)] group">
            <div className="relative rounded-[22px] sm:rounded-[36px] overflow-hidden bg-white">
              <img
                src={resolveImageUrl("/New-Samadhan-Shoe-Mart/Front-Banner.jpg")}
                alt="New Samadhan Shoes Mart Flagship Showroom Nashik"
                className="w-full h-[220px] sm:h-[340px] md:h-[420px] object-cover filter brightness-110 contrast-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-white/20 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37] text-black text-[9px] font-black uppercase tracking-[0.25em] mb-2 shadow-md">
                    ✨ NASHIK PHYSICAL FLAGSHIP SHOWROOM
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black text-[#111111] tracking-tight uppercase">
                    NEW SAMADHAN SHOE MART
                  </h3>
                  <p className="text-xs sm:text-sm text-[#111111]/70 font-medium">
                    Plot No 29, Santkrupa Niwas, Factory Rd, Nashik • Since 1998
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://www.google.com/maps/place/New+Samadhan+Shoe+Mart+(+factory+)/@19.9993642,73.8348839,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#d4af37] text-black text-xs font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer shadow-lg"
                  >
                    Showroom Directions →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Heritage Visiting Card & Directions Box with Full Screen Trigger */}
          <div className="grid lg:grid-cols-12 gap-8 items-center bg-white/[0.04] p-8 sm:p-12 rounded-[2.5rem] border border-white/10">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] block mb-2">
                VISIT OUR PHYSICAL ATELIER
              </span>
              <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4">
                THE NASHIK FLAGSHIP FACTORY STORE
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xl">
                Experience bespoke sizing, leather custom fitting, and explore the complete 300+ physical catalog in person at our Nashik workshop.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-300 mb-8">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#d4af37]" /> Factory Road, Nashik, Maharashtra
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={16} className="text-[#d4af37]" /> +91 94232 28843 / 88886 44021
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://www.google.com/maps/place/New+Samadhan+Shoe+Mart+(+factory+)/@19.9993642,73.8348839,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#d4af37] text-black px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <MapPin size={15} /> GOOGLE MAPS DIRECTIONS
                </a>

                <button
                  onClick={() => setFullScreenModal('visitingCard')}
                  className="bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Maximize2 size={15} /> FULL SCREEN CARD
                </button>
              </div>
            </div>

            {/* 3D Flip Visiting Card — Responsive for Mobile */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Card flip container - responsive sizing with touch support */}
              <div
                className="w-full max-w-xs sm:max-w-sm cursor-pointer group perspective-1000 relative select-none touch-manipulation active:scale-[0.98] transition-transform mx-auto"
                style={{ aspectRatio: '16/9', willChange: 'transform' }}
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                <div
                  className="relative w-full h-full preserve-3d transition-transform duration-500"
                  style={{ transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                  {/* FRONT Card — Main visible side */}
                  <div className="absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-[#d4af37]/30">
                    <img
                      src={resolveImageUrl("/New-Samadhan-Shoe-Mart/New-Card.jpg")}
                      alt="New Samadhan Shoes Mart Visiting Card Front"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    {/* Hover expand indicator */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                      <span className="bg-black/75 text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        Tap to Flip
                      </span>
                    </div>
                  </div>

                  {/* BACK Card — Location & contact side */}
                  <div className="absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-[#d4af37]/30 [transform:rotateY(180deg)] bg-white flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-sm font-black text-[#111] mb-1 uppercase tracking-tight">New Samadhan Shoes Mart</p>
                      <p className="text-xs text-gray-600 mb-2">Plot No 29, Santkrupa Niwas, Factory Rd, Nashik</p>
                      <a href="tel:+919423228843" className="text-[#d4af37] font-black text-sm block hover:underline">📞 94232 28843</a>
                      <a href="tel:+918888644021" className="text-[#d4af37] font-black text-xs block mt-0.5 hover:underline">📞 88886 44021</a>
                      <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Since 1998 • Name is Quality</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card controls */}
              <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d4af37] animate-pulse">
                  {isCardFlipped ? '← BACK' : 'TAP TO FLIP →'}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFullScreenModal('visitingCard'); }}
                  className="text-[10px] font-bold text-gray-400 hover:text-white uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 size={11} /> Full Screen
                </button>
                <a
                  href="tel:+919423228843"
                  className="text-[10px] font-bold text-[#d4af37] hover:underline flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  📞 Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FULL SCREEN MODAL VIEWER (Main Card / Visiting Card)
          ======================================================== */}
      {fullScreenModal && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setFullScreenModal(null)}
        >
          <button
            onClick={() => setFullScreenModal(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all z-50 cursor-pointer shadow-xl"
            title="Close Full Screen"
          >
            <X size={24} />
          </button>

          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {fullScreenModal === 'heroShoe' && (
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-4">
                  ULTRA HIGH RESOLUTION VIEW // AERO-GLIDE LUXE
                </span>
                <div className="relative max-w-3xl w-full aspect-[4/3] flex items-center justify-center">
                  <img
                    src={resolveImageUrl('/New-Samadhan-Shoe-Mart/Main-Shoe.png')}
                    alt="Full Screen Hero Shoe"
                    className="max-w-full max-h-[70vh] object-contain drop-shadow-[0_60px_50px_rgba(212,175,55,0.25)] hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => {
                      setFullScreenModal(null);
                      const el = document.getElementById('immersive-3d-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#d4af37] text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    Open 3D Spatial Inspector
                  </button>
                  <button
                    onClick={() => setFullScreenModal(null)}
                    className="bg-white/10 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
                  >
                    Close Full Screen
                  </button>
                </div>
              </div>
            )}

            {fullScreenModal === 'visitingCard' && (
              <div className="flex flex-col items-center text-center w-full">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-3">
                  NEW SAMADHAN SHOES MART • OFFICIAL VISITING CARD
                </span>

                {/* Zoom Controls Bar */}
                <div className="flex items-center gap-2 mb-4 bg-black/75 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md shadow-lg">
                  <button
                    type="button"
                    onClick={() => setCardZoom(prev => Math.max(1, +(prev - 0.5).toFixed(1)))}
                    disabled={cardZoom <= 1}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-black text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white transition-colors cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-xs font-mono font-bold text-white px-2">
                    {Math.round(cardZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setCardZoom(prev => Math.min(3, +(prev + 0.5).toFixed(1)))}
                    disabled={cardZoom >= 3}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-black text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white transition-colors cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <div className="h-4 w-px bg-white/20 mx-1" />
                  <button
                    type="button"
                    onClick={() => setCardZoom(1)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                    title="Reset Zoom (100%)"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>

                {/* Front card only in fullscreen with zoom and pan capability */}
                <div
                  className="w-full max-w-3xl mx-auto rounded-2xl overflow-auto border-2 border-[#d4af37]/50 shadow-2xl bg-white max-h-[70vh] cursor-grab active:cursor-grabbing p-1"
                  onWheel={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      e.preventDefault();
                      if (e.deltaY < 0) setCardZoom(prev => Math.min(3, +(prev + 0.2).toFixed(1)));
                      else setCardZoom(prev => Math.max(1, +(prev - 0.2).toFixed(1)));
                    }
                  }}
                  onDoubleClick={() => setCardZoom(prev => prev === 1 ? 2 : 1)}
                  title="Double-click to toggle zoom, or use buttons above"
                >
                  <div
                    style={{
                      transform: `scale(${cardZoom})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)'
                    }}
                  >
                    <img
                      src={resolveImageUrl('/New-Samadhan-Shoe-Mart/New-Card.jpg')}
                      alt="New Samadhan Shoes Mart Visiting Card"
                      className="w-full h-auto object-cover select-none pointer-events-none"
                      loading="eager"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  <a
                    href="tel:+919423228843"
                    className="bg-[#d4af37] text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    📞 Call: 9423228843
                  </a>
                  <button
                    onClick={() => { setFullScreenModal(null); setCardZoom(1); }}
                    className="bg-white/10 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {fullScreenModal === 'product' && fullScreenProduct && (
              <div className="flex flex-col items-center text-center w-full">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-4">
                  {fullScreenProduct.category || 'Atelier Vault'} // {fullScreenProduct.name}
                </span>
                <div className="relative max-w-3xl w-full aspect-[4/3] flex items-center justify-center bg-white/5 rounded-3xl p-6 border border-white/10">
                  <img
                    src={resolveImageUrl(fullScreenProduct.images?.[0] || fullScreenProduct.image || '/New-Samadhan-Shoe-Mart/Main-Shoe.png')}
                    alt={fullScreenProduct.name}
                    className="max-w-full max-h-[65vh] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => {
                      setFullScreenModal(null);
                      setModalProduct(fullScreenProduct);
                    }}
                    className="bg-[#d4af37] text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    View Specs & Sizes
                  </button>
                  <button
                    onClick={() => setFullScreenModal(null)}
                    className="bg-white/10 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          PRODUCT DETAIL MODAL / QUICK VIEW DRAWER
          ======================================================== */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Image Preview & Gallery */}
              <div>
                <div className="aspect-square bg-[#faf9f6] rounded-2xl p-8 flex items-center justify-center mb-4 border border-black/5 relative group">
                  <img
                    src={resolveImageUrl(
                      modalProduct.images?.[modalImageIndex] || modalProduct.image || '/New-Samadhan-Shoe-Mart/Main-Shoe.png'
                    )}
                    alt={modalProduct.name}
                    className="w-full h-full object-contain drop-shadow-[0_25px_20px_rgba(0,0,0,0.18)]"
                  />
                  <button
                    onClick={() => {
                      setFullScreenProduct(modalProduct);
                      setFullScreenModal('product');
                    }}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-gray-700 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View Fullscreen"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>

                {/* Thumbnails */}
                {modalProduct.images && modalProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {modalProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setModalImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl border p-1 bg-[#faf9f6] shrink-0 transition-all cursor-pointer ${
                          modalImageIndex === idx ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30' : 'border-black/10'
                        }`}
                      >
                        <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Specifications & Order Actions */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] block mb-2">
                  {modalProduct.category || modalProduct.collection || 'Atelier Signature'}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111] mb-2">
                  {modalProduct.name}
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex text-[#d4af37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">{modalProduct.rating || 4.8} / 5</span>
                  <span className="text-xs text-gray-400">(124 Customer Reviews)</span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-black text-[#111111]">₹{modalProduct.price?.toLocaleString() || 0}</span>
                  <span className="text-sm text-gray-400 line-through">₹{(Math.round((modalProduct.price || 0) * 1.45)).toLocaleString()}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                  {modalProduct.description || 'Premium lightweight footwear designed for everyday comfort and modern style.'}
                </p>

                {/* Features List */}
                <div className="space-y-1.5 mb-6 text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-2"><Check size={14} className="text-[#d4af37]" /> Lightweight construction</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-[#d4af37]" /> Comfortable anatomical sole</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-[#d4af37]" /> Breathable material</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-[#d4af37]" /> Durable high-grip design</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-[#d4af37]" /> Everyday styling</div>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-900 block mb-2">
                    SELECT SIZE (IND/UK):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(modalProduct.sizes || [6, 7, 8, 9, 10]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setModalSize(sz)}
                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          modalSize === sz
                            ? 'bg-[#111111] text-[#d4af37] border-2 border-black'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-black/5">
                  <button
                    onClick={() => {
                      handleAddToCart(modalProduct, modalSize, modalQty);
                      setModalProduct(null);
                    }}
                    className="py-3.5 rounded-full bg-[#111111] text-white text-xs font-black uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShoppingBag size={15} /> ADD TO CART
                  </button>

                  <a
                    href={`https://wa.me/919423228843?text=${encodeURIComponent(`Hello New Samadhan Shoe Mart, I would like to order: ${modalProduct.name} (Size: UK/IND ${modalSize}, Price: ₹${modalProduct.price?.toLocaleString()}). Please confirm availability.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 rounded-full bg-[#25D366] text-black hover:bg-[#1ebe5d] hover:text-white text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare size={15} /> WHATSAPP
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const pId = modalProduct._id || modalProduct.id;
                    setModalProduct(null);
                    navigate(`/product/${pId}`);
                  }}
                  className="w-full mt-3 py-3 rounded-full border border-black/20 text-[#111111] hover:bg-[#faf9f6] hover:border-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  View Full Product Page Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          WRITE REVIEW MODAL
          ======================================================== */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center text-gray-600 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] block mb-1">
              SHARE YOUR EXPERIENCE
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111] mb-5">
              Write a Verified Review
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewFormData.name}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, name: e.target.value })}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="e.g. Rahul Patil"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-black/10 text-sm focus:outline-none focus:border-[#d4af37] text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                    Your City:
                  </label>
                  <input
                    type="text"
                    value={reviewFormData.city}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, city: e.target.value })}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="e.g. Nashik"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-black/10 text-sm focus:outline-none focus:border-[#d4af37] text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                  Star Rating:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setReviewFormData({ ...reviewFormData, rating: st })}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={st <= reviewFormData.rating ? "text-[#d4af37] fill-[#d4af37]" : "text-gray-300"}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-gray-600 ml-2 self-center">{reviewFormData.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                  Your Review / Feedback:
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewFormData.comment}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Tell us about the comfort, leather finish, sole grip, sizing..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/10 text-sm focus:outline-none focus:border-[#d4af37] text-gray-900 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#111111] text-white text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send size={15} /> SUBMIT VERIFIED REVIEW
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          LIVE TOAST NOTIFICATION
          ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50 bg-[#111111] text-white border border-[#d4af37] px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-[90vw]">
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping shrink-0" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default HomePage;
