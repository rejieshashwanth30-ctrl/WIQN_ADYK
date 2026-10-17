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
  AlertCircle,
  Clock,
  Play,
  HelpCircle,
  UserCheck,
  User,
  ArrowRight
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
  const [selectedDecision, setSelectedDecision] = useState<DecisionOutcome>('TEST_AGAIN');
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
  const [feedbackRating, setFeedbackRating] = useState<number>(3);
  const [feedbackCategory, setFeedbackCategory] = useState('clarity');
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

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
        setAuthError('You do not have permission to view this experiment. Each founder can only view their own experiments.');
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
      console.error('Error fetching experiment from database:', err);
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

  // Persist Decision to database
  const handleSaveDecision = async () => {
    if (!experiment) return;
    setSavingDecision(true);
    setDecisionNotice(null);

    const visitors = experiment.metrics?.visitorsCount || 0;
    const events = experiment.metrics?.interactionsCount || 0;
    const feedbackCount = experiment.metrics?.feedbackCount || 0;

    const summary = `Based on ${visitors} visitor(s), ${events} tracked action(s), and ${feedbackCount} feedback note(s).`;
    const isLowData = events < 20 || visitors < 5;

    try {
      const res = await fetch(`/api/experiments/${experiment.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome: selectedDecision,
          evidenceSummary: summary,
          reasoning: decisionReasoning.trim() || `Decision: ${selectedDecision}. Recorded to guide next steps.`,
          confidence: isLowData ? 'LOW' : 'MODERATE',
          recommendedNextStep: decisionNextStep.trim() || (isLowData ? 'Share prototype with more testers to collect clearer evidence.' : 'Continue testing and monitoring results.'),
          limitations: isLowData ? `Early testing: Only ${visitors} visitor(s) and ${events} action(s) recorded so far. More testing needed for high certainty.` : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        const decisionNameMap: Record<string, string> = {
          BUILD: 'Build It',
          IMPROVE: 'Improve It',
          PIVOT: 'Change Direction',
          STOP: 'Stop This Idea',
          TEST_AGAIN: 'Run Another Test',
        };
        setDecisionNotice(`Your decision (${decisionNameMap[selectedDecision] || selectedDecision}) has been recorded.`);
        setDecisionReasoning('');
        setDecisionNextStep('');
        await loadExperiment();
      } else {
        alert(data.error || 'Failed to save your decision. Please try again.');
      }
    } catch (err) {
      console.error('Error saving decision:', err);
      alert('Unable to save decision. Please check your connection and try again.');
    } finally {
      setSavingDecision(false);
    }
  };

  // Persist Qualitative Feedback / Observation
  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    setSavingFeedback(true);
    setFeedbackNotice(null);

    try {
      const res = await fetch(`/api/experiments/${experimentId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: feedbackPrompt.trim() || 'General Observation',
          comment: feedbackComment.trim(),
          rating: feedbackRating,
          category: feedbackCategory,
        }),
      });

      if (res.ok) {
        setFeedbackComment('');
        setShowFeedbackModal(false);
        setFeedbackNotice('Observation saved successfully.');
        await loadExperiment();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save observation.');
      }
    } catch (err) {
      console.error('Error saving feedback:', err);
      alert('Network error while saving observation.');
    } finally {
      setSavingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff' }}>
        <DashboardNav />
        <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
          LOADING EXPERIMENT DETAILS...
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
            ACCESS RESTRICTED
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
            Access Restricted
          </h1>
          <p style={{ color: 'var(--color-silver-300)', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: 1.6 }}>
            {authError}
          </p>
          <Link href="/dashboard" className="btn-primary">
            Return to My Experiments
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
            LOOKUP FAILED
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
            Experiment Not Found
          </h1>
          <p style={{ color: 'var(--color-silver-300)', fontSize: '0.9375rem', marginBottom: '28px' }}>
            We could not find an experiment matching ID: <code style={{ color: '#ffffff' }}>{experimentId}</code>.
          </p>
          <Link href="/dashboard" className="btn-primary">
            Return to My Experiments
          </Link>
        </div>
      </div>
    );
  }

  const visitorsCount = experiment.metrics?.visitorsCount || 0;
  const eventsCount = experiment.metrics?.interactionsCount || 0;
  const feedbackCount = experiment.metrics?.feedbackCount || 0;
  const isSufficientEvidence = experiment.telemetrySummary?.isSufficientEvidence || false;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${experiment.status === 'ACTIVE' ? 'badge-active' : ''}`}>
                {experiment.status === 'ACTIVE' ? 'ACTIVE TEST' : experiment.status}
              </span>
              <span className={`badge ${experiment.testingMode === 'CARDEX_ALPHA' ? 'badge-cardex' : ''}`}>
                {experiment.testingMode === 'CARDEX_ALPHA' ? 'CARDEX ALPHA' : 'PRIVATE'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                EXPERIMENT ID: {experiment.id}
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '6px' }}>
              Product: <span style={{ color: '#ffffff' }}>{experiment.productName}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => copyTrackerSnippet(true)}
              className="btn-secondary"
              style={{ fontSize: '0.6875rem', padding: '9px 14px' }}
              title="Copy the tracking script to paste into your website"
            >
              {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSnippet ? 'Tracking Code Copied!' : 'Copy Tracking Code'}</span>
            </button>

            <a
              href={experiment.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.6875rem', padding: '9px 14px' }}
            >
              <span>Open Prototype</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Tab Navigation in Plain English */}
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
            { key: 'prototype', label: 'TEST YOUR PROTOTYPE', icon: Play },
            { key: 'analytics', label: 'VISITOR ACTIVITY', icon: Activity },
            { key: 'feedback', label: 'TESTER FEEDBACK', icon: MessageSquareQuote },
            { key: 'insights', label: 'INSIGHTS & SUGGESTIONS', icon: Sparkles },
            { key: 'decision', label: 'DECIDE WHAT TO DO NEXT', icon: Target },
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
                  letterSpacing: '0.08em',
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
                <div className="eyebrow" style={{ marginBottom: '8px' }}>
                  <span className="eyebrow-dot" />
                  <span>WHAT YOU ARE TESTING</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                  Your Idea to Test
                </h3>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '1rem', color: 'var(--color-silver-200)', lineHeight: 1.6 }}>
                  {experiment.keyHypothesis}
                </p>
              </div>

              {/* Problem Space */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  THE PROBLEM YOU ARE SOLVING
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6 }}>
                  {experiment.problem || 'No specific problem description provided yet.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Target & Learning Goal */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  WHO THIS IS FOR
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {experiment.targetAudience || 'General prospective users and testers.'}
                </p>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  WHAT YOU WANT TO LEARN
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6 }}>
                  {experiment.learningGoal || 'Observe visitor reactions and see whether people complete key actions.'}
                </p>
              </div>

              {/* Prototype Link */}
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  PROTOTYPE LINK
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#ffffff', wordBreak: 'break-all', marginBottom: '16px' }}>
                  {experiment.prototypeUrl}
                </div>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                    MODE: {experiment.testingMode === 'CARDEX_ALPHA' ? 'CARDEX ALPHA' : 'PRIVATE'}
                  </span>
                  <button onClick={() => setActiveTab('prototype')} className="btn-ghost" style={{ padding: 0 }}>
                    Test In Prototype Viewport →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEST YOUR PROTOTYPE */}
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
                  Interactive Preview: {experiment.prototypeUrl}
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
                  <span>Open in New Tab</span>
                </a>
              </div>
            </div>

            {/* Sandbox Embed Frame */}
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
                title="Prototype Testing Viewport"
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
                  AUTOMATIC TRACKING SCRIPT // READY TO USE
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
                    LOCAL TESTING (LOCALHOST)
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginBottom: '12px', lineHeight: 1.5 }}>
                {snippetMode === 'production' ? (
                  <span>
                    Paste this snippet into the <code style={{ color: '#ffffff' }}>&lt;head&gt;</code> of your website or prototype. It automatically records visits and button clicks without saving personal information or passwords:
                  </span>
                ) : (
                  <span style={{ color: '#d4d4d8' }}>
                    <strong>FOR LOCAL TESTING ONLY:</strong> Points to your local computer (port 3000). Use the Production version for public testing.
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

              <div style={{ marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <span>HOST: {effectiveOrigin}</span>
                <span>ENDPOINT: {effectiveOrigin}/api/capture</span>
                <span>PRIVACY: Form passwords, payment details &amp; sensitive inputs are automatically redacted</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISITOR ACTIVITY */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>
                <span className="eyebrow-dot" />
                <span>VISITOR ACTIONS</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Visitor Activity
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-silver-300)' }}>
                See how many people tested your prototype, what they clicked, and how long they stayed. Tracking records interactions, not personal identities or intentions.
              </p>
            </div>

            {(!experiment.metrics || experiment.metrics.interactionsCount === 0) ? (
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  padding: '72px 32px',
                  textAlign: 'center',
                  borderRadius: '2px',
                  maxWidth: '640px',
                  margin: '20px auto',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                  NO ACTIVITY YET
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                  No Activity Yet
                </h3>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.6, marginBottom: '28px' }}>
                  Open your prototype and interact with it, or share it with testers. Their supported interactions will appear here after tracking is installed correctly.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => copyTrackerSnippet(true)} className="btn-primary">
                    <span>Copy Tracking Code</span>
                  </button>
                  <a href={experiment.prototypeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <span>Open Prototype</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Real Visitor Activity Visualizations */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Metric Summary Strips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                      Different people who visited
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                      {experiment.metrics.visitorsCount}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                      Total visits
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                      {experiment.metrics.sessionsCount}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                      Total tracked actions
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                      {experiment.metrics.interactionsCount}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                      Average time on page
                    </div>
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
                        ACTIONS TRACKED BY TYPE
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.entries(experiment.telemetrySummary.eventBreakdown || {}).map(([type, count]: [string, any]) => {
                          const humanLabels: Record<string, string> = {
                            PAGE_VIEW: 'Page Visits',
                            CLICK: 'Button & Link Clicks',
                            FORM_START: 'Form Inputs Started',
                            FORM_SUBMIT: 'Forms Submitted',
                            SCROLL_DEPTH: 'Scroll Milestones',
                          };
                          const label = humanLabels[type] || type.replace('_', ' ');
                          return (
                            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                              <span style={{ color: '#ffffff' }}>• {label}</span>
                              <span style={{ color: 'var(--color-silver-300)' }}>{count} action(s)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top Clicked Elements */}
                    <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '28px', borderRadius: '2px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '16px' }}>
                        MOST-CLICKED ELEMENTS
                      </div>
                      {experiment.telemetrySummary.topInteractions && experiment.telemetrySummary.topInteractions.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {experiment.telemetrySummary.topInteractions.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                              <span style={{ color: '#ffffff', wordBreak: 'break-all' }}>{item.element}</span>
                              <span style={{ color: 'var(--color-silver-300)', flexShrink: 0, marginLeft: '12px' }}>{item.count} click(s) ({item.percentage}%)</span>
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

                {/* Optional Benchmark Data Toggle */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <button
                    onClick={() => setShowBenchmarkFunnel(!showBenchmarkFunnel)}
                    className="btn-ghost"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                  >
                    <span>{showBenchmarkFunnel ? 'Hide Example Data' : 'View Example Data (Not Your Results)'}</span>
                  </button>

                  {showBenchmarkFunnel && (
                    <div style={{ marginTop: '16px', backgroundColor: '#0c0c0e', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                        <span className="badge">EXAMPLE DATA (NOT YOUR RESULTS)</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                          Sample data showing visitor activity with high traffic
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>1. Opened Prototype</span>
                            <span>142 visitors (100%)</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>2. Clicked Main Call-to-Action</span>
                            <span>91 visitors (64.2%)</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ width: '64.2%', height: '100%', backgroundColor: '#d4d4d8' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>3. Reached Confirmation Step</span>
                            <span>54 visitors (38.0%)</span>
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

        {/* TAB 4: TESTER FEEDBACK */}
        {activeTab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>
                  Tester Feedback
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Feedback, notes, and observations from people who tested your prototype.
                </p>
              </div>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="btn-primary"
                style={{ fontSize: '0.6875rem', padding: '8px 14px' }}
              >
                + Add Observation
              </button>
            </div>

            {feedbackNotice && (
              <div style={{ backgroundColor: '#0e1410', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '12px 16px', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff' }}>
                ✓ {feedbackNotice}
              </div>
            )}

            {/* Modal to log observation */}
            {showFeedbackModal && (
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '28px',
                  borderRadius: '2px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Add Observation
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginBottom: '18px' }}>
                  Record what you observed during user testing, or notes from direct tester conversations.
                </p>
                <form onSubmit={handleSaveFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                      WHAT DID YOU OBSERVE? (TOPIC OR SCREEN)
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackPrompt}
                      onChange={(e) => setFeedbackPrompt(e.target.value)}
                      placeholder="e.g. Signup button on mobile, pricing question"
                      style={{ width: '100%', padding: '10px 14px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                      WHAT HAPPENED? (THE TESTER&apos;S EXPERIENCE OR YOUR NOTES)
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="e.g. Tester couldn't find the signup button on mobile until they scrolled all the way to the bottom..."
                      style={{ width: '100%', padding: '10px 14px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                        FEEDBACK CATEGORY
                      </label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px' }}
                      >
                        <option value="clarity">Clarity (Did they understand it?)</option>
                        <option value="friction">Difficulty (Where did they get stuck?)</option>
                        <option value="value">Usefulness (Did they find it helpful?)</option>
                        <option value="suggestion">Suggestions (Ideas for improvement)</option>
                      </select>
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '6px' }}>
                        OPTIONAL RATING
                      </label>
                      <select
                        value={feedbackRating}
                        onChange={(e) => setFeedbackRating(Number(e.target.value))}
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '2px' }}
                      >
                        <option value={5}>5 - Clear and easy to use</option>
                        <option value={4}>4 - Minor note</option>
                        <option value={3}>3 - Moderate difficulty</option>
                        <option value={2}>2 - Significant friction</option>
                        <option value={1}>1 - Critical blocker</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" disabled={savingFeedback} className="btn-primary" style={{ fontSize: '0.6875rem', padding: '9px 18px' }}>
                      {savingFeedback ? 'Saving observation...' : 'Save Observation'}
                    </button>
                    <button type="button" onClick={() => setShowFeedbackModal(false)} className="btn-secondary" style={{ fontSize: '0.6875rem', padding: '9px 18px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Feedback List from Database */}
            {experiment.feedback && experiment.feedback.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {experiment.feedback.map((fb: any) => {
                  const isTesterSource = Boolean(fb.visitorId);
                  const categoryNameMap: Record<string, string> = {
                    clarity: 'Clarity',
                    friction: 'Difficulty',
                    blocker: 'Difficulty',
                    value: 'Usefulness',
                    suggestion: 'Suggestions',
                    general: 'General Note',
                  };
                  const categoryDisplay = categoryNameMap[fb.category?.toLowerCase()] || fb.category?.toUpperCase() || 'GENERAL';

                  return (
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
                        {/* Source & Category Badges */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isTesterSource ? (
                              <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <UserCheck size={11} />
                                <span>Tester feedback</span>
                              </span>
                            ) : (
                              <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <User size={11} />
                                <span>Founder observation</span>
                              </span>
                            )}
                            <span className="badge">{categoryDisplay}</span>
                          </div>

                          {fb.rating && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                              Rating: {fb.rating}/5
                            </span>
                          )}
                        </div>

                        {fb.prompt && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-silver-300)', marginBottom: '10px' }}>
                            Context: &ldquo;{fb.prompt}&rdquo;
                          </div>
                        )}

                        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-white)', lineHeight: 1.6 }}>
                          &ldquo;{fb.comment}&rdquo;
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                        Submitted on {new Date(fb.createdAt).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
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
                  NO FEEDBACK YET
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px' }}>
                  No Feedback Yet
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                  Feedback will appear here when testers share their experience. You can also record your own observations.
                </p>
                <button onClick={() => setShowFeedbackModal(true)} className="btn-primary" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>
                  Add First Observation
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
                <span>{showBenchmarkFeedback ? 'Hide Example Feedback' : 'View Example Data (Not Your Results)'}</span>
              </button>

              {showBenchmarkFeedback && (
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  <div className="badge" style={{ gridColumn: '1 / -1', alignSelf: 'flex-start' }}>
                    EXAMPLE DATA (NOT YOUR RESULTS) — Sample tester feedback for reference
                  </div>
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
                        <span className="badge">EXAMPLE: {fb.category.toUpperCase()}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                          SAMPLE FEEDBACK
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

        {/* TAB 5: INSIGHTS & SUGGESTIONS */}
        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* A. Page Heading */}
            <div style={{ maxWidth: '820px' }}>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>
                <span className="eyebrow-dot" />
                <span>UNDERSTAND YOUR RESULTS</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Understand Your Results
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
                See what people do on your prototype, where they struggle, and what you can improve.
              </p>
            </div>

            {/* B. Three Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                  People who visited
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                  {visitorsCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                  {visitorsCount === 1 ? '1 different person' : `${visitorsCount} different people`}
                </div>
              </div>

              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                  Actions tracked
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                  {eventsCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                  {eventsCount === 1 ? '1 click or page view' : `${eventsCount} clicks and page views`}
                </div>
              </div>

              <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                  Feedback received
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                  {feedbackCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                  {feedbackCount === 1 ? '1 note or response' : `${feedbackCount} notes and responses`}
                </div>
              </div>
            </div>

            {/* C. Testing Progress Panel (When sample is too small) */}
            {!isSufficientEvidence && (
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  padding: '32px',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={20} style={{ color: '#ffffff', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                      We&apos;re Still Collecting Evidence
                    </h3>
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-silver-200)', lineHeight: 1.6 }}>
                  Your prototype has been visited by {visitorsCount} {visitorsCount === 1 ? 'person' : 'people'} and recorded {eventsCount} {eventsCount === 1 ? 'action' : 'actions'}. We need more testing before drawing reliable conclusions.
                </p>

                {/* Progress Indicators */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', backgroundColor: '#121215', padding: '20px', borderRadius: '2px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                      <span>VISITORS TARGET</span>
                      <span>{visitorsCount} / 5 minimum target</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (visitorsCount / 5) * 100)}%`, height: '100%', backgroundColor: '#ffffff' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                      <span>ACTIONS TARGET</span>
                      <span>{eventsCount} / 20 minimum target</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (eventsCount / 20) * 100)}%`, height: '100%', backgroundColor: '#ffffff' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)' }}>
                    These targets are guidelines for collecting initial evidence, not proof of statistical significance.
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => copyTrackerSnippet(true)} className="btn-secondary" style={{ fontSize: '0.6875rem', padding: '6px 12px' }}>
                      Copy Tracking Link
                    </button>
                    <a href={experiment.prototypeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.6875rem', padding: '6px 12px' }}>
                      Share with More Testers
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* D. What We Know So Far */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                  What We Know So Far
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Findings calculated directly from your real prototype records.
                </p>
              </div>

              {experiment.telemetrySummary?.empiricalFacts && experiment.telemetrySummary.empiricalFacts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {experiment.telemetrySummary.empiricalFacts.map((fact: any) => (
                    <div key={fact.id} style={{ backgroundColor: '#0a0a0d', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '20px 24px', borderRadius: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>
                          {fact.title}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                          How Reliable Is This Finding? <strong style={{ color: '#ffffff' }}>{fact.confidence === 'HIGH' ? 'High' : fact.confidence === 'MODERATE' ? 'Moderate' : 'Early finding'}</strong>
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9375rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '10px' }}>
                        {fact.statement}
                      </p>
                      <div style={{ backgroundColor: '#121215', padding: '10px 14px', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                        Supporting Evidence: {fact.evidence}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                        Important limitation: {fact.limitations}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px', color: 'var(--color-silver-300)', fontSize: '0.875rem' }}>
                  No interactions recorded yet. As soon as visitors test your prototype, calculated findings will appear here.
                </div>
              )}
            </div>

            {/* E. Suggestions for Improvement */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                  Suggestions for Improvement
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Actionable next steps based on real observed behavior and feedback.
                </p>
              </div>

              {isSufficientEvidence ? (
                <div style={{ backgroundColor: '#0a0a0d', border: '1px solid rgba(255, 255, 255, 0.16)', padding: '24px', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-active">SUGGESTED NEXT STEP</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '4px' }}>
                      MEASURED FACT
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#ffffff', marginBottom: '12px' }}>
                      {experiment.telemetrySummary?.topInteractions?.[0]
                        ? `Visitors interacted with "${experiment.telemetrySummary.topInteractions[0].element}" ${experiment.telemetrySummary.topInteractions[0].count} time(s).`
                        : `${visitorsCount} people visited your prototype and took ${eventsCount} actions.`}
                    </p>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '4px' }}>
                      POSSIBLE EXPLANATION
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-200)', marginBottom: '12px' }}>
                      Visitors are exploring the primary pathway, but clearer next steps could help guide them toward completing the full experience.
                    </p>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '4px' }}>
                      SUGGESTED ACTION
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 500 }}>
                      Make your primary button or next step easier to find, then ask a few more people to try the page and share their reactions.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#0a0a0d', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="badge" style={{ alignSelf: 'flex-start' }}>
                    GENERAL SUGGESTION (NOT AN EXPERIMENT FINDING)
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-200)', lineHeight: 1.5 }}>
                    Because your experiment is still in the early stages with {visitorsCount} visitor(s), we do not have enough evidence to identify specific usability problems yet.
                  </p>
                  <div style={{ backgroundColor: '#121215', padding: '14px 18px', borderRadius: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      RECOMMENDED NEXT STEP
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#ffffff' }}>
                      Share your prototype with 3 to 5 colleagues, prospective users, or classmates and ask them to complete the primary action.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Benchmark Insights Toggle */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
              <button
                onClick={() => setShowBenchmarkInsights(!showBenchmarkInsights)}
                className="btn-ghost"
                style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
              >
                <span>{showBenchmarkInsights ? 'Hide Example Insights' : 'View Example Data (Not Your Results)'}</span>
              </button>

              {showBenchmarkInsights && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="badge" style={{ alignSelf: 'flex-start' }}>
                    EXAMPLE DATA (NOT YOUR RESULTS) — Sample insights for reference
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
                        <span className="badge">EXAMPLE: {item.type}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)' }}>
                          Confidence: {item.confidence}
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
        )}

        {/* TAB 6: DECIDE WHAT TO DO NEXT */}
        {activeTab === 'decision' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ maxWidth: '820px' }}>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>
                <span className="eyebrow-dot" />
                <span>DECISION PLANNING</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Decide What to Do Next
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-silver-300)' }}>
                Choose the best path forward based on your real evidence and test results. Your recorded decisions are saved permanently in your workspace.
              </p>
            </div>

            {decisionNotice && (
              <div style={{ backgroundColor: '#0e1410', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '14px 18px', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff' }}>
                ✓ {decisionNotice}
              </div>
            )}

            {/* Low-data recommendation banner */}
            {(eventsCount < 20 || visitorsCount < 5) && (
              <div style={{ backgroundColor: '#141108', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '20px 24px', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} style={{ color: '#ffffff', flexShrink: 0 }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                    Our Recommendation: Run Another Test
                  </h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-200)', lineHeight: 1.5 }}>
                  There&apos;s not enough evidence yet to make a confident decision. Your prototype currently has {visitorsCount} visitor(s) and {eventsCount} tracked action(s). Invite more testers before committing significant time or money.
                </p>
              </div>
            )}

            {/* Five Understandable Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {[
                {
                  outcome: 'BUILD' as DecisionOutcome,
                  label: 'Build It',
                  short: 'The evidence supports moving forward.',
                  means: 'Begin developing production features based on validated interest.',
                  evidence: 'Visitors actively completed the primary action and submitted positive feedback.',
                  uncertainty: 'Long-term retention and willingness to pay remain to be verified in production.',
                  nextStep: 'Scope a minimal production release focusing only on validated core features.',
                },
                {
                  outcome: 'IMPROVE' as DecisionOutcome,
                  label: 'Improve It',
                  short: 'Fix observed problems and test again.',
                  means: 'Address points where testers got stuck or gave critical feedback.',
                  evidence: 'Visitors tried the prototype but struggled at specific steps or noted friction.',
                  uncertainty: 'Whether fixing these issues will sufficiently improve conversion.',
                  nextStep: 'Refine confusing copy, simplify layout, and run another test.',
                },
                {
                  outcome: 'PIVOT' as DecisionOutcome,
                  label: 'Change Direction',
                  short: 'Test a different approach.',
                  means: 'The core problem or solution needs significant rethinking.',
                  evidence: 'Visitors showed low engagement or expressed that the solution does not solve their problem.',
                  uncertainty: 'Which alternative direction will resonate better with your audience.',
                  nextStep: 'Interview 5 people from your target audience to discover their primary unaddressed problem.',
                },
                {
                  outcome: 'STOP' as DecisionOutcome,
                  label: 'Stop This Idea',
                  short: 'Stop investing in this direction.',
                  means: 'Close this experiment and preserve your time, energy, and resources.',
                  evidence: 'Clear evidence that users do not need or want this product.',
                  uncertainty: 'Whether timing or a completely different market might have worked.',
                  nextStep: 'Document what you learned and move on to your next experiment idea.',
                },
                {
                  outcome: 'TEST_AGAIN' as DecisionOutcome,
                  label: 'Run Another Test',
                  short: 'Collect more evidence first.',
                  means: 'Gather more visitors and feedback before making a final commitment.',
                  evidence: 'Sample size is currently too small to draw dependable conclusions.',
                  uncertainty: 'Most interaction patterns remain unverified until more data is collected.',
                  nextStep: 'Share your prototype link with more testers to build an honest sample.',
                },
              ].map((item) => {
                const isSelected = selectedDecision === item.outcome;
                return (
                  <div
                    key={item.outcome}
                    onClick={() => setSelectedDecision(item.outcome)}
                    style={{
                      padding: '24px 20px',
                      backgroundColor: isSelected ? 'var(--color-white)' : '#0a0a0d',
                      border: isSelected ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                      color: isSelected ? '#000000' : '#ffffff',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 180ms ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isSelected ? '#333333' : 'var(--color-silver-300)', marginTop: '4px', lineHeight: 1.4 }}>
                        {item.short}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.6875rem', color: isSelected ? '#555555' : 'var(--color-gray-500)', borderTop: isSelected ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                      {item.means}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Option Deep-Dive Details */}
            {(() => {
              const detailsMap: Record<DecisionOutcome, { label: string; means: string; evidence: string; uncertainty: string; nextStep: string }> = {
                BUILD: {
                  label: 'Build It',
                  means: 'Begin developing production features based on validated interest.',
                  evidence: 'Visitors actively completed the primary action and submitted positive feedback.',
                  uncertainty: 'Long-term retention and willingness to pay remain to be verified in production.',
                  nextStep: 'Scope a minimal production release focusing only on validated core features.',
                },
                IMPROVE: {
                  label: 'Improve It',
                  means: 'Address points where testers got stuck or gave critical feedback.',
                  evidence: 'Visitors tried the prototype but struggled at specific steps or noted friction.',
                  uncertainty: 'Whether fixing these issues will sufficiently improve conversion.',
                  nextStep: 'Refine confusing copy, simplify layout, and run another test.',
                },
                PIVOT: {
                  label: 'Change Direction',
                  means: 'The core problem or solution needs significant rethinking.',
                  evidence: 'Visitors showed low engagement or expressed that the solution does not solve their problem.',
                  uncertainty: 'Which alternative direction will resonate better with your audience.',
                  nextStep: 'Interview 5 people from your target audience to discover their primary unaddressed problem.',
                },
                STOP: {
                  label: 'Stop This Idea',
                  means: 'Close this experiment and preserve your time, energy, and resources.',
                  evidence: 'Clear evidence that users do not need or want this product.',
                  uncertainty: 'Whether timing or a completely different market might have worked.',
                  nextStep: 'Document what you learned and move on to your next experiment idea.',
                },
                TEST_AGAIN: {
                  label: 'Run Another Test',
                  means: 'Gather more visitors and feedback before making a final commitment.',
                  evidence: 'Sample size is currently too small to draw dependable conclusions.',
                  uncertainty: 'Most interaction patterns remain unverified until more data is collected.',
                  nextStep: 'Share your prototype link with more testers to build an honest sample.',
                },
              };
              const current = detailsMap[selectedDecision];

              return (
                <div
                  style={{
                    backgroundColor: '#0a0a0d',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    padding: '32px',
                    borderRadius: '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                        SELECTED OPTION:
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: '#ffffff' }}>
                        {current.label}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                        DATA RELIABILITY:
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: eventsCount >= 20 ? '#ffffff' : 'var(--color-silver-300)' }}>
                        {eventsCount >= 20 ? 'Supported by initial testing' : 'Low data — early exploratory decision'}
                      </div>
                    </div>
                  </div>

                  {/* Warning if choosing to build with low data */}
                  {selectedDecision === 'BUILD' && eventsCount < 20 && (
                    <div style={{ backgroundColor: '#181205', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '14px 18px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertCircle size={16} style={{ color: '#ffffff', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-silver-200)', lineHeight: 1.4 }}>
                        Notice: You have chosen to build this idea, but only {eventsCount} action(s) have been tracked. We recommend collecting more evidence first to avoid building something users might not need.
                      </div>
                    </div>
                  )}

                  {/* 4 Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', backgroundColor: '#121215', padding: '20px', borderRadius: '2px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', marginBottom: '4px' }}>
                        WHAT THIS CHOICE MEANS
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.5 }}>
                        {current.means}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', marginBottom: '4px' }}>
                        WHICH REAL EVIDENCE SUPPORTS IT
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.5 }}>
                        {current.evidence}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', marginBottom: '4px' }}>
                        WHAT REMAINS UNCERTAIN
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.5 }}>
                        {current.uncertainty}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)', marginBottom: '4px' }}>
                        RECOMMENDED NEXT ACTION
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.5 }}>
                        {current.nextStep}
                      </div>
                    </div>
                  </div>

                  {/* User Inputs Form */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      WHY DID YOU CHOOSE THIS DIRECTION? (YOUR REASONING) *
                    </label>
                    <textarea
                      rows={3}
                      value={decisionReasoning}
                      onChange={(e) => setDecisionReasoning(e.target.value)}
                      placeholder={`Explain why you are choosing to ${current.label.toLowerCase()} based on what you saw in your prototype or what testers told you...`}
                      style={{ width: '100%', padding: '12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', borderRadius: '2px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      WHAT IS YOUR IMMEDIATE NEXT STEP?
                    </label>
                    <input
                      type="text"
                      value={decisionNextStep}
                      onChange={(e) => setDecisionNextStep(e.target.value)}
                      placeholder={current.nextStep}
                      style={{ width: '100%', padding: '12px', backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', borderRadius: '2px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                      Persists permanently to your workspace database
                    </span>

                    <button
                      onClick={handleSaveDecision}
                      disabled={savingDecision}
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '10px 20px' }}
                    >
                      {savingDecision ? 'Saving decision...' : 'Save My Decision'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Decision History / Audit Trail from Database */}
            {experiment.decisions && experiment.decisions.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '28px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', letterSpacing: '0.08em', marginBottom: '16px', textTransform: 'uppercase' }}>
                  YOUR RECORDED DECISIONS ({experiment.decisions.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {experiment.decisions.map((dec: any) => {
                    const outcomeNameMap: Record<string, string> = {
                      BUILD: 'Build It',
                      IMPROVE: 'Improve It',
                      PIVOT: 'Change Direction',
                      STOP: 'Stop This Idea',
                      TEST_AGAIN: 'Run Another Test',
                    };
                    const outcomeLabel = outcomeNameMap[dec.outcome] || dec.outcome;

                    return (
                      <div key={dec.id} style={{ backgroundColor: '#0a0a0d', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '24px', borderRadius: '2px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <span className="badge badge-active">{outcomeLabel}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                            Decided on {new Date(dec.decidedAt).toLocaleString()}
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
                            NOTE: {dec.limitations}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
