'use client';

import React from 'react';
import { ArrowDown, Check, X } from 'lucide-react';

const TRADITIONAL_FLOW = [
  { step: 'IDEA', note: 'Unverified assumption' },
  { step: 'BUILD', note: 'Heavy engineering & capital expenditure' },
  { step: 'LAUNCH', note: 'Public unveiling without interaction data' },
  { step: 'HOPE', note: 'Waiting for traction that may never come' },
];

const WIQN_FLOW = [
  { step: 'IDEA', note: 'Original product spark' },
  { step: 'HYPOTHESIS', note: 'Explicit, falsifiable assumption' },
  { step: 'TEST', note: 'Live lightweight prototype deployment' },
  { step: 'REAL USERS', note: 'Real people interacting with real UI' },
  { step: 'EVIDENCE', note: 'Autocaptured behavior & qualitative friction' },
  { step: 'LEARN', note: 'Structured facts, hypotheses & limitations' },
  { step: 'DECIDE', note: 'Build, Improve, Pivot, Stop, or Test Again' },
  { step: 'BUILD', note: 'Execute with empirical certainty' },
];

export const ProductDifference: React.FC = () => {
  return (
    <section className="section-responsive" style={{ backgroundColor: '#070709' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-dot" />
            <span>THE ARCHITECTURAL DIFFERENCE</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--color-white)',
              marginBottom: '16px',
            }}
          >
            BUILDING FASTER DOES NOT
            <br />
            MEAN LEARNING FASTER.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'clamp(0.9375rem, 3.2vw, 1.0625rem)',
              color: 'var(--color-silver-300)',
              lineHeight: 1.6,
            }}
          >
            Most software teams spend months building the wrong thing efficiently.
            Wiqn inverts the sequence: prove the premise before committing the code.
          </p>
        </div>

        {/* Dual Comparison Grid */}
        <div className="grid-2col-responsive" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Traditional Way */}
          <div
            className="card-responsive"
            style={{
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '20px',
                  marginBottom: '36px',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.2em', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                    THE SPECULATIVE PARADIGM
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-silver-300)' }}>
                    Traditional Development
                  </h3>
                </div>
                <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-gray-500)' }}>
                  <X size={16} />
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {TRADITIONAL_FLOW.map((item, index) => (
                  <div key={item.step}>
                    <div
                      style={{
                        padding: '18px 24px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          color: index === TRADITIONAL_FLOW.length - 1 ? 'var(--color-gray-500)' : 'var(--color-silver-300)',
                        }}
                      >
                        {item.step}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-primary)',
                          fontSize: '0.75rem',
                          color: 'var(--color-gray-500)',
                        }}
                      >
                        {item.note}
                      </span>
                    </div>

                    {index < TRADITIONAL_FLOW.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0', color: 'rgba(255, 255, 255, 0.15)' }}>
                        <ArrowDown size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: '48px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-gray-500)',
                letterSpacing: '0.1em',
              }}
            >
              FAILURE MODE: 90% OF ASSUMPTIONS COLLAPSE POST-LAUNCH
            </div>
          </div>

          {/* Wiqn Evidence Loop */}
          <div
            className="card-responsive"
            style={{
              backgroundColor: '#101014',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 0 40px rgba(255, 255, 255, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  paddingBottom: '20px',
                  marginBottom: '36px',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.2em', color: 'var(--color-silver-300)', textTransform: 'uppercase' }}>
                    THE EMPIRICAL PARADIGM
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-white)' }}>
                    The Wiqn Method
                  </h3>
                </div>
                <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-white)', color: '#000000' }}>
                  <Check size={16} />
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {WIQN_FLOW.map((item, index) => {
                  const isBuild = item.step === 'BUILD';
                  return (
                    <div key={item.step}>
                      <div
                        style={{
                          padding: '12px 20px',
                          backgroundColor: isBuild ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.05)',
                          border: isBuild ? '1px solid var(--color-white)' : '1px solid rgba(255, 255, 255, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderRadius: '2px',
                          color: isBuild ? '#050505' : 'var(--color-white)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                          }}
                        >
                          {item.step}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '0.75rem',
                            color: isBuild ? '#27272a' : 'var(--color-silver-300)',
                          }}
                        >
                          {item.note}
                        </span>
                      </div>

                      {index < WIQN_FLOW.length - 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0', color: 'rgba(255, 255, 255, 0.3)' }}>
                          <ArrowDown size={11} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                marginTop: '36px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-white)',
                letterSpacing: '0.1em',
              }}
            >
              OUTCOME: CAPITAL COMMITTED STRICTLY TO VERIFIED DEMAND
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
