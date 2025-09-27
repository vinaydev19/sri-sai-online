import ProtectedRoute from '@/components/common/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Customers from '@/pages/Customers'
import Dashboard from '@/pages/Dashboard'
import { Login } from '@/pages/Login'
import Profile from '@/pages/Profile'
import { Register } from '@/pages/Register'
import Services from '@/pages/Services'
import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

function Body() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='profile' element={<Profile />} />
            <Route path='services' element={<Services />} />
            <Route path='customers' element={<Customers />} />
          </Route>
        </Route>
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default Body
