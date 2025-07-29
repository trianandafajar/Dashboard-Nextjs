import "@/app/ui/global.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'Modern dashboard built with Next.js and TypeScript',
  keywords: ['dashboard', 'nextjs', 'typescript', 'react'],
  authors: [{ name: 'Acme Team' }],
  creator: 'Acme Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://acme-dashboard.com',
    title: 'Acme Dashboard',
    description: 'Modern dashboard built with Next.js and TypeScript',
    siteName: 'Acme Dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acme Dashboard',
    description: 'Modern dashboard built with Next.js and TypeScript',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
