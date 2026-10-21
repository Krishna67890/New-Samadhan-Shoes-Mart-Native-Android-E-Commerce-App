import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/urlConfig';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, Zap, MessageCircle } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);

  const speakVaultGuide = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Welcome to your Vault. Your total is ${(cartTotal || 0).toLocaleString()} rupees. When you click Confirm, I will copy your order details and open our official WhatsApp group. Just paste the message there so our Shopkeeper and Developer can process your shoes immediately.`;
      msg.lang = 'en-IN';
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      speakVaultGuide();
    }
  }, [cartItems.length]);

  const handleCheckoutNavigation = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen pt-32 pb-24 relative overflow-hidden text-[#111111] no-blur-zone">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#8B0000]/5 rounded-full"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex items-center gap-6 mb-16 reveal-item">
          <div className="w-16 h-16 bg-[#8B0000] rounded-[2rem] flex items-center justify-center text-white shadow-lg">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className="text-5xl font-editorial font-black text-[#111111] tracking-tighter uppercase leading-none">The Vault</h1>
            <p className="text-[#6B6B6B] text-[10px] font-bold uppercase tracking-[0.4em] mt-2 italic">Secured Collection</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 sm:p-24 rounded-[2rem] sm:rounded-[4rem] text-center max-w-3xl mx-auto border border-[#111111]/5 shadow-xl">
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-10 border border-[#111111]/5">
              <ShoppingBag size={32} className="text-[#6B6B6B] sm:hidden" />
              <ShoppingBag size={56} className="text-[#6B6B6B] hidden sm:block" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-editorial font-bold text-[#111111] mb-4 sm:mb-6 uppercase tracking-tight">Vault is Empty</h2>
            <p className="text-[#6B6B6B] mb-8 sm:mb-12 text-sm sm:text-lg font-medium italic">"Your elite collection starts with a single pair."</p>
            <Link to="/products" className="bg-[#111111] text-white px-8 sm:px-12 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs inline-flex items-center gap-4 hover:bg-[#8B0000] transition-all shadow-md">
              Browse Trends <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {cartItems.map((item) => (
                <div key={`${item._id || item.id}-${item.size}`} className="group relative bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3.5rem] border border-[#111111]/5 hover:border-[#8B0000]/20 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 shadow-lg">
                  <Link
                    to={`/product/${item._id || item.id}`}
                    className="w-32 h-32 sm:w-40 sm:h-40 bg-[#F7F5F0] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shrink-0 border border-[#111111]/5 flex items-center justify-center p-4 hover:opacity-80 transition-opacity cursor-pointer group/img"
                  >
                    <img
                      src={resolveImageUrl(item.images?.[0] || '/Shoes.png')}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover/img:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-2 sm:mb-4">
                      <span className="px-3 py-1 bg-[#8B0000]/10 border border-[#8B0000]/20 rounded-full text-[8px] font-bold text-[#8B0000] uppercase tracking-widest">{item.brand}</span>
                      <span className="px-3 py-1 bg-[#111111]/5 border border-[#111111]/10 rounded-full text-[8px] font-bold text-[#6B6B6B] uppercase tracking-widest">Size: {item.size}</span>
                    </div>
                    <Link to={`/product/${item._id || item.id}`} className="hover:text-[#8B0000] transition-colors">
                      <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#111111] mb-2 sm:mb-4 tracking-tight uppercase leading-none">{item.name}</h3>
                    </Link>
                    <div className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tighter tabular-nums">₹{(item.price || 0).toLocaleString()}</div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-6 w-full sm:w-auto justify-between sm:justify-center">
                    <div className="flex items-center bg-[#F7F5F0] p-1.5 rounded-xl border border-[#111111]/5">
                      <button onClick={() => addToCart(item, -1, item.size)} className="w-8 h-8 font-bold text-[#111111] hover:text-[#8B0000] transition-colors">-</button>
                      <span className="w-10 text-center font-bold text-[#111111] text-base">{item.qty}</span>
                      <button onClick={() => addToCart(item, 1, item.size)} className="w-8 h-8 font-bold text-[#111111] hover:text-[#8B0000] transition-colors">+</button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-black text-[#8B0000] tracking-tighter tabular-nums">₹{((item.price || 0) * item.qty).toLocaleString()}</p>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item._id || item.id, item.size)} className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[#111111]/20 hover:text-rose-600 transition-all hover:scale-125">
                    <Trash2 size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border border-[#111111]/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={100} className="text-[#111111] sm:w-[120px] sm:h-[120px]" />
                </div>

                <h2 className="text-xl sm:text-2xl font-editorial font-bold text-[#111111] mb-8 sm:mb-10 uppercase tracking-tighter relative z-10">Vault Summary</h2>

                <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-[0.3em]">Items Valuation</span>
                    <span className="text-base sm:text-lg font-black text-[#111111] tabular-nums">₹{(cartTotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-[0.3em]">Elite Delivery</span>
                    <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">FREE</span>
                  </div>
                  <div className="pt-6 sm:pt-8 border-t border-[#111111]/5">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-[0.4em]">Total Commitment</span>
                      <span className="text-3xl sm:text-5xl font-black text-[#8B0000] tracking-tighter tabular-nums">₹{(cartTotal || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutNavigation}
                  className="w-full bg-[#111111] text-white py-5 sm:py-7 rounded-[1.5rem] sm:rounded-[2rem] font-bold uppercase tracking-[0.3em] text-[10px] sm:text-[11px] flex items-center justify-center gap-4 hover:bg-[#8B0000] transition-all shadow-md group relative overflow-hidden mb-6 sm:mb-8"
                >
                  Initiate Protocol <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="flex items-center gap-4 p-5 bg-[#F7F5F0] rounded-[2rem] border border-[#111111]/5">
                  <div className="w-10 h-10 bg-[#8B0000]/10 rounded-xl flex items-center justify-center text-[#8B0000]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#6B6B6B] font-bold uppercase tracking-widest leading-none mb-1">Authenticated By</p>
                    <p className="text-[10px] text-[#111111] font-bold uppercase tracking-widest leading-none">{user?.name || 'Guest'}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
