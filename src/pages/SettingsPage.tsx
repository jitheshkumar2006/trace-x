import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Database, Palette, Bell, Info, ShieldAlert, 
  Terminal, Monitor, Code2, AlertTriangle, RefreshCw, Download
} from 'lucide-react';
import { useAppStore } from '../store/useStore';

// Simple visual toggle component
const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 ${
      active ? 'bg-sky-500' : 'bg-[#1D2733]'
    }`}
  >
    <span 
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        active ? 'translate-x-6' : 'translate-x-1'
      }`} 
    />
  </button>
);

const SettingsPage: React.FC = () => {
  const { initDemoData, resetDemo, cctv014Investigated } = useAppStore();
  
  // Local state for visual-only toggles
  const [darkMode, setDarkMode] = useState(true);
  const [alerts, setAlerts] = useState({
    newEvidence: true,
    caseUpdates: true,
    citizenReports: false,
    systemNotifs: true
  });

  const toggleAlert = (key: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-[#1D2733] pb-4">
        <h1 className="text-2xl font-extrabold text-[#E6EDF3] font-mono flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-400" />
          SYSTEM SETTINGS & CONFIGURATION
        </h1>
        <p className="text-xs text-[#8B98A8] font-mono mt-0.5">Operational controls, demo simulation reset, and system diagnostics</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Demo Controls */}
          <motion.div variants={itemVariants} className="glass-card p-6 space-y-4 font-mono">
            <div className="flex items-center gap-2 border-b border-[#1D2733] pb-2">
              <Database className="w-5 h-5 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase">Simulation & State Controls</h2>
            </div>
            <p className="text-xs text-[#8B98A8] font-sans">
              Manage local simulation state and reset active case parameters.
            </p>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#080B10] rounded-lg border border-[#1D2733]">
                <div>
                  <div className="text-white font-bold">Load Sample Case</div>
                  <div className="text-[11px] text-[#8B98A8] font-sans">Initialize TRX-2026-001 default state</div>
                </div>
                <button 
                  onClick={initDemoData}
                  className="btn-primary text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Load Sample Case
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#080B10] rounded-lg border border-[#1D2733]">
                <div>
                  <div className="text-white font-bold">Reset Simulation</div>
                  <div className="text-[11px] text-[#8B98A8] font-sans">Clear custom entries and reset certainty</div>
                </div>
                <button 
                  onClick={resetDemo}
                  className="btn-danger text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset State
                </button>
              </div>

              <div className="p-3 bg-[#080B10] rounded-lg border border-[#1D2733]">
                <div className="text-[10px] text-[#8B98A8] uppercase mb-1">CCTV-014 INTEGRATION STATE</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cctv014Investigated ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                  <span className="text-xs text-white">
                    {cctv014Investigated ? 'CCTV-014 Verified & Integrated (+23%)' : 'Awaiting CCTV-014 Investigation'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Theme Preferences */}
          <motion.div variants={itemVariants} className="glass-card p-6 space-y-4 font-mono">
            <div className="flex items-center gap-2 border-b border-[#1D2733] pb-2">
              <Palette className="w-5 h-5 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase">Appearance & Atmosphere</h2>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">Dark Command Theme</div>
                  <div className="text-[11px] text-[#8B98A8] font-sans">Enforce high-contrast dark surface palette</div>
                </div>
                <Toggle active={darkMode} onClick={() => setDarkMode(!darkMode)} />
              </div>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div variants={itemVariants} className="glass-card p-6 space-y-4 font-mono">
            <div className="flex items-center gap-2 border-b border-[#1D2733] pb-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase">Notification Preferences</h2>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white">New evidence alerts</span>
                <Toggle active={alerts.newEvidence} onClick={() => toggleAlert('newEvidence')} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Case certainty updates</span>
                <Toggle active={alerts.caseUpdates} onClick={() => toggleAlert('caseUpdates')} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Public citizen sightings</span>
                <Toggle active={alerts.citizenReports} onClick={() => toggleAlert('citizenReports')} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">System notifications</span>
                <Toggle active={alerts.systemNotifs} onClick={() => toggleAlert('systemNotifs')} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Operational Notice */}
          <motion.div variants={itemVariants} className="glass-card p-6 border-l-4 border-l-amber-400 bg-[#0D1219]">
            <div className="flex items-start gap-3 text-xs font-mono">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-amber-400 uppercase">Operational Simulation Disclaimer</h3>
                <p className="text-[#8B98A8] font-sans leading-relaxed">
                  This system is operating in prototype simulation mode. In production deployments, TRACE-X integrates directly with authorized municipal CCTV network feeds, police records, and cell tower telemetry under legal authorization protocols.
                </p>
              </div>
            </div>
          </motion.div>

          {/* System Information */}
          <motion.div variants={itemVariants} className="glass-card p-6 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-[#1D2733] pb-2">
              <Terminal className="w-5 h-5 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase">System Information</h2>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-[#1D2733]">
                <span className="text-[#8B98A8] flex items-center gap-2"><Code2 className="w-4 h-4"/> System Version</span>
                <span className="text-sky-400 font-bold">TRACE-X v1.0.0-operational</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1D2733]">
                <span className="text-[#8B98A8] flex items-center gap-2"><Database className="w-4 h-4"/> Architecture Stack</span>
                <span className="text-white">React 18 + TypeScript + Zustand</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1D2733]">
                <span className="text-[#8B98A8] flex items-center gap-2"><Monitor className="w-4 h-4"/> Deployment Environment</span>
                <span className="text-emerald-400 font-bold">Production CDN</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8B98A8] flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> AI Intelligence Engine</span>
                <span className="text-sky-400">Uncertainty-Aware Information-Gain Engine</span>
              </div>
            </div>
          </motion.div>

          {/* About TRACE-X */}
          <motion.div variants={itemVariants} className="glass-card p-6 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-[#1D2733] pb-2">
              <Info className="w-5 h-5 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase">About TRACE-X</h2>
            </div>
            
            <div className="space-y-3 text-[#E6EDF3] font-sans">
              <p>
                TRACE-X is an uncertainty-aware investigation intelligence platform engineered for missing and vulnerable persons cases. It aggregates multi-modal evidence streams, synthesizes competing movement hypotheses, and ranks candidate next-best evidence actions to eliminate investigation gaps.
              </p>
              <div className="p-3 bg-[#080B10] rounded-lg border border-[#1D2733] font-mono text-xs">
                <div className="font-bold text-sky-400 mb-1">CORE MISSION</div>
                <div className="text-[#8B98A8] text-[11px]">Transforming passive evidence collections into hypothesis-driven, actionable intelligence while enforcing strict chain-of-custody verification.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
