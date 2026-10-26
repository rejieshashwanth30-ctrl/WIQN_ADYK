'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

const PIPELINE_STEPS = [
  { num: '01', label: 'IDEA', icon: '💡' },
  { num: '02', label: 'PROTOTYPE', icon: '🖥️' },
  { num: '03', label: 'REAL USERS', icon: '👥' },
  { num: '04', label: 'EVIDENCE', icon: '⚡' },
  { num: '05', label: 'AI INSIGHTS', icon: '✦' },
  { num: '06', label: 'DECISION', icon: '🎯' },
];

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        paddingTop: 'clamp(56px, 8vh, 88px)',
        paddingBottom: 'clamp(36px, 5vh, 52px)',
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
        <div style={{ marginBottom: '18px' }}>
          <div className="eyebrow-light">
            <span className="eyebrow-dot-light" />
            <span>AI-POWERED PRODUCT VALIDATION</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5.2vw, 4.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
            color: '#09090b',
            marginBottom: '16px',
            textWrap: 'balance',
          }}
        >
          Test Ideas. Discover Truth. Build Smarter.
        </h1>

        {/* Short Description */}
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            fontWeight: 450,
            color: '#52525b',
            lineHeight: 1.5,
            maxWidth: '720px',
            margin: '0 auto 28px auto',
            textWrap: 'pretty',
          }}
        >
          Validate product ideas with real users, behavioral evidence, feedback, and AI-powered insights before investing heavily in development.
        </p>

        {/* Primary & Secondary CTAs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          <Link
            href="/experiments/new"
            className="btn-primary-light"
            aria-label="Start Validating"
            style={{ padding: '12px 24px', fontSize: '0.8125rem' }}
          >
            <span>Start Validating</span>
            <ArrowUpRight size={15} />
          </Link>

          <Link
            href="#how-it-works"
            className="btn-secondary-light"
            aria-label="See How It Works"
            style={{ padding: '12px 22px', fontSize: '0.8125rem' }}
          >
            <span>See How It Works</span>
            <ArrowDown size={14} />
          </Link>
        </div>

        {/* Very Compact Visual Pipeline: IDEA → PROTOTYPE → REAL USERS → EVIDENCE → AI INSIGHTS → DECISION */}
        <div className="hero-pipeline-wrapper">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #f4f4f5',
              paddingBottom: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#71717a',
                textTransform: 'uppercase',
              }}
            >
              VALIDATION PIPELINE
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                color: '#10b981',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              ● CONTINUOUS EVIDENCE LOOP
            </span>
          </div>

          <div className="hero-pipeline-track">
            {PIPELINE_STEPS.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="hero-pipeline-node">
                  <span style={{ fontSize: '0.75rem' }}>{step.icon}</span>
                  <span>{step.label}</span>
                </div>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <span className="hero-pipeline-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
