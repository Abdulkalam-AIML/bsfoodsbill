import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#060818',
};

export const metadata: Metadata = {
  title: 'BS FOODS Billing System',
  description: 'Smart Billing Experience for Modern Cafes — Powered by NexLayer Private Limited',
  keywords: ['billing', 'POS', 'restaurant', 'cafe', 'BS Foods'],
  authors: [{ name: 'NexLayer Private Limited', url: 'https://nexlayer.in' }],
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-mesh min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(15, 20, 50, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              color: '#f0f4ff',
            },
          }}
        />
      </body>
    </html>
  );
}
