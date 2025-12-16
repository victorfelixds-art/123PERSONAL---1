import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Clock } from 'lucide-react'

export default function AccountPending() {
  const { signOut } = useAuth()

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <CardTitle>Aprovação Pendente</CardTitle>
          <CardDescription>
            Sua conta está aguardando aprovação. Você receberá um email assim
            que o acesso for liberado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => signOut()}>
            Voltar para o Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
