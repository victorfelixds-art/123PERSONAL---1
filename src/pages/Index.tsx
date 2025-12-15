import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  CreditCard,
  Calendar,
  ChevronRight,
  Dumbbell,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  Scale,
  ArrowRight,
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

  // Students
  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.status === 'active').length
  const inactiveClients = clients.filter((c) => c.status === 'inactive').length

  // Plans Expiring (Active clients expiring in <= 5 days) or Expired (Active but past date)
  // We also consider recently expired (inactive) if needed, but sticking to Active for "Vencendo" usually implies urgency to renew before they stop.
  // AC says "Planos vencendo" (Expiring/Expired).
  const plansAttention = clients.filter((c) => {
    if (!c.planEndDate) return false
    const endDate = parseISO(c.planEndDate)
    // Active and expiring soon OR Active and already expired (but status not yet updated to inactive by system?)
    // Or Inactive but expired recently (let's say last 7 days) to prompt renewal.
    // For simplicity and focus: Active clients expiring in next 7 days or Overdue.
    const isExpiringSoon =
      c.status === 'active' &&
      isBefore(endDate, addDays(today, 7)) &&
      isAfter(endDate, addDays(today, -1))
    const isOverdue = isBefore(endDate, today) && c.status === 'active' // Should be caught by store, but safety check
    return isExpiringSoon || isOverdue
  })

  // Today's Schedule Count
  const todayEvents = events
    .filter((e) => isSameDay(new Date(e.date), today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const todayCommitmentsCount = todayEvents.length

  // --- Required Actions Logic ---

  // 1. Plans Actions
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

  // 2. Weight Update Actions
  // Assuming 'other' type events with specific title pattern or just recurring weight tasks
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

  // 3. Today's Pending Commitments Actions
  const scheduleActions = todayEvents
    .filter((e) => !e.completed)
    .map((e) => ({
      id: `event-${e.id}`,
      type: 'event',
      priority: 3,
      title: 'Compromisso do Dia',
      studentName: e.title, // Using title as description often contains student name or context
      detail: format(new Date(e.date), 'HH:mm'),
      link: '/agenda',
      actionLabel: 'Ver Agenda',
      icon: Clock,
      colorClass: 'text-purple-600 bg-purple-100',
    }))

  // 4. Other Actions (Overdue Payments)
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

  // Consolidated Required Actions
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

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Students Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <div className="flex gap-3 mt-1 text-xs">
              <span className="text-green-600 font-medium">
                {activeClients} Ativos
              </span>
              <span className="text-muted-foreground">
                {inactiveClients} Inativos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Plans Card */}
        <Card
          className={cn(
            plansAttention.length > 0
              ? 'border-yellow-400 bg-yellow-50/30'
              : '',
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Planos</CardTitle>
            <CreditCard
              className={cn(
                'h-4 w-4',
                plansAttention.length > 0
                  ? 'text-yellow-600'
                  : 'text-muted-foreground',
              )}
            />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                plansAttention.length > 0 ? 'text-yellow-700' : '',
              )}
            >
              {plansAttention.length}
            </div>
            <p
              className={cn(
                'text-xs',
                plansAttention.length > 0
                  ? 'text-yellow-600 font-medium'
                  : 'text-muted-foreground',
              )}
            >
              Planos vencendo ou vencidos
            </p>
          </CardContent>
        </Card>

        {/* Schedule Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Agenda</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCommitmentsCount}</div>
            <p className="text-xs text-muted-foreground">Compromissos hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Required Actions Block */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          AÇÕES NECESSÁRIAS
        </h2>

        {requiredActions.length === 0 ? (
          <Card className="bg-muted/10 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-3 opacity-80" />
              <p className="font-semibold text-foreground">Tudo em dia!</p>
              <p className="text-sm text-muted-foreground">
                Nenhuma ação pendente por enquanto.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {requiredActions.map((action) => (
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
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">
                        {action.studentName}
                      </span>
                      {action.type === 'plan' && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium uppercase">
                          Atenção
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-foreground/80">
                        {action.title}
                      </span>
                      <span className="hidden sm:inline text-muted-foreground/40">
                        •
                      </span>
                      <span>{action.detail}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild className="shrink-0">
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

      {/* Today's Schedule Block */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">HOJE NA AGENDA</h2>

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
                    {event.completed && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mr-2">
                        Concluído
                      </span>
                    )}
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

      {/* Quick Access Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            asChild
            variant="outline"
            className="h-24 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link to="/alunos">
              <Users className="h-6 w-6 text-primary" />
              <span>Alunos</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-24 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link to="/treinos">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span>Treinos</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-24 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link to="/agenda">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Agenda</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-24 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link to="/financeiro">
              <DollarSign className="h-6 w-6 text-primary" />
              <span>Financeiro</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
