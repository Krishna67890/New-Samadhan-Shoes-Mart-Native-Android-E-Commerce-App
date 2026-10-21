import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Camera, Save, ArrowLeft, Loader2, ShieldCheck, Mail, Phone, MapPin, User, ShieldAlert, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { indiaData } from '../utils/indiaData';
import { resolveImageUrl } from '../utils/urlConfig';

const EditProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Nashik',
    state: user?.state || 'Maharashtra',
    pincode: user?.pincode || '',
  });

  const [avatarPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');

    // GSAP Reveal
    const ctx = gsap.context(() => {
      gsap.from('.profile-reveal', {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power4.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const playEliteGuide = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const intro = new SpeechSynthesisUtterance(
        "Identity Sync active. Please confirm your details. Your address in Nashik will be saved locally to your device. Once saved, you can unlock the vault and message our shopkeeper at 88 88 64 40 21."
      );
      intro.lang = 'en-IN';
      intro.rate = 0.9;
      window.speechSynthesis.speak(intro);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Strict Phone & Pincode Validation
    const phoneClean = formData.phone.replace(/\s/g, '').replace('+91', '');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneClean)) {
      setError('Identity Rejected: WhatsApp number must be exactly 10 digits.');
      setLoading(false);
      return;
    }

    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(formData.pincode)) {
      setError('Identity Rejected: Pincode must be exactly 6 digits.');
      setLoading(false);
      return;
    }

    // Local-First Save
    const successSave = updateProfile({
        ...formData,
        phone: phoneClean,
        identityVerified: true
    });

    if (successSave) {
        setSuccess('Identity Synced to Local Vault!');
        setTimeout(() => {
            navigate('/cart');
        }, 1500);
    } else {
        setError('Vault Sync Failed');
        setLoading(false);
    }
  };

  const displayAvatar = resolveImageUrl(avatarPreview || (user?.gender === 'girl'
    ? '/girl.png'
    : '/boy.png'));

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] pt-32 pb-24 px-4 sm:px-10 lg:px-20 relative overflow-x-hidden no-blur-zone" ref={containerRef}>
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-[0.02]"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-input-lux {
          width: 100%;
          padding: 1.1rem 1.5rem 1.1rem 3.5rem;
          background: #F7F5F0;
          border: 1px solid transparent;
          border-radius: 1rem;
          font-size: 0.875rem;
          color: #111111;
          outline: none;
          transition: all 0.3s;
        }
        .form-input-lux:focus {
          background: #ffffff;
          border-color: #111111;
        }
        .input-icon-lux {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #111111;
          opacity: 0.4;
        }
        .label-text-lux {
          color: #111111;
          opacity: 0.5;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 9px;
          margin-left: 0.5rem;
          margin-bottom: 0.5rem;
          display: block;
        }
      `}} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 profile-reveal">
          <div>
            <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-[#111111]/50 hover:text-[#8B0000] transition-all mb-4">
              <ArrowLeft size={16} />
              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.3em]">Return</span>
            </button>
            <h1 className="text-5xl md:text-7xl font-editorial font-black text-[#111111] tracking-tighter uppercase leading-none">
              IDENTITY <span className="italic font-light text-[#8B0000]">SYNC.</span>
            </h1>
          </div>
          <button onClick={playEliteGuide} className="flex items-center gap-2 bg-white px-6 py-3 border border-[#111111]/5 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest text-[#8B0000] shadow-sm hover:bg-[#111111] hover:text-white transition-all">
              <Volume2 size={14} /> AI Voice Guide
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8 profile-reveal">
            <div className="bg-white rounded-[2.5rem] p-10 border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8B0000]"></div>
              <div className="w-44 h-44 bg-[#F7F5F0] rounded-[2rem] mx-auto flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h3 className="mt-8 text-2xl font-editorial font-bold text-[#111111] uppercase tracking-tight">{formData.name || 'ANONYMOUS'}</h3>
              <p className="text-[9px] font-sans font-bold text-[#111111]/30 uppercase tracking-widest mt-2">LOCAL IDENTITY VAULT</p>
            </div>

            <div className="bg-[#111111] rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B0000]/10 rounded-full"></div>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={16} className="text-[#8B0000]" />
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#F7F5F0]/80">Local-First Architecture</span>
              </div>
              <p className="text-xs font-medium text-[#F7F5F0]/60 leading-relaxed italic">"Data is strictly secured in your personal browser vault. Encrypted node protection ensures complete privacy and zero lag."</p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-10 md:p-12 rounded-[2.5rem] border border-[#111111]/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] profile-reveal">
            {success && <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-4 shadow-sm animate-in fade-in">
              <ShieldCheck size={18} /> {success}
            </div>}
            {error && <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-4 shadow-sm animate-in fade-in">
              <ShieldAlert size={18} /> {error}
            </div>}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-text-lux">Full Name</label>
                  <div className="relative">
                    <input name="name" value={formData.name} onChange={handleInputChange} onKeyDown={(e) => e.stopPropagation()} type="text" className="form-input-lux" placeholder="Krishna Patil Rajput" required />
                    <User className="input-icon-lux" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label-text-lux">WhatsApp Number</label>
                  <div className="relative">
                    <input name="phone" value={formData.phone} onChange={handleInputChange} onKeyDown={(e) => e.stopPropagation()} type="tel" className="form-input-lux" placeholder="8888888888" required />
                    <Phone className="input-icon-lux" size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-text-lux">Physical Address</label>
                <div className="relative">
                  <input name="address" value={formData.address} onChange={handleInputChange} onKeyDown={(e) => e.stopPropagation()} type="text" className="form-input-lux" placeholder="Building, Street, Landmark" required />
                  <MapPin className="input-icon-lux" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="label-text-lux">State</label>
                  <select name="state" value={formData.state} onChange={handleInputChange} className="form-input-lux appearance-none cursor-pointer">
                    {indiaData.states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="label-text-lux">City Node</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} onKeyDown={(e) => e.stopPropagation()} type="text" className="form-input-lux" placeholder="Nashik" required />
                </div>
                <div className="space-y-2">
                  <label className="label-text-lux">Pincode Vector</label>
                  <input name="pincode" value={formData.pincode} onChange={handleInputChange} onKeyDown={(e) => e.stopPropagation()} type="text" className="form-input-lux" placeholder="422001" required />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111111] text-white py-5 rounded-xl font-sans font-bold uppercase tracking-[0.3em] text-[11px] shadow-lg hover:bg-[#8B0000] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Sync Identity & Enter Vault</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
