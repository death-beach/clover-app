import { useState, useCallback } from 'react'
import { useApiContext } from '@/contexts/api/ApiContext'

export const useApiRequest = <T,>(endpoint: string) => {
  const { request } = useApiContext()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET', 
    body?: any
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await request<T>(endpoint, method, body)
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('An unknown error occurred')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, request])

  return { data, isLoading, error, fetch }
}