import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, Shield, Users, Eye, Heart, Key, Loader2 } from 'lucide-react';
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
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center relative overflow-hidden font-sans p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-navy-950/20 to-navy-950/80"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blue-500/10 border-dashed animate-[spin_60s_linear_infinite]"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl w-full mx-auto"
      >
        {/* Logo & Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20 mb-6 border border-blue-400/30">
            <Radar className="w-10 h-10 text-white animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            TRACE-X
          </h1>
          
          <p className="text-xl md:text-2xl font-bold text-gradient mb-2">
            "Don't just search the evidence. Find the evidence you're missing."
          </p>
          
          <p className="text-sm md:text-base text-navy-400 max-w-xl mx-auto font-medium">
            An uncertainty-aware investigation intelligence platform for missing and vulnerable persons.
          </p>
        </motion.div>

        {/* Roles Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Police / Investigator */}
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => handleLogin('police')}
              disabled={isLoggingIn !== null}
              className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer
                ${isLoggingIn === 'police' ? 'bg-blue-900/40 border-blue-500 scale-[0.98]' : 'bg-navy-900/50 border-navy-700/60 hover:bg-blue-900/20 hover:border-blue-500/50'}
              `}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                {isLoggingIn === 'police' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 font-sans flex items-center gap-2">
                Police / Investigator
                <span className="text-[10px] uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Level 4 Access</span>
              </h3>
              
              <p className="text-sm text-navy-300 font-sans">
                Full investigation command access. View case certainty DNA, competing hypotheses, gaps, and run Next Best Evidence engine.
              </p>
            </button>
          </motion.div>

          {/* NGO Partner */}
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => handleLogin('ngo')}
              disabled={isLoggingIn !== null}
              className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer
                ${isLoggingIn === 'ngo' ? 'bg-emerald-900/40 border-emerald-500 scale-[0.98]' : 'bg-navy-900/50 border-navy-700/60 hover:bg-emerald-900/20 hover:border-emerald-500/50'}
              `}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 group-hover:text-emerald-300 transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                {isLoggingIn === 'ngo' && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 font-sans flex items-center gap-2">
                NGO Partner
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Level 3 Access</span>
              </h3>
              
              <p className="text-sm text-navy-300 font-sans">
                Access assigned cases, submit structured NGO reports, and collaborate on search priorities.
              </p>
            </button>
          </motion.div>

          {/* Verified Volunteer */}
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => handleLogin('volunteer')}
              disabled={isLoggingIn !== null}
              className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer
                ${isLoggingIn === 'volunteer' ? 'bg-amber-900/40 border-amber-500 scale-[0.98]' : 'bg-navy-900/50 border-navy-700/60 hover:bg-amber-900/20 hover:border-amber-500/50'}
              `}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 group-hover:text-amber-300 transition-colors">
                  <Eye className="w-6 h-6" />
                </div>
                {isLoggingIn === 'volunteer' && <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 font-sans flex items-center gap-2">
                Verified Volunteer
                <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Level 2 Access</span>
              </h3>
              
              <p className="text-sm text-navy-300 font-sans">
                Submit on-ground citizen sightings securely without accessing confidential case details.
              </p>
            </button>
          </motion.div>

          {/* Family */}
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => handleLogin('family')}
              disabled={isLoggingIn !== null}
              className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer
                ${isLoggingIn === 'family' ? 'bg-purple-900/40 border-purple-500 scale-[0.98]' : 'bg-navy-900/50 border-navy-700/60 hover:bg-purple-900/20 hover:border-purple-500/50'}
              `}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 group-hover:text-purple-300 transition-colors">
                  <Heart className="w-6 h-6" />
                </div>
                {isLoggingIn === 'family' && <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 font-sans flex items-center gap-2">
                Family Member
                <span className="text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Level 1 Access</span>
              </h3>
              
              <p className="text-sm text-navy-300 font-sans">
                View approved case status updates and verified progress on family missing-person reports.
              </p>
            </button>
          </motion.div>
        </div>

        {/* Authentication Notice */}
        <motion.div variants={itemVariants} className="mt-10 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 text-navy-400 text-sm mb-3">
            <Key className="w-4 h-4 text-blue-400" />
            <span>Role-Based Auth Gateway — Smart India Hackathon 2026 (PSS2)</span>
          </div>
          
          <div className="prototype-badge">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            TRACE-X Prototype Simulation Engine
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
