import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Sidebar'
import { BottomNav } from '@/components/BottomNav'
import { Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6 bg-muted/10">
          <Outlet />
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
