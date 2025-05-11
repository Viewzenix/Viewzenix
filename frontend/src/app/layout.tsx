import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChakraProvider } from '@/components/providers/ChakraProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Viewzenix - Trading Webhook Platform',
  description: 'Connect TradingView alerts to broker APIs for automated trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="hydrated">
      <body className={inter.className} data-cz-shortcut-listen="true">
        <ChakraProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </ChakraProvider>
      </body>
    </html>
  )
}