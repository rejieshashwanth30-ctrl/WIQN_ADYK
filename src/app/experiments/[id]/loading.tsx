import React from 'react';
import { DashboardNav } from '@/components/DashboardNav';

export default function ExperimentLoading() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff' }}>
      <DashboardNav />
      <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span className="eyebrow-dot" style={{ animation: 'pulse 1.5s infinite' }} />
          <span>LOADING EXPERIMENT WORKSPACE...</span>
        </div>
      </div>
    </div>
  );
}
