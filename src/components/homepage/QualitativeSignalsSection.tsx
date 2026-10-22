'use client';

import React from 'react';
import { MessageSquareQuote, Star, UserCheck, Shuffle, ArrowRight } from 'lucide-react';

const QUALITATIVE_PILLARS = [
  {
    icon: Shuffle,
    title: 'Behavioral Corroboration',
    desc: 'Match tester verbal feedback against the exact recorded click sequence they took before submitting.',
  },
  {
    icon: Star,
    title: 'Clarity & Confidence Ratings',
    desc: 'Discrete 1–5 scoring on value proposition clarity, navigation ease, and onboarding friction.',
  },
  {
    icon: MessageSquareQuote,
    title: 'In-Context Tester Comments',
    desc: 'Direct, unprompted quotes captured immediately when friction or confusion occurred in the prototype.',
  },
  {
    icon: UserCheck,
    title: 'Observed Journey Context',
    desc: 'Understand if feedback came from a power user completing the full flow or a participant who abandoned early.',
  },
];

export const QualitativeSignalsSection: React.FC = () => {
  return (
    <section
      id="qualitative"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>QUALITATIVE SIGNALS</span>
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
              textWrap: 'balance',
            }}
          >
            NUMBERS TELL YOU WHAT HAPPENED.
            <br />
            FEEDBACK HELPS EXPLAIN WHY.
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
            Telemetry exposes the drop-off; feedback identifies the confusion. WIQN fuses qualitative user reactions with authentic behavior to deliver complete product intelligence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {QUALITATIVE_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="editorial-card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                }}
              >
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
                  <Icon size={16} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#09090b',
                  }}
                >
                  {item.title}
                </h3>
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

        {/* Realistic Feedback Representation Mockup */}
        <div
          style={{
            backgroundColor: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '6px',
            padding: '24px 28px',
            maxWidth: '820px',
            margin: '0 auto',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  color: '#09090b',
                  fontWeight: 600,
                }}
              >
                QUALITATIVE SIGNAL INTERCEPT
              </span>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>•</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>
                Tester #7 · Session #29
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} size={13} fill="#09090b" color="#09090b" />
              ))}
              <Star size={13} color="#d4d4d8" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#09090b', marginLeft: '4px', fontWeight: 600 }}>
                4.0 / 5.0
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '4px',
              padding: '16px 18px',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#71717a', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              PROMPT: &quot;Where did you feel hesitation while navigating this prototype?&quot;
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#09090b',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              &quot;The value proposition was immediately clear and the workspace created instantly, but I hesitated on the member invite modal because I couldn&apos;t tell if additional seats would trigger immediate credit card billing.&quot;
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#52525b',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span style={{ color: '#09090b', fontWeight: 600 }}>CONNECTED BEHAVIOR:</span>
            <span>Hovered invite button 3 times · Idle for 18 seconds · Closed modal without adding team member</span>
          </div>
        </div>
      </div>
    </section>
  );
};
