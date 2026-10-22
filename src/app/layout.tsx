import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'WIQN | From Idea to Evidence',
  description: 'WIQN helps founders test prototypes with real users, collect behavioral evidence and feedback, and make smarter product decisions.',
  keywords: [
    'WIQN',
    'ADYK',
    'product validation',
    'product experimentation',
    'user behavior telemetry',
    'prototyping evidence',
    'falsifiable hypothesis',
    'founder research',
  ],
  publisher: 'ADYK Multi Venture Company',
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('adyk-wiqn'))
      ? process.env.NEXT_PUBLIC_APP_URL
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://adykwiqn.vercel.app')
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WIQN | From Idea to Evidence',
    description: 'WIQN helps founders test prototypes with real users, collect behavioral evidence and feedback, and make smarter product decisions.',
    url: process.env.NEXT_PUBLIC_APP_URL || '/',
    siteName: 'WIQN',
    images: [
      {
        url: '/brand/adyk-wiqn-logo.jpg',
        width: 960,
        height: 960,
        alt: 'WIQN Brand Mark',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WIQN | From Idea to Evidence',
    description: 'WIQN helps founders test prototypes with real users, collect behavioral evidence and feedback, and make smarter product decisions.',
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
