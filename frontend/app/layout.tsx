'use client';

import { Providers } from './providers';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { MainLayout } from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

// Pages that don't use the main layout (authentication pages, etc.)
const nonLayoutPages = ['/login', '/signup', '/reset-password'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNonLayoutPage = nonLayoutPages.includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {isNonLayoutPage ? (
            children
          ) : (
            <MainLayout>
              {children}
            </MainLayout>
          )}
        </Providers>
      </body>
    </html>
  );
}