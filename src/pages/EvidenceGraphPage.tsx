import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, Camera, User, Bus, MapPin, HelpCircle, Target,
  Clock, AlertTriangle, ShieldAlert, Info
} from 'lucide-react';
import type { GraphNode } from '../types';

const getNodePos = (node: GraphNode, index: number) => {
  const label = node.label.toLowerCase();
  if (label.includes('last known')) return { x: 400, y: 60 };
  if (label.includes('cctv-001')) return { x: 400, y: 160 };
  if (label.includes('citizen')) return { x: 200, y: 260 };
  if (label.includes('cctv-007')) return { x: 400, y: 260 };
  if (label.includes('transport')) return { x: 600, y: 260 };
  if (label.includes('unknown') || label.includes('cctv-014')) return { x: 400, y: 380 };
  if (label.includes('zone b') || label.includes('search zone b')) return { x: 400, y: 500 };

  const row = Math.floor(index / 3);
  const col = index % 3;
  return { x: 200 + col * 200, y: 80 + row * 100 };
};

const getNodeColor = (state: string) => {
  switch (state) {
    case 'confirmed': return '#10b981'; // emerald-500
    case 'probable': return '#3b82f6'; // blue-500
    case 'unverified': return '#f59e0b'; // amber-500
    case 'contradictory': return '#ef4444'; // red-500
    case 'unknown': default: return '#64748b'; // slate-500
  }
};

const getNodeIcon = (type: string, state: string) => {
  const props = { className: "w-5 h-5", color: "#fff" };
  if (state === 'unknown') return <HelpCircle {...props} />;

  switch (type) {
    case 'cctv': return <Camera {...props} />;
    case 'citizen_report': case 'citizen': return <User {...props} />;
    case 'transport': return <Bus {...props} />;
    case 'location': case 'last_known': return <MapPin {...props} />;
    case 'search_zone': case 'search-zone': return <Target {...props} />;
    case 'unknown': default: return <HelpCircle {...props} />;
  }
};

export default function EvidenceGraphPage() {
  const { graphNodes, graphEdges, hypotheses } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!selectedNode && graphNodes && graphNodes.length > 0) {
      setSelectedNode(graphNodes[0]);
    }
  }, [graphNodes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Share2 className="text-accent-blue" />
            Evidence Graph Matrix
          </h1>
          <p className="text-navy-400 text-sm mt-1">
            Visual multi-hypothesis network graph connecting locations, CCTV, reports, and temporal transitions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="warning-label">Potential Lead — Human Verification Required</span>
          <span className="prototype-badge">HERO SCREEN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main SVG Canvas */}
        <div className="lg:col-span-2 glass-card rounded-xl p-4 relative h-[600px] flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Edges */}
            <AnimatePresence>
              {graphEdges.map((edge) => {
                const sourceNode = graphNodes.find(n => n.id === edge.source);
                const targetNode = graphNodes.find(n => n.id === edge.target);

                if (!sourceNode || !targetNode) return null;

                const sourceIndex = graphNodes.indexOf(sourceNode);
                const targetIndex = graphNodes.indexOf(targetNode);

                const sourcePos = getNodePos(sourceNode, sourceIndex);
                const targetPos = getNodePos(targetNode, targetIndex);

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={edge.dashed ? "#f59e0b" : "#475569"}
                      strokeWidth={edge.dashed ? 2 : 2.5}
                      strokeDasharray={edge.dashed ? "6 6" : "none"}
                      markerEnd="url(#arrow)"
                    />
                    {edge.label && (
                      <text
                        x={(sourcePos.x + targetPos.x) / 2}
                        y={(sourcePos.y + targetPos.y) / 2 - 8}
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                        className="font-mono bg-navy-900 px-1"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </AnimatePresence>

            {/* Nodes */}
            <AnimatePresence>
              {graphNodes.map((node, i) => {
                const pos = getNodePos(node, i);
                const color = getNodeColor(node.state);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r={isSelected ? 24 : 20}
                      fill="#1e293b"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      filter={isSelected ? "url(#glow)" : ""}
                    />

                    <g transform="translate(-10, -10)" className="pointer-events-none">
                      {getNodeIcon(node.type || 'unknown', node.state)}
                    </g>

                    <g transform={`translate(0, ${isSelected ? 32 : 28})`} className="pointer-events-none">
                      <rect
                        x="-55" y="0" width="110" height="34" rx="4"
                        fill="#0f172a"
                        stroke={color}
                        strokeWidth="1"
                        fillOpacity="0.9"
                      />
                      <text x="0" y="14" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">
                        {node.label}
                      </text>
                      <text x="0" y="26" textAnchor="middle" fill="#94a3b8" fontSize="9">
                        {node.sublabel ? node.sublabel.split('\n')[0] : 'Unknown'}
                      </text>
                    </g>

                    {node.confidence !== undefined && (
                      <g transform="translate(18, -18)" className="pointer-events-none">
                        <circle r="12" fill={color} />
                        <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                          {node.confidence}%
                        </text>
                      </g>
                    )}
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-card-light p-3 rounded-lg text-xs space-y-1.5 border border-white/5">
            <div className="font-semibold text-slate-300 mb-1 uppercase tracking-wider text-[10px]">Node State</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> <span className="text-slate-400">Confirmed</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> <span className="text-slate-400">Probable</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> <span className="text-slate-400">Unverified</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> <span className="text-slate-400">Contradictory</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div> <span className="text-slate-400">Unknown</span></div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="glass-card rounded-xl p-5 flex flex-col h-[600px] overflow-y-auto">
          <h2 className="text-lg font-semibold text-slate-200 mb-4 border-b border-white/10 pb-2">Node Details</h2>

          {selectedNode ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-slate-800 border" style={{ borderColor: getNodeColor(selectedNode.state) }}>
                    {getNodeIcon(selectedNode.type || 'unknown', selectedNode.state)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg">{selectedNode.label}</h3>
                    <div className="text-sm text-slate-400 font-mono">{selectedNode.id}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">State</div>
                    <div className="capitalize font-medium flex items-center gap-1.5" style={{ color: getNodeColor(selectedNode.state) }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getNodeColor(selectedNode.state) }}></div>
                      {selectedNode.state}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Confidence</div>
                    <div className="font-bold text-slate-200">{selectedNode.confidence || 0}%</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-slate-500 text-xs uppercase tracking-wider">Sublabel</div>
                      <div className="text-slate-300 font-mono">{selectedNode.sublabel || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-slate-500 text-xs uppercase tracking-wider">Evidence ID</div>
                      <div className="text-slate-300">{selectedNode.evidenceId || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {selectedNode.state === 'unknown' && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-sm text-amber-200/80">
                      <strong>Critical Gap.</strong> This transition requires next best evidence investigation.
                    </div>
                  </div>
                )}

                {selectedNode.type === 'search_zone' && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="text-sm text-blue-200/80">
                      <strong>Candidate Search Zone.</strong> Generated via predictive trajectory modeling.
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Share2 className="w-12 h-12 opacity-20" />
              <div className="text-sm">Click any node to view intelligence detail</div>
            </div>
          )}
        </div>
      </div>

      {/* Competing Hypotheses Section */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-amber-400" />
            Competing Trajectory Hypotheses
          </h2>
          <span className="text-xs text-navy-400">Multiple active movement paths</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hypotheses.map((h) => (
            <div key={h.id} className="bg-navy-900/50 p-4 rounded-lg border border-navy-700/50 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">{h.name}</h3>
                <span className="font-mono text-sm font-bold text-accent-blue">{h.confidence}%</span>
              </div>
              <p className="text-xs text-navy-300">{h.description}</p>

              <div className="certainty-bar h-1.5">
                <div
                  className="certainty-bar-fill bg-accent-blue"
                  style={{ width: `${h.confidence}%` }}
                />
              </div>

              <div className="text-[11px] text-navy-400">
                Status: <span className="text-emerald-400 font-semibold uppercase">{h.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
