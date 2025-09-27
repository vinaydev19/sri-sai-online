import ProtectedRoute from '@/components/layout/ProtectedRoute'
import Home from '@/pages/Home'
import { Login } from '@/pages/Login'
import MainLayout from '@/pages/MainLayout'
import { Register } from '@/pages/Register'
import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

function Body() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        <Route path='' element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='' element={<Home />} />
          </Route>
        </Route>
      </>
    )
  )
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default Body