import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { signIn } from 'next-auth/react'
import axios from 'axios'
import LoginPage from '@/app/(auth)/login/page'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
}))

// Mock window.solana and window.solflare
const mockPhantomWallet = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  isPhantom: true,
  publicKey: { toString: () => 'mock-phantom-public-key' },
}

const mockSolflareWallet = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  publicKey: { toString: () => 'mock-solflare-public-key' },
}

// Mock error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
  </div>
)

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    // Reset window wallet objects
    delete (window as any).solana
    delete (window as any).solflare
    // Reset axios mock
    (axios.get as jest.Mock).mockReset()
  })

  describe('Wallet Connection', () => {
    it('should handle Phantom wallet connection successfully', async () => {
      // Mock Phantom wallet
      ;(window as any).solana = mockPhantomWallet
      mockPhantomWallet.connect.mockResolvedValueOnce({ publicKey: mockPhantomWallet.publicKey })
      ;(axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 })
      ;(signIn as jest.Mock).mockResolvedValueOnce(undefined)

      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      // Find and click Phantom wallet button
      const phantomButton = screen.getByText(/Connect with Phantom/i)
      fireEvent.click(phantomButton)

      await waitFor(() => {
        expect(mockPhantomWallet.connect).toHaveBeenCalled()
        expect(axios.get).toHaveBeenCalled()
        expect(signIn).toHaveBeenCalledWith('credentials', {
          walletAddress: 'mock-phantom-public-key',
          walletProvider: 'phantom',
          callbackUrl: '/dashboard',
          redirect: true,
        })
      })
    })

    it('should handle Solflare wallet connection successfully', async () => {
      // Mock Solflare wallet
      ;(window as any).solflare = mockSolflareWallet
      mockSolflareWallet.connect.mockResolvedValueOnce({ publicKey: mockSolflareWallet.publicKey })
      ;(axios.get as jest.Mock).mockResolvedValueOnce({ status: 200 })
      ;(signIn as jest.Mock).mockResolvedValueOnce(undefined)

      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      // Find and click Solflare wallet button
      const solflareButton = screen.getByText(/Connect with Solflare/i)
      fireEvent.click(solflareButton)

      await waitFor(() => {
        expect(mockSolflareWallet.connect).toHaveBeenCalled()
        expect(axios.get).toHaveBeenCalled()
        expect(signIn).toHaveBeenCalledWith('credentials', {
          walletAddress: 'mock-solflare-public-key',
          walletProvider: 'solflare',
          callbackUrl: '/dashboard',
          redirect: true,
        })
      })
    })

    it('should handle wallet not installed error', async () => {
      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      // Find and click Phantom wallet button
      const phantomButton = screen.getByText(/Connect with Phantom/i)
      fireEvent.click(phantomButton)

      await waitFor(() => {
        expect(screen.getByText('Phantom wallet not installed')).toBeInTheDocument()
      })
    })

    it('should handle Helius verification failure', async () => {
      // Mock Phantom wallet
      ;(window as any).solana = mockPhantomWallet
      mockPhantomWallet.connect.mockResolvedValueOnce({ publicKey: mockPhantomWallet.publicKey })
      ;(axios.get as jest.Mock).mockResolvedValueOnce({ status: 400 })

      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      // Find and click Phantom wallet button
      const phantomButton = screen.getByText(/Connect with Phantom/i)
      fireEvent.click(phantomButton)

      await waitFor(() => {
        expect(screen.getByText('Wallet verification failed')).toBeInTheDocument()
      })
    })
  })

  describe('Email Login', () => {
    it('should handle email login successfully', async () => {
      ;(signIn as jest.Mock).mockResolvedValueOnce(undefined)

      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      // Find and click email login button
      const emailButton = screen.getByText(/Continue with Email/i)
      fireEvent.click(emailButton)

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith('email', {
          callbackUrl: '/dashboard',
          redirect: true,
        })
      })
    })

    it('should handle email login error', async () => {
      const errorMessage = 'Email login failed'
      ;(signIn as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      // Find and click email login button
      const emailButton = screen.getByText(/Continue with Email/i)
      fireEvent.click(emailButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })
  })

  describe('UI Elements', () => {
    it('should render all login options', () => {
      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Connect with Phantom/i)).toBeInTheDocument()
      expect(screen.getByText(/Connect with Solflare/i)).toBeInTheDocument()
      expect(screen.getByText(/Continue with Email/i)).toBeInTheDocument()
    })

    it('should show loading state during wallet connection', async () => {
      // Mock Phantom wallet
      ;(window as any).solana = mockPhantomWallet
      // Make the connection hang
      mockPhantomWallet.connect.mockImplementation(() => new Promise(() => {}))

      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoginPage />
        </ErrorBoundary>
      )

      // Find and click Phantom wallet button
      const phantomButton = screen.getByText(/Connect with Phantom/i)
      fireEvent.click(phantomButton)

      await waitFor(() => {
        expect(screen.getByText('Connecting...')).toBeInTheDocument()
      })
    })
  })
})