import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('sa_token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sa_user'));
    } catch {
      return null;
    }
  });

  const loginUser = (token, userData) => {
    localStorage.setItem('sa_token', token);
    localStorage.setItem('sa_user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loginUser, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
