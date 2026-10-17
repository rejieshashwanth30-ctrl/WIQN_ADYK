'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CHAPTERS = [
  {
    num: '01',
    chapter: 'THE UNKNOWN',
    quote: 'An idea is only an assumption until people interact with it.',
    elaboration: 'In the absence of interaction, every slide deck, wireframe, and founders conviction is speculative fiction. Reality begins at the first touch.',
  },
  {
    num: '02',
    chapter: 'THE PROBLEM',
    quote: 'Building faster doesn’t mean learning faster.',
    elaboration: 'Modern tooling lets teams sprint into production at lightspeed. Yet velocity without observation merely accelerates building products nobody wants.',
  },
  {
    num: '03',
    chapter: 'THE WIQN METHOD',
    quote: 'Turn assumptions into experiments.',
    elaboration: 'Deconstruct complex ambitions into falsifiable milestones. Connect a live deployment, define the hypothesis, and establish empirical kill gates.',
  },
  {
    num: '04',
    chapter: 'REAL USERS',
    quote: 'Put your prototype in front of people.',
    elaboration: 'Distribute via private invitation or tap into the ADYK CARDEX Alpha community. Zero synthetic bots, zero fabricated responses.',
  },
  {
    num: '05',
    chapter: 'REAL BEHAVIOR',
    quote: 'See what they actually do.',
    elaboration: 'Autocapture preserves the unvarnished timeline: clicks, hesitations, dwell times, and exit drop-offs without manual instrumentation.',
  },
  {
    num: '06',
    chapter: 'REAL FEEDBACK',
    quote: 'Understand why they do it.',
    elaboration: 'Correlate behavioral drop-offs with structured qualitative friction prompts. Discover what users were thinking when they chose not to commit.',
  },
  {
    num: '07',
    chapter: 'AI INSIGHTS',
    quote: 'Turn evidence into useful understanding.',
    elaboration: 'Structured intelligence parses raw telemetry into rigorous facts, hypotheses, and statistical limitations. No hallucinations, no generic advice.',
  },
  {
    num: '08',
    chapter: 'THE DECISION',
    quote: 'Build. Improve. Pivot. Stop. Test Again.',
    elaboration: 'Executive clarity replaces emotional attachment. Back every engineering sprint with defensible empirical evidence.',
  },
];

export const ScrollStory: React.FC = () => {
  return (
    <section id="story" style={{ position: 'relative', padding: '160px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container-editorial">
        {/* Story Prelude */}
        <div style={{ textAlign: 'center', marginBottom: '140px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-dot" />
            <span>THE EVIDENCE CHRONICLE</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--color-white)',
            }}
          >
            A PHILOSOPHY OF
            <br />
            RADICAL PRODUCT CLARITY.
          </h2>
        </div>

        {/* Chapters Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '120px', position: 'relative' }}>
          {CHAPTERS.map((item) => (
            <div
              key={item.num}
              style={{
                position: 'relative',
                paddingLeft: '36px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '-5px',
                  top: '0px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                }}
              />

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.22em',
                  color: 'var(--color-silver-300)',
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                }}
              >
                SECTION {item.num} // {item.chapter}
              </div>

              <blockquote
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.25,
                  color: 'var(--color-white)',
                  marginBottom: '16px',
                }}
              >
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <p
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: '1.0625rem',
                  color: 'var(--color-silver-300)',
                  lineHeight: 1.7,
                  maxWidth: '680px',
                }}
              >
                {item.elaboration}
              </p>
            </div>
          ))}

          {/* Section 9: Final Story Climax & CTA */}
          <div
            style={{
              position: 'relative',
              padding: '80px 48px',
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 0 60px rgba(255, 255, 255, 0.04)',
              textAlign: 'center',
              marginTop: '40px',
              borderRadius: '2px',
            }}
          >
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '20px' }}>
              <span className="eyebrow-dot" />
              <span>SECTION 09 // CONCLUSION</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'var(--color-white)',
                marginBottom: '20px',
              }}
            >
              DON&apos;T JUST BUILD.
              <br />
              <span style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '8px' }}>
                PROVE IT.
              </span>
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '1.125rem',
                color: 'var(--color-silver-300)',
                maxWidth: '620px',
                margin: '0 auto 40px auto',
                lineHeight: 1.6,
              }}
            >
              Stop committing precious engineering capital on unproven assumptions. Move from uncertainty to defensible evidence today.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/experiments/new" className="btn-primary">
                <span>Start An Experiment</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                <span>Open Intelligence Workspace</span>
              </Link>
            </div>

            <div
              style={{
                marginTop: '48px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.2em',
                color: 'var(--color-gray-500)',
                textTransform: 'uppercase',
              }}
            >
              BUILD. TEST. OBSERVE. LEARN. DECIDE.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
