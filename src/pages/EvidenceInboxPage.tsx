import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Users, Shield, FileText, Bus, 
  UploadCloud, MapPin, Clock, Search,
  CheckCircle2, AlertTriangle, FileBox, ShieldAlert,
  Video, Eye
} from 'lucide-react';
import { useAppStore, useAuthStore } from '../store/useStore';
import type { Evidence, EvidenceType } from '../types';

// Tab configuration
const tabs: { id: EvidenceType; label: string; icon: React.ElementType }[] = [
  { id: 'cctv', label: 'CCTV', icon: Camera },
  { id: 'citizen_sighting', label: 'Citizen Sighting', icon: Users },
  { id: 'police_observation', label: 'Police Observation', icon: Shield },
  { id: 'ngo_report', label: 'NGO Report', icon: FileText },
  { id: 'transport_clue', label: 'Transport Clue', icon: Bus }
];

export default function EvidenceInboxPage() {
  const { activeCase, evidence, addEvidence, addAuditEntry, cctv014Investigated } = useAppStore();
  const { currentUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<EvidenceType>('cctv');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [source, setSource] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  // Filter evidence for active case
  const caseEvidence = evidence
    .filter(e => e.caseId === activeCase?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newEvidenceId = `EVD-${String(Math.floor(Math.random() * 900) + 100)}`;
      
      const newEvidence: Evidence = {
        id: newEvidenceId,
        caseId: activeCase.id,
        source: source || 'Unknown Source',
        type: activeTab,
        timestamp: time || new Date().toISOString(),
        latitude: 13.0827,
        longitude: 80.2707,
        confidence: 85,
        privacyLevel: 'restricted',
        verificationStatus: 'unverified',
        processingStatus: 'pending',
        description,
        createdAt: new Date().toISOString(),
      };
      
      addEvidence(newEvidence);
      
      addAuditEntry({
        userId: currentUser?.id || 'SYS',
        userName: currentUser?.name || 'System',
        userRole: currentUser?.role || 'police',
        action: 'evidence_added',
        target: newEvidenceId,
        caseId: activeCase.id,
        evidenceId: newEvidenceId,
        details: `Uploaded new ${activeTab} evidence: ${source}`,
      });

      setSource('');
      setLocation('');
      setTime('');
      setDescription('');
      setIsSubmitting(false);
    }, 600);
  };

  if (!activeCase) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-[#8B98A8]">No active case selected</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <FileBox className="text-sky-400 w-6 h-6" />
            EVIDENCE INBOX & AI ANALYSIS
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            MULTI-SOURCE CLUE CATALOG & AUTOMATED FEATURE EXTRACTION FOR <span className="text-white font-semibold">{activeCase.id}</span>
          </p>
        </div>

        <span className="prototype-badge font-mono">
          EVIDENCE CATALOG
        </span>
      </div>

      {/* CCTV Viewer Box */}
      <div className="glass-card p-5 border-sky-500/30 bg-[#0D1219] space-y-3">
        <div className="flex justify-between items-center font-mono text-xs border-b border-[#1D2733] pb-2">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white">CAM-014</span>
            <span className="text-[#8B98A8]">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="live-pulse-red"></span> REC
            </span>
          </div>
          <div className="text-[#8B98A8]">
            TIMESTAMP: <span className="text-white font-bold">10:24:31 AM</span>
          </div>
        </div>

        <div className="bg-[#080B10] p-6 rounded-lg border border-[#1D2733] relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] text-center space-y-2">
          <div className="absolute top-3 left-3 text-[10px] font-mono bg-[#111821] px-2 py-0.5 rounded text-sky-400 border border-sky-500/30">
            CAM-014 FEED SIMULATION
          </div>

          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm bg-emerald-950/40 px-3 py-1.5 rounded border border-emerald-500/40">
            <Eye className="w-4 h-4" />
            PERSON DETECTED — MATCH SIMILARITY 84%
          </div>

          <p className="text-xs text-[#8B98A8] max-w-lg font-mono">
            {cctv014Investigated
              ? 'CCTV-014 footage verified at Central Bus Stand. Subject features matched.'
              : 'Simulated CCTV Camera 014 feed at Central Bus Stand. Person matching subject profile detected.'}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#1D2733] pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = caseEvidence.filter(e => e.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-[#111821] text-sky-400 border-sky-500/50 shadow-sm' 
                  : 'bg-[#0D1219] text-[#8B98A8] border-[#1D2733] hover:text-white'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              <span className="ml-1 bg-[#080B10] px-2 py-0.5 rounded-full text-[10px]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Upload Form */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-4"
      >
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <UploadCloud className="text-sky-400 w-4 h-4" />
          Submit {tabs.find(t => t.id === activeTab)?.label} Clue
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#8B98A8] mb-1">Source Name *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. CCTV-042 or Citizen Sighting #12"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#8B98A8] mb-1 flex items-center gap-1">
                  <MapPin size={12} /> Location
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Zone, Corridor..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8B98A8] mb-1 flex items-center gap-1">
                  <Clock size={12} /> Time
                </label>
                <input 
                  type="time" 
                  className="input-field"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8B98A8] mb-1">Observation Details</label>
              <textarea 
                className="input-field min-h-[90px]" 
                placeholder="Describe observed appearance, clothing, direction of movement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col h-full space-y-1 font-mono text-xs">
            <label className="block text-xs text-[#8B98A8] mb-1">Simulated File Upload</label>
            <div className="flex-1 border border-dashed border-[#1D2733] rounded-lg bg-[#080B10] flex flex-col items-center justify-center p-6 text-center hover:border-sky-500/50 transition-colors cursor-pointer space-y-2">
              <UploadCloud size={36} className="text-[#8B98A8]" />
              <p className="text-white font-semibold text-xs">Drag and drop footage or photos</p>
              <p className="text-[#8B98A8] text-[11px]">JPG, PNG, MP4 up to 100MB</p>
              <span className="btn-ghost text-xs">Select File</span>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4 border-t border-[#1D2733]">
            <button 
              type="submit" 
              className="btn-primary text-xs font-mono uppercase"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Submit Evidence'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Evidence List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">CATALOGED EVIDENCE ITEMS</h2>
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {caseEvidence.map((item, index) => (
              <EvidenceCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
          
          {caseEvidence.length === 0 && (
            <div className="glass-card p-12 text-center text-[#8B98A8] font-mono text-xs">
              No evidence submitted yet for this case.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual evidence card
function EvidenceCard({ item, index }: { item: Evidence, index: number }) {
  const [isAnalyzing, setIsAnalyzing] = useState(item.processingStatus === 'processing');
  const [analysisComplete, setAnalysisComplete] = useState(item.processingStatus === 'analyzed' || item.processingStatus === 'verified' || !!item.analysis);
  const [currentStep, setCurrentStep] = useState(-1);

  const analysisSteps = [
    "Person detected",
    "Appearance extracted",
    "Object detected",
    "Temporal consistency verified",
    "Geospatial consistency verified"
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isAnalyzing && currentStep < analysisSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (isAnalyzing && currentStep === analysisSteps.length) {
      const finishTimer = setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 400);
      return () => clearTimeout(finishTimer);
    }
  }, [isAnalyzing, currentStep, analysisSteps.length]);

  const typeColors: Record<EvidenceType, string> = {
    cctv: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    citizen_sighting: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    police_observation: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    ngo_report: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    transport_clue: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  const dummyAnalysis = item.analysis || {
    faceSimilarity: 84,
    clothingSimilarity: 91,
    backpackSimilarity: 96,
    bodySimilarity: 88,
    timeConsistency: 92,
    locationConsistency: 88,
    overallLeadScore: 89
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card p-5 border border-[#1D2733] space-y-4"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-base font-bold text-white">{item.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${typeColors[item.type]}`}>
                  {item.type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#8B98A8]">Source: <span className="text-white font-mono">{item.source}</span></p>
            </div>
            
            {(item.verificationStatus === 'potential_lead' || (item.verificationStatus === 'unverified' && analysisComplete)) && (
              <div className="warning-label flex items-center gap-1.5 font-mono">
                <AlertTriangle size={13} />
                POTENTIAL LEAD — HUMAN VERIFICATION REQUIRED
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-[#8B98A8]">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-sky-400" />
              {new Date(item.timestamp).toLocaleString(undefined, { timeStyle: 'short', dateStyle: 'medium' })}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-sky-400" />
              Candidate Search Zone
            </div>
          </div>
          
          <p className="text-xs text-[#E6EDF3]">{item.description}</p>
        </div>

        {/* Right Column: Processing & AI Meters */}
        <div className="flex-1 md:max-w-md bg-[#080B10] rounded-lg p-4 border border-[#1D2733] font-mono text-xs">
          {!isAnalyzing && !analysisComplete && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-4">
              <ShieldAlert className="text-[#8B98A8]" size={28} />
              <p className="text-[#8B98A8]">Evidence pending automated analysis</p>
              <button onClick={handleAnalyze} className="btn-primary text-xs py-1.5 uppercase font-mono">
                <Search size={13} className="inline mr-1" />
                Run AI Analysis
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-3">
              <div className="text-sky-400 font-bold mb-3 flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                ANALYZING EVIDENCE...
              </div>
              <div className="space-y-2">
                {analysisSteps.map((step, i) => (
                  <div 
                    key={step}
                    className={`flex items-center gap-2 text-xs ${i < currentStep ? 'text-emerald-400' : 'text-[#8B98A8]'}`}
                  >
                    {i < currentStep ? <CheckCircle2 size={13} /> : <div className="w-3 h-3 rounded-full border border-[#1D2733]" />}
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisComplete && !isAnalyzing && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[#1D2733] pb-2">
                <h4 className="font-bold text-white uppercase text-[11px]">EVIDENCE ANALYSIS</h4>
                <div className="text-right">
                  <span className="text-[10px] text-[#8B98A8] uppercase">OVERALL LEAD SCORE</span>
                  <div className="text-base font-bold text-sky-400">{dummyAnalysis.overallLeadScore}%</div>
                </div>
              </div>
              
              {/* Clean Horizontal Meters */}
              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-[#8B98A8] mb-0.5">
                    <span>VISUAL SIMILARITY</span>
                    <span className="text-white">{dummyAnalysis.faceSimilarity}%</span>
                  </div>
                  <div className="certainty-bar h-1"><div className="certainty-bar-fill bg-sky-400" style={{ width: `${dummyAnalysis.faceSimilarity}%` }}></div></div>
                </div>

                <div>
                  <div className="flex justify-between text-[#8B98A8] mb-0.5">
                    <span>CLOTHING</span>
                    <span className="text-white">{dummyAnalysis.clothingSimilarity}%</span>
                  </div>
                  <div className="certainty-bar h-1"><div className="certainty-bar-fill bg-sky-400" style={{ width: `${dummyAnalysis.clothingSimilarity}%` }}></div></div>
                </div>

                <div>
                  <div className="flex justify-between text-[#8B98A8] mb-0.5">
                    <span>OBJECT</span>
                    <span className="text-white">{dummyAnalysis.backpackSimilarity}%</span>
                  </div>
                  <div className="certainty-bar h-1"><div className="certainty-bar-fill bg-sky-400" style={{ width: `${dummyAnalysis.backpackSimilarity}%` }}></div></div>
                </div>

                <div>
                  <div className="flex justify-between text-[#8B98A8] mb-0.5">
                    <span>TIME</span>
                    <span className="text-white">{dummyAnalysis.timeConsistency}%</span>
                  </div>
                  <div className="certainty-bar h-1"><div className="certainty-bar-fill bg-emerald-400" style={{ width: `${dummyAnalysis.timeConsistency}%` }}></div></div>
                </div>

                <div>
                  <div className="flex justify-between text-[#8B98A8] mb-0.5">
                    <span>LOCATION</span>
                    <span className="text-white">{dummyAnalysis.locationConsistency}%</span>
                  </div>
                  <div className="certainty-bar h-1"><div className="certainty-bar-fill bg-emerald-400" style={{ width: `${dummyAnalysis.locationConsistency}%` }}></div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
