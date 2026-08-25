// ============================================================
// TRACE-X — Core Type Definitions
// ============================================================

export type UserRole = 'police' | 'ngo' | 'volunteer' | 'family';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  badge?: string;
  department?: string;
  avatar?: string;
}

export type CaseCategory = 'child' | 'elderly' | 'vulnerable';
export type CaseStatus = 'active' | 'resolved' | 'closed' | 'archived';

export interface CaseCertainty {
  identity: number;
  time: number;
  location: number;
  route: number;
  cctvCoverage: number;
  witness: number;
  overall: number;
}

export interface MissingPerson {
  name: string;
  age: number;
  gender: string;
  category: CaseCategory;
  lastKnownLocation: string;
  lastKnownDateTime: string;
  photograph?: string;
  clothingDescription: string;
  distinguishingFeatures: string;
  knownObjects: string;
  notes?: string;
}

export interface AppearanceProfile {
  faceEmbeddingStatus: 'generated' | 'pending' | 'unavailable';
  approximateAge: string;
  clothing: string;
  backpackOrObject: string;
  shoes: string;
  hair: string;
  bodyAppearance: string;
}

export interface Case {
  id: string;
  person: MissingPerson;
  appearance?: AppearanceProfile;
  status: CaseStatus;
  certainty: CaseCertainty;
  createdAt: string;
  updatedAt: string;
  assignedTo: string[];
  evidenceIds: string[];
  hypothesisIds: string[];
  gapIds: string[];
}

export type EvidenceType = 'cctv' | 'citizen_sighting' | 'police_observation' | 'ngo_report' | 'transport_clue';
export type EvidenceStatus = 'pending' | 'processing' | 'analyzed' | 'verified' | 'rejected';
export type VerificationStatus = 'unverified' | 'potential_lead' | 'confirmed' | 'contradictory' | 'dismissed';
export type PrivacyLevel = 'public' | 'restricted' | 'confidential' | 'classified';

export interface EvidenceAnalysisResult {
  faceSimilarity: number;
  clothingSimilarity: number;
  backpackSimilarity: number;
  bodySimilarity: number;
  timeConsistency: number;
  locationConsistency: number;
  overallLeadScore: number;
}

export interface Evidence {
  id: string;
  caseId: string;
  source: string;
  type: EvidenceType;
  timestamp: string;
  latitude: number;
  longitude: number;
  confidence: number;
  privacyLevel: PrivacyLevel;
  verificationStatus: VerificationStatus;
  processingStatus: EvidenceStatus;
  description: string;
  imageUrl?: string;
  analysis?: EvidenceAnalysisResult;
  createdAt: string;
}

export interface CCTVSource {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'maintenance';
  zone: string;
}

export interface Sighting {
  id: string;
  caseId: string;
  reporterId?: string;
  photo?: string;
  location: string;
  latitude: number;
  longitude: number;
  time: string;
  description: string;
  status: 'submitted' | 'reviewing' | 'verified' | 'dismissed';
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  zone: string;
  type: 'landmark' | 'station' | 'junction' | 'zone' | 'camera';
}

export type HypothesisStatus = 'active' | 'supported' | 'weakened' | 'eliminated';

export interface HypothesisStep {
  evidenceId: string;
  label: string;
  confidence: number;
  location: string;
  time?: string;
}

export interface Hypothesis {
  id: string;
  caseId: string;
  name: string;
  description: string;
  confidence: number;
  status: HypothesisStatus;
  steps: HypothesisStep[];
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
}

export interface EvidenceLink {
  id: string;
  caseId: string;
  fromEvidenceId: string;
  toEvidenceId: string;
  relationship: 'sequential' | 'corroborating' | 'contradicting' | 'temporal' | 'spatial';
  confidence: number;
}

export interface InvestigationGap {
  id: string;
  caseId: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  uncertainty: number;
  missingEvidence: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  mostImportantGap: string;
}

export interface Recommendation {
  id: string;
  caseId: string;
  gapId: string;
  evidenceSource: string;
  evidenceType: EvidenceType;
  expectedUncertaintyReduction: number;
  hypothesisDistinction: string;
  locationRelevance: number;
  temporalRelevance: number;
  sourceReliability: number;
  evidenceValueScore: number;
  priority: 'very_high' | 'high' | 'medium' | 'low';
  reasons: string[];
  investigated: boolean;
}

export type AuditAction =
  | 'case_created'
  | 'case_viewed'
  | 'evidence_added'
  | 'evidence_viewed'
  | 'evidence_analyzed'
  | 'hypothesis_updated'
  | 'citizen_report_submitted'
  | 'search_zone_viewed'
  | 'gap_identified'
  | 'recommendation_investigated'
  | 'privacy_accessed'
  | 'login'
  | 'logout';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  target: string;
  caseId?: string;
  evidenceId?: string;
  details: string;
  timestamp: string;
}

export interface PrivacyPermission {
  roleId: UserRole;
  resource: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

// Graph visualization types
export type GraphNodeType = 'last_known' | 'cctv' | 'citizen_report' | 'transport' | 'location' | 'time_point' | 'object' | 'search_zone' | 'unknown';
export type GraphNodeState = 'confirmed' | 'probable' | 'unverified' | 'contradictory' | 'unknown';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  state: GraphNodeState;
  label: string;
  sublabel?: string;
  confidence?: number;
  evidenceId?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  confidence: number;
  dashed?: boolean;
}

// Search map types
export type ZonePriority = 'high' | 'medium' | 'low' | 'unknown';

export interface SearchZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  priority: ZonePriority;
  probability: number;
  reasons: string[];
  recommendations: string[];
}

// Negative evidence
export interface NegativeEvidence {
  id: string;
  caseId: string;
  expectedFrom: string;
  expectedTo: string;
  explanations: string[];
  impact: string;
}
