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
import { Plan } from '@/lib/types'
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
    updateThemeColor,
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

    // Plans here are templates only - no financial entry created
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

  const colors = [
    { name: 'blue', label: 'Azul', class: 'bg-blue-600' },
    { name: 'green', label: 'Verde', class: 'bg-emerald-600' },
    { name: 'orange', label: 'Laranja', class: 'bg-orange-500' },
    { name: 'purple', label: 'Roxo', class: 'bg-violet-600' },
    { name: 'red', label: 'Vermelho', class: 'bg-red-600' },
  ] as const

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="planos">Modelos de Planos</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize o tema do app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Alternar entre claro e escuro.
                  </p>
                </div>
                <Switch
                  checked={settings.theme === 'dark'}
                  onCheckedChange={(checked) =>
                    updateTheme(checked ? 'dark' : 'light')
                  }
                />
              </div>

              <div className="space-y-3">
                <Label>Cor do Tema</Label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => updateThemeColor(color.name)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all flex items-center justify-center ring-offset-2 ring-offset-background',
                        color.class,
                        settings.themeColor === color.name
                          ? 'ring-2 ring-primary scale-110'
                          : 'hover:scale-105 opacity-80 hover:opacity-100',
                      )}
                      title={color.label}
                    >
                      {settings.themeColor === color.name && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Modelos de Planos</CardTitle>
                <CardDescription>
                  Defina os modelos de planos para agilizar a atribuição aos
                  alunos. (Apenas Templates)
                </CardDescription>
              </div>
              <Button onClick={() => openPlanDialog()}>
                <Plus className="mr-2 h-4 w-4" /> Novo Modelo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum modelo cadastrado.
                  </p>
                ) : (
                  plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{plan.name}</p>
                        <p className="text-sm text-muted-foreground">
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

        {/* ... messages and notifications tabs same as before ... */}
        <TabsContent value="mensagens">
          <Card>
            <CardHeader>
              <CardTitle>Comunicação (WhatsApp)</CardTitle>
              <CardDescription>
                Configure a mensagem padrão para seus alunos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modelo de Mensagem</Label>
                <Textarea
                  value={msgTemplate}
                  onChange={(e) => setMsgTemplate(e.target.value)}
                  placeholder="Digite sua mensagem padrão..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis disponíveis: {'{studentName}'}, {'{personalName}'}
                </p>
              </div>
              <Button onClick={handleSaveMsg}>Salvar Modelo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Alerta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Treino</Label>
                  <p className="text-sm text-muted-foreground">
                    Treinos vencendo.
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
                    Vencimentos de planos.
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
                    Novas mensagens.
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
          <div className="grid gap-4 py-4">
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
