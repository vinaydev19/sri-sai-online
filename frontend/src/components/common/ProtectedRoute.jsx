import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function ProtectedRoute() {
  const { user } = useSelector((state) => state.user)

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin" ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute
