'use client';

import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

export const AboutWiqnSection: React.FC = () => {
  return (
    <section
      id="about"
      className="wiqn-section-compact"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <div className="wiqn-section-header">
          <div style={{ marginBottom: '12px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>05 // ABOUT WIQN</span>
            </div>
          </div>
          <h2 className="wiqn-section-title">ABOUT WIQN</h2>
          <p
            style={{
              fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
              color: '#3f3f46',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto 24px auto',
            }}
          >
            WIQN is an AI-powered product validation and experimentation platform designed to help founders, developers, students, indie hackers, and product teams test ideas with real users before investing heavily in development.
          </p>
        </div>

        {/* Compact Visual: Better Decisions */}
        <div
          style={{
            backgroundColor: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '6px',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '8px',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
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
              OUTCOME // BETTER DECISIONS
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                color: '#10b981',
                fontWeight: 600,
              }}
            >
              ● HIGH CONVICTION ROADMAP
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#09090b',
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#09090b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={13} />
              </div>
              <span>Better Decisions</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: '#52525b',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} color="#10b981" /> Build Smarter
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} color="#10b981" /> Prevent Waste
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} color="#10b981" /> Data-Driven Truth
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
