import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

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
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider value={defaultSystem}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <AppLayout>
              {children}
            </AppLayout>
          </ThemeProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}