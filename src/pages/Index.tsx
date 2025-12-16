import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'
import { Loader2 } from 'lucide-react'

export default function Index() {
  const { user, loading } = useAuth()
  const { userProfile, isLoadingProfile } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login')
      } else if (!isLoadingProfile && userProfile) {
        if (userProfile.role === 'ADMIN') {
          navigate('/admin/dashboard')
        } else {
          navigate('/students')
        }
      }
    }
  }, [user, loading, userProfile, isLoadingProfile, navigate])

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
