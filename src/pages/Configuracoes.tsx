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
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Plan, AppTheme } from '@/lib/types'
import { Trash2, Edit, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const Configuracoes = () => {
  const {
    settings,
    updateSettings,
    updateTheme,
    plans,
    addPlan,
    updatePlan,
    removePlan,
  } = useAppStore()
  const [msgTemplate, setMsgTemplate] = useState(
    settings.whatsappMessageTemplate || '',
  )
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Partial<Plan>>({})

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

  const handleSaveMsg = () => {
    updateSettings({
      ...settings,
      whatsappMessageTemplate: msgTemplate,
    })
    toast.success('Modelo de mensagem salvo!')
  }

  const handleSavePlan = () => {
    if (
      !editingPlan.name ||
      !editingPlan.value ||
      !editingPlan.durationInMonths
    ) {
      toast.error('Preencha todos os campos do plano')
      return
    }

    if (editingPlan.id) {
      updatePlan(editingPlan as Plan)
      toast.success('Modelo de plano atualizado')
    } else {
      addPlan({
        ...editingPlan,
        id: Math.random().toString(36).substr(2, 9),
      } as Plan)
      toast.success('Modelo de plano criado')
    }
    setIsPlanDialogOpen(false)
  }

  const openPlanDialog = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan)
    } else {
      setEditingPlan({ name: '', value: 0, durationInMonths: 1 })
    }
    setIsPlanDialogOpen(true)
  }

  const themes: { id: AppTheme; label: string; previewClass: string }[] = [
    {
      id: 'dark-performance',
      label: 'Dark Performance (Nike Style)',
      previewClass: 'bg-[#0B0B0B] border-[#1A1A1A]',
    },
    {
      id: 'light-performance',
      label: 'Light Performance (High Contrast)',
      previewClass: 'bg-[#121212] border-[#2A2A2A]',
    },
    {
      id: 'performance-blue',
      label: 'Performance Blue (Tech)',
      previewClass: 'bg-[#0E1625] border-[#1C2740]',
    },
  ]

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight uppercase">
        Configurações
      </h1>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-4">
          <TabsTrigger value="geral">Aparência</TabsTrigger>
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Tema do Aplicativo</CardTitle>
              <CardDescription>
                Escolha a identidade visual que melhor se adapta ao seu estilo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateTheme(theme.id)}
                    className={cn(
                      'relative flex flex-col items-center gap-3 p-2 rounded-2xl border-2 transition-all group',
                      settings.theme === theme.id
                        ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                        : 'border-transparent hover:border-muted-foreground/20',
                    )}
                  >
                    <div
                      className={cn(
                        'w-full aspect-video rounded-xl shadow-lg flex items-center justify-center border-2 border-border/10',
                        theme.previewClass,
                      )}
                    >
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                        <div className="w-16 h-8 rounded-md bg-muted/20"></div>
                      </div>
                      {settings.theme === theme.id && (
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1.5 shadow-xl animate-in zoom-in">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold">{theme.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Modelos de Planos</CardTitle>
                <CardDescription>Templates para venda.</CardDescription>
              </div>
              <Button onClick={() => openPlanDialog()}>
                <Plus className="mr-2 h-4 w-4" /> Novo Modelo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-xl">
                    Nenhum modelo cadastrado.
                  </p>
                ) : (
                  plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-6 border rounded-xl bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-lg">{plan.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {plan.durationInMonths} meses • R$ {plan.value}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openPlanDialog(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Padrão</CardTitle>
              <CardDescription>
                Configure a mensagem automática.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Textarea
                  value={msgTemplate}
                  onChange={(e) => setMsgTemplate(e.target.value)}
                  placeholder="Digite sua mensagem padrão..."
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground font-medium">
                  Variáveis: {'{studentName}'}, {'{personalName}'}
                </p>
              </div>
              <Button onClick={handleSaveMsg}>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Alerta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Treinos</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre vencimentos de treino.
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.workouts}
                  onCheckedChange={() => handleToggle('workouts')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Financeiro</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre pagamentos pendentes.
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.payments}
                  onCheckedChange={() => handleToggle('payments')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Mensagens</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações de novas interações.
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.messages}
                  onCheckedChange={() => handleToggle('messages')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlan.id ? 'Editar Modelo' : 'Novo Modelo'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Nome do Modelo</Label>
              <Input
                value={editingPlan.name || ''}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, name: e.target.value })
                }
                placeholder="Ex: Semestral"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Valor Sugerido (R$)</Label>
                <Input
                  type="number"
                  value={editingPlan.value || ''}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      value: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Duração (Meses)</Label>
                <Input
                  type="number"
                  value={editingPlan.durationInMonths || ''}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      durationInMonths: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={handleSavePlan} className="w-full">
              Salvar Modelo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Configuracoes
