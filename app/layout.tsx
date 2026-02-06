import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechVault - Product Browser',
  description: 'A headless WooCommerce product browser built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-100 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>TechVault - Headless WooCommerce Demo</p>
              <p className="text-sm mt-1">
                Built with Next.js + WordPress REST API
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
