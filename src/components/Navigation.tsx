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
      <header className={`nav-header ${scrolled ? 'nav-header-scrolled' : 'nav-header-transparent'}`}>
        <div className="container">
          <div className="nav-inner-container">
            {/* Logo with Brand Hierarchy - strictly aligned center */}
            <Link href="/" aria-label="ADYK Wiqn Homepage" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <BrandLogo size={32} showWordmark={true} wordmarkVariant="default" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="nav-links-desktop" aria-label="Main Navigation">
              <Link href="#overview" className="nav-link-item">
                Overview
              </Link>
              <Link href="#method" className="nav-link-item">
                How It Works
              </Link>
              <Link href="#cardex" className="nav-link-item">
                Cardex Alpha
              </Link>
              <Link href="/dashboard" className="nav-link-item">
                Dashboard
              </Link>
            </nav>

            {/* Right Header Actions: Login (desktop), CTA, Hamburger (mobile) */}
            <div className="nav-actions-right">
              <Link
                href="/login"
                className="nav-link-item desktop-login-link"
                style={{ padding: '8px 12px' }}
              >
                Log In
              </Link>

              {/* Start Experiment CTA - refined compact proportions on mobile */}
              <Link
                href="/experiments/new"
                className="nav-cta-btn"
                aria-label="Start an experiment"
              >
                <span className="nav-cta-label-desktop">Start Experiment</span>
                <span className="nav-cta-label-mobile">
                  <span>START</span>
                  <span>EXPERIMENT</span>
                </span>
                <ArrowUpRight className="nav-cta-arrow" size={13} />
              </Link>

              {/* Mobile Hamburger Button: 44x44 touch target, perfectly center-aligned */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation-drawer"
                className="mobile-menu-btn"
              >
                {mobileOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="mobile-drawer-overlay"
        >
          <div className="mobile-drawer-content">
            <div className="mobile-drawer-links">
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.22em',
                  color: 'var(--color-gray-500)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                NAVIGATION REGISTRY
              </div>

              <Link
                href="#overview"
                onClick={() => setMobileOpen(false)}
                className="mobile-drawer-link"
              >
                01 // Overview
              </Link>

              <Link
                href="#method"
                onClick={() => setMobileOpen(false)}
                className="mobile-drawer-link"
              >
                02 // The Method
              </Link>

              <Link
                href="#cardex"
                onClick={() => setMobileOpen(false)}
                className="mobile-drawer-link"
              >
                03 // Cardex Alpha
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="mobile-drawer-link"
              >
                04 // Dashboard
              </Link>
            </div>

            <div className="mobile-drawer-actions">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                Log In
              </Link>

              <Link
                href="/experiments/new"
                onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                <span>Start An Experiment</span>
                <ArrowUpRight size={14} />
              </Link>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.16em',
                  color: 'var(--color-gray-500)',
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
