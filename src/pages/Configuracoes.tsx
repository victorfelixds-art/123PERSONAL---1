import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export default function Configuracoes() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as preferências da sua conta e do aplicativo.
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notificações</h3>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Notificações por Email</Label>
            <p className="text-sm text-muted-foreground">
              Receba atualizações sobre seus alunos por email.
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Notificações Push</Label>
            <p className="text-sm text-muted-foreground">
              Receba alertas no dispositivo móvel.
            </p>
          </div>
          <Switch />
        </div>
      </div>

      <div className="space-y-4 pt-6">
        <h3 className="text-lg font-medium">Segurança</h3>
        <div className="grid gap-2">
          <Label htmlFor="current-password">Senha Atual</Label>
          <Input id="current-password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">Nova Senha</Label>
          <Input id="new-password" type="password" />
        </div>
        <Button>Atualizar Senha</Button>
      </div>
    </div>
  )
}
