import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter-family',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MJ — Mahalaxmi Jewellers | Luxury Curated Jewellery',
    template: '%s | MJ — Mahalaxmi Jewellers',
  },
  description:
    'Discover exquisite curated silver jewellery from Mahalaxmi Jewellers. Shop diamond rings, gold necklaces, bridal sets, and fine jewellery selected for modern elegance since 1987.',
  keywords: ['jewellery', 'diamond rings', 'gold necklaces', 'bridal jewellery', 'luxury jewellery', 'Indian jewellery', 'Mahalaxmi Jewellers'],
  openGraph: {
    title: 'MJ — Mahalaxmi Jewellers',
    description: 'Luxury curated silver jewellery, selected for eternity.',
    type: 'website',
    locale: 'en_IN',
  },
};

import { AuthProvider } from '@/lib/useAuth';
import LayoutWrapper from '@/components/LayoutWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-inter">
        {/* Razorpay SDK — loaded once for the whole app */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

