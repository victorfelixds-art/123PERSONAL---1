import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { User } from 'lucide-react'

export default function Perfil() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Nome
            </label>
            <p className="text-lg font-medium">
              {profile?.name || 'Carregando...'}
            </p>
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-lg font-medium">
              {profile?.email || 'Carregando...'}
            </p>
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Status da Conta
            </label>
            <p className="text-lg font-medium capitalize">
              {profile?.status?.toLowerCase() || 'Carregando...'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
