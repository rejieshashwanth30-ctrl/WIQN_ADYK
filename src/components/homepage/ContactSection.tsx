'use client';

import React from 'react';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';

const LinkedInIcon = ({ size = 13 }: { size?: number }) => (
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

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="wiqn-section-compact"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <div className="wiqn-section-header">
          <div style={{ marginBottom: '12px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>07 // CONTACT</span>
            </div>
          </div>
          <h2 className="wiqn-section-title">Let&apos;s Talk.</h2>
          <p className="wiqn-section-subtitle">
            Direct channels and leadership directory for ADYK Multi Venture Company.
          </p>
        </div>

        {/* Leadership Directory: Dineshraj S & Rejiesh Ashwanth V */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {/* Dineshraj S */}
          <div
            style={{
              backgroundColor: '#fafafa',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#09090b',
                  marginBottom: '2px',
                }}
              >
                Dineshraj S
              </h3>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: '#52525b',
                }}
              >
                Founder — ADYK Multi Venture Company
              </div>
            </div>

            <a
              href="https://www.linkedin.com/in/dineshraj-s-758931390"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                color: '#09090b',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
              }}
              aria-label="View LinkedIn profile of Dineshraj S"
            >
              <LinkedInIcon size={12} />
              <span>LinkedIn</span>
              <ArrowUpRight size={10} />
            </a>
          </div>

          {/* Rejiesh Ashwanth V */}
          <div
            style={{
              backgroundColor: '#fafafa',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#09090b',
                  marginBottom: '2px',
                }}
              >
                Rejiesh Ashwanth V
              </h3>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: '#52525b',
                }}
              >
                CEO &amp; Co-Founder — ADYK Multi Venture Company
              </div>
            </div>

            <a
              href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                color: '#09090b',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
              }}
              aria-label="View LinkedIn profile of Rejiesh Ashwanth V"
            >
              <LinkedInIcon size={12} />
              <span>LinkedIn</span>
              <ArrowUpRight size={10} />
            </a>
          </div>
        </div>

        {/* 3 Direct Channels: Phone, Email, Instagram */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Phone */}
          <a
            href="tel:8870605699"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              padding: '14px 16px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 160ms ease',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#09090b',
                flexShrink: 0,
              }}
            >
              <Phone size={15} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>
                PHONE
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: '#09090b' }}>
                8870605699
              </span>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:adykcompany.in@gmail.com"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              padding: '14px 16px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 160ms ease',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#09090b',
                flexShrink: 0,
              }}
            >
              <Mail size={15} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>
                EMAIL
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#09090b', wordBreak: 'break-all' }}>
                adykcompany.in@gmail.com
              </span>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/adyk_multiventurecompany/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              padding: '14px 16px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 160ms ease',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#09090b',
                flexShrink: 0,
              }}
            >
              <InstagramIcon size={15} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>
                INSTAGRAM
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#09090b' }}>
                @adyk_multiventurecompany
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
