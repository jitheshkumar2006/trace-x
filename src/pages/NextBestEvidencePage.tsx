import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Target, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function NextBestEvidencePage() {
  const { investigateCCTV014, cctv014Investigated } = useAppStore();
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [certaintyScores, setCertaintyScores] = useState({
    overall: 61,
    identity: 82,
    time: 91,
    location: 74,
    route: 31,
    cctv: 53,
    witness: 68
  });

  const handleInvestigate = () => {
    if (cctv014Investigated || isInvestigating) return;
    
    setIsInvestigating(true);
    
    setTimeout(() => {
      setIsInvestigating(false);
      setShowSuccess(true);
      investigateCCTV014();
      
      // Animate scores
      let start = 61;
      const end = 84;
      const duration = 1000;
      const stepTime = Math.abs(Math.floor(duration / (end - start)));
      
      const timer = setInterval(() => {
        start += 1;
        setCertaintyScores(prev => ({
          ...prev,
          overall: start,
          route: Math.min(100, prev.route + 2),
          cctv: Math.min(100, prev.cctv + 1)
        }));
        
        if (start === end) clearInterval(timer);
      }, stepTime);
      
      setTimeout(() => setShowSuccess(false), 4000);
    }, 3000);
  };

  useEffect(() => {
    if (cctv014Investigated) {
      setCertaintyScores({
        overall: 84,
        identity: 82,
        time: 91,
        location: 74,
        route: 86,
        cctv: 78,
        witness: 68
      });
    }
  }, [cctv014Investigated]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-3 bg-accent-blue/20 rounded-lg text-accent-blue">
          <Crosshair className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-2 uppercase">
            What Should the Investigator Find Next?
          </h1>
          <p className="text-white/60 text-lg">Next Best Evidence Engine — Ranked by Information Value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">
          
          {/* Card 1: VERY HIGH Priority */}
          <motion.div variants={itemVariants} className={`glass-card p-6 border-l-4 transition-all duration-500 relative overflow-hidden ${cctv014Investigated ? 'border-status-success bg-status-success/5' : 'border-status-danger bg-[#0f172a] shadow-[0_0_30px_rgba(239,68,68,0.1)]'}`}>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔴</span>
                  <h2 className="text-2xl font-bold text-white tracking-wide">CCTV-014 (Intersection of 4th & Main)</h2>
                </div>
                <p className="text-white/60 flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent-cyan" />
                  Can distinguish Hypothesis A (Transit) from Hypothesis B (Walk)
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${cctv014Investigated ? 'bg-status-success/20 text-status-success border-status-success/30' : 'bg-status-danger/20 text-status-danger border-status-danger/30'}`}>
                {cctv014Investigated ? 'Investigated' : 'Very High Priority'}
              </div>
            </div>

            <div className="mb-6 bg-black/40 p-4 rounded-lg border border-white/5 relative z-10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Expected uncertainty reduction</span>
                <span className="text-accent-cyan font-mono font-bold">31%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-cyan w-[31%] rounded-full shadow-[0_0_10px_#22d3ee]"></div>
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">Why is this important?</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" /> Covers the exact time gap of 10:18 AM - 10:31 AM</li>
                <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" /> High resolution camera with clear view of pedestrian crossings</li>
                <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" /> Direct line of sight to the suspected bus stop for Route 12</li>
              </ul>
            </div>

            {!cctv014Investigated && (
              <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                <button 
                  onClick={handleInvestigate}
                  disabled={isInvestigating}
                  className={`w-full py-4 rounded-lg font-bold text-lg tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                    isInvestigating 
                      ? 'bg-status-info/20 text-status-info cursor-not-allowed border border-status-info/30' 
                      : 'bg-status-danger/20 hover:bg-status-danger/30 text-status-danger hover:text-white border border-status-danger/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer'
                  }`}
                >
                  {isInvestigating ? (
                    <>
                      <Activity className="w-6 h-6 animate-pulse" />
                      PROCESSING EVIDENCE...
                    </>
                  ) : (
                    '[INVESTIGATE THIS EVIDENCE]'
                  )}
                </button>
              </div>
            )}
            
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-status-success/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white"
                >
                  <CheckCircle2 className="w-20 h-20 text-white mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Evidence Obtained!</h3>
                  <p className="text-lg opacity-90">Evidence gap partially resolved</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Card 2: HIGH Priority */}
          <motion.div variants={itemVariants} className="glass-card-light p-6 border-l-4 border-status-warning">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟠</span>
                  <h3 className="text-xl font-bold text-white/90">Bus Route 12 Manifest & GPS</h3>
                </div>
              </div>
              <div className="px-2 py-1 rounded bg-status-warning/20 text-status-warning border border-status-warning/30 text-xs font-bold uppercase">
                High
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">Expected uncertainty reduction</span>
                <span className="text-status-warning font-mono">18%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-status-warning w-[18%] rounded-full"></div>
              </div>
            </div>
            
            <p className="text-sm text-white/60">Would confirm or deny presence on transit system during the critical 15-minute gap.</p>
          </motion.div>

          {/* Card 3: MEDIUM Priority */}
          <motion.div variants={itemVariants} className="glass-card-light p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟡</span>
                  <h3 className="text-xl font-bold text-white/90">Witness #23 Interview</h3>
                </div>
              </div>
              <div className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-xs font-bold uppercase">
                Medium
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">Expected uncertainty reduction</span>
                <span className="text-yellow-500 font-mono">9%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[9%] rounded-full"></div>
              </div>
            </div>
          </motion.div>

        </motion.div>

        <div className="space-y-6">
          {/* Evidence Value Score */}
          <motion.div variants={itemVariants} className="glass-card p-6 bg-black/40 border border-white/10">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Top Recommendation Value Score</h3>
            
            <div className="flex items-end gap-2 mb-8 border-b border-white/10 pb-6">
              <span className="text-6xl font-bold font-mono text-accent-cyan tracking-tighter">92</span>
              <span className="text-2xl text-accent-cyan/60 font-mono mb-1">%</span>
              <span className="text-xs text-white/40 mb-2 ml-2 max-w-[100px] leading-tight uppercase">Overall Value Index</span>
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Hypothesis Distinction', score: 98, color: 'bg-accent-blue' },
                { label: 'Location Relevance', score: 95, color: 'bg-accent-cyan' },
                { label: 'Temporal Relevance', score: 88, color: 'bg-accent-indigo' },
                { label: 'Source Reliability', score: 82, color: 'bg-status-success' }
              ].map((metric, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70 uppercase tracking-wider">{metric.label}</span>
                    <span className="font-mono text-white/90">{metric.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Evidence DNA Panel */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Case Certainty DNA
            </h3>
            
            <div className="mb-6 p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-lg text-center">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Overall Case Certainty</div>
              <motion.div 
                key={certaintyScores.overall}
                initial={{ scale: 1.1, color: '#fff' }}
                animate={{ scale: 1, color: '#22d3ee' }}
                className="text-4xl font-bold font-mono text-accent-cyan"
              >
                {certaintyScores.overall}%
              </motion.div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'identity', label: 'IDENTITY', val: certaintyScores.identity },
                { key: 'time', label: 'TIME', val: certaintyScores.time },
                { key: 'location', label: 'LOCATION', val: certaintyScores.location },
                { key: 'route', label: 'ROUTE', val: certaintyScores.route },
                { key: 'cctv', label: 'CCTV COVERAGE', val: certaintyScores.cctv },
                { key: 'witness', label: 'WITNESS', val: certaintyScores.witness }
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60 tracking-wider">{item.label}</span>
                    <motion.span 
                      key={`${item.key}-${item.val}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-white/80"
                    >
                      {item.val}%
                    </motion.span>
                  </div>
                  <div className="certainty-bar">
                    <motion.div 
                      className="certainty-bar-fill" 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 1, type: "spring" }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
