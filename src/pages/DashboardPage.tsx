import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Search,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../store/useStore';

const getCertaintyColor = (value: number) => {
  if (value > 75) return 'bg-emerald-500';
  if (value > 50) return 'bg-blue-500';
  if (value > 30) return 'bg-amber-500';
  return 'bg-red-500';
};

export default function DashboardPage() {
  const { cases, activeCase, evidence, gaps, hypotheses, auditLog, cctv014Investigated } = useAppStore();

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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-navy-400 mt-0.5">Case ID: <span className="font-mono text-blue-400 font-semibold">{activeCase?.id || 'TRX-2026-001'}</span> • Subject: <span className="text-white font-semibold">{activeCase?.person.name}</span></p>
        </div>

        <div className="flex items-center gap-3">
          {cctv014Investigated && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={13} />
              CCTV-014 Investigated
            </span>
          )}
          <span className="prototype-badge">
            Certainty: {activeCase?.certainty.overall}%
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Active Cases</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeCasesCount}</div>
          <div className="text-[11px] text-navy-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> High priority active
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Evidence Items</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.newEvidenceCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1">+{cctv014Investigated ? '6' : '5'} registered</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Priority Leads</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.highPriorityLeadsCount}</div>
          <div className="text-[11px] text-amber-400 mt-1">Verification required</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Critical Gaps</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.unresolvedGapsCount}</div>
          <div className="text-[11px] text-red-400 mt-1">10:18 AM - 10:31 AM</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-center text-xs text-navy-400 mb-2">
            <span>Overall Certainty</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgCertainty}%</div>
          <div className="text-[11px] text-indigo-400 mt-1">{cctv014Investigated ? 'Up from 61%' : 'Baseline score'}</div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Uncertainty Overview */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Evidence Certainty Profile</h2>
              <p className="text-xs text-navy-400">Dimension breakdown for active investigation</p>
            </div>
            <span className="text-xl font-bold text-blue-400 font-mono">{activeCase?.certainty.overall}%</span>
          </div>

          <div className="space-y-3.5">
            {certaintyData?.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-navy-300 font-medium">{item.key}</span>
                  <span className="text-white font-mono font-semibold">{item.value}%</span>
                </div>
                <div className="certainty-bar">
                  <div
                    className={`certainty-bar-fill ${getCertaintyColor(item.value)}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Subject Summary */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-navy-800">Active Subject File</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-navy-900 rounded-md border border-navy-700 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {activeCase?.person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{activeCase?.person.name}</h3>
                  <p className="text-xs text-navy-400">{activeCase?.person.age} yrs • {activeCase?.person.gender} • <span className="capitalize text-blue-400 font-medium">{activeCase?.person.category}</span></p>
                </div>
              </div>

              <div className="bg-navy-900/60 p-3 rounded border border-navy-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-navy-400">Last Known:</span>
                  <span className="text-navy-200 font-medium">{activeCase?.person.lastKnownLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">Timestamp:</span>
                  <span className="text-navy-200 font-mono">{new Date(activeCase?.person.lastKnownDateTime || '').toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-navy-800 flex justify-between items-center text-xs text-navy-400">
            <span>Status: <span className="text-emerald-400 font-semibold uppercase">{activeCase?.status}</span></span>
            <span className="font-mono"><Clock className="w-3 h-3 inline mr-1 text-blue-400" />{new Date(activeCase?.updatedAt || '').toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Hypotheses & Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competing Hypotheses */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-navy-800">Competing Movement Hypotheses</h2>
          <div className="space-y-3">
            {hypotheses.slice(0, 3).map((hypothesis) => (
              <div key={hypothesis.id} className="bg-navy-900/50 p-3 rounded border border-navy-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{hypothesis.name}</span>
                  <span className="text-xs font-mono font-bold text-blue-400">{hypothesis.confidence}%</span>
                </div>
                <p className="text-xs text-navy-400">{hypothesis.description}</p>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-blue-500" style={{ width: `${hypothesis.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-navy-800">Audit Trail Activity</h2>
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
