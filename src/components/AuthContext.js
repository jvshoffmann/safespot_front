import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const setAuthData = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
  };

  const clearAuthData = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
