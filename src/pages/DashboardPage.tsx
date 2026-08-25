import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Search,
  CheckCircle2,
  TrendingUp,
  Shield,
  Heart,
  Eye,
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';

const getCertaintyColor = (value: number) => {
  if (value > 75) return 'bg-emerald-500';
  if (value > 50) return 'bg-blue-500';
  if (value > 30) return 'bg-amber-500';
  return 'bg-red-500';
};

export default function DashboardPage() {
  const { cases, activeCase, evidence, gaps, hypotheses, auditLog, cctv014Investigated } = useAppStore();
  const { currentUser } = useAuthStore();
  const userRole = currentUser?.role || 'police';

  const stats = useMemo(() => {
    const activeCasesCount = cases.filter((c) => c.status === 'active').length;
    const newEvidenceCount = evidence.length;
    const highPriorityLeadsCount = evidence.filter(
      (e) => e.verificationStatus === 'potential_lead' || e.verificationStatus === 'confirmed'
    ).length;
    const unresolvedGapsCount = gaps.length;
    const avgCertainty = Math.round(
      cases.reduce((acc, curr) => acc + curr.certainty.overall, 0) / (cases.length || 1)
    );

    return {
      activeCasesCount,
      newEvidenceCount,
      highPriorityLeadsCount,
      unresolvedGapsCount,
      avgCertainty
    };
  }, [cases, evidence, gaps]);

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
  const lastLoc = activeCase?.person.lastKnownLocation || 'Central Market';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Case Summary Dashboard</h1>
          <p className="text-xs text-navy-400 mt-0.5">Case ID: <span className="font-mono text-blue-400 font-semibold">{currentCaseId}</span> • Subject: <span className="text-white font-semibold">{personName}</span></p>
        </div>

        <div className="flex items-center gap-3">
          {cctv014Investigated && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={14} />
              CCTV-014 Added to Case
            </span>
          )}
          <span className="prototype-badge">
            Overall Confidence: {activeCase?.certainty.overall}%
          </span>
        </div>
      </div>

      {/* Role-Tailored Explainer Banner */}
      {userRole === 'family' ? (
        <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-lg flex items-start gap-3">
          <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">Family View Portal — Approved Case Progress Update</p>
            <p className="text-navy-300">
              Official update for <strong>{personName}</strong>: Police & field search teams are actively tracking last known locations near <strong>{lastLoc}</strong>. Raw CCTV footage and biometric records are protected for security.
            </p>
          </div>
        </div>
      ) : userRole === 'volunteer' ? (
        <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-lg flex items-start gap-3">
          <Eye className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">Field Volunteer Portal — Ground Search Active</p>
            <p className="text-navy-300">
              Search teams are focusing on <strong>{lastLoc} & Bus Stand Corridor</strong>. If you spot {personName}, please submit a report immediately on the <strong>Public Sightings</strong> tab.
            </p>
          </div>
        </div>
      ) : userRole === 'ngo' ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-lg flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">NGO Partner Portal — Case Oversight</p>
            <p className="text-navy-300">
              You are viewing assigned case <strong>{currentCaseId} ({personName})</strong>. Submit structured field reports or check citizen sighting submissions.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-lg flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">Police Command View — What is happening in this case?</p>
            <p className="text-navy-300">
              {cctv014Investigated ? (
                <>We successfully checked <strong>CCTV-014 at the bus stand</strong>. The 13-minute gap is resolved, and overall case confidence jumped from <strong>61% to 84%</strong>.</>
              ) : (
                <>We know {personName} was at <strong>{lastLoc} at 10:18 AM</strong>. However, there is a <strong>13-minute missing gap</strong> before he appears at 10:31 AM. The AI recommends checking <strong>CCTV Camera 014</strong> next.</>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Active Cases</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeCasesCount}</div>
          <div className="text-[11px] text-navy-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Active investigation
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Clues Collected</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.newEvidenceCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1">+{cctv014Investigated ? '6' : '5'} total clues</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Leads to Verify</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.highPriorityLeadsCount}</div>
          <div className="text-[11px] text-amber-400 mt-1">Needs police review</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Missing Time Gaps</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.unresolvedGapsCount}</div>
          <div className="text-[11px] text-red-400 mt-1">10:18 AM - 10:31 AM</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Case Confidence</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgCertainty}%</div>
          <div className="text-[11px] text-indigo-400 mt-1">{cctv014Investigated ? 'Up from 61%' : 'Based on 5 clues'}</div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Uncertainty Overview */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">How Sure Are We About Each Detail?</h2>
              <p className="text-xs text-navy-400">Confidence scores for person, time, place, and route</p>
            </div>
            <span className="text-xl font-bold text-blue-400 font-mono">{activeCase?.certainty.overall}% overall</span>
          </div>

          <div className="space-y-3.5">
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
                    <span className="text-navy-200 font-medium">
                      {item.key} <span className="text-[11px] text-navy-400 font-normal">({explainers[item.key]})</span>
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

        {/* Active Subject Summary */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-navy-800">Missing Person Details</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-navy-900 rounded-md border border-navy-700 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {activeCase?.person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{activeCase?.person.name}</h3>
                  <p className="text-xs text-navy-400">{activeCase?.person.age} years old • {activeCase?.person.gender} • <span className="capitalize text-blue-400 font-medium">{activeCase?.person.category}</span></p>
                </div>
              </div>

              <div className="bg-navy-900/60 p-3 rounded border border-navy-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-navy-400">Last Seen At:</span>
                  <span className="text-navy-200 font-medium">{activeCase?.person.lastKnownLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">Time Last Seen:</span>
                  <span className="text-navy-200 font-mono">10:18 AM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-navy-800 flex justify-between items-center text-xs text-navy-400">
            <span>Case Status: <span className="text-emerald-400 font-semibold uppercase">{activeCase?.status}</span></span>
            <span className="font-mono"><Clock className="w-3 h-3 inline mr-1 text-blue-400" />Active</span>
          </div>
        </div>
      </div>

      {/* Hypotheses & Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competing Hypotheses */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Most Likely Scenarios</h2>
          <p className="text-xs text-navy-400 mb-4 pb-2 border-b border-navy-800">What the AI thinks could have happened, ordered by likelihood</p>
          <div className="space-y-3">
            {hypotheses.slice(0, 3).map((hypothesis) => (
              <div key={hypothesis.id} className="bg-navy-900/50 p-3 rounded border border-navy-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{hypothesis.name}</span>
                  <span className="text-xs font-mono font-bold text-blue-400">{hypothesis.confidence}% Chance</span>
                </div>
                <p className="text-xs text-navy-300">{hypothesis.description}</p>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-blue-500" style={{ width: `${hypothesis.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Recent Activity Log</h2>
          <p className="text-xs text-navy-400 mb-4 pb-2 border-b border-navy-800">Actions taken by officers and system automated analysis</p>
          <div className="space-y-2 text-xs">
            {auditLog.slice(0, 4).map((log) => (
              <div key={log.id} className="flex gap-3 bg-navy-900/50 p-2.5 rounded border border-navy-800">
                <span className="text-blue-400 font-mono whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-navy-300"><strong className="text-white">{log.userName}:</strong> {log.details}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
