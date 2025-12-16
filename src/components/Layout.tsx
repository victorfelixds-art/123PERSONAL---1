import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { BottomNav } from '@/components/BottomNav'

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full bg-background font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-64 relative">
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
