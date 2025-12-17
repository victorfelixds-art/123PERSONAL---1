import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function Index() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login')
      } else if (profile) {
        if (profile.role === 'ADMIN') {
          navigate('/admin/dashboard')
        } else if (profile.status === 'ATIVO') {
          navigate('/students')
        }
        // If status is PENDENTE or INATIVO, ProtectedRoute handles redirection
      }
    }
  }, [user, loading, profile, navigate])

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
