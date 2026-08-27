import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  Upload,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../store/useStore';
import type { Evidence } from '../types';

export default function PublicReportPage() {
  const { addEvidence, activeCase, addAuditEntry } = useAppStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const id = `SIGHT-${Math.floor(1000 + Math.random() * 9000)}`;
      const caseId = activeCase?.id || 'TRX-2026-001';

      const newEvidence: Evidence = {
        id: id,
        caseId: caseId,
        source: `Public Sighting (${id})`,
        timestamp: time || new Date().toISOString(),
        type: 'citizen_sighting',
        latitude: 13.0827,
        longitude: 80.2707,
        confidence: 78,
        processingStatus: 'analyzed',
        privacyLevel: 'restricted',
        verificationStatus: 'potential_lead',
        description: `${description} [Location: ${location || 'Central Corridor'}]`,
        createdAt: new Date().toISOString(),
      };

      addEvidence(newEvidence);

      addAuditEntry({
        caseId: caseId,
        action: 'citizen_report_submitted',
        userId: 'PUBLIC',
        userName: 'Anonymous Citizen',
        userRole: 'volunteer',
        target: id,
        details: `Public sighting report submitted at ${location || 'Unknown Location'}`
      });

      setReportId(id);
      setIsProcessing(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#080B10]" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #0d1522 0%, #080b10 80%)' }}>
      {/* Top Command Header */}
      <header className="border-b border-[#1D2733] bg-[#0D1219]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-widest font-mono">TRACE-X</h1>
              <p className="text-[10px] text-sky-400 font-mono uppercase tracking-widest">SECURE SIGHTING REPORT</p>
            </div>
          </div>
          <span className="text-[10px] text-[#8B98A8] font-mono hidden sm:block">
            NO LOGIN REQUIRED • ANONYMOUS REPORTING
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Trust Banner */}
        <div className="bg-[#0D1219] border border-[#1D2733] rounded-xl p-4 flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">Encrypted Community Reporting Interface</p>
            <p className="text-[#8B98A8]">
              Your sighting is dispatched directly to authorized law enforcement officers. Your identity is protected under encryption guidelines.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className="glass-card p-6 border border-[#1D2733] space-y-5"
            >
              <div className="border-b border-[#1D2733] pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Eye className="w-4 h-4 text-sky-400" />
                  SIGHTING DETAILS
                </h2>
                <p className="text-xs text-[#8B98A8]">Please provide accurate location and time information</p>
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-mono text-[#8B98A8] mb-1.5">UPLOAD PHOTO / FOOTAGE (OPTIONAL)</label>
                <div className="border border-dashed border-[#1D2733] bg-[#080B10] rounded-xl p-6 text-center hover:border-sky-500/50 transition-colors cursor-pointer space-y-2">
                  <Upload className="w-8 h-8 text-[#8B98A8] mx-auto" />
                  <p className="text-xs font-semibold text-white">Click or drag photo here</p>
                  <p className="text-[10px] text-[#8B98A8]">Supports JPG, PNG (Max 25MB)</p>
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-mono text-[#8B98A8] mb-1">LOCATION *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8B98A8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Near Central Bus Stand, Gate 2"
                    className="input-field pl-9"
                  />
                </div>
              </div>

              {/* Approximate Time */}
              <div>
                <label className="block text-xs font-mono text-[#8B98A8] mb-1">APPROXIMATE TIME *</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#8B98A8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-field pl-9"
                  />
                </div>
              </div>

              {/* Observation Textarea */}
              <div>
                <label className="block text-xs font-mono text-[#8B98A8] mb-1">OBSERVATION / DESCRIPTION *</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#8B98A8] absolute left-3 top-3" />
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you observed (clothing, companion, direction of walk)..."
                    className="input-field pl-9 pt-2.5"
                  />
                </div>
              </div>

              {/* Optional Phone Contact */}
              <div>
                <label className="block text-xs font-mono text-[#8B98A8] mb-1">CONTACT NUMBER (OPTIONAL)</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Optional phone number for officer verification"
                  className="input-field"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary w-full justify-center py-3 text-xs font-mono uppercase tracking-wider font-bold cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ENCRYPTING & TRANSMITTING REPORT...
                    </span>
                  ) : (
                    '[ SUBMIT SECURELY ]'
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 border border-emerald-500/40 bg-[#0D1219] text-center space-y-5"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-white font-mono tracking-wider">REPORT RECEIVED</h2>
                <p className="text-xs text-emerald-400 font-mono font-bold">REPORT ID: {reportId}</p>
                <p className="text-xs text-[#8B98A8] max-w-md mx-auto pt-2 font-mono">
                  Your report has been securely submitted. Law enforcement investigators have received your sighting report for verification.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setLocation('');
                    setTime('');
                    setDescription('');
                  }}
                  className="btn-ghost text-xs font-mono"
                >
                  Submit Another Sighting
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
