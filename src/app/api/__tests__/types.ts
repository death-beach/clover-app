// Response Types
export interface StatusResponse {
  status: 'operational' | 'unhealthy' | 'error';
  timestamp: string;
  version: string;
  services: {
    api: 'online' | 'offline';
    supabase: 'online' | 'disconnected' | 'error';
    helius: 'connected' | 'disconnected';
    clover: 'connected' | 'disconnected';
  };
  error?: string;
}

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
}

// Test Helper Types
export interface MockSupabaseClient {
  from: jest.Mock;
  select: jest.Mock;
  limit: jest.Mock;
  data: any;
  error: DatabaseError | null;
}