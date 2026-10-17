'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { Plus, ArrowLeft, ExternalLink, Shield } from 'lucide-react';

interface DashboardNavProps {
  currentExperimentId?: string;
  currentExperimentName?: string;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  currentExperimentId,
  currentExperimentName,
}) => {
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard';
  const isNew = pathname === '/experiments/new';
  const isDetail = pathname.startsWith('/experiments/') && !isNew;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(7, 7, 9, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          padding: '0 24px',
        }}
      >
        {/* Left: Brand & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/dashboard" aria-label="Wiqn Workspace">
            <BrandLogo size={28} showWordmark={true} wordmarkVariant="stacked" />
          </Link>

          <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>/</span>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <Link
              href="/dashboard"
              style={{
                color: isDashboard ? 'var(--color-white)' : 'var(--color-silver-300)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Workspace
            </Link>

            {isNew && (
              <>
                <span style={{ color: 'var(--color-gray-500)' }}>/</span>
                <span style={{ color: 'var(--color-white)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  New Experiment
                </span>
              </>
            )}

            {isDetail && currentExperimentName && (
              <>
                <span style={{ color: 'var(--color-gray-500)' }}>/</span>
                <span style={{ color: 'var(--color-white)', letterSpacing: '0.04em', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentExperimentName}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right: Actions & User Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-silver-300)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-silver-300)')}
          >
            <span>Public Site</span>
            <ExternalLink size={12} />
          </Link>

          {!isNew && (
            <Link
              href="/experiments/new"
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.6875rem' }}
            >
              <Plus size={14} />
              <span>New Experiment</span>
            </Link>
          )}

          {/* Founder Identity Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 700,
              }}
            >
              F
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-silver-200)',
                letterSpacing: '0.04em',
              }}
            >
              FOUNDER
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
