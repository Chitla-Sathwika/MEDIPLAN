import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  language: 'en' | 'hi' | 'te';
  theme: 'light' | 'dark';
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPreferences: (updates: { name?: string; password?: string; language?: 'en' | 'hi' | 'te'; theme?: 'light' | 'dark' }) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { setLanguage } = useLanguage();
  const { setTheme } = useTheme();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser) as UserProfile;
          setUser(parsedUser);
          
          // Sync language and theme contexts with profile settings
          if (parsedUser.language) setLanguage(parsedUser.language);
          if (parsedUser.theme) setTheme(parsedUser.theme);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [setLanguage, setTheme]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);

      if (receivedUser.language) setLanguage(receivedUser.language);
      if (receivedUser.theme) setTheme(receivedUser.theme);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      if (receivedUser.language) setLanguage(receivedUser.language);
      if (receivedUser.theme) setTheme(receivedUser.theme);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUserPreferences = async (updates: { name?: string; password?: string; language?: 'en' | 'hi' | 'te'; theme?: 'light' | 'dark' }) => {
    if (!token) return;

    try {
      const response = await api.put('/auth/profile', updates);
      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (updates.language) setLanguage(updates.language);
      if (updates.theme) setTheme(updates.theme);
    } catch (error) {
      console.error('Error updating profile preferences:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUserPreferences,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
