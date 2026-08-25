import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, Users, Eye, Heart, Loader2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 relative font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full mx-auto space-y-8 text-center"
      >
        {/* Logo & Headline */}
        <div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 mb-4 text-white">
            <Activity className="w-7 h-7" />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">TRACE-X</h1>
          <p className="text-sm font-semibold text-blue-400 mt-1">
            "Don't just search the evidence. Find the evidence you're missing."
          </p>
          <p className="text-xs text-navy-400 mt-2 max-w-md mx-auto">
            An uncertainty-aware investigation intelligence platform for missing and vulnerable persons.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Police */}
          <button
            onClick={() => handleLogin('police')}
            disabled={isLoggingIn !== null}
            className={`p-5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
              isLoggingIn === 'police'
                ? 'bg-blue-950/60 border-blue-500'
                : 'bg-navy-900/60 border-navy-800 hover:border-navy-700 hover:bg-navy-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              {isLoggingIn === 'police' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Police / Investigator</h3>
            <p className="text-xs text-navy-400">Full command access to evidence graph, uncertainty gaps, and Next Best Evidence engine.</p>
          </button>

          {/* NGO */}
          <button
            onClick={() => handleLogin('ngo')}
            disabled={isLoggingIn !== null}
            className={`p-5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
              isLoggingIn === 'ngo'
                ? 'bg-emerald-950/60 border-emerald-500'
                : 'bg-navy-900/60 border-navy-800 hover:border-navy-700 hover:bg-navy-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              {isLoggingIn === 'ngo' && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />}
            </div>
            <h3 className="text-sm font-bold text-white mb-1">NGO Partner</h3>
            <p className="text-xs text-navy-400">Access assigned cases and submit structured field reports.</p>
          </button>

          {/* Volunteer */}
          <button
            onClick={() => handleLogin('volunteer')}
            disabled={isLoggingIn !== null}
            className={`p-5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
              isLoggingIn === 'volunteer'
                ? 'bg-amber-950/60 border-amber-500'
                : 'bg-navy-900/60 border-navy-800 hover:border-navy-700 hover:bg-navy-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                <Eye className="w-5 h-5" />
              </div>
              {isLoggingIn === 'volunteer' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Verified Volunteer</h3>
            <p className="text-xs text-navy-400">Submit on-ground citizen sightings without accessing confidential data.</p>
          </button>

          {/* Family */}
          <button
            onClick={() => handleLogin('family')}
            disabled={isLoggingIn !== null}
            className={`p-5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
              isLoggingIn === 'family'
                ? 'bg-purple-950/60 border-purple-500'
                : 'bg-navy-900/60 border-navy-800 hover:border-navy-700 hover:bg-navy-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded bg-purple-500/10 text-purple-400">
                <Heart className="w-5 h-5" />
              </div>
              {isLoggingIn === 'family' && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Family Portal</h3>
            <p className="text-xs text-navy-400">View approved updates and verified progress on case files.</p>
          </button>
        </div>

        {/* Public Sighting Portal Link — No Login Needed */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-4 text-center space-y-2">
          <p className="text-xs text-emerald-300 font-semibold">
            👁️ Are you a member of the public who spotted a missing person?
          </p>
          <button
            onClick={() => navigate('/report')}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Submit a Sighting — No Login Needed
          </button>
          <p className="text-[10px] text-navy-500">100% anonymous • No account required • Your identity stays private</p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-navy-500 font-mono">
          Smart India Hackathon 2026 • Problem Statement PSS2
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
