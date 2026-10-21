import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Award, Heart, Hammer, Footprints, ShieldCheck, MapPin, Phone, Mail,
  ArrowRight, Sparkles, Star, Users, Clock, Code2, Globe,
  Zap, Layers, ChevronRight, ExternalLink, Cpu, Activity, MessageCircle, Instagram
} from 'lucide-react';
import { resolveImageUrl } from '../utils/urlConfig';

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  { year: '1990', title: 'The Founding Vision', desc: 'New Samadhan Shoe Mart was born in the cultural heart of Nashik, Maharashtra, with a single purpose: to craft footwear that feels like a second skin.' },
  { year: '1998', title: 'Goodyear Welt Mastery', desc: 'After years of study under master cobblers, the atelier adopted Goodyear welted construction — the gold standard of durable, resoleable footwear.' },
  { year: '2005', title: 'The Guild Expands', desc: 'Welcomed 6 new master artisans with a combined heritage of 120+ years. The workshop floor tripled to meet growing Nashik demand.' },
  { year: '2012', title: '50,000 Pairs Milestone', desc: "Celebrated crafting 50,000 handmade pairs — each signed off by a Guild Elder. A landmark that confirmed our place as Nashik's premier artisan atelier." },
  { year: '2018', title: 'Digital Showroom Launch', desc: "Took the heritage online — bringing Nashik's finest cobbling tradition to customers across Maharashtra and beyond." },
  { year: '2024', title: 'Present Day Excellence', desc: '34 years later, still handcrafting every pair with the same precision, passion and patina-philosophy that started it all in 1990.' },
];

const VALUES = [
  { icon: <Hammer size={28} />, title: 'Artisan First', desc: 'Every pair is touched by human hands at every stage. No automated moulding. No shortcuts. Just craft.' },
  { icon: <Heart size={28} />, title: 'Heritage Pride', desc: '34 years of cobbler dedication embedded in every stitch, every skive, and every welt loop.' },
  { icon: <ShieldCheck size={28} />, title: 'Lifetime Promise', desc: 'Goodyear welt means you can resole our shoes multiple times. Built to outlast trends, not follow them.' },
  { icon: <Footprints size={28} />, title: 'Zero Fatigue Fit', desc: '32 anatomical landmarks per last ensure glove-like comfort from hour one. No break-in period needed.' },
  { icon: <Star size={28} />, title: 'Museum Grade Finish', desc: '24-hour bone-burnished carnauba wax patina. The leather improves with age — like fine wine.' },
  { icon: <Globe size={28} />, title: 'Sustainable Sourcing', desc: 'Vegetable-tanned full-grain leathers from certified tanneries. Zero PVC coatings. Nature-forward.' },
];

const STATS = [
  { value: '34+', label: 'Years of Mastery', icon: <Clock size={20} /> },
  { value: '50K+', label: 'Pairs Handcrafted', icon: <Footprints size={20} /> },
  { value: '12', label: 'Master Artisans', icon: <Users size={20} /> },
  { value: '280+', label: 'Years Combined Skill', icon: <Award size={20} /> },
];

const S = {
  label: { fontSize: '9px', fontWeight: 800, letterSpacing: '0.35em', color: '#8B0000', textTransform: 'uppercase' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(139,0,0,0.08)', borderRadius: '20px', marginBottom: '20px' },
};

const AboutPage = () => {
  const statsRef = useRef(null);
  const heritageRef = useRef(null);
  const valuesRef = useRef(null);
  const timelineRef = useRef(null);
  const developerRef = useRef(null);
  const containerRef = useRef(null);
  const shoeRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isMobile } = context.conditions;

      // Technical HUD entry (Hard Mode)
      gsap.from(".about-hud", {
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out"
      });

      // Floating Shoe Ambient (Hard Mode)
      gsap.to(shoeRef.current, {
        y: "-=50",
        rotationY: "+=30",
        rotationX: "+=12",
        filter: "brightness(1.2) contrast(1.1)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Z-Axis Plunge for Shoe on Scroll
      gsap.to(shoeRef.current, {
        z: 5500,
        scale: 6,
        opacity: 0,
        filter: 'brightness(2)',
        scrollTrigger: {
          trigger: ".about-shoe-trigger",
          start: "top center",
          end: "bottom top",
          scrub: isMobile ? 0.5 : 2.2
        }
      });

      gsap.fromTo('.stat-card',
        { y: 60, opacity: 0, scale: 0.94 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo('.heritage-reveal',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: heritageRef.current, start: 'top 75%' }
        }
      );

      gsap.fromTo('.value-card',
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: valuesRef.current, start: 'top 75%' }
        }
      );

      gsap.fromTo('.timeline-item',
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'power3.out',
          scrollTrigger: { trigger: timelineRef.current, start: 'top 75%' }
        }
      );

      gsap.fromTo('.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1.6, ease: 'power2.inOut', transformOrigin: 'top center',
          scrollTrigger: { trigger: timelineRef.current, start: 'top 80%', scrub: 0.5 }
        }
      );

      gsap.fromTo('.dev-card',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: developerRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo('.dev-info-item',
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: developerRef.current, start: 'top 75%' }
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="no-blur-zone" style={{ background: '#F7F5F0', color: '#111111', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 24px 80px', overflow: 'hidden', background: '#F7F5F0' }}>

        {/* TECHNICAL OVERLAYS */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="about-hud absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,0,0,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="about-hud absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-[#8B0000]/30"></div>
          <div className="about-hud absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-[#8B0000]/30"></div>
          <div className="about-hud absolute top-12 left-32 font-mono text-[8px] text-[#8B0000] tracking-[0.4em] opacity-60">
            SYSTEM_TYPE: HERITAGE_CORE<br/>LOAD_VAL: 1990_STABLE
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '5%', left: '-2vw', fontSize: '22vw', fontFamily: "'Playfair Display', serif", fontWeight: 900, color: 'rgba(139,0,0,0.03)', whiteSpace: 'nowrap', pointerEvents: 'none', letterSpacing: '-0.05em', userSelect: 'none' }}>SAMADHAN</div>

        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 20 }}>
          <div className="about-hero-reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '7px 18px', background: 'rgba(139,0,0,0.05)', borderRadius: '24px', marginBottom: '36px', border: '1px solid rgba(139,0,0,0.1)' }}>
            <Cpu size={14} color="#8B0000" />
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.45em', color: '#8B0000', textTransform: 'uppercase' }}>ESTABLISHED 1990 · NASHIK</span>
          </div>
          {[
            { text: 'ABOUT', italic: false },
            { text: 'NEW', italic: false },
            { text: 'SAMADHAN', italic: true },
          ].map((w, i) => (
            <div key={i} style={{ overflow: 'hidden', marginBottom: i < 2 ? '12px' : '32px' }}>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: w.italic ? 300 : 900, lineHeight: 0.9, letterSpacing: '-0.03em', textTransform: 'uppercase', fontSize: 'clamp(3rem, 9vw, 10rem)', fontStyle: w.italic ? 'italic' : 'normal', color: w.italic ? '#8B0000' : '#111111' }}>
                <span className="about-hero-word" style={{ display: 'inline-block' }}>{w.text}</span>
              </h1>
            </div>
          ))}
          <div className="about-hero-sub" style={{ maxWidth: '620px' }}>
            <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#111111', opacity: 0.7, margin: 0, fontWeight: 500, fontStyle: 'italic' }}>
              "In Sanskrit and Marathi, <strong style={{ color: '#111111' }}>'Samadhan'</strong> means absolute inner contentment. This philosophy is the foundation of our high-fidelity cobbler guild."
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '48px', flexWrap: 'wrap' }}>
              <Link to="/products" style={{ background: '#8B0000', color: 'white', padding: '20px 48px', borderRadius: '16px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '14px', boxShadow: '0 20px 50px rgba(139,0,0,0.2)' }}>
                EXPLORE COLLECTION <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* 3D FLOATING ASSET */}
        <div ref={shoeRef} className="about-shoe-trigger" style={{ position: 'absolute', right: '5%', top: '20%', width: '40vw', pointerEvents: 'none', zIndex: 15, perspective: '6000px', transformStyle: 'preserve-3d' }}>
           <div className="relative w-full h-full transform-gpu">
             <img src={resolveImageUrl("/New-Samadhan-Shoe-Mart/Main-Shoe.png")} alt="Handcrafted Excellence" style={{ width: '100%', filter: 'drop-shadow(0 50px 100px rgba(0,0,0,0.2)) brightness(1.1) contrast(1.05)' }} />
             {/* VIRTUAL SHINE LAYER */}
             <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                  style={{ background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)', backgroundSize: '200% 100%', animation: 'shine 4s infinite linear' }}>
             </div>
           </div>
           {/* SCAN LINE */}
           <div className="absolute top-0 left-0 w-full h-[2px] bg-[#8B0000] shadow-[0_0_20px_#8B0000] animate-scan-slow opacity-30"></div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ background: '#111111', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(139,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-card" style={{ padding: '48px 32px', borderRight: i < STATS.length - 1 ? '1px solid rgba(247,245,240,0.07)' : 'none', textAlign: 'center' }}>
              <div style={{ color: '#8B0000', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>{s.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: '#F7F5F0', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(247,245,240,0.45)', textTransform: 'uppercase', marginTop: '12px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section style={{ padding: '120px 24px', background: '#F7F5F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={S.badge}><Award size={14} color="#8B0000" /><span style={S.label}>Our Story</span></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', lineHeight: 0.95, margin: '0 0 24px' }}>
              34 YEARS OF<br /><span style={{ color: '#8B0000', fontStyle: 'italic', fontWeight: 300 }}>PURE COBBLER DEDICATION</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.85, marginBottom: '20px' }}>
              New Samadhan Shoe Mart was founded in 1990 in <strong style={{ color: '#111' }}>Nashik, Maharashtra</strong>. Our founder walked into Plot No. 29, Santkrupa Niwas with one conviction: footwear should feel like an extension of the body.
            </p>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.85, marginBottom: '32px' }}>
              Three decades and 50,000+ pairs later, we remain true to that vision — stitched at <strong style={{ color: '#111' }}>12 stitches per inch</strong> with bonded German nylon, cut parallel to leather tension lines, fused under <strong style={{ color: '#111' }}>80-bar pneumatic pressure</strong>.
            </p>
            {[
              { icon: <MapPin size={16} color="#8B0000" />, text: 'Plot No 29, Santkrupa Niwas, Nashik 422003' },
              { icon: <Phone size={16} color="#8B0000" />, text: '+91 9423228843 / +91 8888644021' },
              { icon: <Mail size={16} color="#8B0000" />, text: 'info@samadhanshoemart.com' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>{item.icon}</div>
                <span style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            {/* Advanced Mastercraft Section with Glassmorphism */}
            <div className="group relative">
              <div style={{
                width: '100%',
                aspectRatio: '4/5',
                background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0d0d 40%, #111 100%)',
                borderRadius: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 40px 80px rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.2),transparent_70%)] animate-pulse"></div>
                </div>

                <img
                  src={resolveImageUrl("/New-Samadhan-Shoe-Mart/Main-Shoe.png")}
                  alt="New Samadhan Handcrafted Shoe"
                  className="w-[85%] object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                />

                {/* Floating HUD Labels (Advanced UI) */}
                <div className="absolute top-10 left-10 pointer-events-none transition-all duration-500 group-hover:translate-x-2">
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Full Grain Leather</span>
                  </div>
                </div>

                <div className="absolute bottom-32 right-10 pointer-events-none transition-all duration-500 group-hover:-translate-x-2">
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                    <Hammer size={12} className="text-[#8B0000]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">12 Stitches / Inch</span>
                  </div>
                </div>

                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 30%, rgba(139,0,0,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

                {/* Glassmorphic Badge */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-2xl transform transition-all duration-500 group-hover:translate-y-[-10px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.3em', color: '#ff6b6b', textTransform: 'uppercase', marginBottom: '4px' }}>Certified Mastercraft</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Goodyear Welted</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#8B0000] flex items-center justify-center shadow-lg shadow-red-900/40">
                      <ShieldCheck size={24} color="white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced GSAP Hover Interaction Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#8B0000] rounded-[2rem] flex flex-col items-center justify-center shadow-2xl z-20 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <div className="font-editorial text-4xl font-black text-white leading-none">34</div>
                <div className="text-[8px] font-black text-white/70 uppercase tracking-[0.3em] mt-2">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HERITAGE OF SERVICE ── */}
      <section ref={heritageRef} style={{ padding: '120px 24px', background: '#111111', color: 'white', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
           <div className="order-2 md:order-1 heritage-reveal">
             <div style={{ borderRadius: '40px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
               <img
                 src={resolveImageUrl("/New-Samadhan-Shoe-Mart/Police Family 1.jpg")}
                 alt="Trusted by Police and Defense"
                 style={{ width: '100%', display: 'block' }}
                 onError={e => { e.target.src = resolveImageUrl('/New-Samadhan-Shoe-Mart/Family 1.jpg'); }}
               />
             </div>
           </div>
           <div className="order-1 md:order-2 heritage-reveal">
             <div style={S.badge}><ShieldCheck size={14} color="#8B0000" /><span style={{...S.label, color: 'white'}}>Trusted by the Uniform</span></div>
             <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', lineHeight: 0.95, margin: '0 0 24px' }}>
               A HERITAGE <br /><span style={{ color: '#8B0000', fontStyle: 'italic', fontWeight: 300 }}>OF TRUST & SERVICE</span>
             </h2>
             <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, marginBottom: '20px' }}>
               For three decades, New Samadhan Shoe Mart has been the preferred choice for Nashik's brave police officers and defense personnel.
             </p>
             <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, marginBottom: '32px' }}>
               We understand that for those in uniform, a shoe isn't just footwear — it's a tool of the trade. Our double-welted construction and high-density soles are engineered to withstand the rigors of long patrols and high-intensity duty.
             </p>
             <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#8B0000', fontFamily: "'Playfair Display', serif" }}>34+</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Years Service</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#8B0000', fontFamily: "'Playfair Display', serif" }}>10k+</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Uniforms Fitted</div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section ref={valuesRef} style={{ padding: '120px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 80px' }}>
            <div style={S.badge}><Zap size={14} color="#8B0000" /><span style={S.label}>Our Core Values</span></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
              THE PRINCIPLES<br /><span style={{ color: '#8B0000', fontStyle: 'italic', fontWeight: 300 }}>WE NEVER COMPROMISE</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {VALUES.map((v, i) => (
              <div key={i} className="value-card" style={{ padding: '40px 32px', background: '#F7F5F0', borderRadius: '24px', border: '1px solid rgba(17,17,17,0.06)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 50px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ color: '#8B0000', marginBottom: '20px' }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 12px', color: '#111' }}>{v.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section ref={timelineRef} style={{ padding: '120px 24px', background: '#0a0a0a', color: '#F7F5F0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', background: 'radial-gradient(ellipse at right, rgba(139,0,0,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(139,0,0,0.12)', borderRadius: '20px', marginBottom: '20px' }}>
              <Clock size={14} color="#8B0000" /><span style={S.label}>Our Journey</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
              THE HERITAGE<br /><span style={{ color: '#8B0000', fontStyle: 'italic', fontWeight: 300 }}>TIMELINE</span>
            </h2>
          </div>
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <div className="timeline-line" style={{ position: 'absolute', left: '84px', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, #8B0000, rgba(139,0,0,0.15))', transformOrigin: 'top center' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {MILESTONES.map((m, i) => (
                <div key={i} className="timeline-item" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: '68px', textAlign: 'right', paddingTop: '4px' }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 900, color: '#8B0000' }}>{m.year}</span>
                  </div>
                  <div style={{ flexShrink: 0, width: '14px', height: '14px', borderRadius: '50%', background: '#8B0000', border: '3px solid #0a0a0a', boxShadow: '0 0 0 1px rgba(139,0,0,0.8)', marginTop: '4px', zIndex: 2 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 10px' }}>{m.title}</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(247,245,240,0.55)', lineHeight: 1.75, margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER ── */}
      <section ref={developerRef} style={{ padding: '120px 24px', background: '#F7F5F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={S.badge}><Code2 size={14} color="#8B0000" /><span style={S.label}>Meet The Builder</span></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
              THE DEVELOPER<br /><span style={{ color: '#8B0000', fontStyle: 'italic', fontWeight: 300 }}>BEHIND THE SCREEN</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>

            {/* Photo card */}
            <div className="dev-card">
              <div style={{ borderRadius: '32px', overflow: 'hidden', background: '#0a0a0a', boxShadow: '0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(139,0,0,0.12)' }}>
                <div style={{ aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={resolveImageUrl("/Devloper.jpg")}
                    alt="Krishna Patil Rajput - Developer & Designer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.src = resolveImageUrl('/New-Samadhan-Shoe-Mart/Devloper.jpg'); }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(10,10,10,0.9) 100%)' }} />
                  <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#d4af37', color: '#111111', padding: '8px 14px', borderRadius: '10px', fontSize: '9px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', boxShadow: '0 8px 20px rgba(212,175,55,0.4)' }}>
                    Full Stack Architect
                  </div>
                </div>
                <div style={{ padding: '28px 32px' }}>
                  <div style={{ ...S.label, marginBottom: '8px', display: 'block' }}>Website Developer &amp; Designer</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 900, color: '#F7F5F0', textTransform: 'uppercase' }}>Krishna Patil Rajput</div>
                  <div style={{ fontSize: '12px', color: 'rgba(247,245,240,0.45)', marginTop: '6px' }}>Krishna Ajaysing Patil</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {['React.js', 'Node.js', 'GSAP', 'MongoDB', 'TailwindCSS'].map(tech => (
                      <span key={tech} style={{ padding: '5px 12px', background: 'rgba(139,0,0,0.15)', border: '1px solid rgba(139,0,0,0.3)', borderRadius: '8px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: '#ff6b6b', textTransform: 'uppercase' }}>{tech}</span>
                    ))}
                  </div>

                  {/* Direct Portfolio & Website Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '22px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <a
                      href="https://www.instagram.com/krish_root_labs?stkn=YWczM2t3amUyZ3lp"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'linear-gradient(135deg, #8B0000 0%, #b30000 100%)',
                        color: 'white',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 20px rgba(139,0,0,0.4)',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Instagram size={14} /> Developer Instagram
                    </a>
                    <a
                      href="https://krishna-patil-rajput.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#F7F5F0',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    >
                      <ExternalLink size={14} /> View Portfolio
                    </a>
                    <a
                      href="https://krishnablogy.blogspot.com/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#F7F5F0',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    >
                      <Globe size={14} /> Developer Website / Blog
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="dev-info-item" style={{ marginBottom: '40px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '28px', textTransform: 'uppercase', margin: '0 0 16px' }}>
                  BUILT WITH THE SAME<br /><span style={{ color: '#8B0000', fontStyle: 'italic', fontWeight: 300 }}>ARTISAN PRECISION</span>
                </h3>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, margin: 0 }}>
                  This website was designed and developed by <strong style={{ color: '#111' }}>Krishna</strong> to embody the same craftsmanship that New Samadhan Shoe Mart brings to every pair. From 3D scroll animations to the premium design system — every detail was intentional.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: <Layers size={18} />, label: 'Architecture', value: 'React + Node.js + MongoDB Full Stack' },
                  { icon: <Zap size={18} />, label: 'Animations', value: 'GSAP ScrollTrigger · 3D CSS Transforms' },
                  { icon: <ShieldCheck size={18} />, label: 'Auth & Security', value: 'JWT · Session Guards · Admin Routes' },
                  { icon: <Globe size={18} />, label: 'Platform', value: 'Responsive · Mobile-First · PWA Ready' },
                  { icon: <Star size={18} />, label: 'Design System', value: 'Playfair Display · Inter · Burgundy Brand' },
                ].map((item, i) => (
                  <div key={i} className="dev-info-item" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '18px 24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(17,17,17,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B0000', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ ...S.label, marginBottom: '4px', display: 'block' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dev-info-item" style={{ marginTop: '36px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://www.instagram.com/krish_root_labs?stkn=YWczM2t3amUyZ3lp"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#8B0000',
                    color: 'white',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 20px rgba(139,0,0,0.3)',
                  }}
                >
                  <Instagram size={14} /> Instagram
                </a>
                <a
                  href="https://krishnablogy.blogspot.com/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'white',
                    color: '#111',
                    border: '1px solid rgba(17,17,17,0.2)',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Globe size={14} /> Blog
                </a>
                <a href="https://wa.me/918080690631" target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '14px 24px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(37,211,102,0.3)' }}>
                  <Phone size={14} /> Developer Support
                </a>
                <button
                  onClick={() => {
                    const msg = "Hello New Samadhan Shoe Mart, I am interested in your premium collection.";
                    const num = Math.random() > 0.5 ? '9423228843' : '8888644021';
                    window.open(`https://wa.me/91${num}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  style={{ background: '#8B0000', color: 'white', border: 'none', cursor: 'pointer', padding: '14px 24px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(139,0,0,0.3)' }}
                >
                  <MessageCircle size={14} /> Shop WhatsApp
                </button>
                <Link to="/products" style={{ background: '#111', color: 'white', padding: '14px 24px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Footprints size={14} /> Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEGAL POLICIES ── */}
      <section id="legal-policies" style={{ padding: '120px 24px', background: '#ffffff', borderTop: '1px solid rgba(17,17,17,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={S.badge}><ShieldCheck size={14} color="#8B0000" /><span style={S.label}>Transparency & Trust</span></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
              LEGAL &<br /><span style={{ color: '#8B0000', fontStyle: 'italic', fontWeight: 300 }}>POLICIES</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ padding: '40px', background: '#F7F5F0', borderRadius: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 900, marginBottom: '20px', color: '#111' }}>Privacy Policy</h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7 }}>
                At New Samadhan Shoe Mart, we value your privacy. We only collect essential information required to process your orders and improve your shopping experience. Your data is encrypted and never shared with third parties for marketing purposes.
              </p>
            </div>
            <div style={{ padding: '40px', background: '#F7F5F0', borderRadius: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 900, marginBottom: '20px', color: '#111' }}>Terms of Service</h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7 }}>
                By using our website, you agree to our terms. All products are subject to availability. We reserve the right to refuse service. Prices are subject to change without notice. All handcrafted items may have slight artisan variations.
              </p>
            </div>
            <div style={{ padding: '40px', background: '#F7F5F0', borderRadius: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 900, marginBottom: '20px', color: '#111' }}>Refund & Returns</h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7 }}>
                We offer a 7-day return policy for unused products in original packaging. Handcrafted custom orders are only eligible for returns in case of manufacturing defects. Refunds are processed within 5-7 business days.
              </p>
            </div>
            <div style={{ padding: '40px', background: '#F7F5F0', borderRadius: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 900, marginBottom: '20px', color: '#111' }}>Shipping Policy</h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7 }}>
                We provide Pan-India shipping. Orders are typically dispatched within 48 hours. Delivery takes 3-7 business days depending on location. Free shipping on orders above ₹2,999. Tracking details provided via SMS/Email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ background: '#8B0000', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '16px' }}>Nashik's Finest Since 1990</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 5.5rem)', textTransform: 'uppercase', lineHeight: 0.95, color: 'white', margin: '0 0 32px' }}>
            STEP INTO YOUR<br /><span style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,0.75)' }}>SAMADHAN.</span>
          </h2>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{ background: 'white', color: '#8B0000', padding: '20px 48px', borderRadius: '14px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
              Shop Collection <ArrowRight size={16} />
            </Link>
            <Link to="/workshop" style={{ background: 'transparent', color: 'white', padding: '20px 36px', borderRadius: '14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.35)' }}>
              Visit Workshop <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

