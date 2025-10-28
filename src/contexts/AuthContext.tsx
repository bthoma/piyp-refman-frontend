import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthState, SignupData, LoginData, ProfileUpdate } from '../types/auth.types';
import { authApi } from '../services/api';
import { tokenStorage } from '../utils/tokenStorage';

interface AuthContextType extends AuthState {
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false,
  });

  // Initialize: Check for existing tokens and fetch user
  useEffect(() => {
    const initAuth = async () => {
      if (tokenStorage.hasTokens()) {
        try {
          const userData = await authApi.getCurrentUser();
          setState({
            user: { id: userData.user.id, email: userData.user.email },
            profile: userData.user,
            loading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          tokenStorage.clearTokens();
          setState({ user: null, profile: null, loading: false, isAuthenticated: false });
        }
      } else {
        setState({ user: null, profile: null, loading: false, isAuthenticated: false });
      }
    };

    initAuth();
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    const response = await authApi.signup(data);
    tokenStorage.setTokens(response.session.access_token, response.session.refresh_token);
    setState({
      user: { id: response.user.id, email: response.user.email },
      profile: response.user.profile,
      loading: false,
      isAuthenticated: true,
    });
  }, []);

  const login = useCallback(async (data: LoginData) => {
    const response = await authApi.login(data);
    tokenStorage.setTokens(response.session.access_token, response.session.refresh_token);
    setState({
      user: { id: response.user.id, email: response.user.email },
      profile: response.user.profile,
      loading: false,
      isAuthenticated: true,
    });
  }, []);

  const loginWithGoogle = useCallback(() => {
    authApi.initiateGoogleAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenStorage.clearTokens();
      setState({ user: null, profile: null, loading: false, isAuthenticated: false });
    }
  }, []);

  const updateProfile = useCallback(async (updates: ProfileUpdate) => {
    const response = await authApi.updateProfile(updates);
    setState((prev) => ({
      ...prev,
      profile: response.profile,
    }));
  }, []);

  const refreshUser = useCallback(async () => {
    const userData = await authApi.getCurrentUser();
    setState((prev) => ({
      ...prev,
      user: { id: userData.user.id, email: userData.user.email },
      profile: userData.user,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
