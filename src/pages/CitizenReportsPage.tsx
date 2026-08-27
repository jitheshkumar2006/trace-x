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
  Shield,
  Filter,
  Check,
  X,
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';
import type { VerificationStatus, Evidence } from '../types';

export const CitizenReportsPage: React.FC = () => {
  const { evidence, activeCase, addAuditEntry } = useAppStore();
  const { currentUser } = useAuthStore();

  const userRole = currentUser?.role || 'police';
  const personName = activeCase?.person.name || 'Rahul Sharma';
  const caseId = activeCase?.id || 'TRX-2026-001';

  // Filter evidence by citizen sightings
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sightingList, setSightingList] = useState<Evidence[]>(
    evidence.filter((e) => e.type === 'citizen_sighting')
  );

  // Stats computation
  const totalCount = sightingList.length;
  const verifiedCount = sightingList.filter((e) => e.verificationStatus === 'confirmed').length;
  const pendingCount = sightingList.filter(
    (e) => e.verificationStatus === 'potential_lead' || e.verificationStatus === 'unverified'
  ).length;

  const handleVerify = (id: string, status: VerificationStatus) => {
    setSightingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, verificationStatus: status } : item))
    );

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
            className="btn-primary text-xs font-mono font-bold uppercase cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>[ Open Public /report Form ]</span>
          </a>
        </div>
      </div>

      {/* Role-Specific Overview Context Banner */}
      {userRole === 'family' ? (
        <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-xl flex items-start gap-3 text-xs">
          <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">Family Access View — Approved Community Sightings</p>
            <p className="text-[#8B98A8]">
              Below are verified and screened sightings submitted by the public for <strong>{personName}</strong>. Police officers review each incoming report before ground dispatch.
            </p>
          </div>
        </div>
      ) : userRole === 'volunteer' ? (
        <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-xs">
          <Eye className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">Field Search Operations — Spotter Feed</p>
            <p className="text-[#8B98A8]">
              Check community leads submitted around <strong>Chennai Central & Bus Corridor</strong>. If you spot {personName}, share the public report link or log a ground report.
            </p>
          </div>
        </div>
      ) : userRole === 'ngo' ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3 text-xs">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">NGO Partner Oversight Portal</p>
            <p className="text-[#8B98A8]">
              Monitoring incoming public sightings for case <strong>{caseId} ({personName})</strong>. Cross-verify reports with assigned field units.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0D1219] border border-[#1D2733] p-4 rounded-xl flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white font-semibold font-mono">Police Verification Protocol</p>
            <p className="text-[#8B98A8]">
              Public sightings submitted on <strong>/report</strong> automatically arrive here. Evaluate location consistency and hit <strong>[✅ Verify Lead]</strong> or <strong>[❌ Dismiss]</strong> to update case certainty metrics.
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
          <div className="text-[11px] text-[#8B98A8] uppercase mb-1">SOURCE TRUST SCORE</div>
          <div className="text-2xl font-bold text-sky-400">82%</div>
          <div className="text-[10px] text-sky-400 mt-1">Weighted community score</div>
        </div>
      </div>

      {/* Sightings List Container */}
      <div className="glass-card p-5 space-y-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#8B98A8]">
            <Filter size={14} className="text-sky-400" />
            <span>FILTER SIGHTINGS BY VERIFICATION STATUS:</span>
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
          {filteredSightings.map((sighting) => (
            <div
              key={sighting.id}
              className="bg-[#080B10] p-4 rounded-xl border border-[#1D2733] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1D2733] pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">{sighting.id}</span>
                  <span className="text-[#8B98A8]">Source: {sighting.source}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sighting.verificationStatus === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : sighting.verificationStatus === 'potential_lead'
                        ? 'badge-high'
                        : sighting.verificationStatus === 'dismissed'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-[#111821] text-[#8B98A8] border border-[#1D2733]'
                    }`}
                  >
                    {sighting.verificationStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#8B98A8]">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-sky-400" />
                  <span>
                    Timestamp:{' '}
                    <strong className="text-white">
                      {new Date(sighting.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-sky-400" />
                  <span>
                    Search Zone: <strong className="text-white">Central Transit Corridor</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#E6EDF3] bg-[#0D1219] p-3 rounded-lg border border-[#1D2733] font-sans">
                {sighting.description}
              </p>

              {/* Police Officer Verification Controls */}
              {userRole === 'police' && (
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1D2733]">
                  <button
                    onClick={() => handleVerify(sighting.id, 'confirmed')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Check size={13} /> Verify Lead
                  </button>

                  <button
                    onClick={() => handleVerify(sighting.id, 'potential_lead')}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <AlertTriangle size={13} /> Mark Potential
                  </button>

                  <button
                    onClick={() => handleVerify(sighting.id, 'dismissed')}
                    className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-400 border border-red-500/30 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <X size={13} /> Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredSightings.length === 0 && (
            <div className="p-12 text-center text-[#8B98A8]">
              No sighting reports found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenReportsPage;
