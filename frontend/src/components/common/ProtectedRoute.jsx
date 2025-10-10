import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoute() {
  const { user } = useSelector((state) => state.user);

  if (!user) return <Navigate to="/login" />;

  // Allow both admin and employee
  if (user.role === "admin" || user.role === "employee") {
    return <Outlet />;
  }

  // Otherwise redirect
  return <Navigate to="/login" />;
}

export default ProtectedRoute;
