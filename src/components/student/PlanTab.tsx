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
  Ban,
  CheckSquare,
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
import { toast } from 'sonner'

interface PlanTabProps {
  client: Client
}

export function PlanTab({ client }: PlanTabProps) {
  const { plans, assignPlan, renewPlan, concludePlan, cancelPlan } =
    useAppStore()

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

  // Conclude Plan State
  const [isConcludeDialogOpen, setIsConcludeDialogOpen] = useState(false)

  // Cancel Plan State
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  // Calculations
  const planEndDate = client.planEndDate ? parseISO(client.planEndDate) : null
  const isExpired = planEndDate ? isBefore(planEndDate, new Date()) : false
  const isExpiringSoon = planEndDate
    ? isBefore(planEndDate, addDays(new Date(), 5)) && !isExpired
    : false

  const hasActivePlan = !!client.planName

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
    toast.success('Plano atribuído com sucesso!')
  }

  const handleRenewConfirm = (keepConditions: boolean) => {
    if (keepConditions) {
      renewPlan(client.id, true)
      setIsRenewDialogOpen(false)
      toast.success('Plano renovado com sucesso!')
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
    toast.success('Plano renovado com sucesso!')
  }

  const handleConcludePlan = () => {
    concludePlan(client.id)
    setIsConcludeDialogOpen(false)
    toast.success('Plano concluído com sucesso!')
  }

  const handleCancelPlan = () => {
    cancelPlan(client.id)
    setIsCancelDialogOpen(false)
    toast.success('Plano cancelado com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Active Plan Card */}
      <Card
        className={cn(
          'border-2',
          hasActivePlan && isExpired
            ? 'border-destructive/50'
            : hasActivePlan && isExpiringSoon
              ? 'border-yellow-500/50'
              : hasActivePlan
                ? 'border-primary/20'
                : 'border-border',
        )}
      >
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-lg text-white',
                  hasActivePlan
                    ? isExpired
                      ? 'bg-red-900'
                      : isExpiringSoon
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Plano Atual</CardTitle>
                <CardDescription>
                  {hasActivePlan
                    ? isExpired
                      ? 'Plano expirado'
                      : isExpiringSoon
                        ? 'Vence em breve'
                        : 'Plano ativo'
                    : 'Nenhum plano ativo'}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!hasActivePlan && (
                <Button onClick={() => setIsAssignDialogOpen(true)}>
                  Adicionar Plano
                </Button>
              )}

              {hasActivePlan && (
                <>
                  {!isExpired && (
                    <Button
                      variant="secondary"
                      onClick={() => setIsConcludeDialogOpen(true)}
                      className="bg-green-600 text-white hover:bg-green-700 border-none shadow-none"
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Concluir
                    </Button>
                  )}

                  {!isExpired && (
                    <Button
                      variant="secondary"
                      onClick={() => setIsCancelDialogOpen(true)}
                      className="bg-red-600 text-white hover:bg-red-700 border-none shadow-none"
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  )}

                  {(isExpired || isExpiringSoon) && (
                    <Button onClick={() => setIsRenewDialogOpen(true)}>
                      Renovar Plano
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasActivePlan ? (
            <div className="grid md:grid-cols-2 gap-6 p-4 rounded-lg bg-card/50">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Plano</p>
                  <p className="text-xl font-bold">{client.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="text-xl font-bold text-green-400">
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
                          ? 'text-red-400'
                          : isExpiringSoon
                            ? 'text-yellow-400'
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
                  <div className="flex items-center gap-2 text-green-400 font-medium mt-1">
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-muted/20 gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.name}</p>
                        {item.status && (
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold text-white',
                              item.status === 'completed'
                                ? 'bg-green-700'
                                : item.status === 'cancelled'
                                  ? 'bg-red-700'
                                  : 'bg-gray-700',
                            )}
                          >
                            {item.status === 'completed'
                              ? 'Concluído'
                              : item.status === 'cancelled'
                                ? 'Cancelado'
                                : item.status === 'renewed'
                                  ? 'Renovado'
                                  : 'Histórico'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(item.startDate), 'dd/MM/yy')} até{' '}
                        {format(parseISO(item.endDate), 'dd/MM/yy')}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold">R$ {item.value.toFixed(2)}</p>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full uppercase font-bold text-white',
                          item.paymentStatus === 'refunded'
                            ? 'bg-red-600'
                            : item.paymentStatus === 'paid'
                              ? 'bg-green-600'
                              : 'bg-yellow-600',
                        )}
                      >
                        {item.paymentStatus === 'paid'
                          ? 'Pago'
                          : item.paymentStatus === 'refunded'
                            ? 'Estornado'
                            : 'Pendente'}
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
                  Você tem certeza de que deseja renovar este plano com as
                  mesmas condições? O valor será cobrado novamente, e o novo
                  ciclo começará imediatamente.
                </p>
                <div className="text-sm bg-muted/50 p-2 rounded mt-2">
                  Valor: R$ {client.planValue} • Duração: {client.planDuration}{' '}
                  meses
                </div>
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

      {/* Conclude Dialog */}
      <Dialog
        open={isConcludeDialogOpen}
        onOpenChange={setIsConcludeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Concluir Plano</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <CheckSquare className="h-10 w-10 text-green-600 mb-2" />
              <h3 className="font-semibold text-lg">
                Deseja concluir o plano?
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Você tem certeza de que deseja concluir este plano? O status do
                plano será alterado para 'Concluído', mas o valor pago será
                mantido.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConcludeDialogOpen(false)}
            >
              Voltar
            </Button>
            <Button
              onClick={handleConcludePlan}
              className="bg-green-600 hover:bg-green-700"
            >
              Sim, Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Plano</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <Ban className="h-10 w-10 text-red-600 mb-2" />
              <h3 className="font-semibold text-lg">
                Deseja cancelar o plano?
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Você tem certeza de que deseja cancelar este plano? A entrada
                financeira será estornada, e o status do plano será alterado
                para 'Cancelado'.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Voltar
            </Button>
            <Button onClick={handleCancelPlan} variant="destructive">
              Sim, Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
