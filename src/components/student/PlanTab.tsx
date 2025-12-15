import { useState } from 'react'
import { Client, Plan } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  CreditCard,
  Calendar as CalendarIcon,
  History,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react'
import { format, parseISO, addMonths, isBefore, addDays } from 'date-fns'
import useAppStore from '@/stores/useAppStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface PlanTabProps {
  client: Client
}

export function PlanTab({ client }: PlanTabProps) {
  const { plans, assignPlan, renewPlan } = useAppStore()

  // Assign Plan State
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [assignType, setAssignType] = useState('fixed') // fixed | custom
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [customPlan, setCustomPlan] = useState({
    name: '',
    value: '',
    duration: '1',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  })

  // Renew Plan State
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false)
  const [renewStep, setRenewStep] = useState<'confirm' | 'form'>('confirm')
  const [renewConditions, setRenewConditions] = useState({
    value: client.planValue?.toString() || '',
    duration: client.planDuration?.toString() || '1',
  })

  // Calculations
  const planEndDate = client.planEndDate ? parseISO(client.planEndDate) : null
  const isExpired = planEndDate ? isBefore(planEndDate, new Date()) : false
  const isExpiringSoon = planEndDate
    ? isBefore(planEndDate, addDays(new Date(), 5)) && !isExpired
    : false

  // Handlers
  const handleAssignSubmit = () => {
    let planData
    if (assignType === 'fixed') {
      const template = plans.find((p) => p.id === selectedPlanId)
      if (!template) return
      planData = {
        id: template.id,
        name: template.name,
        value: template.value,
        durationInMonths: template.durationInMonths,
        startDate: customPlan.startDate,
      }
    } else {
      planData = {
        name: customPlan.name,
        value: Number(customPlan.value),
        durationInMonths: Number(customPlan.duration),
        startDate: customPlan.startDate,
      }
    }

    assignPlan(client.id, planData)
    setIsAssignDialogOpen(false)
  }

  const handleRenewConfirm = (keepConditions: boolean) => {
    if (keepConditions) {
      renewPlan(client.id, true)
      setIsRenewDialogOpen(false)
    } else {
      setRenewStep('form')
    }
  }

  const handleRenewCustomSubmit = () => {
    renewPlan(client.id, false, {
      value: Number(renewConditions.value),
      durationInMonths: Number(renewConditions.duration),
    })
    setIsRenewDialogOpen(false)
    setRenewStep('confirm')
  }

  return (
    <div className="space-y-6">
      {/* Active Plan Card */}
      <Card
        className={cn(
          'border-2',
          isExpired
            ? 'border-destructive/50'
            : isExpiringSoon
              ? 'border-yellow-500/50'
              : 'border-primary/20',
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  isExpired
                    ? 'bg-red-100 text-red-700'
                    : isExpiringSoon
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700',
                )}
              >
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Plano Atual</CardTitle>
                <CardDescription>
                  {isExpired
                    ? 'Plano expirado'
                    : isExpiringSoon
                      ? 'Vence em breve'
                      : 'Plano ativo'}
                </CardDescription>
              </div>
            </div>
            {client.planName && (
              <div className="flex gap-2">
                {!isExpired && (
                  <Button onClick={() => setIsRenewDialogOpen(true)}>
                    Renovar Plano
                  </Button>
                )}
                {isExpired && (
                  <Button onClick={() => setIsRenewDialogOpen(true)}>
                    Renovar Agora
                  </Button>
                )}
              </div>
            )}
            {!client.planName && (
              <Button onClick={() => setIsAssignDialogOpen(true)}>
                Adicionar Plano
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {client.planName ? (
            <div className="grid md:grid-cols-2 gap-6 p-4 rounded-lg bg-card/50">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Plano</p>
                  <p className="text-xl font-bold">{client.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="text-xl font-bold text-green-600">
                    R$ {client.planValue?.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Início</p>
                    <p className="font-medium flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {client.planStartDate
                        ? format(parseISO(client.planStartDate), 'dd/MM/yyyy')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vencimento</p>
                    <p
                      className={cn(
                        'font-medium flex items-center gap-1',
                        isExpired
                          ? 'text-red-600'
                          : isExpiringSoon
                            ? 'text-yellow-600'
                            : '',
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {client.planEndDate
                        ? format(parseISO(client.planEndDate), 'dd/MM/yyyy')
                        : '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Status do Pagamento
                  </p>
                  <div className="flex items-center gap-2 text-green-600 font-medium mt-1">
                    <CheckCircle2 className="h-4 w-4" /> Pago Automaticamente
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum plano atribuído a este aluno.</p>
              <Button
                variant="link"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                Atribuir um plano agora
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {client.planHistory && client.planHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Histórico de Planos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {client.planHistory
                .slice()
                .reverse()
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted/20"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(item.startDate), 'dd/MM/yy')} até{' '}
                        {format(parseISO(item.endDate), 'dd/MM/yy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {item.value.toFixed(2)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 uppercase font-bold">
                        {item.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Plano</DialogTitle>
            <DialogDescription>
              Selecione um modelo ou crie um personalizado.
            </DialogDescription>
          </DialogHeader>
          <Tabs
            defaultValue="fixed"
            onValueChange={setAssignType}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fixed">Usar Modelo</TabsTrigger>
              <TabsTrigger value="custom">Personalizado</TabsTrigger>
            </TabsList>

            <div className="py-4 space-y-4">
              <div className="grid gap-2">
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={customPlan.startDate}
                  onChange={(e) =>
                    setCustomPlan({ ...customPlan, startDate: e.target.value })
                  }
                />
                {customPlan.startDate &&
                  assignType === 'fixed' &&
                  selectedPlanId && (
                    <p className="text-xs text-muted-foreground text-right">
                      Vencimento:{' '}
                      {format(
                        addMonths(
                          parseISO(customPlan.startDate),
                          plans.find((p) => p.id === selectedPlanId)
                            ?.durationInMonths || 1,
                        ),
                        'dd/MM/yyyy',
                      )}
                    </p>
                  )}
                {customPlan.startDate &&
                  assignType === 'custom' &&
                  customPlan.duration && (
                    <p className="text-xs text-muted-foreground text-right">
                      Vencimento:{' '}
                      {format(
                        addMonths(
                          parseISO(customPlan.startDate),
                          Number(customPlan.duration),
                        ),
                        'dd/MM/yyyy',
                      )}
                    </p>
                  )}
              </div>

              <TabsContent value="fixed" className="space-y-4 mt-0">
                <div className="grid gap-2">
                  <Label>Selecione o Plano</Label>
                  <Select
                    value={selectedPlanId}
                    onValueChange={setSelectedPlanId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - R$ {plan.value} ({plan.durationInMonths}{' '}
                          meses)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-0">
                <div className="grid gap-2">
                  <Label>Nome do Plano</Label>
                  <Input
                    placeholder="Ex: Especial Trimestral"
                    value={customPlan.name}
                    onChange={(e) =>
                      setCustomPlan({ ...customPlan, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={customPlan.value}
                      onChange={(e) =>
                        setCustomPlan({ ...customPlan, value: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Duração (Meses)</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={customPlan.duration}
                      onChange={(e) =>
                        setCustomPlan({
                          ...customPlan,
                          duration: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignSubmit}
              disabled={
                assignType === 'fixed'
                  ? !selectedPlanId
                  : !customPlan.name || !customPlan.value
              }
            >
              Confirmar e Atribuir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renovar Plano</DialogTitle>
            <DialogDescription>
              O plano atual vencerá em{' '}
              {client.planEndDate
                ? format(parseISO(client.planEndDate), 'dd/MM/yyyy')
                : 'N/A'}
              .
            </DialogDescription>
          </DialogHeader>

          {renewStep === 'confirm' ? (
            <div className="py-6 space-y-4">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <AlertCircle className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">
                  Manter as mesmas condições?
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Isso criará um novo ciclo com o mesmo valor (R${' '}
                  {client.planValue}) e duração ({client.planDuration} meses).
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleRenewConfirm(false)}
                >
                  Não, alterar
                </Button>
                <Button onClick={() => handleRenewConfirm(true)}>
                  Sim, manter
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Ajuste os valores para a renovação:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Novo Valor (R$)</Label>
                  <Input
                    type="number"
                    value={renewConditions.value}
                    onChange={(e) =>
                      setRenewConditions({
                        ...renewConditions,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Nova Duração (Meses)</Label>
                  <Input
                    type="number"
                    value={renewConditions.duration}
                    onChange={(e) =>
                      setRenewConditions({
                        ...renewConditions,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="ghost" onClick={() => setRenewStep('confirm')}>
                  Voltar
                </Button>
                <Button onClick={handleRenewCustomSubmit}>
                  Confirmar Renovação
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
