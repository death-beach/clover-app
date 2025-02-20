import { PrivyProvider } from '@/providers/PrivyProvider'
import { CloverSessionProvider } from '@/providers/CloverSessionProvider'
import { type PropsWithChildren } from 'react'
import './globals.css'

export const metadata = {
  title: 'USDC Payment Gateway',
  description: 'Solana-based USDC Payment Gateway for Clover Merchants',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider>
          <CloverSessionProvider>
            {children}
          </CloverSessionProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}