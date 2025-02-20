import { CLOVER_ROLES, type CloverRole } from '@/config/clover-roles';
import { CloverOAuthService } from './oauth-service';
import { cookies } from 'next/headers';

const CLOVER_API_BASE_URL = `${process.env.CLOVER_API_BASE_URL}/v3`;

interface CloverAPIError extends Error {
  status?: number;
  code?: string;
}

interface CloverEmployee {
  id: string;
  name: string;
  role: string;
  merchant: {
    id: string;
  };
}

// Map Clover API roles to our system roles
const CLOVER_API_ROLE_MAP: Record<string, CloverRole> = {
  OWNER: CLOVER_ROLES.OWNER,
  ADMIN: CLOVER_ROLES.ADMIN,
  MANAGER: CLOVER_ROLES.MANAGER,
  EMPLOYEE: CLOVER_ROLES.EMPLOYEE,
};

export class CloverAPIClient {
  private merchantId: string;
  private accessToken: string;
  private refreshToken: string;

  constructor(merchantId: string, accessToken: string, refreshToken: string) {
    this.merchantId = merchantId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private async refreshTokenIfNeeded() {
    try {
      const response = await CloverOAuthService.refreshAccessToken(this.refreshToken);
      this.accessToken = response.access_token;
      this.refreshToken = response.refresh_token;
      
      // Update cookies with new tokens
      const cookieStore = cookies();
      cookieStore.set('clover_access_token', response.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: response.expires_in,
      });
      cookieStore.set('clover_refresh_token', response.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${CLOVER_API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshTokenIfNeeded();
        
        // Retry the request with new token
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!retryResponse.ok) {
          throw new Error('Request failed after token refresh');
        }

        return retryResponse.json();
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ... rest of the methods remain the same ...
}

  async getCurrentEmployee(employeeId: string) {
    try {
      const employee = await this.fetch<CloverEmployee>(
        `/merchants/${this.merchantId}/employees/${employeeId}`
      );

      return {
        id: employee.id,
        name: employee.name,
        role: CLOVER_API_ROLE_MAP[employee.role] || CLOVER_ROLES.EMPLOYEE,
        merchantId: employee.merchant.id,
      };
    } catch (error) {
      console.error('Error fetching employee from Clover:', error);
      throw error;
    }
  }

  async validateSession() {
    try {
      // Attempt to fetch merchant info to validate the session
      await this.fetch(`/merchants/${this.merchantId}`);
      return true;
    } catch (error) {
      console.error('Error validating Clover session:', error);
      return false;
    }
  }
}

// Create a singleton instance for the current merchant
let apiClientInstance: CloverAPIClient | null = null;

export function getCloverAPIClient() {
  const cookieStore = cookies();
  const merchantId = cookieStore.get('clover_merchant_id')?.value;
  const accessToken = cookieStore.get('clover_access_token')?.value;
  const refreshToken = cookieStore.get('clover_refresh_token')?.value;

  if (!merchantId || !accessToken || !refreshToken) {
    throw new Error('Missing Clover credentials');
  }

  if (!apiClientInstance) {
    apiClientInstance = new CloverAPIClient(merchantId, accessToken, refreshToken);
  }

  return apiClientInstance;
}