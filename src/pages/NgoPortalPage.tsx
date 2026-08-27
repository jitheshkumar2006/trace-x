// ============================================================
// TRACE-X — Authorized NGO Operations Portal
// Specific dashboard for verified NGO partner organizations
// Provides assigned case intelligence, task checklists, and field report submission
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  FolderOpen,
  CheckSquare,
  Square,
  Send,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Camera
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';
import type { Evidence } from '../types';

interface NgoCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: 'ACTIVE' | 'FOLLOW-UP REQUIRED';
  assignedArea: string;
  priority: 'HIGH' | 'MEDIUM';
  lastSeen: string;
  clothing: string;
  tasks: { id: string; text: string; completed: boolean }[];
}

export const NgoPortalPage: React.FC = () => {
  const { addEvidence, addAuditEntry } = useAppStore();
  const { currentUser } = useAuthStore();

  const [ngoCases, setNgoCases] = useState<NgoCase[]>([
    {
      id: 'TRX-2026-001',
      name: 'Rahul Sharma',
      age: 14,
      gender: 'Male',
      status: 'ACTIVE',
      assignedArea: 'Zone B — Central Bus Stand & Transit Corridors',
      priority: 'HIGH',
      lastSeen: '27 Aug 2026 — 10:18 AM',
      clothing: 'Navy blue school polo, beige trousers, black backpack',
      tasks: [
        { id: 't1', text: 'Verify designated shelters in Sector 4 transit ring', completed: true },
        { id: 't2', text: 'Contact approved community partner soup kitchens', completed: false },
        { id: 't3', text: 'Submit ground field observation report', completed: false },
        { id: 't4', text: 'Upload authorized support/welfare intake documents', completed: false },
      ],
    },
    {
      id: 'TRX-2026-004',
      name: 'Meera Patel',
      age: 72,
      gender: 'Female',
      status: 'ACTIVE',
      assignedArea: 'Zone A — Senior Living & Healthcare Corridor',
      priority: 'HIGH',
      lastSeen: '26 Aug 2026 — 04:30 PM',
      clothing: 'Maroon cotton saree, silver spectacles, walking cane',
      tasks: [
        { id: 't5', text: 'Canvas healthcare clinics and community day centers', completed: true },
        { id: 't6', text: 'Distribute approved missing advisory to transit desks', completed: true },
        { id: 't7', text: 'Check local temple and rest-stop intake registries', completed: false },
      ],
    },
    {
      id: 'TRX-2026-008',
      name: 'Anil Kumar',
      age: 28,
      gender: 'Male',
      status: 'FOLLOW-UP REQUIRED',
      assignedArea: 'Zone C — Industrial Logistics Zone',
      priority: 'MEDIUM',
      lastSeen: '25 Aug 2026 — 08:15 PM',
      clothing: 'Grey hooded jacket, blue jeans, sports sneakers',
      tasks: [
        { id: 't8', text: 'Follow up with night-shift logistics hub security', completed: false },
        { id: 't9', text: 'Review volunteer community tip logs', completed: false },
      ],
    },
  ]);

  const [selectedCaseId, setSelectedCaseId] = useState<string>('TRX-2026-001');
  const activeNgoCase = ngoCases.find((c) => c.id === selectedCaseId) || ngoCases[0];

  // Report submission state
  const [reportLocation, setReportLocation] = useState('Sector 4 Transit Hub Shelter');
  const [reportTime, setReportTime] = useState('10:45 AM');
  const [reportObservation, setReportObservation] = useState('');
  const [reportPhotoName, setReportPhotoName] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<{ id: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTask = (caseId: string, taskId: string) => {
    setNgoCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      })
    );
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportObservation.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const reportId = `NGO-RPT-${Math.floor(1000 + Math.random() * 9000)}`;

      // Inject into main evidence inbox so police see this new report
      const newEvidence: Evidence = {
        id: `EVD-${Math.floor(100 + Math.random() * 900)}`,
        caseId: selectedCaseId,
        source: `NGO Field Unit (${currentUser?.name || 'Child Welfare Network'})`,
        type: 'ngo_report',
        timestamp: new Date().toISOString(),
        latitude: 13.0827,
        longitude: 80.2707,
        confidence: 0.88,
        privacyLevel: 'restricted',
        verificationStatus: 'potential_lead',
        processingStatus: 'analyzed',
        description: `[${reportId}] Located at: ${reportLocation} — ${reportObservation}`,
        analysis: {
          faceSimilarity: 0.85,
          clothingSimilarity: 0.9,
          backpackSimilarity: 0.82,
          bodySimilarity: 0.84,
          timeConsistency: 0.95,
          locationConsistency: 0.92,
          overallLeadScore: 0.88,
        },
        createdAt: new Date().toISOString(),
      };

      addEvidence(newEvidence);
      addAuditEntry({
        userId: currentUser?.id || 'NGO-DEMO-001',
        userName: currentUser?.name || 'Authorized NGO Officer',
        userRole: 'ngo',
        action: 'evidence_added',
        target: `Evidence ${newEvidence.id} (${reportId})`,
        caseId: selectedCaseId,
        details: `NGO field report ${reportId} submitted for case ${selectedCaseId}: "${reportObservation.slice(0, 40)}..."`,
      });

      setIsSubmitting(false);
      setSubmittedReport({ id: reportId });
      setReportObservation('');
      setReportPhotoName(null);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Banner */}
      <div className="bg-[#0D1824] border border-emerald-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                AUTHORIZED NGO DASHBOARD
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <span className="live-pulse-neon-green" style={{ width: 6, height: 6 }} />
                OPERATIONAL SESSION VERIFIED
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-400" />
              ASSIGNED FIELD CASES
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Partner Agency: <strong className="text-white">Child & Vulnerable Person Welfare Network</strong> (ID: NGO-DEMO-001)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5" />
              {ngoCases.length} Active Assigned Files
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface: Case List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assigned Case Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              ASSIGNED CASES ({ngoCases.length})
            </h2>
            <span className="text-[10px] font-mono text-slate-500">Select to inspect</span>
          </div>

          <div className="space-y-3">
            {ngoCases.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setSubmittedReport(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#112233] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                      : 'bg-[#0E1624] border-[#1D2733] hover:border-emerald-500/40 hover:bg-[#121c2c]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{c.id}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-semibold ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{c.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.gender} • Age {c.age}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1F2B3B] text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{c.assignedArea}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                      <span>Tasks: {c.tasks.filter((t) => t.completed).length}/{c.tasks.length} Done</span>
                      <span className="text-emerald-400 font-semibold">{c.priority} PRIORITY</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Case Intelligence & Report Submission (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Case Header Card */}
          <div className="glass-card p-5 border-l-4 border-l-emerald-500 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D2733] pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  APPROVED MISSING PERSON PROFILE
                </span>
                <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2 mt-0.5">
                  {activeNgoCase.name} <span className="text-xs font-mono text-slate-400">({activeNgoCase.id})</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {activeNgoCase.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#0B111A] rounded-lg border border-[#1D2733] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">ASSIGNED SEARCH AREA</span>
                <p className="text-white font-semibold font-mono flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {activeNgoCase.assignedArea}
                </p>
              </div>

              <div className="p-3 bg-[#0B111A] rounded-lg border border-[#1D2733] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">LAST SEEN TIME</span>
                <p className="text-white font-semibold font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {activeNgoCase.lastSeen}
                </p>
              </div>

              <div className="sm:col-span-2 p-3 bg-[#0B111A] rounded-lg border border-[#1D2733] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">CLOTHING & DISTINGUISHING ATTRIBUTES</span>
                <p className="text-slate-200">{activeNgoCase.clothing}</p>
              </div>
            </div>

            {/* Tasks Checklist */}
            <div className="pt-2">
              <h3 className="text-xs font-bold font-mono text-white mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                ASSIGNED NGO FIELD PROTOCOLS
              </h3>

              <div className="space-y-2">
                {activeNgoCase.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(activeNgoCase.id, task.id)}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0C141F] border border-[#1E293B] hover:border-emerald-500/40 cursor-pointer transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Field Report Form */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D2733] pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  SUBMIT FIELD OBSERVATION REPORT
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">Direct Intake to Police Desk</span>
            </div>

            {submittedReport ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-2 font-mono"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">FIELD REPORT RECEIVED</h4>
                <div className="text-xs text-emerald-300 font-semibold">
                  Report Reference: <span className="underline">{submittedReport.id}</span>
                </div>
                <p className="text-xs text-slate-300 max-w-md mx-auto pt-1 font-sans">
                  Status: <strong className="text-amber-400">Pending investigator verification</strong>. Your observation has been ingested into the TRACE-X intelligence database.
                </p>
                <button
                  onClick={() => setSubmittedReport(null)}
                  className="mt-3 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Submit Another Report
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-mono font-semibold mb-1 uppercase text-[11px]">
                      Observation Location:
                    </label>
                    <input
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
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
                      value={reportTime}
                      onChange={(e) => setReportTime(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-mono font-semibold mb-1 uppercase text-[11px]">
                    Detailed Field Observation Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={reportObservation}
                    onChange={(e) => setReportObservation(e.target.value)}
                    placeholder="Describe specific appearance, clothing match, companions, direction of movement, or welfare status observed..."
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-mono font-semibold mb-1 uppercase text-[11px]">
                    Photo / Document Evidence (Optional):
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-emerald-500/40 bg-[#0B111A] hover:bg-[#0E1624] text-slate-300 cursor-pointer transition-colors">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono">
                        {reportPhotoName || 'Upload Photo or Shelter Registry (.jpg, .png, .pdf)'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setReportPhotoName(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Encrypted submission to Lead Desk
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 border-emerald-400/40"
                  >
                    {isSubmitting ? (
                      <>Ingesting Observation...</>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        SUBMIT REPORT
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoPortalPage;
