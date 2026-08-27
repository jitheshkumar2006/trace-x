import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, CheckCircle2, Activity, ArrowRight, Check } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function NextBestEvidencePage() {
  const { activeCase, recommendations, investigateCCTV014, cctv014Investigated } = useAppStore();
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const personName = activeCase?.person.name || 'the subject';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <Crosshair className="text-sky-400 w-6 h-6" />
            NEXT BEST EVIDENCE
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            INFORMATION-GAIN ENGINE • RANKED BY EXPECTED UNCERTAINTY REDUCTION (%) FOR <span className="text-white font-semibold">{personName.toUpperCase()}</span>
          </p>
        </div>

        <span className="prototype-badge font-mono">
          {cctv014Investigated ? 'EVIDENCE INTEGRATED' : '1 PRIORITY STEP RECOMMENDED'}
        </span>
      </div>

      {/* Horizontal Certainty Progression Bar */}
      <div className="glass-card p-5 border-sky-500/30 bg-[#0D1219]">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#8B98A8] mb-3">
          CERTAINTY PROGRESSION TIMELINE
        </div>
        <div className="flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-2 p-3 bg-[#080B10] border border-[#1D2733] rounded-lg min-w-[130px]">
            <span className="text-[#8B98A8]">INITIAL</span>
            <span className="text-white font-bold text-sm">61%</span>
          </div>

          <ArrowRight className="w-4 h-4 text-[#8B98A8] flex-shrink-0" />

          <div className={`flex items-center gap-2 p-3 rounded-lg min-w-[150px] border transition-all ${
            cctv014Investigated ? 'bg-[#111821] border-sky-500/50' : 'bg-[#080B10] border-[#1D2733] opacity-60'
          }`}>
            <span className="text-sky-400 font-bold">EVIDENCE ADDED</span>
            <span className="text-white font-bold text-sm">72%</span>
          </div>

          <ArrowRight className="w-4 h-4 text-[#8B98A8] flex-shrink-0" />

          <div className={`flex items-center gap-2 p-3 rounded-lg min-w-[150px] border transition-all ${
            cctv014Investigated ? 'bg-emerald-950/40 border-emerald-500 shadow-md' : 'bg-[#080B10] border-[#1D2733] opacity-40'
          }`}>
            <span className="text-emerald-400 font-bold">CROSS-VERIFIED</span>
            <span className="text-emerald-400 font-bold text-sm">84%</span>
          </div>
        </div>
      </div>

      {/* Main Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Recommendation Highlight */}
        <div className="lg:col-span-2 glass-card p-6 border-sky-500/40 bg-[#0D1219] space-y-5">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="badge-very-high font-mono">🔴 HIGH PRIORITY ACTION</span>
              <h2 className="text-xl font-extrabold text-white mt-2 font-mono">CCTV-014 (Central Bus Stand)</h2>
              <p className="text-xs text-[#8B98A8] mt-1">
                Verifies movement corridor and distinguishes Hypothesis A from Hypothesis B for {personName}.
              </p>
            </div>

            <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] text-right font-mono">
              <div className="text-[10px] text-[#8B98A8] uppercase">UNCERTAINTY REDUCTION</div>
              <div className="text-2xl font-bold text-sky-400">31%</div>
              <div className="text-[10px] text-emerald-400 font-semibold">EVIDENCE VALUE: 92%</div>
            </div>
          </div>

          {/* Why This Matters List */}
          <div className="bg-[#080B10] p-4 rounded-lg border border-[#1D2733] space-y-2.5 text-xs">
            <span className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">WHY THIS MATTERS</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#E6EDF3]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Covers critical evidence gap</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Distinguishes Hypothesis A/B</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>High temporal relevance</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>High location relevance</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            {cctv014Investigated ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 font-mono">
                <CheckCircle2 size={16} /> CCTV-014 INVESTIGATED & INTEGRATED
              </span>
            ) : (
              <button
                onClick={handleInvestigateClick}
                disabled={isInvestigating}
                className="btn-primary text-xs font-extrabold px-6 py-2.5 uppercase tracking-wider font-mono cursor-pointer"
              >
                {isInvestigating ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin text-sky-300" /> RETRIEVING CCTV-014 FOOTAGE...
                  </span>
                ) : (
                  'INVESTIGATE'
                )}
              </button>
            )}

            <span className="text-xs text-[#8B98A8] font-mono">EVIDENCE ID: EVD-019</span>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs text-emerald-400 flex items-center justify-between font-mono"
              >
                <span>✓ CCTV-014 footage processed! Overall certainty increased from <strong>61% to 84%</strong>!</span>
                <button onClick={() => setShowSuccess(false)} className="underline text-emerald-300">Dismiss</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Evidence Value Score Breakdown */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#1D2733] font-mono">AI VALUE BREAKDOWN</h3>

            <div className="text-center py-3 bg-[#080B10] rounded-lg border border-[#1D2733]">
              <span className="text-4xl font-bold text-sky-400 font-mono">{topRec?.evidenceValueScore || 92}%</span>
              <p className="text-xs text-[#8B98A8] mt-1 font-mono">EVIDENCE VALUE SCORE</p>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <div className="flex justify-between text-[#8B98A8] mb-1 font-mono">
                  <span>Location Fit</span>
                  <span className="text-white">{topRec?.locationRelevance || 94}%</span>
                </div>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-sky-400" style={{ width: `${topRec?.locationRelevance || 94}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8B98A8] mb-1 font-mono">
                  <span>Time Fit</span>
                  <span className="text-white">{topRec?.temporalRelevance || 91}%</span>
                </div>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-sky-400" style={{ width: `${topRec?.temporalRelevance || 91}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8B98A8] mb-1 font-mono">
                  <span>Camera Reliability</span>
                  <span className="text-white">{topRec?.sourceReliability || 88}%</span>
                </div>
                <div className="certainty-bar h-1">
                  <div className="certainty-bar-fill bg-emerald-400" style={{ width: `${topRec?.sourceReliability || 88}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#8B98A8] pt-3 border-t border-[#1D2733] font-mono">
            Higher values indicate maximum uncertainty reduction.
          </div>
        </div>
      </div>

      {/* Ranked List of Recommendations */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1D2733] font-mono">RANKED RECOMMENDATIONS</h3>

        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="bg-[#080B10] p-4 rounded-lg border border-[#1D2733] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-[#111821] border border-[#1D2733] flex items-center justify-center font-mono font-bold text-sky-400">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm font-mono">{rec.evidenceSource}</h4>
                  <p className="text-[#8B98A8]">{rec.hypothesisDistinction}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono">
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                  rec.priority === 'very_high' ? 'badge-very-high' : rec.priority === 'high' ? 'badge-high' : 'badge-medium'
                }`}>
                  {rec.priority.replace('_', ' ')}
                </span>
                <span className="text-sm font-bold text-sky-400">{rec.evidenceValueScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
