'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  MousePointer,
  Compass,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  ArrowDown,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  X,
  FileText,
  Eye,
  RefreshCw,
  BarChart2,
  GitCommit,
  Share2,
} from 'lucide-react';
import { BehavioralAnalyticsResult, ClickedElementMetric, computeBehavioralAnalytics } from '@/lib/behavioralAnalytics';
import { authenticatedFetch } from '@/lib/api-client';

interface BehavioralAnalyticsViewProps {
  experimentId: string;
  behavioral?: BehavioralAnalyticsResult;
  initialEvents?: any[];
  metrics?: {
    visitorsCount: number;
    sessionsCount: number;
    interactionsCount: number;
    feedbackCount: number;
    avgTimeOnPrototype: number;
  };
  onRefresh?: () => void;
}

export function BehavioralAnalyticsView({
  experimentId,
  behavioral,
  initialEvents = [],
  metrics,
  onRefresh,
}: BehavioralAnalyticsViewProps) {
  // Navigation sub-tab
  const [subTab, setSubTab] = useState<'overview' | 'explorer' | 'journeys' | 'visitors'>('overview');

  // Event Explorer filter & pagination state
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'clicks' | 'pages' | 'forms' | 'scroll' | 'sessions'>('all');
  const [visitorFilter, setVisitorFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(25);

  const [explorerEvents, setExplorerEvents] = useState<any[]>(initialEvents);
  const [paginationInfo, setPaginationInfo] = useState<{
    page: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>({
    page: 1,
    totalPages: Math.max(1, Math.ceil((initialEvents.length || 0) / 25)),
    totalCount: initialEvents.length,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Expanded dimension in 7 Evidence Dimensions to prevent wall-of-text
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  // Modals / Detail drawers
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [inspectedVisitor, setInspectedVisitor] = useState<any | null>(null);

  // Fetch paginated events from dedicated API
  const fetchEvents = async (newPage: number, newCat: string, newVid: string) => {
    try {
      setLoadingEvents(true);
      const params = new URLSearchParams({
        page: newPage.toString(),
        limit: limit.toString(),
        filter: newCat,
      });
      if (newVid && newVid !== 'all') {
        params.append('visitorId', newVid);
      }

      const res = await authenticatedFetch(`/api/experiments/${experimentId}/events?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setExplorerEvents(json.data.events || []);
          setPaginationInfo(json.data.pagination || {
            page: newPage,
            totalPages: 1,
            totalCount: json.data.events?.length || 0,
            hasNextPage: false,
            hasPrevPage: false,
          });
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch paginated events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (subTab === 'explorer') {
      fetchEvents(page, categoryFilter, visitorFilter);
    }
  }, [subTab, categoryFilter, visitorFilter, page, experimentId]);

  const effectiveBehavioral = behavioral || computeBehavioralAnalytics({
    events: initialEvents || [],
    sessions: [],
    visitors: [],
    feedback: [],
    experiment: {},
  });

  const {
    metrics: bMetrics,
    clickDistribution,
    funnel,
    observedPaths,
    visitors = [],
    sessions = [],
    scrollDistribution,
    behavioralSignals = [],
    evidenceCards,
  } = effectiveBehavioral;

  // Build Chronological User Activity Timeline from real events (Part 8 #1)
  const timelineBuckets = useMemo(() => {
    const rawEvents = initialEvents && initialEvents.length > 0 ? initialEvents : explorerEvents;
    if (!rawEvents || rawEvents.length === 0) return [];

    // Sort chronological ascending
    const sorted = [...rawEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const count = sorted.length;
    const bucketCount = Math.min(6, Math.max(1, count));
    const bucketSize = Math.max(1, Math.ceil(count / bucketCount));

    const buckets: Array<{
      id: number;
      timeLabel: string;
      views: number;
      clicks: number;
      forms: number;
      feedback: number;
      total: number;
    }> = [];

    for (let i = 0; i < sorted.length; i += bucketSize) {
      const slice = sorted.slice(i, i + bucketSize);
      if (slice.length === 0) continue;

      let views = 0;
      let clicks = 0;
      let forms = 0;
      let feedback = 0;

      slice.forEach((ev) => {
        const upper = (ev.eventType || '').toUpperCase();
        if (upper.includes('PAGE') || upper.includes('VIEW')) views++;
        else if (upper.includes('CLICK') || upper.includes('TAP') || upper.includes('BUTTON')) clicks++;
        else if (upper.includes('FORM')) forms++;
        else if (upper.includes('FEEDBACK')) feedback++;
        else views++; // default to general interaction
      });

      const firstTime = new Date(slice[0].timestamp);
      const timeStr = firstTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      buckets.push({
        id: buckets.length + 1,
        timeLabel: timeStr,
        views,
        clicks,
        forms,
        feedback,
        total: slice.length,
      });
    }

    return buckets;
  }, [initialEvents, explorerEvents]);

  // Max events in any bucket for chart scaling
  const maxBucketCount = useMemo(() => {
    if (timelineBuckets.length === 0) return 1;
    return Math.max(...timelineBuckets.map((b) => b.total), 1);
  }, [timelineBuckets]);

  // Visual Funnel stages (Part 8 #3)
  const funnelStages = useMemo(() => {
    const vCount = bMetrics.totalVisitors || 0;
    const viewCount = bMetrics.totalVisitors || 0; // Each visitor viewed prototype
    const clickCount = clickDistribution.uniqueClickers || 0;
    const formStartCount = funnel.steps?.[2]?.count || 0;
    const feedbackCount = bMetrics.totalFeedback || 0;

    return [
      {
        step: 1,
        title: 'Visitors',
        count: vCount,
        percentage: vCount > 0 ? 100 : 0,
        dropOff: 0,
        dropOffPct: 0,
        hasData: vCount > 0,
      },
      {
        step: 2,
        title: 'Prototype Viewed',
        count: viewCount,
        percentage: vCount > 0 ? Math.round((viewCount / vCount) * 100) : 0,
        dropOff: 0,
        dropOffPct: 0,
        hasData: viewCount > 0,
      },
      {
        step: 3,
        title: 'Interaction (Clicks)',
        count: clickCount,
        percentage: vCount > 0 ? Math.round((clickCount / vCount) * 100) : 0,
        dropOff: Math.max(0, viewCount - clickCount),
        dropOffPct: viewCount > 0 ? Math.round(((viewCount - clickCount) / viewCount) * 100) : 0,
        hasData: clickCount > 0,
      },
      {
        step: 4,
        title: 'Form Started',
        count: formStartCount,
        percentage: vCount > 0 ? Math.round((formStartCount / vCount) * 100) : 0,
        dropOff: Math.max(0, clickCount - formStartCount),
        dropOffPct: clickCount > 0 ? Math.round(((clickCount - formStartCount) / clickCount) * 100) : 0,
        hasData: formStartCount > 0,
      },
      {
        step: 5,
        title: 'Feedback Submitted',
        count: feedbackCount,
        percentage: vCount > 0 ? Math.round((feedbackCount / vCount) * 100) : 0,
        dropOff: Math.max(0, (formStartCount > 0 ? formStartCount : clickCount) - feedbackCount),
        dropOffPct: (formStartCount > 0 ? formStartCount : clickCount) > 0
          ? Math.round((((formStartCount > 0 ? formStartCount : clickCount) - feedbackCount) / (formStartCount > 0 ? formStartCount : clickCount)) * 100)
          : 0,
        hasData: feedbackCount > 0,
      },
    ];
  }, [bMetrics, clickDistribution, funnel]);

  const toggleDimension = (key: string) => {
    setExpandedDimension((prev) => (prev === key ? null : key));
  };

  // Helper for confidence badge styling
  const renderConfidenceBadge = (confidence: string, rationale?: string) => {
    const cUpper = (confidence || 'EARLY').toUpperCase();
    let badgeClass = 'exp-evidence-badge early';
    if (cUpper === 'HIGH') badgeClass = 'exp-evidence-badge high';
    else if (cUpper === 'MODERATE') badgeClass = 'exp-evidence-badge moderate';
    else if (cUpper === 'INSUFFICIENT') badgeClass = 'exp-evidence-badge insufficient';

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span className={badgeClass}>{cUpper}</span>
        {rationale && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
            {rationale}
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sub-navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #e4e4e7',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSubTab('overview')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '4px',
              border: subTab === 'overview' ? '1px solid #09090b' : '1px solid #e4e4e7',
              backgroundColor: subTab === 'overview' ? '#09090b' : '#ffffff',
              color: subTab === 'overview' ? '#ffffff' : '#52525b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              minHeight: '38px',
              transition: 'all 160ms ease',
            }}
          >
            <Activity size={14} />
            <span>Behavior Overview</span>
          </button>

          <button
            onClick={() => setSubTab('explorer')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '4px',
              border: subTab === 'explorer' ? '1px solid #09090b' : '1px solid #e4e4e7',
              backgroundColor: subTab === 'explorer' ? '#09090b' : '#ffffff',
              color: subTab === 'explorer' ? '#ffffff' : '#52525b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              minHeight: '38px',
              transition: 'all 160ms ease',
            }}
          >
            <MousePointer size={14} />
            <span>Event Explorer ({bMetrics.totalEvents})</span>
          </button>

          <button
            onClick={() => setSubTab('journeys')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '4px',
              border: subTab === 'journeys' ? '1px solid #09090b' : '1px solid #e4e4e7',
              backgroundColor: subTab === 'journeys' ? '#09090b' : '#ffffff',
              color: subTab === 'journeys' ? '#ffffff' : '#52525b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              minHeight: '38px',
              transition: 'all 160ms ease',
            }}
          >
            <Compass size={14} />
            <span>Journeys &amp; Funnel</span>
          </button>

          <button
            onClick={() => setSubTab('visitors')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '4px',
              border: subTab === 'visitors' ? '1px solid #09090b' : '1px solid #e4e4e7',
              backgroundColor: subTab === 'visitors' ? '#09090b' : '#ffffff',
              color: subTab === 'visitors' ? '#ffffff' : '#52525b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              minHeight: '38px',
              transition: 'all 160ms ease',
            }}
          >
            <User size={14} />
            <span>Visitor Profiles ({visitors.length})</span>
          </button>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="exp-btn-secondary"
            style={{ fontSize: '0.6875rem', padding: '6px 12px', minHeight: '36px' }}
          >
            <RefreshCw size={12} />
            <span>Refresh Telemetry</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: BEHAVIOR OVERVIEW & SIGNALS */}
      {/* ======================================================== */}
      {subTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* PART 7: COMPACT KPI ROW (Number -> Short label -> One-line explanation) */}
          <div className="exp-kpi-grid">
            {/* 1. Unique Visitors */}
            <div className="exp-kpi-card">
              <div className="exp-kpi-number">{bMetrics.totalVisitors}</div>
              <div className="exp-kpi-label">Unique Visitors</div>
              <div className="exp-kpi-explanation">Individual device sessions</div>
            </div>

            {/* 2. Actions Tracked */}
            <div className="exp-kpi-card">
              <div className="exp-kpi-number">{bMetrics.totalEvents}</div>
              <div className="exp-kpi-label">Actions Tracked</div>
              <div className="exp-kpi-explanation">Observable behavioral events</div>
            </div>

            {/* 3. Total Clicks */}
            <div className="exp-kpi-card">
              <div className="exp-kpi-number">{clickDistribution.totalClicks}</div>
              <div className="exp-kpi-label">Total Clicks</div>
              <div className="exp-kpi-explanation">
                From {clickDistribution.uniqueClickers} distinct visitor{clickDistribution.uniqueClickers === 1 ? '' : 's'}
              </div>
            </div>

            {/* 4. Avg Engagement Time */}
            <div className="exp-kpi-card">
              <div className="exp-kpi-number">{bMetrics.avgDurationSec}s</div>
              <div className="exp-kpi-label">Avg Engagement</div>
              <div className="exp-kpi-explanation">
                Median duration: {bMetrics.medianDurationSec}s
              </div>
            </div>

            {/* 5. Tester Feedback */}
            <div className="exp-kpi-card">
              <div className="exp-kpi-number">{bMetrics.totalFeedback}</div>
              <div className="exp-kpi-label">Feedback</div>
              <div className="exp-kpi-explanation">Qualitative survey responses</div>
            </div>
          </div>

          {/* PART 8 #1: USER ACTIVITY TIMELINE */}
          <div className="exp-light-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  TELEMETRY CHRONOLOGY
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                  User Activity Timeline
                </h3>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#e4e4e7', borderRadius: '1px' }} />
                  Views
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#09090b', borderRadius: '1px' }} />
                  Clicks
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#52525b', borderRadius: '1px' }} />
                  Forms
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '1px' }} />
                  Feedback
                </span>
              </div>
            </div>

            {timelineBuckets.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#71717a', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                No chronological activity recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Visual Bar Columns */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${timelineBuckets.length}, 1fr)`,
                    gap: '12px',
                    alignItems: 'flex-end',
                    height: '110px',
                    padding: '8px 0',
                    borderBottom: '1px solid #e4e4e7',
                  }}
                >
                  {timelineBuckets.map((bucket) => {
                    const heightPct = Math.max(8, Math.min(100, Math.round((bucket.total / maxBucketCount) * 100)));
                    return (
                      <div
                        key={bucket.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'flex-end',
                          gap: '6px',
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: '#09090b' }}>
                          {bucket.total}
                        </span>
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '36px',
                            height: `${heightPct}%`,
                            backgroundColor: '#09090b',
                            borderRadius: '2px 2px 0 0',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            overflow: 'hidden',
                          }}
                          title={`Time: ${bucket.timeLabel} | Total: ${bucket.total} (Clicks: ${bucket.clicks}, Views: ${bucket.views}, Forms: ${bucket.forms}, Feedback: ${bucket.feedback})`}
                        >
                          {bucket.feedback > 0 && (
                            <div style={{ height: `${(bucket.feedback / bucket.total) * 100}%`, backgroundColor: '#2563eb' }} />
                          )}
                          {bucket.forms > 0 && (
                            <div style={{ height: `${(bucket.forms / bucket.total) * 100}%`, backgroundColor: '#52525b' }} />
                          )}
                          {bucket.clicks > 0 && (
                            <div style={{ height: `${(bucket.clicks / bucket.total) * 100}%`, backgroundColor: '#09090b' }} />
                          )}
                          {bucket.views > 0 && (
                            <div style={{ height: `${(bucket.views / bucket.total) * 100}%`, backgroundColor: '#e4e4e7' }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Labels */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${timelineBuckets.length}, 1fr)`, gap: '12px', textAlign: 'center' }}>
                  {timelineBuckets.map((bucket) => (
                    <div key={bucket.id} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>
                      {bucket.timeLabel}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PART 8 #2 & PART 11: INTERACTION DISTRIBUTION & MOST INTERACTED ELEMENTS */}
          <div className="exp-light-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  CLICK DISTRIBUTION &amp; ATTENTION TARGETS
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                  Most Interacted Elements
                </h3>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#52525b' }}>
                Total: <strong style={{ color: '#09090b' }}>{clickDistribution.totalClicks}</strong> clicks across <strong style={{ color: '#09090b' }}>{clickDistribution.elements.length}</strong> unique element{clickDistribution.elements.length === 1 ? '' : 's'}
              </div>
            </div>

            {clickDistribution.elements.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
                No button or link clicks recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Horizontal Bar Chart (Part 8 #2 & Part 11) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {clickDistribution.elements.map((el, i) => (
                    <div key={el.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#71717a', fontWeight: 600 }}>0{i + 1}</span>
                          <span style={{ color: '#09090b', fontWeight: 600 }}>{el.label}</span>
                        </div>
                        <div style={{ color: '#09090b', fontWeight: 700 }}>
                          {el.totalClicks} {el.totalClicks === 1 ? 'click' : 'clicks'} ({el.percentage}%)
                        </div>
                      </div>

                      {/* Visual Bar */}
                      <div style={{ height: '7px', backgroundColor: '#f4f4f5', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.max(2, Math.min(100, el.percentage))}%`,
                            height: '100%',
                            backgroundColor: i === 0 ? '#09090b' : i === 1 ? '#52525b' : '#71717a',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Small Ranking Table */}
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginTop: '8px' }}>
                  <table className="exp-table-light">
                    <thead>
                      <tr>
                        <th>RANK &amp; ELEMENT</th>
                        <th>TOTAL CLICKS</th>
                        <th>UNIQUE VISITORS</th>
                        <th>AVG / VISITOR</th>
                        <th>SHARE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clickDistribution.elements.map((el, i) => (
                        <tr key={el.key}>
                          <td style={{ fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#71717a' }}>#{i + 1}</span>
                              <span style={{ color: '#09090b' }}>{el.label}</span>
                            </div>
                            <div style={{ fontSize: '0.625rem', color: '#71717a', marginTop: '2px' }}>
                              {el.element}
                            </div>
                          </td>
                          <td style={{ fontWeight: 700, color: '#09090b' }}>{el.totalClicks}</td>
                          <td>{el.uniqueVisitors}</td>
                          <td>{el.avgClicksPerVisitor}</td>
                          <td>{el.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* PART 8 #3: VISITOR FUNNEL */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CONVERSION &amp; DROP-OFF
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                Visitor Funnel
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', marginTop: '2px' }}>
                Shows how visitors progress from landing to prototype views, interaction, forms, and feedback.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {funnelStages.map((stage, idx) => (
                <div key={stage.step} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#71717a', fontWeight: 600 }}>0{stage.step}</span>
                      <strong style={{ color: '#09090b' }}>{stage.title}</strong>
                      {!stage.hasData && (
                        <span style={{ fontSize: '0.6875rem', color: '#a1a1aa', fontStyle: 'italic' }}>
                          — No recorded activity
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#09090b', fontWeight: 700 }}>
                        {stage.count} {stage.count === 1 ? 'visitor' : 'visitors'}
                      </span>
                      <span style={{ color: '#52525b' }}>({stage.percentage}%)</span>
                      {stage.step > 1 && stage.dropOff > 0 && (
                        <span style={{ color: '#b91c1c', fontSize: '0.6875rem', fontWeight: 500 }}>
                          -{stage.dropOff} ({stage.dropOffPct}% drop-off)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Funnel Bar */}
                  <div style={{ height: '8px', backgroundColor: '#f4f4f5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${stage.hasData ? Math.max(2, Math.min(100, stage.percentage)) : 0}%`,
                        height: '100%',
                        backgroundColor: stage.step === 1 ? '#09090b' : stage.step === 2 ? '#27272a' : stage.step === 3 ? '#52525b' : stage.step === 4 ? '#71717a' : '#2563eb',
                        borderRadius: '4px',
                        transition: 'width 240ms ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PART 9: USER JOURNEY VISUALIZATION */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                JOURNEY VISUALIZATION
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                User Journey Flow
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', marginTop: '2px' }}>
                Visual connected pipeline showing progression from visitor arrival to interaction and feedback.
              </p>
            </div>

            {/* Responsive Flow: Horizontal on Desktop, Vertical on Mobile */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #e4e4e7',
              }}
            >
              {[
                { label: 'VISITOR', count: bMetrics.totalVisitors, events: bMetrics.totalEvents, pct: '100%' },
                { label: 'PROTOTYPE', count: bMetrics.totalVisitors, events: bMetrics.totalVisitors, pct: '100%' },
                {
                  label: 'INTERACTION',
                  count: clickDistribution.uniqueClickers,
                  events: clickDistribution.totalClicks,
                  pct: bMetrics.totalVisitors > 0 ? `${Math.round((clickDistribution.uniqueClickers / bMetrics.totalVisitors) * 100)}%` : '0%',
                },
                {
                  label: 'FEEDBACK',
                  count: bMetrics.totalFeedback,
                  events: bMetrics.totalFeedback,
                  pct: bMetrics.totalVisitors > 0 ? `${Math.round((bMetrics.totalFeedback / bMetrics.totalVisitors) * 100)}%` : '0%',
                },
              ].map((node, i, arr) => (
                <React.Fragment key={node.label}>
                  <div
                    style={{
                      flex: '1 1 140px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '4px',
                      padding: '14px',
                      textAlign: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a', letterSpacing: '0.1em' }}>
                      {node.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                      {node.count}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b', marginTop: '2px' }}>
                      {node.events} event{node.events === 1 ? '' : 's'} ({node.pct})
                    </div>
                  </div>

                  {i < arr.length - 1 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#a1a1aa',
                        flexShrink: 0,
                      }}
                    >
                      <ArrowRight size={18} className="hidden sm:inline" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* PART 12: OBSERVATION / INTERPRETATION / CONCLUSION */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                EPISTEMIC SAFETY MODEL
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                Observed Behavior vs. Interpretation vs. Conclusion
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', marginTop: '2px' }}>
                WIQN strictly isolates physical measurements from hypothesis and validation conclusions to avoid over-interpreting early clicks.
              </p>
            </div>

            {behavioralSignals.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
                Signals will be generated as visitors test your prototype.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {behavioralSignals.map((sig) => (
                  <div
                    key={sig.id}
                    style={{
                      border: '1px solid #e4e4e7',
                      borderRadius: '4px',
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Signal Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e4e4e7',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: '#09090b' }}>
                        {sig.title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '3px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #d4d4d8',
                          color: '#09090b',
                        }}
                      >
                        {sig.significance} SIGNAL
                      </span>
                    </div>

                    {/* 3-Layer Visual Structure (Part 12) */}
                    <div className="exp-epistemic-chain" style={{ padding: '14px 16px' }}>
                      {/* Layer 1: OBSERVED */}
                      <div className="exp-epistemic-layer">
                        <div className="exp-epistemic-tag" style={{ color: '#09090b' }}>
                          01 // OBSERVED (DIRECTLY MEASURED)
                        </div>
                        <div className="exp-epistemic-text">
                          {sig.observation}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', color: '#a1a1aa', margin: '-4px 0' }}>↓</div>

                      {/* Layer 2: INTERPRETED */}
                      <div className="exp-epistemic-layer interpreted">
                        <div className="exp-epistemic-tag" style={{ color: '#52525b' }}>
                          02 // INTERPRETATION (WORKING HYPOTHESIS)
                        </div>
                        <div className="exp-epistemic-text">
                          {sig.interpretation}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', color: '#a1a1aa', margin: '-4px 0' }}>↓</div>

                      {/* Layer 3: CONCLUSION */}
                      <div className="exp-epistemic-layer conclusion">
                        <div className="exp-epistemic-tag" style={{ color: '#71717a' }}>
                          03 // CONCLUSION (RESPONSIBLE TAKEAWAY)
                        </div>
                        <div className="exp-epistemic-text">
                          {sig.conclusion}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PART 13 & 14: 7 EVIDENCE DIMENSIONS WITH CONFIDENCE BADGES */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                STRUCTURED EVIDENCE PACK
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                7 Evidence Dimensions
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', marginTop: '2px' }}>
                Compact evidence cards with clear confidence badges. Click &ldquo;View details&rdquo; to expand supporting records.
              </p>
            </div>

            <div className="exp-evidence-grid">
              {/* Card 1: WHAT USERS DID */}
              <div className="exp-evidence-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#71717a' }}>
                    01 // WHAT USERS DID
                  </span>
                  {renderConfidenceBadge(bMetrics.totalVisitors >= 10 ? 'MODERATE' : 'EARLY', `${bMetrics.totalVisitors} session(s)`)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  {bMetrics.totalVisitors} visitors · {bMetrics.totalEvents} actions
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5 }}>
                  {evidenceCards.whatUsersDid.statement}
                </p>

                <button
                  onClick={() => toggleDimension('whatUsersDid')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#09090b',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    alignSelf: 'flex-start',
                  }}
                >
                  <span>{expandedDimension === 'whatUsersDid' ? 'Hide details' : 'View details'}</span>
                  {expandedDimension === 'whatUsersDid' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expandedDimension === 'whatUsersDid' && (
                  <ul style={{ paddingLeft: '16px', margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.71875rem', color: '#52525b', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #f0f0f2', paddingTop: '8px' }}>
                    {evidenceCards.whatUsersDid.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Card 2: WHAT USERS CLICKED */}
              <div className="exp-evidence-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#71717a' }}>
                    02 // WHAT USERS CLICKED
                  </span>
                  {renderConfidenceBadge(clickDistribution.totalClicks >= 15 ? 'MODERATE' : 'EARLY', `${clickDistribution.totalClicks} click(s)`)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  {clickDistribution.totalClicks} clicks · {clickDistribution.elements.length} target{clickDistribution.elements.length === 1 ? '' : 's'}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5 }}>
                  {evidenceCards.whatUsersClicked.statement}
                </p>

                <button
                  onClick={() => toggleDimension('whatUsersClicked')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#09090b',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    alignSelf: 'flex-start',
                  }}
                >
                  <span>{expandedDimension === 'whatUsersClicked' ? 'Hide details' : 'View details'}</span>
                  {expandedDimension === 'whatUsersClicked' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expandedDimension === 'whatUsersClicked' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.71875rem', borderTop: '1px solid #f0f0f2', paddingTop: '8px' }}>
                    {evidenceCards.whatUsersClicked.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#09090b' }}>• {it.label}</span>
                        <span style={{ color: '#71717a' }}>{it.totalClicks} clicks</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 3: WHERE USERS DROPPED */}
              <div className="exp-evidence-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#71717a' }}>
                    03 // WHERE USERS DROPPED
                  </span>
                  {renderConfidenceBadge(bMetrics.totalVisitors >= 5 ? 'MODERATE' : 'EARLY', 'Funnel telemetry')}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  {funnel.primaryDropOffStep ? `Drop-off: ${funnel.primaryDropOffStep}` : 'No significant drop-off'}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5 }}>
                  {evidenceCards.whereUsersDropped.statement}
                </p>

                <button
                  onClick={() => toggleDimension('whereUsersDropped')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#09090b',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    alignSelf: 'flex-start',
                  }}
                >
                  <span>{expandedDimension === 'whereUsersDropped' ? 'Hide details' : 'View details'}</span>
                  {expandedDimension === 'whereUsersDropped' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expandedDimension === 'whereUsersDropped' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.71875rem', color: '#52525b', borderTop: '1px solid #f0f0f2', paddingTop: '8px' }}>
                    {evidenceCards.whereUsersDropped.dropOffs.length > 0 ? (
                      evidenceCards.whereUsersDropped.dropOffs.map((d, i) => (
                        <div key={i}>• {d}</div>
                      ))
                    ) : (
                      <div>• No major step-to-step drop-offs observed.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Card 4: WHAT USERS SAID */}
              <div className="exp-evidence-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#71717a' }}>
                    04 // WHAT USERS SAID
                  </span>
                  {renderConfidenceBadge(bMetrics.totalFeedback > 0 ? 'MODERATE' : 'INSUFFICIENT', `${bMetrics.totalFeedback} response(s)`)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  {bMetrics.totalFeedback} feedback response{bMetrics.totalFeedback === 1 ? '' : 's'}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5 }}>
                  {evidenceCards.whatUsersSaid.statement}
                </p>

                <button
                  onClick={() => toggleDimension('whatUsersSaid')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#09090b',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    alignSelf: 'flex-start',
                  }}
                >
                  <span>{expandedDimension === 'whatUsersSaid' ? 'Hide details' : 'View details'}</span>
                  {expandedDimension === 'whatUsersSaid' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expandedDimension === 'whatUsersSaid' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f0f0f2', paddingTop: '8px' }}>
                    {evidenceCards.whatUsersSaid.quotes.length > 0 ? (
                      evidenceCards.whatUsersSaid.quotes.map((q, i) => (
                        <div key={i} style={{ fontStyle: 'italic', fontSize: '0.75rem', color: '#18181b', borderLeft: '2px solid #09090b', paddingLeft: '8px' }}>
                          &ldquo;{q}&rdquo;
                        </div>
                      ))
                    ) : (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#a1a1aa' }}>
                        No qualitative comments submitted yet.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card 5: WHAT WE KNOW SO FAR */}
              <div className="exp-evidence-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#71717a' }}>
                    05 // WHAT WE KNOW SO FAR
                  </span>
                  {renderConfidenceBadge('MODERATE', 'Empirically measured')}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  {evidenceCards.whatWeKnow.facts.length} empirical fact{evidenceCards.whatWeKnow.facts.length === 1 ? '' : 's'}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5 }}>
                  Calculated from real interactions without over-interpreting unproven intent.
                </p>

                <button
                  onClick={() => toggleDimension('whatWeKnow')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#09090b',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    alignSelf: 'flex-start',
                  }}
                >
                  <span>{expandedDimension === 'whatWeKnow' ? 'Hide details' : 'View details'}</span>
                  {expandedDimension === 'whatWeKnow' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expandedDimension === 'whatWeKnow' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f0f0f2', paddingTop: '8px' }}>
                    {evidenceCards.whatWeKnow.facts.map((f, i) => (
                      <div key={i} style={{ fontSize: '0.75rem' }}>
                        <div style={{ fontWeight: 600, color: '#09090b' }}>• {f.title}: {f.statement}</div>
                        <div style={{ color: '#71717a', fontSize: '0.6875rem', marginTop: '1px' }}>Evidence: {f.evidence}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 6: WHAT WE DON'T KNOW YET */}
              <div className="exp-evidence-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#71717a' }}>
                    06 // WHAT WE DON&apos;T KNOW YET
                  </span>
                  {renderConfidenceBadge('EARLY', 'Unverified assumptions')}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  {evidenceCards.whatWeDontKnowYet.uncertainties.length} key uncertainties
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5 }}>
                  Critical boundaries where data does not yet prove retention or purchase willingness.
                </p>

                <button
                  onClick={() => toggleDimension('whatWeDontKnowYet')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#09090b',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    alignSelf: 'flex-start',
                  }}
                >
                  <span>{expandedDimension === 'whatWeDontKnowYet' ? 'Hide details' : 'View details'}</span>
                  {expandedDimension === 'whatWeDontKnowYet' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expandedDimension === 'whatWeDontKnowYet' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'var(--font-primary)', fontSize: '0.75rem', color: '#52525b', borderTop: '1px solid #f0f0f2', paddingTop: '8px' }}>
                    {evidenceCards.whatWeDontKnowYet.uncertainties.map((u, i) => (
                      <div key={i}>? {u}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 7: WHAT TO TEST NEXT */}
              <div className="exp-evidence-card" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#71717a' }}>
                    07 // WHAT TO TEST NEXT
                  </span>
                  {renderConfidenceBadge('MODERATE', 'Evidence-grounded action items')}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  {evidenceCards.whatToTestNext.recommendations.length} recommended next action{evidenceCards.whatToTestNext.recommendations.length === 1 ? '' : 's'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginTop: '6px' }}>
                  {evidenceCards.whatToTestNext.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e4e4e7',
                        padding: '12px 14px',
                        borderRadius: '4px',
                        fontSize: '0.8125rem',
                        color: '#09090b',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a', display: 'block', marginBottom: '4px' }}>
                        ACTION {i + 1}
                      </span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PART 15: WHAT WE KNOW SO FAR (EVIDENCE SUMMARY LIST) */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                EVIDENCE SUMMARY
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                What We Know So Far
              </h3>
            </div>

            {evidenceCards.whatWeKnow.facts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
                No interactions recorded yet. As soon as visitors test your prototype, calculated findings will appear here.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {evidenceCards.whatWeKnow.facts.map((fact, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e4e4e7',
                      borderRadius: '4px',
                      padding: '14px 16px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: '#09090b' }}>
                        {fact.title}
                      </span>
                      {renderConfidenceBadge(fact.confidence || 'EARLY')}
                    </div>

                    <p style={{ fontSize: '0.84375rem', color: '#18181b', lineHeight: 1.5, margin: 0 }}>
                      {fact.statement}
                    </p>

                    <div style={{ backgroundColor: '#f8f9fa', padding: '8px 10px', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b' }}>
                      <strong>Evidence:</strong> {fact.evidence}
                    </div>

                    {fact.limitations && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>
                        <strong>Limitation:</strong> {fact.limitations}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PART 16: SUGGESTIONS FOR IMPROVEMENT */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ACTIONABLE RECOMMENDATION
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                Suggestions for Improvement
              </h3>
            </div>

            <div
              style={{
                border: '1px solid #e4e4e7',
                borderRadius: '4px',
                padding: '18px 20px',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* WHAT HAPPENED */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                  WHAT HAPPENED
                </div>
                <p style={{ fontSize: '0.875rem', color: '#09090b', lineHeight: 1.5, margin: 0 }}>
                  {clickDistribution.elements[0]
                    ? `Visitors interacted with "${clickDistribution.elements[0].label}" ${clickDistribution.elements[0].totalClicks} time(s).`
                    : `${bMetrics.totalVisitors} visitors recorded ${bMetrics.totalEvents} tracked actions.`}
                </p>
              </div>

              <div style={{ color: '#a1a1aa', margin: '-4px 0' }}>↓</div>

              {/* POSSIBLE EXPLANATION */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                  POSSIBLE EXPLANATION
                </div>
                <p style={{ fontSize: '0.84375rem', color: '#52525b', lineHeight: 1.5, margin: 0 }}>
                  {bMetrics.totalVisitors >= 5
                    ? 'The primary prototype pathway is receiving measurable attention, but secondary flows remain undiscovered.'
                    : 'The sample size is still in early exploration; further testing is needed before inferring persistent friction.'}
                </p>
              </div>

              <div style={{ color: '#a1a1aa', margin: '-4px 0' }}>↓</div>

              {/* SUGGESTED ACTION */}
              <div style={{ backgroundColor: '#f8f9fa', padding: '12px 14px', borderRadius: '4px', border: '1px solid #e4e4e7' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#09090b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                  SUGGESTED ACTION
                </div>
                <p style={{ fontSize: '0.84375rem', color: '#09090b', fontWeight: 600, margin: 0 }}>
                  {bMetrics.totalVisitors >= 5
                    ? 'Make the next action button more visually discoverable, then share with 5 more testers.'
                    : 'Share your prototype link with 3 to 5 targeted users to build an honest validation sample.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: EVENT EXPLORER (CHRONOLOGICAL STREAM) */}
      {/* ======================================================== */}
      {subTab === 'explorer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header & Filter Controls (Part 10) */}
          <div className="exp-light-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  Chronological Event Stream
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', marginTop: '2px' }}>
                  {paginationInfo.totalCount} filtered action{paginationInfo.totalCount === 1 ? '' : 's'} across {bMetrics.totalVisitors} visitor{bMetrics.totalVisitors === 1 ? '' : 's'}
                </p>
              </div>

              {/* Visitor filter selector */}
              {visitors.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="exp-visitor-filter-select" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
                    VISITOR:
                  </label>
                  <select
                    id="exp-visitor-filter-select"
                    value={visitorFilter}
                    onChange={(e) => {
                      setVisitorFilter(e.target.value);
                      setPage(1);
                    }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      padding: '6px 10px',
                      backgroundColor: '#ffffff',
                      color: '#09090b',
                      border: '1px solid #e4e4e7',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="all">All Visitors ({visitors.length})</option>
                    {visitors.map((v) => (
                      <option key={v.visitorId} value={v.visitorId}>
                        {v.displayLabel} ({v.actionsCount} actions)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Category Filter Pills (Part 10: All, Clicks, Views, Forms, Feedback, Scroll) */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'All Events' },
                { key: 'clicks', label: 'Clicks' },
                { key: 'pages', label: 'Page Views' },
                { key: 'forms', label: 'Forms' },
                { key: 'feedback', label: 'Feedback' },
                { key: 'scroll', label: 'Scroll' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setCategoryFilter(cat.key as any);
                    setPage(1);
                  }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: categoryFilter === cat.key ? '1px solid #09090b' : '1px solid #e4e4e7',
                    backgroundColor: categoryFilter === cat.key ? '#09090b' : '#ffffff',
                    color: categoryFilter === cat.key ? '#ffffff' : '#52525b',
                    cursor: 'pointer',
                    minHeight: '36px',
                    transition: 'all 160ms ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Event Table (Part 10) */}
          <div className="exp-light-card" style={{ padding: 0, overflow: 'hidden' }}>
            {loadingEvents ? (
              <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
                <RefreshCw size={16} className="animate-spin" style={{ display: 'inline', marginRight: '8px' }} />
                Loading events...
              </div>
            ) : explorerEvents.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
                No events found matching current filter.
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="exp-table-light">
                  <thead>
                    <tr>
                      <th>TIME</th>
                      <th>EVENT</th>
                      <th>ELEMENT</th>
                      <th>PAGE</th>
                      <th>VISITOR</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explorerEvents.map((ev, i) => {
                      const timeStr = new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const rawT = (ev.eventType || '').toUpperCase();

                      let badgeType = 'view';
                      if (rawT.includes('CLICK') || rawT.includes('TAP')) badgeType = 'click';
                      else if (rawT.includes('SCROLL')) badgeType = 'scroll';
                      else if (rawT.includes('FORM')) badgeType = 'form';
                      else if (rawT.includes('FEEDBACK')) badgeType = 'feedback';

                      return (
                        <tr key={ev.id || i} style={{ cursor: 'pointer' }} onClick={() => setSelectedEvent(ev)}>
                          <td style={{ color: '#71717a', whiteSpace: 'nowrap' }}>{timeStr}</td>
                          <td>
                            <span className={`exp-event-badge ${badgeType}`}>
                              {ev.displayType || ev.eventType}
                            </span>
                          </td>
                          <td style={{ color: '#09090b', fontWeight: 500, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ev.label || ev.element || '—'}
                          </td>
                          <td style={{ color: '#52525b', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ev.page}
                          </td>
                          <td style={{ color: '#09090b', fontWeight: 600 }}>
                            {ev.visitorLabel || 'Visitor'}
                          </td>
                          <td>
                            <span style={{ color: '#09090b', textDecoration: 'underline', fontSize: '0.6875rem' }}>
                              Details →
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                borderTop: '1px solid #e4e4e7',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                backgroundColor: '#fafafa',
              }}
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={!paginationInfo.hasPrevPage || loadingEvents}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  color: paginationInfo.hasPrevPage ? '#09090b' : '#a1a1aa',
                  padding: '6px 12px',
                  borderRadius: '3px',
                  cursor: paginationInfo.hasPrevPage ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  minHeight: '36px',
                }}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <span style={{ color: '#52525b' }}>
                Page <strong style={{ color: '#09090b' }}>{paginationInfo.page}</strong> of <strong style={{ color: '#09090b' }}>{paginationInfo.totalPages}</strong> ({paginationInfo.totalCount} total)
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={!paginationInfo.hasNextPage || loadingEvents}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  color: paginationInfo.hasNextPage ? '#09090b' : '#a1a1aa',
                  padding: '6px 12px',
                  borderRadius: '3px',
                  cursor: paginationInfo.hasNextPage ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  minHeight: '36px',
                }}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: USER JOURNEYS & FUNNEL */}
      {/* ======================================================== */}
      {subTab === 'journeys' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Deep-Dive Funnel */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PROGRESSION FUNNEL
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                Visitor Progression &amp; Drop-Off Points
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {funnel.steps.map((step) => (
                <div key={step.stepIndex} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#09090b', fontWeight: 600 }}>{step.name}</span>
                      <span style={{ color: '#71717a', fontSize: '0.6875rem' }}>— {step.description}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#09090b', fontWeight: 700 }}>{step.count} visitor{step.count === 1 ? '' : 's'}</span>
                      <span style={{ color: '#52525b' }}>({step.overallPercentage}%)</span>
                      {step.stepIndex > 1 && step.dropOffCount > 0 && (
                        <span style={{ color: '#b91c1c', fontSize: '0.6875rem' }}>
                          -{step.dropOffCount} ({step.dropOffPercentage}% drop-off)
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ height: '8px', backgroundColor: '#f4f4f5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(2, Math.min(100, step.overallPercentage))}%`,
                        height: '100%',
                        backgroundColor: step.stepIndex === 1 ? '#09090b' : step.stepIndex === 2 ? '#27272a' : step.stepIndex === 3 ? '#52525b' : step.stepIndex === 4 ? '#71717a' : '#2563eb',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observed User Paths */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                OBSERVED SEQUENTIAL PATHS
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                Observed User Paths
              </h3>
            </div>

            {observedPaths.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
                No multi-step user paths recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {observedPaths.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e4e4e7',
                      padding: '12px 16px',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
                        Path #{idx + 1}:
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#09090b', fontWeight: 600 }}>
                        {p.pathSummary}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      <span style={{ color: '#09090b', fontWeight: 700 }}>{p.sessionsCount} session{p.sessionsCount === 1 ? '' : 's'}</span>
                      <span style={{ color: '#52525b' }}>({p.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scroll Depth Milestones */}
          <div className="exp-light-card">
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SCROLL PENETRATION
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                Scroll Depth Reached by Visitors
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { depth: '25%', data: scrollDistribution.reaching25 },
                { depth: '50%', data: scrollDistribution.reaching50 },
                { depth: '75%', data: scrollDistribution.reaching75 },
                { depth: '100%', data: scrollDistribution.reaching100 },
              ].map((item) => (
                <div key={item.depth} style={{ backgroundColor: '#f8f9fa', border: '1px solid #e4e4e7', padding: '14px', borderRadius: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#09090b', fontWeight: 600 }}>
                    Reached {item.depth}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.375rem', fontWeight: 700, color: '#09090b', marginTop: '4px' }}>
                    {item.data.percentage}%
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', marginTop: '2px' }}>
                    {item.data.count} visitor{item.data.count === 1 ? '' : 's'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: VISITOR PROFILES */}
      {/* ======================================================== */}
      {subTab === 'visitors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="exp-light-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
              Individual Anonymous Visitor Profiles
            </h3>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#52525b', marginTop: '2px' }}>
              Click any visitor to inspect their sequential interaction timeline. Zero personal identities stored.
            </p>
          </div>

          {visitors.length === 0 ? (
            <div className="exp-light-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
                No visitor profiles recorded yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {visitors.map((v) => (
                <div
                  key={v.visitorId}
                  className="exp-light-card"
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: '#09090b' }}>
                      {v.displayLabel}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        padding: '2px 8px',
                        border: '1px solid #e4e4e7',
                        color: '#52525b',
                        borderRadius: '3px',
                        backgroundColor: '#f8f9fa',
                      }}
                    >
                      {v.deviceType}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: '#71717a' }}>Actions: </span>
                      <strong style={{ color: '#09090b' }}>{v.actionsCount}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#71717a' }}>Sessions: </span>
                      <strong style={{ color: '#09090b' }}>{v.sessionsCount}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#71717a' }}>Pages: </span>
                      <strong style={{ color: '#09090b' }}>{v.pagesViewedCount}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#71717a' }}>Feedback: </span>
                      <strong style={{ color: v.hasFeedback ? '#15803d' : '#71717a' }}>
                        {v.hasFeedback ? `Yes (${v.feedbackRating || 'N/A'}/5)` : 'None'}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setInspectedVisitor(v)}
                    className="exp-btn-secondary"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px', marginTop: '4px', minHeight: '36px' }}
                  >
                    View Visitor Timeline ({v.actionsCount}) →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EVENT DETAIL INSPECTION */}
      {/* ======================================================== */}
      {selectedEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase' }}>
                EVENT DETAILS
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: 'none', border: 'none', color: '#09090b', cursor: 'pointer', padding: '4px' }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
              {selectedEvent.label || selectedEvent.eventType}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f2', paddingBottom: '6px' }}>
                <span style={{ color: '#71717a' }}>Event Type</span>
                <span style={{ color: '#09090b', fontWeight: 600 }}>{selectedEvent.displayType || selectedEvent.eventType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f2', paddingBottom: '6px' }}>
                <span style={{ color: '#71717a' }}>Element Target</span>
                <span style={{ color: '#09090b', wordBreak: 'break-all' }}>{selectedEvent.element || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f2', paddingBottom: '6px' }}>
                <span style={{ color: '#71717a' }}>Page Route</span>
                <span style={{ color: '#09090b' }}>{selectedEvent.page}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f2', paddingBottom: '6px' }}>
                <span style={{ color: '#71717a' }}>Timestamp</span>
                <span style={{ color: '#09090b' }}>{new Date(selectedEvent.timestamp).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f2', paddingBottom: '6px' }}>
                <span style={{ color: '#71717a' }}>Visitor</span>
                <span style={{ color: '#09090b', fontWeight: 600 }}>{selectedEvent.visitorLabel || selectedEvent.visitorId}</span>
              </div>
              {selectedEvent.metadata && (
                <div style={{ marginTop: '6px' }}>
                  <span style={{ color: '#71717a', display: 'block', marginBottom: '4px' }}>Metadata</span>
                  <pre style={{ backgroundColor: '#f8f9fa', border: '1px solid #e4e4e7', padding: '10px', borderRadius: '3px', fontSize: '0.6875rem', overflowX: 'auto', color: '#18181b' }}>
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VISITOR TIMELINE INSPECTION */}
      {/* ======================================================== */}
      {inspectedVisitor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setInspectedVisitor(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '24px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase' }}>
                VISITOR ACTIVITY TIMELINE
              </div>
              <button
                onClick={() => setInspectedVisitor(null)}
                style={{ background: 'none', border: 'none', color: '#09090b', cursor: 'pointer', padding: '4px' }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                {inspectedVisitor.displayLabel}
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#52525b' }}>
                {inspectedVisitor.actionsCount} actions • {inspectedVisitor.sessionsCount} session{inspectedVisitor.sessionsCount === 1 ? '' : 's'}
              </div>
            </div>

            {/* Timeline sequence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {inspectedVisitor.timeline.length === 0 ? (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a' }}>
                  No individual action items found for this visitor.
                </div>
              ) : (
                inspectedVisitor.timeline.map((item: any, i: number) => (
                  <div
                    key={item.id || i}
                    style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e4e4e7',
                      padding: '10px 14px',
                      borderRadius: '3px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#71717a', fontSize: '0.6875rem' }}>#{i + 1}</span>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          backgroundColor: item.eventType === 'CLICK' ? '#09090b' : '#ffffff',
                          color: item.eventType === 'CLICK' ? '#ffffff' : '#09090b',
                          border: '1px solid #e4e4e7',
                          fontWeight: 600,
                        }}
                      >
                        {item.displayType || item.eventType}
                      </span>
                      <span style={{ color: '#09090b', fontWeight: 600 }}>{item.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#71717a', fontSize: '0.6875rem' }}>{item.page}</span>
                      <span style={{ color: '#52525b', fontSize: '0.6875rem' }}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
