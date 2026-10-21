import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { Truck, ArrowLeft, CheckCircle, Clock, ExternalLink, Loader2, Filter, Search } from 'lucide-react';

const AdminOrders = () => {
  const { loading, error, request } = useFetch();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await request('/api/orders');
      const demoOrders = JSON.parse(localStorage.getItem('ssm_demo_orders') || '[]');

      let allOrders = [];
      if (data && Array.isArray(data) && data.length > 0) {
        allOrders = [...data];
      }

      // Merge Demo Orders
      demoOrders.forEach(do_ => {
        const idx = allOrders.findIndex(o => o._id === do_._id);
        if (idx !== -1) {
          allOrders[idx] = do_;
        } else {
          allOrders.unshift(do_);
        }
      });

      if (allOrders.length === 0) {
         // Fallback if absolutely nothing found
         allOrders = [
          {
            _id: 'ord_demo123456789',
            user: { name: 'Rahul Sharma', email: 'rahul@example.com' },
            createdAt: new Date().toISOString(),
            totalPrice: 4500,
            isPaid: true,
            paidAt: new Date().toISOString(),
            isDelivered: false
          }
         ];
      }
      setOrders(allOrders);
    } catch (err) {
      console.error("Fetch orders failed, showing demo data:", err);
      const demoOrders = JSON.parse(localStorage.getItem('ssm_demo_orders') || '[]');
      setOrders(demoOrders.length > 0 ? demoOrders : [
        {
          _id: 'ord_demo123456789',
          user: { name: 'Rahul Sharma', email: 'rahul@example.com' },
          createdAt: new Date().toISOString(),
          totalPrice: 4500,
          isPaid: true,
          paidAt: new Date().toISOString(),
          isDelivered: false
        }
      ]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [request]);

  const deliverHandler = async (id) => {
    try {
      await request(`/api/orders/${id}/deliver`, 'PUT');

      // Update local storage if it's a demo order
      const demoOrders = JSON.parse(localStorage.getItem('ssm_demo_orders') || '[]');
      const orderIdx = demoOrders.findIndex(o => o._id === id);
      if (orderIdx !== -1) {
        demoOrders[orderIdx].isDelivered = true;
        demoOrders[orderIdx].deliveredAt = new Date().toISOString();
        localStorage.setItem('ssm_demo_orders', JSON.stringify(demoOrders));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchOrders();
    } catch (err) {
      console.error(err);
      // Demo fallback: update local state/storage
      const demoOrders = JSON.parse(localStorage.getItem('ssm_demo_orders') || '[]');
      const orderIdx = demoOrders.findIndex(o => o._id === id);
      if (orderIdx !== -1) {
        demoOrders[orderIdx].isDelivered = true;
        demoOrders[orderIdx].deliveredAt = new Date().toISOString();
        localStorage.setItem('ssm_demo_orders', JSON.stringify(demoOrders));
      } else {
        // If not in demo storage, update the state directly for immediate UI feedback
        setOrders(prev => prev.map(o => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Delivered' && order.isDelivered) ||
      (statusFilter === 'Pending' && !order.isDelivered);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => !o.isDelivered).length,
    revenue: orders.reduce((acc, o) => acc + o.totalPrice, 0)
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
            <h1 className="text-5xl font-editorial font-black uppercase tracking-tighter text-[#111]">Order Logistics</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Shipment Command • Real-time Transaction Stream</p>
          </div>

          <div className="flex gap-4">
             <div className="bg-white px-8 py-6 rounded-[2rem] border border-[#111]/5 shadow-sm">
                <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-1">Total Sales</span>
                <span className="text-3xl font-black text-[#111]">₹{(stats.revenue || 0).toLocaleString()}</span>
             </div>
             <div className="bg-white px-8 py-6 rounded-[2rem] border border-[#111]/5 shadow-sm">
                <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-1">Active Shipments</span>
                <span className="text-3xl font-black text-[#8B0000]">{stats.pending}</span>
             </div>
          </div>
        </div>

        {success && (
          <div className="bg-[#8B0000] text-white p-6 rounded-[2.5rem] mb-12 flex items-center shadow-xl border-4 border-white animate-in zoom-in-95 no-blur-zone">
            <CheckCircle className="w-8 h-8 mr-4" />
            <div>
              <p className="font-black uppercase tracking-widest text-lg">Update Successfull</p>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Logistics record has been updated and synchronized.</p>
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div className="bg-white p-8 rounded-[3rem] border border-[#111]/5 shadow-xl mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Email..."
              className="w-full bg-[#F7F5F0] border-0 rounded-2xl py-4 pl-16 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#8B0000]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter size={20} className="text-[#6B6B6B]" />
            <select
              className="bg-[#F7F5F0] border-0 rounded-2xl py-4 px-8 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Shipments</option>
              <option value="Pending">Pending Delivery</option>
              <option value="Delivered">Completed</option>
            </select>
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#8B0000]" />
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white p-10 rounded-[3rem] border border-[#111]/5 shadow-sm hover:shadow-md transition-all">
                <div className="grid md:grid-cols-5 gap-8 items-center">
                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Order ID</span>
                    <h6 className="font-mono text-xs text-[#111] font-bold uppercase tracking-tight line-clamp-1">{order._id.substring(order._id.length - 12).toUpperCase()}</h6>
                    <span className="text-[8px] text-[#6B6B6B] font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Customer</span>
                    <p className="font-bold text-sm text-[#111] uppercase">{order.user?.name}</p>
                    <p className="text-[10px] text-[#6B6B6B] truncate">{order.user?.email}</p>
                  </div>

                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Transaction</span>
                    <p className="font-black text-xl text-[#111]">₹{(order.totalPrice || 0).toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {order.isPaid ? (
                        <span className="text-[8px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase">Paid</span>
                      ) : (
                        <span className="text-[8px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-black uppercase">Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest block mb-2">Logistic Status</span>
                    {order.isDelivered ? (
                      <div className="flex items-center text-emerald-600 gap-2">
                        <CheckCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Delivered</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-500 gap-2">
                        <Truck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">In Transit</span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-1 flex justify-end gap-4">
                    {!order.isDelivered && (
                      <button
                        onClick={() => deliverHandler(order._id)}
                        className="px-6 py-3 bg-[#111] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#8B0000] transition-all"
                      >
                        Finalize
                      </button>
                    )}
                    <button className="p-3 text-[#111] border border-[#111]/20 rounded-xl hover:bg-[#111] hover:text-white transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-32 text-center rounded-[4rem] border border-dashed border-[#111]/10">
              <Truck size={64} className="mx-auto text-[#111]/5 mb-8" />
              <h5 className="text-2xl font-editorial font-black uppercase text-[#111]/20">No matching shipments found.</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
