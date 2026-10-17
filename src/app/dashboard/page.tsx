'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardNav } from '@/components/DashboardNav';
import { REFERENCE_EXPERIMENT, REFERENCE_INSIGHTS } from '@/lib/storage';
import { Experiment } from '@/lib/types';
import { Plus, ArrowUpRight, Compass, BookOpen, Clock, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingReference, setCreatingReference] = useState(false);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/experiments');
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
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      <main style={{ padding: '40px 24px 80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '48px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '32px',
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: '8px' }}>
              <span className="eyebrow-dot" />
              <span>PRODUCT EXPERIMENTS</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--color-white)',
              }}
            >
              My Experiments
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                marginTop: '8px',
              }}
            >
              Track visitor actions on your prototypes, collect real tester feedback, and make confident decisions about what to build next.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {experiments.length === 0 && (
              <button
                onClick={handleLoadReference}
                disabled={creatingReference}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '10px 16px' }}
              >
                <BookOpen size={14} />
                <span>{creatingReference ? 'Creating in Neon...' : 'Load Example Experiment (Demo)'}</span>
              </button>
            )}

            <Link href="/experiments/new" className="btn-primary" style={{ fontSize: '0.75rem', padding: '10px 18px' }}>
              <Plus size={14} />
              <span>Start New Experiment</span>
            </Link>
          </div>
        </div>

        {/* Empty State vs Real Neon Experiments */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
            Loading your experiments...
          </div>
        ) : experiments.length === 0 ? (
          /* Plain-English Encouraging Empty State */
          <div
            style={{
              backgroundColor: '#0a0a0d',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '2px',
              padding: '80px 32px',
              textAlign: 'center',
              maxWidth: '680px',
              margin: '40px auto',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                color: 'var(--color-silver-300)',
              }}
            >
              <Compass size={22} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: 'var(--color-silver-300)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              GETTING STARTED
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-white)',
                marginBottom: '16px',
              }}
            >
              Start Your First Experiment
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                marginBottom: '36px',
                maxWidth: '480px',
                margin: '0 auto 36px auto',
              }}
            >
              Test your product idea with real visitors. Connect a link to your prototype or website, and see what people actually do.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/experiments/new" className="btn-primary" style={{ padding: '12px 22px' }}>
                <Plus size={16} />
                <span>Start New Experiment</span>
              </Link>

              <button
                onClick={handleLoadReference}
                disabled={creatingReference}
                className="btn-secondary"
                style={{ padding: '12px 22px' }}
              >
                <span>{creatingReference ? 'Creating in Neon...' : 'Load Example Experiment (Demo)'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Experiments Workspace */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Experiments Grid */}
            <section>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-silver-300)' }}>
                  ACTIVE EXPERIMENTS ({experiments.length})
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '20px',
                }}
              >
                {experiments.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      backgroundColor: '#0a0a0d',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '32px 28px',
                      borderRadius: '2px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 200ms ease, background-color 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                      e.currentTarget.style.backgroundColor = '#101014';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.backgroundColor = '#0a0a0d';
                    }}
                  >
                    <div>
                      {/* Header with Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <span className={`badge ${exp.status === 'ACTIVE' ? 'badge-active' : ''}`}>
                          {exp.status}
                        </span>

                        <span className={`badge ${exp.testingMode === 'CARDEX_ALPHA' ? 'badge-cardex' : ''}`}>
                          {exp.testingMode === 'CARDEX_ALPHA' ? 'CARDEX ALPHA' : 'PRIVATE'}
                        </span>
                      </div>

                      {/* Product Name & Title */}
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                        {exp.productName}
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--color-white)',
                          marginTop: '4px',
                          marginBottom: '12px',
                          lineHeight: 1.3,
                        }}
                      >
                        {exp.name}
                      </h3>

                      {/* Key Hypothesis */}
                      <p
                        style={{
                          fontFamily: 'var(--font-primary)',
                          fontSize: '0.875rem',
                          color: 'var(--color-silver-300)',
                          lineHeight: 1.6,
                          marginBottom: '24px',
                        }}
                      >
                        <strong style={{ color: 'var(--color-silver-200)', fontWeight: 600 }}>Your Idea to Test: </strong>
                        {exp.keyHypothesis}
                      </p>
                    </div>

                    {/* Metrics Footer (Real counts from Neon PostgreSQL) */}
                    <div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '12px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          paddingTop: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>VISITORS</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                            {exp.metrics ? exp.metrics.visitorsCount : 0}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>ACTIONS</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                            {exp.metrics ? exp.metrics.interactionsCount : 0}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>FEEDBACK</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                            {exp.metrics ? exp.metrics.feedbackCount : 0}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/experiments/${exp.id}`}
                        className="btn-secondary"
                        style={{ width: '100%', justifyContent: 'space-between', padding: '10px 16px', fontSize: '0.75rem' }}
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '32px',
              }}
            >
              {/* Recent Activity Feed */}
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px solid var(--border-subtle)',
                  padding: '32px 28px',
                  borderRadius: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <Clock size={16} style={{ color: 'var(--color-silver-300)' }} />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-silver-300)' }}>
                    RECENT ACTIVITY
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '14px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                      DATABASE STORAGE
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-white)', marginTop: '2px' }}>
                      All experiments and live visitor counts are saved securely.
                    </div>
                  </div>

                  <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '14px' }}>
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
              <div
                style={{
                  backgroundColor: '#0a0a0d',
                  border: '1px solid var(--border-subtle)',
                  padding: '32px 28px',
                  borderRadius: '2px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} style={{ color: 'var(--color-silver-300)' }} />
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-silver-300)' }}>
                      SYNTHESIZED INSIGHTS
                    </div>
                  </div>
                  <span className="badge" style={{ fontSize: '0.5625rem' }}>
                    BENCHMARK SPECIFICATION
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {REFERENCE_INSIGHTS.slice(0, 2).map((ins) => (
                    <div key={ins.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
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
