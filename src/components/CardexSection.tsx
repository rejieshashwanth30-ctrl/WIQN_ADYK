'use client';

import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export const CardexSection: React.FC = () => {
  return (
    <section id="cardex" className="section-responsive" style={{ backgroundColor: '#070709' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '820px', marginBottom: '48px' }}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>COMMUNITY ECOSYSTEM</span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-silver-300)',
              marginBottom: '10px',
            }}
          >
            ADYK CARDEX // ALPHA NETWORK
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--color-white)',
              marginBottom: '18px',
            }}
          >
            NEED REAL TESTERS?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'clamp(0.9375rem, 3.2vw, 1.125rem)',
              color: 'var(--color-silver-300)',
              lineHeight: 1.6,
            }}
          >
            Publish your experiment to the ADYK CARDEX Alpha Network and invite real builders, developers, and technology enthusiasts to stress-test your product.
          </p>
        </div>

        {/* Ecosystem Flow Diagram */}
        <div
          className="card-responsive"
          style={{
            backgroundColor: '#0a0a0d',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '48px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.18em', color: 'var(--color-gray-500)', marginBottom: '20px' }}>
            ECOSYSTEM VALUE CHAIN
          </div>
          <div className="cardex-flow-container">
            <div className="cardex-flow-step">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>CARDEX</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>Curated Builder Pool</div>
            </div>
            <div className="cardex-flow-arrow">→</div>
            <div className="cardex-flow-step">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>TESTERS</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>Genuine Early Adopters</div>
            </div>
            <div className="cardex-flow-arrow">→</div>
            <div className="cardex-flow-step">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>WIQN</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>Autocapture & Synthesis</div>
            </div>
            <div className="cardex-flow-arrow">→</div>
            <div className="cardex-flow-step">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>EVIDENCE</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>Defensible Truth</div>
            </div>
          </div>
        </div>

        {/* Two Strict Modes: Private vs Cardex Alpha */}
        <div className="grid-2col-responsive">
          {/* Private Testing Card */}
          <div
            className="card-responsive"
            style={{
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <ShieldCheck size={20} style={{ color: 'var(--color-silver-300)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.16em', color: 'var(--color-silver-300)' }}>
                  DEFAULT MODE
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-white)',
                  marginBottom: '12px',
                }}
              >
                Private Testing
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-silver-300)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                Your experiment is completely confidential and strictly accessible only through your own unique testing link. Ideal for stealth concepts, customer design partnerships, or sensitive prototypes.
              </p>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-gray-500)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '18px',
              }}
            >
              VISIBILITY: STRICTLY ISOLATED TO SENDER LINK
            </div>
          </div>

          {/* Cardex Alpha Card */}
          <div
            className="card-responsive"
            style={{
              backgroundColor: '#111116',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              boxShadow: '0 0 35px rgba(255, 255, 255, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Globe size={20} style={{ color: '#ffffff' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.16em', color: '#ffffff' }}>
                  OPT-IN SYNDICATION
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-white)',
                  marginBottom: '12px',
                }}
              >
                CARDEX Alpha Network
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-silver-200)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                Syndicate your experiment directly into the private ADYK CARDEX testing lounge. Receive rigorous telemetry and qualitative feedback from active technical founders and early adopters.
              </p>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-white)',
                borderTop: '1px solid rgba(255, 255, 255, 0.16)',
                paddingTop: '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span>ACCESS: VERIFIED COMMUNITY BUILDERS</span>
              <span className="badge badge-cardex">100% OPT-IN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
