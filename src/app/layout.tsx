import { PrivyProvider } from '@/providers/PrivyProvider';
import { CloverSessionProvider } from '@/providers/CloverSessionProvider';
import { ApiProvider } from '@/contexts/api/ApiContext';
import { AuthProvider } from '@/contexts/auth/AuthContext'; // Add this

export const metadata = {
  title: 'USDC Payment Gateway',
  description: 'Solana-based USDC Payment Gateway for Clover Merchants',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider>
          <CloverSessionProvider>
            <ApiProvider>
              <AuthProvider>{children}</AuthProvider>
            </ApiProvider>
          </CloverSessionProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}