'use client';

import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

const WORKFLOW_STEPS = [
  { num: '01', label: 'IDEA', visual: '💡' },
  { num: '02', label: 'HYPOTHESIS', visual: '⚗️' },
  { num: '03', label: 'PROTOTYPE', visual: '🖥️' },
  { num: '04', label: 'REAL USERS', visual: '👤→👤→👤' },
  { num: '05', label: 'BEHAVIOR', visual: '⚡' },
  { num: '06', label: 'FEEDBACK', visual: '💬' },
  { num: '07', label: 'AI INSIGHTS', visual: '✦' },
  { num: '08', label: 'DECISION', visual: '🎯' },
];

const MOBILE_GROUPS = [
  {
    phase: 'BUILD',
    badge: 'PHASE 01',
    steps: [
      { num: '01', label: 'Idea', icon: '💡' },
      { num: '02', label: 'Hypothesis', icon: '⚗️' },
      { num: '03', label: 'Prototype', icon: '🖥️' },
    ],
  },
  {
    phase: 'VALIDATE',
    badge: 'PHASE 02',
    steps: [
      { num: '04', label: 'Real Users', icon: '👥' },
      { num: '05', label: 'Behavior', icon: '⚡' },
      { num: '06', label: 'Feedback', icon: '💬' },
    ],
  },
  {
    phase: 'DECIDE',
    badge: 'PHASE 03',
    steps: [
      { num: '07', label: 'AI Insights', icon: '✦' },
      { num: '08', label: 'Decision', icon: '🎯' },
    ],
  },
];

export const HowWiqnWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="wiqn-section-compact"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <div className="wiqn-section-header">
          <div style={{ marginBottom: '12px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>03 // HOW WIQN WORKS</span>
            </div>
          </div>
          <h2 className="wiqn-section-title">HOW WIQN WORKS</h2>
          <p className="wiqn-section-subtitle">
            From falsifiable hypothesis to decisive product action in 8 visual stages.
          </p>
        </div>

        {/* Desktop Horizontal Workflow (8 Steps) */}
        <div className="how-works-horizontal">
          {WORKFLOW_STEPS.map((step) => (
            <div key={step.num} className="how-step-node">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: '#71717a',
                }}
              >
                {step.num}
              </span>
              <div
                style={{
                  fontSize: '1rem',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.visual}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: '#09090b',
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Grouped Workflow (BUILD → VALIDATE → DECIDE) */}
        <div className="how-works-mobile">
          {MOBILE_GROUPS.map((group, gIdx) => (
            <React.Fragment key={group.phase}>
              <div className="how-group-card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    borderBottom: '1px solid #f4f4f5',
                    paddingBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#09090b',
                    }}
                  >
                    {group.phase}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      color: '#71717a',
                    }}
                  >
                    {group.badge}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${group.steps.length}, 1fr)`,
                    gap: '8px',
                  }}
                >
                  {group.steps.map((st) => (
                    <div
                      key={st.num}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e4e4e7',
                        borderRadius: '4px',
                        padding: '8px 6px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span style={{ fontSize: '0.875rem' }}>{st.icon}</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5625rem',
                          fontWeight: 700,
                          color: '#09090b',
                        }}
                      >
                        {st.num} {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {gIdx < MOBILE_GROUPS.length - 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: '#a1a1aa',
                  }}
                >
                  <ArrowDown size={14} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
