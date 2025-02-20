export const PRIVY_CONFIG = {
  // Privy App ID from dashboard
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  
  // Configuration for login methods
  loginMethods: ['email', 'wallet'],
  
  // Appearance configuration
  appearance: {
    theme: 'light',
    accentColor: '#4F46E5',
    logo: '/logo.png',
  },

  // Role-based configuration
  defaultRole: 'cashier',
  allowedRoles: ['admin', 'manager', 'cashier'],
}