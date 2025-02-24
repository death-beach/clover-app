'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CloverSession {
  merchantId: string | null;
  employeeId: string | null;
  role: string | null;
  employee: any | null; // Add this - stub for now
  isAuthenticated: boolean;
}

interface CloverContextType {
  session: CloverSession;
  updateSession: (session: Partial<CloverSession>) => void;
  clearSession: () => void;
}

const CloverContext = createContext<CloverContextType | undefined>(undefined);

export function useCloverSession() {
  const context = useContext(CloverContext);
  if (context === undefined) {
    throw new Error('useCloverSession must be used within a CloverSessionProvider');
  }
  return context;
}

export function CloverSessionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter();
  const [session, setSession] = useState<CloverSession>({
    merchantId: null,
    employeeId: null,
    role: null,
    employee: null, // Add this
    isAuthenticated: false
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.merchantId) {
            setSession({
              merchantId: data.merchantId,
              employeeId: data.employeeId,
              role: data.role,
              employee: data.employee || null, // Add this if API provides it
              isAuthenticated: true
            });
          }
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      }
    };

    checkSession();
  }, []);

  const updateSession = (newSession: Partial<CloverSession>) => {
    setSession(prev => ({
      ...prev,
      ...newSession
    }));
  };

  const clearSession = () => {
    setSession({
      merchantId: null,
      employeeId: null,
      role: null,
      employee: null, // Add this
      isAuthenticated: false
    });
    router.push('/auth/login');
  };

  return (
    <CloverContext.Provider value={{ session, updateSession, clearSession }}>
      {children}
    </CloverContext.Provider>
  );
}

export default CloverSessionProvider;