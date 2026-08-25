import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Users, Shield, FileText, Bus, 
  UploadCloud, MapPin, Clock, Search,
  CheckCircle2, AlertTriangle, FileBox, ShieldAlert
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
  const { activeCase, evidence, addEvidence, addAuditEntry } = useAppStore();
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
    
    // Simulate API call / upload delay
    setTimeout(() => {
      const newEvidenceId = `EVD-${String(Math.floor(Math.random() * 900) + 100)}`;
      
      const newEvidence: Evidence = {
        id: newEvidenceId,
        caseId: activeCase.id,
        source: source || 'Unknown Source',
        type: activeTab,
        timestamp: time || new Date().toISOString(),
        latitude: 12.9716, // dummy coordinates
        longitude: 77.5946,
        confidence: 0,
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

      // Reset form
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
        <div className="text-slate-400">No active case selected</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <FileBox className="text-accent-blue" size={32} />
          Evidence Inbox
        </h1>
        <p className="text-slate-400 mt-2">Upload and analyze new clues for Case: {activeCase.id}</p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-navy-700 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = caseEvidence.filter(e => e.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/50' 
                  : 'bg-navy-800 text-slate-400 border border-navy-700 hover:bg-navy-700'
              }`}
            >
              <Icon size={18} />
              {tab.label}
              <span className="ml-2 bg-navy-900 px-2 py-0.5 rounded-full text-xs font-mono">
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
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
          <UploadCloud className="text-accent-cyan" />
          Submit {tabs.find(t => t.id === activeTab)?.label}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Source Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. CCTV-042 or John Doe"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin size={14} /> Location
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Zone, Street..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Clock size={14} /> Time
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
              <label className="block text-sm font-medium text-slate-400 mb-1">Description / Notes</label>
              <textarea 
                className="input-field min-h-[100px]" 
                placeholder="Describe the evidence details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-slate-400 mb-1">Media / File Upload</label>
            <div className="flex-1 border-2 border-dashed border-navy-600 rounded-lg bg-navy-900/50 flex flex-col items-center justify-center p-6 text-center hover:border-accent-blue/50 transition-colors cursor-pointer">
              <UploadCloud size={48} className="text-slate-500 mb-4" />
              <p className="text-slate-300 font-medium mb-1">Drag and drop files here</p>
              <p className="text-slate-500 text-sm mb-4">or click to browse</p>
              <span className="btn-ghost text-sm">Select Files</span>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4 border-t border-navy-700">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Evidence List */}
      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-6">Recent Evidence</h2>
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {caseEvidence.map((item, index) => (
              <EvidenceCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
          
          {caseEvidence.length === 0 && (
            <div className="glass-card p-12 text-center text-slate-500">
              No evidence submitted yet for this case.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual evidence card to handle analysis state
function EvidenceCard({ item, index }: { item: Evidence, index: number }) {
  const [isAnalyzing, setIsAnalyzing] = useState(item.processingStatus === 'processing');
  const [analysisComplete, setAnalysisComplete] = useState(item.processingStatus === 'analyzed' || item.processingStatus === 'verified' || !!item.analysis);
  const [currentStep, setCurrentStep] = useState(-1);

  const analysisSteps = [
    "Person detection",
    "Appearance extraction",
    "Object detection",
    "Time analysis",
    "Geolocation analysis",
    "Evidence reliability analysis",
    "Cross-case comparison"
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
  };

  // Handle animation sequence
  useEffect(() => {
    if (isAnalyzing && currentStep < analysisSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 500); // 500ms delay per step
      return () => clearTimeout(timer);
    } else if (isAnalyzing && currentStep === analysisSteps.length) {
      // Finished
      const finishTimer = setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [isAnalyzing, currentStep, analysisSteps.length]);

  const typeColors: Record<EvidenceType, string> = {
    cctv: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    citizen_sighting: 'bg-green-500/20 text-green-400 border-green-500/30',
    police_observation: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    ngo_report: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    transport_clue: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  const dummyAnalysis = item.analysis || {
    faceSimilarity: 82,
    clothingSimilarity: 94,
    backpackSimilarity: 88,
    bodySimilarity: 85,
    timeConsistency: 95,
    locationConsistency: 90,
    overallLeadScore: 89
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-5 border border-navy-700/50 hover:border-navy-600 transition-colors"
    >
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Column: Basic Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-lg font-bold text-slate-200">{item.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs border ${typeColors[item.type]}`}>
                  {item.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded text-xs border border-navy-600 bg-navy-800 text-slate-400">
                  {item.privacyLevel.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 text-sm">Source: <span className="text-slate-200">{item.source}</span></p>
            </div>
            
            {item.verificationStatus === 'potential_lead' && (
              <div className="warning-label flex items-center gap-2">
                <AlertTriangle size={14} />
                Potential Lead — Human Verification Required
              </div>
            )}
            {item.verificationStatus === 'unverified' && analysisComplete && (
               <div className="warning-label flex items-center gap-2">
               <AlertTriangle size={14} />
               Potential Lead — Human Verification Required
             </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={14} className="text-slate-500" />
              {new Date(item.timestamp).toLocaleString(undefined, { timeStyle: 'short', dateStyle: 'medium' })}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={14} className="text-slate-500" />
              Candidate Search Zone
            </div>
          </div>
          
          <p className="text-slate-300 text-sm mt-2">{item.description}</p>
        </div>

        {/* Right Column: Processing & Analysis */}
        <div className="flex-1 md:max-w-md bg-navy-900/50 rounded-lg p-4 border border-navy-700">
          
          {!isAnalyzing && !analysisComplete && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <ShieldAlert className="text-slate-500" size={32} />
              <p className="text-slate-400 text-sm">Evidence pending AI processing</p>
              <button onClick={handleAnalyze} className="btn-primary text-sm py-1.5">
                <Search size={14} className="inline mr-2" />
                Run Analysis
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-3">
              <div className="text-accent-blue text-sm font-medium mb-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
                AI Analysis in Progress...
              </div>
              <div className="space-y-2">
                {analysisSteps.map((step, i) => (
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
                    className={`flex items-center gap-2 text-sm ${i < currentStep ? 'text-green-400' : 'text-slate-500'}`}
                  >
                    {i < currentStep ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600 ml-[1px]" />}
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {analysisComplete && !isAnalyzing && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-end mb-2">
                <h4 className="text-sm font-medium text-slate-300">AI Analysis Results</h4>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Overall Lead Score</span>
                  <div className="text-lg font-bold text-accent-cyan">{dummyAnalysis.overallLeadScore}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Face Similarity</span>
                    <span className="text-slate-200">{dummyAnalysis.faceSimilarity}%</span>
                  </div>
                  <div className="certainty-bar"><div className="certainty-bar-fill bg-accent-blue" style={{ width: `${dummyAnalysis.faceSimilarity}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Clothing</span>
                    <span className="text-slate-200">{dummyAnalysis.clothingSimilarity}%</span>
                  </div>
                  <div className="certainty-bar"><div className="certainty-bar-fill bg-accent-blue" style={{ width: `${dummyAnalysis.clothingSimilarity}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Objects/Backpack</span>
                    <span className="text-slate-200">{dummyAnalysis.backpackSimilarity}%</span>
                  </div>
                  <div className="certainty-bar"><div className="certainty-bar-fill bg-accent-blue" style={{ width: `${dummyAnalysis.backpackSimilarity}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Time Consist.</span>
                    <span className="text-slate-200">{dummyAnalysis.timeConsistency}%</span>
                  </div>
                  <div className="certainty-bar"><div className="certainty-bar-fill bg-accent-cyan" style={{ width: `${dummyAnalysis.timeConsistency}%` }}></div></div>
                </div>
              </div>

              {item.verificationStatus !== 'potential_lead' && (
                <div className="pt-3 mt-3 border-t border-navy-700 flex justify-end gap-2">
                  <button className="btn-danger text-xs py-1 px-3">Dismiss</button>
                  <button className="bg-green-600 hover:bg-green-500 text-white rounded px-3 py-1 text-xs font-medium transition-colors">
                    Verify Match
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
