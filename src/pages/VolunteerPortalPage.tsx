// ============================================================
// TRACE-X — Field Volunteer Search Portal
// Ultra-simple, mobile-optimized interface for verified search volunteers
// Strictly delivers least-privilege search assignments and secure tip intake
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Camera,
  CheckCircle2,
  Send,
  Shield,
  Search,
  MessageSquare
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';
import type { Evidence } from '../types';

export const VolunteerPortalPage: React.FC = () => {
  const { addEvidence, addAuditEntry } = useAppStore();
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'match' | 'clear' | 'tip' | null>(null);
  const [location, setLocation] = useState('Central Bus Stand Gate 3, Sector 4');
  const [time, setTime] = useState('10:50 AM');
  const [description, setDescription] = useState('');
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [clearLogged, setClearLogged] = useState(false);

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const refId = `FIELD-01${Math.floor(10 + Math.random() * 90)}`;

      // Ingest as citizen/volunteer sighting evidence for police verification
      const newEvidence: Evidence = {
        id: `EVD-${Math.floor(100 + Math.random() * 900)}`,
        caseId: 'TRX-2026-001',
        source: `Field Volunteer (${currentUser?.name || 'Search Team Beta'})`,
        type: 'citizen_sighting',
        timestamp: new Date().toISOString(),
        latitude: 13.0827,
        longitude: 80.2707,
        confidence: 0.76,
        privacyLevel: 'restricted',
        verificationStatus: 'potential_lead',
        processingStatus: 'analyzed',
        description: `[${refId}] Sighting at ${location}: ${description}`,
        analysis: {
          faceSimilarity: 0.78,
          clothingSimilarity: 0.88,
          backpackSimilarity: 0.81,
          bodySimilarity: 0.74,
          timeConsistency: 0.94,
          locationConsistency: 0.91,
          overallLeadScore: 0.82,
        },
        createdAt: new Date().toISOString(),
      };

      addEvidence(newEvidence);
      addAuditEntry({
        userId: currentUser?.id || 'VOL-DEMO-001',
        userName: currentUser?.name || 'Field Volunteer #12',
        userRole: 'volunteer',
        action: 'evidence_added',
        target: `Evidence ${newEvidence.id} (${refId})`,
        caseId: 'TRX-2026-001',
        details: `Field volunteer submitted sighting ${refId} at ${location}: "${description.slice(0, 40)}..."`,
      });

      setIsSubmitting(false);
      setSubmittedRef(refId);
      setDescription('');
      setPhotoName(null);
    }, 1200);
  };

  const handleClearArea = () => {
    setClearLogged(true);
    addAuditEntry({
      userId: currentUser?.id || 'VOL-DEMO-001',
      userName: currentUser?.name || 'Field Volunteer #12',
      userRole: 'volunteer',
      action: 'citizen_report_submitted',
      target: 'Zone B Perimeter Check',
      caseId: 'TRX-2026-001',
      details: 'Volunteer logged Zone B search perimeter check as CLEAR (No observation).',
    });

    setTimeout(() => {
      setClearLogged(false);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12 font-sans px-2 sm:px-0">
      {/* Top Banner */}
      <div className="bg-[#0E1724] border border-amber-500/30 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              FIELD VOLUNTEER
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="live-pulse-neon-green" style={{ width: 6, height: 6 }} />
              VERIFIED
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Unit ID: VOL-DEMO-001</span>
        </div>
        <h1 className="text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          ACTIVE FIELD ASSIGNMENT
        </h1>
      </div>

      {/* Assignment Card */}
      <div className="glass-card p-5 border-l-4 border-l-amber-500 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1D2733] pb-2">
          <span className="text-xs font-mono font-bold text-white">CASE: TRX-2026-001</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
            SEARCH ACTIVE
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">SEARCH TARGET INFO</span>
            <p className="text-white font-semibold">Rahul Sharma (14 years old)</p>
            <p className="text-slate-300 text-[11px]">
              Navy blue school polo, beige trousers, black school backpack.
            </p>
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">ASSIGNED SEARCH SECTOR</span>
            <p className="text-amber-300 font-mono font-bold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Zone B — Central Bus Stand Perimeter & Market Lanes
            </p>
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">DIRECTIVE</span>
            <p className="text-slate-200">
              Verify assigned transit gate shelters and pedestrian exits. Do not confront any suspicious persons. Submit observations immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Observation Action Buttons */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
          REPORT FIELD OBSERVATION
        </h2>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Button 1: Match */}
          <button
            onClick={() => {
              setActiveTab(activeTab === 'match' ? null : 'match');
              setSubmittedRef(null);
            }}
            className={`p-4 rounded-xl border font-mono text-left transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'match'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-[#0E1624] border-[#1D2733] text-amber-300 hover:border-amber-500/50 hover:bg-[#121c2c]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white uppercase">I Saw a Possible Match</div>
                <div className="text-[11px] text-slate-400 font-sans">Submit sighting details, photo, and precise location</div>
              </div>
            </div>
          </button>

          {/* Button 2: No Observation / Clear */}
          <button
            onClick={handleClearArea}
            className="p-4 rounded-xl border border-[#1D2733] bg-[#0E1624] hover:bg-[#121c2c] hover:border-emerald-500/40 font-mono text-left transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white uppercase">No Observation / Area Clear</div>
                <div className="text-[11px] text-slate-400 font-sans">Log that assigned search sector was canvassed with no match</div>
              </div>
            </div>
          </button>

          {/* Button 3: Other Tip */}
          <button
            onClick={() => {
              setActiveTab(activeTab === 'tip' ? null : 'tip');
              setSubmittedRef(null);
            }}
            className={`p-4 rounded-xl border font-mono text-left transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'tip'
                ? 'bg-sky-500/20 border-sky-400 text-white'
                : 'bg-[#0E1624] border-[#1D2733] text-sky-300 hover:border-sky-500/50 hover:bg-[#121c2c]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white uppercase">Report Something Else</div>
                <div className="text-[11px] text-slate-400 font-sans">Submit general clues, vehicle plate, or witness remark</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Feedback */}
      {clearLogged && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 font-mono"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          Sector canvass status updated: Sector Zone B marked as CLEAR at {new Date().toLocaleTimeString()}.
        </motion.div>
      )}

      {/* Sighting Submission Form */}
      {(activeTab === 'match' || activeTab === 'tip') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#1D2733] pb-2">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-400" />
              {activeTab === 'match' ? 'SUBMIT SIGHTING MATCH' : 'SUBMIT GENERAL LEAD'}
            </h3>
            <button
              onClick={() => setActiveTab(null)}
              className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {submittedRef ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-2 font-mono">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white uppercase">REPORT SUBMITTED</h4>
              <div className="text-xs text-emerald-300">
                Reference ID: <span className="underline font-bold">{submittedRef}</span>
              </div>
              <p className="text-xs text-amber-300 pt-1 font-sans">
                Status: <strong>Pending verification</strong>. Potential sighting submitted for investigator verification.
              </p>
              <button
                onClick={() => {
                  setSubmittedRef(null);
                  setActiveTab(null);
                }}
                className="mt-3 px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleMatchSubmit} className="space-y-3 text-xs font-sans">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-mono font-semibold uppercase text-[11px]">
                    Sighting Location:
                  </label>
                  <button
                    type="button"
                    onClick={() => setLocation('Central Bus Stand Gate 3, Sector 4 (GPS: 13.0827, 80.2707)')}
                    className="text-[10px] text-amber-400 hover:underline font-mono cursor-pointer"
                  >
                    📍 Use Current Location
                  </button>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono font-semibold mb-1 uppercase text-[11px]">
                  Approximate Time:
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono font-semibold mb-1 uppercase text-[11px]">
                  Observation Description:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you saw: clothing, direction walking, carrying items, companion..."
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono font-semibold mb-1 uppercase text-[11px]">
                  Upload Sighting Photo (Optional):
                </label>
                <label className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-amber-500/40 bg-[#0B111A] hover:bg-[#0E1624] text-slate-300 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono">
                    {photoName || 'Tap to Take Photo or Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPhotoName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto text-xs font-mono font-bold bg-amber-600 hover:bg-amber-500 border-amber-400/40 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>Submitting Sighting...</>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      SUBMIT SECURELY
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}

      {/* Safety Protocol Footer */}
      <div className="bg-[#0B111A] border border-[#1D2733] rounded-xl p-3.5 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-mono font-semibold uppercase text-[10px]">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          Field Volunteer Protocol
        </div>
        <p className="text-[11px] leading-relaxed">
          Observations are securely transmitted to the Police Command Center. All observations undergo investigator verification before confirmation.
        </p>
      </div>
    </div>
  );
};

export default VolunteerPortalPage;
