'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Phone,
  Mail,
  Users,
  Compass,
  Building2,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

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
                marginBottom: '48px',
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
                padding: '18px 20px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
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
            padding: 'clamp(56px, 9vh, 88px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#070709',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
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
                  fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              >
                From Idea to Evidence.
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
                  color: 'var(--color-silver-300)',
                  maxWidth: '560px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                WIQN helps you test what people actually do, not just what they say.
              </p>
            </div>

            {/* 4 Compact Process Steps */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
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
                    padding: '22px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-silver-300)',
                      fontWeight: 600,
                    }}
                  >
                    {step.num} // {step.name}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
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
                      lineHeight: 1.55,
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
            SECTION 3: WHY WIQN (CORE VALUE & EVIDENCE PILLARS)
            ================================================================== */}
        <section
          id="why-wiqn"
          style={{
            padding: 'clamp(56px, 9vh, 88px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#050505',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
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
                  fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              >
                Don&apos;t Just Build. Prove It.
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
                  color: 'var(--color-silver-300)',
                  maxWidth: '560px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Turn real user behavior and feedback into evidence you can act on.
              </p>
            </div>

            {/* 4 Compact Value Pillars */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
              }}
            >
              {[
                {
                  icon: Activity,
                  title: 'BEHAVIOR',
                  highlight: 'Real interaction telemetry',
                  desc: 'Understand what users actually do. Observe authentic clicks, scroll milestones, and visitor paths without manual analytics setup.',
                },
                {
                  icon: MessageSquareQuote,
                  title: 'FEEDBACK',
                  highlight: 'Direct qualitative perspectives',
                  desc: 'Capture what users think and experience. Immediate tester reactions, confusion points, and clarity ratings right as participants explore.',
                },
                {
                  icon: Sparkles,
                  title: 'AI INSIGHTS',
                  highlight: 'Structured evidence interpretation',
                  desc: 'Turn collected evidence into structured insights. Automated synthesis separates verifiable interaction facts from interpretation.',
                },
                {
                  icon: Target,
                  title: 'DECISION',
                  highlight: 'Actionable verdict',
                  desc: 'Translate evidence into clear, defensible decisions: Build, Improve, Pivot, Stop, or Test Again.',
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
                      padding: '22px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <IconComponent size={17} />
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#ffffff',
                          marginBottom: '2px',
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
                        lineHeight: 1.55,
                      }}
                    >
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: ABOUT WIQN (MISSION + ASSUMPTIONS TIMELINE)
            ================================================================== */}
        <section
          id="about"
          style={{
            padding: 'clamp(56px, 9vh, 88px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#070709',
          }}
        >
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
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
                  MISSION &amp; FOUNDATION
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '14px',
                }}
              >
                About WIQN
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
                  color: 'var(--color-silver-200)',
                  maxWidth: '740px',
                  margin: '0 auto 12px auto',
                  lineHeight: 1.6,
                }}
              >
                WIQN is an AI-powered product validation and experimentation platform designed to help founders, developers, and product teams test ideas with real users before investing heavily in development.
              </p>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-silver-300)',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: 1.55,
                }}
              >
                WIQN connects prototypes, real users, behavioral telemetry, qualitative feedback, AI-assisted interpretation, and evidence-based decisions into one validation workflow.
              </p>
            </div>

            {/* Compact Visual Statement: Build Less on Assumptions */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                padding: '24px 20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-gray-500)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                OPERATING PRINCIPLE
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '16px',
                }}
              >
                Build Less on Assumptions.
              </h3>

              {/* Timeline Flow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '6px',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  maxWidth: '900px',
                  margin: '0 auto 14px auto',
                }}
              >
                {[
                  'IDEA',
                  'HYPOTHESIS',
                  'PROTOTYPE',
                  'REAL USERS',
                  'BEHAVIOR',
                  'EVIDENCE',
                  'DECISION',
                ].map((step, idx, arr) => (
                  <React.Fragment key={step}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: idx === arr.length - 1 ? '#ffffff' : 'var(--color-silver-200)',
                        padding: '4px 8px',
                        borderRadius: '2px',
                        backgroundColor: idx === arr.length - 1 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: idx === arr.length - 1 ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {step}
                    </span>
                    {idx < arr.length - 1 && (
                      <span style={{ color: 'var(--color-gray-500)', fontSize: '0.75rem', userSelect: 'none' }}>
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-silver-300)',
                  letterSpacing: '0.04em',
                }}
              >
                Test what people actually do — not only what they say.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 5: DIFFERENTIATION & WHERE WIQN FITS
            ================================================================== */}
        <section
          id="differentiation"
          style={{
            padding: 'clamp(56px, 9vh, 88px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#050505',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Differentiation Statement */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
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
                  CATEGORY POSITIONING
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3.8vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              >
                What makes WIQN different?
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
                  color: 'var(--color-silver-300)',
                  maxWidth: '680px',
                  margin: '0 auto 8px auto',
                  lineHeight: 1.5,
                }}
              >
                WIQN is not a website builder, an IDE, or a generic analytics dashboard.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                WIQN is an experimentation and product validation platform.
              </p>
            </div>

            {/* 4 Compact Differentiation Points */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                marginBottom: '40px',
              }}
            >
              {[
                {
                  title: 'Prototype Testing',
                  desc: 'Test real prototypes before full-scale development.',
                  icon: Layers,
                },
                {
                  title: 'Behavioral Evidence',
                  desc: 'Understand real user interactions with zero-config telemetry.',
                  icon: Activity,
                },
                {
                  title: 'Qualitative Feedback',
                  desc: 'Capture direct user perspectives and friction observations.',
                  icon: MessageSquareQuote,
                },
                {
                  title: 'AI-Assisted Interpretation',
                  desc: 'Turn collected evidence into structured insights and verdicts.',
                  icon: Sparkles,
                },
              ].map((pt) => {
                const IconComp = pt.icon;
                return (
                  <div
                    key={pt.title}
                    style={{
                      padding: '18px 16px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconComp size={16} color="var(--color-silver-200)" />
                      <h4
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#ffffff',
                        }}
                      >
                        {pt.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
                      {pt.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Comparison Matrix: Where WIQN Fits */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '6px',
                  }}
                >
                  Where WIQN Fits
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)' }}>
                  WIQN brings experimentation, behavioral evidence, user feedback, and AI-assisted interpretation into one validation workflow.
                </p>
              </div>

              {/* Viewport-Safe Horizontally Scrollable Comparison Container */}
              <div
                style={{
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: '#0a0a0d',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    minWidth: '640px',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '0.8125rem',
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                      <th style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-200)', textTransform: 'uppercase' }}>
                        Capability
                      </th>
                      <th style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>
                        Traditional Analytics
                      </th>
                      <th style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>
                        User Testing Platforms
                      </th>
                      <th style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>
                        Experimentation Tools
                      </th>
                      <th style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#ffffff', textTransform: 'uppercase', backgroundColor: 'rgba(255, 255, 255, 0.06)' }}>
                        WIQN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        cap: 'Behavioral Analytics',
                        trad: 'Strong',
                        test: 'Limited',
                        exp: 'Strong',
                        wiqn: 'Strong',
                      },
                      {
                        cap: 'Prototype Validation',
                        trad: 'Limited',
                        test: 'Strong',
                        exp: 'Partial',
                        wiqn: 'Strong',
                      },
                      {
                        cap: 'Real User Testing',
                        trad: 'Strong',
                        test: 'Strong',
                        exp: 'Strong',
                        wiqn: 'Strong',
                      },
                      {
                        cap: 'Qualitative Feedback',
                        trad: 'Limited',
                        test: 'Strong',
                        exp: 'Limited',
                        wiqn: 'Strong',
                      },
                      {
                        cap: 'AI-Assisted Evidence Interpretation',
                        trad: 'Varies',
                        test: 'Varies',
                        exp: 'Varies',
                        wiqn: 'Core capability',
                      },
                      {
                        cap: 'Structured Product Decision',
                        trad: 'Requires interpretation',
                        test: 'Requires interpretation',
                        exp: 'Requires interpretation',
                        wiqn: 'Structured decision workflow',
                      },
                    ].map((row, idx) => (
                      <tr
                        key={row.cap}
                        style={{
                          borderBottom: idx === 5 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                          backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#ffffff' }}>
                          {row.cap}
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-silver-300)' }}>
                          {row.trad}
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-silver-300)' }}>
                          {row.test}
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-silver-300)' }}>
                          {row.exp}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} color="#ffffff" />
                            <span>{row.wiqn}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Built for People Who Build */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.125rem, 2.2vw, 1.375rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                Built for People Who Build.
              </h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                { role: 'FOUNDERS', desc: 'Validate startup ideas before major investment.' },
                { role: 'INDIE HACKERS', desc: 'Test product assumptions quickly.' },
                { role: 'PRODUCT TEAMS', desc: 'Understand real user behavior and feedback.' },
                { role: 'DEVELOPERS', desc: 'Validate prototypes before building the full product.' },
              ].map((aud) => (
                <div
                  key={aud.role}
                  style={{
                    padding: '16px 14px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.015)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {aud.role}
                  </div>
                  <p style={{ fontSize: '0.78125rem', color: 'var(--color-silver-300)', lineHeight: 1.45 }}>
                    {aud.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 6: BUILT BY / FOUNDERS
            ================================================================== */}
        <section
          id="company"
          style={{
            padding: 'clamp(56px, 9vh, 88px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#070709',
          }}
        >
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
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
                  LEADERSHIP &amp; ORIGINS
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '10px',
                }}
              >
                Built by
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                The builders and leadership driving WIQN and ADYK forward.
              </p>
            </div>

            {/* Two Balanced Founder Cards Side-by-Side (Stacked on Mobile) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '28px',
              }}
            >
              {/* Founder 1: REJIESH ASHWANTH (With Uploaded Image) */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'border-color 200ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Real Uploaded Photo - No AI Alteration */}
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      backgroundColor: '#121215',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <Image
                      src="/brand/rejiesh-ashwanth.jpg"
                      alt="Rejiesh Ashwanth, CEO and Co-Founder of ADYK Multi Venture Company"
                      width={88}
                      height={88}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      priority
                    />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.1875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.02em',
                        marginBottom: '4px',
                      }}
                    >
                      REJIESH ASHWANTH
                    </h3>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--color-silver-200)',
                        letterSpacing: '0.08em',
                        lineHeight: 1.4,
                      }}
                    >
                      CEO &amp; CO-FOUNDER
                      <br />
                      <span style={{ color: 'var(--color-gray-400)' }}>ADYK MULTI VENTURE COMPANY</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.55 }}>
                  Leading product architecture, experimentation intelligence, and engineering at ADYK.
                </p>

                <a
                  href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                    transition: 'background-color 150ms ease, border-color 150ms ease',
                  }}
                  aria-label="View LinkedIn profile of Rejiesh Ashwanth"
                >
                  <LinkedInIcon size={14} />
                  <span>View LinkedIn</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>

              {/* Founder 2: DINESHRAJ S */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '4px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'border-color 200ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Clean Technical Emblem Avatar */}
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '8px',
                      flexShrink: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#ffffff',
                      }}
                    >
                      DS
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.12em',
                        color: 'var(--color-gray-500)',
                        textTransform: 'uppercase',
                        marginTop: '2px',
                      }}
                    >
                      ADYK
                    </span>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.1875rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.02em',
                        marginBottom: '4px',
                      }}
                    >
                      DINESHRAJ S
                    </h3>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--color-silver-200)',
                        letterSpacing: '0.08em',
                        lineHeight: 1.4,
                      }}
                    >
                      FOUNDER
                      <br />
                      <span style={{ color: 'var(--color-gray-400)' }}>ADYK MULTI VENTURE COMPANY</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.55 }}>
                  Guiding venture strategy, company operations, and ecosystem expansion at ADYK.
                </p>

                <a
                  href="https://www.linkedin.com/in/dineshraj-s-758931390"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                    transition: 'background-color 150ms ease, border-color 150ms ease',
                  }}
                  aria-label="View LinkedIn profile of Dineshraj S"
                >
                  <LinkedInIcon size={14} />
                  <span>View LinkedIn</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            {/* Company Attribution Statement */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-silver-300)',
                  lineHeight: 1.5,
                  maxWidth: '680px',
                }}
              >
                WIQN is built as part of ADYK&apos;s vision to create technology products that solve real problems and help people build smarter.
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-silver-200)',
                  letterSpacing: '0.06em',
                }}
              >
                Launched by <strong style={{ color: '#ffffff' }}>ADYK Multi Venture Company</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 7: CONTACT (DIRECT INTERACTIVE CONTACT CARDS)
            ================================================================== */}
        <section
          id="contact"
          style={{
            padding: 'clamp(56px, 9vh, 88px) 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#050505',
          }}
        >
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
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
                  GET IN TOUCH
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '10px',
                }}
              >
                Let&apos;s Talk.
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
                  color: 'var(--color-silver-300)',
                  maxWidth: '560px',
                  margin: '0 auto',
                  lineHeight: 1.5,
                }}
              >
                Questions, feedback, partnerships, or ideas? Get in touch with us.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '14px',
              }}
            >
              {/* Phone Card */}
              <div
                style={{
                  padding: '20px 18px',
                  borderRadius: '4px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <Phone size={16} color="#ffffff" />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '2px',
                    }}
                  >
                    PHONE
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 600, color: '#ffffff' }}>
                    8870605699
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                    Direct inquiry &amp; support
                  </p>
                </div>

                <a
                  href="tel:8870605699"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.78125rem',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'none',
                  }}
                >
                  <span>Call Us</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>

              {/* Email Card */}
              <div
                style={{
                  padding: '20px 18px',
                  borderRadius: '4px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <Mail size={16} color="#ffffff" />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '2px',
                    }}
                  >
                    EMAIL
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84375rem', fontWeight: 600, color: '#ffffff', wordBreak: 'break-all' }}>
                    adykcompany.in@gmail.com
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                    Official correspondence
                  </p>
                </div>

                <a
                  href="mailto:adykcompany.in@gmail.com"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.78125rem',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'none',
                  }}
                >
                  <span>Email Us</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>

              {/* LinkedIn Card */}
              <div
                style={{
                  padding: '20px 18px',
                  borderRadius: '4px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <LinkedInIcon size={16} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '2px',
                    }}
                  >
                    LINKEDIN
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff' }}>
                    Rejiesh &amp; Dineshraj
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                    ADYK Multi Venture Company
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <a
                    href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 8px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.71875rem',
                      fontFamily: 'var(--font-mono)',
                      textDecoration: 'none',
                    }}
                    aria-label="Rejiesh LinkedIn"
                  >
                    <span>Rejiesh</span>
                    <ArrowUpRight size={11} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dineshraj-s-758931390"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 8px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.71875rem',
                      fontFamily: 'var(--font-mono)',
                      textDecoration: 'none',
                    }}
                    aria-label="Dineshraj LinkedIn"
                  >
                    <span>Dineshraj</span>
                    <ArrowUpRight size={11} />
                  </a>
                </div>
              </div>

              {/* Instagram Card */}
              <div
                style={{
                  padding: '20px 18px',
                  borderRadius: '4px',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <InstagramIcon size={16} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '2px',
                    }}
                  >
                    INSTAGRAM
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff' }}>
                    @buildby.adyk
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                    Company updates &amp; announcements
                  </p>
                </div>

                <a
                  href="https://www.instagram.com/buildby.adyk"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.78125rem',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'none',
                  }}
                  aria-label="Visit Instagram @buildby.adyk"
                >
                  <span>Visit Instagram</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 8: FINAL CALL TO ACTION
            ================================================================== */}
        <section
          style={{
            padding: 'clamp(56px, 10vh, 88px) 20px',
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
                marginBottom: '12px',
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
                VALIDATE TODAY
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.85rem, 4.5vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '14px',
              }}
            >
              Ready to test your next idea?
            </h2>

            <p
              style={{
                fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                marginBottom: '28px',
              }}
            >
              Don&apos;t build on assumptions. Build with evidence.
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
                href="/login"
                className="btn-secondary"
                style={{
                  padding: '13px 22px',
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
