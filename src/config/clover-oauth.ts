export const CLOVER_OAUTH_CONFIG = {
  clientId: process.env.CLOVER_API_KEY as string,
  clientSecret: process.env.CLOVER_API_SECRET as string,
  baseUrl: process.env.CLOVER_API_BASE_URL as string,
  // Scopes needed for the application
  scopes: [
    'INVENTORY_READ',
    'PAYMENTS_READ',
    'PAYMENTS_WRITE',
    'EMPLOYEES_READ',
    'MERCHANT_READ'
  ].join(' '),
  // OAuth endpoints
  authorizationEndpoint: '/oauth/authorize',
  tokenEndpoint: '/oauth/token',
  // Redirect URI for OAuth flow
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/clover/callback`,
} as const;

// Types for OAuth responses
export interface CloverTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  merchant_id: string;
  employee_id?: string;
}

export interface CloverMerchant {
  id: string;
  name: string;
  owner?: {
    id: string;
    email: string;
  };
}