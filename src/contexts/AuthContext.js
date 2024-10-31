
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  // Mock login function with password validation
  const login = (username, password) => {
    // Define mock users with passwords
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
      { id: 2, username: 'user1', password: 'user123', role: 'user' },
      { id: 3, username: 'user2', password: 'user123', role: 'user' },
    ];

    // Find user with matching username and password
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setAuthState({
        isAuthenticated: true,
        user: { id: user.id, username: user.username, role: user.role },
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  // Persist auth state using localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('authState');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        // Validate parsedAuth
        if (
          typeof parsedAuth.isAuthenticated === 'boolean' &&
          (parsedAuth.user === null ||
            (typeof parsedAuth.user === 'object' &&
              typeof parsedAuth.user.id === 'number' &&
              typeof parsedAuth.user.username === 'string' &&
              typeof parsedAuth.user.role === 'string'))
        ) {
          setAuthState(parsedAuth);
        }
      } catch (err) {
        console.error('Error parsing authState from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(authState));
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
