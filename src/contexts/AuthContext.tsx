import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import { personnelService } from '../services/personnelService';
import { Personnel } from '../types/entities';

interface TokenPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  personnel: Personnel;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: Personnel | null;
  login: (id_personnel_perso: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
  fetchUserData: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(TOKEN_KEYS.ACCESS);
  });
  const [user, setUser] = useState<Personnel | null>(null);

  // Decode token to get user_id only
  const getUserIdFromToken = (token: string): number | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decodedPayload = atob(paddedPayload);
      const tokenData = JSON.parse(decodedPayload) as TokenPayload;
      
      return tokenData.user_id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Fetch user data from API
  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
      if (!token) {
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        console.error('No user ID found in token');
        return;
      }

      const personnel = await personnelService.getById(userId);
      if (personnel) {
        setUser(personnel);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't logout on error, just keep user as null
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    if (token) {
      setIsAuthenticated(true);
      fetchUserData();
    }
  }, [fetchUserData]);

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

  const login = async (
    id_personnel_perso: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authService.login({ id_personnel_perso, password });
      if (response.access && response.refresh) {
        setTokens(response.access, response.refresh);
        setIsAuthenticated(true);
        await fetchUserData();
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
        await fetchUserData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      return false;
    }
  };

  const logout = (): void => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginWithGoogle,
        logout,
        getAccessToken,
        getRefreshToken,
        setTokens,
        clearTokens,
        fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
