import { 
  useReducer, 
  useCallback, 
  useMemo 
} from 'react'
import axios, { AxiosInstance, AxiosError } from 'axios'

import { ApiContext } from './ApiContext'
import type { 
  ApiProviderProps, 
  ApiState, 
  ApiConfig, 
  ApiRequestOptions 
} from './types'

type ApiAction =
  | { type: 'REQUEST_START' }
  | { type: 'REQUEST_SUCCESS' }
  | { type: 'REQUEST_ERROR'; payload: Error }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ApiConfig> }

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retryAttempts: 3
}

const apiReducer = (state: ApiState, action: ApiAction): ApiState => {
  switch (action.type) {
    case 'REQUEST_START':
      return { ...state, isLoading: true, error: null }
    case 'REQUEST_SUCCESS':
      return { ...state, isLoading: false, error: null }
    case 'REQUEST_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'UPDATE_CONFIG':
      return { 
        ...state, 
        config: { ...state.config, ...action.payload } 
      }
    default:
      return state
  }
}

export const ApiProvider = ({ 
  children, 
  initialConfig = {} 
}: ApiProviderProps) => {
  const [state, dispatch] = useReducer(apiReducer, {
    config: { ...DEFAULT_CONFIG, ...initialConfig },
    isLoading: false,
    error: null
  })

  // Create axios instance with dynamic configuration
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: state.config.baseUrl,
      timeout: state.config.timeout
    })

    // Add request interceptor for global headers, auth, etc.
    instance.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor for global error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log and dispatch errors
        dispatch({ 
          type: 'REQUEST_ERROR', 
          payload: error 
        })
        return Promise.reject(error)
      }
    )

    return instance
  }, [state.config])

  // Generic request method with retry logic
  const request = useCallback(async <T,>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET', 
    data?: any,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    let attempts = 0
    const maxAttempts = state.config.retryAttempts

    while (attempts < maxAttempts) {
      try {
        dispatch({ type: 'REQUEST_START' })

        const response = await axiosInstance.request<T>({
          url: endpoint,
          method,
          data,
          ...options
        })

        dispatch({ type: 'REQUEST_SUCCESS' })
        return response.data
      } catch (error) {
        attempts++

        // If it's the last attempt, throw the error
        if (attempts >= maxAttempts) {
          dispatch({ 
            type: 'REQUEST_ERROR', 
            payload: error instanceof Error 
              ? error 
              : new Error('API request failed') 
          })
          throw error
        }

        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * Math.pow(2, attempts))
        )
      }
    }

    // Fallback error (should never reach here)
    throw new Error('API request failed after max attempts')
  }, [axiosInstance, state.config])

  // Method to update API configuration
  const updateConfig = useCallback((config: Partial<ApiConfig>) => {
    dispatch({ 
      type: 'UPDATE_CONFIG', 
      payload: config 
    })
  }, [])

  // Provide context value
  const value = {
    ...state,
    request,
    updateConfig
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}