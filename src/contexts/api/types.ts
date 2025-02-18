import type { ReactNode } from 'react'

export interface ApiConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
}

export interface ApiContextType {
  config: ApiConfig
  isLoading: boolean
  error: Error | null
  request: <T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', 
    data?: any
  ) => Promise<T>
  updateConfig: (config: Partial<ApiConfig>) => void
}

export interface ApiProviderProps {
  children: ReactNode
  initialConfig?: Partial<ApiConfig>
}

export interface ApiState {
  config: ApiConfig
  isLoading: boolean
  error: Error | null
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  params?: Record<string, string>
}

export interface ApiErrorResponse {
  status: number
  message: string
  code?: string
}