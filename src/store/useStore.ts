// ============================================================
// TRACE-X — Global Application Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type {
  User,
  UserRole,
  Case,
  Evidence,
  Hypothesis,
  InvestigationGap,
  Recommendation,
  EvidenceLink,
  AuditLogEntry,
  SearchZone,
  NegativeEvidence,
  GraphNode,
  GraphEdge,
  CaseCertainty,
  CCTVSource,
} from '../types';
import {
  demoUsers,
  demoCase,
  initialEvidence,
  initialHypotheses,
  initialGaps,
  initialRecommendations,
  initialEvidenceLinks,
  initialAuditLog,
  initialSearchZones,
  demoNegativeEvidence,
  initialGraphNodes,
  initialGraphEdges,
  postInvestigationGraphNodes,
  postInvestigationGraphEdges,
  updatedHypotheses,
  resolvedGaps,
  postInvestigationCertainty,
  postInvestigationLinks,
  cctv014Evidence,
  demoCCTVSources,
} from '../data/demoCase';

// ─── Auth Store ───────────────────────────────────────────────
interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  login: (role) => {
    const user = demoUsers.find((u) => u.role === role) || demoUsers[0];
    set({ currentUser: user, isAuthenticated: true });
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));

// ─── Main Application Store ──────────────────────────────────
interface AppState {
  // Cases
  cases: Case[];
  activeCase: Case | null;
  setActiveCase: (caseId: string) => void;
  addCase: (c: Case) => void;
  updateCaseCertainty: (caseId: string, certainty: CaseCertainty) => void;

  // Evidence
  evidence: Evidence[];
  evidenceLinks: EvidenceLink[];
  addEvidence: (e: Evidence) => void;
  addEvidenceLink: (link: EvidenceLink) => void;

  // Hypotheses
  hypotheses: Hypothesis[];
  setHypotheses: (h: Hypothesis[]) => void;

  // Gaps
  gaps: InvestigationGap[];
  setGaps: (g: InvestigationGap[]) => void;

  // Recommendations
  recommendations: Recommendation[];
  markRecommendationInvestigated: (recId: string) => void;

  // Search Zones
  searchZones: SearchZone[];

  // Negative Evidence
  negativeEvidence: NegativeEvidence[];

  // Graph
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  setGraphData: (nodes: GraphNode[], edges: GraphEdge[]) => void;

  // CCTV Sources
  cctvSources: CCTVSource[];

  // Audit Log
  auditLog: AuditLogEntry[];
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Demo flow state
  cctv014Investigated: boolean;
  investigateCCTV014: () => void;

  // Initialize demo data
  initDemoData: () => void;
  resetDemo: () => void;
}

let auditCounter = 100;
const nextAuditId = () => `AUD-${String(++auditCounter).padStart(3, '0')}`;

export const useAppStore = create<AppState>((set, get) => ({
  cases: [],
  activeCase: null,
  evidence: [],
  evidenceLinks: [],
  hypotheses: [],
  gaps: [],
  recommendations: [],
  searchZones: [],
  negativeEvidence: [],
  graphNodes: [],
  graphEdges: [],
  cctvSources: [],
  auditLog: [],
  cctv014Investigated: false,

  setActiveCase: (caseId) => {
    const c = get().cases.find((c) => c.id === caseId) || null;
    set({ activeCase: c });
  },

  addCase: (c) => {
    set((s) => ({
      cases: [c, ...s.cases.filter(existing => existing.id !== c.id)],
      activeCase: c,
      cctv014Investigated: false,
    }));
  },

  updateCaseCertainty: (caseId, certainty) => {
    set((s) => ({
      cases: s.cases.map((c) =>
        c.id === caseId ? { ...c, certainty, updatedAt: new Date().toISOString() } : c
      ),
      activeCase: s.activeCase?.id === caseId ? { ...s.activeCase, certainty, updatedAt: new Date().toISOString() } : s.activeCase,
    }));
  },

  addEvidence: (e) => {
    set((s) => ({
      evidence: [...s.evidence, e],
      cases: s.cases.map((c) =>
        c.id === e.caseId ? { ...c, evidenceIds: [...c.evidenceIds, e.id] } : c
      ),
    }));
  },

  addEvidenceLink: (link) => {
    set((s) => ({ evidenceLinks: [...s.evidenceLinks, link] }));
  },

  setHypotheses: (h) => set({ hypotheses: h }),
  setGaps: (g) => set({ gaps: g }),

  markRecommendationInvestigated: (recId) => {
    set((s) => ({
      recommendations: s.recommendations.map((r) =>
        r.id === recId ? { ...r, investigated: true } : r
      ),
    }));
  },

  setGraphData: (nodes, edges) => set({ graphNodes: nodes, graphEdges: edges }),

  addAuditEntry: (entry) => {
    const full: AuditLogEntry = {
      ...entry,
      id: nextAuditId(),
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ auditLog: [full, ...s.auditLog] }));
  },

  investigateCCTV014: () => {
    const state = get();
    if (state.cctv014Investigated) return;

    // 1. Add the new evidence
    state.addEvidence(cctv014Evidence);

    // 2. Update evidence links
    set({ evidenceLinks: postInvestigationLinks });

    // 3. Update hypotheses
    set({ hypotheses: updatedHypotheses });

    // 4. Update gaps
    set({ gaps: resolvedGaps });

    // 5. Update case certainty
    state.updateCaseCertainty('TRX-2026-001', postInvestigationCertainty);

    // 6. Update graph
    set({
      graphNodes: postInvestigationGraphNodes,
      graphEdges: postInvestigationGraphEdges,
    });

    // 7. Mark recommendation as investigated
    state.markRecommendationInvestigated('REC-001');

    // 8. Update search zones
    set({
      searchZones: state.searchZones.map((sz) =>
        sz.id === 'SZ-001'
          ? { ...sz, probability: 91, priority: 'high' as const }
          : sz
      ),
    });

    // 9. Add audit entries
    state.addAuditEntry({
      userId: state.cases[0]?.assignedTo[0] || 'USR-001',
      userName: 'Inspector Rajan Kumar',
      userRole: 'police',
      action: 'recommendation_investigated',
      target: 'REC-001',
      caseId: 'TRX-2026-001',
      details: 'Investigated CCTV-014 recommendation — evidence obtained',
    });

    state.addAuditEntry({
      userId: state.cases[0]?.assignedTo[0] || 'USR-001',
      userName: 'Inspector Rajan Kumar',
      userRole: 'police',
      action: 'evidence_added',
      target: 'EVD-019',
      caseId: 'TRX-2026-001',
      evidenceId: 'EVD-019',
      details: 'CCTV-014 evidence added — Lead Score 89%',
    });

    state.addAuditEntry({
      userId: 'SYSTEM',
      userName: 'TRACE-X System',
      userRole: 'police',
      action: 'hypothesis_updated',
      target: 'HYP-A',
      caseId: 'TRX-2026-001',
      details: 'Hypothesis A confidence updated: 61% → 82%. Hypothesis B weakened to 14%.',
    });

    set({ cctv014Investigated: true });
  },

  initDemoData: () => {
    set({
      cases: [demoCase],
      activeCase: demoCase,
      evidence: [...initialEvidence],
      evidenceLinks: [...initialEvidenceLinks],
      hypotheses: [...initialHypotheses],
      gaps: [...initialGaps],
      recommendations: [...initialRecommendations],
      searchZones: [...initialSearchZones],
      negativeEvidence: [...demoNegativeEvidence],
      graphNodes: [...initialGraphNodes],
      graphEdges: [...initialGraphEdges],
      cctvSources: [...demoCCTVSources],
      auditLog: [...initialAuditLog],
      cctv014Investigated: false,
    });
  },

  resetDemo: () => {
    set({
      cases: [demoCase],
      activeCase: demoCase,
      evidence: [...initialEvidence],
      evidenceLinks: [...initialEvidenceLinks],
      hypotheses: [...initialHypotheses],
      gaps: [...initialGaps],
      recommendations: [...initialRecommendations],
      searchZones: [...initialSearchZones],
      negativeEvidence: [...demoNegativeEvidence],
      graphNodes: [...initialGraphNodes],
      graphEdges: [...initialGraphEdges],
      cctvSources: [...demoCCTVSources],
      auditLog: [...initialAuditLog],
      cctv014Investigated: false,
    });
  },
}));
