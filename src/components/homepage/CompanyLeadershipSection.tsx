'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const LinkedInIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const CompanyLeadershipSection: React.FC = () => {
  return (
    <section
      id="built-by"
      className="wiqn-section-compact"
      style={{
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div id="company" style={{ position: 'relative', top: '-72px', visibility: 'hidden' }} />
      <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <div className="wiqn-section-header">
          <div style={{ marginBottom: '12px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>06 // BUILT BY</span>
            </div>
          </div>
          <h2 className="wiqn-section-title">BUILT BY</h2>
        </div>

        {/* Rejiesh Ashwanth V Only — Compact & Premium */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: '6px',
            padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid #e4e4e7',
                backgroundColor: '#f4f4f5',
                position: 'relative',
              }}
            >
              <Image
                src="/brand/rejiesh-ashwanth.jpg"
                alt="Rejiesh Ashwanth V, CEO & Co-Founder — ADYK Multi Venture Company"
                width={64}
                height={64}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                priority
              />
            </div>

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#09090b',
                  letterSpacing: '0.01em',
                  marginBottom: '2px',
                }}
              >
                REJIESH ASHWANTH V
              </h3>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: '#52525b',
                  letterSpacing: '0.04em',
                }}
              >
                CEO &amp; Co-Founder — ADYK Multi Venture Company
              </div>
            </div>
          </div>

          <a
            href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '4px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
              color: '#09090b',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 160ms ease',
            }}
            aria-label="View LinkedIn profile of Rejiesh Ashwanth V"
          >
            <LinkedInIcon size={13} />
            <span>LinkedIn</span>
            <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </section>
  );
};
