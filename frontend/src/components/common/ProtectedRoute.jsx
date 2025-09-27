import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

function ProtectedRoute() {
  const user = {
    role: 'admin'
  }

  return user.role === "admin" ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute
