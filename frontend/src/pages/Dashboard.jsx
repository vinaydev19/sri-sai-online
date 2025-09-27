import React from 'react'

function Dashboard() {

  const user = {
    fullName: 'John Doe',
    role: 'admin' // or 'user'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-card border-gray-200 border-1 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your {user?.role === 'admin' ? 'business' : 'work'} today.
        </p>
      </div>
    </div>
  )
}

export default Dashboard