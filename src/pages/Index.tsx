import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Scale,
  ArrowRight,
  Clock,
  DollarSign,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  format,
  isBefore,
  addDays,
  isSameDay,
  parseISO,
  differenceInDays,
  isAfter,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const Index = () => {
  const { clients, events, profile, transactions } = useAppStore()
  const today = new Date()

  // --- Metrics ---
  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.status === 'active').length
  const inactiveClients = clients.filter((c) => c.status === 'inactive').length

  // Plans Attention: Active clients expiring in next 7 days or Overdue
  const plansAttention = clients.filter((c) => {
    if (!c.planEndDate) return false
    const endDate = parseISO(c.planEndDate)
    const isExpiringSoon =
      c.status === 'active' &&
      isBefore(endDate, addDays(today, 7)) &&
      isAfter(endDate, addDays(today, -1))
    const isOverdue = isBefore(endDate, today) && c.status === 'active'
    return isExpiringSoon || isOverdue
  })

  // Today's Schedule
  const todayEvents = events
    .filter((e) => isSameDay(new Date(e.date), today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // --- Actions Generation ---

  const planActions = plansAttention.map((c) => {
    const endDate = parseISO(c.planEndDate!)
    const daysLeft = differenceInDays(endDate, today)
    const isExpired = daysLeft < 0

    return {
      id: `plan-${c.id}`,
      type: 'plan',
      priority: 1,
      title: isExpired ? 'Plano Vencido' : 'Plano Vencendo',
      studentName: c.name,
      detail: isExpired
        ? `Venceu em ${format(endDate, 'dd/MM')}`
        : `Vence em ${daysLeft === 0 ? 'hoje' : `${daysLeft} dias`}`,
      link: `/alunos/${c.id}?tab=plano`,
      actionLabel: 'Renovar',
      icon: CreditCard,
      colorClass: 'text-orange-600 bg-orange-100',
    }
  })

  const weightActions = events
    .filter(
      (e) =>
        !e.completed &&
        e.type === 'other' &&
        e.title.toLowerCase().includes('peso') &&
        (isSameDay(new Date(e.date), today) ||
          isBefore(new Date(e.date), today)),
    )
    .map((e) => ({
      id: `weight-${e.id}`,
      type: 'weight',
      priority: 2,
      title: 'Atualização de Peso',
      studentName:
        clients.find((c) => c.id === e.studentId)?.name || 'Aluno não ident.',
      detail: isSameDay(new Date(e.date), today)
        ? 'Hoje'
        : `Atrasado ${differenceInDays(today, new Date(e.date))} dias`,
      link: e.studentId ? `/alunos/${e.studentId}` : '/alunos',
      actionLabel: 'Atualizar',
      icon: Scale,
      colorClass: 'text-blue-600 bg-blue-100',
    }))

  const scheduleActions = todayEvents
    .filter((e) => !e.completed)
    .map((e) => ({
      id: `event-${e.id}`,
      type: 'event',
      priority: 3,
      title: 'Compromisso do Dia',
      studentName: e.title,
      detail: format(new Date(e.date), 'HH:mm'),
      link: '/agenda',
      actionLabel: 'Ver Agenda',
      icon: Clock,
      colorClass: 'text-purple-600 bg-purple-100',
    }))

  const paymentActions = transactions
    .filter(
      (t) =>
        (t.status === 'overdue' ||
          (t.status === 'pending' &&
            isBefore(parseISO(t.dueDate), today) &&
            !isSameDay(parseISO(t.dueDate), today))) &&
        t.type === 'income',
    )
    .map((t) => ({
      id: `payment-${t.id}`,
      type: 'payment',
      priority: 4,
      title: 'Pagamento Pendente',
      studentName: t.studentName || 'Aluno',
      detail: `R$ ${t.amount.toFixed(2)} - Venceu ${format(parseISO(t.dueDate), 'dd/MM')}`,
      link: '/financeiro',
      actionLabel: 'Resolver',
      icon: DollarSign,
      colorClass: 'text-red-600 bg-red-100',
    }))

  const requiredActions = [
    ...planActions,
    ...weightActions,
    ...scheduleActions,
    ...paymentActions,
  ].sort((a, b) => a.priority - b.priority)

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Olá, {profile.name.split(' ')[0]}!
          </p>
        </div>
        <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border">
          {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      {/* 1. Alerts Section (Planos Vencendo) */}
      {planActions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            PLANOS VENCENDO
          </h2>
          <div className="grid gap-3">
            {planActions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{action.studentName}</p>
                    <p className="text-xs text-destructive font-medium">
                      {action.detail}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="destructive" asChild>
                  <Link to={action.link}>Renovar</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Actions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          AÇÕES NECESSÁRIAS
        </h2>
        {requiredActions.filter((a) => a.type !== 'plan').length === 0 ? (
          <Card className="bg-muted/10 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-2 opacity-80" />
              <p className="font-medium text-foreground text-sm">
                Tudo em dia!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {requiredActions
              .filter((a) => a.type !== 'plan')
              .map((action) => (
                <div
                  key={action.id}
                  className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-all hover:border-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'p-2.5 rounded-lg shrink-0',
                        action.colorClass,
                      )}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">
                        {action.studentName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.title} • {action.detail}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="shrink-0"
                  >
                    <Link
                      to={action.link}
                      className="flex items-center gap-1 text-primary hover:text-primary/80"
                    >
                      <span className="hidden sm:inline">
                        {action.actionLabel}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 3. Status Cards (Alunos) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {totalClients} cadastrados no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Agenda Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">Compromissos</p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Agenda List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">AGENDA DO DIA</h2>
        <Card>
          <CardContent className="p-0">
            {todayEvents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>Agenda livre hoje.</p>
              </div>
            ) : (
              <div className="divide-y">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-16 shrink-0 text-sm font-bold text-muted-foreground">
                      {format(new Date(event.date), 'HH:mm')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {event.title}
                      </p>
                      {event.studentId && (
                        <p className="text-xs text-muted-foreground truncate">
                          {clients.find((c) => c.id === event.studentId)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-2 border-t bg-muted/20">
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-foreground h-8"
                asChild
              >
                <Link to="/agenda">Ver agenda completa</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Index
