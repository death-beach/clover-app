"use client";

import { createContext, useContext } from 'react';

interface AuthContextType {
  user: any; // Replace with your User type later
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stub - replace with real auth logic later
  return (
    <AuthContext.Provider value={{
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      logout: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);