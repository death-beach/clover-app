'use client'

import { PrivyWrapper } from '@/lib/privy/provider'

export function PrivyClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <PrivyWrapper>{children}</PrivyWrapper>
}