import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';

const OwnerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    // Force immediate visual clarity on mount
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

    // Kill any inherited filters from parent wrappers
    if (formRef.current) {
      gsap.set(formRef.current, { clearProps: "all" });
      gsap.from(formRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: "transform,filter"
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const result = await login(email, password);

    if (result.success) {
      if (result.role === 'admin') {
        window.location.href = '/admin';
      } else {
        setLocalError('Access Denied: Owner Portal requires administrator privileges.');
      }
    } else {
      setLocalError(result.message || 'Authentication Failed: Invalid Owner Key or Email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 pt-28 pb-16 relative font-sans login-portal-container">
      {/* High-Specificity Visibility Override */}
      <style>{`
        .login-portal-container,
        .login-portal-container *,
        .login-portal-container *:before,
        .login-portal-container *:after {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          filter: none !important;
          will-change: auto !important;
          transform: none !important;
        }

        /* Restore transform only for the animated form ref, but keep filters killed */
        .login-portal-form-wrapper {
           filter: none !important;
           -webkit-filter: none !important;
           backdrop-filter: none !important;
           transform: none !important;
           opacity: 1 !important;
        }

        input {
          image-rendering: auto !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          filter: none !important;
          backdrop-filter: none !important;
        }
      `}</style>

      <div className="w-full max-w-lg z-10 login-portal-form-wrapper" ref={formRef}>
        <div className="bg-white rounded-[2.5rem] border border-black/15 p-8 sm:p-12 shadow-2xl relative">
          {/* Top back link */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/login"
              className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={16} /> Member Login
            </Link>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d4af37] px-3 py-1 bg-[#d4af37]/10 rounded-full">
              COMMAND PORTAL
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#111111] text-[#d4af37] rounded-2xl mb-4 shadow-lg border border-[#d4af37]/40">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[#111111] tracking-tight uppercase mb-1">
              Owner Sign In
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              New Samadhan Shoes Mart Command Center
            </p>
          </div>

          {localError && (
            <div className="bg-[#111] border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <p className="text-xs font-bold leading-relaxed">{localError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block mb-2">
                Owner Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@samadhan.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#faf9f6] border border-black/15 rounded-xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all shadow-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block mb-2">
                Owner Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-[#faf9f6] border border-black/15 rounded-xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all shadow-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#111111] text-[#d4af37] text-xs font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin text-current" size={18} />
              ) : (
                <>
                  <span>UNLOCK VAULT COMMAND</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-black/10 text-center">
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              Authorized Proprietor Access Only • Nashik HQ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLoginPage;
