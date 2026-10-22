'use client';

import React from 'react';
import { Eye, Brain, Compass, ShieldAlert } from 'lucide-react';

export const AiInterpretationSection: React.FC = () => {
  return (
    <section
      id="ai-interpretation"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>EVIDENCE INTERPRETATION</span>
            </div>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.4vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              color: '#09090b',
              marginBottom: '16px',
            }}
          >
            TURN SIGNALS INTO UNDERSTANDING.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: '#52525b',
              maxWidth: '680px',
              margin: '0 auto 20px auto',
              lineHeight: 1.6,
            }}
          >
            WIQN analyzes behavioral telemetry and qualitative feedback to identify patterns, evaluate conflicting signals, and structure actionable next steps.
          </p>

          {/* Explicit Positioning / Anti-Hype Notice */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: '#52525b',
            }}
          >
            <ShieldAlert size={14} color="#71717a" />
            <span>AI-Assisted Interpretation: Separates empirical facts from reasoned hypotheses without automated PMF claims.</span>
          </div>
        </div>

        {/* 3-Tier Visual Architecture Cards: Observation -> Interpretation -> Conclusion */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {/* Tier 1: Observation (The Empirical Fact) */}
          <div
            className="editorial-card"
            style={{
              padding: '28px 24px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderTop: '3px solid #09090b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#09090b',
                }}
              >
                <Eye size={16} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  color: '#09090b',
                  fontWeight: 700,
                }}
              >
                TIER 01 // FACT
              </span>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#09090b',
                  marginBottom: '4px',
                }}
              >
                OBSERVATION
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
                Empirical Telemetry &amp; Feedback
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e4e4e7',
                borderRadius: '4px',
                padding: '14px',
                fontSize: '0.8125rem',
                color: '#18181b',
                lineHeight: 1.5,
              }}
            >
              &quot;72% of testers spent over 3 minutes actively interacting with the prototype; 0 out of 25 testers clicked the secondary enterprise tier checkout.&quot;
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5, margin: 0 }}>
              Recorded strictly from verified event logs and qualitative feedback submissions. Zero speculative extrapolation.
            </p>
          </div>

          {/* Tier 2: Interpretation (The AI Synthesis) */}
          <div
            className="editorial-card"
            style={{
              padding: '28px 24px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderTop: '3px solid #71717a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#09090b',
                }}
              >
                <Brain size={16} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  color: '#52525b',
                  fontWeight: 700,
                }}
              >
                TIER 02 // PATTERN
              </span>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#09090b',
                  marginBottom: '4px',
                }}
              >
                INTERPRETATION
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
                Pattern Recognition &amp; Context
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e4e4e7',
                borderRadius: '4px',
                padding: '14px',
                fontSize: '0.8125rem',
                color: '#18181b',
                lineHeight: 1.5,
              }}
            >
              &quot;Strong initial value proposition resonance, but immediate price clarity is acting as an adoption blocker rather than prototype capability skepticism.&quot;
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5, margin: 0 }}>
              AI correlates interaction dwell times with tester friction quotes to surface underlying patterns for founder evaluation.
            </p>
          </div>

          {/* Tier 3: Conclusion (The Actionable Followup) */}
          <div
            className="editorial-card"
            style={{
              padding: '28px 24px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderTop: '3px solid #10b981',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#09090b',
                }}
              >
                <Compass size={16} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  color: '#10b981',
                  fontWeight: 700,
                }}
              >
                TIER 03 // ACTION
              </span>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#09090b',
                  marginBottom: '4px',
                }}
              >
                CONCLUSION
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
                Testable Next Step
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e4e4e7',
                borderRadius: '4px',
                padding: '14px',
                fontSize: '0.8125rem',
                color: '#18181b',
                lineHeight: 1.5,
              }}
            >
              &quot;Revise pricing transparency directly above the CTA, or run a fast follow-up variant testing transparent single-tier pricing.&quot;
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.5, margin: 0 }}>
              Structures actionable hypotheses for the next test iteration rather than issuing speculative prescriptive commands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
