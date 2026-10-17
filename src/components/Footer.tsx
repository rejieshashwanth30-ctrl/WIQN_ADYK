'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#030304',
        padding: '100px 0 60px 0',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '64px',
            marginBottom: '80px',
          }}
        >
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <BrandLogo size={36} showWordmark={true} wordmarkVariant="default" />
            
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '0.875rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                maxWidth: '320px',
              }}
            >
              ADYK Wiqn helps founders validate products with real users, real behavior and real feedback before investing heavily in building them.
            </p>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.14em',
                color: 'var(--color-gray-500)',
                textTransform: 'uppercase',
              }}
            >
              A VENTURE OF ADYK
              <br />
              A MULTI-VENTURE TECHNOLOGY COMPANY
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--color-white)', textTransform: 'uppercase', marginBottom: '20px' }}>
              Platform
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
              <li><Link href="#overview" style={{ color: 'inherit' }}>Methodology</Link></li>
              <li><Link href="#method" style={{ color: 'inherit' }}>7-Step Cycle</Link></li>
              <li><Link href="#features" style={{ color: 'inherit' }}>Autocapture Engine</Link></li>
              <li><Link href="#cardex" style={{ color: 'inherit' }}>CARDEX Alpha Network</Link></li>
              <li><Link href="/dashboard" style={{ color: 'inherit' }}>Intelligence Workspace</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--color-white)', textTransform: 'uppercase', marginBottom: '20px' }}>
              Execution
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
              <li><Link href="/experiments/new" style={{ color: 'inherit' }}>Launch Experiment</Link></li>
              <li><Link href="/login" style={{ color: 'inherit' }}>Founder Authentication</Link></li>
              <li><Link href="/signup" style={{ color: 'inherit' }}>Create Workspace</Link></li>
              <li><a href="/tracker.js" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Autocapture Snippet (v1.0)</a></li>
            </ul>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--color-white)', textTransform: 'uppercase', marginBottom: '20px' }}>
              Philosophy
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: 1.8,
                color: 'var(--color-silver-200)',
                letterSpacing: '0.08em',
              }}
            >
              BUILD.
              <br />
              TEST.
              <br />
              OBSERVE.
              <br />
              LEARN.
              <br />
              DECIDE.
            </div>
          </div>
        </div>

        {/* Bottom Legal & Identity */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--color-gray-500)',
            letterSpacing: '0.06em',
          }}
        >
          <div>
            © {new Date().getFullYear()} ADYK WIQN. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>PRIVACY ARCHITECTURE</span>
            <span>DATA PROVENANCE</span>
            <span>SYSTEM STATUS: NORMAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
