// ============================================================
// TRACE-X — Demo Case Data (TRX-2026-001)
// Complete pre-loaded fictional case for hackathon demo
// ============================================================

import type {
  User,
  Case,
  Evidence,
  CCTVSource,
  Hypothesis,
  InvestigationGap,
  Recommendation,
  EvidenceLink,
  AuditLogEntry,
  SearchZone,
  NegativeEvidence,
  GraphNode,
  GraphEdge,
  Location,
} from '../types';

// ─── Demo Users ───────────────────────────────────────────────
export const demoUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Inspector Rajan Kumar',
    role: 'police',
    badge: 'TN-4521',
    department: 'Chennai Metropolitan Police',
  },
  {
    id: 'USR-002',
    name: 'Priya Shankar',
    role: 'ngo',
    department: 'Child Rights Foundation',
  },
  {
    id: 'USR-003',
    name: 'Arun Prakash',
    role: 'volunteer',
  },
  {
    id: 'USR-004',
    name: 'Meena Devi',
    role: 'family',
  },
];

// ─── CCTV Sources ─────────────────────────────────────────────
export const demoCCTVSources: CCTVSource[] = [
  { id: 'CAM-001', name: 'Chennai Central - Platform 3', location: 'Chennai Central Railway Station', latitude: 13.0827, longitude: 80.2707, status: 'online', zone: 'Zone A' },
  { id: 'CAM-002', name: 'Chennai Central - Exit Gate', location: 'Chennai Central Main Exit', latitude: 13.0831, longitude: 80.2712, status: 'online', zone: 'Zone A' },
  { id: 'CAM-003', name: 'Parry\'s Corner Junction', location: 'Parry\'s Corner', latitude: 13.0863, longitude: 80.2875, status: 'online', zone: 'Zone A' },
  { id: 'CAM-004', name: 'Bus Stop - Route 12', location: 'NSC Bose Rd Bus Stop', latitude: 13.0789, longitude: 80.2823, status: 'online', zone: 'Zone B' },
  { id: 'CAM-014', name: 'Market Entrance - Zone B', location: 'Koyambedu Market Entry', latitude: 13.0694, longitude: 80.1948, status: 'online', zone: 'Zone B' },
];

// ─── Locations ────────────────────────────────────────────────
export const demoLocations: Location[] = [
  { id: 'LOC-001', name: 'Chennai Central', latitude: 13.0827, longitude: 80.2707, zone: 'Zone A', type: 'station' },
  { id: 'LOC-002', name: 'Parry\'s Corner', latitude: 13.0863, longitude: 80.2875, zone: 'Zone A', type: 'junction' },
  { id: 'LOC-003', name: 'NSC Bose Road', latitude: 13.0789, longitude: 80.2823, zone: 'Zone B', type: 'junction' },
  { id: 'LOC-004', name: 'Koyambedu Market', latitude: 13.0694, longitude: 80.1948, zone: 'Zone B', type: 'landmark' },
  { id: 'LOC-005', name: 'Bus Route 12 Corridor', latitude: 13.0750, longitude: 80.2400, zone: 'Zone C', type: 'zone' },
  { id: 'LOC-006', name: 'T. Nagar Market', latitude: 13.0418, longitude: 80.2341, zone: 'Zone D', type: 'landmark' },
];

// ─── Initial Evidence (before CCTV-014 is added) ─────────────
export const initialEvidence: Evidence[] = [
  {
    id: 'EVD-001',
    caseId: 'TRX-2026-001',
    source: 'Family Report',
    type: 'police_observation',
    timestamp: '2026-08-25T10:00:00',
    latitude: 13.0827,
    longitude: 80.2707,
    confidence: 95,
    privacyLevel: 'confidential',
    verificationStatus: 'confirmed',
    processingStatus: 'verified',
    description: 'Last known photograph of the missing child at Chennai Central Railway Station',
    imageUrl: '/demo/last-known.jpg',
    createdAt: '2026-08-25T10:15:00',
  },
  {
    id: 'EVD-002',
    caseId: 'TRX-2026-001',
    source: 'CAM-001',
    type: 'cctv',
    timestamp: '2026-08-25T10:08:00',
    latitude: 13.0827,
    longitude: 80.2707,
    confidence: 89,
    privacyLevel: 'classified',
    verificationStatus: 'confirmed',
    processingStatus: 'analyzed',
    description: 'CCTV capture at Chennai Central Platform 3 — child with blue backpack walking toward exit',
    imageUrl: '/demo/cctv-001.jpg',
    analysis: {
      faceSimilarity: 89,
      clothingSimilarity: 94,
      backpackSimilarity: 97,
      bodySimilarity: 82,
      timeConsistency: 96,
      locationConsistency: 98,
      overallLeadScore: 91,
    },
    createdAt: '2026-08-25T10:20:00',
  },
  {
    id: 'EVD-003',
    caseId: 'TRX-2026-001',
    source: 'Citizen-023',
    type: 'citizen_sighting',
    timestamp: '2026-08-25T10:18:00',
    latitude: 13.0863,
    longitude: 80.2875,
    confidence: 74,
    privacyLevel: 'restricted',
    verificationStatus: 'potential_lead',
    processingStatus: 'analyzed',
    description: 'Citizen report: Child matching description seen near Parry\'s Corner, appeared to be alone, carrying blue backpack',
    analysis: {
      faceSimilarity: 74,
      clothingSimilarity: 88,
      backpackSimilarity: 91,
      bodySimilarity: 71,
      timeConsistency: 85,
      locationConsistency: 79,
      overallLeadScore: 81,
    },
    createdAt: '2026-08-25T10:45:00',
  },
  {
    id: 'EVD-004',
    caseId: 'TRX-2026-001',
    source: 'CAM-003',
    type: 'cctv',
    timestamp: '2026-08-25T10:14:00',
    latitude: 13.0863,
    longitude: 80.2875,
    confidence: 82,
    privacyLevel: 'classified',
    verificationStatus: 'potential_lead',
    processingStatus: 'analyzed',
    description: 'CCTV at Parry\'s Corner — figure resembling description, partially occluded by crowd',
    imageUrl: '/demo/cctv-007.jpg',
    analysis: {
      faceSimilarity: 68,
      clothingSimilarity: 85,
      backpackSimilarity: 92,
      bodySimilarity: 74,
      timeConsistency: 88,
      locationConsistency: 82,
      overallLeadScore: 82,
    },
    createdAt: '2026-08-25T11:00:00',
  },
  {
    id: 'EVD-005',
    caseId: 'TRX-2026-001',
    source: 'Transport Authority',
    type: 'transport_clue',
    timestamp: '2026-08-25T10:22:00',
    latitude: 13.0789,
    longitude: 80.2823,
    confidence: 61,
    privacyLevel: 'restricted',
    verificationStatus: 'unverified',
    processingStatus: 'analyzed',
    description: 'Bus Route 12 ticket data indicates a minor passenger boarded near NSC Bose Rd at approximately 10:22 AM',
    analysis: {
      faceSimilarity: 0,
      clothingSimilarity: 0,
      backpackSimilarity: 0,
      bodySimilarity: 0,
      timeConsistency: 78,
      locationConsistency: 72,
      overallLeadScore: 58,
    },
    createdAt: '2026-08-25T12:30:00',
  },
];

// ─── Evidence that gets added when CCTV-014 is "investigated" ─
export const cctv014Evidence: Evidence = {
  id: 'EVD-019',
  caseId: 'TRX-2026-001',
  source: 'CAM-014',
  type: 'cctv',
  timestamp: '2026-08-25T10:31:00',
  latitude: 13.0694,
  longitude: 80.1948,
  confidence: 84,
  privacyLevel: 'classified',
  verificationStatus: 'potential_lead',
  processingStatus: 'analyzed',
  description: 'CCTV capture at Koyambedu Market entrance — child with blue backpack entering market area',
  imageUrl: '/demo/cctv-014.jpg',
  analysis: {
    faceSimilarity: 84,
    clothingSimilarity: 91,
    backpackSimilarity: 96,
    bodySimilarity: 78,
    timeConsistency: 92,
    locationConsistency: 88,
    overallLeadScore: 89,
  },
  createdAt: new Date().toISOString(),
};

// ─── Evidence Links ───────────────────────────────────────────
export const initialEvidenceLinks: EvidenceLink[] = [
  { id: 'LNK-001', caseId: 'TRX-2026-001', fromEvidenceId: 'EVD-001', toEvidenceId: 'EVD-002', relationship: 'sequential', confidence: 95 },
  { id: 'LNK-002', caseId: 'TRX-2026-001', fromEvidenceId: 'EVD-002', toEvidenceId: 'EVD-003', relationship: 'sequential', confidence: 72 },
  { id: 'LNK-003', caseId: 'TRX-2026-001', fromEvidenceId: 'EVD-002', toEvidenceId: 'EVD-004', relationship: 'corroborating', confidence: 78 },
  { id: 'LNK-004', caseId: 'TRX-2026-001', fromEvidenceId: 'EVD-003', toEvidenceId: 'EVD-005', relationship: 'temporal', confidence: 55 },
];

export const postInvestigationLinks: EvidenceLink[] = [
  ...initialEvidenceLinks,
  { id: 'LNK-005', caseId: 'TRX-2026-001', fromEvidenceId: 'EVD-004', toEvidenceId: 'EVD-019', relationship: 'sequential', confidence: 82 },
  { id: 'LNK-006', caseId: 'TRX-2026-001', fromEvidenceId: 'EVD-005', toEvidenceId: 'EVD-019', relationship: 'corroborating', confidence: 76 },
];

// ─── Hypotheses (initial — before CCTV-014) ───────────────────
export const initialHypotheses: Hypothesis[] = [
  {
    id: 'HYP-A',
    caseId: 'TRX-2026-001',
    name: 'Hypothesis A',
    description: 'Subject moved from Chennai Central through Parry\'s Corner to Zone B (Koyambedu Market area)',
    confidence: 61,
    status: 'active',
    steps: [
      { evidenceId: 'EVD-002', label: 'CCTV-001 (Chennai Central)', confidence: 89, location: 'Chennai Central', time: '10:08 AM' },
      { evidenceId: 'EVD-004', label: 'CCTV-007 (Parry\'s Corner)', confidence: 82, location: 'Parry\'s Corner', time: '10:14 AM' },
      { evidenceId: '', label: 'Zone B (Unknown corridor)', confidence: 45, location: 'Zone B' },
    ],
    supportingEvidenceIds: ['EVD-002', 'EVD-003', 'EVD-004'],
    contradictingEvidenceIds: [],
  },
  {
    id: 'HYP-B',
    caseId: 'TRX-2026-001',
    name: 'Hypothesis B',
    description: 'Subject took Bus Route 12 from NSC Bose Rd toward Zone C',
    confidence: 27,
    status: 'active',
    steps: [
      { evidenceId: 'EVD-002', label: 'CCTV-001 (Chennai Central)', confidence: 89, location: 'Chennai Central', time: '10:08 AM' },
      { evidenceId: 'EVD-005', label: 'Bus Route 12', confidence: 61, location: 'NSC Bose Rd', time: '10:22 AM' },
      { evidenceId: '', label: 'Zone C (Bus Route corridor)', confidence: 30, location: 'Zone C' },
    ],
    supportingEvidenceIds: ['EVD-002', 'EVD-005'],
    contradictingEvidenceIds: [],
  },
  {
    id: 'HYP-C',
    caseId: 'TRX-2026-001',
    name: 'Hypothesis C',
    description: 'Subject moved through local market area toward Zone D (T. Nagar)',
    confidence: 12,
    status: 'active',
    steps: [
      { evidenceId: 'EVD-002', label: 'CCTV-001 (Chennai Central)', confidence: 89, location: 'Chennai Central', time: '10:08 AM' },
      { evidenceId: 'EVD-003', label: 'Citizen sighting near Parry\'s', confidence: 74, location: 'Parry\'s Corner', time: '10:18 AM' },
      { evidenceId: '', label: 'Zone D (T. Nagar Market)', confidence: 15, location: 'Zone D' },
    ],
    supportingEvidenceIds: ['EVD-002', 'EVD-003'],
    contradictingEvidenceIds: ['EVD-005'],
  },
];

// ─── Updated hypotheses after CCTV-014 ────────────────────────
export const updatedHypotheses: Hypothesis[] = [
  {
    ...initialHypotheses[0],
    confidence: 82,
    status: 'supported',
    steps: [
      { evidenceId: 'EVD-002', label: 'CCTV-001 (Chennai Central)', confidence: 89, location: 'Chennai Central', time: '10:08 AM' },
      { evidenceId: 'EVD-004', label: 'CCTV-007 (Parry\'s Corner)', confidence: 82, location: 'Parry\'s Corner', time: '10:14 AM' },
      { evidenceId: 'EVD-019', label: 'CCTV-014 (Market Entrance)', confidence: 84, location: 'Koyambedu Market', time: '10:31 AM' },
    ],
    supportingEvidenceIds: ['EVD-002', 'EVD-003', 'EVD-004', 'EVD-019'],
  },
  {
    ...initialHypotheses[1],
    confidence: 14,
    status: 'weakened',
  },
  {
    ...initialHypotheses[2],
    confidence: 4,
    status: 'weakened',
  },
];

// ─── Investigation Gaps ───────────────────────────────────────
export const initialGaps: InvestigationGap[] = [
  {
    id: 'GAP-001',
    caseId: 'TRX-2026-001',
    description: 'Movement between Parry\'s Corner and Zone B is unaccounted for. No CCTV or witness data covers the 13-minute window.',
    timeStart: '2026-08-25T10:18:00',
    timeEnd: '2026-08-25T10:31:00',
    uncertainty: 68,
    missingEvidence: [
      'CCTV coverage between Zone A and Zone B',
      'Possible transport mode used',
      'Witness confirmation of movement direction',
      'Exact transition time between zones',
    ],
    priority: 'critical',
    mostImportantGap: 'CCTV coverage between Zone A and Zone B',
  },
  {
    id: 'GAP-002',
    caseId: 'TRX-2026-001',
    description: 'Transport clue (Bus Route 12) remains unverified. Ticket data is not confirmed to belong to the subject.',
    timeStart: '2026-08-25T10:20:00',
    timeEnd: '2026-08-25T10:30:00',
    uncertainty: 52,
    missingEvidence: [
      'Bus CCTV footage for Route 12',
      'Ticket purchase method verification',
      'Bus driver interview',
    ],
    priority: 'high',
    mostImportantGap: 'Bus CCTV footage for Route 12',
  },
];

export const resolvedGaps: InvestigationGap[] = [
  {
    ...initialGaps[0],
    uncertainty: 28,
    description: 'CCTV-014 partially resolves the movement gap. Subject was observed at Koyambedu Market at 10:31 AM. Route between Parry\'s Corner and market is now partially traced.',
    missingEvidence: [
      'Exact route taken between Parry\'s Corner and Koyambedu',
      'Mode of transport confirmation',
    ],
    priority: 'medium',
  },
  initialGaps[1],
];

// ─── Recommendations ─────────────────────────────────────────
export const initialRecommendations: Recommendation[] = [
  {
    id: 'REC-001',
    caseId: 'TRX-2026-001',
    gapId: 'GAP-001',
    evidenceSource: 'CCTV-014 (Market Entrance)',
    evidenceType: 'cctv',
    expectedUncertaintyReduction: 31,
    hypothesisDistinction: 'Can distinguish Hypothesis A from B',
    locationRelevance: 94,
    temporalRelevance: 91,
    sourceReliability: 88,
    evidenceValueScore: 92,
    priority: 'very_high',
    reasons: [
      'Distinguishes Hypothesis A from B',
      'Covers the major 10:18–10:31 AM evidence gap',
      'High temporal relevance to the missing window',
      'High location relevance — on likely movement path',
      'CCTV source is reliable and operational',
    ],
    investigated: false,
  },
  {
    id: 'REC-002',
    caseId: 'TRX-2026-001',
    gapId: 'GAP-002',
    evidenceSource: 'Bus Route 12 CCTV',
    evidenceType: 'transport_clue',
    expectedUncertaintyReduction: 18,
    hypothesisDistinction: 'Confirms or eliminates Hypothesis B',
    locationRelevance: 72,
    temporalRelevance: 78,
    sourceReliability: 65,
    evidenceValueScore: 71,
    priority: 'high',
    reasons: [
      'Confirms or eliminates Bus Route hypothesis',
      'Moderate temporal relevance',
      'Source availability uncertain',
    ],
    investigated: false,
  },
  {
    id: 'REC-003',
    caseId: 'TRX-2026-001',
    gapId: 'GAP-001',
    evidenceSource: 'Witness #23 re-interview',
    evidenceType: 'citizen_sighting',
    expectedUncertaintyReduction: 9,
    hypothesisDistinction: 'Provides direction-of-movement data',
    locationRelevance: 68,
    temporalRelevance: 62,
    sourceReliability: 55,
    evidenceValueScore: 48,
    priority: 'medium',
    reasons: [
      'Provides direction-of-movement information',
      'Low-cost evidence gathering',
      'Moderate reliability — single witness',
    ],
    investigated: false,
  },
];

// ─── Negative Evidence ────────────────────────────────────────
export const demoNegativeEvidence: NegativeEvidence[] = [
  {
    id: 'NEG-001',
    caseId: 'TRX-2026-001',
    expectedFrom: 'CCTV-007 (Parry\'s Corner)',
    expectedTo: 'CCTV-009 (NSC Bose Road East)',
    explanations: [
      'Alternate route bypassing CCTV-009 coverage area',
      'CCTV-009 has a known coverage gap on the west side',
      'Vehicle or transport transition (subject may have boarded a vehicle)',
      'Occlusion by crowd or obstruction at time of transit',
      'Previous lead from CCTV-007 may be an incorrect match',
    ],
    impact: 'This negative evidence weakens direct walking route hypothesis and increases probability of vehicle/transport use.',
  },
];

// ─── Search Zones ─────────────────────────────────────────────
export const initialSearchZones: SearchZone[] = [
  {
    id: 'SZ-001',
    name: 'Zone B — Koyambedu Market',
    center: [13.0694, 80.1948],
    radius: 800,
    priority: 'high',
    probability: 78,
    reasons: [
      'Strong CCTV correlation (CCTV-001 → CCTV-014 path)',
      'Time compatibility with last sighting',
      'Transport connectivity (Bus Route 12 terminus nearby)',
      'Citizen report corroboration near Parry\'s Corner',
    ],
    recommendations: ['Verify CCTV cameras 18–23 in the market area', 'Dispatch ground team for visual search'],
  },
  {
    id: 'SZ-002',
    name: 'Zone C — Bus Route 12 Corridor',
    center: [13.0750, 80.2400],
    radius: 600,
    priority: 'medium',
    probability: 42,
    reasons: [
      'Transport clue indicates possible bus boarding',
      'Route covers multiple intermediate stops',
    ],
    recommendations: ['Check bus stop CCTV along Route 12', 'Interview bus driver for Route 12 (10:20–10:40 AM)'],
  },
  {
    id: 'SZ-003',
    name: 'Zone D — T. Nagar Market',
    center: [13.0418, 80.2341],
    radius: 500,
    priority: 'low',
    probability: 18,
    reasons: [
      'Citizen sighting direction was ambiguous',
      'Possible if subject changed route at Parry\'s Corner',
    ],
    recommendations: ['Low priority — monitor only if Zone B and C searches are inconclusive'],
  },
];

// ─── Evidence Graph Nodes & Edges ─────────────────────────────
export const initialGraphNodes: GraphNode[] = [
  { id: 'N-001', type: 'last_known', state: 'confirmed', label: 'Last Known', sublabel: 'Chennai Central\n10:00 AM', confidence: 95, evidenceId: 'EVD-001' },
  { id: 'N-002', type: 'cctv', state: 'confirmed', label: 'CCTV-001', sublabel: 'Platform 3\n10:08 AM', confidence: 89, evidenceId: 'EVD-002' },
  { id: 'N-003', type: 'citizen_report', state: 'probable', label: 'Citizen-023', sublabel: 'Parry\'s Corner\n10:18 AM', confidence: 74, evidenceId: 'EVD-003' },
  { id: 'N-004', type: 'cctv', state: 'probable', label: 'CCTV-007', sublabel: 'Parry\'s Corner\n10:14 AM', confidence: 82, evidenceId: 'EVD-004' },
  { id: 'N-005', type: 'transport', state: 'unverified', label: 'Transport Clue', sublabel: 'Bus Route 12\n10:22 AM', confidence: 61, evidenceId: 'EVD-005' },
  { id: 'N-006', type: 'unknown', state: 'unknown', label: '???', sublabel: 'Unknown corridor\n10:18–10:31 AM', confidence: 0 },
  { id: 'N-007', type: 'search_zone', state: 'unverified', label: 'Search Zone B', sublabel: 'Koyambedu Market\nProbability: 78%', confidence: 78 },
];

export const initialGraphEdges: GraphEdge[] = [
  { id: 'E-001', source: 'N-001', target: 'N-002', label: '8 min', confidence: 95 },
  { id: 'E-002', source: 'N-002', target: 'N-004', label: '6 min', confidence: 82 },
  { id: 'E-003', source: 'N-002', target: 'N-003', label: '10 min', confidence: 72 },
  { id: 'E-004', source: 'N-003', target: 'N-005', label: '4 min', confidence: 55, dashed: true },
  { id: 'E-005', source: 'N-004', target: 'N-006', label: '?', confidence: 30, dashed: true },
  { id: 'E-006', source: 'N-006', target: 'N-007', label: '?', confidence: 45, dashed: true },
];

export const postInvestigationGraphNodes: GraphNode[] = [
  ...initialGraphNodes.filter(n => n.id !== 'N-006'),
  { id: 'N-008', type: 'cctv', state: 'probable', label: 'CCTV-014', sublabel: 'Market Entrance\n10:31 AM', confidence: 84, evidenceId: 'EVD-019' },
  { ...initialGraphNodes.find(n => n.id === 'N-007')!, state: 'probable', sublabel: 'Koyambedu Market\nProbability: 91%', confidence: 91 },
];

export const postInvestigationGraphEdges: GraphEdge[] = [
  ...initialGraphEdges.filter(e => e.id !== 'E-005' && e.id !== 'E-006'),
  { id: 'E-007', source: 'N-004', target: 'N-008', label: '17 min', confidence: 78 },
  { id: 'E-008', source: 'N-005', target: 'N-008', label: '9 min', confidence: 68, dashed: true },
  { id: 'E-009', source: 'N-008', target: 'N-007', label: 'Zone B', confidence: 88 },
];

// ─── Case Certainty States ───────────────────────────────────
export const initialCertainty = {
  identity: 82,
  time: 91,
  location: 74,
  route: 31,
  cctvCoverage: 53,
  witness: 68,
  overall: 61,
};

export const postInvestigationCertainty = {
  identity: 86,
  time: 93,
  location: 88,
  route: 72,
  cctvCoverage: 78,
  witness: 71,
  overall: 84,
};

// ─── Complete Demo Case ───────────────────────────────────────
export const demoCase: Case = {
  id: 'TRX-2026-001',
  person: {
    name: 'Arjun Krishnan',
    age: 12,
    gender: 'Male',
    category: 'child',
    lastKnownLocation: 'Chennai Central Railway Station',
    lastKnownDateTime: '2026-08-25T10:00:00',
    photograph: '/demo/missing-person.jpg',
    clothingDescription: 'Blue school uniform shirt, dark grey trousers, white canvas shoes',
    distinguishingFeatures: 'Small scar on left eyebrow, wears black-framed glasses',
    knownObjects: 'Blue backpack with red zipper, water bottle',
    notes: 'Was last seen by mother at Platform 3 before she momentarily turned to buy a ticket. Speaks Tamil and basic English.',
  },
  appearance: {
    faceEmbeddingStatus: 'generated',
    approximateAge: '11–13 years',
    clothing: 'Blue collared shirt (school uniform), dark grey trousers',
    backpackOrObject: 'Blue backpack with distinctive red zipper, water bottle in side pocket',
    shoes: 'White canvas shoes, slightly worn',
    hair: 'Short black hair, side-parted',
    bodyAppearance: 'Approximately 145 cm, slim build',
  },
  status: 'active',
  certainty: { ...initialCertainty },
  createdAt: '2026-08-25T10:05:00',
  updatedAt: '2026-08-25T14:30:00',
  assignedTo: ['USR-001', 'USR-002'],
  evidenceIds: ['EVD-001', 'EVD-002', 'EVD-003', 'EVD-004', 'EVD-005'],
  hypothesisIds: ['HYP-A', 'HYP-B', 'HYP-C'],
  gapIds: ['GAP-001', 'GAP-002'],
};

// ─── Initial Audit Log ────────────────────────────────────────
export const initialAuditLog: AuditLogEntry[] = [
  { id: 'AUD-001', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'case_created', target: 'TRX-2026-001', caseId: 'TRX-2026-001', details: 'Created missing person case for Arjun Krishnan', timestamp: '2026-08-25T10:05:00' },
  { id: 'AUD-002', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'evidence_added', target: 'EVD-001', caseId: 'TRX-2026-001', evidenceId: 'EVD-001', details: 'Added last known photograph', timestamp: '2026-08-25T10:15:00' },
  { id: 'AUD-003', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'evidence_added', target: 'EVD-002', caseId: 'TRX-2026-001', evidenceId: 'EVD-002', details: 'Added CCTV-001 evidence from Chennai Central', timestamp: '2026-08-25T10:20:00' },
  { id: 'AUD-004', userId: 'USR-003', userName: 'Arun Prakash', userRole: 'volunteer', action: 'citizen_report_submitted', target: 'EVD-003', caseId: 'TRX-2026-001', evidenceId: 'EVD-003', details: 'Citizen sighting submitted near Parry\'s Corner', timestamp: '2026-08-25T10:45:00' },
  { id: 'AUD-005', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'evidence_added', target: 'EVD-004', caseId: 'TRX-2026-001', evidenceId: 'EVD-004', details: 'Added CCTV-007 evidence from Parry\'s Corner', timestamp: '2026-08-25T11:00:00' },
  { id: 'AUD-006', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'evidence_analyzed', target: 'EVD-002', caseId: 'TRX-2026-001', evidenceId: 'EVD-002', details: 'AI analysis completed — Overall Lead Score: 91%', timestamp: '2026-08-25T11:15:00' },
  { id: 'AUD-007', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'evidence_added', target: 'EVD-005', caseId: 'TRX-2026-001', evidenceId: 'EVD-005', details: 'Transport clue added — Bus Route 12', timestamp: '2026-08-25T12:30:00' },
  { id: 'AUD-008', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'gap_identified', target: 'GAP-001', caseId: 'TRX-2026-001', details: 'Critical gap identified: 10:18–10:31 AM movement unaccounted', timestamp: '2026-08-25T13:00:00' },
  { id: 'AUD-009', userId: 'USR-002', userName: 'Priya Shankar', userRole: 'ngo', action: 'case_viewed', target: 'TRX-2026-001', caseId: 'TRX-2026-001', details: 'Viewed case details', timestamp: '2026-08-25T14:00:00' },
  { id: 'AUD-010', userId: 'USR-001', userName: 'Inspector Rajan Kumar', userRole: 'police', action: 'hypothesis_updated', target: 'HYP-A', caseId: 'TRX-2026-001', details: 'Updated Hypothesis A confidence based on new evidence', timestamp: '2026-08-25T14:30:00' },
];
