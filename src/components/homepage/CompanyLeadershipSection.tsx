'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const LinkedInIcon = ({ size = 15 }: { size?: number }) => (
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
      id="company"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>LEADERSHIP &amp; ORIGINS</span>
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
              marginBottom: '14px',
            }}
          >
            Built by
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
              color: '#52525b',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            The creator and engineering leadership behind the WIQN validation platform.
          </p>
        </div>

        {/* Profile Card: Rejiesh Ashwanth V */}
        <div
          className="editorial-card"
          style={{
            maxWidth: '680px',
            margin: '0 auto 28px auto',
            padding: 'clamp(24px, 4vw, 36px)',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '22px',
              flexWrap: 'wrap',
            }}
          >
            {/* Real Uploaded Photo */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid #e4e4e7',
                backgroundColor: '#f4f4f5',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                position: 'relative',
              }}
            >
              <Image
                src="/brand/rejiesh-ashwanth.jpg"
                alt="Rejiesh Ashwanth V, CEO and Co-Founder of ADYK Multi Venture Company"
                width={100}
                height={100}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                priority
              />
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.45rem)',
                  fontWeight: 700,
                  color: '#09090b',
                  letterSpacing: '0.01em',
                  marginBottom: '4px',
                }}
              >
                REJIESH ASHWANTH V
              </h3>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#52525b',
                  letterSpacing: '0.04em',
                  lineHeight: 1.5,
                  marginBottom: '12px',
                }}
              >
                CEO &amp; Co-Founder — ADYK Multi Venture Company
              </div>

              <a
                href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  color: '#09090b',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                  transition: 'all 160ms ease',
                }}
                aria-label="View LinkedIn profile of Rejiesh Ashwanth V"
              >
                <LinkedInIcon size={14} />
                <span>View LinkedIn</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          <p
            style={{
              fontSize: '0.84375rem',
              color: '#52525b',
              lineHeight: 1.6,
              borderTop: '1px solid #f4f4f5',
              paddingTop: '16px',
              margin: 0,
            }}
          >
            Leading product architecture, experimentation telemetry intelligence, and engineering execution at ADYK Multi Venture Company.
          </p>
        </div>

        {/* Company Attribution Statement */}
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '16px 20px',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#52525b',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            WIQN is engineered as part of ADYK&apos;s mission to create high-leverage technology products that empower founders to build with clarity and conviction.
          </p>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#09090b',
              letterSpacing: '0.04em',
            }}
          >
            Launched by <strong>ADYK Multi Venture Company</strong>
          </span>
        </div>
      </div>
    </section>
  );
};
