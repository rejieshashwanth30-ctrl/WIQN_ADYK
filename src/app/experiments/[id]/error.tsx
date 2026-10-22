'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft, Layers } from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';

export default function ExperimentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[WIQN Experiment Workspace Error Boundary caught error]:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <DashboardNav />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#0a0a0d',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '2px',
            padding: '36px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#ef4444',
            }}
          >
            <AlertCircle size={24} />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              color: 'var(--color-silver-300)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            EXPERIMENT WORKSPACE NOTICE
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '12px',
            }}
          >
            Unable to load experiment workspace
          </h1>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-silver-300)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            The workspace encountered a temporary rendering or connection issue while preparing telemetry and analytics views. Your experiment is safely saved in the database.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => reset()}
              className="btn-primary"
              style={{
                fontSize: '0.75rem',
                padding: '9px 18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              <span>Retry Loading</span>
            </button>

            <Link
              href="/dashboard"
              className="btn-secondary"
              style={{
                fontSize: '0.75rem',
                padding: '9px 18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <Layers size={14} />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
