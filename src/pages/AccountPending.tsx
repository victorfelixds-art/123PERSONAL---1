import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <Card className="w-full max-w-md text-center border-l-4 border-l-yellow-500 shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-yellow-500/10 p-4 rounded-full w-fit mb-4">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Conta em Análise</CardTitle>
          <CardDescription className="text-base mt-2">
            Sua conta foi criada com sucesso e está aguardando aprovação do
            administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Você receberá uma notificação assim que seu acesso for liberado.
          </p>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
