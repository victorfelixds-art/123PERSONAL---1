import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  CreditCard,
  Calendar,
  AlertCircle,
  ArrowRight,
  Dumbbell,
  Utensils,
  Scale,
  UserX,
  Clock,
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

const Index = () => {
  const { clients, events, profile, workouts, diets } = useAppStore()
  const today = new Date()

  // --- Metrics ---
  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.status === 'active').length
  const inactiveClients = clients.filter((c) => c.status === 'inactive').length

  // --- Alerts & Actions Generation ---
  const requiredActions: {
    id: string
    type: string
    priority: number
    title: string
    studentName: string
    detail: string
    link: string
    actionLabel: string
    icon: any
  }[] = []

  // 1. Plans Attention (Expiring or Overdue)
  clients
    .filter((c) => c.status === 'active' && c.planEndDate)
    .forEach((c) => {
      const endDate = parseISO(c.planEndDate!)
      const daysLeft = differenceInDays(endDate, today)
      const isExpired = isBefore(endDate, today)
      const isExpiringSoon = daysLeft >= 0 && daysLeft <= 7

      if (isExpired || isExpiringSoon) {
        requiredActions.push({
          id: `plan-${c.id}`,
          type: 'plan',
          priority: isExpired ? 1 : 2,
          title: isExpired ? 'Plano Vencido' : 'Plano Vencendo',
          studentName: c.name,
          detail: isExpired
            ? `Venceu em ${format(endDate, 'dd/MM')}`
            : `Vence em ${daysLeft === 0 ? 'hoje' : `${daysLeft} dias`}`,
          link: `/alunos/${c.id}?tab=plano`,
          actionLabel: 'Renovar',
          icon: CreditCard,
        })
      }
    })

  // 2. Expired Workouts
  workouts.forEach((w) => {
    if (w.clientId && !w.isLifetime && w.expirationDate) {
      const expDate = parseISO(w.expirationDate)
      if (isBefore(expDate, today)) {
        requiredActions.push({
          id: `workout-${w.id}`,
          type: 'workout',
          priority: 3,
          title: 'Treino Vencido',
          studentName: w.clientName || 'Aluno',
          detail: `Venceu em ${format(expDate, 'dd/MM')}`,
          link: `/alunos/${w.clientId}?tab=treinos`,
          actionLabel: 'Atualizar',
          icon: Dumbbell,
        })
      }
    }
  })

  // 3. Expired Diets
  diets.forEach((d) => {
    if (d.clientId && !d.isLifetime && d.expirationDate) {
      const expDate = parseISO(d.expirationDate)
      if (isBefore(expDate, today)) {
        requiredActions.push({
          id: `diet-${d.id}`,
          type: 'diet',
          priority: 3,
          title: 'Dieta Vencida',
          studentName: d.clientName || 'Aluno',
          detail: `Venceu em ${format(expDate, 'dd/MM')}`,
          link: `/alunos/${d.clientId}?tab=dietas`,
          actionLabel: 'Atualizar',
          icon: Utensils,
        })
      }
    }
  })

  // 4. Pending Weekly Weight
  clients
    .filter((c) => c.status === 'active')
    .forEach((c) => {
      let lastWeightDate: Date | null = null
      if (c.weightHistory && c.weightHistory.length > 0) {
        // Sort to find latest
        const sorted = [...c.weightHistory].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        lastWeightDate = parseISO(sorted[0].date)
      } else if (c.since) {
        lastWeightDate = parseISO(c.since)
      }

      if (lastWeightDate) {
        const daysSince = differenceInDays(today, lastWeightDate)
        if (daysSince > 7) {
          requiredActions.push({
            id: `weight-${c.id}`,
            type: 'weight',
            priority: 4,
            title: 'Peso Pendente',
            studentName: c.name,
            detail: `Última atualização há ${daysSince} dias`,
            link: `/alunos/${c.id}?tab=dados`,
            actionLabel: 'Atualizar',
            icon: Scale,
          })
        }
      }
    })

  // 5. Today's Commitments (Uncompleted)
  events
    .filter((e) => isSameDay(new Date(e.date), today) && !e.completed)
    .forEach((e) => {
      const clientName = e.studentId
        ? clients.find((c) => c.id === e.studentId)?.name
        : 'Geral'
      requiredActions.push({
        id: `event-${e.id}`,
        type: 'event',
        priority: 0, // Highest priority to show today's tasks
        title: 'Compromisso Hoje',
        studentName: clientName || 'Geral',
        detail: `${format(new Date(e.date), 'HH:mm')} - ${e.title}`,
        link: `/agenda`,
        actionLabel: 'Ver Agenda',
        icon: Clock,
      })
    })

  // Sort Actions by Priority
  const sortedActions = requiredActions.sort((a, b) => a.priority - b.priority)

  // Today's Schedule (for the bottom section)
  const todayEvents = events
    .filter((e) => isSameDay(new Date(e.date), today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

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
        {/* Active Clients */}
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

        {/* Inactive Clients */}
        <Card className="border-l-4 border-l-muted hover:border-l-muted-foreground transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Alunos Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-extrabold tracking-tighter text-muted-foreground">
              {inactiveClients}
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              Precisa reativar?
            </p>
          </CardContent>
        </Card>

        {/* Today's Agenda Count */}
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
      {sortedActions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Atenção Necessária
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedActions.map((action) => (
              <Card
                key={action.id}
                className={`border-l-4 shadow-sm ${
                  action.priority <= 1
                    ? 'border-l-destructive bg-destructive/5 border-t-0 border-r-0 border-b-0'
                    : action.priority <= 3
                      ? 'border-l-orange-500 bg-orange-500/5 border-t-0 border-r-0 border-b-0'
                      : 'border-l-blue-500 bg-blue-500/5 border-t-0 border-r-0 border-b-0'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <p
                        className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                          action.priority <= 1
                            ? 'text-destructive'
                            : action.priority <= 3
                              ? 'text-orange-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {action.title}
                      </p>
                      <h3 className="text-xl font-bold text-foreground truncate">
                        {action.studentName}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground mt-1 truncate">
                        {action.detail}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full text-white shrink-0 ${
                        action.priority <= 1
                          ? 'bg-destructive/90'
                          : action.priority <= 3
                            ? 'bg-orange-500/90'
                            : 'bg-blue-500/90'
                      }`}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      className={`w-full font-bold ${
                        action.priority <= 1
                          ? 'bg-destructive hover:bg-destructive/90'
                          : action.priority <= 3
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      size="sm"
                      asChild
                    >
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
                className={`hover:border-primary/50 transition-colors ${event.completed ? 'opacity-60 bg-muted/50' : ''}`}
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
                      <h3
                        className={`text-lg font-bold truncate ${event.completed ? 'line-through decoration-2' : ''}`}
                      >
                        {event.title}
                      </h3>
                      {event.studentId && (
                        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground truncate">
                          <Users className="h-3 w-3" />
                          {clients.find((c) => c.id === event.studentId)?.name}
                        </div>
                      )}
                      {event.completed && (
                        <span className="text-xs font-bold text-green-500 uppercase mt-1 block">
                          Concluído
                        </span>
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
