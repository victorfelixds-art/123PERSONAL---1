import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Clock, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AccountPending() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4 animate-fade-in">
      <Card className="w-full max-w-md text-center shadow-lg border-yellow-500/20">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
          <CardTitle className="text-xl">Conta em Análise</CardTitle>
          <CardDescription className="text-base mt-2">
            Sua conta foi criada com sucesso e está aguardando aprovação do
            administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair da aplicação
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
