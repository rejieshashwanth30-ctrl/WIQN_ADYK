'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  theme?: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <footer
      style={{
        borderTop: isLight ? '1px solid #e4e4e7' : '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: isLight ? '#fafafa' : '#040405',
        padding: '44px 0 32px 0',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Main Footer Row: Brand + Navigation + Social Links */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '28px',
            paddingBottom: '28px',
            borderBottom: isLight ? '1px solid #e4e4e7' : '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Brand & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
            <Link href="/" aria-label="ADYK Wiqn Homepage" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <BrandLogo size={28} showWordmark={true} wordmarkVariant="default" theme={isLight ? 'light' : 'dark'} />
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: isLight ? '#71717a' : 'var(--color-silver-300)',
                letterSpacing: '0.04em',
                lineHeight: 1.5,
              }}
            >
              Test Ideas. Discover Truth. Build Smarter.
            </p>
          </div>

          {/* Core Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: isLight ? '#52525b' : 'var(--color-silver-300)',
            }}
            aria-label="Footer Navigation"
          >
            <Link href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }} className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
              How It Works
            </Link>
            <Link href="#loop" style={{ color: 'inherit', textDecoration: 'none' }} className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
              Validation Loop
            </Link>
            <Link href="#evidence" style={{ color: 'inherit', textDecoration: 'none' }} className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
              Evidence
            </Link>
            <Link href="#about" style={{ color: 'inherit', textDecoration: 'none' }} className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
              About
            </Link>
            <Link href="#company" style={{ color: 'inherit', textDecoration: 'none' }} className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
              Company
            </Link>
            <Link href="#contact" style={{ color: 'inherit', textDecoration: 'none' }} className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
              Contact
            </Link>
            <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }} className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
              Log In
            </Link>
            <Link
              href="/experiments/new"
              style={{
                color: isLight ? '#09090b' : '#ffffff',
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

          {/* Direct Contact & Social Links */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="tel:8870605699"
                style={{ color: isLight ? '#52525b' : 'var(--color-silver-300)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isLight ? '#09090b' : '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isLight ? '#52525b' : 'var(--color-silver-300)')}
              >
                8870605699
              </a>
              <span style={{ color: isLight ? '#d4d4d8' : 'rgba(255, 255, 255, 0.15)' }}>•</span>
              <a
                href="mailto:adykcompany.in@gmail.com"
                style={{ color: isLight ? '#52525b' : 'var(--color-silver-300)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isLight ? '#09090b' : '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isLight ? '#52525b' : 'var(--color-silver-300)')}
              >
                adykcompany.in@gmail.com
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: isLight ? '#52525b' : 'var(--color-silver-300)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isLight ? '#09090b' : '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isLight ? '#52525b' : 'var(--color-silver-300)')}
                aria-label="LinkedIn: Rejiesh Ashwanth V"
              >
                <span>Rejiesh (LinkedIn)</span>
                <ArrowUpRight size={12} />
              </a>
              <span style={{ color: isLight ? '#d4d4d8' : 'rgba(255, 255, 255, 0.15)' }}>•</span>
              <a
                href="https://www.linkedin.com/in/dineshraj-s-758931390"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: isLight ? '#52525b' : 'var(--color-silver-300)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isLight ? '#09090b' : '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isLight ? '#52525b' : 'var(--color-silver-300)')}
                aria-label="LinkedIn: Dineshraj S"
              >
                <span>Dineshraj (LinkedIn)</span>
                <ArrowUpRight size={12} />
              </a>
              <span style={{ color: isLight ? '#d4d4d8' : 'rgba(255, 255, 255, 0.15)' }}>•</span>
              <a
                href="https://www.instagram.com/buildby.adyk"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: isLight ? '#52525b' : 'var(--color-silver-300)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isLight ? '#09090b' : '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isLight ? '#52525b' : 'var(--color-silver-300)')}
                aria-label="Instagram: ADYK"
              >
                <span>Instagram</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Founder & Launch Attribution Row */}
        <div
          style={{
            padding: '16px 0',
            borderBottom: isLight ? '1px solid #e4e4e7' : '1px solid rgba(255, 255, 255, 0.04)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: isLight ? '#71717a' : 'var(--color-gray-400)',
            letterSpacing: '0.04em',
          }}
        >
          <div>
            Built by <span style={{ color: isLight ? '#09090b' : 'var(--color-silver-200)', fontWeight: 600 }}>REJIESH ASHWANTH V</span> — CEO &amp; Co-Founder, ADYK Multi Venture Company
          </div>
          <div>
            Launched by <span style={{ color: isLight ? '#09090b' : 'var(--color-silver-200)' }}>ADYK Multi Venture Company</span>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div
          style={{
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: isLight ? '#71717a' : 'var(--color-gray-500)',
            letterSpacing: '0.04em',
          }}
        >
          <div>
            © 2026 ADYK Multi Venture Company. All rights reserved.
          </div>
          <div>
            WIQN PRODUCT VALIDATION &amp; EXPERIMENTATION PLATFORM
          </div>
        </div>
      </div>
    </footer>
  );
};
