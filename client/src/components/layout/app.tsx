import React from 'react'
import Header from '../templates/header'
import Sidebar from '../templates/sidebar'
import ProtectedRoute from '../templates/ProtectedRoute'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="w-full flex-1 overflow-hidden">
          <Header />
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardLayout