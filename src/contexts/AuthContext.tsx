import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  name: string;
  id_personnel_perso: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (id_personnel_perso: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token'
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(TOKEN_KEYS.ACCESS);
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user data here
    }
  }, []);

  // Token management methods
  const getAccessToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
  };

  const getRefreshToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
  };

  const setTokens = (access: string, refresh: string): void => {
    localStorage.setItem(TOKEN_KEYS.ACCESS, access);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
  };

  const clearTokens = (): void => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  };

  const login = async (id_personnel_perso: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ id_personnel_perso, password });
      if (response.access && response.refresh) {
        setTokens(response.access, response.refresh);
        setIsAuthenticated(true);
        setUser({ name: response.user?.name || 'User', id_personnel_perso });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const response = await authService.loginWithGoogle();
      if (response.access && response.refresh) {
        setTokens(response.access, response.refresh);
        setIsAuthenticated(true);
        setUser({ name: response.user?.name || 'Google User', id_personnel_perso: response.user?.id_personnel_perso || '' });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = (): void => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      loginWithGoogle, 
      logout,
      getAccessToken,
      getRefreshToken,
      setTokens,
      clearTokens
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};