'use client'

import { PrivyWrapper } from '@/lib/privy/provider'
import { type PropsWithChildren } from 'react'
import './globals.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <PrivyWrapper>{children}</PrivyWrapper>
      </body>
    </html>
  )
}
