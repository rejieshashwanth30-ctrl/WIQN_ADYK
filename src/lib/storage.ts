import { Experiment, StructuredInsight, DecisionRecord, FeedbackItem } from './types';

export const REFERENCE_EXPERIMENT: Experiment = {
  id: 'exp_wiqn_alpha_01',
  name: 'Micro-Payment Protocol Checkout Friction',
  productName: 'SovereignPay SDK',
  problem: 'Developers abandon the checkout integration when forced to configure custodial webhook callbacks.',
  targetAudience: 'Early-stage Web3 & FinTech engineers deploying non-custodial billing.',
  productIdea: 'A 2-line client snippet that processes peer-to-peer settlement directly in browser memory.',
  keyHypothesis: 'Non-custodial direct settlement will increase checkout completion rates by at least 28% compared to redirect gateways.',
  learningGoal: 'Determine whether developers drop off due to wallet connection friction or cryptographic key authorization.',
  prototypeUrl: 'https://example.com/demo-checkout',
  testingMode: 'CARDEX_ALPHA',
  status: 'ACTIVE',
  createdAt: '2026-10-15T09:30:00.000Z',
  updatedAt: '2026-10-17T10:15:00.000Z',
  metrics: {
    visitorsCount: 142,
    sessionsCount: 189,
    interactionsCount: 864,
    feedbackCount: 19,
    avgTimeOnPrototype: 148,
  },
};

export const REFERENCE_INSIGHTS: StructuredInsight[] = [
  {
    id: 'ins_01',
    experimentId: 'exp_wiqn_alpha_01',
    type: 'FACT',
    title: 'Interaction Drop-off at Confirmation Gate',
    statement: '64.2% of users initiated the mock settlement flow, but 41% abandoned precisely at the authorization modal before committing a signature.',
    evidence: 'Telemetry recorded 121 modal triggers with 49 drop-offs occurring within 4.2 seconds of display without clicking cancel.',
    confidence: 'HIGH',
    limitations: 'Sample limited to desktop Chrome users referred from developer forums.',
    createdAt: '2026-10-17T08:00:00.000Z',
  },
  {
    id: 'ins_02',
    experimentId: 'exp_wiqn_alpha_01',
    type: 'HYPOTHESIS',
    title: 'Gas Fee Uncertainty vs Interface Ambiguity',
    statement: 'Users are hesitating because the prototype modal does not display explicit zero-gas confirmation, triggering caution.',
    evidence: '8 of 12 qualitative feedback notes explicitly asked "Will this debit my real balance or is this sandbox simulated?".',
    confidence: 'MODERATE',
    limitations: 'Further A/B headline test needed to isolate copy impact from visual design.',
    createdAt: '2026-10-17T08:30:00.000Z',
  },
  {
    id: 'ins_03',
    experimentId: 'exp_wiqn_alpha_01',
    type: 'RECOMMENDATION',
    title: 'Implement Sandbox Disclaimer Banner',
    statement: 'Display a high-contrast badge reading "Simulated Testnet Environment — 0 Actual Balance Deducted" directly above the primary commit button.',
    evidence: 'Session replay metadata indicates prolonged hover state (avg 6.8s) over the confirmation button without click.',
    confidence: 'HIGH',
    limitations: 'Does not address mobile wallet deep-linking behavior.',
    createdAt: '2026-10-17T09:00:00.000Z',
  },
  {
    id: 'ins_04',
    experimentId: 'exp_wiqn_alpha_01',
    type: 'LIMITATION',
    title: 'Sample Homogeneity',
    statement: 'Current testers are predominantly self-identified Solidity developers. Non-crypto SaaS engineers have not yet been observed.',
    evidence: 'Cardex Alpha recruitment source tags indicate 89% developer forum referrers.',
    confidence: 'VERY_HIGH',
    limitations: 'Do not generalize findings to conventional Web2 e-commerce merchants.',
    createdAt: '2026-10-17T09:15:00.000Z',
  },
];

export const REFERENCE_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb_01',
    experimentId: 'exp_wiqn_alpha_01',
    prompt: 'How clear was the zero-configuration setup?',
    category: 'clarity',
    rating: 4,
    comment: 'The 2-line snippet is very clean, but I was unsure whether it persists session state across page reloads.',
    createdAt: '2026-10-16T14:22:00.000Z',
  },
  {
    id: 'fb_02',
    experimentId: 'exp_wiqn_alpha_01',
    prompt: 'Did you encounter any friction during testing?',
    category: 'blocker',
    rating: 2,
    comment: 'The checkout modal took ~3 seconds to open on cold start. Thought the button was broken.',
    createdAt: '2026-10-16T18:40:00.000Z',
  },
  {
    id: 'fb_03',
    experimentId: 'exp_wiqn_alpha_01',
    prompt: 'Would you deploy this in production as an alternative to Stripe?',
    category: 'value',
    rating: 4,
    comment: 'If the gas estimation is instant, yes. The lack of webhooks is a massive engineering win for our stack.',
    createdAt: '2026-10-17T02:11:00.000Z',
  },
];

export const REFERENCE_DECISION: DecisionRecord = {
  id: 'dec_01',
  experimentId: 'exp_wiqn_alpha_01',
  outcome: 'IMPROVE',
  evidenceSummary: 'Core value proposition validated with strong interest in eliminating webhook architecture. Drop-off concentrated strictly around checkout modal trust markers.',
  reasoning: 'Abandonment is caused by UX ambiguity around simulated balances rather than rejection of the underlying protocol. Re-architecting is unnecessary; copy and trust signifiers must be resolved first.',
  confidence: 'HIGH',
  recommendedNextStep: 'Deploy revision v1.1.0 with prominent testnet disclaimers and sub-100ms modal pre-warming. Run a 48-hour Cardex Alpha batch.',
  limitations: 'Evidence collected over 48 hours with 142 total visitors. Enterprise volume behavior remains unmeasured.',
  decidedAt: '2026-10-17T10:00:00.000Z',
};

const STORAGE_KEY = 'wiqn_experiments_store_v1';

export function getStoredExperiments(): Experiment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredExperiment(experiment: Experiment): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredExperiments();
    const index = existing.findIndex((e) => e.id === experiment.id);
    if (index >= 0) {
      existing[index] = experiment;
    } else {
      existing.unshift(experiment);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save experiment to localStorage', e);
  }
}

export function getExperimentById(id: string): Experiment | null {
  if (id === REFERENCE_EXPERIMENT.id) return REFERENCE_EXPERIMENT;
  const list = getStoredExperiments();
  return list.find((e) => e.id === id) || null;
}
