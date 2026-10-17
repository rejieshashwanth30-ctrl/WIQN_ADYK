export type ExperimentStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type TestingMode = 'PRIVATE' | 'CARDEX_ALPHA';

export type DecisionOutcome = 'BUILD' | 'IMPROVE' | 'PIVOT' | 'STOP' | 'TEST_AGAIN';

export type InsightType = 'FACT' | 'HYPOTHESIS' | 'RECOMMENDATION' | 'LIMITATION';

export type ConfidenceLevel = 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export interface Experiment {
  id: string;
  name: string;
  productName: string;
  problem: string;
  targetAudience: string;
  productIdea: string;
  keyHypothesis: string;
  learningGoal: string;
  prototypeUrl: string;
  testingMode: TestingMode;
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
  metrics?: {
    visitorsCount: number;
    sessionsCount: number;
    interactionsCount: number;
    feedbackCount: number;
    avgTimeOnPrototype: number; // in seconds
  };
}

export interface ExperimentEvent {
  id: string;
  experimentId: string;
  sessionId: string;
  visitorId: string;
  eventType: 'PAGE_VIEW' | 'CLICK' | 'SCROLL_DEPTH' | 'FORM_START' | 'FORM_SUBMIT' | 'TIME_ON_PAGE' | 'CUSTOM';
  element?: string;
  elementText?: string;
  page: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface FeedbackItem {
  id: string;
  experimentId: string;
  visitorId?: string;
  prompt: string;
  category: 'usability' | 'value' | 'clarity' | 'blocker' | 'general';
  rating?: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface StructuredInsight {
  id: string;
  experimentId: string;
  type: InsightType;
  title: string;
  statement: string;
  evidence: string;
  confidence: ConfidenceLevel;
  limitations?: string;
  createdAt: string;
}

export interface DecisionRecord {
  id: string;
  experimentId: string;
  outcome: DecisionOutcome;
  evidenceSummary: string;
  reasoning: string;
  confidence: ConfidenceLevel;
  recommendedNextStep: string;
  limitations: string;
  decidedAt: string;
}

export interface CardexPublication {
  id: string;
  experimentId: string;
  publishedAt: string;
  targetTesterCount: number;
  currentTesters: number;
  isActive: boolean;
  notes?: string;
}
