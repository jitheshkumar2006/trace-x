// ============================================================
// TRACE-X — Role-Based Secure Access & Case Portal
// Unified Gateway with strict credential validation, simulated transitions,
// and specialized authentication for Police, Family, NGO, and Volunteer
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Building2,
  Compass,
  Lock,
  ArrowRight,
  AlertTriangle,
  Info,
  ChevronLeft,
  Eye,
  EyeOff,
  Radar
} from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import type { UserRole } from '../types';

type AccessMode = 'select' | 'police' | 'family' | 'ngo' | 'volunteer';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [mode, setMode] = useState<AccessMode>('select');

  // Form states
  const [policeId, setPoliceId] = useState('');
  const [policePassword, setPolicePassword] = useState('');
  const [policeAttempts, setPoliceAttempts] = useState(0);
  const [policeLocked, setPoliceLocked] = useState(false);
  const [policeLockTimer, setPoliceLockTimer] = useState(0);

  const [familyTrackingId, setFamilyTrackingId] = useState('');

  const [ngoId, setNgoId] = useState('');
  const [ngoPassword, setNgoPassword] = useState('');
  const [ngoAttempts, setNgoAttempts] = useState(0);

  const [volunteerId, setVolunteerId] = useState('');
  const [volunteerPin, setVolunteerPin] = useState('');
  const [volunteerAttempts, setVolunteerAttempts] = useState(0);

  // Common UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [demoCredsModal, setDemoCredsModal] = useState<AccessMode | null>(null);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

  // Transition / Verifying sequence state
  const [authSequence, setAuthSequence] = useState<{
    role: UserRole;
    step: number;
    text: string;
  } | null>(null);

  // Shake trigger helper
  const triggerShake = (msg: string) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  // Start smooth auth sequence
  const startAuthSuccess = (role: UserRole, targetRoute: string) => {
    setErrorMessage(null);
    setAuthSequence({ role, step: 1, text: 'AUTHENTICATING...' });

    setTimeout(() => {
      setAuthSequence({ role, step: 2, text: 'VERIFYING AUTHORIZED ID & PERMISSIONS...' });
    }, 450);

    setTimeout(() => {
      setAuthSequence({ role, step: 3, text: 'ACCESS VERIFIED — ENTERING SYSTEM' });
    }, 900);

    setTimeout(() => {
      login(role);
      navigate(targetRoute);
    }, 1400);
  };

  // ─── 1. Police Auth Handler ─────────────────────────────────
  const handlePoliceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (policeLocked) return;

    const trimmedId = policeId.trim();
    const trimmedPass = policePassword.trim();

    // Valid demo credentials
    if (
      (trimmedId === 'POLICE-DEMO-001' && trimmedPass === 'TraceX@2026') ||
      (trimmedId.toLowerCase() === 'police' && trimmedPass.toLowerCase() === 'demo')
    ) {
      startAuthSuccess('police', '/dashboard');
    } else {
      const newAttempts = policeAttempts + 1;
      setPoliceAttempts(newAttempts);

      if (newAttempts >= 3) {
        setPoliceLocked(true);
        setPoliceLockTimer(15);
        triggerShake('TEMPORARY ACCESS LOCK: Too many unsuccessful attempts. Please try again.');

        const interval = setInterval(() => {
          setPoliceLockTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setPoliceLocked(false);
              setPoliceAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        triggerShake(`ACCESS DENIED: Invalid authorized ID or password. (Attempt ${newAttempts}/3)`);
      }
    }
  };

  // ─── 2. Family Case Tracking Handler ─────────────────────────
  const handleFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = familyTrackingId.trim().toUpperCase();

    // Valid demo tracking ID
    if (trimmedId === 'TRX-2026-001' || trimmedId === 'TRX-2026-004' || trimmedId === 'TRX-2026-008') {
      setErrorMessage(null);
      setAuthSequence({ role: 'family', step: 1, text: `VERIFYING CASE ${trimmedId}...` });

      setTimeout(() => {
        setAuthSequence({ role: 'family', step: 2, text: '✓ Tracking ID recognized • ✓ Case access verified' });
      }, 500);

      setTimeout(() => {
        setAuthSequence({ role: 'family', step: 3, text: 'OPENING SECURE FAMILY PORTAL' });
      }, 950);

      setTimeout(() => {
        login('family');
        navigate('/family');
      }, 1400);
    } else {
      triggerShake('INVALID TRACKING ID: Case reference not found. Please verify with your investigating officer.');
    }
  };

  // ─── 3. NGO Auth Handler ────────────────────────────────────
  const handleNgoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = ngoId.trim();
    const trimmedPass = ngoPassword.trim();

    if (
      (trimmedId === 'NGO-DEMO-001' && trimmedPass === 'TraceX@NGO2026') ||
      (trimmedId.toLowerCase() === 'ngo' && trimmedPass.toLowerCase() === 'demo')
    ) {
      startAuthSuccess('ngo', '/ngo');
    } else {
      const newAttempts = ngoAttempts + 1;
      setNgoAttempts(newAttempts);
      triggerShake('ACCESS DENIED: Invalid NGO ID or password.');
    }
  };

  // ─── 4. Volunteer Auth Handler ──────────────────────────────
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = volunteerId.trim();
    const trimmedPin = volunteerPin.trim();

    if (
      (trimmedId === 'VOL-DEMO-001' && trimmedPin === '2026') ||
      (trimmedId.toLowerCase() === 'vol' && trimmedPin === '2026')
    ) {
      startAuthSuccess('volunteer', '/volunteer');
    } else {
      const newAttempts = volunteerAttempts + 1;
      setVolunteerAttempts(newAttempts);
      triggerShake('ACCESS DENIED: Invalid volunteer ID or access PIN.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Ambience & Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Security Header */}
      <header className="w-full border-b border-[#1A2638] bg-[#070B12]/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Radar className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wider font-mono text-white">TRACE-X</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
                v2.6
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Investigation Intelligence Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#22c55e]" />
            SECURE SYSTEM
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        {/* Full-screen Loading / Auth Transition */}
        {authSequence ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-2xl bg-[#0B1320]/90 border border-sky-500/40 backdrop-blur-xl text-center space-y-6 shadow-2xl"
          >
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-sky-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-sky-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-ping" />
              <div className="w-full h-full flex items-center justify-center text-sky-400">
                <Lock className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2 font-mono">
              <div className="text-xs text-sky-400 uppercase tracking-widest font-bold">
                SECURE AUTHENTICATION
              </div>
              <h3 className="text-base font-extrabold text-white">{authSequence.text}</h3>
              <div className="w-full bg-[#162235] h-1.5 rounded-full overflow-hidden mt-4">
                <motion.div
                  className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full"
                  initial={{ width: '20%' }}
                  animate={{ width: `${(authSequence.step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ─────────────────────────────────────────────────────────────
                MODE 1: ACCESS TYPE SELECTOR (Landing Page)
            ────────────────────────────────────────────────────────────── */}
            {mode === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full max-w-4xl space-y-8 text-center"
              >
                {/* Branding Hero */}
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    ROLE-BASED ZERO-TRUST CASE ECOSYSTEM
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
                    TRACE<span className="text-sky-400">-X</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
                    Uncertainty-aware investigation intelligence platform for missing and vulnerable persons.
                  </p>
                </div>

                {/* Section Header */}
                <div className="pt-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
                    SELECT ACCESS TYPE
                  </div>

                  {/* 4 Large Access Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                    {/* Card 1: POLICE / AUTHORITY */}
                    <div
                      onClick={() => {
                        setMode('police');
                        setErrorMessage(null);
                      }}
                      className="group p-5 rounded-xl bg-[#0D1624] border border-sky-500/30 hover:border-sky-400 hover:bg-[#112035] hover:shadow-[0_0_20px_rgba(56,189,248,0.18)] transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white font-mono tracking-wide group-hover:text-sky-300">
                            POLICE / AUTHORITY
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Authorized investigation personnel with full command center intelligence access.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#1C2C42] flex items-center justify-between text-xs font-mono text-sky-400">
                        <span>Investigator Login</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 2: FAMILY */}
                    <div
                      onClick={() => {
                        setMode('family');
                        setErrorMessage(null);
                      }}
                      className="group p-5 rounded-xl bg-[#0D1624] border border-purple-500/30 hover:border-purple-400 hover:bg-[#1b152d] hover:shadow-[0_0_20px_rgba(168,85,247,0.18)] transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                          <Search className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white font-mono tracking-wide group-hover:text-purple-300">
                            FAMILY
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Access approved case status, timeline milestones, and updates using a tracking ID.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#1C2C42] flex items-center justify-between text-xs font-mono text-purple-400">
                        <span>Track Case</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 3: NGO */}
                    <div
                      onClick={() => {
                        setMode('ngo');
                        setErrorMessage(null);
                      }}
                      className="group p-5 rounded-xl bg-[#0D1624] border border-emerald-500/30 hover:border-emerald-400 hover:bg-[#0f2425] hover:shadow-[0_0_20px_rgba(16,185,129,0.18)] transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white font-mono tracking-wide group-hover:text-emerald-300">
                            NGO PARTNER
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Authorized welfare partner access to assigned search zones and field reporting.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#1C2C42] flex items-center justify-between text-xs font-mono text-emerald-400">
                        <span>Partner Login</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 4: FIELD VOLUNTEER */}
                    <div
                      onClick={() => {
                        setMode('volunteer');
                        setErrorMessage(null);
                      }}
                      className="group p-5 rounded-xl bg-[#0D1624] border border-amber-500/30 hover:border-amber-400 hover:bg-[#241c10] hover:shadow-[0_0_20px_rgba(245,158,11,0.18)] transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white font-mono tracking-wide group-hover:text-amber-300">
                            FIELD VOLUNTEER
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Focused field portal to verify assigned search sectors and submit immediate sightings.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#1C2C42] flex items-center justify-between text-xs font-mono text-amber-400">
                        <span>Field Portal</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Public Citizen Sighting Report Button */}
                  <div className="mt-6 pt-6 border-t border-[#1C2733]">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 text-center">
                      ARE YOU A MEMBER OF THE PUBLIC?
                    </div>
                    <button
                      onClick={() => navigate('/report')}
                      className="w-full group flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-[#0E1522] border border-orange-500/40 hover:border-orange-400 hover:bg-[#141c2c] hover:shadow-[0_0_18px_rgba(251,146,60,0.15)] transition-all duration-200 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white font-mono tracking-wide group-hover:text-orange-300">
                            REPORT A SIGHTING
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Seen something that may help? Submit an anonymous tip — no login or account required
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase">
                          PUBLIC
                        </span>
                        <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                MODE 2: POLICE / AUTHORITY LOGIN FORM
            ────────────────────────────────────────────────────────────── */}
            {mode === 'police' && (
              <motion.div
                key="police"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#0C1420]/95 border border-sky-500/40 shadow-2xl backdrop-blur-xl space-y-6 ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                {/* Back button & Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMode('select');
                      setErrorMessage(null);
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCredsModal('police')}
                    className="px-2.5 py-1 rounded text-[11px] font-mono text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all cursor-pointer"
                  >
                    View Demo Credentials
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-2">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                    AUTHORIZED PERSONNEL ACCESS
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">TRACE-X LAW ENFORCEMENT DESK</p>
                </div>

                {/* Subtle Warning */}
                <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-lg text-[11px] text-sky-200/90 leading-relaxed font-sans">
                  <strong className="font-mono text-sky-300 block mb-0.5 uppercase tracking-wider">
                    AUTHORIZED ACCESS ONLY
                  </strong>
                  This portal is restricted to authorized investigation personnel. All actions are cryptographically signed and logged.
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-lg text-xs text-red-300 font-mono flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handlePoliceSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-300 mb-1.5 uppercase font-semibold text-[11px]">
                      AUTHORIZED ID
                    </label>
                    <input
                      type="text"
                      value={policeId}
                      onChange={(e) => setPoliceId(e.target.value)}
                      placeholder="e.g. POLICE-DEMO-001"
                      disabled={policeLocked}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-300 uppercase font-semibold text-[11px]">PASSWORD</label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordModal(true)}
                        className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={policePassword}
                        onChange={(e) => setPolicePassword(e.target.value)}
                        placeholder="••••••••••••"
                        disabled={policeLocked}
                        className="input-field pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={policeLocked}
                    className="w-full btn-primary text-xs font-mono font-bold py-3 uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-lg"
                  >
                    <Lock className="w-4 h-4" />
                    {policeLocked ? `LOCKED (${policeLockTimer}s)` : 'SECURE LOGIN'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                MODE 3: FAMILY CASE TRACKING FORM
            ────────────────────────────────────────────────────────────── */}
            {mode === 'family' && (
              <motion.div
                key="family"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#0C1420]/95 border border-purple-500/40 shadow-2xl backdrop-blur-xl space-y-6 ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMode('select');
                      setErrorMessage(null);
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCredsModal('family')}
                    className="px-2.5 py-1 rounded text-[11px] font-mono text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all cursor-pointer"
                  >
                    View Demo Tracking ID
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-2">
                    <Search className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                    CASE TRACKING ACCESS
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Enter the tracking ID provided for your case.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-lg text-xs text-red-300 font-mono flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleFamilySubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-300 mb-1.5 uppercase font-semibold text-[11px]">
                      CASE TRACKING ID
                    </label>
                    <input
                      type="text"
                      value={familyTrackingId}
                      onChange={(e) => setFamilyTrackingId(e.target.value)}
                      placeholder="e.g. TRX-2026-001"
                      className="input-field tracking-wider font-bold"
                      required
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    Families receive verified milestone status, approved location windows, and direct investigator contact channels. Confidential operational notes remain shielded.
                  </p>

                  <button
                    type="submit"
                    className="w-full btn-primary bg-purple-600 hover:bg-purple-500 border-purple-400/40 text-xs font-mono font-bold py-3 uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    VIEW CASE STATUS
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                MODE 4: NGO ACCESS FORM
            ────────────────────────────────────────────────────────────── */}
            {mode === 'ngo' && (
              <motion.div
                key="ngo"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#0C1420]/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl space-y-6 ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMode('select');
                      setErrorMessage(null);
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCredsModal('ngo')}
                    className="px-2.5 py-1 rounded text-[11px] font-mono text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer"
                  >
                    View Demo Credentials
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                    AUTHORIZED NGO ACCESS
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">WELFARE & PARTNER DESK</p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-lg text-xs text-red-300 font-mono flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleNgoSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-300 mb-1.5 uppercase font-semibold text-[11px]">
                      NGO ID
                    </label>
                    <input
                      type="text"
                      value={ngoId}
                      onChange={(e) => setNgoId(e.target.value)}
                      placeholder="e.g. NGO-DEMO-001"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1.5 uppercase font-semibold text-[11px]">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={ngoPassword}
                        onChange={(e) => setNgoPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="input-field pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary bg-emerald-600 hover:bg-emerald-500 border-emerald-400/40 text-xs font-mono font-bold py-3 uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-lg"
                  >
                    <Lock className="w-4 h-4" />
                    SECURE LOGIN
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                MODE 5: FIELD VOLUNTEER ACCESS FORM
            ────────────────────────────────────────────────────────────── */}
            {mode === 'volunteer' && (
              <motion.div
                key="volunteer"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#0C1420]/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl space-y-6 ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMode('select');
                      setErrorMessage(null);
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCredsModal('volunteer')}
                    className="px-2.5 py-1 rounded text-[11px] font-mono text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                  >
                    View Demo PIN
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                    FIELD VOLUNTEER ACCESS
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">ASSIGNED SEARCH PORTAL</p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-lg text-xs text-red-300 font-mono flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-300 mb-1.5 uppercase font-semibold text-[11px]">
                      VOLUNTEER ID
                    </label>
                    <input
                      type="text"
                      value={volunteerId}
                      onChange={(e) => setVolunteerId(e.target.value)}
                      placeholder="e.g. VOL-DEMO-001"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1.5 uppercase font-semibold text-[11px]">
                      ACCESS PIN (4-DIGIT)
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={volunteerPin}
                      onChange={(e) => setVolunteerPin(e.target.value)}
                      placeholder="••••"
                      className="input-field tracking-widest text-center text-sm font-bold"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary bg-amber-600 hover:bg-amber-500 border-amber-400/40 text-xs font-mono font-bold py-3 uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-lg"
                  >
                    <Compass className="w-4 h-4" />
                    ENTER FIELD PORTAL
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer Security Notice */}
      <footer className="w-full border-t border-[#162232] bg-[#070B12]/80 backdrop-blur px-6 py-3 text-center text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <span>● AUDIT ACTIVE</span>
          <span>•</span>
          <span>AES-256 ENCRYPTED</span>
          <span>•</span>
          <span>LEAST-PRIVILEGE RBAC</span>
        </div>
        <div>Simulated Environment for Evaluation & Demonstration Only</div>
      </footer>

      {/* Demo Credentials Modal */}
      {demoCredsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0D1624] border border-[#22344B] rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4 font-mono text-left"
          >
            <div className="flex items-center justify-between border-b border-[#1E2D42] pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {demoCredsModal === 'family' ? 'DEMO CASE' : 'DEMO ENVIRONMENT'}
                </h3>
              </div>
              <button
                onClick={() => setDemoCredsModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {demoCredsModal === 'police' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#080E18] rounded-lg border border-sky-500/30 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Authorized ID:</span>
                    <p className="font-bold text-sky-300 select-all">POLICE-DEMO-001</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Password:</span>
                    <p className="font-bold text-sky-300 select-all">TraceX@2026</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  These credentials are for prototype demonstration only.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPoliceId('POLICE-DEMO-001');
                    setPolicePassword('TraceX@2026');
                    setDemoCredsModal(null);
                  }}
                  className="w-full btn-primary text-xs py-2 bg-sky-600 hover:bg-sky-500"
                >
                  Auto-Fill Police Credentials
                </button>
              </div>
            )}

            {demoCredsModal === 'family' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#080E18] rounded-lg border border-purple-500/30 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Tracking ID:</span>
                    <p className="font-bold text-purple-300 select-all">TRX-2026-001</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Prototype demonstration only.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFamilyTrackingId('TRX-2026-001');
                    setDemoCredsModal(null);
                  }}
                  className="w-full btn-primary text-xs py-2 bg-purple-600 hover:bg-purple-500"
                >
                  Auto-Fill Tracking ID
                </button>
              </div>
            )}

            {demoCredsModal === 'ngo' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#080E18] rounded-lg border border-emerald-500/30 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">NGO ID:</span>
                    <p className="font-bold text-emerald-300 select-all">NGO-DEMO-001</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Password:</span>
                    <p className="font-bold text-emerald-300 select-all">TraceX@NGO2026</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Fictional prototype credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNgoId('NGO-DEMO-001');
                    setNgoPassword('TraceX@NGO2026');
                    setDemoCredsModal(null);
                  }}
                  className="w-full btn-primary text-xs py-2 bg-emerald-600 hover:bg-emerald-500"
                >
                  Auto-Fill NGO Credentials
                </button>
              </div>
            )}

            {demoCredsModal === 'volunteer' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#080E18] rounded-lg border border-amber-500/30 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Volunteer ID:</span>
                    <p className="font-bold text-amber-300 select-all">VOL-DEMO-001</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Access PIN:</span>
                    <p className="font-bold text-amber-300 select-all">2026</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Use fictional credentials only.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setVolunteerId('VOL-DEMO-001');
                    setVolunteerPin('2026');
                    setDemoCredsModal(null);
                  }}
                  className="w-full btn-primary text-xs py-2 bg-amber-600 hover:bg-amber-500"
                >
                  Auto-Fill Volunteer PIN
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0D1624] border border-sky-500/40 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4 font-mono text-center"
          >
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              PASSWORD RECOVERY PROTOCOL
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              In accordance with law enforcement operational security guidelines, automated password resets are disabled.
            </p>
            <div className="p-3 bg-[#080E18] rounded-lg border border-[#1E2D42] text-xs text-sky-300 font-semibold">
              Contact system administrator.
            </div>
            <button
              onClick={() => setForgotPasswordModal(false)}
              className="w-full btn-ghost text-xs py-2"
            >
              Return to Login
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
