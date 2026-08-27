import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function InvestigationGapsPage() {
  const { activeCase, gaps, cctv014Investigated } = useAppStore();
  const personName = activeCase?.person.name || 'the subject';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <AlertTriangle className="text-amber-400 w-6 h-6" />
            INVESTIGATION UNCERTAINTY
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            TIMELINE GAPS & MOVEMENT UNCERTAINTY MATRIX FOR <span className="text-white font-semibold">{personName.toUpperCase()}</span>
          </p>
        </div>

        <span className="prototype-badge font-mono">
          {cctv014Investigated ? 'UNCERTAINTY REDUCED' : 'CRITICAL GAP DETECTED'}
        </span>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Uncertainty Box */}
        <div className="lg:col-span-2 space-y-6">
          {criticalGap && (
            <motion.div variants={itemVariants} className="glass-card border-amber-500/40 bg-[#0D1219] p-6 space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1D2733] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                    PRIMARY TIMELINE GAP
                  </span>
                  <h2 className="text-xl font-extrabold text-white font-mono">Critical Evidence Gap</h2>
                </div>

                <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] text-right font-mono">
                  <div className="text-[10px] text-[#8B98A8] uppercase">CURRENT UNCERTAINTY</div>
                  <motion.div
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="text-3xl font-extrabold text-amber-400"
                  >
                    {cctv014Investigated ? '28%' : '68%'}
                  </motion.div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[#E6EDF3]">
                  No reliable movement evidence detected for {personName} during this window:
                </p>

                <div className="flex items-center justify-between gap-3 bg-[#080B10] p-4 rounded-lg font-mono text-sm border border-[#1D2733]">
                  <div className="text-white">10:18 AM <span className="text-xs text-[#8B98A8] block font-sans">(Central Market)</span></div>
                  <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="text-white">10:31 AM <span className="text-xs text-[#8B98A8] block font-sans">(Metro Gate B)</span></div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 font-mono">
                  ⚠ {cctv014Investigated ? 'Gap resolved via CCTV-014 footage.' : 'Uncertainty level: 68%. System cannot confirm transport vs on-foot movement.'}
                </div>
              </div>

              {/* Numbered Missing Information List */}
              <div className="pt-2 space-y-3 border-t border-[#1D2733]">
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">MISSING INFORMATION</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] space-y-1">
                    <span className="text-amber-400 font-bold text-sm block">01</span>
                    <span className="text-white font-semibold">CCTV Transition</span>
                    <p className="text-[11px] text-[#8B98A8] font-sans mt-1">Camera footage between market and transit hub</p>
                  </div>

                  <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] space-y-1">
                    <span className="text-amber-400 font-bold text-sm block">02</span>
                    <span className="text-white font-semibold">Transport Clue</span>
                    <p className="text-[11px] text-[#8B98A8] font-sans mt-1">Bus ticket scan or vehicle plate detection</p>
                  </div>

                  <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] space-y-1">
                    <span className="text-amber-400 font-bold text-sm block">03</span>
                    <span className="text-white font-semibold">Witness Confirmation</span>
                    <p className="text-[11px] text-[#8B98A8] font-sans mt-1">Eyewitness sighting at Bus Route 12 stop</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* All Detected Gaps Table */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1D2733] font-mono">ALL DETECTED INVESTIGATION GAPS</h3>

            <div className="space-y-3">
              {sortedGaps.map((gap) => (
                <div key={gap.id} className="bg-[#080B10] p-4 rounded-lg border border-[#1D2733] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sky-400 font-bold">{gap.id}</span>
                      <span className="text-white font-semibold">{gap.description}</span>
                    </div>
                    <p className="text-[#8B98A8] font-mono">
                      Window: {gap.timeStart || '10:18 AM'} — {gap.timeEnd || '10:31 AM'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      gap.priority === 'critical' ? 'badge-very-high' : gap.priority === 'high' ? 'badge-high' : 'badge-medium'
                    }`}>
                      {gap.priority}
                    </span>
                    <span className="text-amber-400 font-bold">{gap.uncertainty}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explanations Panel */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#1D2733] font-mono">NEGATIVE EVIDENCE ANALYSIS</h3>

            <div className="space-y-4 text-xs">
              <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
                <span className="text-[#8B98A8] block mb-1 font-mono">EXPECTED PATH</span>
                <span className="text-white font-semibold">CCTV-007 → CCTV-009</span>
              </div>

              <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
                <span className="text-[#8B98A8] block mb-1 font-mono">OBSERVED STREAM</span>
                <span className="text-amber-400 font-semibold font-mono">CCTV-007 → [ UNKNOWN ] → CCTV-009</span>
              </div>

              <div className="space-y-2">
                <span className="text-[#8B98A8] font-mono uppercase text-[11px]">Possible Explanations:</span>
                <ol className="list-decimal pl-4 space-y-1.5 text-[#E6EDF3]">
                  <li>Subject used an unmonitored alternate route.</li>
                  <li>CCTV camera coverage gap in Sector 4.</li>
                  <li>Vehicle/transport transition occurred.</li>
                  <li>Temporary visual occlusion by crowd.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#8B98A8] pt-3 border-t border-[#1D2733] font-mono">
            System catalogs possibilities without automatically enforcing claims.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
