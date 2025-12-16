import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Lock } from 'lucide-react'

export default function AccountInactive() {
  const { signOut } = useAuth()

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Conta Inativa</CardTitle>
          <CardDescription>
            Sua conta está inativa no momento. Entre em contato com o suporte
            para mais informações.
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
