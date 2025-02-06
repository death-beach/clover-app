'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { type PropsWithChildren } from 'react'

const PRIVY_APP_ID = 'cm5yjbh8z01lv6heoze3v3ep5'
const CLIENT_ID = 'client-WY5fRbUUsnYnSBnU7hp47apYGAdUgABi38uhK4PxBYLpx'

export function PrivyWrapper({ children }: PropsWithChildren) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId={CLIENT_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#FF5F7A',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
