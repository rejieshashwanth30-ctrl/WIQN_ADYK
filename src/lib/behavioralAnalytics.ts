/**
 * ADYK WIQN BEHAVIORAL ANALYTICS & EVENT EXPLORER ENGINE
 * 
 * Transforms raw telemetry events into structured, empirical behavioral evidence:
 * - Click distribution (Total clicks vs Unique visitors clicking vs Avg clicks/visitor)
 * - Visitor-level activity timelines and session-level journeys
 * - Observed user paths (without claiming causality)
 * - 5-step lightweight conversion funnel & drop-off analysis
 * - Scroll depth milestone distribution (25%, 50%, 75%, 100%)
 * - Strict separation: OBSERVATION vs INTERPRETATION vs CONCLUSION
 * - Structured evidence cards ("What we know", "What we don't know yet", "What to test next")
 * - 100% real-data grounded (Zero fake data, zero hallucinations)
 */

export interface RawEventRecord {
  id: string;
  experimentId: string;
  sessionId: string;
  visitorId: string;
  eventType: string;
  element?: string | null;
  elementText?: string | null;
  page: string;
  referrer?: string | null;
  timestamp: Date | string;
  metadata?: any;
}

export interface RawSessionRecord {
  id?: string;
  sessionId: string;
  experimentId?: string;
  visitorId: string;
  startedAt: Date | string;
  endedAt?: Date | string | null;
  durationSec?: number | null;
  referrer?: string | null;
  utmSource?: string | null;
}

export interface RawFeedbackRecord {
  id: string;
  experimentId?: string;
  visitorId?: string | null;
  prompt?: string;
  category?: string | null;
  rating?: number | null;
  comment?: string | null;
  createdAt: Date | string;
}

export interface RawVisitorRecord {
  id?: string;
  visitorId: string;
  experimentId?: string;
  firstSeenAt?: Date | string;
  lastSeenAt?: Date | string;
  deviceType?: string | null;
  browser?: string | null;
  os?: string | null;
  country?: string | null;
}

export interface ClickedElementMetric {
  key: string;
  label: string;
  element: string;
  totalClicks: number;
  uniqueVisitors: number;
  sessionsCount: number;
  avgClicksPerVisitor: number;
  percentage: number; // Share of all clicks
}

export interface FunnelStepMetric {
  stepIndex: number;
  name: string;
  description: string;
  count: number;
  overallPercentage: number;     // % of total visitors (Step 1)
  conversionFromPrev: number;    // % of previous step
  dropOffCount: number;
  dropOffPercentage: number;     // % dropped from previous step
}

export interface ObservedUserPath {
  pathSummary: string;
  steps: string[];
  sessionsCount: number;
  percentage: number;
  nature: 'OBSERVED_USER_PATH'; // Strictly not claiming causality
}

export interface VisitorActivityProfile {
  visitorId: string;
  displayLabel: string; // e.g. "Visitor #A82F"
  firstSeenAt: string;
  lastSeenAt: string;
  sessionsCount: number;
  actionsCount: number;
  pagesViewedCount: number;
  distinctPages: string[];
  hasFeedback: boolean;
  feedbackRating: number | null;
  feedbackComment: string | null;
  deviceType: string;
  browser: string;
  timeline: Array<{
    id: string;
    timestamp: string;
    eventType: string;
    displayType: string;
    label: string;
    page: string;
    metadata?: any;
  }>;
}

export interface SessionJourneyProfile {
  sessionId: string;
  displayLabel: string; // e.g. "Session #91F2"
  visitorId: string;
  visitorLabel: string;
  startedAt: string;
  endedAt: string | null;
  durationSec: number;
  actionsCount: number;
  pathSummary: string;
  steps: Array<{
    stepNumber: number;
    eventType: string;
    displayType: string;
    label: string;
    page: string;
    timestamp: string;
    durationFromStartSec: number;
  }>;
}

export interface BehavioralAnalyticsResult {
  // Volume Metrics
  metrics: {
    totalEvents: number;
    totalVisitors: number;
    totalSessions: number;
    totalClicks: number;
    totalFeedback: number;
    avgDurationSec: number;
    medianDurationSec: number;
    isSufficientEvidence: boolean;
  };

  // Click & Element Distribution
  clickDistribution: {
    totalClicks: number;
    uniqueClickers: number;
    elements: ClickedElementMetric[];
  };

  // Event Taxonomy Breakdown
  eventBreakdown: Record<string, number>;

  // 5-Step Lightweight Funnel
  funnel: {
    steps: FunnelStepMetric[];
    overallConversionRate: number;
    primaryDropOffStep: string | null;
  };

  // Observed User Paths
  observedPaths: ObservedUserPath[];

  // Visitor Profiles & Timelines
  visitors: VisitorActivityProfile[];

  // Session Journeys
  sessions: SessionJourneyProfile[];

  // Scroll Depth Distribution
  scrollDistribution: {
    reaching25: { count: number; percentage: number };
    reaching50: { count: number; percentage: number };
    reaching75: { count: number; percentage: number };
    reaching100: { count: number; percentage: number };
  };

  // Behavioral Signals (Observation vs Interpretation vs Conclusion)
  behavioralSignals: Array<{
    id: string;
    title: string;
    observation: string;
    interpretation: string;
    conclusion: string;
    significance: 'HIGH' | 'MODERATE' | 'LOW';
  }>;

  // Feedback + Behavior Alignment
  feedbackBehaviorAlignment: {
    hasFeedback: boolean;
    totalFeedbackCount: number;
    avgRating: number | null;
    alignmentSummary: string;
    items: Array<{
      comment: string;
      rating: number | null;
      visitorLabel: string;
      totalActionsByVisitor: number;
      topElementClicked: string | null;
    }>;
  };

  // Structured Evidence Cards
  evidenceCards: {
    whatUsersDid: { title: string; statement: string; details: string[] };
    whatUsersClicked: { title: string; statement: string; items: ClickedElementMetric[] };
    whereUsersDropped: { title: string; statement: string; dropOffs: string[] };
    whatUsersSaid: { title: string; statement: string; quotes: string[] };
    whatWeKnow: { title: string; facts: Array<{ title: string; statement: string; evidence: string; confidence: string; limitations: string }> };
    whatWeDontKnowYet: { title: string; uncertainties: string[] };
    whatToTestNext: { title: string; recommendations: string[] };
  };
}

/**
 * Derives a clean, human-readable display label for an interactive element.
 */
export function formatElementLabel(element?: string | null, elementText?: string | null): string {
  if (elementText && elementText.trim() && elementText.trim() !== '[REDACTED]') {
    const clean = elementText.trim();
    return clean.length > 50 ? clean.substring(0, 48) + '...' : clean;
  }

  if (!element || !element.trim()) return 'Interaction target';

  const raw = element.trim();

  // If contains data-wiqn-id="...", extract the ID
  const dataMatch = raw.match(/data-wiqn-id="([^"]+)"/i) || raw.match(/data-testid="([^"]+)"/i);
  if (dataMatch && dataMatch[1]) {
    return dataMatch[1].replace(/[-_]/g, ' ');
  }

  // If ID selector like button#join-community
  if (raw.includes('#')) {
    const idPart = raw.split('#')[1].split('.')[0].split('[')[0];
    if (idPart) return idPart.replace(/[-_]/g, ' ');
  }

  // If clean tag name
  if (raw === 'button' || raw.startsWith('button')) return 'Button click';
  if (raw === 'a' || raw.startsWith('a')) return 'Link click';
  if (raw.startsWith('form')) return 'Form submission';

  return raw;
}

/**
 * Derives a safe, short display label for a visitor ID (e.g. "Visitor #A82F")
 */
export function formatVisitorLabel(visitorId?: string | null): string {
  if (!visitorId) return 'Visitor #Anon';
  const clean = visitorId.replace(/^v_/, '').replace(/[^a-zA-Z0-9]/g, '');
  const suffix = clean.length >= 4 ? clean.slice(-4).toUpperCase() : clean.toUpperCase() || 'ANON';
  return `Visitor #${suffix}`;
}

/**
 * Derives a safe, short display label for a session ID (e.g. "Session #91F2")
 */
export function formatSessionLabel(sessionId?: string | null): string {
  if (!sessionId) return 'Session #Anon';
  const clean = sessionId.replace(/^s_/, '').replace(/[^a-zA-Z0-9]/g, '');
  const suffix = clean.length >= 4 ? clean.slice(-4).toUpperCase() : clean.toUpperCase() || 'ANON';
  return `Session #${suffix}`;
}

/**
 * Formats event type into a clean, human-readable badge label.
 */
export function formatEventType(type: string): string {
  const upper = (type || '').toUpperCase();
  switch (upper) {
    case 'PAGE_VIEW':
      return 'Page View';
    case 'CLICK':
      return 'Click';
    case 'SCROLL_DEPTH':
      return 'Scroll Depth';
    case 'FORM_START':
      return 'Form Started';
    case 'FORM_SUBMIT':
      return 'Form Submitted';
    case 'TIME_ON_PAGE':
      return 'Time on Page';
    case 'ENGAGEMENT_MILESTONE':
      return 'Engagement';
    case 'EXIT':
      return 'Session Exit';
    default:
      return upper.replace(/_/g, ' ');
  }
}

/**
 * Computes the complete behavioral analytics model from raw database records.
 */
export function computeBehavioralAnalytics(params: {
  events: RawEventRecord[];
  sessions: RawSessionRecord[];
  visitors?: RawVisitorRecord[];
  feedback?: RawFeedbackRecord[];
  experiment?: {
    name?: string;
    productName?: string;
    keyHypothesis?: string;
    learningGoal?: string;
  };
}): BehavioralAnalyticsResult {
  const { events = [], sessions = [], visitors = [], feedback = [], experiment } = params;

  // 1. Sort events chronologically (oldest first for journey construction)
  const sortedAscEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Set of all unique visitors & sessions seen in events + sessions
  const visitorIdSet = new Set<string>();
  const sessionIdSet = new Set<string>();

  events.forEach((e) => {
    if (e.visitorId) visitorIdSet.add(e.visitorId);
    if (e.sessionId) sessionIdSet.add(e.sessionId);
  });
  sessions.forEach((s) => {
    if (s.visitorId) visitorIdSet.add(s.visitorId);
    if (s.sessionId) sessionIdSet.add(s.sessionId);
  });

  const totalVisitors = Math.max(visitorIdSet.size, visitors.length);
  const totalSessions = Math.max(sessionIdSet.size, sessions.length);
  const totalEvents = events.length;

  // 2. Event breakdown by type
  const eventBreakdown: Record<string, number> = {};
  events.forEach((e) => {
    const t = e.eventType;
    eventBreakdown[t] = (eventBreakdown[t] || 0) + 1;
  });

  // 3. Click distribution & Most Interacted Elements
  const clickEvents = events.filter((e) => e.eventType === 'CLICK');
  const totalClicks = clickEvents.length;
  const clickersSet = new Set<string>();
  const elementMap = new Map<string, {
    key: string;
    label: string;
    element: string;
    totalClicks: number;
    visitors: Set<string>;
    sessions: Set<string>;
  }>();

  clickEvents.forEach((ev) => {
    if (ev.visitorId) clickersSet.add(ev.visitorId);
    const label = formatElementLabel(ev.element, ev.elementText);
    const selector = ev.element || 'button';
    const key = `${selector}:::${label}`;

    if (!elementMap.has(key)) {
      elementMap.set(key, {
        key,
        label,
        element: selector,
        totalClicks: 0,
        visitors: new Set<string>(),
        sessions: new Set<string>(),
      });
    }

    const item = elementMap.get(key)!;
    item.totalClicks++;
    if (ev.visitorId) item.visitors.add(ev.visitorId);
    if (ev.sessionId) item.sessions.add(ev.sessionId);
  });

  const elementsMetric: ClickedElementMetric[] = Array.from(elementMap.values())
    .map((item) => {
      const uCount = item.visitors.size;
      return {
        key: item.key,
        label: item.label,
        element: item.element,
        totalClicks: item.totalClicks,
        uniqueVisitors: uCount,
        sessionsCount: item.sessions.size,
        avgClicksPerVisitor: uCount > 0 ? Math.round((item.totalClicks / uCount) * 10) / 10 : item.totalClicks,
        percentage: totalClicks > 0 ? Math.round((item.totalClicks / totalClicks) * 1000) / 10 : 0,
      };
    })
    .sort((a, b) => b.totalClicks - a.totalClicks);

  // 4. Session durations (Average & Median)
  const durations: number[] = [];
  sessions.forEach((s) => {
    let dur = s.durationSec;
    if ((!dur || dur <= 0) && s.endedAt && s.startedAt) {
      dur = Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000);
    }
    if (dur && dur > 0) durations.push(dur);
  });

  // Also harvest from TIME_ON_PAGE metadata if sessions didn't report durationSec
  events.forEach((e) => {
    if (e.eventType === 'TIME_ON_PAGE' && e.metadata && typeof e.metadata.durationSeconds === 'number') {
      durations.push(e.metadata.durationSeconds);
    }
  });

  durations.sort((a, b) => a - b);
  const avgDurationSec = durations.length > 0
    ? Math.round(durations.reduce((acc, v) => acc + v, 0) / durations.length)
    : 0;
  const medianDurationSec = durations.length > 0
    ? durations[Math.floor(durations.length / 2)]
    : 0;

  // 5. Scroll depth milestone distribution
  const scroll25Visitors = new Set<string>();
  const scroll50Visitors = new Set<string>();
  const scroll75Visitors = new Set<string>();
  const scroll100Visitors = new Set<string>();

  events.forEach((ev) => {
    if (ev.eventType === 'SCROLL_DEPTH') {
      const depth = ev.metadata?.scrollDepth || (ev.elementText?.includes('100%') ? 100 : ev.elementText?.includes('75%') ? 75 : ev.elementText?.includes('50%') ? 50 : 25);
      if (depth >= 25 && ev.visitorId) scroll25Visitors.add(ev.visitorId);
      if (depth >= 50 && ev.visitorId) scroll50Visitors.add(ev.visitorId);
      if (depth >= 75 && ev.visitorId) scroll75Visitors.add(ev.visitorId);
      if (depth >= 100 && ev.visitorId) scroll100Visitors.add(ev.visitorId);
    }
  });

  const scrollDistribution = {
    reaching25: {
      count: scroll25Visitors.size,
      percentage: totalVisitors > 0 ? Math.round((scroll25Visitors.size / totalVisitors) * 100) : 0,
    },
    reaching50: {
      count: scroll50Visitors.size,
      percentage: totalVisitors > 0 ? Math.round((scroll50Visitors.size / totalVisitors) * 100) : 0,
    },
    reaching75: {
      count: scroll75Visitors.size,
      percentage: totalVisitors > 0 ? Math.round((scroll75Visitors.size / totalVisitors) * 100) : 0,
    },
    reaching100: {
      count: scroll100Visitors.size,
      percentage: totalVisitors > 0 ? Math.round((scroll100Visitors.size / totalVisitors) * 100) : 0,
    },
  };

  // 6. 5-Step Lightweight Funnel
  // Step 1: Visitors
  // Step 2: Interacted with CTA / Element
  // Step 3: Form Started
  // Step 4: Form Submitted
  // Step 5: Completed Goal / Feedback
  const formStartVisitors = new Set<string>();
  const formSubmitVisitors = new Set<string>();
  const feedbackVisitors = new Set<string>();

  events.forEach((ev) => {
    if (ev.visitorId) {
      if (ev.eventType === 'FORM_START') formStartVisitors.add(ev.visitorId);
      if (ev.eventType === 'FORM_SUBMIT') formSubmitVisitors.add(ev.visitorId);
    }
  });

  feedback.forEach((fb) => {
    if (fb.visitorId) feedbackVisitors.add(fb.visitorId);
  });

  const step1Count = totalVisitors;
  const step2Count = clickersSet.size;
  const step3Count = formStartVisitors.size;
  const step4Count = formSubmitVisitors.size;
  const step5Count = Math.max(feedbackVisitors.size, feedback.length > 0 ? 1 : 0);

  const rawSteps = [
    { name: '1. Prototype Visitors', desc: 'Opened the experiment link', count: step1Count },
    { name: '2. CTA / Click Interaction', desc: 'Clicked on at least one button or link', count: step2Count },
    { name: '3. Form Started', desc: 'Focused an input field to start completing a form', count: step3Count },
    { name: '4. Form Submitted', desc: 'Triggered form submission on the prototype', count: step4Count },
    { name: '5. Feedback / Goal Completion', desc: 'Submitted tester feedback or completed goal', count: step5Count },
  ];

  let primaryDropOffStep: string | null = null;
  let maxDropOffCount = -1;

  const funnelSteps: FunnelStepMetric[] = rawSteps.map((s, idx) => {
    const prevCount = idx === 0 ? s.count : rawSteps[idx - 1].count;
    const overallPct = step1Count > 0 ? Math.round((s.count / step1Count) * 1000) / 10 : 0;
    const convFromPrev = prevCount > 0 ? Math.round((s.count / prevCount) * 1000) / 10 : 0;
    const dropOff = Math.max(0, prevCount - s.count);
    const dropOffPct = prevCount > 0 ? Math.round((dropOff / prevCount) * 1000) / 10 : 0;

    if (idx > 0 && dropOff > maxDropOffCount && dropOff > 0) {
      maxDropOffCount = dropOff;
      primaryDropOffStep = s.name;
    }

    return {
      stepIndex: idx + 1,
      name: s.name,
      description: s.desc,
      count: s.count,
      overallPercentage: overallPct,
      conversionFromPrev: convFromPrev,
      dropOffCount: dropOff,
      dropOffPercentage: dropOffPct,
    };
  });

  const overallConversionRate = step1Count > 0
    ? Math.round((step5Count / step1Count) * 1000) / 10
    : 0;

  // 7. Visitor Profiles & Timelines
  const visitorProfilesMap = new Map<string, VisitorActivityProfile>();

  // Initialize from known visitors
  visitors.forEach((v) => {
    visitorProfilesMap.set(v.visitorId, {
      visitorId: v.visitorId,
      displayLabel: formatVisitorLabel(v.visitorId),
      firstSeenAt: v.firstSeenAt ? new Date(v.firstSeenAt).toISOString() : new Date().toISOString(),
      lastSeenAt: v.lastSeenAt ? new Date(v.lastSeenAt).toISOString() : new Date().toISOString(),
      sessionsCount: 0,
      actionsCount: 0,
      pagesViewedCount: 0,
      distinctPages: [],
      hasFeedback: false,
      feedbackRating: null,
      feedbackComment: null,
      deviceType: v.deviceType || 'unknown',
      browser: v.browser || 'unknown',
      timeline: [],
    });
  });

  // Link feedback to visitors
  feedback.forEach((fb) => {
    const vId = fb.visitorId || 'anon';
    if (visitorProfilesMap.has(vId)) {
      const p = visitorProfilesMap.get(vId)!;
      p.hasFeedback = true;
      p.feedbackRating = fb.rating ?? null;
      p.feedbackComment = fb.comment ?? null;
    }
  });

  // Group events by visitor
  const visitorPagesMap = new Map<string, Set<string>>();
  const visitorSessionsMap = new Map<string, Set<string>>();

  sortedAscEvents.forEach((ev) => {
    const vId = ev.visitorId;
    if (!vId) return;

    if (!visitorProfilesMap.has(vId)) {
      visitorProfilesMap.set(vId, {
        visitorId: vId,
        displayLabel: formatVisitorLabel(vId),
        firstSeenAt: new Date(ev.timestamp).toISOString(),
        lastSeenAt: new Date(ev.timestamp).toISOString(),
        sessionsCount: 0,
        actionsCount: 0,
        pagesViewedCount: 0,
        distinctPages: [],
        hasFeedback: false,
        feedbackRating: null,
        feedbackComment: null,
        deviceType: ev.metadata?.device?.width && ev.metadata.device.width < 768 ? 'mobile' : 'desktop',
        browser: ev.metadata?.device?.userAgent ? ev.metadata.device.userAgent.slice(0, 40) : 'unknown',
        timeline: [],
      });
    }

    const p = visitorProfilesMap.get(vId)!;
    p.actionsCount++;
    p.lastSeenAt = new Date(ev.timestamp).toISOString();

    if (!visitorPagesMap.has(vId)) visitorPagesMap.set(vId, new Set<string>());
    visitorPagesMap.get(vId)!.add(ev.page || '/');

    if (ev.sessionId) {
      if (!visitorSessionsMap.has(vId)) visitorSessionsMap.set(vId, new Set<string>());
      visitorSessionsMap.get(vId)!.add(ev.sessionId);
    }

    p.timeline.push({
      id: ev.id,
      timestamp: new Date(ev.timestamp).toISOString(),
      eventType: ev.eventType,
      displayType: formatEventType(ev.eventType),
      label: ev.eventType === 'CLICK' ? formatElementLabel(ev.element, ev.elementText) : (ev.elementText || ev.page || 'Action'),
      page: ev.page || '/',
      metadata: ev.metadata || undefined,
    });
  });

  visitorProfilesMap.forEach((p, vId) => {
    if (visitorPagesMap.has(vId)) {
      const pages = Array.from(visitorPagesMap.get(vId)!);
      p.distinctPages = pages;
      p.pagesViewedCount = pages.length;
    }
    if (visitorSessionsMap.has(vId)) {
      p.sessionsCount = visitorSessionsMap.get(vId)!.size;
    } else {
      p.sessionsCount = Math.max(1, p.sessionsCount);
    }
  });

  const visitorList = Array.from(visitorProfilesMap.values()).sort(
    (a, b) => b.actionsCount - a.actionsCount
  );

  // 8. Session Journeys & Observed Paths
  const sessionEventsMap = new Map<string, RawEventRecord[]>();
  sortedAscEvents.forEach((ev) => {
    if (!ev.sessionId) return;
    if (!sessionEventsMap.has(ev.sessionId)) sessionEventsMap.set(ev.sessionId, []);
    sessionEventsMap.get(ev.sessionId)!.push(ev);
  });

  const sessionJourneys: SessionJourneyProfile[] = [];
  const pathFrequencyMap = new Map<string, { summary: string; steps: string[]; count: number }>();

  sessionEventsMap.forEach((evList, sId) => {
    if (evList.length === 0) return;
    const vId = evList[0].visitorId;
    const firstTime = new Date(evList[0].timestamp).getTime();
    const lastTime = new Date(evList[evList.length - 1].timestamp).getTime();
    const durationSec = Math.max(1, Math.round((lastTime - firstTime) / 1000));

    // Construct path summary (key pages and clicks)
    const journeyKeySteps: string[] = [];
    evList.forEach((ev) => {
      if (ev.eventType === 'PAGE_VIEW') {
        const cleanP = ev.page === '/' ? 'Landing' : ev.page.replace(/^\//, '');
        if (journeyKeySteps.length === 0 || journeyKeySteps[journeyKeySteps.length - 1] !== cleanP) {
          journeyKeySteps.push(cleanP);
        }
      } else if (ev.eventType === 'CLICK') {
        const lbl = formatElementLabel(ev.element, ev.elementText);
        if (journeyKeySteps.length === 0 || journeyKeySteps[journeyKeySteps.length - 1] !== lbl) {
          journeyKeySteps.push(lbl);
        }
      } else if (ev.eventType === 'FORM_SUBMIT') {
        journeyKeySteps.push('Submit Form');
      }
    });

    const pathSummary = journeyKeySteps.length > 0 ? journeyKeySteps.join(' → ') : 'Landing';

    // Track path frequency
    if (!pathFrequencyMap.has(pathSummary)) {
      pathFrequencyMap.set(pathSummary, {
        summary: pathSummary,
        steps: journeyKeySteps,
        count: 0,
      });
    }
    pathFrequencyMap.get(pathSummary)!.count++;

    const steps = evList.map((ev, idx) => {
      const stepTime = new Date(ev.timestamp).getTime();
      return {
        stepNumber: idx + 1,
        eventType: ev.eventType,
        displayType: formatEventType(ev.eventType),
        label: ev.eventType === 'CLICK' ? formatElementLabel(ev.element, ev.elementText) : (ev.elementText || ev.page),
        page: ev.page || '/',
        timestamp: new Date(ev.timestamp).toISOString(),
        durationFromStartSec: Math.max(0, Math.round((stepTime - firstTime) / 1000)),
      };
    });

    sessionJourneys.push({
      sessionId: sId,
      displayLabel: formatSessionLabel(sId),
      visitorId: vId,
      visitorLabel: formatVisitorLabel(vId),
      startedAt: new Date(firstTime).toISOString(),
      endedAt: new Date(lastTime).toISOString(),
      durationSec,
      actionsCount: evList.length,
      pathSummary,
      steps,
    });
  });

  const observedPaths: ObservedUserPath[] = Array.from(pathFrequencyMap.values())
    .map((item) => ({
      pathSummary: item.summary,
      steps: item.steps,
      sessionsCount: item.count,
      percentage: totalSessions > 0 ? Math.round((item.count / totalSessions) * 1000) / 10 : 0,
      nature: 'OBSERVED_USER_PATH' as const,
    }))
    .sort((a, b) => b.sessionsCount - a.sessionsCount);

  // 9. Behavioral Signals (Observation vs Interpretation vs Conclusion)
  const isSufficientEvidence = totalVisitors >= 5 && totalEvents >= 20;
  const behavioralSignals: BehavioralAnalyticsResult['behavioralSignals'] = [];

  // Signal 1: Primary Element Interaction
  if (elementsMetric.length > 0) {
    const topEl = elementsMetric[0];
    behavioralSignals.push({
      id: 'sig_top_element',
      title: 'Element Interaction Focus',
      observation: `${topEl.uniqueVisitors} out of ${totalVisitors} visitors clicked on "${topEl.label}" for a total of ${topEl.totalClicks} interaction(s).`,
      interpretation: `The element attracted prominent attention compared to other areas of the prototype.`,
      conclusion: isSufficientEvidence
        ? `Sustained engagement on "${topEl.label}" suggests relevance to the user's journey.`
        : `Early interaction indicator. Does not establish product demand or willingness to commit without larger sample size.`,
      significance: topEl.totalClicks >= 5 ? 'HIGH' : 'MODERATE',
    });
  }

  // Signal 2: Drop-Off Friction Signal
  if (primaryDropOffStep && maxDropOffCount > 0) {
    behavioralSignals.push({
      id: 'sig_funnel_drop',
      title: 'Observed Funnel Drop-off',
      observation: `${maxDropOffCount} visitor(s) dropped off prior to completing ${primaryDropOffStep}.`,
      interpretation: `Users navigated to the preceding step but did not proceed through the next action.`,
      conclusion: `The available telemetry indicates where users stopped, but does not establish why. Qualitative feedback or targeted usability tests are required.`,
      significance: 'HIGH',
    });
  }

  // Signal 3: Session Duration / Engagement
  if (avgDurationSec > 0) {
    behavioralSignals.push({
      id: 'sig_duration',
      title: 'Time on Prototype',
      observation: `Average session duration was ${avgDurationSec} seconds (median: ${medianDurationSec}s).`,
      interpretation: `Visitors spent time browsing or inspecting prototype elements.`,
      conclusion: `Duration indicates active or open browser presence; does not inherently indicate comprehension or satisfaction.`,
      significance: avgDurationSec >= 30 ? 'MODERATE' : 'LOW',
    });
  }

  // Signal 4: Repeated Clicks
  const repeatedElements = elementsMetric.filter((el) => el.avgClicksPerVisitor > 1.5);
  if (repeatedElements.length > 0) {
    const rep = repeatedElements[0];
    behavioralSignals.push({
      id: 'sig_repeated_clicks',
      title: 'Repeated Interaction Pattern',
      observation: `Visitors clicked "${rep.label}" an average of ${rep.avgClicksPerVisitor} times per clicking visitor.`,
      interpretation: `Repeated clicks may indicate persistent interest, an exploration loop, or potential UI response friction.`,
      conclusion: `Observe whether the prototype provides clear visual feedback upon clicking.`,
      significance: 'MODERATE',
    });
  }

  // 10. Feedback + Behavior Alignment
  const ratings = feedback.map((f) => f.rating).filter((r): r is number => typeof r === 'number');
  const avgRating = ratings.length > 0
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;

  const feedbackItems = feedback.map((f) => {
    const vId = f.visitorId;
    const vProfile = vId ? visitorProfilesMap.get(vId) : null;
    let topElem: string | null = null;
    if (vProfile && vProfile.timeline.length > 0) {
      const clicks = vProfile.timeline.filter((t) => t.eventType === 'CLICK');
      if (clicks.length > 0) topElem = clicks[0].label;
    }

    return {
      comment: f.comment || 'Feedback submitted without comment',
      rating: f.rating ?? null,
      visitorLabel: formatVisitorLabel(f.visitorId),
      totalActionsByVisitor: vProfile ? vProfile.actionsCount : 0,
      topElementClicked: topElem,
    };
  });

  let alignmentSummary = 'No feedback submitted yet.';
  if (feedback.length > 0) {
    if (totalClicks > 0 && avgRating && avgRating >= 4) {
      alignmentSummary = 'Visitors actively engaged with interactive elements and provided favorable qualitative ratings.';
    } else if (totalClicks > 0 && avgRating && avgRating <= 2.5) {
      alignmentSummary = 'Behavioral interaction volume is present, but qualitative ratings suggest usability or expectation friction.';
    } else {
      alignmentSummary = `${feedback.length} feedback note(s) logged alongside ${totalClicks} recorded click interaction(s).`;
    }
  }

  // 11. Structured Evidence Cards
  const topClickLabel = elementsMetric.length > 0 ? elementsMetric[0].label : 'elements';
  const whatUsersDid = {
    title: 'WHAT USERS DID',
    statement: `${totalVisitors} visitor(s) generated ${totalEvents} tracked action(s) across ${totalSessions} session(s).`,
    details: [
      `${totalClicks} interactive click(s) recorded`,
      `${eventBreakdown['PAGE_VIEW'] || 0} page view(s)`,
      `${eventBreakdown['FORM_SUBMIT'] || 0} form submission(s)`,
      `${feedback.length} qualitative feedback note(s)`,
    ],
  };

  const whatUsersClicked = {
    title: 'WHAT USERS CLICKED',
    statement: elementsMetric.length > 0
      ? `Visitors focused primarily on "${topClickLabel}" (${elementsMetric[0].totalClicks} clicks from ${elementsMetric[0].uniqueVisitors} visitor(s)).`
      : 'No interactive button or link clicks recorded yet.',
    items: elementsMetric.slice(0, 5),
  };

  const whereUsersDropped = {
    title: 'WHERE USERS DROPPED',
    statement: primaryDropOffStep
      ? `The primary drop-off occurred before ${primaryDropOffStep} (${maxDropOffCount} visitor drop-off).`
      : 'No noticeable drop-off detected in the initial interaction funnel.',
    dropOffs: funnelSteps
      .filter((s) => s.dropOffCount > 0)
      .map((s) => `${s.dropOffCount} visitor(s) dropped before reaching ${s.name} (${s.dropOffPercentage}% drop-off)`),
  };

  const whatUsersSaid = {
    title: 'WHAT USERS SAID',
    statement: feedback.length > 0
      ? `${feedback.length} feedback response(s) logged with an average rating of ${avgRating || 'N/A'}/5.`
      : 'No qualitative feedback submitted yet.',
    quotes: feedback.map((f) => f.comment).filter((c): c is string => Boolean(c && c.trim())),
  };

  const whatWeKnow = {
    title: 'WHAT WE KNOW SO FAR',
    facts: [
      {
        title: 'Interaction Volume',
        statement: `${totalVisitors} visitor(s) produced ${totalEvents} observable actions.`,
        evidence: `Directly measured by autocapture telemetry across ${totalSessions} sessions.`,
        confidence: isSufficientEvidence ? 'HIGH' : 'LOW',
        limitations: isSufficientEvidence
          ? 'Measures actions taken, not long-term retention.'
          : `Sample size (${totalVisitors} visitors, ${totalEvents} actions) is below the minimum threshold (5 visitors, 20 actions).`,
      },
      ...(elementsMetric.length > 0 ? [{
        title: 'Primary Interaction Target',
        statement: `"${elementsMetric[0].label}" was the most clicked element (${elementsMetric[0].totalClicks} clicks).`,
        evidence: `Measured from real click events (${elementsMetric[0].uniqueVisitors} distinct visitors).`,
        confidence: isSufficientEvidence ? 'HIGH' : 'MODERATE',
        limitations: 'A click shows curiosity or attention; does not guarantee willingness to purchase.',
      }] : []),
    ],
  };

  const whatWeDontKnowYet = {
    title: "WHAT WE DON'T KNOW YET",
    uncertainties: [
      `We do not yet know whether visitors would return for repeat usage.`,
      ...(primaryDropOffStep ? [`We do not know the exact reason why visitors dropped off before ${primaryDropOffStep}.`] : []),
      ...(!isSufficientEvidence ? [`We do not have a statistically meaningful sample to conclude product-market fit (current: ${totalVisitors}/5 visitors, ${totalEvents}/20 actions).`] : []),
      `We do not yet know if prototype feedback reflects the wider target audience.`,
    ],
  };

  const whatToTestNext = {
    title: 'WHAT TO TEST NEXT',
    recommendations: [
      ...(!isSufficientEvidence ? ['Invite 5–10 additional testers from different devices/networks to reach empirical threshold.'] : []),
      ...(elementsMetric.length > 0 ? [`Measure whether users who click "${elementsMetric[0].label}" successfully reach the next milestone.`] : []),
      ...(primaryDropOffStep ? [`Ask testers specifically what hesitated them prior to ${primaryDropOffStep}.`] : []),
      'Test a clearer value proposition or simplified primary call-to-action.',
    ],
  };

  return {
    metrics: {
      totalEvents,
      totalVisitors,
      totalSessions,
      totalClicks,
      totalFeedback: feedback.length,
      avgDurationSec,
      medianDurationSec,
      isSufficientEvidence,
    },
    clickDistribution: {
      totalClicks,
      uniqueClickers: clickersSet.size,
      elements: elementsMetric,
    },
    eventBreakdown,
    funnel: {
      steps: funnelSteps,
      overallConversionRate,
      primaryDropOffStep,
    },
    observedPaths,
    visitors: visitorList,
    sessions: sessionJourneys,
    scrollDistribution,
    behavioralSignals,
    feedbackBehaviorAlignment: {
      hasFeedback: feedback.length > 0,
      totalFeedbackCount: feedback.length,
      avgRating,
      alignmentSummary,
      items: feedbackItems,
    },
    evidenceCards: {
      whatUsersDid,
      whatUsersClicked,
      whereUsersDropped,
      whatUsersSaid,
      whatWeKnow,
      whatWeDontKnowYet,
      whatToTestNext,
    },
  };
}
