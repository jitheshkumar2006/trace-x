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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const }
  }
};

// Colors based on certainty thresholds
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

  const recentActivity = useMemo(() => {
    return auditLog.slice(0, 5);
  }, [auditLog]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TRACE-X Dashboard</h1>
          <p className="text-navy-400 text-sm mt-1">
            "Don't just search the evidence. Find the evidence you're missing."
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cctv014Investigated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 size={14} />
              CCTV-014 Investigated
            </span>
          )}
          <span className="prototype-badge">Smart India Hackathon 2026</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants} className="glass-card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400">Active Missing Cases</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{stats.activeCasesCount}</div>
            <div className="text-xs text-navy-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>1 priority case active</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400">New Evidence Items</span>
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{stats.newEvidenceCount}</div>
            <div className="text-xs text-emerald-400 mt-1">
              +{cctv014Investigated ? '6' : '5'} today
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400">High-Priority Leads</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{stats.highPriorityLeadsCount}</div>
            <div className="text-xs text-amber-400 mt-1">Requires human verification</div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400">Unresolved Gaps</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{stats.unresolvedGapsCount}</div>
            <div className="text-xs text-red-400 mt-1">1 critical time window</div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400">Avg Case Certainty</span>
            <Search className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{stats.avgCertainty}%</div>
            <div className="text-xs text-indigo-400 mt-1">
              {cctv014Investigated ? 'Increased from 61%' : 'Baseline score'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Uncertainty Overview */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white">Case Uncertainty Overview (Evidence DNA)</h2>
              <p className="text-xs text-navy-400">Case ID: {activeCase?.id || 'TRX-2026-001'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-navy-400 uppercase tracking-wider block font-semibold">Overall Certainty</span>
                <span className="text-2xl font-black text-accent-blue">{activeCase?.certainty.overall}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {certaintyData?.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-navy-300">{item.key}</span>
                  <span className="text-white font-mono">{item.value}%</span>
                </div>
                <div className="certainty-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`certainty-bar-fill ${getCertaintyColor(item.value)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Case Summary */}
        <motion.div variants={itemVariants} className="glass-card p-6 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-4">Active Subject</h2>
          {activeCase ? (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-navy-800 rounded-lg flex items-center justify-center border border-blue-500/30 overflow-hidden flex-shrink-0">
                  <Users className="w-8 h-8 text-blue-400 opacity-60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{activeCase.person.name}</h3>
                  <p className="text-xs font-mono text-accent-blue">{activeCase.id}</p>
                  <p className="text-xs text-navy-300 mt-1">Age {activeCase.person.age} • {activeCase.person.gender}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-navy-900/50 p-2.5 rounded border border-navy-700/50">
                  <div className="text-navy-400">Category</div>
                  <div className="text-white font-semibold capitalize">{activeCase.person.category}</div>
                </div>
                <div className="bg-navy-900/50 p-2.5 rounded border border-navy-700/50">
                  <div className="text-navy-400">Status</div>
                  <div className="text-emerald-400 font-semibold uppercase">{activeCase.status}</div>
                </div>
              </div>

              <div className="bg-navy-900/50 p-3 rounded border border-navy-700/50 text-xs">
                <div className="text-navy-400 mb-1">Last Known Location</div>
                <div className="text-white font-medium">{activeCase.person.lastKnownLocation}</div>
              </div>

              <div className="flex justify-between items-center text-xs text-navy-400 pt-2 border-t border-navy-700/50">
                <span>Last Updated</span>
                <span className="font-mono text-navy-300">
                  <Clock className="w-3 h-3 inline mr-1 text-blue-400" />
                  {new Date(activeCase.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-navy-500">
              No active case selected
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competing Hypotheses */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Competing Movement Hypotheses</h2>
            <span className="badge-high">Probability Ranked</span>
          </div>
          <div className="space-y-4">
            {hypotheses.slice(0, 3).map((hypothesis, idx) => (
              <div key={hypothesis.id} className="bg-navy-900/40 p-3 rounded-lg border border-navy-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-navy-100">{hypothesis.name}</div>
                  <div className="font-mono text-sm font-bold text-accent-cyan">{hypothesis.confidence}%</div>
                </div>
                <p className="text-xs text-navy-400 mb-2">{hypothesis.description}</p>
                <div className="certainty-bar h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hypothesis.confidence}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * idx }}
                    className="certainty-bar-fill bg-accent-cyan"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Investigation Audit Trail</h2>
          <div className="space-y-3">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex gap-3 text-xs bg-navy-900/40 p-2.5 rounded border border-navy-800">
                <div className="text-blue-400 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white mr-1">{log.userName}:</span>
                  <span className="text-navy-300">{log.details}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
