'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#030304',
        padding: '48px 0 36px 0',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Brand & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/" aria-label="ADYK Wiqn Homepage" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <BrandLogo size={28} showWordmark={true} wordmarkVariant="default" />
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-silver-300)',
                letterSpacing: '0.04em',
              }}
            >
              Test Ideas. Discover Truth. Build Smarter.
            </p>
          </div>

          {/* Quick Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-silver-300)',
            }}
            aria-label="Footer Navigation"
          >
            <Link href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }} className="nav-link-item">
              How It Works
            </Link>
            <Link href="#evidence" style={{ color: 'inherit', textDecoration: 'none' }} className="nav-link-item">
              Evidence
            </Link>
            <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }} className="nav-link-item">
              Dashboard
            </Link>
            <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }} className="nav-link-item">
              Log In
            </Link>
            <Link
              href="/experiments/new"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <span>Start Validating</span>
              <ArrowUpRight size={13} />
            </Link>
          </nav>
        </div>

        {/* Bottom Legal & Copyright */}
        <div
          style={{
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--color-gray-500)',
            letterSpacing: '0.06em',
          }}
        >
          <div>
            © 2026 ADYK Wiqn. All rights reserved.
          </div>
          <div>
            A VENTURE OF ADYK • EXPERIMENTATION & VALIDATION PLATFORM
          </div>
        </div>
      </div>
    </footer>
  );
};
