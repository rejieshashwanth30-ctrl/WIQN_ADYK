import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <Link href="/" style={{ marginBottom: '32px' }}>
        <BrandLogo size={40} showWordmark={true} wordmarkVariant="default" />
      </Link>
      
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
        404 // RESOURCE_NOT_FOUND
      </div>
      
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>
        Coordinate Unknown
      </h1>
      
      <p style={{ color: 'var(--color-silver-300)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '32px', fontSize: '0.9375rem' }}>
        The requested path does not map to a registered experiment, thesis, or public view.
      </p>

      <Link href="/" className="btn-primary">
        Return to Overview
      </Link>
    </div>
  );
}
