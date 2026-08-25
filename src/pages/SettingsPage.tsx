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
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-navy-900 ${
      active ? 'bg-accent-blue' : 'bg-navy-700'
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
  const [accentColor, setAccentColor] = useState('blue');
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3 bg-navy-800 rounded-xl border border-navy-700">
          <Settings className="w-6 h-6 text-accent-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Configuration and prototype controls</p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Demo Controls */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-accent-cyan" />
              <h2 className="text-lg font-semibold text-white">Demo Controls</h2>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Manage the prototype state and sample data.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg border border-navy-700">
                <div>
                  <div className="text-sm font-medium text-white">Demo Data</div>
                  <div className="text-xs text-slate-400">Load sample case 'Phoenix'</div>
                </div>
                <button 
                  onClick={initDemoData}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> Load Demo Case
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg border border-navy-700">
                <div>
                  <div className="text-sm font-medium text-white">Reset Application</div>
                  <div className="text-xs text-slate-400">Clear all data and states</div>
                </div>
                <button 
                  onClick={resetDemo}
                  className="btn-danger flex items-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Demo
                </button>
              </div>

              <div className="mt-4 p-3 bg-navy-800 rounded-lg border border-navy-700">
                <div className="text-xs text-slate-400 mb-1">Current State</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cctv014Investigated ? 'bg-status-success' : 'bg-status-warning'}`}></div>
                  <span className="text-sm text-white">
                    {cctv014Investigated ? 'CCTV-014 Investigation Complete' : 'Awaiting Investigation'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Appearance (Visual Only) */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-accent-indigo" />
              <h2 className="text-lg font-semibold text-white">Theme</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Dark Mode</div>
                  <div className="text-xs text-slate-400">Enforce dark intelligence UI</div>
                </div>
                <Toggle active={darkMode} onClick={() => setDarkMode(!darkMode)} />
              </div>
              
              <div className="pt-3 border-t border-navy-700">
                <div className="text-sm font-medium text-white mb-2">Accent Color</div>
                <div className="flex gap-3">
                  {['blue', 'cyan', 'indigo'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        accentColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                      } ${
                        color === 'blue' ? 'bg-blue-500' : color === 'cyan' ? 'bg-cyan-500' : 'bg-indigo-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-status-warning" />
              <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white">New evidence alerts</div>
                <Toggle active={alerts.newEvidence} onClick={() => toggleAlert('newEvidence')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white">Case updates</div>
                <Toggle active={alerts.caseUpdates} onClick={() => toggleAlert('caseUpdates')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white">Citizen reports</div>
                <Toggle active={alerts.citizenReports} onClick={() => toggleAlert('citizenReports')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-white">System notifications</div>
                <Toggle active={alerts.systemNotifs} onClick={() => toggleAlert('systemNotifs')} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Prototype Notice */}
          <motion.div variants={itemVariants} className="glass-card p-6 border-l-4 border-l-status-warning bg-status-warning/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-warning mt-0.5" />
              <div>
                <h3 className="text-md font-semibold text-status-warning mb-1">Prototype Simulation Notice</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This system is currently running as a prototype demonstration. In a real-world deployment, TRACE-X would require authorized integration with municipal CCTV networks, police databases, and cellular provider APIs. All AI models in this version are simulated for demonstration purposes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-white">System Information</h2>
            </div>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between py-2 border-b border-navy-700/50">
                <span className="text-slate-400 flex items-center gap-2"><Code2 className="w-4 h-4"/> Version</span>
                <span className="text-accent-blue">TRACE-X v0.1.0-prototype</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-700/50">
                <span className="text-slate-400 flex items-center gap-2"><Database className="w-4 h-4"/> Stack</span>
                <span className="text-white">React + TypeScript + Zustand</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-700/50">
                <span className="text-slate-400 flex items-center gap-2"><Monitor className="w-4 h-4"/> Environment</span>
                <span className="text-status-warning">Development / Prototype</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> AI Engine</span>
                <span className="text-accent-cyan">Mock Analysis Service (Prototype)</span>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-accent-blue" />
              <h2 className="text-lg font-semibold text-white">About TRACE-X</h2>
            </div>
            
            <div className="space-y-4 text-sm text-slate-300">
              <p>
                TRACE-X is an AI Evidence Intelligence System designed for Missing & Vulnerable Persons cases. It aggregates multi-modal data streams, synthesizes hypotheses, and identifies critical investigation gaps to accelerate case resolution.
              </p>
              <div className="p-3 bg-navy-900 rounded-lg border border-navy-700">
                <div className="font-semibold text-white mb-1">Smart India Hackathon 2026</div>
                <div className="text-slate-400 text-xs">Problem Statement: PSS2</div>
              </div>
              <p className="text-xs text-slate-400 italic">
                Core innovation: Transforming passive surveillance data into active, hypothesis-driven intelligence while maintaining chain of custody and requiring human verification.
              </p>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
