import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  wordmarkVariant?: 'default' | 'stacked' | 'wiqn-only';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 32,
  showWordmark = true,
  wordmarkVariant = 'default',
  className = '',
}) => {
  return (
    <div
      className={`brand-mark-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size > 40 ? '16px' : '10px',
        userSelect: 'none',
      }}
    >
      {/* Official ADYK / Wiqn geometric brand mark */}
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          flexShrink: 0,
          borderRadius: size > 48 ? '4px' : '2px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Image
          src="/brand/adyk-wiqn-logo.png"
          alt="ADYK Wiqn Brand Mark"
          width={size}
          height={size}
          priority
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: wordmarkVariant === 'stacked' ? 'column' : 'row', alignItems: wordmarkVariant === 'stacked' ? 'flex-start' : 'center', gap: wordmarkVariant === 'stacked' ? '0px' : '8px', lineHeight: 1.1 }}>
          {wordmarkVariant === 'wiqn-only' ? (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: size > 36 ? '1.25rem' : '0.9375rem',
                letterSpacing: '0.14em',
                color: 'var(--color-white)',
              }}
            >
              WIQN
            </span>
          ) : wordmarkVariant === 'stacked' ? (
            <>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  fontSize: '0.625rem',
                  letterSpacing: '0.22em',
                  color: 'var(--color-silver-300)',
                }}
              >
                ADYK
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: size > 36 ? '1.125rem' : '0.875rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-white)',
                }}
              >
                WIQN
              </span>
            </>
          ) : (
            <>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  color: 'var(--color-silver-300)',
                }}
              >
                ADYK
              </span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.25)',
                  fontSize: '0.75rem',
                }}
              >
                /
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  letterSpacing: '0.16em',
                  color: 'var(--color-white)',
                }}
              >
                WIQN
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
