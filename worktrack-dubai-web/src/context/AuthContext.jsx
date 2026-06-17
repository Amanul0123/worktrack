import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { authService } from '../services/authService';
import { setAccessToken, clearAccessToken } from '../services/apiClient';
import api from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const { data } = await api.get('/me');
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  // Restore session on mount using a bare axios call (bypasses the interceptor)
  // so a missing refresh token cookie never triggers the redirect loop.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(
          '/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        await loadUser();
      } catch {
        // No valid session — show login
      } finally {
        setLoading(false);
      }
    })();
  }, [loadUser]);

  const login = async (credentials) => {
    const { user: u, accessToken } = await authService.login(credentials);
    setAccessToken(accessToken);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const { user: u, accessToken } = await authService.register(data);
    setAccessToken(accessToken);
    setUser(u);
    return u;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    clearAccessToken();
    setUser(null);
  };

  const refreshUser = loadUser;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
