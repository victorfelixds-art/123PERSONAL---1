import { useAuth } from '@/hooks/use-auth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute() {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // If session exists but profile is still loading (auth hook might have session but fetching profile)
  // We can show loader or wait. If profile is null after loading, it means error or no profile.
  if (!profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (profile.status === 'PENDENTE') {
    return <Navigate to="/pending" replace />
  }

  if (profile.status === 'INATIVO') {
    return <Navigate to="/inactive" replace />
  }

  return <Outlet />
}
