import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'

export const ProtectedAdminRoute = () => {
  const { user, loading } = useAuth()
  const { userProfile, isLoadingProfile } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Wait for profile to load before checking role
  // We can skip this if we want fast fail, but profile might be loading

  if (loading) return null

  // If we have user but no profile yet, render nothing or spinner
  // Assuming Layout fetches profile

  if (user && userProfile) {
    if (userProfile.role !== 'ADMIN') {
      // Redirect to home or 403
      // Using simple useEffect for redirect might flicker, so render null and navigate
      return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      )
    }
  }

  return <Outlet />
}
