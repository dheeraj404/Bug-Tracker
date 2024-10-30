// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { authState } = useContext(AuthContext);
  return authState.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
