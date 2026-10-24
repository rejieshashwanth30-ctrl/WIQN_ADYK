'use client';

import React from 'react';
import { Target, Layers, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export const AboutWiqnSection: React.FC = () => {
  return (
    <section
      id="about"
      style={{
        padding: 'clamp(64px, 10vh, 112px) 20px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e4e4e7',
      }}
    >
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>06 // ABOUT WIQN</span>
            </div>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              color: '#09090b',
              marginBottom: '14px',
            }}
          >
            Product Validation, Grounded in Truth.
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
              color: '#52525b',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            WIQN is an AI-powered product validation and experimentation platform that transforms raw prototype behavior into actionable decisions.
          </p>
        </div>

        {/* 4-Step Founder Comprehension Model (Part 1) */}
        <div
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e4e4e7',
            borderRadius: '6px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.12em',
              color: '#71717a',
              textTransform: 'uppercase',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            THE WIQN PRINCIPLE // FOUR QUESTIONS EVERY FOUNDER MUST ANSWER
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {[
              { num: '01', q: 'What happened?', a: 'Autocapture physical clicks, journeys, and time spent on your prototype.' },
              { num: '02', q: 'What does the data show?', a: 'Analyze click distribution, conversion funnels, and real drop-off points.' },
              { num: '03', q: 'What might it mean?', a: 'Synthesize behavioral signals with qualitative feedback via epistemic AI.' },
              { num: '04', q: 'What should I do next?', a: 'Get evidence-grounded recommendations: build, improve, or pivot.' },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '4px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', fontWeight: 600 }}>
                  STEP {step.num}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, color: '#09090b' }}>
                  {step.q}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#52525b', lineHeight: 1.45 }}>
                  {step.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Positioning: What WIQN Is vs Is NOT (Part 32) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {/* What WIQN IS */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '4px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: '#15803d' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: '#09090b' }}>
                What WIQN Is
              </h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84375rem', color: '#52525b' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#09090b', fontWeight: 600 }}>•</span>
                <span>An <strong>AI-powered product validation</strong> &amp; experimentation platform.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#09090b', fontWeight: 600 }}>•</span>
                <span>A lightweight testing harness for live prototypes, landing pages, and web apps.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#09090b', fontWeight: 600 }}>•</span>
                <span>An epistemic truth engine that isolates measured behavior from speculative assumptions.</span>
              </li>
            </ul>
          </div>

          {/* What WIQN IS NOT */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '4px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XCircle size={18} style={{ color: '#71717a' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: '#09090b' }}>
                What WIQN Is NOT
              </h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84375rem', color: '#71717a' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#a1a1aa' }}>✕</span>
                <span>NOT a website builder or no-code drag-and-drop page editor.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#a1a1aa' }}>✕</span>
                <span>NOT an IDE or code compiler.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#a1a1aa' }}>✕</span>
                <span>NOT a bloated generic marketing analytics dashboard.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
