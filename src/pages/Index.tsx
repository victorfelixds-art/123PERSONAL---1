import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export default function Index() {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to="/agenda" replace />
}
