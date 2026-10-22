'use client';

import React from 'react';
import { AlertCircle, FileSpreadsheet, MessageSquareDashed, LineChart } from 'lucide-react';

const PROBLEMS = [
  {
    icon: FileSpreadsheet,
    title: 'Founders build on untested assumptions.',
    description:
      'Months of precious engineering bandwidth are committed to complex features before verifying if real customers actually experience the underlying problem.',
  },
  {
    icon: LineChart,
    title: 'Landing pages mask lack of genuine demand.',
    description:
      'High signup counts on marketing copy create a false sense of security. Visitors frequently register out of curiosity, but abandon the actual product on day one.',
  },
  {
    icon: MessageSquareDashed,
    title: 'Polite feedback misleads product direction.',
    description:
      'Interviews and surveys suffer from courtesy bias. Users express enthusiasm in conversation, but their authentic behavior in the prototype tells a starkly different story.',
  },
  {
    icon: AlertCircle,
    title: 'Analytics measure volume, not meaning.',
    description:
      'Standard analytics record aggregate page hits and conversions, but cannot explain why users hesitate, where friction occurs, or what mental model failed.',
  },
];

export const TheProblemSection: React.FC = () => {
  return (
    <section
      id="problem"
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
              <span>THE PROBLEM</span>
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
              marginBottom: '18px',
              textWrap: 'balance',
            }}
          >
            BUILDING IS EASY.
            <br />
            KNOWING WHAT TO BUILD IS HARD.
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
            Most software waste does not come from flawed engineering execution. It comes from building solutions to problems that users do not care enough to adopt.
          </p>
        </div>

        {/* 4 Truth Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px',
            marginBottom: '48px',
          }}
        >
          {PROBLEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="editorial-card"
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '4px',
                      backgroundColor: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#09090b',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: '#a1a1aa',
                      fontWeight: 600,
                    }}
                  >
                    0{idx + 1}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    color: '#09090b',
                    lineHeight: 1.35,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#52525b',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Core Resolution Statement Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #09090b',
            borderRadius: '6px',
            padding: '28px 32px',
            textAlign: 'center',
            maxWidth: '760px',
            margin: '0 auto',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              color: '#71717a',
              textTransform: 'uppercase',
              marginBottom: '8px',
              fontWeight: 600,
            }}
          >
            OUR REASON FOR BEING
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.15rem, 2.4vw, 1.45rem)',
              fontWeight: 700,
              color: '#09090b',
              letterSpacing: '-0.01em',
            }}
          >
            WIQN exists to turn these unknowns into evidence.
          </div>
        </div>
      </div>
    </section>
  );
};
