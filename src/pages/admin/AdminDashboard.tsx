import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, CreditCard, Activity } from 'lucide-react'

export default function AdminDashboard() {
  // TODO: Fetch real stats
  const stats = [
    {
      title: 'Personais Ativos',
      value: '12',
      description: '+2 no último mês',
      icon: Users,
    },
    {
      title: 'Solicitações Pendentes',
      value: '3',
      description: 'Aguardando aprovação',
      icon: UserPlus,
    },
    {
      title: 'Assinaturas Ativas',
      value: '10',
      description: '85% de conversão',
      icon: CreditCard,
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 4.500',
      description: '+12% vs mês anterior',
      icon: Activity,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema e principais métricas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
    </div>
  )
}
