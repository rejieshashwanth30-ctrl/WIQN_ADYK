'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ChevronDown,
  Layers,
  Activity,
  MessageSquareQuote,
  Sparkles,
  Target,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#050505', color: '#f4f4f5' }}>
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.04) 0%, rgba(5, 5, 5, 0) 65%)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
        }}
      />

      {/* Header Navigation */}
      <Navigation />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* ==================================================================
            SECTION 1: HERO
            ================================================================== */}
        <section
          style={{
            minHeight: 'calc(100vh - 72px)',
            paddingTop: 'clamp(96px, 14vh, 140px)',
            paddingBottom: 'clamp(48px, 8vh, 72px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingLeft: '20px',
            paddingRight: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
            {/* Eyebrow Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-silver-200)',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                AI-POWERED PRODUCT VALIDATION
              </span>
            </div>

            {/* Primary Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.125rem, 5.5vw, 4.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                color: '#ffffff',
                marginBottom: '20px',
                textWrap: 'balance',
              }}
            >
              Test Ideas. Discover Truth. Build Smarter.
            </h1>

            {/* Secondary Supporting Text */}
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'clamp(0.9375rem, 2.2vw, 1.125rem)',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto 32px auto',
                textWrap: 'pretty',
              }}
            >
              Validate product ideas with real users, behavioral evidence, feedback, and AI-powered insights before investing heavily in development.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                marginBottom: '56px',
              }}
            >
              <Link
                href="/experiments/new"
                className="btn-primary"
                style={{
                  padding: '13px 26px',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Start Validating</span>
                <ArrowUpRight size={15} />
              </Link>

              <Link
                href="#how-it-works"
                className="btn-secondary"
                style={{
                  padding: '13px 22px',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>See How It Works</span>
                <ChevronDown size={14} />
              </Link>
            </div>

            {/* Visual Product Signal: Compact Workflow Pipeline */}
            <div
              style={{
                backgroundColor: 'rgba(10, 10, 13, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '4px',
                padding: '20px 24px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-silver-300)',
                      textTransform: 'uppercase',
                    }}
                  >
                    WIQN VALIDATION PIPELINE
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    color: 'var(--color-gray-500)',
                    letterSpacing: '0.08em',
                  }}
                >
                  CONTINUOUS VERIFICATION CYCLE
                </span>
              </div>

              {/* Steps Flow (Desktop horizontal, Mobile compact flex-wrap) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
                  gap: '8px',
                }}
              >
                {[
                  { step: '01', label: 'IDEA', detail: 'Hypothesis' },
                  { step: '02', label: 'PROTOTYPE', detail: 'Interactive URL' },
                  { step: '03', label: 'REAL USERS', detail: 'Testers' },
                  { step: '04', label: 'BEHAVIOR', detail: 'Autocapture' },
                  { step: '05', label: 'FEEDBACK', detail: 'Observations' },
                  { step: '06', label: 'AI INSIGHTS', detail: 'Synthesis' },
                  { step: '07', label: 'DECISION', detail: 'Build or Pivot' },
                ].map((item, idx, arr) => (
                  <div
                    key={item.label}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '2px',
                      padding: '10px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: 'var(--color-gray-500)',
                        }}
                      >
                        {item.step}
                      </span>
                      {idx === arr.length - 1 && (
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: '#ffffff',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.625rem',
                        color: 'var(--color-silver-300)',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: HOW WIQN WORKS
            ================================================================== */}
        <section
          id="how-it-works"
          style={{
            padding: 'clamp(56px, 10vh, 96px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#070709',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <span className="eyebrow-dot" />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.16em',
                    color: 'var(--color-silver-300)',
                    textTransform: 'uppercase',
                  }}
                >
                  THE VALIDATION LIFECYCLE
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.85rem, 4.2vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '14px',
                }}
              >
                From Idea to Evidence.
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                  color: 'var(--color-silver-300)',
                  maxWidth: '560px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                WIQN helps you test what people actually do, not just what they say.
              </p>
            </div>

            {/* 4 Compact Steps */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                {
                  num: '01',
                  name: 'Define',
                  summary: 'Create the idea and hypotheses.',
                  desc: 'State your falsifiable assumptions, target audience, and explicit learning goals before committing engineering bandwidth.',
                },
                {
                  num: '02',
                  name: 'Test',
                  summary: 'Connect your prototype & invite users.',
                  desc: 'Attach your live prototype URL. Share 1-click tester links with sandboxed observation and zero setup friction for testers.',
                },
                {
                  num: '03',
                  name: 'Measure',
                  summary: 'Capture real behavior & feedback.',
                  desc: 'Zero-config autocapture records clicks, scroll milestones, session duration, user paths, and direct qualitative friction notes.',
                },
                {
                  num: '04',
                  name: 'Decide',
                  summary: 'Use evidence to choose what to build.',
                  desc: 'Evidence-grounded AI synthesizes interaction facts to guide your next verdict: Build, Improve, Pivot, Stop, or Test Again.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    backgroundColor: '#0c0c0f',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    padding: '24px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'border-color 200ms ease, background-color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.backgroundColor = '#101014';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.backgroundColor = '#0c0c0f';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        letterSpacing: '0.12em',
                        color: 'var(--color-silver-300)',
                        fontWeight: 600,
                      }}
                    >
                      {step.num} // {step.name}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.0625rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.summary}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-silver-300)',
                      lineHeight: 1.6,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: EVIDENCE & VALUE
            ================================================================== */}
        <section
          id="evidence"
          style={{
            padding: 'clamp(56px, 10vh, 96px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#050505',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <span className="eyebrow-dot" />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.16em',
                    color: 'var(--color-silver-300)',
                    textTransform: 'uppercase',
                  }}
                >
                  EMPIRICAL DIFFERENTIATION
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.85rem, 4.2vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '14px',
                }}
              >
                Don't Just Build. Prove It.
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                  color: 'var(--color-silver-300)',
                  maxWidth: '560px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Turn real user behavior and feedback into evidence you can act on.
              </p>
            </div>

            {/* 4 Core Value Pillars */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '40px',
              }}
            >
              {[
                {
                  icon: Activity,
                  title: 'Behavior',
                  highlight: 'Real interaction telemetry',
                  desc: 'Observe authentic clicks, scroll milestones, and visitor paths on your live prototype without manual analytics configuration.',
                },
                {
                  icon: MessageSquareQuote,
                  title: 'Feedback',
                  highlight: 'Direct qualitative feedback',
                  desc: 'Capture immediate tester reactions, confusion points, and clarity ratings right as participants explore your prototype.',
                },
                {
                  icon: Sparkles,
                  title: 'Insights',
                  highlight: 'Evidence-grounded AI',
                  desc: 'Automated synthesis separates verifiable interaction facts from interpretation, eliminating guesswork and cognitive bias.',
                },
                {
                  icon: Target,
                  title: 'Decision',
                  highlight: 'Actionable verdict',
                  desc: 'Make clear, defensible decisions: Build It, Improve It, Pivot Direction, Stop Testing, or Run Another Test.',
                },
              ].map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    style={{
                      backgroundColor: '#0a0a0d',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '2px',
                      padding: '24px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <IconComponent size={18} />
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.0625rem',
                          fontWeight: 600,
                          color: '#ffffff',
                          marginBottom: '4px',
                        }}
                      >
                        {pillar.title}
                      </h3>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          color: 'var(--color-silver-200)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {pillar.highlight}
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-silver-300)',
                        lineHeight: 1.6,
                      }}
                    >
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Platform Positioning / Trust Statement */}
            <div
              id="platform"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                padding: 'clamp(20px, 4vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'center',
                maxWidth: '820px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-silver-300)',
                  textTransform: 'uppercase',
                }}
              >
                PRODUCT POSITIONING
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                }}
              >
                An Experimentation & Product Validation Platform
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-silver-300)',
                  lineHeight: 1.6,
                  maxWidth: '680px',
                  margin: '0 auto',
                }}
              >
                WIQN is not a website builder, an IDE, or a generic analytics dashboard. It is a purpose-built system designed to test product assumptions against real user behavior before committing engineering resources.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: FINAL CALL TO ACTION
            ================================================================== */}
        <section
          style={{
            padding: 'clamp(64px, 12vh, 112px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#070709',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <span className="eyebrow-dot" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.16em',
                  color: 'var(--color-silver-300)',
                  textTransform: 'uppercase',
                }}
              >
                READY FOR LAUNCH
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '16px',
              }}
            >
              Build with evidence.
            </h2>

            <p
              style={{
                fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                marginBottom: '32px',
              }}
            >
              Test your next idea before investing heavily in it.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/experiments/new"
                className="btn-primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Start Validating</span>
                <ArrowUpRight size={16} />
              </Link>

              <Link
                href="/login"
                className="btn-secondary"
                style={{
                  padding: '14px 24px',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                }}
              >
                <span>Log In to Workspace</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
