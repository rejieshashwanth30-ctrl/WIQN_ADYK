'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

const JOURNEY_STEPS = [
  { num: '01', label: 'IDEA', detail: 'Falsifiable Hypothesis' },
  { num: '02', label: 'PROTOTYPE', detail: 'Interactive URL' },
  { num: '03', label: 'REAL USERS', detail: 'Authentic Testers' },
  { num: '04', label: 'EVIDENCE', detail: 'Telemetry & Signals' },
  { num: '05', label: 'DECISION', detail: 'Structured Verdict' },
];

export const HeroSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Subtle cyclic stepping animation for the hero journey
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % JOURNEY_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        paddingTop: 'clamp(84px, 12vh, 120px)',
        paddingBottom: 'clamp(56px, 8vh, 80px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        {/* Eyebrow Badge */}
        <div style={{ marginBottom: '24px' }}>
          <div className="eyebrow-light">
            <span className="eyebrow-dot-light" />
            <span>WIQN &nbsp;//&nbsp; PRODUCT VALIDATION &amp; EXPERIMENTATION</span>
          </div>
        </div>

        {/* Main Controlled Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.35rem, 5.8vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.06,
            color: '#09090b',
            marginBottom: '20px',
            textWrap: 'balance',
          }}
        >
          FROM IDEA TO EVIDENCE.
        </h1>

        {/* Supporting Headline */}
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
            fontWeight: 500,
            color: '#18181b',
            lineHeight: 1.5,
            maxWidth: '720px',
            margin: '0 auto 16px auto',
            textWrap: 'pretty',
          }}
        >
          Test what you build with real users, behavioral evidence, feedback, and AI-assisted interpretation.
        </p>

        {/* Core Value Paragraph: Clear, Direct, Editorial */}
        <p
          style={{
            fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
            color: '#52525b',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 36px auto',
          }}
        >
          WIQN is an experimentation platform for founders and product teams. Connect any prototype, observe authentic tester behavior, capture qualitative friction signals, and make confident product decisions before heavy engineering investment.
        </p>

        {/* Primary & Secondary CTAs */}
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
            className="btn-primary-light"
            aria-label="Start an Experiment"
          >
            <span>Start an Experiment</span>
            <ArrowUpRight size={15} />
          </Link>

          <Link
            href="#how-it-works"
            className="btn-secondary-light"
            aria-label="Explore WIQN"
          >
            <span>Explore WIQN</span>
            <ArrowDown size={14} />
          </Link>
        </div>

        {/* Subtle Hero Motion: The Validation Journey Line */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: '6px',
            padding: '20px 22px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            maxWidth: '860px',
            margin: '0 auto',
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
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#09090b',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  color: '#09090b',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                THE EMPIRICAL VALIDATION JOURNEY
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: '#71717a',
                letterSpacing: '0.06em',
              }}
            >
              STAGE {JOURNEY_STEPS[activeStep].num} // {JOURNEY_STEPS[activeStep].label} ACTIVE
            </span>
          </div>

          {/* Stepper Grid (Horizontal on Desktop, Clean 5-column flow) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            {JOURNEY_STEPS.map((step, idx) => {
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={step.label}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    backgroundColor: isCurrent ? '#09090b' : '#f8f9fa',
                    border: isCurrent ? '1px solid #09090b' : '1px solid #e4e4e7',
                    borderRadius: '4px',
                    padding: '12px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        color: isCurrent ? '#a1a1aa' : '#71717a',
                        fontWeight: 600,
                      }}
                    >
                      {step.num}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: isCurrent ? '#ffffff' : '#09090b',
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      color: isCurrent ? '#d4d4d8' : '#71717a',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
