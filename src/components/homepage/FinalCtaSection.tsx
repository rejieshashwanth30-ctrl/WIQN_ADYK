'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section
      id="cta"
      style={{
        padding: 'clamp(80px, 12vh, 140px) 20px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '16px' }}>
          <div className="eyebrow-light">
            <span className="eyebrow-dot-light" />
            <span>START EXPERIMENTING TODAY</span>
          </div>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.35rem, 5.5vw, 4.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
            color: '#09090b',
            marginBottom: '18px',
            textWrap: 'balance',
          }}
        >
          DON&apos;T JUST BUILD.
          <br />
          PROVE IT.
        </h2>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
            color: '#52525b',
            lineHeight: 1.6,
            maxWidth: '640px',
            margin: '0 auto 36px auto',
          }}
        >
          Run an experiment. Put your prototype in front of real users. Collect evidence. Learn what deserves to be built.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/experiments/new"
            className="btn-primary-light"
            style={{ padding: '14px 28px', fontSize: '0.875rem' }}
            aria-label="Start an Experiment"
          >
            <span>Start an Experiment</span>
            <ArrowUpRight size={16} />
          </Link>

          <Link
            href="#how-it-works"
            className="btn-secondary-light"
            style={{ padding: '14px 24px', fontSize: '0.875rem' }}
            aria-label="Explore WIQN"
          >
            <span>Explore WIQN</span>
            <ChevronDown size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};
