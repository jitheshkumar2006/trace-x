import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function NextBestEvidencePage() {
  const { recommendations, investigateCCTV014, cctv014Investigated } = useAppStore();
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const topRec = recommendations[0];

  const handleInvestigateClick = () => {
    setIsInvestigating(true);
    setTimeout(() => {
      investigateCCTV014();
      setIsInvestigating(false);
      setShowSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Crosshair className="text-blue-500 w-6 h-6" />
            Top Recommended Action
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">AI engine ranks clues by how much they help solve the case</p>
        </div>

        <span className="prototype-badge">
          {cctv014Investigated ? 'Evidence Added' : '1 Priority Action Available'}
        </span>
      </div>

      {/* Main Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Recommendation Highlight */}
        <div className="lg:col-span-2 glass-card p-6 border-blue-500/30 bg-blue-500/5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="badge-very-high">🔴 HIGH PRIORITY STEP</span>
              <h2 className="text-xl font-bold text-white mt-2">Check CCTV Camera 014 (Central Bus Stand)</h2>
              <p className="text-xs text-navy-300 mt-1">This footage will tell us if Rahul boarded a bus or walked toward the market.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-navy-400 block uppercase">Confidence Boost</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">+23%</span>
            </div>
          </div>

          <div className="bg-navy-900/60 p-4 rounded border border-navy-800 space-y-2 text-xs">
            <span className="font-bold text-white">Why check this camera first?</span>
            <ul className="list-disc pl-4 space-y-1.5 text-navy-300">
              <li>It covers the exact 13-minute missing timeline gap (10:18 AM to 10:31 AM).</li>
              <li>It proves whether Rahul boarded Bus #12 or stayed on foot.</li>
              <li>Camera quality is high (1080p, clear lighting).</li>
            </ul>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-between">
            {cctv014Investigated ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={16} /> CCTV-014 CHECKED & ADDED TO CASE
              </span>
            ) : (
              <button
                onClick={handleInvestigateClick}
                disabled={isInvestigating}
                className="btn-danger text-sm font-bold px-6 py-2.5"
              >
                {isInvestigating ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> Retrieving CCTV-014 Footage...
                  </span>
                ) : (
                  '📹 CHECK CCTV-014 FOOTAGE NOW'
                )}
              </button>
            )}

            <span className="text-xs text-navy-500 font-mono">Clue ID: EVD-019</span>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs text-emerald-400 flex items-center justify-between"
              >
                <span>✓ CCTV-014 footage processed! Case confidence increased from <strong>61% to 84%</strong>!</span>
                <button onClick={() => setShowSuccess(false)} className="underline text-emerald-300">Dismiss</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Evidence Value Score breakdown */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-navy-800">AI Score Breakdown</h3>

            <div className="text-center py-3">
              <span className="text-4xl font-bold text-blue-400 font-mono">{topRec?.evidenceValueScore || 92}%</span>
              <p className="text-xs text-navy-400 mt-1">Overall usefulness score</p>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <div className="flex justify-between text-navy-300 mb-1">
                  <span>Spot Relevance</span>
                  <span className="text-white font-mono">{topRec?.locationRelevance || 94}%</span>
                </div>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-blue-500" style={{ width: `${topRec?.locationRelevance || 94}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-navy-300 mb-1">
                  <span>Time Fit</span>
                  <span className="text-white font-mono">{topRec?.temporalRelevance || 91}%</span>
                </div>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-blue-500" style={{ width: `${topRec?.temporalRelevance || 91}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-navy-300 mb-1">
                  <span>Camera Trustworthiness</span>
                  <span className="text-white font-mono">{topRec?.sourceReliability || 88}%</span>
                </div>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-emerald-500" style={{ width: `${topRec?.sourceReliability || 88}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-navy-400 pt-3 border-t border-navy-800">
            Higher scores mean checking this clue will solve the case much faster.
          </div>
        </div>
      </div>

      {/* Ranked List of Recommendations */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-navy-800">All Ranked Missing Evidence Recommendations</h3>

        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="bg-navy-900/50 p-4 rounded border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-navy-800 border border-navy-700 flex items-center justify-center font-mono font-bold text-navy-300">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm">{rec.evidenceSource}</h4>
                  <p className="text-navy-400">{rec.hypothesisDistinction}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                  rec.priority === 'very_high' ? 'badge-very-high' : rec.priority === 'high' ? 'badge-high' : 'badge-medium'
                }`}>
                  {rec.priority.replace('_', ' ')}
                </span>
                <span className="font-mono text-sm font-bold text-blue-400">{rec.evidenceValueScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
