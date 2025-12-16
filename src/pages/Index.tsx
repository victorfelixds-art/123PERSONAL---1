import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Dumbbell, Calendar, TrendingUp } from 'lucide-react'

export default function Index() {
  const stats = [
    {
      title: 'Alunos Ativos',
      value: '0',
      icon: Users,
      description: 'Total de alunos ativos',
    },
    {
      title: 'Treinos Realizados',
      value: '0',
      icon: Dumbbell,
      description: 'Nesta semana',
    },
    {
      title: 'Aulas Agendadas',
      value: '0',
      icon: Calendar,
      description: 'Próximos 7 dias',
    },
    {
      title: 'Faturamento',
      value: 'R$ 0,00',
      icon: TrendingUp,
      description: 'Mês atual',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do seu desempenho e atividades."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              Gráfico de desempenho será exibido aqui
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade recente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
