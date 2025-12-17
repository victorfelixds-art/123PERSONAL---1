import { Outlet } from 'react-router-dom'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Sidebar } from '@/components/Sidebar'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'
import { Separator } from '@/components/ui/separator'
import { useEffect } from 'react'

export default function Layout() {
  const { profile } = useAuth()
  const { setUserProfile, userProfile } = useAppStore()

  useEffect(() => {
    if (profile && JSON.stringify(profile) !== JSON.stringify(userProfile)) {
      setUserProfile(profile)
    }
  }, [profile, setUserProfile, userProfile])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
