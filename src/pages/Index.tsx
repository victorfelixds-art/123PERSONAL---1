import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Dumbbell,
  Calendar,
  Bell,
  DollarSign,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const Index = () => {
  const { clients, workouts, events, profile, transactions } = useAppStore()

  const activeClients = clients.filter((c) => c.status === 'active').length
  const nextEvent = events
    .filter((e) => e.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0]

  const currentMonth = new Date().getMonth()
  const monthlyRevenue = transactions
    .filter(
      (t) =>
        t.type === 'income' && new Date(t.date).getMonth() === currentMonth,
    )
    .reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo de volta, {profile.name.split(' ')[0]}!
          </p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              Total de alunos registrados
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Evento
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {nextEvent ? format(nextEvent.date, 'HH:mm') : '--:--'}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {nextEvent ? nextEvent.title : 'Nada agendado'}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rendimento Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Mensagens não lidas</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            asChild
            className="h-auto py-4 flex flex-col items-center gap-2"
            variant="outline"
          >
            <Link to="/alunos">
              <Users className="h-6 w-6 mb-1 text-primary" />
              <span>Adicionar Aluno</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-auto py-4 flex flex-col items-center gap-2"
            variant="outline"
          >
            <Link to="/treinos">
              <Dumbbell className="h-6 w-6 mb-1 text-primary" />
              <span>Criar Treino</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-auto py-4 flex flex-col items-center gap-2"
            variant="outline"
          >
            <Link to="/agenda">
              <Calendar className="h-6 w-6 mb-1 text-primary" />
              <span>Ver Agenda</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
