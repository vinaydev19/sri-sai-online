import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div>
      <h2>DashboardLayout</h2>
      <Sidebar />
      <Navbar />
      <div>
        <Outlet /> {/* This renders Dashboard, Profile, Services, Customers */}
      </div>
    </div>
  )
}

export default DashboardLayout
