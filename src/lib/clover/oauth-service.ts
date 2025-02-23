import { CLOVER_OAUTH_CONFIG, type CloverTokenResponse } from '@/config/clover-oauth';

export class CloverOAuthService {
  // Generate the OAuth authorization URL
  static getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: CLOVER_OAUTH_CONFIG.clientId,
      response_type: 'code',
      scope: CLOVER_OAUTH_CONFIG.scopes,
      state,
      redirect_uri: CLOVER_OAUTH_CONFIG.redirectUri,
    });

    return `${CLOVER_OAUTH_CONFIG.baseUrl}${CLOVER_OAUTH_CONFIG.authorizationEndpoint}?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  static async exchangeCodeForTokens(code: string): Promise<CloverTokenResponse> {
    const params = new URLSearchParams({
      client_id: CLOVER_OAUTH_CONFIG.clientId,
      client_secret: CLOVER_OAUTH_CONFIG.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: CLOVER_OAUTH_CONFIG.redirectUri,
    });

    const response = await fetch(`${CLOVER_OAUTH_CONFIG.baseUrl}${CLOVER_OAUTH_CONFIG.tokenEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    console.log('Raw Clover Response:', JSON.stringify(data, null, 2)); // Debug

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return data;
  }

  // Refresh access token using refresh token
  static async refreshAccessToken(refreshToken: string): Promise<CloverTokenResponse> {
    const params = new URLSearchParams({
      client_id: CLOVER_OAUTH_CONFIG.clientId,
      client_secret: CLOVER_OAUTH_CONFIG.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const response = await fetch(`${CLOVER_OAUTH_CONFIG.baseUrl}${CLOVER_OAUTH_CONFIG.tokenEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return response.json();
  }
}