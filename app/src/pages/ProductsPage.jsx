import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { Star, ChevronRight, Sparkles, ShoppingBag, MessageCircle, Filter, Check, PlusCircle, Edit, Trash2, ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '../utils/urlConfig';

import localProducts from '../utils/localProducts';
import { getMergedProducts, CATEGORIES, COLLECTIONS, CONCERNS, PROFESSIONS, PURPOSES } from '../utils/productUtils';
import { calculateProductStats } from '../utils/reviewService';

const ProductsPage = () => {
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, error, request } = useFetch();
  const [products, setProducts] = useState(localProducts);

  const activeCategory = searchParams.get('category') || 'All';
  const activeCollection = searchParams.get('collection') || 'All';
  const activeConcern = searchParams.get('concern') || 'All';
  const activeProfession = searchParams.get('profession') || 'All';
  const activePurpose = searchParams.get('purpose') || 'All';
  const activeType = searchParams.get('type') || ''; // Enhanced to handle "Street Style" etc.

  // PRICE SANITIZER: Handles "₹ 18,500" or undefined
  const sanitizePrice = (rawPrice) => {
    if (typeof rawPrice === 'number') return rawPrice;
    if (typeof rawPrice === 'string') {
      const clean = parseInt(rawPrice.replace(/[^\d]/g, ''));
      return isNaN(clean) ? 0 : clean;
    }
    return 0;
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleWhatsAppOrder = (product) => {
    const cleanPrice = sanitizePrice(product?.price);
    const customerName = user?.name || 'Valued Shopper';
    const message = `Hello New Samadhan Shoe Mart! 👋\n\nI want to order this Masterpiece:\n\n👟 *Product:* ${product?.name}\n🏷️ *Brand:* ${product?.brand || 'New Samadhan'}\n💰 *Price:* ₹${(cleanPrice || 0).toLocaleString()}\n📏 *Size:* To be confirmed\n📦 *Quantity:* 1\n\n--- CUSTOMER DETAILS ---\n👤 *Name:* ${customerName}\n📞 *Phone:* ${user?.phone || 'Not Provided'}\n📍 *Address:* ${user?.address || 'Nashik Store Pickup / Delivery'}\n🏙️ *City:* ${user?.city || 'Nashik'}\n📮 *Pincode:* ${user?.pincode || '422003'}\n\n--- PAYMENT INTENT ---\nI am ready to proceed with online payment or UPI. Please confirm availability and share the payment details.`;

    const encodedMsg = encodeURIComponent(message);
    // Dual Shopkeeper Protocol - Use business numbers 9423228843 or 8888644021
    window.open(`https://wa.me/919423228843?text=${encodedMsg}`, '_blank');
    setTimeout(() => {
      window.open(`https://wa.me/918888644021?text=${encodedMsg}`, '_blank');
    }, 600);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await request('/api/products');
        const allProducts = getMergedProducts(data);
        setProducts(allProducts);
      } catch (err) {
        console.warn("Using local product catalog:", err);
        const allProducts = getMergedProducts([]);
        setProducts(allProducts);
      }
    };
    fetchProducts();

    const handleUpdate = () => fetchProducts();
    window.addEventListener('products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [request]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation for product grid
      gsap.fromTo('.product-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );

      // 3D Tilt Effect - Desktop Only
      if (window.innerWidth >= 1024) {
        gsap.utils.toArray(".product-card-3d").forEach(card => {
          card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            gsap.to(card.querySelector(".card-image-container"), {
              rotateX: rotateX,
              rotateY: rotateY,
              scale: 1.05,
              duration: 0.5,
              ease: "power2.out"
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card.querySelector(".card-image-container"), {
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out"
            });
          });
        });
      }

      // Magnetic Buttons
      const magneticBtns = document.querySelectorAll('.magnetic-btn');
      magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          });
        });
      });
    });
    return () => ctx.revert();
  }, [activeCategory, activeCollection, activeConcern, activeProfession, activePurpose, activeType, products]);

  // Comprehensive filtering
  const filteredProducts = products.filter(p => {
    // 1. Category Filter
    let categoryMatch = activeCategory === 'All';
    if (!categoryMatch) {
      const cat = (p.category || '').toLowerCase();
      const gender = (p.targetGender || '').toLowerCase();
      const name = (p.name || '').toLowerCase();

      if (activeCategory === 'Men') categoryMatch = cat === 'men' || gender === 'men' || cat === 'formal';
      else if (activeCategory === 'Women') categoryMatch = cat === 'women' || gender === 'women' || name.includes('women');
      else if (activeCategory === 'Kids') categoryMatch = cat === 'kids' || gender === 'kids' || name.includes('kid');
      else if (activeCategory === 'Sneakers') categoryMatch = cat === 'sneakers' || name.includes('sneaker');
      else if (activeCategory === 'Formal') categoryMatch = cat === 'formal' || name.includes('derby') || name.includes('oxford');
      else categoryMatch = cat === activeCategory.toLowerCase();
    }

    // 2. Collection Filter (Primary)
    let collectionMatch = activeCollection === 'All';
    if (!collectionMatch) {
      const term = activeCollection.toLowerCase();
      collectionMatch = (p.collection || '').toLowerCase().includes(term) ||
                         (p.name || '').toLowerCase().includes(term) ||
                         (p.category || '').toLowerCase().includes(term);
    }

    // 3. Concern Filter
    let concernMatch = activeConcern === 'All';
    if (!concernMatch) {
      const term = activeConcern.toLowerCase();
      concernMatch = (p.concerns || []).some(c => c.toLowerCase().includes(term));
    }

    // 4. Profession Filter
    let professionMatch = activeProfession === 'All';
    if (!professionMatch) {
      const term = activeProfession.toLowerCase();
      professionMatch = (p.professions || []).some(pr => pr.toLowerCase().includes(term));
    }

    // 5. Purpose Filter
    let purposeMatch = activePurpose === 'All';
    if (!purposeMatch) {
      const term = activePurpose.toLowerCase();
      purposeMatch = (p.purpose || []).some(pu => pu.toLowerCase().includes(term));
    }

    // 6. Type Filter (e.g. from Mega Menu)
    let typeMatch = !activeType;
    if (!typeMatch) {
      const term = activeType.toLowerCase();
      typeMatch = (p.collection || '').toLowerCase().includes(term) ||
                  (p.name || '').toLowerCase().includes(term) ||
                  (p.category || '').toLowerCase().includes(term) ||
                  (p.description || '').toLowerCase().includes(term) ||
                  (p.purpose || []).some(pu => pu.toLowerCase().includes(term));
    }

    return categoryMatch && collectionMatch && concernMatch && professionMatch && purposeMatch && typeMatch;
  });

  return (
    <div className="bg-[#F7F5F0] min-h-screen pt-20 md:pt-32 pb-12 md:pb-24 relative overflow-hidden no-blur-zone">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#8B0000]/5 rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Clean Luxury Header */}
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="px-5 py-2 bg-white/70 border border-[#111111]/5 text-[#8B0000] text-[10px] font-black uppercase tracking-[0.4em] rounded-full flex items-center gap-2 shadow-sm">
               <Sparkles size={12} /> Established 1990 · Nashik Atelier
            </div>
          </div>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-editorial font-black mb-6 tracking-tighter uppercase leading-none bg-gradient-to-r from-[#111111] via-[#8B0000] to-[#111111] bg-clip-text text-transparent">
            The Collection.
          </h1>

          {isAdmin && (
            <div className="flex justify-center mb-8">
              <button
                onClick={() => navigate(`/admin/product/new?category=${activeCategory !== 'All' ? activeCategory : 'Formal'}`)}
                className="bg-[#8B0000] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center shadow-xl shadow-red-100"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add New {activeCategory !== 'All' ? activeCategory : 'Product'}
              </button>
            </div>
          )}
          <p className="text-[#6B6B6B] text-[11px] font-bold uppercase tracking-[0.5em] max-w-xl mx-auto leading-loose italic">
            "Artisanal Footwear Crafted with 34 Years of Dedication"
          </p>

          {/* Simplified Collection Filter Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-10 flex-wrap">
            {COLLECTIONS.filter(c => c !== 'All').map(col => {
              const isActive = activeCollection === col;
              return (
                <button
                  key={col}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (isActive) params.delete('collection');
                    else params.set('collection', col);
                    setSearchParams(params);
                  }}
                  className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border ${
                    isActive
                      ? 'bg-[#111111] text-white border-[#111111] shadow-xl scale-105'
                      : 'bg-white text-[#6B6B6B] hover:text-[#111111] border-[#111111]/5 hover:border-[#8B0000]/30'
                  }`}
                >
                  {col}
                </button>
              );
            })}
          </div>

          {/* Categories Secondary Filter */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap opacity-80">
            {CATEGORIES.filter(c => c !== 'All').map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (isActive) params.delete('category');
                    else params.set('category', cat);
                    setSearchParams(params);
                  }}
                  className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-[#8B0000] text-white shadow-md'
                      : 'bg-white/60 text-slate-500 border border-transparent hover:border-[#8B0000]/20'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <div className="w-16 h-16 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(139,0,0,0.1)]"></div>
             <p className="text-[#6B6B6B] font-bold tracking-[0.5em] uppercase text-[10px]">Accessing Vault Catalog...</p>
          </div>
        ) : (filteredProducts && filteredProducts.length > 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const cleanPrice = sanitizePrice(product?.price);
              const prodId = product._id || product.id;
              const prodImage = product?.images?.[0] || product?.image || '/Shoes.png';

              return (
                <div
                  key={prodId}
                  className="product-card product-card-3d group bg-white p-5 rounded-[2.5rem] overflow-hidden border border-[#111111]/5 hover:border-[#8B0000]/30 transition-all duration-500 shadow-md hover:shadow-2xl flex flex-col justify-between relative"
                  style={{ perspective: '1000px' }}
                >
                  {/* Heritage Expert Pick Badge */}
                  {(product.rating >= 4.9 || product.collection === 'Limited Edition' || product.concerns?.length > 0) && (
                    <div className="absolute top-8 right-8 z-20 pointer-events-none" style={{ transform: 'translateZ(100px)' }}>
                       <div className="bg-[#8B0000] text-white text-[7px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 animate-pulse border border-white/20">
                          <Sparkles size={8} /> Expert Pick
                       </div>
                    </div>
                  )}

                  <div
                    className="card-image-container relative overflow-hidden aspect-square rounded-[2rem] cursor-pointer bg-[#F7F5F0] flex items-center justify-center p-6"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => handleProductClick(prodId)}
                  >
                    <img
                      src={resolveImageUrl(prodImage)}
                      alt={product?.name}
                      className="w-full h-full object-contain transform scale-95 group-hover:scale-110 transition-transform duration-700"
                      style={{ transform: 'translateZ(50px)' }}
                      onError={(e) => { e.target.src = '/Shoes.png'; }}
                    />
                    <div className="absolute top-4 left-4" style={{ transform: 'translateZ(60px)' }}>
                      <div className="bg-white/95 px-3.5 py-1 rounded-full text-[9px] font-bold text-[#111111] shadow-sm uppercase tracking-widest border border-[#111111]/5">
                         {product?.brand || 'Samadhan'}
                      </div>
                    </div>
                    {product?.category && (
                      <div className="absolute bottom-4 right-4" style={{ transform: 'translateZ(60px)' }}>
                        <div className="bg-[#111111]/80 px-3 py-1 rounded-full text-[8px] font-bold text-white shadow-sm uppercase tracking-wider">
                           {product.category}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 pb-2">
                    <h3
                      onClick={() => handleProductClick(prodId)}
                      className="text-base font-editorial font-bold text-[#111111] hover:text-[#8B0000] transition-colors mb-2 line-clamp-1 uppercase tracking-tight cursor-pointer"
                    >
                      {product?.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-4 opacity-75">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className={`${i < Math.floor(calculateProductStats(prodId).average || product?.rating || 5) ? 'fill-[#8B0000] text-[#8B0000]' : 'text-[#111111]/15'}`} />
                      ))}
                      <span className="text-[10px] text-[#6B6B6B] font-bold ml-2">({calculateProductStats(prodId).average || product?.rating || '4.9'})</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-[#111111]/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-[#6B6B6B] uppercase tracking-[0.25em] mb-0.5">Price</span>
                        <span className="text-xl font-black text-[#111111] tracking-tight tabular-nums">₹{(cleanPrice || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/product/${prodId}/edit`);
                              }}
                              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-500/20 active:scale-95"
                              title="Edit Product"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('Delete this masterpiece permanently?')) {
                                  const prodIdStr = String(prodId);
                                  // A real MongoDB ID is exactly 24 hex characters.
                                  const isGlobalProduct = /^[0-9a-fA-F]{24}$/.test(prodIdStr);

                                  try {
                                    if (isGlobalProduct) {
                                      await request(`/api/products/${prodId}`, 'DELETE');
                                    }

                                    // Remove from UI state
                                    setProducts(prev => prev.filter(p => (p._id || p.id) !== prodId));

                                    // Remove from local storage cache
                                    const demoProducts = JSON.parse(localStorage.getItem('ssm_demo_products') || '[]');
                                    localStorage.setItem('ssm_demo_products', JSON.stringify(
                                      demoProducts.filter(p => (p._id || p.id) !== prodId)
                                    ));

                                    console.log("Product successfully removed.");
                                  } catch (err) {
                                    console.error("Delete failed:", err);
                                    // If it's NOT a global product, we just remove it from view anyway since it's only local
                                    if (!isGlobalProduct) {
                                       setProducts(prev => prev.filter(p => (p._id || p.id) !== prodId));
                                    } else {
                                       alert('FAILED TO SYNC: The server could not delete this product. It will stay in the catalog until the database is connected. Please check your Vercel/MongoDB connection.');
                                    }
                                  }
                                }
                              }}
                              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-500/20 active:scale-95"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppOrder(product);
                          }}
                          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 active:scale-95"
                          title="Instant WhatsApp Order"
                        >
                          <MessageCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleProductClick(prodId)}
                          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm bg-[#111111] text-white hover:bg-[#8B0000] active:scale-95"
                          title="View Product"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-[#111111]/5 p-16 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#8B0000]/5 rounded-full blur-3xl -z-10"></div>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-[#F7F5F0] rounded-full flex items-center justify-center border border-[#111111]/5">
                <ShoppingBag size={40} className="text-[#8B0000]/20" />
              </div>
            </div>
            <h3 className="text-2xl font-editorial font-black text-[#111111] mb-4 uppercase tracking-tighter">
              Collection Coming Soon.
            </h3>
            <p className="text-[#6B6B6B] font-bold tracking-[0.2em] uppercase text-[10px] mb-10 max-w-md mx-auto leading-relaxed">
              Our artisans are currently handcrafting the next masterpiece for this selection. We are committed to perfection, and this collection will be worth the wait.
            </p>
            <button
              onClick={() => {
                setSearchParams({});
              }}
              className="px-10 py-4 bg-[#111111] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#8B0000] transition-all shadow-xl hover:shadow-red-900/20 active:scale-95 flex items-center gap-3 mx-auto"
            >
              View Full Archive <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
