'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface NavigationProps {
  theme?: 'light' | 'dark';
}

export const Navigation: React.FC<NavigationProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile navigation drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`nav-header ${
          isLight
            ? scrolled
              ? 'nav-header-light-scrolled'
              : 'nav-header-light-transparent'
            : scrolled
            ? 'nav-header-scrolled'
            : 'nav-header-transparent'
        }`}
      >
        <div className="container">
          <div className="nav-inner-container">
            {/* Logo with Brand Hierarchy */}
            <Link href="/" aria-label="ADYK Wiqn Homepage" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <BrandLogo size={32} showWordmark={true} wordmarkVariant="default" theme={isLight ? 'light' : 'dark'} />
            </Link>

            {/* Desktop Navigation Links (Part 29) */}
            <nav className="nav-links-desktop" aria-label="Main Navigation">
              <Link href="#product" className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
                Product
              </Link>
              <Link href="#how-it-works" className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
                How It Works
              </Link>
              <Link href="#evidence" className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
                Evidence
              </Link>
              <Link href="#about" className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
                About
              </Link>
              <Link href="#contact" className={isLight ? 'nav-link-item-light' : 'nav-link-item'}>
                Contact
              </Link>
            </nav>

            {/* Right Header Actions: Login (desktop), CTA, Hamburger (mobile) */}
            <div className="nav-actions-right">
              <Link
                href="/login"
                className={`${isLight ? 'nav-link-item-light' : 'nav-link-item'} desktop-login-link`}
                style={{ padding: '8px 12px' }}
              >
                Log In
              </Link>

              {/* Start Experiment CTA */}
              <Link
                href="/experiments/new"
                className={isLight ? 'nav-cta-btn-light' : 'nav-cta-btn'}
                aria-label="Start an Experiment"
              >
                <span className="nav-cta-label-desktop">Start an Experiment</span>
                <span className="nav-cta-label-mobile">
                  <span>START</span>
                  <span>EXPERIMENT</span>
                </span>
                <ArrowUpRight className="nav-cta-arrow" size={13} />
              </Link>

              {/* Mobile Hamburger Button: 44x44 touch target */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation-drawer"
                className={isLight ? 'mobile-menu-btn mobile-menu-btn-light' : 'mobile-menu-btn'}
              >
                {mobileOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay (Part 29) */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className={`mobile-drawer-overlay ${isLight ? 'mobile-drawer-overlay-light' : ''}`}
        >
          <div className="mobile-drawer-content">
            <div className="mobile-drawer-links">
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.22em',
                  color: isLight ? '#71717a' : 'var(--color-gray-500)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                NAVIGATION
              </div>

              <Link
                href="#product"
                onClick={() => setMobileOpen(false)}
                className={`mobile-drawer-link ${isLight ? 'mobile-drawer-link-light' : ''}`}
              >
                Product
              </Link>

              <Link
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
                className={`mobile-drawer-link ${isLight ? 'mobile-drawer-link-light' : ''}`}
              >
                How It Works
              </Link>

              <Link
                href="#evidence"
                onClick={() => setMobileOpen(false)}
                className={`mobile-drawer-link ${isLight ? 'mobile-drawer-link-light' : ''}`}
              >
                Evidence
              </Link>

              <Link
                href="#about"
                onClick={() => setMobileOpen(false)}
                className={`mobile-drawer-link ${isLight ? 'mobile-drawer-link-light' : ''}`}
              >
                About
              </Link>

              <Link
                href="#company"
                onClick={() => setMobileOpen(false)}
                className={`mobile-drawer-link ${isLight ? 'mobile-drawer-link-light' : ''}`}
              >
                Company
              </Link>

              <Link
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className={`mobile-drawer-link ${isLight ? 'mobile-drawer-link-light' : ''}`}
              >
                Contact
              </Link>
            </div>

            <div className="mobile-drawer-actions">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={isLight ? 'btn-secondary-light' : 'btn-secondary'}
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                Log In
              </Link>

              <Link
                href="/experiments/new"
                onClick={() => setMobileOpen(false)}
                className={isLight ? 'btn-primary-light' : 'btn-primary'}
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                <span>Start an Experiment</span>
                <ArrowUpRight size={14} />
              </Link>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.16em',
                  color: isLight ? '#71717a' : 'var(--color-gray-500)',
                  textTransform: 'uppercase',
                }}
              >
                ADYK WIQN // FROM IDEA TO EVIDENCE
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
