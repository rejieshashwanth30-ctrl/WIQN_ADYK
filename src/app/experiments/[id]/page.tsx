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

  const [experiment, setExperiment] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'prototype' | 'analytics' | 'feedback' | 'insights' | 'decision'>('overview');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [snippetMode, setSnippetMode] = useState<'production' | 'local'>('production');
  const [selectedDecision, setSelectedDecision] = useState<DecisionOutcome>('IMPROVE');
  const [decisionReasoning, setDecisionReasoning] = useState('');
  const [decisionNextStep, setDecisionNextStep] = useState('');
  const [savingDecision, setSavingDecision] = useState(false);
  const [decisionNotice, setDecisionNotice] = useState<string | null>(null);
  const [showBenchmarkInsights, setShowBenchmarkInsights] = useState(false);
  const [showBenchmarkFeedback, setShowBenchmarkFeedback] = useState(false);
  const [showBenchmarkFunnel, setShowBenchmarkFunnel] = useState(false);
  
  // Qualitative feedback logging state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackPrompt, setFeedbackPrompt] = useState('Observed Interaction Friction');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(3);
  const [feedbackCategory, setFeedbackCategory] = useState('clarity');
  const [savingFeedback, setSavingFeedback] = useState(false);

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Compute production vs local snippet origins
  const prodOrigin = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? window.location.origin : 'https://wiqn.adyk.io');
  const localOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const effectiveOrigin = snippetMode === 'production' ? prodOrigin : localOrigin;
  const currentSnippet = `<script src="${effectiveOrigin}/tracker.js" data-experiment="${experimentId}" data-endpoint="${effectiveOrigin}/api/capture" async></script>`;

  const loadExperiment = async () => {
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
  };

  useEffect(() => {
    loadExperiment();
  }, [experimentId]);

  const copyTrackerSnippet = (forceProduction: boolean = false) => {
    const originToUse = forceProduction ? prodOrigin : effectiveOrigin;
    const snippet = `<script src="${originToUse}/tracker.js" data-experiment="${experimentId}" data-endpoint="${originToUse}/api/capture" async></script>`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  // Persist Executive Decision to Neon
  const handleSaveDecision = async () => {
    if (!experiment) return;
    setSavingDecision(true);
    setDecisionNotice(null);

    const summary = experiment.telemetrySummary
      ? `Based on ${experiment.metrics.visitorsCount} visitor(s), ${experiment.metrics.interactionsCount} event(s), and ${experiment.metrics.feedbackCount} feedback note(s).`
      : `Based on recorded evidence in experiment ${experiment.id}.`;

    try {
      const res = await fetch(`/api/experiments/${experiment.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome: selectedDecision,
          evidenceSummary: summary,
          reasoning: decisionReasoning.trim() || `Executive directional choice: ${selectedDecision}. Supporting hypothesis validation.`,
          confidence: experiment.metrics.interactionsCount >= 20 ? 'HIGH' : 'LOW',
          recommendedNextStep: decisionNextStep.trim() || 'Monitor interaction velocity and observe conversion drop-offs.',
          limitations: experiment.metrics.interactionsCount < 20 ? 'Early-stage telemetry. High statistical variance.' : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setDecisionNotice(`DECISION RECORDED IN NEON POSTGRESQL (${selectedDecision})`);
        setDecisionReasoning('');
        setDecisionNextStep('');
        await loadExperiment();
      } else {
        alert(data.error || 'Failed to save decision.');
      }
    } catch (err) {
      console.error('Error saving decision to Neon:', err);
      alert('Network failure connecting to Neon decision registry.');
    } finally {
      setSavingDecision(false);
    }
  };

  // Persist Qualitative Feedback to Neon
  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    setSavingFeedback(true);

    try {
      const res = await fetch(`/api/experiments/${experimentId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: feedbackPrompt.trim(),
          comment: feedbackComment.trim(),
          rating: feedbackRating,
          category: feedbackCategory,
        }),
      });

      if (res.ok) {
        setFeedbackComment('');
        setShowFeedbackModal(false);
        await loadExperiment();
      }
    } catch (err) {
      console.error('Error saving feedback:', err);
    } finally {
      setSavingFeedback(false);
    }
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
              onClick={() => copyTrackerSnippet(true)}
              className="btn-secondary"
              style={{ fontSize: '0.6875rem', padding: '9px 14px' }}
            >
              {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSnippet ? 'Production Tag Copied' : 'Copy Production Tag (HTTPS)'}</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-silver-300)', textTransform: 'uppercase' }}>
                  AUTOCAPTURE SCRIPT TAG // ZERO-CONFIGURATION
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSnippetMode('production')}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      padding: '4px 10px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      border: snippetMode === 'production' ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
                      backgroundColor: snippetMode === 'production' ? '#ffffff' : 'transparent',
                      color: snippetMode === 'production' ? '#000000' : 'var(--color-silver-300)',
                    }}
                  >
                    PRODUCTION (HTTPS)
                  </button>
                  <button
                    onClick={() => setSnippetMode('local')}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      padding: '4px 10px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      border: snippetMode === 'local' ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
                      backgroundColor: snippetMode === 'local' ? '#ffffff' : 'transparent',
                      color: snippetMode === 'local' ? '#000000' : 'var(--color-silver-300)',
                    }}
                  >
                    LOCAL DEV (LOCALHOST)
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                {snippetMode === 'production' ? (
                  <span>
                    Paste this snippet into the <code style={{ color: '#ffffff' }}>&lt;head&gt;</code> of your deployed prototype. It connects to the actual production HTTPS capture API and will <strong>never point to localhost</strong>:
                  </span>
                ) : (
                  <span style={{ color: '#d4d4d8' }}>
                    <strong>DEVELOPMENT ONLY:</strong> Points to local dev server (port 3000). Do not embed this tag on publicly deployed prototypes.
                  </span>
                )}
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
                <code>{currentSnippet}</code>
                <button onClick={() => copyTrackerSnippet(snippetMode === 'production')} className="btn-ghost" style={{ flexShrink: 0, marginLeft: '12px' }}>
                  {copiedSnippet ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)', display: 'flex', gap: '16px' }}>
                <span>HOST: {effectiveOrigin}</span>
                <span>ENDPOINT: {effectiveOrigin}/api/capture</span>
                <span>PRIVACY: PII &amp; PASSWORDS REDACTED</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & TELEMETRY */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {(!experiment.metrics || experiment.metrics.interactionsCount === 0) ? (
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
                  Share your testing link or paste the production Autocapture tag to begin collecting evidence.
                </p>
                <button onClick={() => copyTrackerSnippet(true)} className="btn-primary">
                  <span>Copy Production Autocapture Tag</span>
                </button>
              </div>
            ) : (
              /* Real Telemetry Visualizations (Monochromatic & Honest) */
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

                {/* Real Telemetry Breakdown */}
                {experiment.telemetrySummary && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {/* Event Type Breakdown */}
                    <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '16px' }}>
                        EVENT TYPE DISTRIBUTION (MEASURED)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.entries(experiment.telemetrySummary.eventBreakdown || {}).map(([type, count]: [string, any]) => (
                          <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                            <span style={{ color: '#ffffff' }}>// {type}</span>
                            <span style={{ color: 'var(--color-silver-300)' }}>{count} event(s)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Clicked Elements */}
                    <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '16px' }}>
                        TOP TRIGGERED ELEMENTS
                      </div>
                      {experiment.telemetrySummary.topInteractions && experiment.telemetrySummary.topInteractions.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {experiment.telemetrySummary.topInteractions.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                              <span style={{ color: '#ffffff', wordBreak: 'break-all' }}>{item.element}</span>
                              <span style={{ color: 'var(--color-silver-300)', flexShrink: 0, marginLeft: '12px' }}>{item.count} ({item.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                          No interactive elements clicked yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Optional Benchmark Funnel Toggle */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <button
                    onClick={() => setShowBenchmarkFunnel(!showBenchmarkFunnel)}
                    className="btn-ghost"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                  >
                    <span>{showBenchmarkFunnel ? 'Hide Benchmark Reference Model' : 'View Benchmark Funnel Reference (Phase 1 Sample)'}</span>
                  </button>

                  {showBenchmarkFunnel && (
                    <div style={{ marginTop: '16px', backgroundColor: '#0c0c0e', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="badge">SAMPLE / BENCHMARK REFERENCE ONLY</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                          DEMO FIXTURE: CARDEX ALPHA (exp_wiqn_alpha_01)
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>01. LANDING &amp; INITIALIZATION</span>
                            <span>142 USERS (100%)</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>02. CHECKOUT FLOW INITIATION</span>
                            <span>91 USERS (64.2%)</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ width: '64.2%', height: '100%', backgroundColor: '#d4d4d8' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>03. AUTHORIZATION MODAL DISPLAY</span>
                            <span>54 USERS (38.0%)</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ width: '38%', height: '100%', backgroundColor: '#a1a1aa' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUALITATIVE SIGNALS */}
        {activeTab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>
                  Tester Observations &amp; Friction Points
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Recorded feedback and observations scoped to this experiment in Neon PostgreSQL.
                </p>
              </div>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="btn-primary"
                style={{ fontSize: '0.6875rem', padding: '8px 14px' }}
              >
                + Log Test Observation
              </button>
            </div>

            {/* Modal to log qualitative observation */}
            {showFeedbackModal && (
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '24px',
                  borderRadius: '2px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', marginBottom: '14px', textTransform: 'uppercase' }}>
                  LOG TEST OBSERVATION // PERSISTS TO NEON POSTGRESQL
                </div>
                <form onSubmit={handleSaveFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                      PROMPT / CONTEXT
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackPrompt}
                      onChange={(e) => setFeedbackPrompt(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                      OBSERVATION / TESTER FEEDBACK
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="e.g. Founder observed hesitation around wallet signature prompt..."
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                        CATEGORY
                      </label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        style={{ padding: '8px 12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px' }}
                      >
                        <option value="clarity">Clarity</option>
                        <option value="blocker">Blocker</option>
                        <option value="value">Value Proposition</option>
                        <option value="friction">Friction</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                        SEVERITY / RATING (1-5)
                      </label>
                      <select
                        value={feedbackRating}
                        onChange={(e) => setFeedbackRating(Number(e.target.value))}
                        style={{ padding: '8px 12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px' }}
                      >
                        <option value={1}>1 - Critical Blocker</option>
                        <option value={2}>2 - Severe Friction</option>
                        <option value={3}>3 - Moderate Friction</option>
                        <option value={4}>4 - Minor Note</option>
                        <option value={5}>5 - Positive Validation</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" disabled={savingFeedback} className="btn-primary" style={{ fontSize: '0.6875rem', padding: '8px 16px' }}>
                      {savingFeedback ? 'Saving to Neon...' : 'Save Observation'}
                    </button>
                    <button type="button" onClick={() => setShowFeedbackModal(false)} className="btn-secondary" style={{ fontSize: '0.6875rem', padding: '8px 16px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Real Feedback from Neon */}
            {experiment.feedback && experiment.feedback.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {experiment.feedback.map((fb: any) => (
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
                        <span className="badge">CATEGORY: {(fb.category || 'GENERAL').toUpperCase()}</span>
                        {fb.rating && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                            RATING: {fb.rating}/5
                          </span>
                        )}
                      </div>

                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '10px' }}>
                        Prompt: &quot;{fb.prompt}&quot;
                      </div>

                      <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-white)', lineHeight: 1.6 }}>
                        &ldquo;{fb.comment}&rdquo;
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                      RECORDED IN NEON: {new Date(fb.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  padding: '60px 24px',
                  textAlign: 'center',
                  borderRadius: '2px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  STATUS // ZERO_SIGNALS
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px' }}>
                  NO QUALITATIVE TESTER OBSERVATIONS RECORDED YET
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
                  Capture real qualitative observations during user testing, or review the benchmark reference model.
                </p>
                <button onClick={() => setShowFeedbackModal(true)} className="btn-primary" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>
                  Log First Observation
                </button>
              </div>
            )}

            {/* Optional Benchmark Feedback Toggle */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '12px' }}>
              <button
                onClick={() => setShowBenchmarkFeedback(!showBenchmarkFeedback)}
                className="btn-ghost"
                style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
              >
                <span>{showBenchmarkFeedback ? 'Hide Benchmark Feedback' : 'Inspect Benchmark Reference Feedback (Cardex Alpha Sample)'}</span>
              </button>

              {showBenchmarkFeedback && (
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {REFERENCE_FEEDBACK.map((fb) => (
                    <div
                      key={fb.id}
                      style={{
                        backgroundColor: '#0c0c0e',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '20px',
                        borderRadius: '2px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge">SAMPLE: {fb.category.toUpperCase()}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                          BENCHMARK FIXTURE
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-200)', lineHeight: 1.5 }}>
                        &ldquo;{fb.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: AI INSIGHTS */}
        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ maxWidth: '780px' }}>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>EMPIRICAL EVIDENCE SYNTHESIS</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Evidence Synthesis &amp; Validation
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-silver-300)' }}>
                Directly derived from {experiment.metrics?.interactionsCount || 0} autocaptured telemetry event(s) and {experiment.metrics?.visitorsCount || 0} unique visitor(s).
              </p>
            </div>

            {/* Check honest statistical evidence threshold */}
            {(!experiment.telemetrySummary || !experiment.telemetrySummary.isSufficientEvidence) ? (
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  padding: '36px',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} style={{ color: '#ffffff' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#ffffff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    STATUS // INSUFFICIENT_EVIDENCE (SAMPLE THRESHOLD NOT REACHED)
                  </span>
                </div>

                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6 }}>
                  To maintain scientific rigor and prevent premature confirmation bias, automated recommendations require a minimum baseline sample size before declaring statistical significance.
                </p>

                {/* Progress Meters */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', backgroundColor: '#121215', padding: '20px', borderRadius: '2px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                      <span>VISITOR QUOTA</span>
                      <span>{experiment.metrics?.visitorsCount || 0} / 5 MINIMUM</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, ((experiment.metrics?.visitorsCount || 0) / 5) * 100)}%`, height: '100%', backgroundColor: '#ffffff' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                      <span>INTERACTION EVENT STREAM</span>
                      <span>{experiment.metrics?.interactionsCount || 0} / 20 MINIMUM</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, ((experiment.metrics?.interactionsCount || 0) / 20) * 100)}%`, height: '100%', backgroundColor: '#ffffff' }} />
                    </div>
                  </div>
                </div>

                {/* Preliminary Empirical Facts (If events exist) */}
                {experiment.telemetrySummary?.empiricalFacts && experiment.telemetrySummary.empiricalFacts.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', marginBottom: '12px', textTransform: 'uppercase' }}>
                      PRELIMINARY MEASURED EMPIRICAL FACTS ({experiment.telemetrySummary.empiricalFacts.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {experiment.telemetrySummary.empiricalFacts.map((fact: any) => (
                        <div key={fact.id} style={{ backgroundColor: '#101014', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 20px', borderRadius: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>
                              // {fact.title}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                              CONFIDENCE: {fact.confidence}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-200)', lineHeight: 1.5, marginBottom: '8px' }}>
                            {fact.statement}
                          </p>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', backgroundColor: '#0a0a0d', padding: '8px 12px', borderRadius: '2px' }}>
                            EVIDENCE: {fact.evidence}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)', marginTop: '6px' }}>
                            LIMITATION: {fact.limitations}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inspect Benchmark Model Toggle */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                  <button
                    onClick={() => setShowBenchmarkInsights(!showBenchmarkInsights)}
                    className="btn-ghost"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                  >
                    <span>{showBenchmarkInsights ? 'Hide Benchmark Model' : 'Inspect Architectural Benchmark Model (Cardex Alpha)'}</span>
                  </button>

                  {showBenchmarkInsights && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="badge" style={{ alignSelf: 'flex-start' }}>
                        SAMPLE / BENCHMARK REFERENCE ONLY — NOT LIVE EXPERIMENT EVIDENCE
                      </div>
                      {REFERENCE_INSIGHTS.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: '#0c0c0e',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '20px 24px',
                            borderRadius: '2px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span className="badge">{item.type}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                              CONFIDENCE: {item.confidence}
                            </span>
                          </div>
                          <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.875rem', marginBottom: '6px' }}>
                            {item.title}
                          </div>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-200)', lineHeight: 1.5 }}>
                            {item.statement}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Sufficient Evidence Reached - Render Full Empirical Insights */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {experiment.telemetrySummary?.empiricalFacts?.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#0a0a0d',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      padding: '28px 32px',
                      borderRadius: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-active">EMPIRICAL FACT</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>
                          {item.title}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                        CONFIDENCE: <strong style={{ color: '#ffffff' }}>{item.confidence}</strong>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-primary)', fontSize: '1rem', color: '#ffffff', lineHeight: 1.6, marginBottom: '16px' }}>
                      {item.statement}
                    </p>
                    <div style={{ backgroundColor: '#121215', padding: '12px 16px', borderRadius: '2px', marginBottom: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)' }}>
                      <strong style={{ color: 'var(--color-white)' }}>MEASURED EVIDENCE: </strong>
                      {item.evidence}
                    </div>
                    {item.limitations && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                        <strong>LIMITATION: </strong>
                        {item.limitations}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                Commit to an empirical product direction backed by evidence, reasoning, and identified limitations. Decisions are stored permanently in Neon PostgreSQL.
              </p>
            </div>

            {decisionNotice && (
              <div style={{ backgroundColor: '#0e1410', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '14px 18px', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff' }}>
                ✓ {decisionNotice}
              </div>
            )}

            {/* Statistical Warning if Sample Size is Low */}
            {experiment.metrics?.interactionsCount < 20 && (
              <div style={{ backgroundColor: '#141108', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '14px 18px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={16} style={{ color: '#ffffff', flexShrink: 0 }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-200)', lineHeight: 1.5 }}>
                  DATA INTEGRITY NOTICE: Only {experiment.metrics?.interactionsCount || 0} interaction event(s) recorded. Any directional decision made now carries exploratory confidence (LOW).
                </div>
              </div>
            )}

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

            {/* Structured Decision Form & Persistence */}
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
                    SELECTED DIRECTION:
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                    {selectedDecision}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                    EVIDENCE CONFIDENCE:
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                    {experiment.metrics?.interactionsCount >= 20 ? 'HIGH' : 'LOW (EXPLORATORY)'}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  REASONING &amp; CORE JUSTIFICATION
                </label>
                <textarea
                  rows={3}
                  value={decisionReasoning}
                  onChange={(e) => setDecisionReasoning(e.target.value)}
                  placeholder={`Detail why you are committing to ${selectedDecision} based on observed prototype friction...`}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  RECOMMENDED NEXT ACTION / SPRINT TARGET
                </label>
                <input
                  type="text"
                  value={decisionNextStep}
                  onChange={(e) => setDecisionNextStep(e.target.value)}
                  placeholder="e.g. Redesign confirmation banner or deploy A/B copy test..."
                  style={{ width: '100%', padding: '12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', borderRadius: '2px' }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                  DATA SOURCE: NEON POSTGRESQL // SCHEMA: WIQN.DECISIONS
                </span>

                <button
                  onClick={handleSaveDecision}
                  disabled={savingDecision}
                  className="btn-primary"
                  style={{ fontSize: '0.75rem', padding: '10px 20px' }}
                >
                  {savingDecision ? 'Saving to Neon...' : 'Confirm & Persist Direction'}
                </button>
              </div>
            </div>

            {/* Decision Audit Trail from Neon */}
            {experiment.decisions && experiment.decisions.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '28px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>
                  PERSISTED DECISION AUDIT TRAIL ({experiment.decisions.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {experiment.decisions.map((dec: any) => (
                    <div key={dec.id} style={{ backgroundColor: '#0a0a0d', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '24px', borderRadius: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span className="badge badge-active">{dec.outcome}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                          RECORDED: {new Date(dec.decidedAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '8px' }}>
                        {dec.reasoning}
                      </p>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                        NEXT STEP: {dec.recommendedNextStep}
                      </div>
                      {dec.limitations && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)', marginTop: '6px' }}>
                          LIMITATIONS: {dec.limitations}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
