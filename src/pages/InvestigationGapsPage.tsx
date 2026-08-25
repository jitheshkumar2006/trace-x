import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Search, ChevronRight, HelpCircle, AlertCircle, SearchX } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function InvestigationGapsPage() {
  const { gaps, cctv014Investigated } = useAppStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const sortedGaps = useMemo(() => {
    return [...gaps].sort((a, b) => {
      const priorityWeights: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    });
  }, [gaps]);

  const criticalGap = sortedGaps.find(g => g.priority === 'critical') || sortedGaps[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4 border-b border-navy-700/50 pb-6">
        <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            WHAT DON'T WE KNOW?
          </h1>
          <p className="text-navy-400 text-lg">Investigation Uncertainty & Missing Evidence Analysis</p>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">
          {criticalGap && (
            <motion.div variants={itemVariants} className="glass-card border-amber-500/50 bg-amber-500/10 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-32 h-32 text-amber-400" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xl mb-4">
                  <AlertCircle className="w-6 h-6" />
                  ⚠ INVESTIGATION UNCERTAINTY
                </div>

                <p className="text-white text-lg">
                  The system cannot reliably determine the subject's movement between:
                </p>

                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-lg font-mono text-xl border border-white/5">
                  <div className="text-white/80">{criticalGap.timeStart ? new Date(criticalGap.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:18 AM'}</div>
                  <ChevronRight className="w-6 h-6 text-white/40" />
                  <div className="text-white/80">{criticalGap.timeEnd ? new Date(criticalGap.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:31 AM'}</div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <span className="text-navy-400 uppercase text-sm tracking-wider font-semibold">Current uncertainty</span>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-4xl font-bold text-amber-400 font-mono"
                  >
                    {cctv014Investigated ? '28%' : `${criticalGap.uncertainty}%`}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white/90">
              <Search className="w-5 h-5 text-accent-blue" />
              Missing Evidence Requirements
            </h2>

            <div className="grid gap-4">
              {criticalGap?.missingEvidence.map((evidence, idx) => (
                <div key={idx} className="glass-card-light p-4 flex items-start gap-4 border-l-4 border-l-red-500">
                  <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-mono text-blue-400 font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-white/90">{evidence}</h4>
                    <p className="text-navy-400 text-xs mt-1">Required to resolve the time-location transition gap and reduce uncertainty.</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6 text-white">Uncertainty Timeline</h3>
            <div className="relative h-20 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-white/10 top-1/2 -translate-y-1/2"></div>

              <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10" title="Known Point A"></div>
              <div className="absolute left-[10%] top-[calc(50%+16px)] text-xs text-navy-400 font-mono -translate-x-1/2">10:18 AM</div>

              <div className="absolute left-[10%] right-[60%] h-1 bg-emerald-500 top-1/2 -translate-y-1/2"></div>

              <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10" title="Known Point B"></div>
              <div className="absolute left-[60%] top-[calc(50%+16px)] text-xs text-navy-400 font-mono -translate-x-1/2">10:31 AM</div>

              <div className="absolute left-[60%] right-[90%] h-1 bg-emerald-500 top-1/2 -translate-y-1/2"></div>

              <div className="absolute left-[90%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10" title="Known Point C"></div>
              <div className="absolute left-[90%] top-[calc(50%+16px)] text-xs text-navy-400 font-mono -translate-x-1/2">10:45 AM</div>

              <div className="absolute left-[20%] right-[50%] h-4 top-1/2 -translate-y-1/2 rounded bg-amber-500/20 border border-amber-500/50 border-dashed z-0 flex items-center justify-center">
                <span className="text-xs text-amber-400 font-bold bg-[#0f172a] px-2 rounded-full absolute -top-3">CRITICAL GAP</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="glass-card border-indigo-500/30 bg-indigo-500/5 p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
              <SearchX className="w-5 h-5" />
              NEGATIVE EVIDENCE
            </h2>

            <div className="space-y-4 text-sm">
              <div className="bg-black/30 p-3 rounded border border-white/5 space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Expected:</span>
                  <span className="text-navy-200">CCTV-007 → CCTV-009</span>
                </div>
                <div className="flex items-center justify-between text-amber-400">
                  <span>Observed:</span>
                  <span>CCTV-007 → ? → CCTV-009</span>
                </div>
              </div>

              <div>
                <p className="text-navy-300 font-medium mb-2 flex items-center gap-1"><HelpCircle className="w-4 h-4 text-indigo-400" /> Possible explanations:</p>
                <ul className="space-y-2 text-navy-400 text-xs">
                  <li className="flex gap-2"><span className="text-indigo-400 font-bold">1.</span> Alternate route avoiding main cameras</li>
                  <li className="flex gap-2"><span className="text-indigo-400 font-bold">2.</span> Known CCTV coverage gap on 4th Street</li>
                  <li className="flex gap-2"><span className="text-indigo-400 font-bold">3.</span> Vehicle/transport transition (entered car/bus)</li>
                  <li className="flex gap-2"><span className="text-indigo-400 font-bold">4.</span> Occlusion by large crowds/vehicles</li>
                  <li className="flex gap-2"><span className="text-indigo-400 font-bold">5.</span> Previous lead match may be incorrect</li>
                </ul>
              </div>

              <div className="text-xs text-navy-400 italic bg-black/20 p-2 rounded mt-4 border border-navy-700/40">
                Note: System does not automatically determine which explanation is correct. Human verification required.
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-semibold text-white/80">All Identified Gaps</h3>
            <div className="space-y-3">
              {sortedGaps.map((gap) => (
                <div key={gap.id} className="glass-card-light p-4 space-y-2 border-l-2" style={{ borderLeftColor: gap.priority === 'critical' ? 'var(--color-status-danger)' : gap.priority === 'high' ? 'var(--color-status-warning)' : 'var(--color-accent-blue)' }}>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-white/90 text-sm">{gap.description}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${
                      gap.priority === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      gap.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>{gap.priority}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-navy-400 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {gap.timeStart ? new Date(gap.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'} - {gap.timeEnd ? new Date(gap.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                    <span>Uncertainty: {cctv014Investigated && gap.id === 'GAP-001' ? '28%' : `${gap.uncertainty}%`}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
