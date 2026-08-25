import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Plus,
  ShieldCheck,
  Activity
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
      <div className="flex justify-between items-center border-b border-navy-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
            <Briefcase className="w-6 h-6 text-blue-400" />
            Active Cases
          </h1>
          <p className="text-xs text-navy-400 mt-1">Manage and monitor missing person case investigations</p>
        </div>
        <button
          onClick={() => navigate('/cases/create')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Case
        </button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6"
      >
        {cases.map((c: Case) => (
          <motion.div
            key={c.id}
            variants={itemVariants}
            className="glass-card hover:bg-navy-800/40 transition-colors cursor-pointer group"
            onClick={(e) => handleCaseClick(c.id, e)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  {c.person.photograph ? (
                    <img
                      src={c.person.photograph}
                      alt={c.person.name}
                      className="w-16 h-16 rounded-md object-cover border border-navy-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-navy-800 flex items-center justify-center border border-navy-700 text-navy-500">
                      <User className="w-8 h-8" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-accent-cyan text-sm">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        c.status === 'active' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        c.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-navy-800 text-navy-400 border-navy-700'
                      }`}>
                        {c.status.toUpperCase()}
                      </span>
                      <span className="badge-high">{c.person.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{c.person.name}, <span className="text-navy-400 font-normal">{c.person.age}</span></h2>

                    <div className="flex items-center gap-4 mt-2 text-sm text-navy-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        {c.person.lastKnownLocation}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {new Date(c.person.lastKnownDateTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-navy-400 mb-1">Overall Certainty</span>
                    <div className="flex items-center gap-3">
                      <div className="certainty-bar w-32 h-2">
                        <div
                          className="certainty-bar-fill h-full bg-accent-blue"
                          style={{ width: `${c.certainty.overall}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm text-white">{c.certainty.overall}%</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center bg-navy-900/50 rounded-md px-3 py-1.5 border border-navy-800">
                      <span className="text-xs text-navy-400">Evidence</span>
                      <span className="font-mono font-medium text-white">{c.evidenceIds?.length || 0}</span>
                    </div>
                    <div className="flex flex-col items-center bg-navy-900/50 rounded-md px-3 py-1.5 border border-navy-800">
                      <span className="text-xs text-navy-400">Gaps</span>
                      <span className="font-mono font-medium text-amber-400">{c.gapIds?.length || 0}</span>
                    </div>
                  </div>

                  <button
                    className="expand-toggle p-2 hover:bg-navy-700 rounded-full transition-colors ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(c.id);
                    }}
                  >
                    {expandedCaseId === c.id ? (
                      <ChevronUp className="w-5 h-5 text-navy-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-navy-400" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedCaseId === c.id && c.appearance && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-6 pt-6 border-t border-navy-800"
                  >
                    <div className="bg-navy-900/50 rounded-lg p-4 border border-navy-800">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-white">
                          <Activity className="w-4 h-4 text-accent-cyan" />
                          Appearance Profile
                        </h4>
                        <span className="prototype-badge">AI Appearance Analysis — Simulated for Prototype</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-navy-950 p-3 rounded-md border border-navy-800">
                          <span className="text-xs text-navy-500 block mb-1">Face Embedding</span>
                          <span className="text-emerald-400 font-medium flex items-center gap-1 text-xs">
                            <ShieldCheck className="w-3 h-3" />
                            {c.appearance.faceEmbeddingStatus === 'generated' ? 'Generated (Secured)' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="bg-navy-950 p-3 rounded-md border border-navy-800">
                          <span className="text-xs text-navy-500 block mb-1">Clothing</span>
                          <span className="text-navy-200 text-xs">{c.appearance.clothing}</span>
                        </div>
                        <div className="bg-navy-950 p-3 rounded-md border border-navy-800">
                          <span className="text-xs text-navy-500 block mb-1">Backpack / Object</span>
                          <span className="text-navy-200 text-xs">{c.appearance.backpackOrObject}</span>
                        </div>
                        <div className="bg-navy-950 p-3 rounded-md border border-navy-800">
                          <span className="text-xs text-navy-500 block mb-1">Body / Shoes</span>
                          <span className="text-navy-200 text-xs">{c.appearance.shoes}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        {cases.length === 0 && (
          <div className="text-center py-20 bg-navy-900/30 rounded-lg border border-navy-800 text-navy-400">
            No active cases found.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ActiveCasesPage;
