import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const Configuracoes = () => {
  const { settings, updateSettings, updateTheme } = useAppStore()

  const handleToggle = (key: keyof typeof settings.notifications) => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    })
    toast.success('Configuração atualizada')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Geral</CardTitle>
            <CardDescription>
              Preferências de exibição e idioma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Idioma</Label>
                <p className="text-sm text-muted-foreground">
                  Idioma da interface.
                </p>
              </div>
              <Select defaultValue="pt-BR" disabled>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tema</Label>
                <p className="text-sm text-muted-foreground">
                  Alternar entre modo claro e escuro.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.theme === 'dark'}
                  onCheckedChange={(checked) =>
                    updateTheme(checked ? 'dark' : 'light')
                  }
                />
                <Label>{settings.theme === 'dark' ? 'Escuro' : 'Claro'}</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie seus alertas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Treino</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações sobre treinos agendados.
                </p>
              </div>
              <Switch
                checked={settings.notifications.workouts}
                onCheckedChange={() => handleToggle('workouts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pagamentos</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas sobre vencimentos e pagamentos.
                </p>
              </div>
              <Switch
                checked={settings.notifications.payments}
                onCheckedChange={() => handleToggle('payments')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mensagens</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar novas mensagens de alunos.
                </p>
              </div>
              <Switch
                checked={settings.notifications.messages}
                onCheckedChange={() => handleToggle('messages')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Versão 0.0.1</p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-primary hover:underline">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-primary hover:underline">
                Política de Privacidade
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Configuracoes
