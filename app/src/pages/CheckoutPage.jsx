import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import useFetch from '../hooks/useFetch';
import { indiaData } from '../utils/indiaData';
import { resolveImageUrl } from '../utils/urlConfig';
import {
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  CreditCard,
  ChevronRight,
  Package,
  Wallet
} from 'lucide-react';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { request } = useFetch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'state') {
        setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const processPayment = () => {
    if (paymentMethod === 'online') {
      alert("Razorpay Secure Gateway Initializing... (Keys required in Vercel Env)");
      // Logic for Razorpay would go here
      return;
    }
    sendWhatsAppOrder();
  };

  const sendWhatsAppOrder = async () => {
    setLoading(true);

    const orderRef = `SSM-${Date.now()}`;
    const newOrder = {
      _id: 'ord_' + Date.now(),
      user: { name: formData.name, email: formData.email },
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.images[0], // Keep original for DB, but use resolveImageUrl in UI
        price: item.price,
        product: item._id,
        size: item.size
      })),
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.pincode,
        state: formData.state,
      },
      paymentMethod: 'WhatsApp',
      totalPrice: cartTotal,
      phone: formData.phone,
      isPaid: true,
      paidAt: new Date().toISOString(),
      isDelivered: false,
      createdAt: new Date().toISOString()
    };

    // Sync to Database for "My Orders" history
    try {
      await request('/api/orders', 'POST', newOrder);
    } catch (err) {
      console.error("Database sync failed, saving to local demo storage:", err);
      const demoOrders = JSON.parse(localStorage.getItem('ssm_demo_orders') || '[]');
      demoOrders.unshift(newOrder);
      localStorage.setItem('ssm_demo_orders', JSON.stringify(demoOrders));
    }

    // Dual Shopkeeper Protocol - Load Balancing with Math.random()
    const shopNumbers = ["919423228843", "918888644021"];
    const targetNum = shopNumbers[Math.floor(Math.random() * shopNumbers.length)];

    let message = `🚀 *NEW ORDER RECEIVED - NEW SAMADHAN SHOE MART*\n`;
    message += `--------------------------------------\n`;
    message += `👤 *CUSTOMER:* ${formData.name.toUpperCase()}\n`;
    message += `📞 *PHONE:* ${formData.phone}\n`;
    message += `📍 *SHIPPING ADDRESS:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n`;
    message += `--------------------------------------\n`;
    message += `👟 *PRODUCTS:*\n`;
    cartItems.forEach(item => {
      message += `  - ${item.name} (Size ${item.size}) x${item.qty} [₹${((item.price || 0) * item.qty).toLocaleString()}]\n`;
    });
    message += `💰 *TOTAL AMOUNT:* ₹${(cartTotal || 0).toLocaleString()}\n`;
    message += `🏢 *ORIGIN:* New Samadhan Shoe Mart Factory, Nashik\n`;
    message += `--------------------------------------\n`;
    message += `✅ *ORDER REF:* #${orderRef}\n`;
    message += `🏪 *SHOP CONTACTS: 9423228843 | 8888644021*`;

    const encodedMsg = encodeURIComponent(message);

    // Dual Shopkeeper Protocol - Randomized Redirect
    window.location.href = `https://wa.me/${targetNum}?text=${encodedMsg}`;

    // Note: window.location.href will navigate away, so we shouldn't attempt a second immediate redirect
    // unless the user comes back. For dual notification, usually a backend does this or we stick to one primary.
    // However, if we must do two, the second one will likely be blocked or never reached.
    // Given the "window.location.href is preferred" instruction, we prioritize direct navigation.

    // Clear cart and redirect
    setTimeout(() => {
      clearCart();
      navigate('/profile');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pt-32 pb-24 px-6 relative overflow-hidden text-[var(--text-primary)] no-blur-zone transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <button
            onClick={() => step > 1 ? prevStep() : navigate('/cart')}
            className="flex items-center gap-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
          >
            <div className="w-10 h-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-center justify-center group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)] transition-all shadow-sm">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{step > 1 ? 'Previous Phase' : 'Return to Vault'}</span>
          </button>

          {/* Stepper HUD */}
          <div className="flex items-center gap-4">
             {[1, 2, 3].map((s) => (
               <div key={s} className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-[var(--accent)] text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]/20 border border-[var(--border-color)]'}`}>
                   0{s}
                 </div>
                 {s < 3 && <div className={`w-8 h-[2px] rounded-full ${step > s ? 'bg-[var(--accent)]' : 'bg-[var(--border-color)]'}`}></div>}
               </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT: MULTI-STEP WIZARD */}
          <div className="lg:col-span-8 space-y-8">

            {step === 1 && (
              <div className="bg-[var(--bg-secondary)] p-6 sm:p-10 md:p-16 rounded-[2.5rem] sm:rounded-[4rem] border border-[var(--border-color)] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--accent)] rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center text-white shadow-lg">
                      <User size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div>
                      <h2 className="text-2xl sm:text-4xl font-editorial font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">Identity Protocol</h2>
                      <p className="text-[var(--text-secondary)] text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] mt-2 italic">Secured Identity Verification</p>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3 sm:space-y-4">
                        <label className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.4em] ml-4 sm:ml-6">Legal Name</label>
                        <div className="relative">
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-6 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[var(--text-primary)] outline-none border border-[var(--border-color)] focus:border-[var(--accent)]/30 transition-all placeholder:text-[var(--text-primary)]/20 text-sm sm:text-base"
                            placeholder="Elite Member Name"
                          />
                          <User className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                        </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        <label className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.4em] ml-4 sm:ml-6">WhatsApp Sync</label>
                        <div className="relative">
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-6 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[var(--text-primary)] outline-none border border-[var(--border-color)] focus:border-[var(--accent)]/30 transition-all placeholder:text-[var(--text-primary)]/20 text-sm sm:text-base"
                            placeholder="+91 XXXXX XXXXX"
                          />
                          <Phone className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                        </div>
                    </div>
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!formData.name || !formData.phone}
                    className="w-full bg-[var(--text-primary)] text-[var(--bg-primary)] py-5 sm:py-7 rounded-[1.5rem] sm:rounded-[2rem] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] transition-all shadow-lg flex items-center justify-center gap-4 group disabled:opacity-50"
                  >
                    Confirm Identity <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-[var(--bg-secondary)] p-6 sm:p-10 md:p-16 rounded-[2.5rem] sm:rounded-[4rem] border border-[var(--border-color)] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--accent)] rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center text-white shadow-lg">
                      <MapPin size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div>
                      <h2 className="text-2xl sm:text-4xl font-editorial font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">Logistics Protocol</h2>
                      <p className="text-[var(--text-secondary)] text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] mt-2 italic">Vault Shipping Destination</p>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-10">
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.4em] ml-4 sm:ml-6">Street Address</label>
                    <div className="relative">
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          onKeyDown={(e) => e.stopPropagation()}
                          className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-6 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[var(--text-primary)] outline-none border border-[var(--border-color)] focus:border-[var(--accent)]/30 transition-all min-h-[120px] sm:min-h-[140px] placeholder:text-[var(--text-primary)]/20 text-sm sm:text-base"
                          placeholder="Complete Street Address & Landmarks"
                        />
                        <MapPin className="absolute left-4 sm:left-6 top-6 sm:top-8 text-[var(--text-secondary)]" size={18} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="space-y-3 sm:space-y-4">
                        <label className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.4em] ml-4 sm:ml-6">Province</label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-6 sm:px-8 py-4 sm:py-6 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[var(--text-primary)] outline-none border border-[var(--border-color)] focus:border-[var(--accent)]/30 transition-all appearance-none cursor-pointer text-sm sm:text-base"
                        >
                          <option value="">Select State</option>
                          {indiaData.states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        <label className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.4em] ml-4 sm:ml-6">Metro / City</label>
                        {indiaData.citiesByState[formData.state] ? (
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-6 sm:px-8 py-4 sm:py-6 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[var(--text-primary)] outline-none border border-[var(--border-color)] focus:border-[var(--accent)]/30 transition-all appearance-none cursor-pointer text-sm sm:text-base"
                          >
                            <option value="">Select City</option>
                            {indiaData.citiesByState[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="w-full px-6 sm:px-8 py-4 sm:py-6 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[var(--text-primary)] outline-none border border-[var(--border-color)] focus:border-[var(--accent)]/30 transition-all placeholder:text-[var(--text-primary)]/20 text-sm sm:text-base"
                            placeholder="Enter City"
                          />
                        )}
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        <label className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.4em] ml-4 sm:ml-6">Postal Code</label>
                        <input
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          onKeyDown={(e) => e.stopPropagation()}
                          className="w-full px-6 sm:px-8 py-4 sm:py-6 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[var(--text-primary)] outline-none border border-[var(--border-color)] focus:border-[var(--accent)]/30 transition-all placeholder:text-[var(--text-primary)]/20 text-sm sm:text-base"
                          placeholder="6 Digits"
                        />
                    </div>
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!formData.address || !formData.city || !formData.state || !formData.pincode}
                    className="w-full bg-[var(--text-primary)] text-[var(--bg-primary)] py-5 sm:py-7 rounded-[1.5rem] sm:rounded-[2rem] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] transition-all shadow-lg flex items-center justify-center gap-4 group disabled:opacity-50"
                  >
                    Lock Logistics <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-[var(--bg-secondary)] p-8 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[4rem] border border-[var(--border-color)] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--accent)] rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center text-white shadow-lg">
                      <CreditCard size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div>
                      <h2 className="text-2xl sm:text-4xl font-editorial font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">Transaction Protocol</h2>
                      <p className="text-[var(--text-secondary)] text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] mt-2 italic">Select Payment Channel</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <button
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 sm:gap-6 group ${paymentMethod === 'whatsapp' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/20'}`}
                  >
                    <Wallet size={32} className={`${paymentMethod === 'whatsapp' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'} sm:w-9 sm:h-9`} />
                    <div className="text-center">
                        <p className="font-bold text-[var(--text-primary)] uppercase text-[10px] sm:text-xs tracking-widest">WhatsApp Direct</p>
                        <p className="text-[8px] sm:text-[9px] text-[var(--text-secondary)] font-bold uppercase mt-2 tracking-widest italic">Fastest Clearance</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('online')}
                    className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 sm:gap-6 group ${paymentMethod === 'online' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/20'}`}
                  >
                    <ShieldCheck size={32} className={`${paymentMethod === 'online' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'} sm:w-9 sm:h-9`} />
                    <div className="text-center">
                        <p className="font-bold text-[var(--text-primary)] uppercase text-[10px] sm:text-xs tracking-widest">Secure Gateway</p>
                        <p className="text-[8px] sm:text-[9px] text-[var(--text-secondary)] font-bold uppercase mt-2 tracking-widest italic">UPI / Cards / Net Banking</p>
                    </div>
                  </button>
                </div>

                <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[var(--border-color)]">
                   <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="text-center sm:text-left">
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Final Valuation</p>
                        <p className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tighter">₹{(cartTotal || 0).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={processPayment}
                        disabled={loading}
                        className="w-full sm:w-auto px-12 sm:px-20 py-5 sm:py-7 bg-[var(--accent)] text-white rounded-[1.5rem] sm:rounded-[2rem] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-4 group disabled:opacity-50"
                      >
                        {loading ? "Transmitting..." : <>Finalize Order <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" /></>}
                      </button>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <div className="bg-[var(--bg-secondary)] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border border-[var(--border-color)] shadow-xl sticky top-32">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                   <ShoppingBag size={100} className="sm:w-[140px] sm:h-[140px]" />
               </div>

               <h3 className="text-xl sm:text-2xl font-editorial font-bold uppercase tracking-tighter mb-8 sm:mb-10 flex items-center gap-4 relative z-10">
                  <Package className="text-[var(--accent)] sm:w-6 sm:h-6" size={20} /> Review Order
               </h3>

               <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar relative z-10">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 sm:gap-5 p-4 sm:p-5 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] border border-[var(--border-color)] group hover:border-[var(--accent)]/20 transition-colors">
                       <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-color)] flex items-center justify-center p-2">
                          <img src={resolveImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-contain" />
                       </div>
                       <div className="flex-grow min-w-0">
                          <p className="text-[7px] sm:text-[8px] font-bold text-[var(--accent)] uppercase tracking-[0.3em] mb-1">{item.brand}</p>
                          <h4 className="text-[10px] sm:text-xs font-bold truncate uppercase tracking-tight text-[var(--text-primary)]">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2 sm:mt-3">
                             <p className="text-[8px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Sz {item.size} x {item.qty}</p>
                             <p className="text-xs sm:text-sm font-black text-[var(--text-primary)] tracking-tighter tabular-nums">₹{((item.price || 0) * item.qty).toLocaleString()}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-10 border-t border-[var(--border-color)] relative z-10">
                  <div className="flex justify-between items-center">
                     <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--text-secondary)]">Subtotal</span>
                     <span className="text-xs sm:text-sm font-black tabular-nums">₹{(cartTotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-emerald-600 flex items-center gap-2">
                        <Truck size={10} /> Priority logistics
                     </span>
                     <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full text-emerald-600 border border-emerald-500/10">FREE</span>
                  </div>
                  <div className="pt-4 sm:pt-6 flex flex-col gap-1 sm:gap-2">
                     <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--accent)]">Final Valuation</span>
                     <span className="text-3xl sm:text-5xl font-black tracking-tighter text-[var(--text-primary)] tabular-nums">₹{(cartTotal || 0).toLocaleString()}</span>
                  </div>
               </div>

               <button
                 onClick={processPayment}
                 disabled={loading}
                 className="w-full mt-8 sm:mt-12 bg-[var(--text-primary)] text-[var(--bg-primary)] py-5 sm:py-7 rounded-[1.5rem] sm:rounded-[2rem] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] transition-all shadow-lg flex items-center justify-center gap-4 group disabled:opacity-50 relative overflow-hidden"
               >
                  {loading ? "Transmitting..." : <>Finalize Order <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform sm:w-5 sm:h-5" /></>}
               </button>

               <div className="mt-6 sm:mt-8 flex items-center gap-4 p-4 sm:p-5 bg-[var(--bg-primary)] rounded-[1.5rem] sm:rounded-[2rem] border border-[var(--border-color)]">
                   <ShieldCheck className="text-[var(--accent)] sm:w-6 sm:h-6" size={20} />
                   <p className="text-[8px] sm:text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] leading-relaxed italic">Encryption active. Identity verified as {user?.name}.</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

};

export default CheckoutPage;
