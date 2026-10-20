'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardNav } from '@/components/DashboardNav';
import { REFERENCE_EXPERIMENT, REFERENCE_INSIGHTS } from '@/lib/storage';
import { Experiment } from '@/lib/types';
import { Plus, ArrowUpRight, Compass, BookOpen, Clock, Sparkles } from 'lucide-react';
import { authenticatedFetch } from '@/lib/api-client';

export default function DashboardPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingReference, setCreatingReference] = useState(false);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const res = await authenticatedFetch('/api/experiments');
      if (res.ok) {
        const json = await res.json();
        setExperiments(json.data || []);
      }
    } catch (err) {
      console.error('Failed to query experiments from Neon:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleLoadReference = async () => {
    try {
      setCreatingReference(true);
      const res = await authenticatedFetch('/api/experiments', {
        method: 'POST',
        body: JSON.stringify({
          name: REFERENCE_EXPERIMENT.name,
          productName: REFERENCE_EXPERIMENT.productName,
          problem: REFERENCE_EXPERIMENT.problem,
          targetAudience: REFERENCE_EXPERIMENT.targetAudience,
          productIdea: REFERENCE_EXPERIMENT.productIdea,
          keyHypothesis: REFERENCE_EXPERIMENT.keyHypothesis,
          learningGoal: REFERENCE_EXPERIMENT.learningGoal,
          prototypeUrl: REFERENCE_EXPERIMENT.prototypeUrl,
          testingMode: REFERENCE_EXPERIMENT.testingMode,
          status: 'ACTIVE',
        }),
      });

      if (res.ok) {
        await fetchExperiments();
      }
    } catch (err) {
      console.error('Failed to create reference experiment in Neon:', err);
    } finally {
      setCreatingReference(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'var(--color-off-white)' }}>
      <DashboardNav />

      <main className="dash-main-container">
        {/* Welcome Header */}
        <div className="dash-welcome-header">
          <div className="dash-welcome-text">
            <div className="eyebrow dash-eyebrow">
              <span className="eyebrow-dot" />
              <span>PRODUCT EXPERIMENTS</span>
            </div>
            <h1 className="dash-title">
              My Experiments
            </h1>
            <p className="dash-desc">
              Track visitor actions on your prototypes, collect real tester feedback, and make confident decisions about what to build next.
            </p>
          </div>

          <div className="dash-header-actions">
            {experiments.length === 0 && (
              <button
                onClick={handleLoadReference}
                disabled={creatingReference}
                className="dash-secondary-cta"
              >
                <BookOpen size={14} />
                <span>{creatingReference ? 'Creating in Neon...' : 'Load Example Experiment (Demo)'}</span>
              </button>
            )}

            <Link href="/experiments/new" className="dash-primary-cta">
              <Plus size={14} />
              <span>Start New Experiment</span>
            </Link>
          </div>
        </div>

        {/* Empty State vs Real Neon Experiments */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
            Loading your experiments...
          </div>
        ) : experiments.length === 0 ? (
          /* Plain-English Encouraging Empty State */
          <div className="dash-empty-state">
            <div className="dash-empty-icon">
              <Compass size={22} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: 'var(--color-silver-300)',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              GETTING STARTED
            </div>

            <h2 className="dash-empty-title">
              Start Your First Experiment
            </h2>

            <p className="dash-empty-desc">
              Test your product idea with real visitors. Connect a link to your prototype or website, and see what people actually do.
            </p>

            <div className="dash-header-actions" style={{ justifyContent: 'center' }}>
              <Link href="/experiments/new" className="dash-primary-cta">
                <Plus size={14} />
                <span>Start New Experiment</span>
              </Link>

              <button
                onClick={handleLoadReference}
                disabled={creatingReference}
                className="dash-secondary-cta"
              >
                <span>{creatingReference ? 'Creating in Neon...' : 'Load Example Experiment (Demo)'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Experiments Workspace */
          <div className="dash-workspace-stack">
            {/* Experiments Grid */}
            <section>
              <div className="dash-section-header">
                <div className="dash-section-label">
                  ACTIVE EXPERIMENTS ({experiments.length})
                </div>
              </div>

              <div className="dash-experiments-grid">
                {experiments.map((exp) => (
                  <div key={exp.id} className="dash-exp-card">
                    <div>
                      {/* Header with Badges */}
                      <div className="dash-card-badges">
                        <span className={`badge ${exp.status === 'ACTIVE' ? 'badge-active' : ''}`}>
                          {exp.status}
                        </span>

                        <span className={`badge ${exp.testingMode === 'CARDEX_ALPHA' ? 'badge-cardex' : ''}`}>
                          {exp.testingMode === 'CARDEX_ALPHA' ? 'CARDEX ALPHA' : 'PRIVATE'}
                        </span>
                      </div>

                      {/* Product Name & Title */}
                      <div className="dash-card-product">
                        {exp.productName}
                      </div>

                      <h3 className="dash-card-title">
                        {exp.name}
                      </h3>

                      {/* Key Hypothesis */}
                      <p className="dash-card-hypothesis">
                        <strong style={{ color: 'var(--color-silver-200)', fontWeight: 600 }}>Your Idea to Test: </strong>
                        {exp.keyHypothesis}
                      </p>
                    </div>

                    {/* Metrics Footer (Real counts from Neon PostgreSQL) */}
                    <div>
                      <div className="dash-metrics-strip">
                        <div>
                          <div className="dash-metric-label">VISITORS</div>
                          <div className="dash-metric-val">
                            {exp.metrics ? exp.metrics.visitorsCount : 0}
                          </div>
                        </div>

                        <div>
                          <div className="dash-metric-label">ACTIONS</div>
                          <div className="dash-metric-val">
                            {exp.metrics ? exp.metrics.interactionsCount : 0}
                          </div>
                        </div>

                        <div>
                          <div className="dash-metric-label">FEEDBACK</div>
                          <div className="dash-metric-val">
                            {exp.metrics ? exp.metrics.feedbackCount : 0}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/experiments/${exp.id}`}
                        className="btn-secondary dash-card-action"
                      >
                        <span>View Results &amp; Details</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity & Latest Insights Dual Column */}
            <div className="dash-insights-grid">
              {/* Recent Activity Feed */}
              <div className="dash-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Clock size={15} style={{ color: 'var(--color-silver-300)' }} />
                  <div className="dash-section-label">
                    RECENT ACTIVITY
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                      DATABASE STORAGE
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-white)', marginTop: '2px' }}>
                      All experiments and live visitor counts are saved securely.
                    </div>
                  </div>

                  <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                      ACCOUNT ACCESS
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                      Signed in and protected with secure authentication.
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Structured Insights Preview */}
              <div className="dash-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={15} style={{ color: 'var(--color-silver-300)' }} />
                    <div className="dash-section-label">
                      SYNTHESIZED INSIGHTS
                    </div>
                  </div>
                  <span className="badge" style={{ fontSize: '0.5625rem' }}>
                    BENCHMARK SPECIFICATION
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {REFERENCE_INSIGHTS.slice(0, 2).map((ins) => (
                    <div key={ins.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#ffffff', letterSpacing: '0.1em' }}>
                          // {ins.type} (SAMPLE MODEL)
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
                          CONFIDENCE: {ins.confidence}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-silver-200)', lineHeight: 1.5 }}>
                        {ins.statement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
