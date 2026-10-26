'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section
      id="cta"
      className="wiqn-section-compact"
      style={{
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '12px' }}>
          <div className="eyebrow-light">
            <span className="eyebrow-dot-light" />
            <span>08 // START VALIDATING</span>
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
            marginBottom: '12px',
            textWrap: 'balance',
          }}
        >
          READY TO TEST YOUR IDEA?
        </h2>

        <p
          style={{
            fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
            color: '#52525b',
            lineHeight: 1.5,
            maxWidth: '520px',
            margin: '0 auto 24px auto',
          }}
        >
          Turn real user behavior into evidence before you build further.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            href="/experiments/new"
            className="btn-primary-light"
            style={{ padding: '14px 28px', fontSize: '0.875rem' }}
            aria-label="Start Validating"
          >
            <span>START VALIDATING</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};
