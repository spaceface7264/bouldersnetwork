import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaign Landing Page Studio',
  description: 'Generate and publish branded landing pages in minutes.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
