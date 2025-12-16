import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Sidebar } from '@/components/Sidebar'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import useAppStore from '@/stores/useAppStore'
import { UserProfile } from '@/lib/types'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

export default function Layout() {
  const { user, session, loading } = useAuth()
  const { setUserProfile, userProfile } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login')
    }
  }, [session, loading, navigate])

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('users_profile')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) throw error
          if (data) setUserProfile(data as UserProfile)
        } catch (error) {
          console.error('Error fetching profile:', error)
          toast.error('Erro ao carregar perfil')
        }
      }
    }

    if (user && !userProfile) {
      fetchProfile()
    }
  }, [user, userProfile, setUserProfile])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
