'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  MousePointer,
  Compass,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  X,
  FileText,
  Eye,
  RefreshCw,
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
    totalPages: Math.max(1, Math.ceil(initialEvents.length / 25)),
    totalCount: initialEvents.length,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loadingEvents, setLoadingEvents] = useState(false);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Sub-navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
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
              borderRadius: '2px',
              border: subTab === 'overview' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: subTab === 'overview' ? '#ffffff' : 'transparent',
              color: subTab === 'overview' ? '#000000' : 'var(--color-silver-300)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
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
              borderRadius: '2px',
              border: subTab === 'explorer' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: subTab === 'explorer' ? '#ffffff' : 'transparent',
              color: subTab === 'explorer' ? '#000000' : 'var(--color-silver-300)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
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
              borderRadius: '2px',
              border: subTab === 'journeys' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: subTab === 'journeys' ? '#ffffff' : 'transparent',
              color: subTab === 'journeys' ? '#000000' : 'var(--color-silver-300)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Compass size={14} />
            <span>Journeys & Funnel</span>
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
              borderRadius: '2px',
              border: subTab === 'visitors' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: subTab === 'visitors' ? '#ffffff' : 'transparent',
              color: subTab === 'visitors' ? '#000000' : 'var(--color-silver-300)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <User size={14} />
            <span>Visitor Profiles ({visitors.length})</span>
          </button>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="btn-ghost"
            style={{ fontSize: '0.6875rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Key Metrics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '2px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                Unique Visitors
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                {bMetrics.totalVisitors}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                Individual device sessions
              </div>
            </div>

            <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '2px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                Total Actions Tracked
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                {bMetrics.totalEvents}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                Observable behavioral events
              </div>
            </div>

            <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '2px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                Total Clicks
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                {clickDistribution.totalClicks}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                From {clickDistribution.uniqueClickers} distinct visitor(s)
              </div>
            </div>

            <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '2px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                Avg Engagement Time
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                {bMetrics.avgDurationSec}s
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                Median duration: {bMetrics.medianDurationSec}s
              </div>
            </div>

            <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '2px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                Tester Feedback
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                {bMetrics.totalFeedback}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                Qualitative survey responses
              </div>
            </div>
          </div>

          {/* MOST INTERACTED ELEMENTS / CLICK DISTRIBUTION */}
          <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  CLICK DISTRIBUTION & ATTENTION TARGETS
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                  Most Interacted Elements
                </h3>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)' }}>
                Total: <strong style={{ color: '#ffffff' }}>{clickDistribution.totalClicks}</strong> clicks across <strong style={{ color: '#ffffff' }}>{clickDistribution.elements.length}</strong> unique element(s)
              </div>
            </div>

            {clickDistribution.elements.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
                No button or link clicks recorded yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                      <th style={{ padding: '10px 12px' }}>ELEMENT / CTA LABEL</th>
                      <th style={{ padding: '10px 12px' }}>TOTAL CLICKS</th>
                      <th style={{ padding: '10px 12px' }}>UNIQUE VISITORS</th>
                      <th style={{ padding: '10px 12px' }}>AVG CLICKS / VISITOR</th>
                      <th style={{ padding: '10px 12px' }}>SESSIONS</th>
                      <th style={{ padding: '10px 12px' }}>SHARE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clickDistribution.elements.map((el, i) => (
                      <tr key={el.key} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '12px', color: '#ffffff', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--color-silver-300)', fontSize: '0.6875rem' }}>#{i + 1}</span>
                            <span>{el.label}</span>
                          </div>
                          <div style={{ fontSize: '0.625rem', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                            {el.element}
                          </div>
                        </td>
                        <td style={{ padding: '12px', color: '#ffffff', fontWeight: 700 }}>
                          {el.totalClicks}
                        </td>
                        <td style={{ padding: '12px', color: 'var(--color-silver-300)' }}>
                          {el.uniqueVisitors}
                        </td>
                        <td style={{ padding: '12px', color: 'var(--color-silver-300)' }}>
                          {el.avgClicksPerVisitor}
                        </td>
                        <td style={{ padding: '12px', color: 'var(--color-silver-300)' }}>
                          {el.sessionsCount}
                        </td>
                        <td style={{ padding: '12px', color: '#ffffff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '60px', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                              <div style={{ width: `${Math.min(100, el.percentage)}%`, height: '100%', backgroundColor: '#ffffff' }} />
                            </div>
                            <span style={{ fontSize: '0.6875rem' }}>{el.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* BEHAVIORAL SIGNALS (Strict Observation vs Interpretation vs Conclusion) */}
          <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                EMPIRICAL BEHAVIORAL SIGNALS
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                Observed Behavior vs. Interpretation vs. Conclusion
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                WIQN strictly isolates physical measurements from hypothesis and validation conclusions to avoid over-interpreting early clicks.
              </p>
            </div>

            {behavioralSignals.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
                Signals will be generated as visitors test your prototype.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {behavioralSignals.map((sig) => (
                  <div
                    key={sig.id}
                    style={{
                      backgroundColor: '#0c0c0f',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '20px',
                      borderRadius: '2px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff' }}>
                        {sig.title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          padding: '2px 8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'var(--color-silver-300)',
                          borderRadius: '2px',
                        }}
                      >
                        {sig.significance} SIGNAL
                      </span>
                    </div>

                    <div style={{ borderLeft: '2px solid #ffffff', paddingLeft: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#ffffff', textTransform: 'uppercase' }}>
                        OBSERVATION (MEASURED)
                      </div>
                      <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                        {sig.observation}
                      </div>
                    </div>

                    <div style={{ borderLeft: '2px solid var(--color-silver-300)', paddingLeft: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-silver-300)', textTransform: 'uppercase' }}>
                        INTERPRETATION (HYPOTHESIS)
                      </div>
                      <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                        {sig.interpretation}
                      </div>
                    </div>

                    <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.3)', paddingLeft: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                        CONCLUSION (CAVEAT)
                      </div>
                      <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#d4d4d8', marginTop: '2px' }}>
                        {sig.conclusion}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7 STRUCTURED EVIDENCE CARDS */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                STRUCTURED EVIDENCE PACK
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                7 Evidence Dimensions
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Card 1: WHAT USERS DID */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  1. {evidenceCards.whatUsersDid.title}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '14px' }}>
                  {evidenceCards.whatUsersDid.statement}
                </p>
                <ul style={{ paddingLeft: '16px', margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {evidenceCards.whatUsersDid.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* Card 2: WHAT USERS CLICKED */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  2. {evidenceCards.whatUsersClicked.title}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '14px' }}>
                  {evidenceCards.whatUsersClicked.statement}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  {evidenceCards.whatUsersClicked.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                      <span style={{ color: '#ffffff' }}>• {it.label}</span>
                      <span style={{ color: 'var(--color-silver-300)' }}>{it.totalClicks} clicks ({it.uniqueVisitors} visitors)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: WHERE USERS DROPPED */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  3. {evidenceCards.whereUsersDropped.title}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '14px' }}>
                  {evidenceCards.whereUsersDropped.statement}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)' }}>
                  {evidenceCards.whereUsersDropped.dropOffs.length > 0 ? (
                    evidenceCards.whereUsersDropped.dropOffs.map((d, i) => (
                      <div key={i}>• {d}</div>
                    ))
                  ) : (
                    <div>• No significant step-to-step drop-offs observed.</div>
                  )}
                </div>
              </div>

              {/* Card 4: WHAT USERS SAID */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  4. {evidenceCards.whatUsersSaid.title}
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '14px' }}>
                  {evidenceCards.whatUsersSaid.statement}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {evidenceCards.whatUsersSaid.quotes.length > 0 ? (
                    evidenceCards.whatUsersSaid.quotes.map((q, i) => (
                      <div key={i} style={{ fontFamily: 'var(--font-primary)', fontStyle: 'italic', fontSize: '0.8125rem', color: '#d4d4d8', borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '10px' }}>
                        "{q}"
                      </div>
                    ))
                  ) : (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                      No qualitative comments submitted yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Card 5: WHAT WE KNOW SO FAR */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  5. {evidenceCards.whatWeKnow.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {evidenceCards.whatWeKnow.facts.map((f, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>
                        • {f.title}: {f.statement}
                      </div>
                      <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                        Evidence: {f.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 6: WHAT WE DON'T KNOW YET */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  6. {evidenceCards.whatWeDontKnowYet.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: 'var(--color-silver-300)' }}>
                  {evidenceCards.whatWeDontKnowYet.uncertainties.map((u, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>?</span>
                      <span>{u}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 7: WHAT TO TEST NEXT */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid #ffffff', padding: '24px', borderRadius: '2px', gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  7. {evidenceCards.whatToTestNext.title}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '10px' }}>
                  {evidenceCards.whatToTestNext.recommendations.map((rec, i) => (
                    <div key={i} style={{ backgroundColor: '#141418', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '2px', fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#ffffff' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', display: 'block', marginBottom: '4px' }}>
                        ACTION {i + 1}
                      </span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: EVENT EXPLORER (CHRONOLOGICAL STREAM) */}
      {/* ======================================================== */}
      {subTab === 'explorer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header & Filter Controls */}
          <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                  Chronological Event Stream
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                  {paginationInfo.totalCount} total filtered action(s) across {bMetrics.totalVisitors} visitor(s)
                </p>
              </div>

              {/* Visitor filter selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                  Filter by Visitor:
                </span>
                <select
                  value={visitorFilter}
                  onChange={(e) => {
                    setVisitorFilter(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    backgroundColor: '#121216',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    padding: '6px 10px',
                    borderRadius: '2px',
                    outline: 'none',
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
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['all', 'clicks', 'pages', 'forms', 'scroll', 'sessions'] as const).map((cat) => {
                const active = categoryFilter === cat;
                const labels: Record<string, string> = {
                  all: 'All Events',
                  clicks: 'Clicks Only',
                  pages: 'Page Views',
                  forms: 'Forms',
                  scroll: 'Scroll',
                  sessions: 'Sessions & Pulses',
                };
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setPage(1);
                    }}
                    style={{
                      padding: '5px 12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      borderRadius: '2px',
                      border: active ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: active ? '#ffffff' : '#121216',
                      color: active ? '#000000' : 'var(--color-silver-300)',
                      cursor: 'pointer',
                    }}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Stream List */}
          {loadingEvents ? (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-silver-300)' }}>
                Loading event stream...
              </p>
            </div>
          ) : explorerEvents.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
                No events match this filter combination.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {explorerEvents.map((ev) => {
                const isClick = ev.eventType === 'CLICK';
                const isPage = ev.eventType === 'PAGE_VIEW';
                const isScroll = ev.eventType === 'SCROLL_DEPTH';
                const isForm = ev.eventType.includes('FORM');

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    style={{
                      backgroundColor: '#0a0a0d',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '14px 18px',
                      borderRadius: '2px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      {/* Timestamp */}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-gray-500)', minWidth: '70px' }}>
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>

                      {/* Event Type Badge */}
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          padding: '2px 8px',
                          borderRadius: '2px',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          backgroundColor: isClick ? '#ffffff' : isPage ? 'rgba(255,255,255,0.1)' : isScroll ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                          color: isClick ? '#000000' : '#ffffff',
                        }}
                      >
                        {ev.displayType || ev.eventType}
                      </span>

                      {/* Event Description / Label */}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#ffffff', fontWeight: 600 }}>
                        {ev.label || ev.elementText || ev.page}
                      </span>

                      {/* Page Tag */}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', backgroundColor: '#141418', padding: '2px 6px', borderRadius: '2px' }}>
                        {ev.page}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Visitor Tag */}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                        {ev.visitorLabel || 'Visitor'}
                      </span>

                      {/* Session Tag */}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                        {ev.sessionLabel || 'Session'}
                      </span>

                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                        Details →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#0a0a0d',
              border: '1px solid var(--border-subtle)',
              padding: '12px 18px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={!paginationInfo.hasPrevPage || loadingEvents}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: paginationInfo.hasPrevPage ? '#ffffff' : 'var(--color-gray-500)',
                padding: '6px 12px',
                borderRadius: '2px',
                cursor: paginationInfo.hasPrevPage ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span style={{ color: 'var(--color-silver-300)' }}>
              Page <strong style={{ color: '#ffffff' }}>{paginationInfo.page}</strong> of <strong style={{ color: '#ffffff' }}>{paginationInfo.totalPages}</strong> ({paginationInfo.totalCount} total actions)
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={!paginationInfo.hasNextPage || loadingEvents}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: paginationInfo.hasNextPage ? '#ffffff' : 'var(--color-gray-500)',
                padding: '6px 12px',
                borderRadius: '2px',
                cursor: paginationInfo.hasNextPage ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: USER JOURNEYS & FUNNEL */}
      {/* ======================================================== */}
      {subTab === 'journeys' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 5-Step Lightweight Funnel */}
          <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LIGHTWEIGHT PROGRESSION FUNNEL
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                Visitor Progression & Drop-Off Points
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                Identifies progression from first page visit through CTA interaction, form engagement, and feedback.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {funnel.steps.map((step) => (
                <div key={step.stepIndex} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{step.name}</span>
                      <span style={{ color: 'var(--color-gray-500)', fontSize: '0.6875rem' }}>— {step.description}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>{step.count} visitor(s)</span>
                      <span style={{ color: 'var(--color-silver-300)' }}>({step.overallPercentage}%)</span>
                      {step.stepIndex > 1 && step.dropOffCount > 0 && (
                        <span style={{ color: '#f87171', fontSize: '0.6875rem' }}>
                          -{step.dropOffCount} ({step.dropOffPercentage}% drop-off)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Funnel Progress Bar */}
                  <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(2, Math.min(100, step.overallPercentage))}%`,
                        height: '100%',
                        backgroundColor: step.stepIndex === 1 ? '#ffffff' : step.stepIndex === 2 ? '#d4d4d8' : step.stepIndex === 3 ? '#a1a1aa' : step.stepIndex === 4 ? '#71717a' : '#52525b',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observed User Paths */}
          <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                OBSERVED SEQUENTIAL PATHS
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                Observed User Paths
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                Observed action sequences across sessions. Strictly observational; does not claim causality.
              </p>
            </div>

            {observedPaths.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
                No multi-step user paths recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {observedPaths.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#121216',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '14px 18px',
                      borderRadius: '2px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                        Path #{idx + 1}:
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#ffffff', fontWeight: 600 }}>
                        {p.pathSummary}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>{p.sessionsCount} session(s)</span>
                      <span style={{ color: 'var(--color-silver-300)' }}>({p.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scroll Depth Milestones */}
          <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SCROLL DEPTH PENETRATION
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                Scroll Depth Reached by Visitors
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {[
                { depth: '25%', data: scrollDistribution.reaching25 },
                { depth: '50%', data: scrollDistribution.reaching50 },
                { depth: '75%', data: scrollDistribution.reaching75 },
                { depth: '100%', data: scrollDistribution.reaching100 },
              ].map((item) => (
                <div key={item.depth} style={{ backgroundColor: '#121216', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '2px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>
                    Reached {item.depth}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                    {item.data.percentage}%
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                    {item.data.count} visitor(s)
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '2px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              Individual Anonymous Visitor Profiles
            </h3>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
              Click any visitor to inspect their sequential interaction timeline. Zero personal identities stored.
            </p>
          </div>

          {visitors.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
                No visitor profiles recorded yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {visitors.map((v) => (
                <div
                  key={v.visitorId}
                  style={{
                    backgroundColor: '#0a0a0d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                      {v.displayLabel}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        padding: '2px 8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'var(--color-silver-300)',
                        borderRadius: '2px',
                      }}
                    >
                      {v.deviceType}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--color-gray-500)' }}>Actions: </span>
                      <strong style={{ color: '#ffffff' }}>{v.actionsCount}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-gray-500)' }}>Sessions: </span>
                      <strong style={{ color: '#ffffff' }}>{v.sessionsCount}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-gray-500)' }}>Pages: </span>
                      <strong style={{ color: '#ffffff' }}>{v.pagesViewedCount}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-gray-500)' }}>Feedback: </span>
                      <strong style={{ color: v.hasFeedback ? '#4ade80' : 'var(--color-gray-500)' }}>
                        {v.hasFeedback ? `Yes (${v.feedbackRating || 'N/A'}/5)` : 'None'}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setInspectedVisitor(v)}
                    className="btn-secondary"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px', marginTop: '6px' }}
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
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
              backgroundColor: '#0c0c0f',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', textTransform: 'uppercase' }}>
                EVENT DETAILS
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              {selectedEvent.label || selectedEvent.eventType}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-gray-500)' }}>Event Type</span>
                <span style={{ color: '#ffffff' }}>{selectedEvent.displayType || selectedEvent.eventType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-gray-500)' }}>Element Target</span>
                <span style={{ color: '#ffffff', wordBreak: 'break-all' }}>{selectedEvent.element || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-gray-500)' }}>Page Route</span>
                <span style={{ color: '#ffffff' }}>{selectedEvent.page}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-gray-500)' }}>Timestamp</span>
                <span style={{ color: '#ffffff' }}>{new Date(selectedEvent.timestamp).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-gray-500)' }}>Visitor</span>
                <span style={{ color: '#ffffff' }}>{selectedEvent.visitorLabel || selectedEvent.visitorId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--color-gray-500)' }}>Session</span>
                <span style={{ color: '#ffffff' }}>{selectedEvent.sessionLabel || selectedEvent.sessionId}</span>
              </div>
              {selectedEvent.metadata && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ color: 'var(--color-gray-500)', display: 'block', marginBottom: '4px' }}>Metadata</span>
                  <pre style={{ backgroundColor: '#141418', padding: '10px', borderRadius: '2px', fontSize: '0.6875rem', overflowX: 'auto', color: '#d4d4d8' }}>
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
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
              backgroundColor: '#0c0c0f',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', textTransform: 'uppercase' }}>
                VISITOR ACTIVITY TIMELINE
              </div>
              <button onClick={() => setInspectedVisitor(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                {inspectedVisitor.displayLabel}
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)' }}>
                {inspectedVisitor.actionsCount} actions • {inspectedVisitor.sessionsCount} session(s)
              </div>
            </div>

            {inspectedVisitor.hasFeedback && (
              <div style={{ backgroundColor: '#101612', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '12px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#4ade80', textTransform: 'uppercase' }}>
                  Tester Feedback ({inspectedVisitor.feedbackRating}/5)
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.8125rem', color: '#ffffff', marginTop: '4px', fontStyle: 'italic' }}>
                  "{inspectedVisitor.feedbackComment || 'No comment provided'}"
                </p>
              </div>
            )}

            {/* Timeline sequence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {inspectedVisitor.timeline.length === 0 ? (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                  No individual action items found for this visitor.
                </div>
              ) : (
                inspectedVisitor.timeline.map((item: any, i: number) => (
                  <div
                    key={item.id || i}
                    style={{
                      backgroundColor: '#121216',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '10px 14px',
                      borderRadius: '2px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'var(--color-gray-500)', fontSize: '0.6875rem' }}>#{i + 1}</span>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          padding: '1px 6px',
                          borderRadius: '2px',
                          backgroundColor: item.eventType === 'CLICK' ? '#ffffff' : 'rgba(255,255,255,0.1)',
                          color: item.eventType === 'CLICK' ? '#000000' : '#ffffff',
                          fontWeight: 600,
                        }}
                      >
                        {item.displayType || item.eventType}
                      </span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{item.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--color-silver-300)', fontSize: '0.6875rem' }}>{item.page}</span>
                      <span style={{ color: 'var(--color-gray-500)', fontSize: '0.6875rem' }}>
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
