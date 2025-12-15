import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Dumbbell,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Utensils,
  Wallet,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { format, isBefore, addDays, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const Index = () => {
  const { clients, workouts, events, profile, diets, transactions } =
    useAppStore()

  const activeClients = clients.filter((c) => c.status === 'active').length
  const inactiveClients = clients.filter((c) => c.status === 'inactive').length

  const expiringWorkouts = workouts.filter(
    (w) =>
      !w.isLifetime &&
      w.expirationDate &&
      isBefore(new Date(w.expirationDate), addDays(new Date(), 7)) &&
      !isBefore(new Date(w.expirationDate), new Date()) &&
      w.clientId, // Only count assigned workouts
  )

  const expiredWorkouts = workouts.filter(
    (w) =>
      !w.isLifetime &&
      w.expirationDate &&
      isBefore(new Date(w.expirationDate), new Date()) &&
      w.clientId, // Only count assigned workouts
  )

  const expiredDiets = diets.filter(
    (d) =>
      !d.isLifetime &&
      d.expirationDate &&
      isBefore(new Date(d.expirationDate), new Date()) &&
      d.clientId,
  )

  // Payment Alerts
  const overduePayments = transactions.filter(
    (t) =>
      t.status === 'overdue' ||
      (t.status === 'pending' && isBefore(new Date(t.dueDate), new Date())),
  )

  const dueSoonPayments = transactions.filter(
    (t) =>
      t.status === 'pending' &&
      isBefore(new Date(t.dueDate), addDays(new Date(), 5)) &&
      !isBefore(new Date(t.dueDate), new Date()),
  )

  // Dashboard Sync: "Today" events
  const todayEvents = events
    .filter((e) => !e.completed && isSameDay(new Date(e.date), new Date()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Dashboard Sync: "Overdue" events
  const overdueEvents = events
    .filter(
      (e) =>
        !e.completed &&
        isBefore(new Date(e.date), new Date()) &&
        !isSameDay(new Date(e.date), new Date()),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Deduplicate alerts logic
  const requiredActions = [
    ...overduePayments.map((p) => ({
      type: 'overdue_payment',
      title: `Pagamento Atrasado: R$ ${p.amount.toFixed(2)}`,
      client: p.studentName,
      id: p.studentId,
      date: p.dueDate,
      link: '/financeiro',
    })),
    ...dueSoonPayments.map((p) => ({
      type: 'due_soon_payment',
      title: `Pagamento Vencendo: R$ ${p.amount.toFixed(2)}`,
      client: p.studentName,
      id: p.studentId,
      date: p.dueDate,
      link: '/financeiro',
    })),
    ...overdueEvents.map((e) => ({
      type: 'overdue_event',
      title: `Compromisso Atrasado: ${e.title}`,
      client: clients.find((c) => c.id === e.studentId)?.name || 'Geral',
      id: e.studentId || e.id,
      date: e.date,
      link: '/agenda',
    })),
    ...expiredWorkouts.map((w) => ({
      type: 'expired_workout',
      title: `Treino Vencido: ${w.title}`,
      client: w.clientName,
      id: w.clientId,
      link: `/alunos/${w.clientId}?tab=treinos`,
    })),
    ...expiredDiets.map((d) => ({
      type: 'expired_diet',
      title: `Dieta Vencida: ${d.title}`,
      client: d.clientName,
      id: d.clientId,
      link: `/alunos/${d.clientId}?tab=dietas`,
    })),
  ].slice(0, 10) // Limit display

  const alertsCount = requiredActions.length

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Olá, {profile.name.split(' ')[0]}!
          </p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline">
              <div className="text-2xl font-bold">{activeClients}</div>
              <span className="text-xs text-muted-foreground">Ativos</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {inactiveClients} Inativos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsCount}</div>
            <p className="text-xs text-muted-foreground">Ações necessárias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Agenda de Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Compromissos pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Ações Necessárias</CardTitle>
          </CardHeader>
          <CardContent>
            {requiredActions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tudo em dia! Nenhuma ação pendente.
              </p>
            ) : (
              <div className="space-y-4">
                {requiredActions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-full shrink-0',
                          action.type.includes('overdue')
                            ? 'bg-red-100 text-red-600'
                            : 'bg-orange-100 text-orange-600',
                        )}
                      >
                        {action.type.includes('workout') ? (
                          <Dumbbell className="h-4 w-4" />
                        ) : action.type.includes('diet') ? (
                          <Utensils className="h-4 w-4" />
                        ) : action.type.includes('payment') ? (
                          <Wallet className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.client}
                          {'date' in action &&
                            action.date &&
                            ` - ${format(new Date(action.date as string | Date), 'dd/MM')}`}
                        </p>
                      </div>
                    </div>
                    {action.link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={action.link}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hoje na Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Agenda livre por hoje.
                </p>
              ) : (
                <div className="space-y-3">
                  {todayEvents.slice(0, 5).map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 p-2 rounded-lg border bg-card/50"
                    >
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-md font-bold text-xs">
                        {format(new Date(e.date), 'HH:mm')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {e.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {e.studentId
                            ? clients.find((c) => c.id === e.studentId)?.name
                            : 'Geral'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to="/agenda">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Acesso Rápido</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                asChild
                className="w-full justify-start h-12"
                variant="outline"
              >
                <Link to="/alunos">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Alunos
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start h-12"
                variant="outline"
              >
                <Link to="/treinos">
                  <Dumbbell className="mr-2 h-5 w-5 text-primary" />
                  Treinos
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start h-12"
                variant="outline"
              >
                <Link to="/dieta">
                  <Utensils className="mr-2 h-5 w-5 text-primary" />
                  Dieta
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start h-12"
                variant="outline"
              >
                <Link to="/agenda">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Agenda
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
