import { createContext, useContext } from 'react';

interface ApiContextType {
  request: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
}

const ApiContext = createContext<ApiContextType>({
  request: async () => { throw new Error('API not implemented'); },
});

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const request = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(endpoint, options);
    return response.json();
  };
  return <ApiContext.Provider value={{ request }}>{children}</ApiContext.Provider>;
};

export const useApiContext = () => useContext(ApiContext);