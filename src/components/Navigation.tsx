'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
          transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo with Brand Hierarchy */}
          <Link href="/" aria-label="ADYK Wiqn Homepage">
            <BrandLogo size={32} showWordmark={true} wordmarkVariant="default" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '32px',
            }}
            className="desktop-nav"
          >
            <Link
              href="#overview"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-silver-300)')}
            >
              Overview
            </Link>

            <Link
              href="#method"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-silver-300)')}
            >
              How It Works
            </Link>

            <Link
              href="#cardex"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-silver-300)')}
            >
              Cardex Alpha
            </Link>

            <Link
              href="/dashboard"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-silver-300)')}
            >
              Dashboard
            </Link>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/login"
              style={{
                display: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
                padding: '8px 12px',
              }}
              className="desktop-nav"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-silver-300)')}
            >
              Log In
            </Link>

            <Link href="/experiments/new" className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.75rem' }}>
              <span>Start Experiment</span>
              <ArrowUpRight size={14} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'inline-flex',
                color: 'var(--color-white)',
                padding: '6px',
              }}
              className="mobile-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(5, 5, 5, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '96px 24px 40px 24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <Link
              href="#overview"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-white)',
                letterSpacing: '0.04em',
              }}
            >
              01 // Overview
            </Link>
            <Link
              href="#method"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-white)',
                letterSpacing: '0.04em',
              }}
            >
              02 // The Method
            </Link>
            <Link
              href="#cardex"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-white)',
                letterSpacing: '0.04em',
              }}
            >
              03 // Cardex Alpha
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-white)',
                letterSpacing: '0.04em',
              }}
            >
              04 // Dashboard
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="btn-secondary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Log In
            </Link>
            <Link
              href="/experiments/new"
              onClick={() => setMobileOpen(false)}
              className="btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Start An Experiment
            </Link>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style jsx global>{`
        @media (min-width: 840px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
