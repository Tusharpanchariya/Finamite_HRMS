import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null, token?: string, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Checks both localStorage (for "Remember Me") and sessionStorage (for a single session)
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUserState(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Updated setUser function to handle the rememberMe boolean
  const setUser = (newUser: User | null, newToken?: string, rememberMe = false) => {
    setUserState(newUser);
    
    if (newUser && newToken) {
      setToken(newToken);
      // Use localStorage for "Remember Me", otherwise use sessionStorage
      if (rememberMe) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        sessionStorage.removeItem('token'); // Clear sessionStorage if localStorage is used
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('user', JSON.stringify(newUser));
        localStorage.removeItem('token'); // Clear localStorage if sessionStorage is used
        localStorage.removeItem('user');
      }
    } else {
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
