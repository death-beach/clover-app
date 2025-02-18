import { render as rtlRender } from '@testing-library/react'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import type { ErrorFallbackProps } from '@/components/error/ErrorBoundary'

// Mock error fallback component
export const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
  </div>
)

// Custom render function that includes error boundary
export function render(ui: React.ReactElement) {
  return rtlRender(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {ui}
    </ErrorBoundary>
  )
}

// Re-export everything
export * from '@testing-library/react'