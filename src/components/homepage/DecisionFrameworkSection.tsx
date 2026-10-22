'use client';

import React, { useState } from 'react';
import { CheckCircle2, Wrench, RefreshCw, XCircle, RotateCcw } from 'lucide-react';

const DECISIONS = [
  {
    key: 'BUILD',
    title: 'BUILD',
    subtitle: 'Commit Engineering',
    desc: 'Empirical telemetry verifies active product utilization and feedback confirms strong willingness to adopt. Proceed to production architecture with high confidence.',
    icon: CheckCircle2,
    badgeColor: '#09090b',
  },
  {
    key: 'IMPROVE',
    title: 'IMPROVE',
    subtitle: 'Resolve Friction',
    desc: 'Core value proposition resonated, but specific usability hurdles, confusing terminology, or navigation dropoffs must be solved before scaling.',
    icon: Wrench,
    badgeColor: '#09090b',
  },
  {
    key: 'PIVOT',
    title: 'PIVOT',
    subtitle: 'Reorient Value',
    desc: 'Testers demonstrated interest in a secondary feature or adjacent workflow rather than the primary hypothesis. Reorient the concept toward observed demand.',
    icon: RefreshCw,
    badgeColor: '#09090b',
  },
  {
    key: 'STOP',
    title: 'STOP',
    subtitle: 'Conserve Capital',
    desc: 'Telemetry falsified the hypothesis. Lack of tester engagement confirms the market demand does not justify engineering investment. Save months of runway.',
    icon: XCircle,
    badgeColor: '#09090b',
  },
  {
    key: 'TEST AGAIN',
    title: 'TEST AGAIN',
    subtitle: 'Refine Variant',
    desc: 'Conflicting feedback or incomplete tester cohort indicates an adjusted prototype variant or targeted tester audience should be evaluated.',
    icon: RotateCcw,
    badgeColor: '#09090b',
  },
];

export const DecisionFrameworkSection: React.FC = () => {
  const [activeDecision, setActiveDecision] = useState('BUILD');

  return (
    <section
      id="decision"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>THE DECISION FRAMEWORK</span>
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
            EVERY EXPERIMENT SHOULD LEAD SOMEWHERE.
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
            Experimentation without a decisive outcome is just curiosity. WIQN channels every validation cycle into five concrete, defensible paths.
          </p>
        </div>

        {/* 5 Minimal Decision Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px',
            marginBottom: '48px',
          }}
        >
          {DECISIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeDecision === item.key;
            return (
              <div
                key={item.key}
                onClick={() => setActiveDecision(item.key)}
                className="editorial-card"
                style={{
                  padding: '24px 20px',
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
                  {isSelected && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        letterSpacing: '0.1em',
                        color: '#09090b',
                        fontWeight: 700,
                      }}
                    >
                      SELECTED
                    </span>
                  )}
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#09090b',
                      marginBottom: '2px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: '#71717a',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#52525b',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Strong Brand Statement Card */}
        <div
          style={{
            backgroundColor: '#09090b',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '36px 32px',
            textAlign: 'center',
            maxWidth: '820px',
            margin: '0 auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.18em',
              color: '#a1a1aa',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            CORE PHILOSOPHY
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3.2vw, 2rem)',
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            WIQN organizes the evidence.
            <br />
            You make the decision.
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#d4d4d8',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            Defensible product decisions happen when team intuition is informed by verifiable behavioral facts, not when an algorithm makes the call for you.
          </p>
        </div>
      </div>
    </section>
  );
};
