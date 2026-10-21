import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import { getProductById } from '../utils/productUtils';
import { resolveImageUrl } from '../utils/urlConfig';
import Reviews from '../components/Reviews';
import ShoeViewer from '../components/ShoeViewer';
import {
  Star,
  ChevronLeft,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  Zap,
  Check,
  Maximize2,
  Layers,
  Box,
  CreditCard,
  Smartphone,
  HelpCircle,
  Shield,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const { loading, request } = useFetch();

  const containerRef = useRef(null);
  const mainShoeRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id, request);
        if (data) {
          // Add default technology and professions if missing
          const enhancedData = {
            ...data,
            technology: data.technology || ["Arch-Support Matrix", "Dual-Density Foam", "High-Traction Outsole"],
            concerns: data.concerns || ["Heel Comfort", "Flat Feet", "General Orthopedic Support"],
            professions: data.professions || ["Corporate Professionals", "Healthcare / Medical", "Hospitality Staff"],
            rating: data.rating || 5.0,
            numReviews: data.numReviews || Math.floor(Math.random() * 50) + 10
          };
          setProduct(enhancedData);

          if (enhancedData.sizes && enhancedData.sizes.length > 0) {
            setSelectedSize(enhancedData.sizes[0]);
          } else {
            enhancedData.sizes = [7, 8, 9, 10, 11];
            setSelectedSize(7);
          }
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      }
    };
    fetchProduct();
  }, [id, request]);

  // GSAP ANIMATIONS
  useEffect(() => {
    if (product) {
      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        // Entrance reveal for content
        gsap.from('.reveal-item', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });

        if (mainShoeRef.current) {
          // 1. Initial Main Shoe Reveal - High-End "Macro-to-Micro" Entrance
          gsap.from(mainShoeRef.current, {
            x: 1000,
            y: -200,
            rotationY: -180,
            rotationX: 45,
            z: -2000,
            opacity: 0,
            duration: 3,
            ease: "expo.out"
          });

          // 2. Ambient Floating - Organic "Breath" Motion
          gsap.to(mainShoeRef.current, {
            y: "+=25",
            x: "+=15",
            rotationZ: "+=2",
            rotationY: "+=6",
            rotationX: "+=3",
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });

          // 3. ADVANCED SCROLL SEQUENCE - Refined 3D Path
          mm.add({
            isDesktop: "(min-width: 1280px)",
            isTablet: "(min-width: 768px) and (max-width: 1279px)",
            isMobile: "(max-width: 767px)"
          }, (context) => {
            const { isDesktop, isTablet, isMobile } = context.conditions;

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: isMobile ? 0.6 : 1.8,
                invalidateOnRefresh: true
              }
            });

            tl
            // PHASE 1: The "Gallery" View (Bezier Waypoint 1)
            .to(mainShoeRef.current, {
              x: isDesktop ? '-42vw' : (isTablet ? '-35vw' : '0vw'),
              y: isDesktop ? '12vh' : (isTablet ? '10vh' : '15vh'),
              rotationY: -15,
              rotationX: 5,
              rotationZ: -5,
              z: isDesktop ? 800 : (isTablet ? 400 : 200),
              scale: isDesktop ? 1.25 : (isTablet ? 1.1 : 1),
              opacity: 0.9,
              filter: `brightness(1.2) contrast(1.1) drop-shadow(0 ${isDesktop ? '100px 150px' : '60px 100px'} ${theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(139,0,0,0.3)'})`,
              ease: "power2.inOut"
            })
            .to(".tech-node-1", { opacity: 1, x: 0, scale: 1, duration: 1 }, "-=0.8")

            // PHASE 2: The "Sole Inspection" (Bezier Waypoint 2 - Curved Transition)
            .to(mainShoeRef.current, {
              x: isDesktop ? '12vw' : (isTablet ? '8vw' : '0vw'),
              y: isDesktop ? '40vh' : (isTablet ? '35vh' : '30vh'),
              rotationX: 175,
              rotationY: -25,
              rotationZ: 35,
              z: isDesktop ? 1500 : (isTablet ? 800 : 400),
              scale: isDesktop ? 1.6 : (isTablet ? 1.3 : 1.1),
              filter: `brightness(0.9) contrast(1.4) drop-shadow(0 ${isDesktop ? '180px 250px' : '90px 150px'} rgba(0,0,0,0.9))`,
              ease: "power2.inOut"
            })
            .to(".tech-node-2", { opacity: 1, x: 0, scale: 1, duration: 1 }, "-=0.8")

            // PHASE 3: The "Macro Texture" Exit (Hyper-Zoom)
            .to(mainShoeRef.current, {
              x: isDesktop ? '-20vw' : (isTablet ? '-15vw' : '0vw'),
              y: isDesktop ? '85vh' : (isTablet ? '75vh' : '70vh'),
              rotationX: -45,
              rotationY: 60,
              rotationZ: -10,
              z: isDesktop ? 6000 : (isTablet ? 3000 : 1500),
              scale: isDesktop ? 25 : (isTablet ? 15 : 8),
              opacity: 0,
              filter: 'brightness(2) contrast(1.5)',
              force3D: true,
              ease: "power4.in"
            });
          });

        }
      }, containerRef);

      return () => {
        ctx.revert();
        mm.revert();
      };
    }
  }, [product]);

  const sanitizePrice = (rawPrice) => {
    if (typeof rawPrice === 'number') return rawPrice;
    if (typeof rawPrice === 'string') {
      const clean = parseInt(rawPrice.replace(/[^\d]/g, ''));
      return isNaN(clean) ? 0 : clean;
    }
    return 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select your size first!");
      return;
    }

    // Flying Shoe Animation
    const shoeImg = document.querySelector('.main-product-image');
    const cartIcon = document.querySelector('.cart-icon-target');

    if (shoeImg && cartIcon) {
      const clone = shoeImg.cloneNode(true);
      const rect = shoeImg.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      Object.assign(clone.style, {
        position: 'fixed',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: 1000,
        pointerEvents: 'none'
      });

      document.body.appendChild(clone);

      gsap.to(clone, {
        top: cartRect.top,
        left: cartRect.left,
        width: 40,
        height: 40,
        opacity: 0.5,
        rotation: 360,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          document.body.removeChild(clone);
          addToCart(product, quantity, selectedSize);
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);

          // Cart Bounce
          gsap.fromTo('.cart-icon-target',
            { scale: 1 },
            { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }
          );
        }
      });
    } else {
      addToCart(product, quantity, selectedSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWhatsAppOrder = () => {
    const cleanPrice = sanitizePrice(product?.price);
    const total = cleanPrice * quantity;
    const customerName = user?.name || 'Valued Shopper';
    const message = `Hello New Samadhan Shoe Mart! 👟\n\nI want to order this Masterpiece:\n\n*Product:* ${product?.name}\n*Brand:* ${product?.brand || 'New Samadhan'}\n*Quantity:* ${quantity}\n*Size:* ${selectedSize || 'Standard'}\n*Price:* ₹${(cleanPrice || 0).toLocaleString()}\n*Total Amount:* ₹${(total || 0).toLocaleString()}\n\n*--- CUSTOMER DETAILS ---*\n*Name:* ${customerName}\n*Contact:* ${user?.phone || 'Not Provided'}\n*Address:* ${user?.address || 'Nashik Store / Delivery'}\n*City:* ${user?.city || 'Nashik'}\n*Pincode:* ${user?.pincode || '422003'}\n\n*--- ORDER METADATA ---*\n*Ref ID:* #NSSM-${Math.floor(100000 + Math.random() * 900000)}\n\nPlease confirm availability and share payment details.`;

    const encodedMsg = encodeURIComponent(message);

    // Dual Shopkeeper Protocol - Load Balancing
    const shopNumbers = ["919423228843", "918888644021"];
    const targetNum = shopNumbers[Math.floor(Math.random() * shopNumbers.length)];

    window.open(`https://wa.me/${targetNum}?text=${encodedMsg}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
       <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-8"></div>
       <p className="text-[var(--text-secondary)] font-bold tracking-[0.5em] uppercase text-[10px]">Loading Masterpiece...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] pt-32 pb-24 text-center px-6">
      <h2 className="text-3xl font-editorial font-bold uppercase text-[var(--text-primary)] mb-4">Masterpiece Not Found</h2>
      <button onClick={() => navigate('/products')} className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-2xl text-xs font-bold uppercase tracking-widest">
        Return to Catalog
      </button>
    </div>
  );

  const displayImages = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image ? [product.image] : [resolveImageUrl('/Shoes.png')]);

  const cleanPrice = sanitizePrice(product?.price);

  return (
    <div
      className="bg-[var(--bg-primary)] min-h-[300vh] relative text-[var(--text-primary)] overflow-x-hidden pt-32 pb-20 no-blur-zone transition-colors duration-500"
      ref={containerRef}
    >
      {/* 3D/GSAP FLOATING HERO SHOE */}
      <div
        ref={mainShoeRef}
        className="fixed top-1/4 right-[5%] w-[45vw] max-w-[800px] z-0 hidden md:block pointer-events-none"
        style={{
            perspective: '2000px',
            transformStyle: 'preserve-3d',
            filter: theme === 'dark' ? 'drop-shadow(0 150px 250px rgba(0,0,0,0.8))' : 'drop-shadow(0 120px 200px rgba(139,0,0,0.2))'
        }}
      >
        {product?.model3D ? (
          <div className="w-full h-[600px] pointer-events-auto">
             <ShoeViewer modelUrl={resolveImageUrl(product.model3D)} />
          </div>
        ) : null}
      </div>

      <div className="container mx-auto max-w-[1440px] px-6 md:px-12 relative z-10">

        {/* BREADCRUMB */}
        <div className="flex justify-between items-center mb-16 reveal-item">
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
                <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-sm">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="font-black text-[10px] uppercase tracking-[0.3em]">Back to catalog</span>
            </button>
            <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-color)] shadow-sm text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
               <ShieldCheck size={14} className="text-emerald-500" /> Authenticity Verified • Nashik Atelier
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-16 xl:gap-24 items-start">

          {/* LEFT: STATIC IMAGE VIEWER */}
          <div className="lg:col-span-7 reveal-item w-full">
            <div className="relative aspect-square md:aspect-[4/3] bg-[var(--bg-secondary)] rounded-[3rem] overflow-hidden border border-[var(--border-color)] shadow-xl flex items-center justify-center p-4 md:p-12 transition-all duration-500 group">
              <div className="absolute top-8 left-8 z-20">
                <span className="bg-[var(--accent)] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {product?.category || 'Premium Collection'}
                </span>
              </div>
              <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={resolveImageUrl(displayImages[activeImage])}
                    alt={product?.name}
                    loading="lazy"
                    className="main-product-image w-[90%] md:w-[85%] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-110"
                  />
              </div>
            </div>

            <div className="mt-8 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-3xl overflow-hidden border-2 transition-all p-2 bg-[var(--bg-secondary)] snap-center ${activeImage === i ? 'border-[var(--accent)] shadow-xl scale-105' : 'border-[var(--border-color)] opacity-60 hover:opacity-100'}`}
                >
                  <img src={resolveImageUrl(img)} alt={`View ${i}`} className="w-full h-full object-contain rounded-2xl" />
                </button>
              ))}
            </div>

            {/* PRODUCT STORY SECTION */}
            <div className="mt-12 bg-[var(--bg-secondary)] rounded-[3rem] p-8 md:p-12 border border-[var(--border-color)] shadow-sm reveal-item">
                <h3 className="text-2xl font-editorial font-black text-[var(--text-primary)] mb-8 tracking-tighter uppercase flex items-center gap-4">
                  <ShieldCheck size={24} className="text-[var(--accent)]" /> Artisan Craftsmanship
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">The Material</h4>
                        <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium italic">
                          Selected from the finest full-grain hides, each pair is hand-cut and inspected for natural character and enduring quality.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">The Build</h4>
                        <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium italic">
                          Featuring our signature comfort-last technology, designed to provide superior arch support and a perfect fit from day one.
                        </p>
                    </div>
                    <div className="md:col-span-2 pt-8 border-t border-[var(--border-color)] mt-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                         <div>
                           <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-4">Perfect For</h4>
                           <div className="flex flex-wrap gap-2">
                              {product.purpose?.map((p, idx) => (
                                <span key={idx} className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-[9px] font-bold text-[var(--text-primary)] uppercase tracking-widest">
                                  {p}
                                </span>
                              ))}
                           </div>
                         </div>
                         <div>
                           <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-4">Care Instructions</h4>
                           <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed">
                             Apply neutral polish periodically and store in the provided dust bags for a lifetime of elegance.
                           </p>
                         </div>
                       </div>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-10 reveal-item w-full sticky top-32">
            <div className="bg-[var(--bg-secondary)] p-8 md:p-16 rounded-[4rem] border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl"></div>

              <div className="flex items-center gap-4 mb-6">
                 <div className="flex text-[var(--accent)]">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product?.rating || 5) ? "currentColor" : "none"} />)}
                 </div>
                 <span className="text-[var(--text-secondary)] font-bold text-[9px] uppercase tracking-[0.2em]">{product?.rating || '5.0'} Elite Rating</span>
                 <div className="h-4 w-px bg-[var(--border-color)] mx-2"></div>
                 <span className="text-[var(--text-secondary)] font-bold text-[9px] uppercase tracking-[0.2em]">{product?.numReviews || 0} Reviews</span>
                 <button
                   onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                   className="ml-auto text-[9px] font-black text-[var(--accent)] uppercase tracking-widest border border-[var(--accent)]/20 px-3 py-1 rounded-full hover:bg-[var(--accent)] hover:text-white transition-all"
                 >
                   Sync Reviews
                 </button>
              </div>

              <h1 className="text-4xl md:text-6xl font-editorial font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase leading-[0.9]">
                {product?.name}
              </h1>

              <p className="text-[var(--text-secondary)] font-medium leading-relaxed text-sm md:text-lg italic border-l-4 border-[var(--accent)] pl-6 mb-10">
                "{product?.description}"
              </p>

              <div className="space-y-8 mb-12 pt-8 border-t border-[var(--border-color)]">
                 <div className="flex flex-col sm:flex-row sm:items-end gap-8">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-3">Market Valuation</span>
                       <span className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter tabular-nums">₹{(cleanPrice * quantity).toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-3">Quantity</span>
                        <div className="flex items-center border-2 border-[var(--border-color)] rounded-2xl overflow-hidden bg-[var(--bg-primary)] w-fit">
                           <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] text-[var(--text-primary)] font-bold text-xl transition-colors">-</button>
                           <span className="px-6 py-3 font-bold text-xl border-x-2 border-[var(--border-color)] min-w-[70px] text-center">{quantity}</span>
                           <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] text-[var(--text-primary)] font-bold text-xl transition-colors">+</button>
                        </div>
                    </div>
                 </div>

                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Vault Fit (UK/IN)</span>
                       <button className="text-[9px] font-bold text-[var(--accent)] underline uppercase flex items-center gap-2">Size Guide <HelpCircle size={14} /></button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {product?.sizes?.map((size) => (
                          <button
                             key={size}
                             onClick={() => setSelectedSize(size)}
                             className={`w-14 h-14 rounded-2xl font-black text-sm border-2 transition-all hover:scale-105 active:scale-95 ${selectedSize === size ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] shadow-[0_10px_20px_rgba(0,0,0,0.2)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent)]/30'}`}
                          >
                             {size}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="bg-[#111111]/[0.02] p-6 rounded-3xl border border-black/5">
                    <h4 className="text-[8px] font-black uppercase tracking-[0.3em] mb-4 text-[#d4af37]">Technical Specifications</h4>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {product.technology?.map((tech, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                <div className="w-1 h-1 bg-[#d4af37] rounded-full"></div> {tech}
                            </li>
                        ))}
                    </ul>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <button
                   onClick={handleAddToCart}
                   className={`py-7 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 group border-2 ${added ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white text-black border-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black'}`}
                 >
                    {added ? <CheckCircle size={20} /> : <ShoppingBag size={20} className="cart-icon-target" />} {added ? 'Secured in Bag' : 'Add to Collection'}
                 </button>
                 <button
                   onClick={handleWhatsAppOrder}
                   className="bg-emerald-500 text-white border-2 border-emerald-400 py-7 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-4 sm:col-span-2"
                 >
                    <MessageCircle size={22} /> Instant Checkout via WhatsApp
                 </button>
              </div>
            </div>

            {/* BRAND PILLARS */}
            <div className="grid grid-cols-1 gap-6 reveal-item">
              {[
                { icon: ShieldCheck, title: "Authentic Heritage", text: "Direct from the Nashik workshop. Selective full-grain hides." },
                { icon: Layers, title: "Dual-Density Sole", text: "Engineered for 18-hour deployment. Shock absorption." },
                { icon: RefreshCw, title: "Lifetime Polish", text: "Complimentary refurbishing for all premium leather collections." }
              ].map((item, i) => (
                <div key={i} className="bg-[var(--bg-secondary)] p-8 rounded-[3rem] border border-[var(--border-color)] hover:shadow-xl transition-all group flex items-start gap-6">
                  <div className="shrink-0 w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-lg font-editorial font-black uppercase tracking-tight mb-2">{item.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* PAYMENT EXPLANATION */}
            <div className="bg-[var(--bg-secondary)] rounded-[4rem] p-12 text-[var(--text-primary)] relative overflow-hidden shadow-2xl border border-[var(--border-color)]">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <CreditCard size={120} />
                </div>
                <h3 className="text-2xl font-editorial font-black tracking-tighter mb-10 flex items-center gap-4 relative z-10">
                   <Smartphone className="text-[var(--accent)]" /> TRANSACTION PROTOCOL
                </h3>

                <div className="space-y-10 relative z-10">
                    {[
                        { step: '01', title: 'INITIATE ORDER', desc: 'Add to bag or click WhatsApp to start your inquiry with our master craftsmen.' },
                        { step: '02', title: 'PAYMENT GATEWAY', desc: 'We will share a secure UPI QR or Payment Link via WhatsApp for verified checkout.' },
                        { step: '03', title: 'EXPRESS DISPATCH', desc: 'Once verified, your order is dispatched from our Nashik atelier within 4-6 hours.' }
                    ].map((step, i) => (
                        <div key={i} className="flex gap-6 group">
                            <span className="text-4xl font-black text-[var(--text-primary)]/5 group-hover:text-[var(--accent)] transition-colors duration-500 leading-none">{step.step}</span>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{step.title}</h4>
                                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-[#d4af37]/5 rounded-3xl border border-[#d4af37]/20 flex items-center gap-6 group">
                   <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#d4af37] mb-1">SECURE WHATSAPP ESCROW</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Your payment is only processed after a human expert verifies your size & stock.</p>
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SYSTEM */}
        <div id="reviews-section" className="reveal-item mt-24">
          <Reviews productId={product.id || product._id} isAdmin={user?.role === 'admin'} />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
