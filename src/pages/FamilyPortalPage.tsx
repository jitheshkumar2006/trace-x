// ============================================================
// TRACE-X — Family Case Tracking Portal
// Dedicated least-privilege view for families of missing persons
// Strictly shields raw CCTV, sensitive notes, and AI hypotheses
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Info,
  EyeOff
} from 'lucide-react';
import { useAppStore } from '../store/useStore';

export const FamilyPortalPage: React.FC = () => {
  const { activeCase, cctv014Investigated } = useAppStore();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const person = activeCase?.person || {
    name: 'Rahul Sharma',
    age: 14,
    gender: 'Male',
    lastKnownLocation: 'Chennai Central Bus Stand Corridor',
    lastKnownDateTime: '2026-08-27T10:18:00',
    clothingDescription: 'Navy blue school polo, beige trousers, black backpack',
  };

  const caseId = activeCase?.id || 'TRX-2026-001';

  // Timeline items
  const timelineSteps = [
    { title: 'CASE REGISTERED', time: '27 Aug 2026 — 08:30 AM', status: 'completed', desc: 'Missing person file opened by Law Enforcement.' },
    { title: 'INITIAL REPORT FILED', time: '27 Aug 2026 — 09:15 AM', status: 'completed', desc: 'Ground sighting parameters and appearance profile generated.' },
    { title: 'EVIDENCE RECEIVED', time: '27 Aug 2026 — 10:05 AM', status: 'completed', desc: 'Surveillance corridor footage and transport data ingested.' },
    { title: 'LEAD VERIFIED', time: '27 Aug 2026 — 10:42 AM', status: 'completed', desc: 'Field teams confirmed movement near Sector 4 transit zone.' },
    { title: 'ACTIVE SEARCH OPERATION', time: 'Ongoing', status: 'active', desc: 'Multi-agency ground teams operating in prioritized sector.' },
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setShowInquiryModal(false);
      setInquiryText('');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Banner */}
      <div className="bg-[#0D1624] border border-purple-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                FAMILY ACCESS PORTAL
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <span className="live-pulse-neon-green" style={{ width: 6, height: 6 }} />
                VERIFIED TRACKING SESSION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              CASE: {caseId}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Official Family Status Portal for <strong className="text-white">{person.name}</strong> (Age {person.age})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-md cursor-pointer border border-purple-400/40"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Contact Case Officer
            </button>
          </div>
        </div>
      </div>

      {/* Case Status & Latest Verified Update Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Investigation Status */}
        <div className="glass-card p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
            <span>INVESTIGATION STATUS</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-lg font-bold text-white font-mono">ACTIVE INVESTIGATION</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Multi-agency search teams are actively deployed. Law enforcement lead officers are coordinating with verified field partner units.
          </p>
        </div>

        {/* Card 2: Last Verified Location */}
        <div className="glass-card p-5 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
            <span>LAST VERIFIED LOCATION</span>
            <MapPin className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-base font-bold text-white font-mono mt-1">
            {cctv014Investigated ? 'Sector 4 — Central Bus Stand Perimeter' : 'Central Market & Bus Stand Corridor'}
          </div>
          <p className="text-xs text-slate-300 mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            Approved sighting window: 10:18 AM – 10:31 AM
          </p>
        </div>

        {/* Card 3: Last Official Update */}
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
            <span>LAST VERIFIED UPDATE</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-emerald-400 font-mono mt-1">
            27 Aug 2026 — 10:42 AM
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Status: <span className="text-white font-semibold">Investigation Ongoing</span> (Update frequency: Every milestone verification).
          </p>
        </div>
      </div>

      {/* Latest Official Case Update Banner */}
      <div className="bg-[#0E1624] border border-[#22344B] rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
          <Info className="w-4 h-4" />
          LATEST CASE UPDATE
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-serif italic">
          "A new lead has been reviewed and verified by authorized investigators in the Sector 4 transit corridor. Ground teams have been redeployed accordingly. The investigation remains active and prioritized."
        </p>
        <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
          <Calendar className="w-3 h-3 text-purple-400" />
          Logged: 27 Aug 2026 — 10:42 AM • Source: Lead Investigation Desk
        </div>
      </div>

      {/* Investigation Timeline */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1D2733] pb-3">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            INVESTIGATION TIMELINE & MILESTONES
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Chronological Progress</span>
        </div>

        <div className="space-y-4 pt-2">
          {timelineSteps.map((step, idx) => (
            <div key={step.title} className="flex items-start gap-4 relative">
              {idx < timelineSteps.length - 1 && (
                <div className="absolute left-[13px] top-6 bottom-0 w-[2px] bg-purple-500/30" />
              )}

              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                step.status === 'completed'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 animate-pulse'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                )}
              </div>

              <div className="flex-1 bg-[#111821] border border-[#1D2733] rounded-lg p-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-xs font-bold text-white font-mono">{step.title}</h3>
                  <span className="text-[10px] font-mono text-purple-300/80">{step.time}</span>
                </div>
                <p className="text-xs text-slate-300">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Operational Security Notice */}
      <div className="bg-[#0B111A] border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <EyeOff className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="text-white font-bold font-mono uppercase tracking-wider">PRIVACY & OPERATIONAL SECURITY PROTOCOL</p>
          <p className="text-slate-300 leading-relaxed">
            Some investigation information (such as raw CCTV surveillance streams, confidential witness names, tactical search team positions, and internal analytical hypotheses) is restricted for privacy and operational security. This safeguards the integrity of the active search.
          </p>
        </div>
      </div>

      {/* Contact Case Officer Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0E1624] border border-purple-500/40 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 font-mono text-left"
          >
            <div className="flex items-center justify-between border-b border-[#22344B] pb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Direct Family Support Line</h3>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Message Dispatched to Lead Officer</p>
                <p className="text-[11px] text-slate-300">The assigned investigation liaison will contact your registered phone number shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 font-sans">
                <div className="text-xs text-slate-300">
                  Assigned Case Officer: <strong className="text-white font-mono">Inspector V. Raman (ID: OFF-489)</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono text-slate-300 mb-1 uppercase">
                    Submit Question or New Information:
                  </label>
                  <textarea
                    rows={4}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder="Type your message or any new detail here..."
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="btn-ghost text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs bg-purple-600 hover:bg-purple-500 border-purple-400/40"
                  >
                    Send to Case Officer
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FamilyPortalPage;
