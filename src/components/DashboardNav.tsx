'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { Plus, ExternalLink, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface DashboardNavProps {
  currentExperimentId?: string;
  currentExperimentName?: string;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  currentExperimentId,
  currentExperimentName,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isDashboard = pathname === '/dashboard';
  const isNew = pathname === '/experiments/new';
  const isDetail = pathname.startsWith('/experiments/') && !isNew;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(7, 7, 9, 0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="dashboard-nav-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
          paddingLeft: 'max(16px, env(safe-area-inset-left, 16px))',
          paddingRight: 'max(16px, env(safe-area-inset-right, 16px))',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Left: Brand & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <Link href="/dashboard" aria-label="Wiqn Workspace" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
            <BrandLogo size={26} showWordmark={true} wordmarkVariant="stacked" />
          </Link>

          <span className="dash-breadcrumb-sep" style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>/</span>

          <nav className="dash-breadcrumb-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', minWidth: 0, overflow: 'hidden' }}>
            <Link
              href="/dashboard"
              style={{
                color: isDashboard ? 'var(--color-white)' : 'var(--color-silver-300)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              Workspace
            </Link>

            {isNew && (
              <>
                <span style={{ color: 'var(--color-gray-500)' }}>/</span>
                <span style={{ color: 'var(--color-white)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  New
                </span>
              </>
            )}

            {isDetail && currentExperimentName && (
              <>
                <span style={{ color: 'var(--color-gray-500)' }}>/</span>
                <span style={{ color: 'var(--color-white)', letterSpacing: '0.04em', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentExperimentName}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right: Actions & User Context */}
        {/* Right: Actions & User Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link
            href="/"
            className="dash-icon-btn"
            title="Public Site"
            aria-label="Public Site"
          >
            <span className="dash-desktop-text">Public Site</span>
            <ExternalLink size={13} />
          </Link>

          {!isNew && (
            <Link
              href="/experiments/new"
              className="dash-new-btn"
              title="New Experiment"
              aria-label="New Experiment"
            >
              <Plus size={12} strokeWidth={2.4} />
              <span className="dash-desktop-text">New Experiment</span>
              <span className="dash-mobile-text">New</span>
            </Link>
          )}

          {/* Founder Identity Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 6px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
            }}
            title={userEmail || 'Authenticated Founder'}
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
                flexShrink: 0,
              }}
            >
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'F'}
            </div>
            <span
              className="dash-desktop-text"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-silver-200)',
                letterSpacing: '0.04em',
                maxWidth: '110px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userEmail ? userEmail.split('@')[0] : 'FOUNDER'}
            </span>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="dash-icon-btn"
            title="Log out of Wiqn"
            aria-label="Sign Out"
          >
            <LogOut size={13} />
            <span className="dash-desktop-text">Sign Out</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .dash-desktop-text {
            display: none !important;
          }
          .dash-mobile-text {
            display: inline !important;
          }
          .dash-breadcrumb-sep,
          .dash-breadcrumb-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
