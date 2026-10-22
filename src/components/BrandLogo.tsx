import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  wordmarkVariant?: 'default' | 'stacked' | 'wiqn-only';
  className?: string;
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 32,
  showWordmark = true,
  wordmarkVariant = 'default',
  className = '',
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const wiqnColor = isLight ? '#09090b' : 'var(--color-white)';
  const adykColor = isLight ? '#71717a' : 'var(--color-silver-300)';
  const dividerColor = isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.25)';

  return (
    <div
      className={`brand-logo-root ${className}`}
      style={{
        gap: size > 40 ? '16px' : '10px',
        ['--logo-mark-size' as any]: `${size}px`,
      }}
    >
      {/* Official ADYK / Wiqn geometric brand mark */}
      <div
        className="brand-mark-box"
        style={{
          width: size,
          height: size,
          borderRadius: size > 48 ? '4px' : '2px',
          borderColor: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
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
        <div
          className={wordmarkVariant === 'default' ? 'brand-wordmark-default' : ''}
          style={{
            display: 'flex',
            flexDirection: wordmarkVariant === 'stacked' ? 'column' : 'row',
            alignItems: wordmarkVariant === 'stacked' ? 'flex-start' : 'center',
            gap: wordmarkVariant === 'stacked' ? '0px' : '8px',
            lineHeight: 1.1,
          }}
        >
          {wordmarkVariant === 'wiqn-only' ? (
            <span
              className="brand-wordmark-wiqn"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: size > 36 ? '1.25rem' : '0.9375rem',
                letterSpacing: '0.14em',
                color: wiqnColor,
              }}
            >
              WIQN
            </span>
          ) : wordmarkVariant === 'stacked' ? (
            <>
              <span
                className="brand-wordmark-adyk"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  fontSize: '0.625rem',
                  letterSpacing: '0.22em',
                  color: adykColor,
                }}
              >
                ADYK
              </span>
              <span
                className="brand-wordmark-wiqn"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: size > 36 ? '1.125rem' : '0.875rem',
                  letterSpacing: '0.14em',
                  color: wiqnColor,
                }}
              >
                WIQN
              </span>
            </>
          ) : (
            <>
              <span
                className="brand-wordmark-adyk"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  color: adykColor,
                }}
              >
                ADYK
              </span>
              <span
                className="brand-wordmark-divider"
                style={{
                  color: dividerColor,
                  fontSize: '0.75rem',
                }}
              >
                /
              </span>
              <span
                className="brand-wordmark-wiqn"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  letterSpacing: '0.16em',
                  color: wiqnColor,
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
