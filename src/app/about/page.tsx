import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Users,
  Activity,
  MessageSquareQuote,
  Compass,
  Sparkles,
  Target,
  LayoutDashboard,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About WIQN — Product Validation & Experimentation',
  description:
    'Learn how WIQN helps founders and product teams validate ideas using real users, behavioral evidence, feedback, and AI-assisted insights.',
};

export default function AboutPage() {
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

      <Navigation />

      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '64px' }}>
        {/* ==================================================================
            HERO SECTION
            ================================================================== */}
        <section
          style={{
            paddingTop: 'clamp(96px, 14vh, 140px)',
            paddingBottom: 'clamp(48px, 8vh, 72px)',
            paddingLeft: '20px',
            paddingRight: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }}>
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                marginBottom: '20px',
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
                ABOUT WIQN
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '16px',
              }}
            >
              About WIQN
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.9375rem, 1.8vw, 1.125rem)',
                color: 'var(--color-silver-200)',
                letterSpacing: '0.04em',
                marginBottom: '24px',
                fontWeight: 500,
              }}
            >
              From Idea to Evidence.
            </p>

            {/* Main Explanation */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.125rem)',
                color: 'var(--color-silver-300)',
                lineHeight: 1.65,
                marginBottom: '16px',
                textWrap: 'balance',
              }}
            >
              WIQN is an AI-powered product validation and experimentation platform designed to help founders, developers, and product teams test ideas with real users before investing heavily in development.
            </p>

            <p
              style={{
                fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
                color: 'var(--color-gray-400)',
                lineHeight: 1.6,
                textWrap: 'balance',
              }}
            >
              WIQN connects prototypes, real users, behavioral telemetry, qualitative feedback, AI-powered interpretation, and evidence-based decisions into one validation workflow.
            </p>
          </div>
        </section>

        {/* ==================================================================
            PHILOSOPHY: BUILD LESS ON ASSUMPTIONS + MINIMAL TIMELINE
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div
            style={{
              padding: 'clamp(28px, 4vw, 44px)',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
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
                marginBottom: '10px',
              }}
            >
              CORE PHILOSOPHY
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '14px',
              }}
            >
              Build Less on Assumptions.
            </h2>
            <p
              style={{
                maxWidth: '680px',
                margin: '0 auto 32px auto',
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
              }}
            >
              Many products are built around assumptions about what users want. WIQN helps teams test those assumptions with real user behavior and feedback before committing significant time and resources.
            </p>

            {/* Minimal Timeline Flow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                maxWidth: '920px',
                margin: '0 auto',
              }}
            >
              {[
                'ASSUMPTION',
                'PROTOTYPE',
                'REAL USERS',
                'REAL BEHAVIOR',
                'EVIDENCE',
                'DECISION',
              ].map((step, idx, arr) => (
                <React.Fragment key={step}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: idx === arr.length - 1 ? '#ffffff' : 'var(--color-silver-200)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: idx === arr.length - 1 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: idx === arr.length - 1 ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {step}
                  </div>
                  {idx < arr.length - 1 && (
                    <span style={{ color: 'var(--color-gray-500)', fontSize: '0.75rem', userSelect: 'none' }}>
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            FEATURE GRID: EVERYTHING YOU NEED TO VALIDATE AN IDEA
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
              CAPABILITIES
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.625rem, 3vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '10px',
              }}
            >
              Everything You Need to Validate an Idea.
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Real capabilities implemented in production to take you from initial hypothesis to validated next steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                id: '01',
                title: 'Prototype Testing',
                description: 'Test prototypes with real users without rebuilding the entire product.',
                icon: <Layers size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
              {
                id: '02',
                title: 'Real User Testing',
                description: 'Invite users and observe how they actually interact with your prototype.',
                icon: <Users size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
              {
                id: '03',
                title: 'Behavioral Telemetry',
                description: 'Capture meaningful user interactions, navigation behavior, sessions, clicks, and other supported events.',
                icon: <Activity size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
              {
                id: '04',
                title: 'Feedback Collection',
                description: 'Collect direct qualitative feedback from testers.',
                icon: <MessageSquareQuote size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
              {
                id: '05',
                title: 'Event Explorer',
                description: 'Explore behavioral events and understand what users actually did.',
                icon: <Compass size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
              {
                id: '06',
                title: 'AI Evidence Engine',
                description: 'Turn collected evidence into structured, evidence-grounded insights.',
                icon: <Sparkles size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
              {
                id: '07',
                title: 'Validation Decisions',
                description: 'Translate evidence into practical decisions such as: BUILD, IMPROVE, PIVOT, STOP, TEST AGAIN.',
                icon: <Target size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
              {
                id: '08',
                title: 'Founder Validation Dashboard',
                description: 'Keep experiments, evidence, feedback, analytics, and decisions organized in one place.',
                icon: <LayoutDashboard size={18} style={{ color: 'var(--color-silver-200)' }} />,
              },
            ].map((f) => (
              <div
                key={f.id}
                style={{
                  padding: '22px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'border-color 200ms ease, background-color 200ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {f.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--color-gray-500)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {f.id}
                  </span>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: '6px',
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-gray-400)',
                      lineHeight: 1.5,
                    }}
                  >
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            WHY WIQN? — 4 STRONG ADVANTAGES
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
              ADVANTAGES
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.625rem, 3vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '10px',
              }}
            >
              Why WIQN?
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Built specifically to bridge the costly gap between raw idea and real-world adoption.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                num: '01',
                title: 'Evidence Before Investment',
                description: 'Test ideas before spending months building them.',
              },
              {
                num: '02',
                title: 'Real Behavior Over Assumptions',
                description: 'See what users actually do, not only what they say.',
              },
              {
                num: '03',
                title: 'One Validation Workflow',
                description: 'Prototype, users, telemetry, feedback, insights, and decisions connected in one workflow.',
              },
              {
                num: '04',
                title: 'AI-Assisted Interpretation',
                description: 'Use AI to interpret collected evidence while keeping conclusions grounded in available data.',
              },
            ].map((adv) => (
              <div
                key={adv.num}
                style={{
                  padding: '24px 22px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-silver-200)',
                    fontWeight: 600,
                  }}
                >
                  {adv.num}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  {adv.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.84375rem',
                    color: 'var(--color-silver-300)',
                    lineHeight: 1.55,
                  }}
                >
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            COMPETITIVE POSITIONING / COMPARISON TABLE: WHERE WIQN FITS
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
              POSITIONING MATRIX
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.625rem, 3vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '10px',
              }}
            >
              Where WIQN Fits
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              WIQN combines product experimentation, behavioral evidence, user feedback, and AI-assisted interpretation into one validation workflow.
            </p>
          </div>

          {/* Responsive Comparison Table Container with Controlled Scroll */}
          <div
            style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(255, 255, 255, 0.015)',
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: '680px',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.8125rem',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <th
                    style={{
                      padding: '16px 20px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.1em',
                      color: 'var(--color-silver-200)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Capability
                  </th>
                  <th
                    style={{
                      padding: '16px 16px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.08em',
                      color: 'var(--color-gray-400)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Traditional Analytics
                  </th>
                  <th
                    style={{
                      padding: '16px 16px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.08em',
                      color: 'var(--color-gray-400)',
                      textTransform: 'uppercase',
                    }}
                  >
                    User Testing Platforms
                  </th>
                  <th
                    style={{
                      padding: '16px 16px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.08em',
                      color: 'var(--color-gray-400)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Product Experimentation
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.1em',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    WIQN
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    capability: 'Analytics',
                    traditional: 'Strong',
                    userTesting: 'Limited / Different Focus',
                    experimentation: 'Strong',
                    wiqn: 'Strong',
                  },
                  {
                    capability: 'Prototype Validation',
                    traditional: 'Limited',
                    userTesting: 'Strong',
                    experimentation: 'Partial',
                    wiqn: 'Strong',
                  },
                  {
                    capability: 'Real User Behavior',
                    traditional: 'Strong',
                    userTesting: 'Strong',
                    experimentation: 'Strong',
                    wiqn: 'Strong',
                  },
                  {
                    capability: 'Qualitative Feedback',
                    traditional: 'Limited',
                    userTesting: 'Strong',
                    experimentation: 'Limited / Depends on tool',
                    wiqn: 'Strong',
                  },
                  {
                    capability: 'AI Evidence Interpretation',
                    traditional: 'Varies',
                    userTesting: 'Varies',
                    experimentation: 'Varies',
                    wiqn: 'Core capability',
                  },
                  {
                    capability: 'Evidence-Based Product Decision',
                    traditional: 'Requires interpretation',
                    userTesting: 'Requires interpretation',
                    experimentation: 'Requires interpretation',
                    wiqn: 'Structured decision workflow',
                  },
                ].map((row, idx) => (
                  <tr
                    key={row.capability}
                    style={{
                      borderBottom: idx === 5 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                    }}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#ffffff' }}>
                      {row.capability}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-silver-300)' }}>
                      {row.traditional}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-silver-300)' }}>
                      {row.userTesting}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-silver-300)' }}>
                      {row.experimentation}
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        fontWeight: 600,
                        color: '#ffffff',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <CheckCircle2 size={12} color="#ffffff" />
                        <span>{row.wiqn}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--color-gray-500)',
              textAlign: 'right',
            }}
          >
            * Comparison reflects typical category focal areas rather than individual branded limits.
          </div>
        </section>

        {/* ==================================================================
            ONE LOOP: FROM IDEA TO DECISION
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div
            style={{
              padding: 'clamp(32px, 5vw, 48px)',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
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
                marginBottom: '10px',
              }}
            >
              UNIFIED VALIDATION PIPELINE
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.8vw, 2.125rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '14px',
              }}
            >
              One Loop. From Idea to Decision.
            </h2>

            {/* Complete Validation Pipeline Horizontal Flow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '20px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                maxWidth: '980px',
                margin: '0 auto 24px auto',
              }}
            >
              {[
                'IDEA',
                'HYPOTHESIS',
                'PROTOTYPE',
                'REAL USERS',
                'BEHAVIOR',
                'FEEDBACK',
                'AI INSIGHTS',
                'DECISION',
              ].map((step, idx, arr) => (
                <React.Fragment key={step}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: idx === arr.length - 1 ? '#ffffff' : 'var(--color-silver-200)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: idx === arr.length - 1 ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                      border: idx === arr.length - 1 ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {step}
                  </div>
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
                maxWidth: '720px',
                margin: '0 auto',
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
              }}
            >
              WIQN is designed around the complete validation loop rather than treating analytics, testing, feedback, and decision-making as separate activities.
            </p>
          </div>
        </section>

        {/* ==================================================================
            BUILT FOR PEOPLE WHO BUILD
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
              AUDIENCE
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.625rem, 3vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '10px',
              }}
            >
              Built for People Who Build.
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              Designed for creators who need real validation before writing months of production code.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                role: 'FOUNDERS',
                desc: 'Validate startup ideas before major investment.',
              },
              {
                role: 'INDIE HACKERS',
                desc: 'Test product assumptions quickly.',
              },
              {
                role: 'PRODUCT TEAMS',
                desc: 'Understand real user behavior and feedback.',
              },
              {
                role: 'DEVELOPERS',
                desc: 'Validate prototypes before turning them into full products.',
              },
            ].map((item) => (
              <div
                key={item.role}
                style={{
                  padding: '24px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  {item.role}
                </div>
                <p
                  style={{
                    fontSize: '0.84375rem',
                    color: 'var(--color-silver-300)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            POSITIONING BLOCK: NOT ANOTHER WEBSITE BUILDER
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div
            style={{
              padding: 'clamp(28px, 4vw, 40px)',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.015)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-gray-500)',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                PRODUCT BOUNDARIES
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.375rem, 2.2vw, 1.875rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                WIQN Is Not Another Website Builder.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.1em',
                    color: 'var(--color-gray-500)',
                    textTransform: 'uppercase',
                  }}
                >
                  WIQN IS NOT:
                </span>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.84375rem',
                    color: 'var(--color-gray-400)',
                  }}
                >
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--color-gray-500)' }}>✕</span> A website builder
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--color-gray-500)' }}>✕</span> An IDE
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--color-gray-500)' }}>✕</span> A generic analytics dashboard
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--color-gray-500)' }}>✕</span> A replacement for product development
                  </li>
                </ul>
              </div>
            </div>

            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  color: 'var(--color-silver-200)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                WIQN IS:
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  lineHeight: 1.5,
                  color: '#ffffff',
                  fontWeight: 500,
                }}
              >
                “An experimentation and product validation platform built to help teams turn ideas into evidence.”
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            FOUNDER ATTRIBUTION & LAUNCH SECTION
            ================================================================== */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '72px',
          }}
        >
          <div
            style={{
              padding: 'clamp(32px, 5vw, 44px)',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-gray-500)',
                  textTransform: 'uppercase',
                }}
              >
                FOUNDER & LEADERSHIP ATTRIBUTION
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                }}
              >
                Built by
              </h2>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingLeft: '16px',
                borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.02em',
                }}
              >
                REJIESH ASHWANTH
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-silver-200)',
                  lineHeight: 1.4,
                }}
              >
                CEO & Co-Founder
                <br />
                ADYK Multi Venture Company
              </div>
            </div>

            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                maxWidth: '720px',
              }}
            >
              WIQN was built as part of ADYK&apos;s vision to create technology products that solve real-world problems and help people build smarter.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-gray-400)',
                  letterSpacing: '0.04em',
                }}
              >
                Launch by <span style={{ color: '#ffffff', fontWeight: 600 }}>ADYK Multi Venture Company</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <a
                  href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'none',
                    transition: 'background-color 150ms ease',
                  }}
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight size={13} />
                </a>

                <a
                  href="https://www.instagram.com/buildby.adyk"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'none',
                    transition: 'background-color 150ms ease',
                  }}
                >
                  <span>Instagram @buildby.adyk</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            FINAL CTA
            ================================================================== */}
        <section
          style={{
            maxWidth: '880px',
            margin: '0 auto',
            padding: '0 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              padding: 'clamp(36px, 6vw, 56px)',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              Build with evidence.
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-silver-300)',
                maxWidth: '460px',
                margin: '0 auto 28px auto',
                lineHeight: 1.5,
              }}
            >
              Test your next idea before investing heavily in it. Start your first experiment in minutes.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href="/experiments/new"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  textDecoration: 'none',
                }}
              >
                <span>Start Validating</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                <span>Get In Touch</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
