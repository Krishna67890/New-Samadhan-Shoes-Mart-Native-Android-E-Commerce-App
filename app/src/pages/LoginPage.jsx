import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { Mail, Lock, User, AlertCircle, Loader2, ArrowRight, Sparkles, ShieldCheck, Zap, Eye, EyeOff, CheckCircle } from 'lucide-react';

const LoginPage = ({ initialMode = 'login' }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const modeParam = searchParams.get('mode');

  const [isRegister, setIsRegister] = useState(initialMode === 'register' || modeParam === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const containerRef = useRef(null);
  const formBoxRef = useRef(null);

  const { login, loginAsGuest, register } = useAuth();
  const { loading, error } = useFetch();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formBoxRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match. Please re-enter.');
        return;
      }

      setActionLoading(true);
      const result = await register(name, email, password);
      setActionLoading(false);

      if (result.success) {
        setSuccessMessage('Account created successfully! Welcome to New Samadhan Shoes Mart.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setLocalError(result.message || 'Registration failed. Please try again.');
      }
    } else {
      setActionLoading(true);
      const result = await login(email, password);
      setActionLoading(false);

      if (result.success) {
        if (result.role === 'admin') {
          window.location.href = '/admin';
        } else {
          navigate('/dashboard');
        }
      } else {
        setLocalError(result.message || 'Invalid credentials. Please verify your email and password.');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 pb-16 relative font-sans"
    >
      <div
        ref={formBoxRef}
        className="w-full max-w-4xl bg-white rounded-[2.5rem] border border-black/10 shadow-2xl overflow-hidden grid lg:grid-cols-12 relative z-10"
      >
        {/* LEFT COLUMN: BRAND STORY */}
        <div className="lg:col-span-5 bg-[#111111] text-white p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-11 h-11 bg-[#d4af37] text-black font-black text-xl rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                S
              </div>
              <div>
                <span className="font-editorial text-lg font-black uppercase tracking-tight text-white block leading-none">
                  New Samadhan
                </span>
                <span className="text-[9px] font-bold tracking-[0.35em] text-[#d4af37] uppercase">
                  Shoe Mart • Nashik
                </span>
              </div>
            </Link>

            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37] block mb-3">
              {isRegister ? 'PRIVILEGE MEMBERSHIP' : 'MEMBER ACCESS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight mb-6">
              {isRegister ? (
                <>
                  JOIN THE <br />
                  <span className="text-[#d4af37] italic font-editorial">ATELIER.</span>
                </>
              ) : (
                <>
                  STEP INTO <br />
                  <span className="text-[#d4af37] italic font-editorial">PRIVILEGE.</span>
                </>
              )}
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {isRegister
                ? 'Create your verified account for express checkout, customized size profiles, and VIP invitations to handmade seasonal drops.'
                : 'Sign in to manage orders, explore bespoke footwear sizing, and track your handcrafted deliveries across India.'}
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <ShieldCheck size={16} className="text-[#d4af37] shrink-0" />
              <span>100% Encrypted &amp; Verified Data</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <Zap size={16} className="text-[#d4af37] shrink-0" />
              <span>Instant Pan-India Order Tracking</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHENTICATION FORM */}
        <div className="lg:col-span-7 p-8 md:p-14 bg-white flex flex-col justify-center">
          {/* Tabs: Sign In vs Create Account */}
          <div className="flex p-1 bg-[#faf9f6] rounded-2xl border border-black/10 mb-8 max-w-xs">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setLocalError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                !isRegister ? 'bg-[#111111] text-white shadow-md' : 'text-gray-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setLocalError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isRegister ? 'bg-[#111111] text-white shadow-md' : 'text-gray-600 hover:text-black'
              }`}
            >
              Register
            </button>
          </div>

          <div className="mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] block mb-1">
              {isRegister ? 'NEW CUSTOMER' : 'WELCOME BACK'}
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#111111]">
              {isRegister ? 'Create Your Account' : 'Sign In to Account'}
            </h1>
          </div>

          {successMessage && (
            <div className="bg-[#111] border border-[#d4af37]/20 text-[#d4af37] p-4 rounded-2xl mb-6 flex items-start gap-3">
              <CheckCircle size={18} className="shrink-0 mt-0.5 text-[#d4af37]" />
              <p className="text-xs font-bold leading-relaxed">{successMessage}</p>
            </div>
          )}

          {(error || localError) && (
            <div className="bg-[#111] border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <p className="text-xs font-bold leading-relaxed">{error || localError}</p>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full pl-12 pr-4 py-3 bg-[#faf9f6] border border-black/15 rounded-xl font-medium text-gray-900 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="w-full pl-12 pr-4 py-3 bg-[#faf9f6] border border-black/15 rounded-xl font-medium text-gray-900 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                  Password
                </label>
                {!isRegister && (
                  <Link to="/about" className="text-[11px] font-bold text-[#d4af37] hover:underline">
                    Need Help?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="w-full pl-12 pr-12 py-3 bg-[#faf9f6] border border-black/15 rounded-xl font-medium text-gray-900 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full pl-12 pr-4 py-3 bg-[#faf9f6] border border-black/15 rounded-xl font-medium text-gray-900 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || actionLoading}
              className="w-full bg-[#111111] text-white py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-lg flex items-center justify-center gap-3 cursor-pointer mt-2"
            >
              {loading || actionLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>{isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Quick Access Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={async () => {
                  setActionLoading(true);
                  const result = await loginAsGuest();
                  setActionLoading(false);
                  if (result.success) navigate('/products');
                }}
                disabled={loading || actionLoading}
                className="py-3 px-4 rounded-xl border border-black/15 bg-white text-gray-800 text-xs font-bold uppercase tracking-wider hover:border-[#d4af37] hover:bg-[#FAF9F6] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={14} className="text-[#d4af37]" /> Guest Pass
              </button>

              <button
                type="button"
                onClick={() => navigate('/owner-login')}
                className="py-3 px-4 rounded-xl border border-black/15 bg-white text-[#111111] text-xs font-bold uppercase tracking-wider hover:border-[#d4af37] hover:bg-[#FAF9F6] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={14} className="text-[#d4af37]" /> Owner Portal
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-black/10 text-center">
            {isRegister ? (
              <p className="text-xs text-gray-600 font-medium">
                Already registered with us?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setLocalError(null); }}
                  className="text-[#111111] font-black uppercase tracking-wider hover:text-[#d4af37] ml-1 underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-600 font-medium">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setLocalError(null); }}
                  className="text-[#111111] font-black uppercase tracking-wider hover:text-[#d4af37] ml-1 underline cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
