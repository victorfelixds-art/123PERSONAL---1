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

  // Check profile status
  if (profile) {
    if (profile.status === 'PENDENTE') {
      return <Navigate to="/pending" replace />
    }
    if (profile.status === 'INATIVO') {
      return <Navigate to="/inactive" replace />
    }
    // If ATIVO (or undefined, assuming active if not blocked), allow access
  } else {
    // If session exists but no profile yet, it might be loading or error.
    // We can show a loader or redirect to an error page.
    // For now, let's keep showing loader if profile is crucial for the app.
    // However, if we just registered, profile might be created async.
    // Ideally useAuth loading handles this, but useAuth loading is false after session check.
    // We can show a skeleton or just wait.
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <Outlet />
}
