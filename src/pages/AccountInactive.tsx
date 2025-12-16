import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Ban, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AccountInactive() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <Card className="w-full max-w-md text-center border-l-4 border-l-destructive shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
            <Ban className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Conta Desativada
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Sua conta foi desativada. Entre em contato com o suporte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
