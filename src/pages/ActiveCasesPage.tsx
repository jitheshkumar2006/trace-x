import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useStore';
import type { Case } from '../types';

export const ActiveCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases, setActiveCase } = useAppStore();
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const handleCaseClick = (caseId: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.expand-toggle')) {
      return;
    }
    setActiveCase(caseId);
    navigate('/dashboard');
  };

  const toggleExpand = (caseId: string) => {
    setExpandedCaseId(expandedCaseId === caseId ? null : caseId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-sky-400" />
            ACTIVE CASE REGISTRY
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">OPERATIONAL INVESTIGATION REGISTRY & CERTAINTY PROFILES</p>
        </div>
        <button
          onClick={() => navigate('/cases/create')}
          className="btn-primary flex items-center gap-2 font-mono text-xs uppercase"
        >
          <Plus className="w-4 h-4" />
          Create New Case
        </button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 font-mono text-xs"
      >
        {cases.map((c: Case) => (
          <motion.div
            key={c.id}
            variants={itemVariants}
            className="glass-card hover:bg-[#111821] transition-colors cursor-pointer group p-5 border border-[#1D2733]"
            onClick={(e) => handleCaseClick(c.id, e)}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  {c.person.photograph ? (
                    <img
                      src={c.person.photograph}
                      alt={c.person.name}
                      className="w-14 h-14 rounded-lg object-cover border border-[#1D2733]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-[#080B10] flex items-center justify-center border border-[#1D2733] text-sky-400 font-bold text-lg">
                      {c.person.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-base">{c.person.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        {c.id}
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] bg-[#111821] text-[#8B98A8] border border-[#1D2733]">
                        {c.person.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[#8B98A8] text-xs mt-1.5 font-sans">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        {c.person.lastKnownLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-[#8B98A8] uppercase">OVERALL CERTAINTY</div>
                    <div className="text-xl font-bold text-sky-400">{c.certainty.overall}%</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(c.id);
                    }}
                    className="expand-toggle p-2 rounded-lg bg-[#080B10] border border-[#1D2733] text-[#8B98A8] hover:text-white"
                  >
                    {expandedCaseId === c.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="certainty-bar h-1.5">
                <div
                  className="certainty-bar-fill bg-sky-400"
                  style={{ width: `${c.certainty.overall}%` }}
                />
              </div>

              {/* Expanded Appearance Profile */}
              <AnimatePresence>
                {expandedCaseId === c.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pt-4 border-t border-[#1D2733] space-y-3 font-sans"
                  >
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-400">
                      <ShieldCheck size={14} />
                      AI APPEARANCE ANALYSIS PROFILE
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="bg-[#080B10] p-2.5 rounded border border-[#1D2733]">
                        <span className="text-[#8B98A8] block text-[10px]">CLOTHING</span>
                        <span className="text-white">{c.appearance?.clothing || 'Dark jacket'}</span>
                      </div>
                      <div className="bg-[#080B10] p-2.5 rounded border border-[#1D2733]">
                        <span className="text-[#8B98A8] block text-[10px]">OBJECT</span>
                        <span className="text-white">{c.appearance?.backpackOrObject || 'Backpack'}</span>
                      </div>
                      <div className="bg-[#080B10] p-2.5 rounded border border-[#1D2733]">
                        <span className="text-[#8B98A8] block text-[10px]">SHOES</span>
                        <span className="text-white">{c.appearance?.shoes || 'Dark sneakers'}</span>
                      </div>
                      <div className="bg-[#080B10] p-2.5 rounded border border-[#1D2733]">
                        <span className="text-[#8B98A8] block text-[10px]">HAIR</span>
                        <span className="text-white">{c.appearance?.hair || 'Short black hair'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ActiveCasesPage;
