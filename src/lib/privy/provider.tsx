'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { type PropsWithChildren } from 'react'

export function PrivyWrapper({ children }: PropsWithChildren) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          showWalletLoginFirst: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}