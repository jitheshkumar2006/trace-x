import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Search,
  CheckCircle2,
  Shield,
  Heart,
  Eye,
  ArrowRight,
  Target,
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';

const getCertaintyColor = (value: number) => {
  if (value > 75) return 'bg-emerald-500';
  if (value > 50) return 'bg-sky-400';
  if (value > 30) return 'bg-amber-400';
  return 'bg-red-500';
};

export default function DashboardPage() {
  const { cases, activeCase, evidence, gaps, hypotheses, auditLog, cctv014Investigated } = useAppStore();
  const { currentUser } = useAuthStore();
  const userRole = currentUser?.role || 'police';

  const stats = useMemo(() => {
    return {
      activeCasesCount: cases.length || 27,
      newEvidenceCount: evidence.length || 14,
      highPriorityLeadsCount: evidence.filter(e => e.verificationStatus === 'potential_lead' || e.verificationStatus === 'confirmed').length || 6,
      unresolvedGapsCount: gaps.length || 8,
      avgCertainty: cctv014Investigated ? 84 : 74,
    };
  }, [cases, evidence, gaps, cctv014Investigated]);

  const certaintyData = useMemo(() => {
    if (!activeCase) return null;
    return [
      { key: 'Identity', value: activeCase.certainty.identity },
      { key: 'Time', value: activeCase.certainty.time },
      { key: 'Location', value: activeCase.certainty.location },
      { key: 'Route', value: activeCase.certainty.route },
      { key: 'CCTV Coverage', value: activeCase.certainty.cctvCoverage },
      { key: 'Witness', value: activeCase.certainty.witness }
    ];
  }, [activeCase]);

  const personName = activeCase?.person.name || 'Rahul Sharma';
  const currentCaseId = activeCase?.id || 'TRX-2026-001';
  const lastLoc = activeCase?.person.lastKnownLocation || 'Chennai Central';

  return (
    <div className="space-y-6">
      {/* Top Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <Activity className="w-6 h-6 neon-icon-green" />
            INVESTIGATION COMMAND CENTER
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            ACTIVE CASE ID: <span className="text-sky-400 font-bold">{currentCaseId}</span> • SUBJECT: <span className="text-white font-semibold">{personName.toUpperCase()}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cctv014Investigated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 neon-card-green">
              <CheckCircle2 size={14} className="neon-icon-green" />
              CCTV-014 INTEGRATED (+23%)
            </span>
          )}
          <span className="prototype-badge font-mono border-emerald-500/30 bg-[#111821]">
            <span className="live-pulse-neon-green"></span>
            CONFIDENCE: {activeCase?.certainty.overall}%
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
            <span>NEW EVIDENCE</span>
            <FileText className="w-4 h-4 neon-icon-green" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.newEvidenceCount}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">Cataloged today</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>INVESTIGATION GAPS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.unresolvedGapsCount}</div>
          <div className="text-[10px] text-amber-400 mt-1 font-mono">10:18 AM - 10:31 AM</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>HIGH PRIORITY</span>
            <Target className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.highPriorityLeadsCount}</div>
          <div className="text-[10px] text-red-400 mt-1 font-mono">Requires verification</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#8B98A8] mb-1.5 uppercase tracking-wider">
            <span>CASE CERTAINTY</span>
            <Search className="w-4 h-4 neon-icon-green" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.avgCertainty}%</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">{cctv014Investigated ? 'Up from 61%' : 'Weighted composite'}</div>
        </div>
      </div>

      {/* Hero Panel: LIVE INVESTIGATION OVERVIEW */}
      <div className="glass-card p-6 border-sky-500/30 bg-gradient-to-r from-[#0D1219] via-[#111821] to-[#0D1219] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <span className="live-pulse-red"></span>
              <h2 className="text-xs font-bold text-red-400 font-mono tracking-widest uppercase">LIVE INVESTIGATION OVERVIEW</h2>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-white font-mono tracking-wide">CASE {currentCaseId}</p>
              <div className="flex items-center gap-3 text-xs text-[#8B98A8]">
                <span className="px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-bold font-mono">
                  ● ACTIVE INVESTIGATION
                </span>
                <span>Subject: <strong className="text-white">{personName}</strong></span>
              </div>
            </div>

            <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] text-xs space-y-1 font-mono">
              <div className="text-[#8B98A8]">LAST CONFIRMED SPOT</div>
              <div className="text-white font-bold text-sm flex items-center gap-2">
                <span>📍 {lastLoc}</span>
                <span className="text-sky-400 font-normal">| 10:30 AM</span>
              </div>
            </div>
          </div>

          {/* Live Network Connection Stream */}
          <div className="flex-1 bg-[#080B10]/80 p-4 rounded-xl border border-[#1D2733] space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#8B98A8] flex items-center justify-between">
              <span>LIVE EVIDENCE NETWORK STREAM</span>
              <span className="text-sky-400 font-bold">REAL-TIME LINKAGE</span>
            </div>

            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 text-xs font-mono">
              <div className="px-3 py-2 bg-[#111821] border border-emerald-500/40 rounded text-center min-w-[90px]">
                <span className="text-emerald-400 font-bold block text-[10px]">LAST KNOWN</span>
                <span className="text-white text-[11px]">10:18 AM</span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#8B98A8] flex-shrink-0" />

              <div className="px-3 py-2 bg-[#111821] border border-emerald-500/40 rounded text-center min-w-[90px]">
                <span className="text-emerald-400 font-bold block text-[10px]">CCTV</span>
                <span className="text-white text-[11px]">CAM-001</span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#8B98A8] flex-shrink-0" />

              <div className="px-3 py-2 bg-[#111821] border border-sky-500/40 rounded text-center min-w-[100px]">
                <span className="text-sky-400 font-bold block text-[10px]">SIGHTING</span>
                <span className="text-white text-[11px]">Citizen #23</span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#8B98A8] flex-shrink-0" />

              <div className="px-3 py-2 bg-[#111821] border border-amber-500/40 rounded text-center min-w-[90px]">
                <span className="text-amber-400 font-bold block text-[10px]">TRANSPORT</span>
                <span className="text-white text-[11px]">Bus #12</span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#8B98A8] flex-shrink-0" />

              <div className={`px-3 py-2 rounded text-center min-w-[110px] border ${
                cctv014Investigated ? 'bg-emerald-950/40 border-emerald-500' : 'bg-red-950/40 border-red-500/60'
              }`}>
                <span className={`${cctv014Investigated ? 'text-emerald-400' : 'text-red-400'} font-bold block text-[10px]`}>
                  {cctv014Investigated ? 'CCTV-014' : 'UNKNOWN CORRIDOR'}
                </span>
                <span className="text-white text-[11px]">{cctv014Investigated ? 'Verified 10:24' : '13-Min Gap'}</span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#8B98A8] flex-shrink-0" />

              <div className="px-3 py-2 bg-[#111821] border border-sky-500/40 rounded text-center min-w-[90px]">
                <span className="text-sky-400 font-bold block text-[10px]">SEARCH ZONE</span>
                <span className="text-white text-[11px]">{cctv014Investigated ? 'Zone B (91%)' : 'Zone B (78%)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uncertainty DNA Breakdown & Subject Info */}
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
