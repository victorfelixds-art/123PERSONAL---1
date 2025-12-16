import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { BottomNav } from '@/components/BottomNav'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex w-full flex-col">
          <header className="flex h-14 items-center gap-2 border-b bg-background px-4 lg:h-[60px]">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <span className="font-semibold">Meu Personal</span>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 mb-16 md:mb-0">
            <Outlet />
          </main>
        </SidebarInset>
        <BottomNav />
      </div>
    </SidebarProvider>
  )
}
