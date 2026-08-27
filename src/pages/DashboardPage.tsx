import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Shield,
  Heart,
  Eye,
  ArrowRight,
  Target,
  Check,
  X,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';
import type { VerificationStatus } from '../types';

const getCertaintyColor = (value: number) => {
  if (value > 75) return 'bg-emerald-500';
  if (value > 50) return 'bg-sky-400';
  if (value > 30) return 'bg-amber-400';
  return 'bg-red-500';
};

export default function DashboardPage() {
  const {
    cases,
    activeCase,
    evidence,
    gaps,
    hypotheses,
    auditLog,
    cctv014Investigated,
    updateEvidenceVerification,
    addAuditEntry,
  } = useAppStore();
  const { currentUser } = useAuthStore();
  const userRole = currentUser?.role || 'police';

  const stats = useMemo(() => {
    return {
      activeCasesCount: cases.length || 27,
      newEvidenceCount: evidence.length || 14,
      highPriorityLeadsCount:
        evidence.filter(
          (e) => e.verificationStatus === 'potential_lead' || e.verificationStatus === 'confirmed'
        ).length || 6,
      unresolvedGapsCount: gaps.length || 8,
      avgCertainty: cctv014Investigated ? 84 : 74,
    };
  }, [cases, evidence, gaps, cctv014Investigated]);

  const citizenSightings = useMemo(() => {
    return evidence.filter((e) => e.type === 'citizen_sighting' || e.type === 'ngo_report');
  }, [evidence]);

  const certaintyData = useMemo(() => {
    if (!activeCase) return null;
    return [
      { key: 'Identity', value: activeCase.certainty.identity },
      { key: 'Time', value: activeCase.certainty.time },
      { key: 'Location', value: activeCase.certainty.location },
      { key: 'Route', value: activeCase.certainty.route },
      { key: 'CCTV Coverage', value: activeCase.certainty.cctvCoverage },
      { key: 'Witness', value: activeCase.certainty.witness },
    ];
  }, [activeCase]);

  const handleVerify = (id: string, status: VerificationStatus) => {
    updateEvidenceVerification(id, status);
    addAuditEntry({
      caseId: activeCase?.id || 'TRX-2026-001',
      action: 'evidence_analyzed',
      userId: currentUser?.id || 'USR-001',
      userName: currentUser?.name || 'Inspector Rajan Kumar',
      userRole: userRole,
      target: id,
      details: `Officer verified sighting report ${id} as ${status.toUpperCase()} from Dashboard`,
    });
  };

  const personName = activeCase?.person.name || 'Rahul Sharma';
  const currentCaseId = activeCase?.id || 'TRX-2026-001';
  const lastLoc = activeCase?.person.lastKnownLocation || 'Chennai Central Railway Station';

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono">TRACE-X COMMAND CENTER</h1>
            <span className="badge-critical font-mono">PRIORITY CASE ACTIVE</span>
          </div>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-sans">
            AI-Augmented Uncertainty-Aware Intelligence • Smart India Hackathon Prototype
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-[#0D1219] px-3 py-1.5 rounded-lg border border-[#1D2733] text-sky-400">
            ACTIVE CASE: <strong className="text-white">{currentCaseId}</strong>
          </span>
        </div>
      </div>

      {/* Role Context Banner */}
      {userRole === 'family' ? (
        <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-lg flex items-start gap-3">
          <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">Family Access Portal — Case Progress Summary</p>
            <p className="text-[#8B98A8]">
              Official update for <strong>{personName}</strong>: Search teams are actively operating near <strong>{lastLoc}</strong>. Biometric records and raw CCTV streams remain protected under law enforcement privacy protocols.
            </p>
          </div>
        </div>
      ) : userRole === 'volunteer' ? (
        <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-lg flex items-start gap-3">
          <Eye className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">Field Search Operations — Active Patrol</p>
            <p className="text-[#8B98A8]">
              Active missing person alert for <strong>{personName}</strong>. Focus on search zones with elevated priority and submit sightings immediately.
            </p>
          </div>
        </div>
      ) : userRole === 'ngo' ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-lg flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 neon-icon-green" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">NGO Case Oversight Portal</p>
            <p className="text-[#8B98A8]">
              Monitoring active case <strong>{currentCaseId} ({personName})</strong>. Cross-check community sightings and partner field reports.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0D1219] border border-[#1D2733] p-4 rounded-lg flex items-start gap-3">
          <Shield className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">Operational Status Briefing</p>
            <p className="text-[#8B98A8]">
              {cctv014Investigated ? (
                <>CCTV Camera 014 at Central Bus Stand verified. The 13-minute gap is resolved, boosting overall case certainty from <strong>61% to 84%</strong>.</>
              ) : (
                <>Subject last confirmed at <strong>{lastLoc} at 10:18 AM</strong>. Critical <strong>13-minute timeline gap</strong> detected before 10:31 AM appearance. Recommended action: <strong>Investigate CCTV Camera 014</strong>.</>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Public Citizen Reporting Broadcast Channel (Police Only) */}
      {userRole === 'police' && (
        <div className="bg-[#0E1724] border border-orange-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-orange-950/20">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.2)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  COMMUNITY CITIZEN REPORTING PORTAL
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 uppercase">
                  PUBLIC ACCESS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Anonymous tip collection channel for missing person <strong className="text-white">{personName} ({currentCaseId})</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            <a
              href="#/report"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer border border-orange-400/50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>TEST PUBLIC REPORT FORM</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            <a
              href="#/citizen-reports"
              className="px-3.5 py-2 rounded-lg bg-[#111C2A] hover:bg-[#162538] border border-[#22354E] text-sky-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <span>View All ({citizenSightings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Top 5 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>ACTIVE CASES</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.activeCasesCount}</div>
          <div className="text-[10px] text-[#8B98A8] mt-1 flex items-center gap-1 font-mono">
            <span className="live-pulse-neon-green"></span> Active registry
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>TOTAL SIGHTINGS</span>
            <FileText className="w-4 h-4 neon-icon-green" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{citizenSightings.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">Community & Field</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>VERIFIED LEADS</span>
            <Target className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono">{stats.highPriorityLeadsCount}</div>
          <div className="text-[10px] text-sky-400 mt-1 font-mono">Investigator confirmed</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>TIMELINE GAPS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {cctv014Investigated ? 0 : stats.unresolvedGapsCount}
          </div>
          <div className="text-[10px] text-amber-400 mt-1 font-mono">
            {cctv014Investigated ? 'Resolved by CCTV-014' : '13-min corridor gap'}
          </div>
        </div>

        <div className="glass-card p-4 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>OVERALL CERTAINTY</span>
            <Activity className="w-4 h-4 text-emerald-400 neon-icon-green" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{activeCase?.certainty.overall || stats.avgCertainty}%</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            {cctv014Investigated ? '↑ +23% after CCTV-014' : 'Bayesian weighted'}
          </div>
        </div>
      </div>

      {/* Live Incoming Citizen Sightings Feed on Dashboard */}
      <div className="glass-card p-5 space-y-3.5 border-l-4 border-l-orange-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1D2733] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              LIVE COMMUNITY SIGHTINGS & CITIZEN REPORTS ({citizenSightings.length})
            </h2>
          </div>
          <a
            href="#/citizen-reports"
            className="text-xs text-sky-400 hover:underline font-mono flex items-center gap-1"
          >
            <span>Open Dedicated Verification Matrix</span>
            <ArrowRight size={13} />
          </a>
        </div>

        <div className="space-y-2.5">
          {citizenSightings.slice(0, 3).map((sighting) => {
            const isConfirmed = sighting.verificationStatus === 'confirmed';
            const isLead = sighting.verificationStatus === 'potential_lead';

            return (
              <div
                key={sighting.id}
                className="bg-[#080B10] p-3.5 rounded-xl border border-[#1D2733] hover:border-orange-500/40 transition-colors space-y-2 text-xs font-mono"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white">{sighting.id}</span>
                    <span className="text-[#8B98A8] text-[11px]">
                      Source: <strong className="text-slate-200">{sighting.source}</strong>
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20 uppercase">
                      {sighting.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isLead
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {sighting.verificationStatus.replace('_', ' ').toUpperCase()}
                    </span>

                    {userRole === 'police' && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={() => handleVerify(sighting.id, 'confirmed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={12} /> Verify
                        </button>
                        <button
                          onClick={() => handleVerify(sighting.id, 'dismissed')}
                          className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-400 border border-red-500/30 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X size={12} /> Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-200 font-sans bg-[#0D1219] p-2.5 rounded border border-[#1D2733]">
                  {sighting.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Uncertainty & Subject Profile Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Certainty Overview */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1D2733]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">EVIDENCE DNA CERTAINTY BREAKDOWN</h2>
              <p className="text-xs text-[#8B98A8]">Confidence vectors across person, time, location, and movement routes</p>
            </div>
            <span className="text-xl font-bold text-sky-400 font-mono">{activeCase?.certainty.overall}% overall</span>
          </div>

          <div className="space-y-3">
            {certaintyData?.map((item) => {
              const explainers: Record<string, string> = {
                Identity: `Are we sure it is ${personName}?`,
                Time: 'Do we know exact timestamps?',
                Location: 'Do we know the exact spot?',
                Route: 'Do we know which road he walked?',
                'CCTV Coverage': 'Do we have video footage?',
                Witness: 'Do we have eyewitness sightings?',
              };

              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#E6EDF3] font-medium">
                      {item.key} <span className="text-[11px] text-[#8B98A8] font-normal">({explainers[item.key]})</span>
                    </span>
                    <span className="text-white font-mono font-semibold">{item.value}%</span>
                  </div>
                  <div className="certainty-bar">
                    <div
                      className={`certainty-bar-fill ${getCertaintyColor(item.value)}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Subject Summary Card */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#1D2733] font-mono">SUBJECT PROFILE</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#080B10] rounded-lg border border-[#1D2733] flex items-center justify-center text-sky-400 font-bold text-lg font-mono">
                  {activeCase?.person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{activeCase?.person.name}</h3>
                  <p className="text-xs text-[#8B98A8]">{activeCase?.person.age} years old • {activeCase?.person.gender} • <span className="capitalize text-sky-400 font-medium">{activeCase?.person.category}</span></p>
                </div>
              </div>

              <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8B98A8]">Last Seen Location:</span>
                  <span className="text-[#E6EDF3] font-medium">{activeCase?.person.lastKnownLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B98A8]">Last Seen Timestamp:</span>
                  <span className="text-[#E6EDF3] font-mono">10:18 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B98A8]">Clothing Profile:</span>
                  <span className="text-[#E6EDF3]">{activeCase?.appearance?.clothing || 'Dark Jacket, Trousers'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#1D2733] flex justify-between items-center text-xs text-[#8B98A8]">
            <span>Status: <span className="text-emerald-400 font-semibold uppercase">{activeCase?.status}</span></span>
            <span className="font-mono flex items-center gap-1"><Clock className="w-3 h-3 text-sky-400" />Active</span>
          </div>
        </div>
      </div>

      {/* Competing Hypotheses & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competing Hypotheses */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#1D2733]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">COMPETING HYPOTHESES</h2>
            <span className="text-xs text-sky-400 font-mono">AI EVALUATION</span>
          </div>

          <div className="space-y-3">
            {hypotheses.slice(0, 3).map((hypothesis, idx) => (
              <div
                key={hypothesis.id}
                className={`p-3 rounded-lg border transition-all ${
                  idx === 0 ? 'bg-[#111821] border-sky-500/50 shadow-sm' : 'bg-[#080B10] border-[#1D2733]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {idx === 0 && <span className="w-2 h-2 rounded-full bg-sky-400"></span>}
                    {hypothesis.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-400">{hypothesis.confidence}% Confidence</span>
                </div>
                <p className="text-xs text-[#8B98A8] mb-2">{hypothesis.description}</p>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-sky-400" style={{ width: `${hypothesis.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Audit Trail */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#1D2733]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">SYSTEM AUDIT TRAIL</h2>
            <span className="text-xs text-[#8B98A8] font-mono">REAL-TIME LOG</span>
          </div>

          <div className="space-y-2 text-xs">
            {auditLog.slice(0, 4).map((log) => (
              <div key={log.id} className="flex gap-3 bg-[#080B10] p-2.5 rounded-lg border border-[#1D2733] font-mono">
                <span className="text-sky-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-[#8B98A8]"><strong className="text-white">{log.userName}:</strong> {log.details}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
