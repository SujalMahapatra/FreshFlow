import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a previously stored token represents a valid logged-in session
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    const response = await API.post('/auth/register', userData);

    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);

    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to authentication state
export const useAuth = () => {
  return useContext(AuthContext);
};