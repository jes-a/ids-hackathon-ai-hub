import type { Metadata } from 'next';
import './globals.scss';
import '@/styles/chat.scss';

export const metadata: Metadata = {
  title: 'Carbon Design System AI Hub',
  description: 'AI-powered documentation assistant for IBM Carbon Design System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
