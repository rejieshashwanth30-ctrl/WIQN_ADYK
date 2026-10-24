'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardNav } from '@/components/DashboardNav';
import { BehavioralAnalyticsView } from '@/components/BehavioralAnalyticsView';
import { Experiment, StructuredInsight, FeedbackItem, DecisionRecord, DecisionOutcome } from '@/lib/types';
import { getPublicAppUrl, getTestUrl, getShareUrls, isLocalEnvironment, getProductionAppUrl } from '@/lib/urls';
import { authenticatedFetch } from '@/lib/api-client';
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
  ArrowRight,
  Share2,
  Send,
  RefreshCw,
  X,
  MessageSquare,
  BarChart2,
  GitCommit,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ExperimentDetailPage({ params }: PageProps) {
  const routeParams = useParams();
  const rawId = routeParams?.id;
  let experimentId = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : '';
  if (!experimentId && params) {
    try {
      if (typeof (params as any)?.then === 'function') {
        const resolved = use(params);
        experimentId = resolved?.id || '';
      } else if ((params as any)?.id) {
        experimentId = (params as any).id;
      }
    } catch {}
  }

  const [experiment, setExperiment] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'prototype' | 'analytics' | 'feedback' | 'insights' | 'decision'>('overview');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [snippetMode, setSnippetMode] = useState<'production' | 'local'>('production');
  const [selectedDecision, setSelectedDecision] = useState<DecisionOutcome>('TEST_AGAIN');
  const [decisionReasoning, setDecisionReasoning] = useState('');
  const [decisionNextStep, setDecisionNextStep] = useState('');
  const [savingDecision, setSavingDecision] = useState(false);
  const [decisionNotice, setDecisionNotice] = useState<string | null>(null);

  // Sharing link state
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedTestUrl, setCopiedTestUrl] = useState(false);

  // AI Analysis State
  const [runningAI, setRunningAI] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

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

  // Active tab reference for smooth mobile scroll into view
  const activeTabRef = React.useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const isLocal = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.endsWith('.local'))
    : process.env.NODE_ENV === 'development';

  const [shareLinkMode, setShareLinkMode] = useState<'production' | 'local'>('production');

  // Compute production vs local origins
  const prodOrigin = getProductionAppUrl();
  const localOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const effectiveOrigin = snippetMode === 'production' ? prodOrigin : localOrigin;
  const currentSnippet = `<script src="${effectiveOrigin}/tracker.js" data-experiment="${experimentId}" data-endpoint="${effectiveOrigin}/api/capture" async></script>`;

  // Centralized test and share URLs
  const shareUrls = getShareUrls(
    experimentId,
    experiment?.productName || experiment?.name || 'product prototype',
    { forceLocal: shareLinkMode === 'local' }
  );
  const publicTestUrl = shareUrls.testUrl;

  const loadExperiment = async () => {
    if (!experimentId) return;
    try {
      setLoading(true);
      setAuthError(null);
      const res = await authenticatedFetch(`/api/experiments/${experimentId}`);
      if (res.status === 401) {
        window.location.href = `/login?redirect=${encodeURIComponent(`/experiments/${experimentId}`)}`;
        return;
      }
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

      setAuthError('Experiment could not be found or loaded from your workspace database.');
      setExperiment(null);
    } catch (err: any) {
      console.error('Error fetching experiment from database:', err);
      setAuthError('Connection error loading experiment from workspace database.');
      setExperiment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiment();
  }, [experimentId]);

  const copyTrackerSnippet = async (isProduction: boolean = true) => {
    try {
      const originToUse = isProduction ? prodOrigin : localOrigin;
      const snippet = `<script src="${originToUse}/tracker.js" data-experiment="${experimentId}" data-endpoint="${originToUse}/api/capture" async></script>`;
      await navigator.clipboard.writeText(snippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2400);
    } catch (err) {
      console.error('Failed to copy tracker script:', err);
    }
  };

  const copyTestUrl = async () => {
    try {
      const urlToCopy = shareLinkMode === 'local' ? shareUrls.localTestUrl : shareUrls.productionTestUrl;
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedTestUrl(true);
      setTimeout(() => setCopiedTestUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy test link:', err);
    }
  };

  const handleRunAIAnalysis = async () => {
    try {
      setRunningAI(true);
      setAiError(null);
      const res = await authenticatedFetch(`/api/experiments/${experimentId}/insights`, {
        method: 'POST',
      });
      if (res.ok) {
        const json = await res.json();
        setAiResult(json.data);
        await loadExperiment();
      } else {
        const data = await res.json();
        setAiError(data.error || 'AI analysis could not complete.');
      }
    } catch (err: any) {
      console.error('Error triggering AI analysis:', err);
      setAiError('Failed to connect to AI validation service.');
    } finally {
      setRunningAI(false);
    }
  };

  const handleSaveDecision = async () => {
    if (!decisionReasoning.trim()) {
      alert('Please provide a short explanation for your decision.');
      return;
    }
    try {
      setSavingDecision(true);
      const res = await authenticatedFetch(`/api/experiments/${experimentId}/decisions`, {
        method: 'POST',
        body: JSON.stringify({
          outcome: selectedDecision,
          reasoning: decisionReasoning,
          recommendedNextStep: decisionNextStep.trim() || undefined,
        }),
      });

      if (res.ok) {
        setDecisionReasoning('');
        setDecisionNextStep('');
        setDecisionNotice('Your product decision has been recorded permanently.');
        await loadExperiment();
        setTimeout(() => setDecisionNotice(null), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product decision.');
      }
    } catch (err) {
      console.error('Error saving decision:', err);
      alert('Network error while saving decision.');
    } finally {
      setSavingDecision(false);
    }
  };

  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      alert('Please enter an observation comment.');
      return;
    }
    try {
      setSavingFeedback(true);
      const res = await authenticatedFetch(`/api/experiments/${experimentId}/feedback`, {
        method: 'POST',
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
      <div className="wiqn-light-dashboard" style={{ minHeight: '100vh', backgroundColor: '#fcfcfd', color: '#09090b' }}>
        <DashboardNav theme="light" />
        <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#71717a' }}>
          LOADING EXPERIMENT DETAILS...
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="wiqn-light-dashboard" style={{ minHeight: '100vh', backgroundColor: '#fcfcfd', color: '#09090b' }}>
        <DashboardNav theme="light" />
        <div style={{ padding: '120px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', marginBottom: '12px' }}>
            ACCESS RESTRICTED
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px', color: '#09090b' }}>
            Access Restricted
          </h1>
          <p style={{ color: '#52525b', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: 1.6 }}>
            {authError}
          </p>
          <Link href="/dashboard" className="exp-btn-primary">
            Return to My Experiments
          </Link>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="wiqn-light-dashboard" style={{ minHeight: '100vh', backgroundColor: '#fcfcfd', color: '#09090b' }}>
        <DashboardNav theme="light" />
        <div style={{ padding: '120px 24px', textAlign: 'center', maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', marginBottom: '12px' }}>
            LOOKUP FAILED
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px', color: '#09090b' }}>
            Experiment Not Found
          </h1>
          <p style={{ color: '#52525b', fontSize: '0.9375rem', marginBottom: '28px' }}>
            We could not find an experiment matching ID: <code style={{ color: '#09090b' }}>{experimentId}</code>.
          </p>
          <Link href="/dashboard" className="exp-btn-primary">
            Return to My Experiments
          </Link>
        </div>
      </div>
    );
  }

  const visitorsCount = experiment.metrics?.visitorsCount || 0;
  const eventsCount = experiment.metrics?.interactionsCount || 0;
  const sessionsCount = experiment.metrics?.sessionsCount || 0;
  const feedbackCount = experiment.metrics?.feedbackCount || 0;
  const isSufficientEvidence = experiment.telemetrySummary?.isSufficientEvidence || false;

  // Signal Strength calculation (Part 18)
  const signalStrength = visitorsCount >= 15 ? 'HIGH' : visitorsCount >= 5 ? 'MODERATE' : 'LOW';
  const signalStrengthPct = visitorsCount >= 15 ? 100 : visitorsCount >= 5 ? 66 : 33;

  // Evidence Confidence calculation (Part 14 & 17)
  const evidenceConfidence = visitorsCount >= 15 ? 'HIGH' : visitorsCount >= 5 ? 'MODERATE' : visitorsCount > 0 ? 'EARLY' : 'INSUFFICIENT';

  // Primary evidence-based decision recommendation (Part 20)
  const primaryDecision = (eventsCount < 20 || visitorsCount < 5) ? 'TEST_AGAIN' : 'IMPROVE';

  return (
    <div className="wiqn-light-dashboard">
      <DashboardNav theme="light" currentExperimentId={experiment.id} currentExperimentName={experiment.name} />

      <main style={{ maxWidth: '1320px', margin: '0 auto', padding: '24px 20px 80px 20px', boxSizing: 'border-box' }}>
        {/* PART 5: EXPERIMENT HEADER */}
        <div className="exp-light-header">
          <div className="exp-light-header-left">
            <div className="exp-v2-badge">
              <span className="exp-v2-tag">WIQN — V2</span>
              <span className="exp-status-pill">{experiment.status === 'ACTIVE' ? 'ACTIVE TEST' : experiment.status}</span>
              {experiment.testingMode === 'CARDEX_ALPHA' && (
                <span className="exp-mode-pill">CARDEX ALPHA</span>
              )}
            </div>

            <h1 className="exp-light-title">
              {experiment.name}
            </h1>

            <div className="exp-light-product">
              Product: <strong>{experiment.productName || 'ADYK COMPANY'}</strong>
              <span className="exp-id-mono">ID: {experiment.id}</span>
            </div>
          </div>

          {/* Action Hierarchy: Primary > Secondary > Tertiary */}
          <div className="exp-light-header-actions">
            {/* Primary Action */}
            <button
              onClick={() => setShowShareModal(true)}
              className="exp-btn-primary"
              aria-label="Share Testing Link with Testers"
            >
              <Share2 size={13} />
              <span>Share Testing Link</span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={() => copyTrackerSnippet(true)}
              className="exp-btn-secondary"
              title="Copy the tracking script to paste into your website"
              aria-label="Copy Tracking Code"
            >
              {copiedSnippet ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedSnippet ? 'Code Copied!' : 'Copy Tracking Code'}</span>
            </button>

            {/* Tertiary Action */}
            <a
              href={experiment.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="exp-btn-tertiary"
              aria-label="Open Live Prototype in New Tab"
            >
              <span>Open Prototype</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* PART 6: EXPERIMENT NAVIGATION (Overview, Test Prototype, Visitor Activity, Tester Feedback, Insights & AI, Decide Next) */}
        <div className="exp-light-tabs" role="tablist">
          {[
            { key: 'overview', label: 'Overview', icon: Layers },
            { key: 'prototype', label: 'Test Prototype', icon: Play },
            { key: 'analytics', label: 'Visitor Activity', icon: Activity },
            { key: 'feedback', label: 'Tester Feedback', icon: MessageSquareQuote },
            { key: 'insights', label: 'Insights & AI', icon: Sparkles },
            { key: 'decision', label: 'Decide Next', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                ref={isActive ? activeTabRef : null}
                onClick={() => setActiveTab(tab.key as any)}
                role="tab"
                aria-selected={isActive}
                className={`exp-light-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Hypothesis Card */}
              <div className="exp-light-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  WHAT YOU ARE TESTING
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginBottom: '8px' }}>
                  Your Idea to Test
                </h3>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#52525b', lineHeight: 1.6, margin: 0 }}>
                  {experiment.keyHypothesis}
                </p>
              </div>

              {/* Problem Space */}
              <div className="exp-light-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  THE PROBLEM YOU ARE SOLVING
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#52525b', lineHeight: 1.6, margin: 0 }}>
                  {experiment.problem || 'No specific problem description provided yet.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Target & Learning Goal */}
              <div className="exp-light-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  WHO THIS IS FOR
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#52525b', lineHeight: 1.6, marginBottom: '18px' }}>
                  {experiment.targetAudience || 'General prospective users and testers.'}
                </p>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  WHAT YOU WANT TO LEARN
                </div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#52525b', lineHeight: 1.6, margin: 0 }}>
                  {experiment.learningGoal || 'Observe visitor reactions and see whether people complete key actions.'}
                </p>
              </div>

              {/* Public Test Link Card */}
              <div className="exp-light-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  SHAREABLE PUBLIC TEST LINK
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#09090b', wordBreak: 'break-all', marginBottom: '14px', backgroundColor: '#f8f9fa', padding: '8px 12px', borderRadius: '3px', border: '1px solid #e4e4e7' }}>
                  {publicTestUrl}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <button onClick={copyTestUrl} className="exp-btn-secondary" style={{ fontSize: '0.6875rem', padding: '6px 12px', minHeight: '36px' }}>
                    {copiedTestUrl ? 'Link Copied!' : 'Copy Link'}
                  </button>
                  <button onClick={() => setShowShareModal(true)} className="exp-btn-primary" style={{ fontSize: '0.6875rem', padding: '6px 12px', minHeight: '36px' }}>
                    Share with Testers →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEST YOUR PROTOTYPE */}
        {activeTab === 'prototype' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Viewport Control Bar */}
            <div
              className="exp-light-card"
              style={{
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#15803d', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#09090b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Interactive Preview: {experiment.prototypeUrl}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="exp-btn-secondary"
                  style={{ fontSize: '0.6875rem', padding: '6px 12px', minHeight: '36px' }}
                >
                  <Share2 size={12} />
                  <span>Share Testing Link</span>
                </button>

                <a
                  href={isLocal ? shareUrls.localTestUrl : shareUrls.productionTestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="exp-btn-primary"
                  style={{ fontSize: '0.6875rem', padding: '6px 12px', minHeight: '36px' }}
                >
                  <span>{isLocal ? 'Open Local Tester View' : 'Open Public Tester View'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Sandbox Embed Frame */}
            <div
              style={{
                position: 'relative',
                height: '640px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
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

            {/* Tracking Snippet Box */}
            <div className="exp-light-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase' }}>
                  AUTOMATIC TRACKING SCRIPT // READY TO USE
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setSnippetMode('production')}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      padding: '4px 10px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: snippetMode === 'production' ? '1px solid #09090b' : '1px solid #e4e4e7',
                      backgroundColor: snippetMode === 'production' ? '#09090b' : '#ffffff',
                      color: snippetMode === 'production' ? '#ffffff' : '#52525b',
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
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: snippetMode === 'local' ? '1px solid #09090b' : '1px solid #e4e4e7',
                      backgroundColor: snippetMode === 'local' ? '#09090b' : '#ffffff',
                      color: snippetMode === 'local' ? '#ffffff' : '#52525b',
                    }}
                  >
                    LOCAL TESTING
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#52525b', marginBottom: '10px', lineHeight: 1.5 }}>
                Paste this script into the <code>&lt;head&gt;</code> of your website or prototype. It automatically records visits and button clicks without saving personal information:
              </p>

              <div
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e4e4e7',
                  padding: '10px 14px',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#09090b',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  overflowX: 'auto',
                }}
              >
                <code style={{ wordBreak: 'break-all' }}>{currentSnippet}</code>
                <button onClick={() => copyTrackerSnippet(snippetMode === 'production')} className="exp-btn-secondary" style={{ flexShrink: 0, marginLeft: '12px', minHeight: '32px', padding: '4px 10px' }}>
                  {copiedSnippet ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISITOR ACTIVITY (BehavioralAnalyticsView) */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ marginBottom: '4px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
                VISITOR ACTIONS
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#09090b', marginBottom: '4px' }}>
                Visitor Activity
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#52525b' }}>
                See how many people tested your prototype, what they clicked, and how long they stayed.
              </p>
            </div>

            {(!experiment.metrics || experiment.metrics.interactionsCount === 0) ? (
              <div
                className="exp-light-card"
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  maxWidth: '640px',
                  margin: '20px auto',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', marginBottom: '8px' }}>
                  NO ACTIVITY YET
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#09090b', marginBottom: '8px' }}>
                  No Activity Yet
                </h3>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: '#52525b', lineHeight: 1.6, marginBottom: '24px' }}>
                  Open your prototype and interact with it, or share it with testers. Their supported interactions will appear here after tracking is installed correctly.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowShareModal(true)} className="exp-btn-primary">
                    <span>Share Testing Link</span>
                  </button>
                  <button onClick={() => copyTrackerSnippet(true)} className="exp-btn-secondary">
                    <span>Copy Tracking Code</span>
                  </button>
                </div>
              </div>
            ) : (
              <BehavioralAnalyticsView
                experimentId={experimentId}
                behavioral={experiment.telemetrySummary?.behavioral}
                initialEvents={experiment.telemetrySummary?.recentEvents}
                metrics={experiment.metrics}
                onRefresh={loadExperiment}
              />
            )}
          </div>
        )}

        {/* TAB 4: TESTER FEEDBACK */}
        {activeTab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                  Tester Feedback
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#52525b' }}>
                  Feedback, notes, and observations from people who tested your prototype.
                </p>
              </div>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="exp-btn-primary"
                style={{ fontSize: '0.75rem', padding: '8px 14px' }}
              >
                + Add Founder Observation
              </button>
            </div>

            {/* Add Observation Modal */}
            {showFeedbackModal && (
              <div className="exp-light-card" style={{ border: '2px solid #09090b', padding: '20px' }}>
                <form onSubmit={handleSaveFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#09090b' }}>
                      Log Qualitative Observation
                    </h4>
                    <button type="button" onClick={() => setShowFeedbackModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b', marginBottom: '4px' }}>
                      WHAT DID YOU OBSERVE? *
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="e.g., Tester hovered on the CTA for 12 seconds but did not click because..."
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e4e4e7', borderRadius: '3px', fontSize: '0.8125rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={savingFeedback} className="exp-btn-primary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                      {savingFeedback ? 'Saving...' : 'Save Observation'}
                    </button>
                    <button type="button" onClick={() => setShowFeedbackModal(false)} className="exp-btn-secondary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Feedback List from Database */}
            {experiment.feedback && experiment.feedback.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                {experiment.feedback.map((fb: any) => {
                  const isTesterSource = Boolean(fb.visitorId);
                  return (
                    <div key={fb.id} className="exp-light-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span className={`exp-event-badge ${isTesterSource ? 'feedback' : 'click'}`}>
                            {isTesterSource ? 'Tester Feedback' : 'Founder Note'}
                          </span>
                          {fb.rating && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b' }}>
                              Rating: {fb.rating}/5
                            </span>
                          )}
                        </div>

                        {fb.prompt && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', marginBottom: '6px' }}>
                            Context: &ldquo;{fb.prompt}&rdquo;
                          </div>
                        )}

                        <p style={{ fontSize: '0.875rem', color: '#09090b', lineHeight: 1.5, margin: 0 }}>
                          &ldquo;{fb.comment}&rdquo;
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #f0f0f2', paddingTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
                        Submitted on {new Date(fb.createdAt).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="exp-light-card" style={{ padding: '48px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a', marginBottom: '4px' }}>
                  NO FEEDBACK YET
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#09090b', marginBottom: '4px' }}>
                  No Qualitative Feedback Yet
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#52525b', maxWidth: '440px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                  Feedback will appear here when testers share their experience. You can also record your own observations.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => setShowFeedbackModal(true)} className="exp-btn-primary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                    Add First Observation
                  </button>
                  <button onClick={() => setShowShareModal(true)} className="exp-btn-secondary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                    Invite Testers
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INSIGHTS & AI (PART 17, 18, 19) */}
        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Summary Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
                  INTELLIGENCE DASHBOARD
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#09090b', marginBottom: '4px' }}>
                  AI Evidence Summary
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#52525b' }}>
                  Synthesizes telemetry behavior and tester signals into directional findings.
                </p>
              </div>

              <button
                onClick={handleRunAIAnalysis}
                disabled={runningAI}
                className="exp-btn-primary"
                style={{ padding: '9px 16px', fontSize: '0.75rem' }}
              >
                {runningAI ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{runningAI ? 'Analyzing Evidence...' : 'Run AI Analysis'}</span>
              </button>
            </div>

            {/* PART 17: TOP INTELLIGENCE METRIC CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Signal Strength (Part 18: Low / Moderate / High) */}
              <div className="exp-light-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  SIGNAL STRENGTH
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                    {signalStrength}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
                    {visitorsCount} visitor{visitorsCount === 1 ? '' : 's'}
                  </span>
                </div>
                {/* Visual Signal Strength Bar */}
                <div style={{ height: '7px', backgroundColor: '#f4f4f5', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${signalStrengthPct}%`,
                      height: '100%',
                      backgroundColor: signalStrength === 'HIGH' ? '#15803d' : signalStrength === 'MODERATE' ? '#0369a1' : '#09090b',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              {/* Evidence Confidence */}
              <div className="exp-light-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  EVIDENCE CONFIDENCE
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginBottom: '4px' }}>
                  {evidenceConfidence}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#52525b' }}>
                  {visitorsCount < 5 ? 'Based on early exploratory cohort' : 'Supported by recurring interaction evidence'}
                </div>
              </div>

              {/* Key Finding */}
              <div className="exp-light-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  KEY FINDING
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#09090b', fontWeight: 500, margin: 0, lineHeight: 1.45 }}>
                  {eventsCount > 0
                    ? `Visitors generated ${eventsCount} actions with measured interaction on ${experiment.telemetrySummary?.topInteractions?.[0]?.element || 'prototype'}.`
                    : 'No telemetry interactions recorded yet.'}
                </p>
              </div>

              {/* Recommended Next Step */}
              <div className="exp-light-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  RECOMMENDED NEXT STEP
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#09090b', fontWeight: 600, margin: 0, lineHeight: 1.45 }}>
                  {eventsCount < 20
                    ? 'Share link with 3 to 5 more testers to establish a confident sample.'
                    : 'Focus on clarifying the next action following the primary button click.'}
                </p>
              </div>
            </div>

            {/* PART 19: AI INSIGHT FLOW (VISUAL PIPELINE) */}
            <div className="exp-light-card">
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  VISUAL PIPELINE
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                  How WIQN Analyzes Evidence
                </h3>
              </div>

              <div className="exp-ai-pipeline">
                <div className="exp-ai-step">
                  <span className="exp-ai-step-title">01 // RAW DATA</span>
                  <span className="exp-ai-step-desc">Autocaptured clicks &amp; visits</span>
                </div>
                <span className="exp-ai-pipeline-arrow" style={{ color: '#a1a1aa' }}>→</span>

                <div className="exp-ai-step">
                  <span className="exp-ai-step-title">02 // BEHAVIOR</span>
                  <span className="exp-ai-step-desc">Funnels &amp; user paths</span>
                </div>
                <span className="exp-ai-pipeline-arrow" style={{ color: '#a1a1aa' }}>→</span>

                <div className="exp-ai-step">
                  <span className="exp-ai-step-title">03 // EVIDENCE</span>
                  <span className="exp-ai-step-desc">7 empirical dimensions</span>
                </div>
                <span className="exp-ai-pipeline-arrow" style={{ color: '#a1a1aa' }}>→</span>

                <div className="exp-ai-step">
                  <span className="exp-ai-step-title">04 // AI INTERPRETATION</span>
                  <span className="exp-ai-step-desc">Epistemic hypotheses</span>
                </div>
                <span className="exp-ai-pipeline-arrow" style={{ color: '#a1a1aa' }}>→</span>

                <div className="exp-ai-step">
                  <span className="exp-ai-step-title">05 // RECOMMENDATION</span>
                  <span className="exp-ai-step-desc">Build, improve, test again</span>
                </div>
              </div>
            </div>

            {/* PART 18: ENGAGEMENT DISTRIBUTION BAR CHART & DECISION SIGNAL PATH */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Engagement Distribution */}
              <div className="exp-light-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
                  ENGAGEMENT BREAKDOWN
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: '#09090b', marginBottom: '14px' }}>
                  Interaction Volume by Channel
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Page Views', count: visitorsCount, max: Math.max(visitorsCount, eventsCount, 1) },
                    { label: 'Clicks', count: experiment.telemetrySummary?.behavioral?.clickDistribution?.totalClicks || 0, max: Math.max(visitorsCount, eventsCount, 1) },
                    { label: 'Form Starts', count: experiment.telemetrySummary?.behavioral?.funnel?.steps?.[2]?.count || 0, max: Math.max(visitorsCount, eventsCount, 1) },
                    { label: 'Feedback Notes', count: feedbackCount, max: Math.max(visitorsCount, eventsCount, 1) },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        <span style={{ color: '#52525b' }}>{row.label}</span>
                        <strong style={{ color: '#09090b' }}>{row.count}</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#f4f4f5', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.max(2, Math.min(100, Math.round((row.count / (eventsCount || 1)) * 100)))}%`,
                            height: '100%',
                            backgroundColor: '#09090b',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Signal Path (Part 18) */}
              <div className="exp-light-card">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
                  DECISION SIGNAL PATH
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: '#09090b', marginBottom: '14px' }}>
                  Evidence-Supported Recommendation
                </h3>

                <div className="exp-decision-path" style={{ marginBottom: '16px' }}>
                  {(['BUILD', 'IMPROVE', 'PIVOT', 'STOP', 'TEST_AGAIN'] as DecisionOutcome[]).map((outcome) => {
                    const isRec = primaryDecision === outcome;
                    const labels: Record<string, string> = {
                      BUILD: 'BUILD',
                      IMPROVE: 'IMPROVE',
                      PIVOT: 'PIVOT',
                      STOP: 'STOP',
                      TEST_AGAIN: 'TEST AGAIN',
                    };
                    return (
                      <div key={outcome} className={`exp-decision-chip ${isRec ? 'recommended' : ''}`}>
                        {labels[outcome]}
                      </div>
                    );
                  })}
                </div>

                <div style={{ backgroundColor: '#f8f9fa', padding: '12px 14px', borderRadius: '4px', border: '1px solid #e4e4e7' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#09090b', fontWeight: 700, marginBottom: '2px' }}>
                    WHY: {primaryDecision === 'TEST_AGAIN' ? 'SAMPLE SIZE INSUFFICIENT' : 'INTERACTION PATTERNS OBSERVED'}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#52525b', margin: 0, lineHeight: 1.45 }}>
                    {primaryDecision === 'TEST_AGAIN'
                      ? `Your experiment currently has ${visitorsCount} visitor(s) and ${eventsCount} action(s). We advise gathering more testers before committing major engineering.`
                      : 'Visitors demonstrated active interaction with the main workflow.'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Synthesized Findings (if run) */}
            {aiResult && (
              <div className="exp-light-card" style={{ border: '2px solid #09090b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
                      AI SYNTHESIS // {aiResult.provider?.toUpperCase()}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                      Directional Findings
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="exp-event-badge feedback">CONFIDENCE: {aiResult.confidence}</span>
                    <span className="exp-event-badge click">RECOMMENDATION: {aiResult.suggestedOutcome}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#09090b', lineHeight: 1.6, marginBottom: '16px' }}>
                  {aiResult.summary}
                </p>

                {aiResult.hypotheses && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {aiResult.hypotheses.map((hyp: any, i: number) => (
                      <div key={i} style={{ backgroundColor: '#f8f9fa', padding: '10px 12px', borderRadius: '3px', border: '1px solid #e4e4e7' }}>
                        <div style={{ fontSize: '0.8125rem', color: '#09090b', fontWeight: 600 }}>{hyp.statement}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#71717a', marginTop: '2px' }}>Basis: {hyp.basis}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: DECIDE NEXT PAGE (PART 20) */}
        {activeTab === 'decision' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
                DECISION PLANNING
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#09090b', marginBottom: '4px' }}>
                What should you do next?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#52525b' }}>
                Choose the best path forward based on your real evidence and test results. Your recorded decisions persist permanently.
              </p>
            </div>

            {decisionNotice && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#15803d' }}>
                ✓ {decisionNotice}
              </div>
            )}

            {/* Primary Evidence-Based Recommendation (Part 20) */}
            <div
              className="exp-light-card"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #09090b',
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span className="exp-v2-tag">
                  PRIMARY RECOMMENDATION
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#52525b' }}>
                  {visitorsCount} visitors · {eventsCount} actions · {feedbackCount} feedback
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#09090b', marginBottom: '6px' }}>
                {primaryDecision === 'TEST_AGAIN' ? 'RUN ANOTHER TEST' : 'IMPROVE CORE WORKFLOW'}
              </h3>

              <p style={{ fontSize: '0.875rem', color: '#52525b', lineHeight: 1.5, marginBottom: '14px' }}>
                {primaryDecision === 'TEST_AGAIN'
                  ? 'Current evidence is insufficient to make a reliable product decision. Invite more testers before committing significant time or engineering budget.'
                  : 'Testers engaged with the main interactive path; address noted friction points before scaling.'}
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setShowShareModal(true)} className="exp-btn-primary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                  Share with More Testers
                </button>
                <button onClick={copyTestUrl} className="exp-btn-secondary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                  {copiedTestUrl ? 'Link Copied!' : 'Copy Test Link'}
                </button>
              </div>
            </div>

            {/* Five Understandable Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { outcome: 'BUILD' as DecisionOutcome, label: 'Build It', short: 'Evidence supports moving forward.' },
                { outcome: 'IMPROVE' as DecisionOutcome, label: 'Improve It', short: 'Fix observed problems and test again.' },
                { outcome: 'PIVOT' as DecisionOutcome, label: 'Change Direction', short: 'Test a different core approach.' },
                { outcome: 'STOP' as DecisionOutcome, label: 'Stop This Idea', short: 'Preserve time and resources.' },
                { outcome: 'TEST_AGAIN' as DecisionOutcome, label: 'Run Another Test', short: 'Collect more evidence first.' },
              ].map((item) => {
                const isSelected = selectedDecision === item.outcome;
                return (
                  <div
                    key={item.outcome}
                    onClick={() => setSelectedDecision(item.outcome)}
                    className="exp-light-card"
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #09090b' : '1px solid #e4e4e7',
                      backgroundColor: isSelected ? '#f8f9fa' : '#ffffff',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#09090b' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#52525b', marginTop: '2px', lineHeight: 1.4 }}>
                        {item.short}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Option Form */}
            <div className="exp-light-card">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: '#09090b', marginBottom: '14px' }}>
                Record Your Decision
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    WHY DID YOU CHOOSE THIS DIRECTION? (YOUR REASONING) *
                  </label>
                  <textarea
                    rows={3}
                    value={decisionReasoning}
                    onChange={(e) => setDecisionReasoning(e.target.value)}
                    placeholder="Explain why you are making this choice based on real test behavior or tester feedback..."
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e4e7', borderRadius: '4px', fontSize: '0.8125rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    WHAT IS YOUR IMMEDIATE NEXT STEP?
                  </label>
                  <input
                    type="text"
                    value={decisionNextStep}
                    onChange={(e) => setDecisionNextStep(e.target.value)}
                    placeholder="e.g., Share prototype with 5 founders on Peerlist..."
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e4e7', borderRadius: '4px', fontSize: '0.8125rem' }}
                  />
                </div>

                <button
                  onClick={handleSaveDecision}
                  disabled={savingDecision}
                  className="exp-btn-primary"
                  style={{ alignSelf: 'flex-start', minHeight: '40px' }}
                >
                  {savingDecision ? 'Saving decision...' : 'Save My Decision'}
                </button>
              </div>
            </div>

            {/* Decision History */}
            {experiment.decisions && experiment.decisions.length > 0 && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '10px' }}>
                  RECORDED DECISION HISTORY ({experiment.decisions.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {experiment.decisions.map((dec: any) => (
                    <div key={dec.id} className="exp-light-card" style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="exp-v2-tag">{dec.outcome}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
                          {new Date(dec.decidedAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.84375rem', color: '#09090b', margin: '4px 0' }}>{dec.reasoning}</p>
                      {dec.recommendedNextStep && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#52525b' }}>
                          Next: {dec.recommendedNextStep}
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

      {/* Share Testing Link Modal */}
      {showShareModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '4px',
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
              position: 'relative',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowShareModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
              SHAREABLE TEST LINK
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginBottom: '6px' }}>
              Invite Real Testers
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5, marginBottom: '16px' }}>
              Anyone with this link can test your prototype and submit feedback directly. No account required.
            </p>

            {/* Test URL Box */}
            <div
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e4e4e7',
                padding: '10px 14px',
                borderRadius: '3px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#09090b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <span style={{ wordBreak: 'break-all', overflow: 'hidden' }}>{publicTestUrl}</span>
              <button onClick={copyTestUrl} className="exp-btn-secondary" style={{ flexShrink: 0, padding: '4px 10px', minHeight: '32px' }}>
                {copiedTestUrl ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowShareModal(false)} className="exp-btn-secondary" style={{ minHeight: '38px', padding: '8px 16px' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
