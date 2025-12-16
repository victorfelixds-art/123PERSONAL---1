import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If user is logged in but profile hasn't loaded yet (rare race condition or error)
  // We can show loading or let it fail gracefully. Assuming profile loads fast or effectively with auth.
  if (!profile) {
    // Trying to fetch profile or waiting
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Status Checks
  if (profile.status === 'PENDENTE') {
    return <Navigate to="/account/pending" replace />
  }

  if (profile.status === 'INATIVO') {
    return <Navigate to="/account/inactive" replace />
  }

  return <>{children}</>
}
