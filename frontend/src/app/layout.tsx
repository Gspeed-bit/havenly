import type { Metadata } from 'next';
import React from 'react';
import { Poppins } from 'next/font/google';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: [
    '100',
    '300',
    '400',
    '700',
    '900',
    '100',
    '300',
    '400',
    '700',
    '900',
  ],

  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Havenly | Home',
  description:
    'Discover the best properties, save your favorites, and connect with agents. Havenly is your go-to platform for finding your dream home.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
