import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import useFetch from '../hooks/useFetch';
import { Edit, Trash2, Plus, ArrowLeft, Search, Loader2, AlertCircle, Package, Filter, ExternalLink } from 'lucide-react';
import { resolveImageUrl } from '../utils/urlConfig';
import localProducts from '../utils/localProducts';
import { getMergedProducts, deleteCustomProduct } from '../utils/productUtils';

const AdminProductList = () => {
  const { loading, error, request } = useFetch();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dbConnected, setDbConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();
  const listRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const data = await request('/api/products');
      // If we get an error response disguised as data or empty, we check connectivity
      if (data && data.length === 0) {
        // If the database is connected but empty, we show a sync option
        setDbConnected(true);
      } else if (data && data.message && data.message.includes('Database status pending')) {
        setDbConnected(false);
      } else {
        setDbConnected(true);
      }
      const allProducts = getMergedProducts(data);
      setProducts(allProducts);
    } catch (err) {
      console.error("Fetch failed, using local/demo products:", err);
      setDbConnected(false);
      const allProducts = getMergedProducts([]);
      setProducts(allProducts);
    }
  };

  const handleGlobalSync = async () => {
    if (!window.confirm('This will push all local products to the MongoDB Atlas Cloud Vault. Continue?')) return;

    setSyncing(true);
    try {
      const demoProducts = JSON.parse(localStorage.getItem('ssm_demo_products') || '[]');
      await request('/api/admin/sync-vault', 'POST', { products: demoProducts });

      // Clear local demo storage on success to avoid duplicates
      localStorage.removeItem('ssm_demo_products');

      alert('✅ Global Vault Synchronized! All devices can now see your products.');
      fetchProducts();
    } catch (err) {
      alert('❌ Sync Failed: Ensure your PC is connected to the internet and MongoDB Atlas IP whitelist allows 0.0.0.0/0');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [request]);

  useEffect(() => {
    if (!loading && products.length > 0) {
      gsap.from('.product-card-anim', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [loading, products]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product from the vault?')) {
      const prodIdStr = String(id);
      const isGlobalProduct = /^[0-9a-fA-F]{24}$/.test(prodIdStr);

      try {
        if (isGlobalProduct) {
          await request(`/api/products/${id}`, 'DELETE');
        }

        // Always remove from Local State/View
        deleteCustomProduct(id);
        setProducts(prev => prev.filter(p => (p._id || p.id) !== id));

        // Clear from Local Storage cache
        const demoProducts = JSON.parse(localStorage.getItem('ssm_demo_products') || '[]');
        localStorage.setItem('ssm_demo_products', JSON.stringify(
          demoProducts.filter(p => (p._id || p.id) !== id)
        ));
      } catch (err) {
        console.error("Delete failed:", err);
        // If it was only a local product, remove it anyway
        if (!isGlobalProduct) {
           setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
        } else {
           alert('FAILED TO DELETE: The cloud database is not responding. This product will reappear until you fix the MONGO_URI in Vercel settings.');
        }
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: products.length,
    lowStock: products.filter(p => (p.stock !== undefined ? p.stock : 12) < 5).length,
    valuation: products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock !== undefined ? p.stock : 12)), 0)
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
            <h1 className="text-5xl font-editorial font-black uppercase tracking-tighter text-[#111]">Product Matrix</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Vault Catalog • Inventory Access Level 5</p>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
             {products.length <= 6 && (
                <button
                  onClick={handleGlobalSync}
                  disabled={syncing}
                  className="flex-1 md:flex-none bg-emerald-600 text-white px-6 md:px-10 py-5 md:py-6 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
                >
                   {syncing ? <Loader2 className="animate-spin" size={20} /> : <ExternalLink size={20} />}
                   <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">Sync Vault</span>
                </button>
             )}
             <div className="flex-1 md:flex-none bg-white px-6 md:px-8 py-5 md:py-6 rounded-[2rem] border border-[#111]/5 shadow-sm text-center md:text-left">
                <span className="text-[8px] md:text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-1">Total Items</span>
                <span className="text-2xl md:text-3xl font-black text-[#111]">{stats.total}</span>
             </div>
             <Link
               to="/admin/product/new"
               className="flex-1 md:flex-none bg-[#111] text-white px-6 md:px-10 py-5 md:py-6 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-[#8B0000] transition-all shadow-xl shadow-slate-200 group"
             >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="font-black uppercase tracking-widest text-[10px] md:text-xs text-nowrap">Add Product</span>
             </Link>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-8 rounded-[3rem] border border-[#111]/5 shadow-xl mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
            <input
              type="text"
              placeholder="Search by product name or brand..."
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

        {/* PRODUCTS LIST */}
        <div className="space-y-6" ref={listRef}>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#8B0000]" />
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card-anim bg-white p-8 rounded-[3rem] border border-[#111]/5 shadow-sm hover:shadow-md transition-all">
                <div className="grid md:grid-cols-6 gap-8 items-center">
                  <div className="col-span-1">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#111]/5 shadow-inner bg-[#F7F5F0]">
                      <img src={resolveImageUrl(product.images[0])} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">{product.brand}</span>
                    <h6 className="font-bold text-lg text-[#111] uppercase tracking-tight">{product.name}</h6>
                    <span className="text-[8px] bg-[#F7F5F0] px-2 py-1 rounded text-[#6B6B6B] font-bold uppercase mt-2 inline-block">{product.category}</span>
                  </div>

                  <div className="col-span-1 text-center md:text-left">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Valuation</span>
                    <p className="font-black text-xl text-[#111]">₹{(product.price || 0).toLocaleString()}</p>
                  </div>

                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Inventory</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${(product.stock !== undefined ? product.stock : 12) > 10 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{product.stock !== undefined ? product.stock : 12} Units</span>
                    </div>
                    {(product.stock !== undefined ? product.stock : 12) < 5 && <span className="text-[8px] text-red-600 font-bold uppercase block mt-1">Critical Low Stock</span>}
                  </div>

                  <div className="col-span-1 flex justify-end gap-3">
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="p-4 bg-[#F7F5F0] text-[#111] rounded-2xl hover:bg-[#111] hover:text-white transition-all"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-32 text-center rounded-[4rem] border border-dashed border-[#111]/10">
              <Package size={64} className="mx-auto text-[#111]/5 mb-8" />
              <h5 className="text-2xl font-editorial font-black uppercase text-[#111]/20">No matching products found.</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductList;
