import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { AnimatePresence } from 'framer-motion';
import {
  GitBranch, Camera, User, Bus, MapPin, HelpCircle, Target,
  Clock, ShieldCheck
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
    case 'confirmed': return '#22C55E'; // green
    case 'probable': return '#38BDF8';  // cyan
    case 'unverified': return '#F59E0B';// amber
    case 'contradictory': return '#EF4444';// red
    case 'unknown': default: return '#4a5c75'; // dim grey
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <GitBranch className="text-sky-400 w-6 h-6" />
            VISUAL EVIDENCE GRAPH
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            REAL-TIME CLUE LINKAGE GRAPH • MULTI-CAMERA & SIGHTING MOVEMENT PATHS
          </p>
        </div>

        <span className="prototype-badge font-mono">
          OPERATIONAL LINK GRAPH
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main SVG Canvas */}
        <div className="lg:col-span-2 glass-card rounded-xl p-4 relative h-[600px] flex items-center justify-center overflow-hidden bg-[#080B10]">
          <svg className="w-full h-full">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#334358" />
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
                      stroke={edge.dashed ? "#F59E0B" : "#334358"}
                      strokeWidth={edge.dashed ? 2 : 2.5}
                      strokeDasharray={edge.dashed ? "6 6" : "none"}
                      markerEnd="url(#arrow)"
                    />
                    {edge.label && (
                      <text
                        x={(sourcePos.x + targetPos.x) / 2}
                        y={(sourcePos.y + targetPos.y) / 2 - 8}
                        fill="#8B98A8"
                        fontSize="10"
                        textAnchor="middle"
                        className="font-mono bg-[#0D1219] px-1"
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
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r={isSelected ? 24 : 20}
                      fill="#0D1219"
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
                        fill="#0D1219"
                        stroke={color}
                        strokeWidth="1"
                        fillOpacity="0.95"
                      />
                      <text x="0" y="14" textAnchor="middle" fill="#E6EDF3" fontSize="11" fontWeight="600">
                        {node.label}
                      </text>
                      <text x="0" y="26" textAnchor="middle" fill="#8B98A8" fontSize="9" className="font-mono">
                        {node.sublabel ? node.sublabel.split('\n')[0] : 'Unknown'}
                      </text>
                    </g>

                    {node.confidence !== undefined && (
                      <g transform="translate(18, -18)" className="pointer-events-none">
                        <circle r="12" fill={color} />
                        <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="9" fontStyle="bold" className="font-mono">
                          {node.confidence}%
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </AnimatePresence>
          </svg>

          {/* Node Legend */}
          <div className="absolute bottom-4 left-4 bg-[#0D1219] p-3 rounded-lg text-xs space-y-1.5 border border-[#1D2733] font-mono">
            <div className="font-semibold text-white mb-1 uppercase tracking-wider text-[10px]">Node States</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div> <span className="text-[#8B98A8]">Confirmed</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></div> <span className="text-[#8B98A8]">Potential</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div> <span className="text-[#8B98A8]">Uncertain</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div> <span className="text-[#8B98A8]">Critical</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#4a5c75]"></div> <span className="text-[#8B98A8]">Unknown</span></div>
          </div>
        </div>

        {/* Node Detail Panel */}
        <div className="glass-card rounded-xl p-5 flex flex-col h-[600px] overflow-y-auto space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1D2733] pb-2 font-mono">NODE INTELLIGENCE DETAIL</h2>

          {selectedNode ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#080B10] border" style={{ borderColor: getNodeColor(selectedNode.state) }}>
                  {getNodeIcon(selectedNode.type || 'unknown', selectedNode.state)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-mono">{selectedNode.label}</h3>
                  <div className="text-xs text-sky-400">{selectedNode.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
                  <div className="text-[10px] text-[#8B98A8] uppercase mb-1">State</div>
                  <div className="capitalize font-medium flex items-center gap-1.5" style={{ color: getNodeColor(selectedNode.state) }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getNodeColor(selectedNode.state) }}></div>
                    {selectedNode.state}
                  </div>
                </div>
                <div className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
                  <div className="text-[10px] text-[#8B98A8] uppercase mb-1">Confidence</div>
                  <div className="font-bold text-white text-sm">{selectedNode.confidence || 0}%</div>
                </div>
              </div>

              <div className="space-y-2 bg-[#080B10] p-3 rounded-lg border border-[#1D2733]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8B98A8]" />
                  <span>Sublabel: <strong className="text-white">{selectedNode.sublabel || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8B98A8]" />
                  <span>Evidence Ref: <strong className="text-sky-400">{selectedNode.evidenceId || 'N/A'}</strong></span>
                </div>
              </div>

              {selectedNode.state === 'unknown' && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 space-y-1">
                  <strong>Critical Gap:</strong> Needs next best evidence verification.
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8B98A8] space-y-2">
              <GitBranch className="w-8 h-8 opacity-40" />
              <div className="text-xs font-mono">Select a node on the graph to view intelligence details</div>
            </div>
          )}
        </div>
      </div>

      {/* Competing Trajectory Hypotheses Section */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#1D2733]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="text-sky-400 w-4 h-4" />
            COMPETING TRAJECTORY HYPOTHESES
          </h2>
          <span className="text-xs text-[#8B98A8] font-mono">3 CANDIDATE PATHWAYS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hypotheses.map((h, idx) => (
            <div key={h.id} className={`p-4 rounded-lg border transition-all ${
              idx === 0 ? 'bg-[#111821] border-sky-500/50' : 'bg-[#080B10] border-[#1D2733]'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-white text-xs font-mono">{h.name}</h3>
                <span className="font-mono text-xs font-bold text-sky-400">{h.confidence}%</span>
              </div>
              <p className="text-xs text-[#8B98A8] mb-2">{h.description}</p>
              <div className="certainty-bar h-1">
                <div className="certainty-bar-fill bg-sky-400" style={{ width: `${h.confidence}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
