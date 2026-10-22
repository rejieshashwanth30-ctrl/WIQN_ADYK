import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ADYK Wiqn | From Idea to Evidence',
  description: 'Validate your product with real users, real behavior and real feedback before investing heavily in building it.',
  keywords: [
    'ADYK',
    'Wiqn',
    'product validation',
    'product intelligence',
    'user behavior telemetry',
    'prototyping evidence',
    'falsifiable hypothesis',
    'founder research',
  ],
  publisher: 'ADYK',
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('adyk-wiqn'))
      ? process.env.NEXT_PUBLIC_APP_URL
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://adykwiqn.vercel.app')
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ADYK Wiqn | From Idea to Evidence',
    description: 'Validate your product with real users, real behavior and real feedback before investing heavily in building it.',
    url: process.env.NEXT_PUBLIC_APP_URL || '/',
    siteName: 'ADYK Wiqn',
    images: [
      {
        url: '/brand/adyk-wiqn-logo.jpg',
        width: 960,
        height: 960,
        alt: 'ADYK Wiqn Brand Mark',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADYK Wiqn | From Idea to Evidence',
    description: 'Validate your product with real users, real behavior and real feedback before investing heavily in building it.',
    images: ['/brand/adyk-wiqn-logo.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/brand/adyk-wiqn-logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
