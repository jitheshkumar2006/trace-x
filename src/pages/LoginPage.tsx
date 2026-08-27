import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, Shield, Users, Eye, Heart, Loader2, Wifi, Database, Cpu, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import type { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  const handleLogin = (role: UserRole) => {
    setIsLoggingIn(role);
    setTimeout(() => {
      login(role);
      navigate('/dashboard');
    }, 400);
  };

  const roles = [
    {
      role: 'police' as UserRole,
      label: 'Police / Investigator',
      badge: 'FULL COMMAND ACCESS',
      desc: 'Access evidence graph, uncertainty gap analyzer, and Next Best Evidence ranking engine.',
      icon: <Shield className="w-6 h-6" />,
      accentColor: '#38BDF8',
      borderClass: 'border-sky-500/60 hover:border-sky-400',
      glowClass: 'hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]',
      iconBox: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    },
    {
      role: 'ngo' as UserRole,
      label: 'NGO Partner',
      badge: 'CASE COLLABORATION',
      desc: 'Manage assigned vulnerable person cases and submit structured field verification reports.',
      icon: <Users className="w-6 h-6" />,
      accentColor: '#00FF66',
      borderClass: 'border-[#00FF66]/60 hover:border-[#00FF66]',
      glowClass: 'hover:shadow-[0_0_25px_rgba(0,255,102,0.35)]',
      iconBox: 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/40',
      badgeClass: 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/40',
    },
    {
      role: 'volunteer' as UserRole,
      label: 'Field Volunteer',
      badge: 'GROUND SEARCH OPS',
      desc: 'View candidate search priority zones and submit immediate ground citizen sightings.',
      icon: <Eye className="w-6 h-6" />,
      accentColor: '#F59E0B',
      borderClass: 'border-amber-500/60 hover:border-amber-400',
      glowClass: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]',
      iconBox: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      role: 'family' as UserRole,
      label: 'Family Portal',
      badge: 'VERIFIED STATUS FEED',
      desc: 'View approved case milestone status, verified sighting summaries, and direct contact line.',
      icon: <Heart className="w-6 h-6" />,
      accentColor: '#C084FC',
      borderClass: 'border-purple-500/60 hover:border-purple-400',
      glowClass: 'hover:shadow-[0_0_25px_rgba(192,132,252,0.35)]',
      iconBox: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B12] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none"
         style={{
           backgroundImage: 'radial-gradient(ellipse at 50% 10%, #0d1e18 0%, #070B12 75%)'
         }}>
      
      {/* Background subtle technical grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'linear-gradient(rgba(0,255,102,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.15) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} />

      <div className="relative z-10 max-w-3xl w-full mx-auto space-y-6">
        
        {/* ── Top Live System Status Header ──────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0D1624] border border-[#00FF66]/40 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,255,102,0.15)] font-mono text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="live-pulse-neon-green" />
            <span className="text-[#00FF66] font-bold tracking-wider">DOOMSDAY COMMAND TELEMETRY</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-[#00FF66]" /> UPLINK: <strong className="text-white">ONLINE</strong></span>
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-[#00FF66]" /> DB: <strong className="text-white">ACTIVE</strong></span>
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#00FF66]" /> AI: <strong className="text-white">ARMED</strong></span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#00FF66]" /> TLS 1.3</span>
          </div>
        </motion.div>

        {/* ── Brand Header ───────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0C1E18] border-2 border-[#00FF66] mb-1 shadow-[0_0_30px_rgba(0,255,102,0.4)]">
            <Radar className="w-11 h-11 neon-icon-green radar-spin" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-[0.2em] font-mono neon-text-green">
            TRACE-X
          </h1>

          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-[#00FF66]/60" />
            <p className="text-xs sm:text-sm font-extrabold text-[#00FF66] font-mono uppercase tracking-widest">
              INVESTIGATION INTELLIGENCE PLATFORM
            </p>
            <span className="h-px w-8 bg-[#00FF66]/60" />
          </div>

          <p className="text-sm text-slate-200 font-medium max-w-md mx-auto italic font-serif">
            "Find the evidence you're missing."
          </p>
        </motion.div>

        {/* ── Role Access Cards Grid ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {roles.map((r, i) => (
            <motion.button
              key={r.role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              onClick={() => handleLogin(r.role)}
              disabled={isLoggingIn !== null}
              className={`p-5 rounded-xl border bg-[#0E1624] text-left transition-all duration-200 cursor-pointer relative overflow-hidden font-mono group ${r.borderClass} ${r.glowClass} ${
                isLoggingIn === r.role ? 'ring-2 ring-[#00FF66] scale-[0.99] bg-[#142236]' : ''
              }`}
            >
              {/* Top Accent Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00FF66] to-transparent opacity-80" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border ${r.iconBox} shadow-sm transition-transform group-hover:scale-110`}>
                    {r.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white group-hover:text-[#00FF66] transition-colors">
                      {r.label}
                    </h2>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-0.5 ${r.badgeClass}`}>
                      {r.badge}
                    </span>
                  </div>
                </div>

                {isLoggingIn === r.role ? (
                  <Loader2 className="w-5 h-5 text-[#00FF66] animate-spin flex-shrink-0" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#00FF66] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                )}
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {r.desc}
              </p>
            </motion.button>
          ))}
        </div>

        {/* ── Public Sighting Banner ─────────────────────── */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-2 text-center"
        >
          <a
            href="#/report"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0C1E18] border border-[#00FF66]/60 text-xs font-mono font-bold text-[#00FF66] hover:bg-[#00FF66]/20 hover:border-[#00FF66] transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)]"
          >
            <Eye className="w-4 h-4 neon-icon-green" />
            <span>🌐 PUBLIC SIGHTING PORTAL — REPORT LEAD WITHOUT LOGIN</span>
          </a>
        </motion.div>

        {/* ── Security Classification Footer ─────────────── */}
        <div className="pt-2 border-t border-[#1D2B3D] text-center">
          <p className="text-[11px] text-[#00FF66]/80 font-mono uppercase tracking-widest font-bold">
            CLASSIFICATION: RESTRICTED LAW ENFORCEMENT & PUBLIC SAFETY SYSTEM
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
