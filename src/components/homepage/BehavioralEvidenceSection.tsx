'use client';

import React from 'react';
import {
  MousePointerClick,
  Eye,
  Scroll,
  FormInput,
  Compass,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const SIGNALS = [
  {
    icon: Eye,
    title: 'Page Visits & Session Duration',
    description: 'Active dwell time and return intervals indicating genuine engagement vs momentary curiosity.',
  },
  {
    icon: MousePointerClick,
    title: 'Button & Element Clicks',
    description: 'Direct evidence of user intent on key value triggers, CTAs, and navigation pathways.',
  },
  {
    icon: Scroll,
    title: 'Scroll Depth Milestones',
    description: 'Quantifiable vertical progression (25%, 50%, 75%, 100%) tracking how deep testers explore.',
  },
  {
    icon: FormInput,
    title: 'Form & Input Interactions',
    description: 'Focus events, input changes, and dropoffs identifying exact friction points during onboarding.',
  },
  {
    icon: Compass,
    title: 'User Journeys & Flow Sequences',
    description: 'Chronological page-to-page pathways taken by each tester during their exploration session.',
  },
  {
    icon: Clock,
    title: 'Session Activity & Idle Periods',
    description: 'Identification of hesitation states, confusion pauses, and dead ends without speculative guesswork.',
  },
];

// Authentic abstract UI representation based on real WIQN Event Explorer telemetry stream (NO fake vanity metrics!)
const TELEMETRY_STREAM = [
  { time: '00:02', event: 'session_init', target: 'Tester #4 · Chrome / MacOS · 1440×900', status: 'verified' },
  { time: '00:07', event: 'page_view', target: '/pricing-prototype (Landing Canvas)', status: 'verified' },
  { time: '00:14', event: 'scroll_depth', target: 'Milestone reached: 50% viewport', status: 'verified' },
  { time: '00:23', event: 'click', target: 'button#cta-start-trial ("Start Validating")', status: 'verified' },
  { time: '00:36', event: 'input_focus', target: 'input#workspace_name (Onboarding Modal)', status: 'verified' },
  { time: '00:48', event: 'feedback_submitted', target: 'Friction tag: "Pricing clarity question"', status: 'verified' },
];

export const BehavioralEvidenceSection: React.FC = () => {
  return (
    <section
      id="evidence"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>BEHAVIORAL EVIDENCE</span>
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
            SEE WHAT USERS ACTUALLY DO.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: '#52525b',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Survey responses are influenced by courtesy and recall errors. Telemetry is indisputable. WIQN records actual interaction behavior so you can make decisions grounded in empirical reality.
          </p>
        </div>

        {/* 2-Column Layout: Signal Types + Abstract UI Event Stream Mockup */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Signals Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.14em',
                color: '#71717a',
                textTransform: 'uppercase',
                marginBottom: '4px',
                fontWeight: 600,
              }}
            >
              AUTOCAPTURED TELEMETRY SIGNALS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {SIGNALS.map((sig) => {
                const Icon = sig.icon;
                return (
                  <div
                    key={sig.title}
                    className="editorial-card"
                    style={{
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      backgroundColor: '#ffffff',
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
                        color: '#09090b',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#09090b',
                          marginBottom: '2px',
                        }}
                      >
                        {sig.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: '#52525b',
                          lineHeight: 1.45,
                          margin: 0,
                        }}
                      >
                        {sig.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Abstract UI Telemetry Stream Mockup (Authentic WIQN Interface) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Header: Mockup Titlebar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #e4e4e7',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#09090b',
                  }}
                >
                  EVENT EXPLORER // LIVE STREAM
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: '#71717a',
                  backgroundColor: '#f4f4f5',
                  padding: '3px 8px',
                  borderRadius: '3px',
                }}
              >
                TELEMETRY PROTOCOL v2.4
              </span>
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: '#71717a',
                fontFamily: 'var(--font-mono)',
                marginBottom: '14px',
              }}
            >
              Zero-config interaction autocapture ledger:
            </div>

            {/* Stream Event Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TELEMETRY_STREAM.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#fcfcfc',
                    border: '1px solid #e4e4e7',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#a1a1aa', fontSize: '0.6875rem' }}>{row.time}</span>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '2px',
                        backgroundColor: '#f4f4f5',
                        color: '#09090b',
                        fontWeight: 600,
                        fontSize: '0.6875rem',
                      }}
                    >
                      {row.event}
                    </span>
                    <span style={{ color: '#3f3f46', fontSize: '0.75rem' }}>{row.target}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.6875rem' }}>
                    <CheckCircle2 size={12} />
                    <span>LOGGED</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro-Explainer note */}
            <div
              style={{
                marginTop: '18px',
                padding: '12px 14px',
                backgroundColor: '#f4f4f5',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#52525b',
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: '#09090b' }}>No manual instrumentation:</strong> Attaching the WIQN tracker or sandbox automatically logs interactions with millisecond precision without cluttering prototype code.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
