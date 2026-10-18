'use client';

import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'DEFINE',
    tagline: 'Formulate the thesis',
    description: 'Describe the product, problem space, target audience, and the critical leap-of-faith assumptions before writing heavy production code.',
    metric: 'INPUT: ASSUMPTIONS & HYPOTHESIS',
  },
  {
    num: '02',
    title: 'PROTOTYPE',
    tagline: 'Connect live artifact',
    description: 'Connect an existing deployed web artifact from Vercel, Netlify, or any origin. Zero full-stack hosting lock-in.',
    metric: 'INPUT: DEPLOYED URL & TRACKER',
  },
  {
    num: '03',
    title: 'TEST',
    tagline: 'Grant real user access',
    description: 'Distribute your secure validation link privately or opt into the ADYK CARDEX Alpha Network for verified technical testers.',
    metric: 'RECRUITMENT: PRIVATE OR CARDEX',
  },
  {
    num: '04',
    title: 'MEASURE',
    tagline: 'Capture real behavior',
    description: 'Autocapture records clicks, interaction drop-offs, dwell durations, and navigation flows without manual tagging on every button.',
    metric: 'TELEMETRY: EVENT STREAM',
  },
  {
    num: '05',
    title: 'LISTEN',
    tagline: 'Collect structured feedback',
    description: 'Intercept qualitative friction points at critical moments of user interaction. Hear why users hesitate or abandon.',
    metric: 'SIGNALS: QUALITATIVE PROMPTS',
  },
  {
    num: '06',
    title: 'ANALYZE',
    tagline: 'Structure the intelligence',
    description: 'Transform telemetry and qualitative feedback into verified Facts, testable Hypotheses, Recommendations, and statistical Limitations.',
    metric: 'SYNTHESIS: INTELLIGENCE MATRIX',
  },
  {
    num: '07',
    title: 'DECIDE',
    tagline: 'Commit to the evidence',
    description: 'Make defensible founder decisions: Build, Improve, Pivot, Stop, or Test Again, backed by empirical confidence levels.',
    metric: 'OUTCOME: DEFENSIBLE DIRECTION',
  },
];

export const HowWiqnWorks: React.FC = () => {
  return (
    <section id="method" className="section-responsive">
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: '48px' }}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>OPERATIONAL ARCHITECTURE</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4.5vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--color-white)',
              marginBottom: '16px',
            }}
          >
            THE SEVEN-STEP
            <br />
            VALIDATION CYCLE.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'clamp(0.9375rem, 3.2vw, 1.0625rem)',
              color: 'var(--color-silver-300)',
              lineHeight: 1.6,
            }}
          >
            Wiqn replaces speculative opinions with a continuous, structured loop from hypothesis to empirical evidence.
          </p>
        </div>

        {/* Seven Steps Grid */}
        <div
          className="steps-grid"
          style={{
            display: 'grid',
            gap: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="card-responsive"
              style={{
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px',
                position: 'relative',
                transition: 'background-color 240ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }}
            >
              <div>
                {/* Large Architectural Number */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.12)',
                    lineHeight: 1,
                    marginBottom: '24px',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {step.num}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--color-white)',
                    marginBottom: '8px',
                  }}
                >
                  {step.title}
                </h3>

                {/* Tagline */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-silver-300)',
                    letterSpacing: '0.04em',
                    marginBottom: '16px',
                  }}
                >
                  {step.tagline}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '0.875rem',
                    color: 'var(--color-silver-300)',
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Technical Footnote */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  marginTop: '28px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {step.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
