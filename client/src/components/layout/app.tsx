import React from 'react'
import Header from '../templates/header'
import Sidebar from '../templates/sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout