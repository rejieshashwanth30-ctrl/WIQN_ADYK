'use client';

import React from 'react';

const COMPARISON_STAGES = [
  {
    tag: 'STAGE 01',
    title: 'ASSUMPTION',
    symbol: '?',
    status: 'HIGH RISK',
    statusColor: '#e11d48',
    detail: 'Untested opinions, courtesy bias & vanity signups.',
  },
  {
    tag: 'STAGE 02',
    title: 'REAL USERS',
    symbol: '👥',
    status: 'AUTHENTIC TESTERS',
    statusColor: '#09090b',
    detail: 'Objective prototype behavior combined with direct feedback.',
  },
  {
    tag: 'STAGE 03',
    title: 'EVIDENCE',
    symbol: '⚡',
    status: 'MEASURED SIGNALS',
    statusColor: '#09090b',
    detail: 'Autocaptured clicks, scroll depth & drop-off thresholds.',
  },
  {
    tag: 'STAGE 04',
    title: 'DECISION',
    symbol: '🎯',
    status: 'INFORMED ACTION',
    statusColor: '#10b981',
    detail: 'Build, Improve, Pivot, Stop, or Test Again with conviction.',
  },
];

export const WhyWiqnSection: React.FC = () => {
  return (
    <section
      id="why-wiqn"
      className="wiqn-section-compact"
      style={{
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <div className="wiqn-section-header">
          <div style={{ marginBottom: '12px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>04 // WHY WIQN</span>
            </div>
          </div>
          <h2 className="wiqn-section-title">DON&apos;T JUST BUILD. PROVE IT.</h2>
          <p className="wiqn-section-subtitle">
            Replace assumptions with real user behavior, feedback, evidence, and informed decisions.
          </p>
        </div>

        {/* 4-Stage Visual Comparison Grid */}
        <div className="why-comparison-grid">
          {COMPARISON_STAGES.map((stage) => (
            <div key={stage.title} className="why-comparison-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    color: '#71717a',
                    fontWeight: 700,
                  }}
                >
                  {stage.tag}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    color: stage.statusColor,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  ● {stage.status}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '4px 0',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    backgroundColor: '#f4f4f5',
                    border: '1px solid #e4e4e7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#09090b',
                    flexShrink: 0,
                  }}
                >
                  {stage.symbol}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#09090b',
                    letterSpacing: '0.02em',
                    margin: 0,
                  }}
                >
                  {stage.title}
                </h3>
              </div>

              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#52525b',
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {stage.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
