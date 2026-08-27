import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Users, Database, EyeOff, ShieldCheck, FileText, Check, X } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="border-b border-[#1D2733] pb-4">
        <h1 className="text-2xl font-extrabold text-[#E6EDF3] font-mono flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-400" />
          PRIVACY & ACCESS CONTROL ARCHITECTURE
        </h1>
        <p className="text-xs text-[#8B98A8] font-mono mt-0.5">Role-based access matrix, end-to-end encryption, and human verification policy</p>
      </header>

      <div className="p-4 bg-[#0D1219] border border-emerald-500/30 rounded-xl flex gap-3 items-start text-xs font-mono">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-white font-bold">PRIVACY-FIRST GOVERNANCE PROTOCOL</h3>
          <p className="text-[#8B98A8] font-sans">
            TRACE-X enforces strict data minimization. Biometric records are strictly protected, and AI suggestions cannot trigger autonomous enforcement without human officer verification.
          </p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Data Minimization */}
        <motion.section variants={itemVariants} className="glass-card p-6 space-y-4">
          <header className="flex items-center gap-2 border-b border-[#1D2733] pb-2 font-mono">
            <EyeOff className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase">Data Minimization</h2>
          </header>
          <div className="space-y-3 font-mono text-xs">
            <p className="text-[#8B98A8] font-sans">Only essential investigation metadata is collected and processed.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
                <h4 className="text-emerald-400 mb-2 font-bold uppercase text-[10px]">COLLECTED DATA</h4>
                <ul className="space-y-1 text-[#8B98A8] text-[11px]">
                  <li>• Case Timestamps</li>
                  <li>• Anonymized Geospatial Dots</li>
                  <li>• Verified Clue Descriptions</li>
                </ul>
              </div>
              <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
                <h4 className="text-red-400 mb-2 font-bold uppercase text-[10px]">EXCLUDED DATA</h4>
                <ul className="space-y-1 text-[#8B98A8] text-[11px]">
                  <li>• Public Facial Database</li>
                  <li>• Mass Civilian Tracking</li>
                  <li>• Persistent Surveillance</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Human Verification */}
        <motion.section variants={itemVariants} className="glass-card p-6 space-y-4">
          <header className="flex items-center gap-2 border-b border-[#1D2733] pb-2 font-mono">
            <Users className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase">Human Verification Policy</h2>
          </header>
          <div className="space-y-3 font-mono text-xs">
            <p className="text-[#E6EDF3] font-sans">
              AI algorithms surface candidate leads but cannot initiate enforcement action without officer review.
            </p>
            <div className="warning-label font-mono text-[11px]">
              "Potential Lead — Human Verification Required"
            </div>
            <div className="bg-[#080B10] p-3 rounded-lg text-[#8B98A8] border border-[#1D2733] text-[11px]">
              Every match must be verified by an authorized Police Investigator before being upgraded to actionable intelligence.
            </div>
          </div>
        </motion.section>

        {/* Role-Based Access Matrix */}
        <motion.section variants={itemVariants} className="glass-card p-6 md:col-span-2 space-y-4">
          <header className="flex items-center gap-2 border-b border-[#1D2733] pb-2 font-mono">
            <Lock className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase">Role-Based Access Control Matrix (RBAC)</h2>
          </header>
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#080B10] text-[#8B98A8] uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3 border-b border-[#1D2733]">ROLE</th>
                  <th className="px-4 py-3 border-b border-[#1D2733]">ACTIVE CASES</th>
                  <th className="px-4 py-3 border-b border-[#1D2733]">EVIDENCE INBOX</th>
                  <th className="px-4 py-3 border-b border-[#1D2733]">CCTV FEEDS</th>
                  <th className="px-4 py-3 border-b border-[#1D2733]">CITIZEN REPORTS</th>
                  <th className="px-4 py-3 border-b border-[#1D2733]">AUDIT LOGS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2733] text-[#E6EDF3]">
                <tr>
                  <td className="px-4 py-3 font-bold text-sky-400">Police / Investigator</td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-emerald-400">NGO Partner</td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-red-400" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-red-400" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-amber-400">Field Volunteer</td>
                  <td className="px-4 py-3 text-[#8B98A8] text-[11px]">Assigned Only</td>
                  <td className="px-4 py-3 text-[#8B98A8] text-[11px]">Public Only</td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-red-400" /></td>
                  <td className="px-4 py-3 text-[#8B98A8] text-[11px]">Submit Only</td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-red-400" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-purple-400">Family Member</td>
                  <td className="px-4 py-3 text-[#8B98A8] text-[11px]">View Approved</td>
                  <td className="px-4 py-3 text-[#8B98A8] text-[11px]">Screened Feed</td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-red-400" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-red-400" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-red-400" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Encryption Architecture */}
        <motion.section variants={itemVariants} className="glass-card p-6 space-y-4">
          <header className="flex items-center gap-2 border-b border-[#1D2733] pb-2 font-mono">
            <Database className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase">Encryption Architecture</h2>
          </header>
          <div className="flex flex-col items-center gap-3 py-2 font-mono text-xs">
            <div className="w-full bg-[#080B10] border border-[#1D2733] p-3 rounded-lg text-center">
              <span className="text-[10px] text-[#8B98A8] block">CLIENT ENDPOINT</span>
              <span className="text-white font-bold">End-to-End Encrypted Transit</span>
            </div>
            <div className="h-4 border-l-2 border-dashed border-sky-400"></div>
            <div className="w-full bg-[#111821] border border-sky-500/50 p-3 rounded-lg text-center">
              <span className="text-[10px] text-sky-400 block">IN TRANSIT</span>
              <span className="text-white font-bold">TLS 1.3 Transport Protocol</span>
            </div>
            <div className="h-4 border-l-2 border-dashed border-sky-400"></div>
            <div className="w-full bg-[#080B10] border border-[#1D2733] p-3 rounded-lg text-center">
              <span className="text-[10px] text-[#8B98A8] block">DATA AT REST</span>
              <span className="text-white font-bold">AES-256 Cloud Storage Encryption</span>
            </div>
          </div>
        </motion.section>

        {/* Retention Policy */}
        <motion.section variants={itemVariants} className="glass-card p-6 space-y-4">
          <header className="flex items-center gap-2 border-b border-[#1D2733] pb-2 font-mono">
            <FileText className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase">Data Retention Policy</h2>
          </header>
          <ul className="space-y-3 font-mono text-xs">
            <li className="flex justify-between items-center bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
              <span className="text-white">Resolved Case Records</span>
              <span className="prototype-badge">10 Years</span>
            </li>
            <li className="flex justify-between items-center bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
              <span className="text-white">CCTV Cache Storage</span>
              <span className="prototype-badge">90 Days</span>
            </li>
            <li className="flex justify-between items-center bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
              <span className="text-white">Unverified Citizen Reports</span>
              <span className="prototype-badge">1 Year</span>
            </li>
            <li className="flex justify-between items-center bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
              <span className="text-white">Audit Trail Logs</span>
              <span className="prototype-badge">Indefinite</span>
            </li>
          </ul>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
