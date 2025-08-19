import React, { createContext, useContext, useState, ReactNode } from 'react';
import { instance } from '../axios';

interface User {
  name: string;
  id_personnel_perso: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (id_personnel_perso: string, password: string): Promise<any> => {
    const data = {
      id_personnel_perso : id_personnel_perso,
      password : password,
    }
    try {
      const res = await instance.post('token/', data)
      if (res){
        localStorage.setItem('loggedUser', res.data)
        setIsAuthenticated(true);
        setUser({ name: 'Admin User', id_personnel_perso });
        return true
      }
    } catch (error) {
      return false ;
    }
    // // Simulation d'une authentification
    // if (email === 'admin@example.com' && password === 'password') {
    //   setIsAuthenticated(true);
    //   setUser({ name: 'Admin User', email });
    //   return true;
    // }
    // return false;
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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