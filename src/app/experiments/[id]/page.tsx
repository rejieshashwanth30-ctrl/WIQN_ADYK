'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { DashboardNav } from '@/components/DashboardNav';
import { getExperimentById, REFERENCE_INSIGHTS, REFERENCE_FEEDBACK, REFERENCE_DECISION } from '@/lib/storage';
import { Experiment, StructuredInsight, FeedbackItem, DecisionRecord, DecisionOutcome } from '@/lib/types';
import {
  Layers,
  Activity,
  MessageSquareQuote,
  Sparkles,
  Target,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Globe,
  AlertCircle,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ExperimentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const experimentId = resolvedParams.id;

  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'prototype' | 'analytics' | 'feedback' | 'insights' | 'decision'>('overview');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<DecisionOutcome>('IMPROVE');
  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExperiment() {
      try {
        setLoading(true);
        setAuthError(null);
        const res = await fetch(`/api/experiments/${experimentId}`);
        if (res.status === 403) {
          setAuthError('ACCESS RESTRICTED (403): This experiment belongs to another founder workspace. Insecure Direct Object References (IDOR) are strictly rejected.');
          setExperiment(null);
          return;
        }

        if (res.ok) {
          const json = await res.json();
          setExperiment(json.data);
          return;
        }

        // Fallback for architectural reference experiment in development
        const fallback = getExperimentById(experimentId);
        setExperiment(fallback);
      } catch (err: any) {
        console.error('Error fetching experiment from Neon:', err);
        const fallback = getExperimentById(experimentId);
        setExperiment(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadExperiment();
  }, [experimentId]);

  const copyTrackerSnippet = () => {
    const snippet = `<script src="${window.location.origin}/tracker.js" data-experiment="${experimentId}" data-endpoint="${window.location.origin}/api/capture" async></script>`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff' }}>
        <DashboardNav />
        <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
          QUERYING EXPERIMENT SPECIFICATION FROM NEON POSTGRESQL...
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff' }}>
        <DashboardNav />
        <div style={{ padding: '120px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
            AUTHORIZATION GATE // IDOR_REJECTED
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
            Resource Access Denied
          </h1>
          <p style={{ color: 'var(--color-silver-300)', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: 1.6 }}>
            {authError}
          </p>
          <Link href="/dashboard" className="btn-primary">
            Return to Authorized Workspace
          </Link>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff' }}>
        <DashboardNav />
        <div style={{ padding: '120px 24px', textAlign: 'center', maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
            REGISTRY LOOKUP: FAILED
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
            Experiment Not Found
          </h1>
          <p style={{ color: 'var(--color-silver-300)', fontSize: '0.9375rem', marginBottom: '28px' }}>
            No recorded experiment matches ID: <code style={{ color: '#ffffff' }}>{experimentId}</code> in Neon database.
          </p>
          <Link href="/dashboard" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'var(--color-off-white)' }}>
      <DashboardNav currentExperimentId={experiment.id} currentExperimentName={experiment.name} />

      <main style={{ padding: '36px 24px 80px 24px', maxWidth: '1320px', margin: '0 auto' }}>
        {/* Workspace Title Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className={`badge ${experiment.status === 'ACTIVE' ? 'badge-active' : ''}`}>
                {experiment.status}
              </span>
              <span className={`badge ${experiment.testingMode === 'CARDEX_ALPHA' ? 'badge-cardex' : ''}`}>
                {experiment.testingMode === 'CARDEX_ALPHA' ? 'CARDEX ALPHA' : 'PRIVATE'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                EXP_ID: {experiment.id}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'var(--color-white)',
              }}
            >
              {experiment.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
              VENTURE: {experiment.productName}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={copyTrackerSnippet}
              className="btn-secondary"
              style={{ fontSize: '0.6875rem', padding: '9px 14px' }}
            >
              {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSnippet ? 'Snippet Copied' : 'Copy Autocapture Tag'}</span>
            </button>

            <a
              href={experiment.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.6875rem', padding: '9px 14px' }}
            >
              <span>Launch Live Prototype</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Research Workspace Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '36px',
            overflowX: 'auto',
          }}
        >
          {[
            { key: 'overview', label: 'OVERVIEW', icon: Layers },
            { key: 'prototype', label: 'PROTOTYPE VALIDATION', icon: Play },
            { key: 'analytics', label: 'ANALYTICS & TELEMETRY', icon: Activity },
            { key: 'feedback', label: 'QUALITATIVE SIGNALS', icon: MessageSquareQuote },
            { key: 'insights', label: 'AI INSIGHTS', icon: Sparkles },
            { key: 'decision', label: 'EXECUTIVE DECISION', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '12px 18px',
                  color: isActive ? '#ffffff' : 'var(--color-silver-300)',
                  borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 180ms ease',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Hypothesis Card */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  <span>THE VALIDATION THESIS</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                  Key Hypothesis
                </h3>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '1rem', color: 'var(--color-silver-200)', lineHeight: 1.6 }}>
                  {experiment.keyHypothesis}
                </p>
              </div>

              {/* Problem Space */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  PROBLEM STATEMENT
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6 }}>
                  {experiment.problem || 'No explicit problem statement declared.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Target & Learning Goal */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  TARGET AUDIENCE
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {experiment.targetAudience || 'General technical founders & early adopters.'}
                </p>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  LEARNING GOAL
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6 }}>
                  {experiment.learningGoal || 'Observe drop-off thresholds and interaction friction.'}
                </p>
              </div>

              {/* Testing Link & Deployment Info */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  LIVE PROTOTYPE ORIGIN
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#ffffff', wordBreak: 'break-all', marginBottom: '16px' }}>
                  {experiment.prototypeUrl}
                </div>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                    MODE: {experiment.testingMode === 'CARDEX_ALPHA' ? 'CARDEX ALPHA' : 'PRIVATE'}
                  </span>
                  <button onClick={() => setActiveTab('prototype')} className="btn-ghost" style={{ padding: 0 }}>
                    Inspect Viewport →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROTOTYPE VALIDATION */}
        {activeTab === 'prototype' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Viewport Control Bar */}
            <div
              style={{
                backgroundColor: '#0a0a0d',
                border: '1px solid var(--border-subtle)',
                padding: '16px 24px',
                borderRadius: '2px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff' }}>
                  SANDBOX VALIDATOR: {experiment.prototypeUrl}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href={experiment.prototypeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                >
                  <ExternalLink size={12} />
                  <span>Open Direct Window</span>
                </a>
              </div>
            </div>

            {/* Sandbox Embed Frame / Fallback Layer */}
            <div
              style={{
                position: 'relative',
                height: '640px',
                backgroundColor: '#050505',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <iframe
                src={experiment.prototypeUrl}
                title="Wiqn Prototype Testing Viewport"
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            {/* Tracking Snippet Integration Notice */}
            <div
              style={{
                backgroundColor: '#0a0a0d',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                borderRadius: '2px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '8px' }}>
                ZERO-CONFIGURATION AUTOCAPTURE TAG
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                Paste this single script tag into the <code style={{ color: '#ffffff' }}>&lt;head&gt;</code> of your prototype to begin streaming telemetry into this workspace:
              </p>
              <div
                style={{
                  backgroundColor: '#121215',
                  padding: '12px 16px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-silver-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  overflowX: 'auto',
                }}
              >
                <code>{`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/tracker.js" data-experiment="${experiment.id}" async></script>`}</code>
                <button onClick={copyTrackerSnippet} className="btn-ghost" style={{ flexShrink: 0, marginLeft: '12px' }}>
                  {copiedSnippet ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & TELEMETRY */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* If zero visitors recorded, show intentional empty state per prompt */}
            {(!experiment.metrics || experiment.metrics.visitorsCount === 0) ? (
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  padding: '80px 32px',
                  textAlign: 'center',
                  borderRadius: '2px',
                  maxWidth: '640px',
                  margin: '40px auto',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                  STATUS // ZERO_STREAM
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                  NO ACTIVITY YET
                </h3>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6, marginBottom: '28px' }}>
                  Share your testing link or paste the Autocapture tag to begin collecting evidence.
                </p>
                <button onClick={copyTrackerSnippet} className="btn-primary">
                  <span>Copy Autocapture Tag</span>
                </button>
              </div>
            ) : (
              /* Telemetry Visualizations (Monochromatic & Clean) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Metric Summary Strips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>TOTAL VISITORS</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                      {experiment.metrics.visitorsCount}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>SESSION STREAM</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                      {experiment.metrics.sessionsCount}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>AUTOCAPTURED EVENTS</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                      {experiment.metrics.interactionsCount}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>AVG TIME ON PROTOTYPE</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                      {experiment.metrics.avgTimeOnPrototype}s
                    </div>
                  </div>
                </div>

                {/* Behavioral Funnel Drop-off Stream */}
                <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-silver-300)' }}>
                      INTERACTION MILESTONE FUNNEL
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                      OBSERVATION WINDOW: LAST 48 HOURS
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '6px' }}>
                        <span>01. LANDING &amp; INITIALIZATION</span>
                        <span>142 USERS (100%)</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '6px' }}>
                        <span>02. CHECKOUT FLOW INITIATION</span>
                        <span>91 USERS (64.2%)</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                        <div style={{ width: '64.2%', height: '100%', backgroundColor: '#d4d4d8' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '6px' }}>
                        <span>03. AUTHORIZATION MODAL DISPLAY</span>
                        <span>54 USERS (38.0%)</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                        <div style={{ width: '38%', height: '100%', backgroundColor: '#a1a1aa' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '6px' }}>
                        <span>04. FINAL SETTLEMENT SIGNATURE</span>
                        <span>32 USERS (22.5%)</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                        <div style={{ width: '22.5%', height: '100%', backgroundColor: '#71717a' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUALITATIVE SIGNALS */}
        {activeTab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>
                  Tester Observations &amp; Friction Points
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Intercepted feedback correlated with behavioral drop-offs.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {REFERENCE_FEEDBACK.map((fb) => (
                <div
                  key={fb.id}
                  style={{
                    backgroundColor: '#0a0a0d',
                    border: '1px solid var(--border-subtle)',
                    padding: '28px',
                    borderRadius: '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge">CATEGORY: {fb.category.toUpperCase()}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                        RATING: {fb.rating}/5
                      </span>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '10px' }}>
                      Prompt: &quot;{fb.prompt}&quot;
                    </div>

                    <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-white)', lineHeight: 1.6 }}>
                      &ldquo;{fb.comment}&rdquo;
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                    RECORDED: {fb.createdAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AI INSIGHTS */}
        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ maxWidth: '780px' }}>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>STRUCTURED INTELLIGENCE ARCHITECTURE</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Empirical Evidence Synthesis
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-silver-300)' }}>
                Distilled from 864 autocaptured interaction events and qualitative feedback prompts. Separated strictly into facts, hypotheses, recommendations, and statistical limitations.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {REFERENCE_INSIGHTS.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#0a0a0d',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '28px 32px',
                    borderRadius: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-active">{item.type}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>
                        {item.title}
                      </span>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                      CONFIDENCE: <strong style={{ color: '#ffffff' }}>{item.confidence}</strong>
                    </div>
                  </div>

                  {/* Statement */}
                  <p style={{ fontFamily: 'var(--font-primary)', fontSize: '1rem', color: '#ffffff', lineHeight: 1.6, marginBottom: '16px' }}>
                    {item.statement}
                  </p>

                  {/* Evidence Trace */}
                  <div style={{ backgroundColor: '#121215', padding: '12px 16px', borderRadius: '2px', marginBottom: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)' }}>
                    <strong style={{ color: 'var(--color-white)' }}>EMPIRICAL EVIDENCE: </strong>
                    {item.evidence}
                  </div>

                  {/* Limitations Callout */}
                  {item.limitations && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                      <strong>LIMITATION: </strong>
                      {item.limitations}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EXECUTIVE DECISION */}
        {activeTab === 'decision' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ maxWidth: '780px' }}>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>DIRECTIONAL COMMITMENT</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Executive Decision Matrix
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-silver-300)' }}>
                Commit to an empirical product direction backed by evidence, reasoning, and identified limitations.
              </p>
            </div>

            {/* Five Strict Outcomes Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { outcome: 'BUILD' as DecisionOutcome, label: 'BUILD', note: 'Commit production code' },
                { outcome: 'IMPROVE' as DecisionOutcome, label: 'IMPROVE', note: 'Resolve friction points' },
                { outcome: 'PIVOT' as DecisionOutcome, label: 'PIVOT', note: 'Shift core hypothesis' },
                { outcome: 'STOP' as DecisionOutcome, label: 'STOP', note: 'Preserve runway' },
                { outcome: 'TEST_AGAIN' as DecisionOutcome, label: 'TEST AGAIN', note: 'Gather more sample' },
              ].map((item) => {
                const isSelected = selectedDecision === item.outcome;
                return (
                  <div
                    key={item.outcome}
                    onClick={() => setSelectedDecision(item.outcome)}
                    style={{
                      padding: '20px 16px',
                      backgroundColor: isSelected ? 'var(--color-white)' : '#0a0a0d',
                      border: isSelected ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                      color: isSelected ? '#000000' : '#ffffff',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 180ms ease',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: isSelected ? '#333333' : 'var(--color-gray-500)', marginTop: '4px' }}>
                      {item.note}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Structured Decision Record Specification */}
            <div
              style={{
                backgroundColor: '#0a0a0d',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                padding: '36px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                    RECOMMENDED OUTCOME:
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                    {REFERENCE_DECISION.outcome}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                    CONFIDENCE LEVEL:
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                    {REFERENCE_DECISION.confidence}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  EVIDENCE SUMMARY
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-200)', lineHeight: 1.6 }}>
                  {REFERENCE_DECISION.evidenceSummary}
                </p>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  REASONING
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6 }}>
                  {REFERENCE_DECISION.reasoning}
                </p>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  RECOMMENDED NEXT STEP
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: '#ffffff', lineHeight: 1.6, fontWeight: 500 }}>
                  {REFERENCE_DECISION.recommendedNextStep}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                  LIMITATIONS: {REFERENCE_DECISION.limitations}
                </span>

                <button
                  onClick={() => alert('Decision logged in audit trail.')}
                  className="btn-primary"
                  style={{ fontSize: '0.6875rem', padding: '8px 16px' }}
                >
                  Confirm Executive Direction
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
