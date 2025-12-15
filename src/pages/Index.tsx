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
      colorClass: 'text-white bg-orange-600 dark:text-white dark:bg-orange-600',
    }
  })

  const requiredActions = [...planActions].sort(
    (a, b) => a.priority - b.priority,
  )

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 animate-fade-in pb-24 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground uppercase">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2 font-medium">
            Bem-vindo, {profile.name.split(' ')[0]}. Foco no resultado.
          </p>
        </div>
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      {/* 1. Key Metrics - Large Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary hover:border-l-primary/80 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Alunos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-extrabold tracking-tighter text-foreground">
              {activeClients}
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              De {totalClients} totais
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:border-l-blue-500/80 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Agenda Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-extrabold tracking-tighter text-foreground">
              {todayEvents.length}
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              Compromissos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Alerts Section - Large Impact */}
      {requiredActions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Atenção Necessária
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requiredActions.map((action) => (
              <Card
                key={action.id}
                className="border-destructive/30 bg-destructive/5"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase text-destructive tracking-widest mb-1">
                        {action.title}
                      </p>
                      <h3 className="text-xl font-bold text-foreground">
                        {action.studentName}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground mt-1">
                        {action.detail}
                      </p>
                    </div>
                    <div className="p-3 bg-destructive/20 rounded-full text-white">
                      <action.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full" variant="destructive" asChild>
                      <Link to={action.link}>{action.actionLabel}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3. Today's Agenda - Minimalist List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight uppercase">
            Agenda do Dia
          </h2>
          <Button variant="ghost" asChild className="font-semibold">
            <Link to="/agenda">
              Ver completa <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {todayEvents.length === 0 ? (
          <Card className="border-dashed bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-muted-foreground">
                Agenda livre hoje.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:border-primary/50 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-secondary rounded-lg border border-border">
                      <span className="text-xs font-bold uppercase text-muted-foreground">
                        Hora
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {format(new Date(event.date), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-lg font-bold truncate">
                        {event.title}
                      </h3>
                      {event.studentId && (
                        <p className="text-sm font-medium text-muted-foreground truncate">
                          {clients.find((c) => c.id === event.studentId)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
