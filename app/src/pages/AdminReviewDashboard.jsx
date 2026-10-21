import React, { useState, useEffect } from 'react';
import { Trash2, Search, Star, MessageSquare, ArrowLeft, Filter, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getReviews, deleteReview, syncReviewsWithServer } from '../utils/reviewService';
import localProducts from '../utils/localProducts';
import gsap from 'gsap';

const AdminReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const loadReviews = () => {
    const data = getReviews();
    setReviews(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadReviews();
    syncReviewsWithServer().then(() => loadReviews()).catch(() => {});

    window.addEventListener('reviews_updated', loadReviews);

    let bc;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('samadhan_reviews_channel');
        bc.onmessage = () => loadReviews();
      }
    } catch (_) {}

    const interval = setInterval(() => {
      syncReviewsWithServer().then(() => loadReviews()).catch(() => {});
    }, 8000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('reviews_updated', loadReviews);
      try { bc?.close(); } catch (_) {}
    };
  }, []);

  const getProductInfo = (id) => {
    const demoProducts = JSON.parse(localStorage.getItem('ssm_demo_products') || '[]');
    const allProducts = [...localProducts, ...demoProducts];
    const p = allProducts.find(prod => String(prod.id) === String(id) || String(prod._id) === String(id));
    return p || { name: 'Unknown Product', category: 'N/A' };
  };

  const getProductName = (id) => getProductInfo(id).name;
  const getProductCategory = (id) => getProductInfo(id).category;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently remove this review across all devices?")) {
      await deleteReview(id);
      loadReviews();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const filteredReviews = (Array.isArray(reviews) ? reviews : []).filter(rev => {
    const productName = getProductName(rev.productId) || '';
    const matchesSearch =
      (rev.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rev.review || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || getProductCategory(rev.productId) === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: reviews.length,
    avg: reviews.length ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0,
    fiveStar: reviews.filter(r => r.rating === 5).length
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
            <h1 className="text-5xl font-editorial font-black uppercase tracking-tighter text-[#111]">Review Management</h1>
          </div>

          <div className="flex gap-4">
             <div className="bg-white px-8 py-6 rounded-[2rem] border border-[#111]/5 shadow-sm">
                <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-1">Total Reviews</span>
                <span className="text-3xl font-black text-[#111]">{stats.total}</span>
             </div>
             <div className="bg-white px-8 py-6 rounded-[2rem] border border-[#111]/5 shadow-sm">
                <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-1">Avg Rating</span>
                <span className="text-3xl font-black text-[#8B0000]">{stats.avg}★</span>
             </div>
          </div>
        </div>

        {success && (
          <div className="bg-[#8B0000] text-white p-6 rounded-[2.5rem] mb-12 flex items-center shadow-xl border-4 border-white animate-in zoom-in-95 no-blur-zone">
            <CheckCircle className="w-8 h-8 mr-4" />
            <div>
              <p className="font-black uppercase tracking-widest text-lg">Update Successfull</p>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Review database has been synchronized successfully.</p>
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div className="bg-white p-8 rounded-[3rem] border border-[#111]/5 shadow-xl mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
            <input
              type="text"
              placeholder="Search by customer, product, or content..."
              className="w-full bg-[#F7F5F0] border-0 rounded-2xl py-4 pl-16 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#8B0000]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter size={20} className="text-[#6B6B6B]" />
            <select
              className="bg-[#F7F5F0] border-0 rounded-2xl py-4 px-8 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Sneakers">Sneakers</option>
              <option value="Formal">Formal</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
        </div>

        {/* REVIEWS TABLE/LIST */}
        <div className="space-y-6">
          {Array.isArray(filteredReviews) && filteredReviews.length > 0 ? (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-10 rounded-[3rem] border border-[#111]/5 shadow-sm hover:shadow-md transition-all">
                <div className="grid md:grid-cols-4 gap-8 items-center">
                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Product</span>
                    <h6 className="font-bold text-[#111] uppercase tracking-tight line-clamp-1">{getProductName(rev.productId)}</h6>
                    <span className="text-[8px] bg-[#F7F5F0] px-2 py-1 rounded text-[#6B6B6B] font-bold uppercase">{getProductCategory(rev.productId)}</span>
                  </div>

                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Customer / Rating</span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#8B0000] text-white rounded-lg flex items-center justify-center text-[10px] font-black">{rev.avatar}</div>
                      <div>
                        <p className="font-bold text-sm text-[#111]">{rev.name}</p>
                        <div className="flex text-[#8B0000]">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Review Content</span>
                    <p className="text-xs text-[#6B6B6B] italic line-clamp-2">"{rev.review}"</p>
                  </div>

                  <div className="col-span-1 flex justify-end gap-4">
                    <button
                      onClick={() => navigate(`/product/${rev.productId}`)}
                      className="px-6 py-3 bg-[#111] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#8B0000] transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-3 text-[#8B0000] border border-[#8B0000]/20 rounded-xl hover:bg-[#8B0000] hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-32 text-center rounded-[4rem] border border-dashed border-[#111]/10">
              <MessageSquare size={64} className="mx-auto text-[#111]/5 mb-8" />
              <h5 className="text-2xl font-editorial font-black uppercase text-[#111]/20">No matching reviews found.</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewDashboard;
