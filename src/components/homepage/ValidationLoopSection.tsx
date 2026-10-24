'use client';

import React, { useState } from 'react';
import {
  Lightbulb,
  Globe,
  Users2,
  Activity,
  MessageSquare,
  Scale,
  Sparkles,
  Target,
} from 'lucide-react';

const LOOP_STEPS = [
  {
    step: '01',
    name: 'IDEA & HYPOTHESES',
    category: 'Formulate',
    summary: 'Define falsifiable assumptions before writing production code.',
    detail:
      'Specify target audience parameters, core value assumptions, and exact behavioral metrics required to prove or falsify the thesis.',
    icon: Lightbulb,
  },
  {
    step: '02',
    name: 'PROTOTYPE',
    category: 'Connect',
    summary: 'Attach any interactive URL, web app, or staging build.',
    detail:
      'Zero-lockin integration. Connect your live prototype via iframe sandbox or lightweight tracker script in under two minutes.',
    icon: Globe,
  },
  {
    step: '03',
    name: 'REAL USERS',
    category: 'Distribute',
    summary: 'Distribute 1-click invitation links to target participants.',
    detail:
      'Testers explore the prototype in a sandboxed, distraction-free environment with no installation or browser extension requirements.',
    icon: Users2,
  },
  {
    step: '04',
    name: 'BEHAVIOR',
    category: 'Capture',
    summary: 'Zero-config autocapture records real interaction telemetry.',
    detail:
      'Continuous telemetry logs clicks, scroll milestones, dwell duration, and navigation journeys without manual tag implementation.',
    icon: Activity,
  },
  {
    step: '05',
    name: 'FEEDBACK',
    category: 'Collect',
    summary: 'Capture qualitative reactions at critical moments of exploration.',
    detail:
      'In-context feedback prompts collect friction descriptions, clarity scores, and hesitation thoughts directly from participants.',
    icon: MessageSquare,
  },
  {
    step: '06',
    name: 'EVIDENCE',
    category: 'Aggregate',
    summary: 'Aggregate interaction facts separated strictly from speculation.',
    detail:
      'Empirical evidence synthesis compiles verified interaction sequences, click distributions, and session dropoff thresholds.',
    icon: Scale,
  },
  {
    step: '07',
    name: 'AI INTERPRETATION',
    category: 'Synthesize',
    summary: 'AI-assisted synthesis turns complex telemetry into patterns.',
    detail:
      'Carefully identifies behavioral patterns and correlates user feedback, maintaining a strict distinction between fact and hypothesis.',
    icon: Sparkles,
  },
  {
    step: '08',
    name: 'DECISION',
    category: 'Verdict',
    summary: 'Commit to an evidence-based verdict for your product roadmap.',
    detail:
      'Choose with certainty: Build, Improve, Pivot, Stop, or Test Again, supported by an immutable audit trail of tester evidence.',
    icon: Target,
  },
];

export const ValidationLoopSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState(0);

  return (
    <section
      id="how-it-works"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header (Part 27: 02 - How WIQN Works) */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>02 // HOW WIQN WORKS</span>
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
            How WIQN Works
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: '#52525b',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A disciplined, 8-stage continuous lifecycle designed to eliminate guesswork, falsify assumptions, and uncover verifiable product truth.
          </p>
        </div>

        {/* Desktop & Tablet 8-Step Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {LOOP_STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = selectedStep === idx;
            return (
              <div
                key={s.step}
                onClick={() => setSelectedStep(idx)}
                className="editorial-card"
                style={{
                  padding: '24px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  borderColor: isSelected ? '#09090b' : '#e4e4e7',
                  backgroundColor: isSelected ? '#fafafa' : '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? '#09090b' : '#f4f4f5',
                      color: isSelected ? '#ffffff' : '#09090b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.1em',
                      color: isSelected ? '#09090b' : '#a1a1aa',
                      fontWeight: 700,
                    }}
                  >
                    STAGE {s.step}
                  </span>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.12em',
                      color: '#71717a',
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                    }}
                  >
                    {s.category}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#09090b',
                      lineHeight: 1.3,
                    }}
                  >
                    {s.name}
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#52525b',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {s.summary}
                </p>

                <div
                  style={{
                    paddingTop: '8px',
                    borderTop: '1px solid #f4f4f5',
                    fontSize: '0.75rem',
                    color: '#71717a',
                    lineHeight: 1.45,
                  }}
                >
                  {s.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
