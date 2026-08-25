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
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="flex items-center gap-3 border-b border-navy-700 pb-4">
        <Shield className="w-8 h-8 text-status-success" />
        <h1 className="text-3xl font-bold text-gray-100">Privacy & Access Control</h1>
      </header>

      <div className="mb-6 p-4 bg-status-warning/10 border border-status-warning/30 rounded-lg flex gap-3 items-start">
        <ShieldCheck className="w-6 h-6 text-status-warning flex-shrink-0" />
        <div>
          <h3 className="text-status-warning font-medium">Privacy-First Architecture</h3>
          <p className="text-sm text-gray-300 mt-1">
            TRACE-X is built on strict data minimization principles. Biometric data is never exposed to normal users,
            and AI systems cannot automatically trigger enforcement actions without human verification.
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
        <motion.section variants={itemVariants} className="glass-card p-6">
          <header className="flex items-center gap-2 mb-4 border-b border-navy-700 pb-2">
            <EyeOff className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-xl font-semibold text-gray-200">Data Minimization</h2>
          </header>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Only essential information is collected and stored.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-navy-900/50 p-3 rounded border border-navy-800">
                <h4 className="text-status-success mb-2 font-medium">Collected</h4>
                <ul className="space-y-1 text-gray-400 list-disc list-inside">
                  <li>Metadata & Timestamps</li>
                  <li>Anonymized Location Data</li>
                  <li>Verified Case Details</li>
                </ul>
              </div>
              <div className="bg-navy-900/50 p-3 rounded border border-navy-800">
                <h4 className="text-status-danger mb-2 font-medium">Not Collected</h4>
                <ul className="space-y-1 text-gray-400 list-disc list-inside">
                  <li>Public Facial Database</li>
                  <li>Unrelated Citizen Data</li>
                  <li>Persistent Tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Human Verification */}
        <motion.section variants={itemVariants} className="glass-card p-6">
          <header className="flex items-center gap-2 mb-4 border-b border-navy-700 pb-2">
            <Users className="w-5 h-5 text-accent-indigo" />
            <h2 className="text-xl font-semibold text-gray-200">Human Verification Policy</h2>
          </header>
          <div className="space-y-3">
            <p className="text-sm text-gray-300 leading-relaxed">
              AI systems in TRACE-X operate strictly in an assistive capacity. They surface potential leads but cannot take autonomous action.
            </p>
            <div className="warning-label inline-block">
              All AI matches are labeled: "Potential Lead — Human Verification Required"
            </div>
            <div className="bg-navy-900 p-3 rounded text-sm text-gray-400 border border-navy-800 mt-2">
              Every identified match must be verified by a designated Human Investigator before being upgraded to actionable intelligence.
            </div>
          </div>
        </motion.section>

        {/* Role-Based Access Matrix */}
        <motion.section variants={itemVariants} className="glass-card p-6 md:col-span-2">
          <header className="flex items-center gap-2 mb-4 border-b border-navy-700 pb-2">
            <Lock className="w-5 h-5 text-accent-blue" />
            <h2 className="text-xl font-semibold text-gray-200">Role-Based Access Matrix</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-navy-900/80 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 rounded-tl">Role</th>
                  <th className="px-4 py-3">Cases</th>
                  <th className="px-4 py-3">Evidence</th>
                  <th className="px-4 py-3">CCTV Feeds</th>
                  <th className="px-4 py-3">Citizen Reports</th>
                  <th className="px-4 py-3 rounded-tr">Audit Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800 text-gray-300">
                <tr className="hover:bg-navy-800/30">
                  <td className="px-4 py-3 font-medium">Police / Lead Investigator</td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                </tr>
                <tr className="hover:bg-navy-800/30">
                  <td className="px-4 py-3 font-medium">NGO Case Worker</td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-status-danger" /></td>
                  <td className="px-4 py-3"><Check className="w-4 h-4 text-status-success" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-status-danger" /></td>
                </tr>
                <tr className="hover:bg-navy-800/30">
                  <td className="px-4 py-3 font-medium">Volunteer</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">Assigned Only</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">Public Only</td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-status-danger" /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">Submit Only</td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-status-danger" /></td>
                </tr>
                <tr className="hover:bg-navy-800/30">
                  <td className="px-4 py-3 font-medium">Family Member</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">View Own</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">View Allowed</td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-status-danger" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-status-danger" /></td>
                  <td className="px-4 py-3"><X className="w-4 h-4 text-status-danger" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Encryption Architecture */}
        <motion.section variants={itemVariants} className="glass-card p-6">
          <header className="flex items-center gap-2 mb-4 border-b border-navy-700 pb-2">
            <Database className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-200">Encryption Architecture</h2>
          </header>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-full bg-navy-900 border border-navy-700 p-3 rounded text-center">
              <span className="text-xs text-gray-400 block mb-1">Client Device</span>
              <span className="text-sm font-medium text-gray-200">End-to-End Encryption Setup</span>
            </div>
            <div className="h-6 border-l-2 border-dashed border-accent-blue"></div>
            <div className="w-full bg-navy-800 border border-accent-blue p-3 rounded text-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <span className="text-xs text-accent-blue block mb-1">In Transit</span>
              <span className="text-sm font-medium text-gray-100">TLS 1.3 Encryption</span>
            </div>
            <div className="h-6 border-l-2 border-dashed border-accent-blue"></div>
            <div className="w-full bg-navy-900 border border-navy-700 p-3 rounded text-center">
              <span className="text-xs text-gray-400 block mb-1">Server / Database</span>
              <span className="text-sm font-medium text-gray-200">AES-256 Data at Rest</span>
            </div>
          </div>
        </motion.section>

        {/* Data Retention */}
        <motion.section variants={itemVariants} className="glass-card p-6">
          <header className="flex items-center gap-2 mb-4 border-b border-navy-700 pb-2">
            <FileText className="w-5 h-5 text-status-info" />
            <h2 className="text-xl font-semibold text-gray-200">Data Retention Policy</h2>
          </header>
          <ul className="space-y-4">
            <li className="flex justify-between items-center bg-navy-900/50 p-3 rounded border border-navy-800">
              <span className="text-sm font-medium text-gray-300">Resolved Cases</span>
              <span className="prototype-badge">10 Years</span>
            </li>
            <li className="flex justify-between items-center bg-navy-900/50 p-3 rounded border border-navy-800">
              <span className="text-sm font-medium text-gray-300">CCTV Cache</span>
              <span className="prototype-badge">90 Days</span>
            </li>
            <li className="flex justify-between items-center bg-navy-900/50 p-3 rounded border border-navy-800">
              <span className="text-sm font-medium text-gray-300">Unverified Citizen Reports</span>
              <span className="prototype-badge">1 Year</span>
            </li>
            <li className="flex justify-between items-center bg-navy-900/50 p-3 rounded border border-navy-800">
              <span className="text-sm font-medium text-gray-300">Audit Logs</span>
              <span className="prototype-badge">Indefinite</span>
            </li>
          </ul>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
