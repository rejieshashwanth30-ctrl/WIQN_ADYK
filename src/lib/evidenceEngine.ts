/**
 * ADYK WIQN EVIDENCE ENGINE
 * Deterministic evidence structuring layer.
 * Separates Measured Facts, User Feedback, Observed Behavior,
 * Say-vs-Do signals, Recommendations, and Limitations.
 */

export interface EvidencePack {
  experimentId: string;
  experimentName: string;
  productName: string;
  hypothesis: string;
  problem: string;
  learningGoal: string;

  // Evidence Sufficiency
  evidenceLevel: 'INSUFFICIENT' | 'EARLY_SIGNALS' | 'SUFFICIENT';
  isSufficient: boolean;
  sampleSummary: {
    visitors: number;
    sessions: number;
    events: number;
    feedbackCount: number;
    avgDurationSec: number;
  };

  // Structured Evidence Categories
  measuredFacts: Array<{
    id: string;
    title: string;
    statement: string;
    evidence: string;
    confidence: 'LOW' | 'MODERATE' | 'HIGH';
    limitations: string;
  }>;

  observedBehaviors: Array<{
    title: string;
    observation: string;
    significance: string;
  }>;

  // Rich Behavioral Evidence
  topClickedElements?: Array<{
    label: string;
    totalClicks: number;
    uniqueVisitors: number;
    avgClicksPerVisitor: number;
    percentage: number;
  }>;
  observedPaths?: Array<{
    pathSummary: string;
    sessionsCount: number;
    percentage: number;
  }>;
  funnelSteps?: Array<{
    name: string;
    count: number;
    overallPercentage: number;
    dropOffCount: number;
  }>;

  userFeedbackSummary: {
    averageRating: number | null;
    ratingCount: number;
    topics: Record<string, number>;
    quotes: string[];
    founderObservationsCount: number;
    testerFeedbackCount: number;
  };

  sayVsDoSignals: Array<{
    title: string;
    statedFeedback: string;
    observedBehavior: string;
    interpretation: string;
    recommendation: string;
  }>;

  possibleExplanations: string[];
  recommendedActions: string[];
  evidenceLimitations: string[];
  suggestedOutcome: 'BUILD' | 'IMPROVE' | 'PIVOT' | 'STOP' | 'TEST_AGAIN';
  suggestedOutcomeReason: string;
}

export function synthesizeExperimentEvidence(data: {
  experiment: {
    id: string;
    name: string;
    productName: string;
    keyHypothesis: string;
    problem?: string;
    learningGoal?: string;
  };
  metrics: {
    visitorsCount: number;
    sessionsCount: number;
    interactionsCount: number;
    feedbackCount: number;
    avgTimeOnPrototype: number;
  };
  events: Array<{
    eventType: string;
    element?: string | null;
    elementText?: string | null;
    timestamp: Date | string;
    metadata?: any;
  }>;
  sessions?: Array<{
    durationSec?: number | null;
    startedAt: Date | string;
    endedAt?: Date | string | null;
  }>;
  feedback: Array<{
    visitorId?: string | null;
    category?: string | null;
    rating?: number | null;
    comment?: string | null;
    createdAt: Date | string;
  }>;
}): EvidencePack {
  const { experiment, metrics, events, feedback } = data;

  const visitors = metrics.visitorsCount || 0;
  const actions = metrics.interactionsCount || 0;
  const feedbackCount = feedback.length || metrics.feedbackCount || 0;
  const avgDuration = metrics.avgTimeOnPrototype || 0;

  // Determine sufficiency level
  let evidenceLevel: 'INSUFFICIENT' | 'EARLY_SIGNALS' | 'SUFFICIENT' = 'INSUFFICIENT';
  if (visitors >= 15 && actions >= 50) {
    evidenceLevel = 'SUFFICIENT';
  } else if (visitors >= 5 && actions >= 20) {
    evidenceLevel = 'EARLY_SIGNALS';
  }

  const isSufficient = evidenceLevel !== 'INSUFFICIENT';

  // 1. Measured Facts
  const measuredFacts: EvidencePack['measuredFacts'] = [];

  // Visitor & action volume fact
  if (visitors === 0) {
    measuredFacts.push({
      id: 'fact_traffic_0',
      title: 'Visitor Activity So Far',
      statement: 'No one has visited your prototype yet.',
      evidence: '0 prototype visits recorded in database.',
      confidence: 'HIGH',
      limitations: 'Share your prototype link with prospective users or verify tracking snippet installation.',
    });
  } else {
    const vWord = visitors === 1 ? '1 person' : `${visitors} different people`;
    const aWord = actions === 1 ? '1 action' : `${actions} actions`;
    measuredFacts.push({
      id: 'fact_traffic_volume',
      title: 'Visitor Activity So Far',
      statement: `${vWord} visited your prototype and took ${aWord}.`,
      evidence: `Recorded directly from prototype interactions (${visitors} visitors across ${metrics.sessionsCount || 1} session(s)).`,
      confidence: visitors >= 10 ? 'HIGH' : 'LOW',
      limitations: visitors < 5 ? `Small initial group: Only ${visitors} visitor(s) tested so far. More testing needed for statistical confidence.` : 'Initial testing cohort.',
    });
  }

  // Duration fact
  if (avgDuration > 0) {
    measuredFacts.push({
      id: 'fact_duration',
      title: 'Average Engagement Duration',
      statement: `Visitors spent an average of ${avgDuration} seconds exploring your prototype.`,
      evidence: `Calculated from real session engagement intervals and unload beacons.`,
      confidence: actions >= 15 ? 'HIGH' : 'MODERATE',
      limitations: 'Engagement time indicates attention, but does not guarantee product satisfaction or purchase intent.',
    });
  }

  // Click concentration & behavioral element breakdown
  const elementMap = new Map<string, { label: string; totalClicks: number; visitors: Set<string> }>();
  let totalClicks = 0;

  events.forEach((ev: any) => {
    if (ev.eventType === 'CLICK') {
      totalClicks++;
      const label = (ev.elementText && ev.elementText.trim() && ev.elementText !== '[REDACTED]')
        ? ev.elementText.trim()
        : (ev.element || 'button');
      const vId = ev.visitorId || 'v_anon';

      if (!elementMap.has(label)) {
        elementMap.set(label, { label, totalClicks: 0, visitors: new Set<string>() });
      }
      const el = elementMap.get(label)!;
      el.totalClicks++;
      el.visitors.add(vId);
    }
  });

  const topClickedElements = Array.from(elementMap.values())
    .map((item) => ({
      label: item.label,
      totalClicks: item.totalClicks,
      uniqueVisitors: item.visitors.size,
      avgClicksPerVisitor: item.visitors.size > 0 ? Math.round((item.totalClicks / item.visitors.size) * 10) / 10 : item.totalClicks,
      percentage: totalClicks > 0 ? Math.round((item.totalClicks / totalClicks) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.totalClicks - a.totalClicks);

  if (topClickedElements.length > 0) {
    const top = topClickedElements[0];
    measuredFacts.push({
      id: 'fact_top_cta',
      title: 'Most-Clicked Element',
      statement: `Visitors clicked on "${top.label}" ${top.totalClicks} time(s) (${top.percentage}% of all clicks) across ${top.uniqueVisitors} visitor(s).`,
      evidence: `Direct click telemetry recorded on prototype.`,
      confidence: actions >= 20 ? 'HIGH' : 'MODERATE',
      limitations: 'Observation only: an element click indicates interaction focus, but does not prove purchase intent or demand.',
    });
  }

  // Funnel steps calculation
  const clickerVisitors = new Set<string>();
  const formStartVisitors = new Set<string>();
  const formSubmitVisitors = new Set<string>();
  const feedbackVisitors = new Set<string>();

  events.forEach((ev: any) => {
    const vId = ev.visitorId;
    if (vId) {
      if (ev.eventType === 'CLICK') clickerVisitors.add(vId);
      if (ev.eventType === 'FORM_START') formStartVisitors.add(vId);
      if (ev.eventType === 'FORM_SUBMIT') formSubmitVisitors.add(vId);
    }
  });
  feedback.forEach((fb: any) => {
    if (fb.visitorId) feedbackVisitors.add(fb.visitorId);
  });

  const funnelSteps = [
    {
      name: 'Visitors',
      count: visitors,
      overallPercentage: 100,
      dropOffCount: Math.max(0, visitors - clickerVisitors.size),
    },
    {
      name: 'CTA Clicks',
      count: clickerVisitors.size,
      overallPercentage: visitors > 0 ? Math.round((clickerVisitors.size / visitors) * 100) : 0,
      dropOffCount: Math.max(0, clickerVisitors.size - formStartVisitors.size),
    },
    {
      name: 'Form Started',
      count: formStartVisitors.size,
      overallPercentage: visitors > 0 ? Math.round((formStartVisitors.size / visitors) * 100) : 0,
      dropOffCount: Math.max(0, formStartVisitors.size - formSubmitVisitors.size),
    },
    {
      name: 'Form Submitted',
      count: formSubmitVisitors.size,
      overallPercentage: visitors > 0 ? Math.round((formSubmitVisitors.size / visitors) * 100) : 0,
      dropOffCount: Math.max(0, formSubmitVisitors.size - feedbackVisitors.size),
    },
    {
      name: 'Feedback / Goal Completed',
      count: Math.max(feedbackVisitors.size, feedback.length > 0 ? 1 : 0),
      overallPercentage: visitors > 0 ? Math.round((Math.max(feedbackVisitors.size, feedback.length > 0 ? 1 : 0) / visitors) * 100) : 0,
      dropOffCount: 0,
    },
  ];

  // 2. User Feedback Summary
  let ratingTotal = 0;
  let ratingCount = 0;
  const topics: Record<string, number> = {};
  const quotes: string[] = [];
  let testerFeedbackCount = 0;
  let founderObservationsCount = 0;

  feedback.forEach((fb) => {
    if (fb.visitorId) {
      testerFeedbackCount++;
    } else {
      founderObservationsCount++;
    }

    if (typeof fb.rating === 'number' && fb.rating > 0) {
      ratingTotal += fb.rating;
      ratingCount++;
    }

    const cat = (fb.category || 'general').toLowerCase();
    topics[cat] = (topics[cat] || 0) + 1;

    if (fb.comment?.trim()) {
      quotes.push(fb.comment.trim());
    }
  });

  const averageRating = ratingCount > 0 ? Math.round((ratingTotal / ratingCount) * 10) / 10 : null;

  if (feedbackCount > 0) {
    measuredFacts.push({
      id: 'fact_feedback_summary',
      title: 'Feedback Summary',
      statement: `${feedbackCount} feedback entry/entries recorded (${testerFeedbackCount} from testers, ${founderObservationsCount} founder observation(s)).`,
      evidence: averageRating ? `Average rating of ${averageRating}/5 across ${ratingCount} rating(s).` : 'Qualitative feedback entries recorded.',
      confidence: 'HIGH',
      limitations: 'Individual feedback highlights specific tester viewpoints and should be weighed alongside observed visitor actions.',
    });
  } else {
    measuredFacts.push({
      id: 'fact_feedback_0',
      title: 'Tester Feedback So Far',
      statement: 'No feedback submissions recorded yet.',
      evidence: '0 feedback entries in database.',
      confidence: 'HIGH',
      limitations: 'Ask testers directly about confusing steps or use the "Give Feedback" button on the test link.',
    });
  }

  // 3. Observed Behaviors
  const observedBehaviors: EvidencePack['observedBehaviors'] = [];
  if (topClickedElements.length > 1) {
    observedBehaviors.push({
      title: 'Navigation Exploration',
      observation: `Visitors interacted with ${topClickedElements.length} distinct elements across the prototype.`,
      significance: 'Indicates multi-step user exploration rather than immediate bounce.',
    });
  }

  if (avgDuration > 0 && avgDuration < 15) {
    observedBehaviors.push({
      title: 'Rapid Drop-off / Brief Sessions',
      observation: `Average session duration is ${avgDuration}s (under 15s).`,
      significance: 'Visitors may be bouncing quickly or experiencing unclear initial messaging.',
    });
  } else if (avgDuration >= 30) {
    observedBehaviors.push({
      title: 'Deep Exploration',
      observation: `Average session duration is ${avgDuration}s (above 30s).`,
      significance: 'Visitors spend meaningful time engaging with page content and exploring flows.',
    });
  }

  // 4. Say-vs-Do Analysis Foundation
  const sayVsDoSignals: EvidencePack['sayVsDoSignals'] = [];

  // Check contradiction: High rating (>=4) but very short duration (<15s) and low actions
  if (averageRating !== null && averageRating >= 4 && avgDuration > 0 && avgDuration < 15 && actions < 10) {
    sayVsDoSignals.push({
      title: 'High Rating vs. Brief Session Dwell',
      statedFeedback: `Testers submitted high ratings (average ${averageRating}/5).`,
      observedBehavior: `Visitors spent an average of only ${avgDuration}s on the prototype and performed few interactions (${actions} total actions).`,
      interpretation: 'Potential Say-vs-Do Signal: High ratings may reflect surface-level approval or social politeness rather than deep adoption. The brief engagement suggests testers did not complete an in-depth workflow.',
      recommendation: 'Observe 2-3 testers in a live screen-share to verify whether they actually complete the core job-to-be-done.',
    });
  }

  // Check contradiction: Low rating (<=2.5) but high click volume or long duration
  if (averageRating !== null && averageRating <= 2.5 && actions >= 15) {
    sayVsDoSignals.push({
      title: 'Low Rating vs. High Engagement Volume',
      statedFeedback: `Testers gave critical ratings (average ${averageRating}/5).`,
      observedBehavior: `Visitors took ${actions} actions and spent considerable time trying to interact with the prototype.`,
      interpretation: 'Potential Say-vs-Do Signal: Testers demonstrated genuine interest by trying multiple buttons and flows, but encountered blocking friction or confusion.',
      recommendation: 'Inspect where testers got stuck (e.g. check the most-clicked elements) and remove confusing steps.',
    });
  }

  // 5. Possible Explanations & Recommended Actions
  const possibleExplanations: string[] = [];
  const recommendedActions: string[] = [];

  if (!isSufficient) {
    possibleExplanations.push(`The sample size (${visitors} visitor(s), ${actions} action(s)) is still too small to establish statistical significance.`);
    recommendedActions.push('Share your unique test link with 5 to 10 more prospective users before making major product decisions.');
  } else {
    if (averageRating && averageRating >= 4) {
      possibleExplanations.push('Initial qualitative signals suggest clarity in value proposition.');
      recommendedActions.push('Focus on validating willingness-to-pay or retention in a production MVP.');
    } else if (averageRating && averageRating < 3) {
      possibleExplanations.push('Testers appear to encounter friction or unclear instructions during initial usage.');
      recommendedActions.push('Refine confusing copy, simplify layout, and run another test round.');
    }
  }

  // 6. Evidence Limitations
  const evidenceLimitations: string[] = [
    `Sample size: ${visitors} visitor(s), ${actions} action(s), ${feedbackCount} feedback response(s).`,
    'Prototype telemetry tracks interactions and navigation, not purchasing intent or long-term retention.',
  ];
  if (!isSufficient) {
    evidenceLimitations.push('Minimum recommended testing threshold (5 visitors, 20 actions) has not been reached.');
  }

  // 7. Master Outcome Logic (Safe against weak evidence)
  let suggestedOutcome: EvidencePack['suggestedOutcome'] = 'TEST_AGAIN';
  let suggestedOutcomeReason = '';

  if (!isSufficient) {
    suggestedOutcome = 'TEST_AGAIN';
    suggestedOutcomeReason = `Insufficient evidence: Only ${visitors} visitor(s) and ${actions} action(s) tracked. More evidence is required before drawing dependable conclusions.`;
  } else if (averageRating !== null && averageRating < 2.5) {
    suggestedOutcome = 'IMPROVE';
    suggestedOutcomeReason = 'Testers experienced significant friction or difficulty. Address usability issues before investing further engineering time.';
  } else if (averageRating !== null && averageRating >= 3.8 && actions >= 30) {
    suggestedOutcome = 'BUILD';
    suggestedOutcomeReason = 'Initial evidence supports moving forward: High engagement duration and positive tester feedback observed across sample.';
  } else {
    suggestedOutcome = 'IMPROVE';
    suggestedOutcomeReason = 'Mixed signals: Interest observed, but optimization of core flows is recommended.';
  }

  return {
    experimentId: experiment.id,
    experimentName: experiment.name,
    productName: experiment.productName,
    hypothesis: experiment.keyHypothesis,
    problem: experiment.problem || 'No stated problem description.',
    learningGoal: experiment.learningGoal || 'Observe visitor reactions.',
    evidenceLevel,
    isSufficient,
    sampleSummary: {
      visitors,
      sessions: metrics.sessionsCount || 1,
      events: actions,
      feedbackCount,
      avgDurationSec: avgDuration,
    },
    measuredFacts,
    observedBehaviors,
    topClickedElements,
    funnelSteps,
    userFeedbackSummary: {
      averageRating,
      ratingCount,
      topics,
      quotes: quotes.slice(0, 8),
      founderObservationsCount,
      testerFeedbackCount,
    },
    sayVsDoSignals,
    possibleExplanations,
    recommendedActions,
    evidenceLimitations,
    suggestedOutcome,
    suggestedOutcomeReason,
  };
}
