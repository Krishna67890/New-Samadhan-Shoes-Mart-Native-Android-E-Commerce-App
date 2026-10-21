import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import localProducts from '../utils/localProducts';
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  PlusCircle,
  List,
  Truck,
  Loader2,
  MessageSquare,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, error, request } = useFetch();
  const [success, setSuccess] = useState(false);

  // Calculate stats from demo data if available
  const getDemoStats = () => {
    const demoOrders = JSON.parse(localStorage.getItem('ssm_demo_orders') || '[]');
    const demoProducts = JSON.parse(localStorage.getItem('ssm_demo_products') || '[]');

    // Merge logic for accurate valuation matrix
    let allProducts = [...localProducts];
    demoProducts.forEach(dp => {
       const idx = allProducts.findIndex(p => p._id === dp._id || p.id === dp.id);
       if (idx !== -1) {
          allProducts[idx] = dp;
       } else {
          allProducts.unshift(dp);
       }
    });

    const totalRev = demoOrders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalValuation = allProducts.reduce((acc, p) => acc + (p.price * (p.stock !== undefined ? p.stock : 12)), 0);
    const totalStock = allProducts.reduce((acc, p) => acc + (p.stock !== undefined ? p.stock : 12), 0);

    return {
      totalUsers: 124,
      totalOrders: Math.max(48, demoOrders.length),
      revenue: Math.max(86500, totalRev),
      valuation: totalValuation,
      totalInventory: allProducts.length,
      totalStockCount: totalStock
    };
  };

  const [stats, setStats] = useState(getDemoStats());
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await request('/api/admin/stats');
        if (data) {
          const dStats = getDemoStats();
          setStats({
            totalUsers: data.totalUsers || dStats.totalUsers,
            totalOrders: data.totalOrders || dStats.totalOrders,
            revenue: data.totalRevenue || dStats.revenue,
            valuation: data.totalValuation || dStats.valuation,
            totalStockCount: data.totalStockCount || dStats.totalStockCount,
            totalInventory: data.totalInventory || dStats.totalInventory,
            activeVisitors: data.activeVisitors || dStats.activeVisitors
          });
        }
      } catch (err) {
        console.error("Using Demo Stats due to fetch failure:", err);
      }
    };
    fetchStats();
  }, [user, navigate, request]);

  if (!user || user.role !== 'admin') return null;

  const handleFactoryReset = () => {
    if (window.confirm("WARNING: This will permanently clear all Demo Persistence data (Products, Orders, Gallery updates). Proceed?")) {
      const keysToClear = [
        'ssm_demo_products',
        'ssm_workshop_media',
        'ssm_workshop_gallery',
        'ssm_demo_orders',
        'newSamadhanProductReviews'
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        window.location.reload();
      }, 2000);
    }
  };

  const handleSyncVault = async () => {
    if (window.confirm("Initialize Global Atlas Sync? This will push all your local demo products to the cloud database for cross-device access.")) {
      setSyncing(true);
      try {
        const demoProducts = JSON.parse(localStorage.getItem('ssm_demo_products') || '[]');
        const data = await request('/api/admin/sync-vault', 'POST', { products: demoProducts });
        setSyncStatus({ success: true, message: data.message });

        // On successful sync, clear demo products as they are now in the Cloud Vault
        localStorage.removeItem('ssm_demo_products');

        // Refresh stats to reflect DB state
        setTimeout(() => {
          setSyncStatus(null);
          window.location.reload();
        }, 3000);
      } catch (err) {
        setSyncStatus({ success: false, message: err.message });
      } finally {
        setSyncing(false);
      }
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `₹${(stats.revenue || 0).toLocaleString()}`, icon: <DollarSign className="w-8 h-8 text-[#111]" />, bg: 'bg-white' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag className="w-8 h-8 text-[#d4af37]" />, bg: 'bg-white' },
    { title: 'Vault Inventory', value: `${stats.totalStockCount} Units`, icon: <Package className="w-8 h-8 text-[#d4af37]" />, bg: 'bg-white' },
    { title: 'Matrix Valuation', value: `₹${(stats.valuation || 0).toLocaleString()}`, icon: <Zap className="w-8 h-8 text-[#d4af37]" />, bg: 'bg-white' },
  ];

  const quickActions = [
    { name: 'Add Product', path: '/admin/product/new', icon: <PlusCircle size={18} />, color: 'bg-[#111] text-white' },
    { name: 'Order Logs', path: '/admin/orders', icon: <Truck size={18} />, color: 'bg-white text-[#111] border border-[#111]/10' },
    { name: 'Media Hub', path: '/admin/gallery', icon: <ImageIcon size={18} />, color: 'bg-white text-[#111] border border-[#111]/10' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-32 pb-20 px-6 no-blur-zone">
      <div className="container mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-[#111] text-[#d4af37] text-[8px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 border border-[#d4af37]/20">
                <ShieldCheck size={10} /> Secure Node
              </div>
              <div className="px-3 py-1 bg-white text-[#111] border border-[#111]/10 text-[8px] font-black uppercase tracking-[0.2em] rounded-full">
                Samadhan Shoes Mart v2.0
              </div>
            </div>
            <h1 className="text-6xl font-editorial font-black uppercase tracking-tighter text-[#111]">Store Command</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Administrative Access • Proprietor Dashboard</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSyncVault}
              disabled={syncing}
              className="bg-[#111] text-[#d4af37] border border-[#d4af37]/20 px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
            >
              {syncing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
              Sync Vault
            </button>
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className={`${action.color} px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                {action.icon} {action.name}
              </Link>
            ))}
            <button
              onClick={handleFactoryReset}
              className="bg-white text-red-600 px-6 py-5 rounded-[2rem] border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center font-black uppercase tracking-widest text-[10px] shadow-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Vault
            </button>
          </div>
        </div>

        {success && (
           <div className="bg-[#111] text-[#d4af37] p-6 rounded-[2.5rem] mb-12 flex items-center shadow-xl border border-[#d4af37]/20 animate-in zoom-in-95 no-blur-zone">
              <CheckCircle className="w-8 h-8 mr-4" />
              <div>
                 <p className="font-black uppercase tracking-widest text-lg">System Wipe Successful</p>
                 <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Demo database has been cleared and reset to factory defaults.</p>
              </div>
           </div>
        )}

        {syncStatus && (
           <div className={`${syncStatus.success ? 'bg-[#111] text-[#d4af37]' : 'bg-red-600 text-white'} p-6 rounded-[2.5rem] mb-12 flex items-center shadow-xl border border-[#d4af37]/20 animate-in slide-in-from-top-4 no-blur-zone`}>
              {syncStatus.success ? <CheckCircle className="w-8 h-8 mr-4" /> : <ShieldCheck className="w-8 h-8 mr-4" />}
              <div>
                 <p className="font-black uppercase tracking-widest text-lg">{syncStatus.success ? 'Vault Synchronized' : 'Sync Protocol Failed'}</p>
                 <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">{syncStatus.message}</p>
              </div>
           </div>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-[#111]/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-[#F7F5F0] rounded-2xl group-hover:bg-[#111] group-hover:text-[#d4af37] transition-colors duration-500">
                  {React.cloneElement(card.icon, { size: 24, className: "md:w-8 md:h-8" })}
                </div>
                <div className="flex items-center gap-1 text-[8px] font-black text-[#d4af37] uppercase tracking-widest">
                  <TrendingUp size={12} /> +12%
                </div>
              </div>
              <p className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest mb-2">{card.title}</p>
              <h3 className="text-2xl md:text-4xl font-black text-[#111] tracking-tighter">{card.value}</h3>
            </div>
          ))}
        </div>

        {/* COMMAND MODULES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              title: 'Catalog Control',
              desc: 'Manage elite inventory and adjust valuations.',
              icon: <Package className="text-[#d4af37]" />,
              link: '/admin/products',
              label: 'Inventory Matrix'
            },
            {
              title: 'Logistics Hub',
              desc: 'Monitor user orders and delivery vectors.',
              icon: <Truck className="text-[#d4af37]" />,
              link: '/admin/orders',
              label: 'Shipment Stream'
            },
            {
              title: 'Gallery Assets',
              desc: 'Update workshop videos and heritage photos.',
              icon: <ImageIcon className="text-[#d4af37]" />,
              link: '/admin/gallery',
              label: 'Media Vault'
            },
            {
              title: 'Feedback Review',
              desc: 'Audit customer interactions and reputation.',
              icon: <MessageSquare className="text-[#d4af37]" />,
              link: '/admin/reviews',
              label: 'Interaction Audit'
            }
          ].map((module, i) => (
            <Link
              key={i}
              to={module.link}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-[#111]/5 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F7F5F0] rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                {React.cloneElement(module.icon, { size: 28, className: "md:w-8 md:h-8" })}
              </div>
              <h3 className="text-xl md:text-2xl font-editorial font-black text-[#111] mb-4 tracking-tighter uppercase">{module.title}</h3>
              <p className="text-[#6B6B6B] font-medium leading-relaxed uppercase text-[9px] tracking-widest mb-6 md:mb-8 flex-grow">
                {module.desc}
              </p>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#111] group-hover:text-[#d4af37] transition-colors">
                <span>{module.label}</span>
                <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* FOOTER STATUS */}
        <div className="mt-20 pt-10 border-t border-[#111]/5 flex justify-between items-center text-[8px] font-black text-[#6B6B6B] uppercase tracking-[0.3em]">
          <span>System Status: Optimal</span>
          <span>Last Sync: {new Date().toLocaleTimeString()}</span>
          <span>Access Level: Proprietor (Elite)</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
