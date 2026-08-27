import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Eye,
  Heart,
  Filter,
  Check,
  X,
  PlusCircle,
  FileText
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';
import type { VerificationStatus } from '../types';

export const CitizenReportsPage: React.FC = () => {
  const { evidence, activeCase, addAuditEntry, updateEvidenceVerification } = useAppStore();
  const { currentUser } = useAuthStore();

  const userRole = currentUser?.role || 'police';
  const personName = activeCase?.person.name || 'Rahul Sharma';
  const caseId = activeCase?.id || 'TRX-2026-001';

  // Filter evidence by citizen sightings & reports
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const sightingList = evidence.filter(
    (e) => e.type === 'citizen_sighting' || e.type === 'ngo_report'
  );

  // Stats computation
  const totalCount = sightingList.length;
  const verifiedCount = sightingList.filter((e) => e.verificationStatus === 'confirmed').length;
  const pendingCount = sightingList.filter(
    (e) => e.verificationStatus === 'potential_lead' || e.verificationStatus === 'unverified'
  ).length;

  const handleVerify = (id: string, status: VerificationStatus) => {
    updateEvidenceVerification(id, status);

    addAuditEntry({
      caseId: caseId,
      action: 'evidence_analyzed',
      userId: currentUser?.id || 'USR-001',
      userName: currentUser?.name || 'Inspector Rajan Kumar',
      userRole: userRole,
      target: id,
      details: `Officer marked sighting report ${id} as ${status.toUpperCase()}`,
    });
  };

  const filteredSightings = sightingList.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.verificationStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" />
            {userRole === 'family' ? (
              <>SIGHTING UPDATES FOR {personName.toUpperCase()}</>
            ) : userRole === 'volunteer' ? (
              <>FIELD SEARCH TEAM SIGHTINGS LOG</>
            ) : userRole === 'ngo' ? (
              <>NGO OVERSIGHT — CITIZEN SIGHTINGS</>
            ) : (
              <>PUBLIC SIGHTINGS VERIFICATION DASHBOARD</>
            )}
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            COMMUNITY INTEL FEED & LAW ENFORCEMENT VERIFICATION FOR <span className="text-white font-semibold">{caseId}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#/report"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>[ Submit Sighting Form ]</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>
      </div>

      {/* Role-Specific Overview Context Banner */}
      {userRole === 'family' ? (
        <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-xl flex items-start gap-3 text-xs">
          <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">Family Access Portal — Sighting Status Feed</p>
            <p className="text-[#8B98A8]">
              All confirmed citizen and volunteer sightings for <strong>{personName}</strong> are logged below. Sensitive reporter identity details remain protected under law enforcement protocols.
            </p>
          </div>
        </div>
      ) : userRole === 'volunteer' ? (
        <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-xs">
          <Eye className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">Volunteer Field Verification Feed</p>
            <p className="text-[#8B98A8]">
              Review all incoming community sightings for case <strong>{caseId}</strong>. Coordinate with your team before canvassing high-probability zones.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0D1219] border border-[#1D2733] p-4 rounded-xl flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">Police Verification Protocol</p>
            <p className="text-[#8B98A8]">
              Public sightings submitted on <strong>/#/report</strong> automatically arrive here. Evaluate location consistency and click <strong>[Verify Lead]</strong> or <strong>[Dismiss]</strong> to update case certainty metrics.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="glass-card p-4">
          <div className="text-[11px] text-[#8B98A8] uppercase mb-1">TOTAL RECEIVED</div>
          <div className="text-2xl font-bold text-white">{totalCount}</div>
          <div className="text-[10px] text-sky-400 mt-1">Community submissions</div>
        </div>

        <div className="glass-card p-4">
          <div className="text-[11px] text-[#8B98A8] uppercase mb-1">VERIFIED LEADS</div>
          <div className="text-2xl font-bold text-emerald-400">{verifiedCount}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Confirmed by officers</div>
        </div>

        <div className="glass-card p-4">
          <div className="text-[11px] text-[#8B98A8] uppercase mb-1">PENDING VERIFICATION</div>
          <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
          <div className="text-[10px] text-amber-400 mt-1">Needs review</div>
        </div>

        <div className="glass-card p-4">
          <div className="text-[11px] text-[#8B98A8] uppercase mb-1">SOURCE RELIABILITY</div>
          <div className="text-2xl font-bold text-sky-400">84%</div>
          <div className="text-[10px] text-sky-400 mt-1">Cross-referenced score</div>
        </div>
      </div>

      {/* Sightings List Container */}
      <div className="glass-card p-5 space-y-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#8B98A8]">
            <Filter size={14} className="text-sky-400" />
            <span>FILTER SIGHTINGS:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'unverified', 'potential_lead', 'confirmed', 'dismissed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-xs font-bold uppercase border transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-[#111821] text-sky-400 border-sky-500/50'
                    : 'bg-[#080B10] text-[#8B98A8] border-[#1D2733] hover:text-white'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Sightings Grid */}
        <div className="space-y-3 font-mono text-xs">
          {filteredSightings.map((sighting) => {
            const isConfirmed = sighting.verificationStatus === 'confirmed';
            const isLead = sighting.verificationStatus === 'potential_lead';
            const isDismissed = sighting.verificationStatus === 'dismissed';

            return (
              <div
                key={sighting.id}
                className="bg-[#080B10] p-4 rounded-xl border border-[#1D2733] hover:border-sky-500/40 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1D2733] pb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm tracking-wide">{sighting.id}</span>
                    <span className="text-[#8B98A8] text-[11px]">
                      Source: <strong className="text-slate-200">{sighting.source}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20 uppercase">
                      {sighting.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isLead
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : isDismissed
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-[#111821] text-[#8B98A8] border-[#1D2733]'
                      }`}
                    >
                      {sighting.verificationStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#8B98A8]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-sky-400 flex-shrink-0" />
                    <span>
                      Report Time:{' '}
                      <strong className="text-white">
                        {sighting.timestamp ? new Date(sighting.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-sky-400 flex-shrink-0" />
                    <span>
                      Observation Location:{' '}
                      <strong className="text-white">
                        {sighting.description.includes('[Location:') 
                          ? sighting.description.split('[Location:')[1].replace(']', '') 
                          : 'Chennai Transit Sector'}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#0D1219] rounded-lg border border-[#1D2733]">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <FileText size={12} className="text-sky-400" />
                    SIGHTING OBSERVATION DETAILS:
                  </div>
                  <p className="text-xs text-[#E6EDF3] font-sans leading-relaxed">
                    {sighting.description}
                  </p>
                </div>

                {/* Police Officer Verification Controls */}
                {userRole === 'police' && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#1D2733]">
                    <span className="text-[11px] text-[#8B98A8]">
                      Investigator Action:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(sighting.id, 'confirmed')}
                        className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isConfirmed
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                            : 'bg-[#112218] text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        <Check size={13} /> Verify Lead
                      </button>

                      <button
                        onClick={() => handleVerify(sighting.id, 'potential_lead')}
                        className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isLead
                            ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                            : 'bg-[#221c11] text-amber-300 border border-amber-500/40 hover:bg-amber-600 hover:text-white'
                        }`}
                      >
                        <AlertTriangle size={13} /> Mark Potential
                      </button>

                      <button
                        onClick={() => handleVerify(sighting.id, 'dismissed')}
                        className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isDismissed
                            ? 'bg-red-900 text-red-200 ring-2 ring-red-400'
                            : 'bg-red-950/60 text-red-400 border border-red-500/30 hover:bg-red-900 hover:text-white'
                        }`}
                      >
                        <X size={13} /> Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSightings.length === 0 && (
            <div className="p-12 text-center text-[#8B98A8] space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No sighting reports found for filter "{filterStatus}".</p>
              <a
                href="#/report"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 underline inline-block"
              >
                Submit a new test sighting via /report
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenReportsPage;
