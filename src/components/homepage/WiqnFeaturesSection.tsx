'use client';

import React, { useState } from 'react';
import {
  Globe,
  Activity,
  ListFilter,
  GitFork,
  MessageSquare,
  Sparkles,
  ArrowRight,
  MousePointer,
  CheckCircle2,
} from 'lucide-react';

const DECISIONS = [
  { id: 'build', label: 'BUILD', status: 'VERDICT: BUILD // HIGH DEMAND EVIDENCE' },
  { id: 'improve', label: 'IMPROVE', status: 'VERDICT: IMPROVE // TARGETED ITERATION' },
  { id: 'pivot', label: 'PIVOT', status: 'VERDICT: PIVOT // LOW ADOPTION VALUE' },
  { id: 'stop', label: 'STOP', status: 'VERDICT: STOP // PREVENT ENGINEERING WASTE' },
  { id: 'test_again', label: 'TEST AGAIN', status: 'VERDICT: TEST AGAIN // EXPAND SAMPLE COHORT' },
];

export const WiqnFeaturesSection: React.FC = () => {
  const [selectedDecision, setSelectedDecision] = useState('improve');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const activeDecision = DECISIONS.find((d) => d.id === selectedDecision) || DECISIONS[1];

  return (
    <section
      id="features"
      className="wiqn-section-compact"
      style={{
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div id="product" style={{ position: 'relative', top: '-72px', visibility: 'hidden' }} />
      <div style={{ maxWidth: '1160px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <div className="wiqn-section-header">
          <div style={{ marginBottom: '12px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>02 // WIQN FEATURES</span>
            </div>
          </div>
          <h2 className="wiqn-section-title">WIQN FEATURES</h2>
          <p className="wiqn-section-subtitle">
            Everything you need to validate a product with real-world evidence.
          </p>
        </div>

        {/* 6 Visual Feature Modules Grid */}
        <div className="wiqn-features-grid">
          {/* 01 — TEST: Prototype Testing */}
          <div
            className="wiqn-feature-card"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="wiqn-feature-meta">
                <span className="wiqn-feature-tag">01 // TEST</span>
                <Globe size={16} color="#71717a" />
              </div>
              <h3 className="wiqn-feature-title">Prototype Testing</h3>
              <p className="wiqn-feature-micro">Test working prototypes with real users.</p>
            </div>

            {/* Visual: Prototype window → tester cursor → interaction signal */}
            <div className="wiqn-feature-visual-box">
              {/* Mini Browser Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e4e4e7',
                  paddingBottom: '6px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '3px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#d4d4d8' }} />
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#d4d4d8' }} />
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#d4d4d8' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#71717a' }}>
                  staging.app.io/v2
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#10b981', fontWeight: 600 }}>
                  ● LIVE
                </span>
              </div>

              {/* Prototype Canvas with Cursor */}
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '3px',
                  padding: '10px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#09090b' }}>
                  Start Free Trial
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    backgroundColor: '#f4f4f5',
                    color: '#09090b',
                    border: '1px solid #e4e4e7',
                  }}
                >
                  CTA Click
                </span>

                {/* Tester Cursor Indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '86px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    pointerEvents: 'none',
                  }}
                >
                  <MousePointer size={12} color="#09090b" fill="#09090b" />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      padding: '1px 4px',
                      backgroundColor: '#09090b',
                      color: '#ffffff',
                      borderRadius: '2px',
                    }}
                  >
                    Tester #12
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 02 — TRACK: Behavioral Analytics */}
          <div
            className="wiqn-feature-card"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="wiqn-feature-meta">
                <span className="wiqn-feature-tag">02 // TRACK</span>
                <Activity size={16} color="#71717a" />
              </div>
              <h3 className="wiqn-feature-title">Behavioral Analytics</h3>
              <p className="wiqn-feature-micro">See what users actually do.</p>
            </div>

            {/* Visual: User → Click → Event → Timeline */}
            <div className="wiqn-feature-visual-box">
              {/* Telemetry Signal Line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: '#09090b',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '3px',
                  padding: '6px 8px',
                  marginBottom: '8px',
                  letterSpacing: '0.04em',
                }}
              >
                <span>8 VISITORS</span>
                <span style={{ color: '#a1a1aa' }}>→</span>
                <span>38 ACTIONS</span>
                <span style={{ color: '#a1a1aa' }}>→</span>
                <span style={{ color: '#10b981' }}>7 CLICKS</span>
              </div>

              {/* User Flow Sequence */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  color: '#71717a',
                  padding: '0 2px',
                }}
              >
                <span>USER</span>
                <span>↓</span>
                <span>CLICK</span>
                <span>↓</span>
                <span>EVENT</span>
                <span>↓</span>
                <span>TIMELINE</span>
              </div>
            </div>
          </div>

          {/* 03 — EXPLORE: Event Explorer */}
          <div
            className="wiqn-feature-card"
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="wiqn-feature-meta">
                <span className="wiqn-feature-tag">03 // EXPLORE</span>
                <ListFilter size={16} color="#71717a" />
              </div>
              <h3 className="wiqn-feature-title">Event Explorer</h3>
              <p className="wiqn-feature-micro">Inspect real interactions and user activity.</p>
            </div>

            {/* Visual: Timeline / event stream */}
            <div className="wiqn-feature-visual-box" style={{ gap: '4px' }}>
              {[
                { time: '+00:12', type: 'click', target: 'button#btn-continue' },
                { time: '+00:19', type: 'scroll', target: 'window.scrollY (75%)' },
                { time: '+00:27', type: 'input', target: 'input#workspace_name' },
              ].map((ev, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '2px',
                    padding: '3px 6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                  }}
                >
                  <span style={{ color: '#71717a' }}>{ev.time}</span>
                  <span
                    style={{
                      padding: '1px 4px',
                      backgroundColor: '#f4f4f5',
                      borderRadius: '2px',
                      fontWeight: 600,
                      color: '#09090b',
                    }}
                  >
                    {ev.type}
                  </span>
                  <span style={{ color: '#09090b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>
                    {ev.target}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 04 — UNDERSTAND: Journeys & Funnels */}
          <div
            className="wiqn-feature-card"
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="wiqn-feature-meta">
                <span className="wiqn-feature-tag">04 // UNDERSTAND</span>
                <GitFork size={16} color="#71717a" />
              </div>
              <h3 className="wiqn-feature-title">Journeys &amp; Funnels</h3>
              <p className="wiqn-feature-micro">See user paths and where they drop off.</p>
            </div>

            {/* Visual: Visitor → Page → Action → Drop-off */}
            <div className="wiqn-feature-visual-box">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem' }}>
                  <span style={{ color: '#09090b', fontWeight: 600 }}>Home Page</span>
                  <span style={{ color: '#71717a' }}>100% (8/8)</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#e4e4e7', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#09090b' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', marginTop: '2px' }}>
                  <span style={{ color: '#09090b', fontWeight: 600 }}>Feature Specs</span>
                  <span style={{ color: '#71717a' }}>75% (6/8)</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#e4e4e7', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', backgroundColor: '#09090b' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', marginTop: '2px' }}>
                  <span style={{ color: '#e11d48', fontWeight: 600 }}>✕ Drop-off at Form</span>
                  <span style={{ color: '#e11d48' }}>-50% (3/8)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 05 — LISTEN: Tester Feedback */}
          <div
            className="wiqn-feature-card"
            onMouseEnter={() => setHoveredCard(5)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="wiqn-feature-meta">
                <span className="wiqn-feature-tag">05 // LISTEN</span>
                <MessageSquare size={16} color="#71717a" />
              </div>
              <h3 className="wiqn-feature-title">Tester Feedback</h3>
              <p className="wiqn-feature-micro">Capture what real users think.</p>
            </div>

            {/* Visual: User feedback bubble → evidence signal */}
            <div className="wiqn-feature-visual-box">
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '3px',
                  padding: '8px 10px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#10b981', fontWeight: 600 }}>
                    ● VERIFIED TESTER
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#71717a' }}>
                    RATING 5/5
                  </span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#09090b', lineHeight: 1.35, fontStyle: 'italic' }}>
                  &quot;Setup was seamless, but wanted GitHub login on step 2.&quot;
                </div>
              </div>
            </div>
          </div>

          {/* 06 — INTELLIGENCE: AI Insights */}
          <div
            className="wiqn-feature-card"
            onMouseEnter={() => setHoveredCard(6)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="wiqn-feature-meta">
                <span className="wiqn-feature-tag">06 // INTELLIGENCE</span>
                <Sparkles size={16} color="#71717a" />
              </div>
              <h3 className="wiqn-feature-title">AI Insights</h3>
              <p className="wiqn-feature-micro">Turn evidence into actionable insights.</p>
            </div>

            {/* Visual: Raw Data → Evidence → AI → Insight */}
            <div className="wiqn-feature-visual-box" style={{ gap: '5px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderLeft: '3px solid #09090b',
                  borderRadius: '2px',
                  padding: '4px 6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                }}
              >
                <span style={{ fontWeight: 700, color: '#09090b' }}>FACT</span>
                <span style={{ color: '#52525b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  75% visited pricing before drop-off
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderLeft: '3px solid #10b981',
                  borderRadius: '2px',
                  padding: '4px 6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                }}
              >
                <span style={{ fontWeight: 700, color: '#10b981' }}>ACTION</span>
                <span style={{ color: '#09090b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Clarify self-serve pricing tiers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DECISION FEATURE: Compact Full-Width Visual Element */}
        <div className="wiqn-decision-bar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
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
                EVIDENCE → DECISION
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              >
                ● {activeDecision.status}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#18181b', fontWeight: 500, margin: 0 }}>
              Make evidence-based product decisions.
            </p>
          </div>

          {/* Interactive Decision Selector */}
          <div className="wiqn-decision-chips">
            {DECISIONS.map((dec) => {
              const isSelected = selectedDecision === dec.id;
              return (
                <button
                  key={dec.id}
                  type="button"
                  onClick={() => setSelectedDecision(dec.id)}
                  className={`wiqn-decision-chip ${isSelected ? 'active' : ''}`}
                  aria-pressed={isSelected}
                  aria-label={`Select ${dec.label} decision`}
                >
                  {dec.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
