import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, CreditCard, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPersonals: 0,
    activePersonals: 0,
    pendingPersonals: 0,
    inactivePersonals: 0,
    activeSubs: 0,
    inactiveSubs: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Personals stats
        const { data: personals, error: personalsError } = await supabase
          .from('users_profile')
          .select('status')
          .eq('role', 'PERSONAL')

        if (personalsError) throw personalsError

        // Fetch Subscriptions stats
        const { data: subs, error: subsError } = await supabase
          .from('subscriptions')
          .select('status')

        if (subsError) throw subsError

        setStats({
          totalPersonals: personals.length,
          activePersonals: personals.filter((p) => p.status === 'ATIVO').length,
          pendingPersonals: personals.filter((p) => p.status === 'PENDENTE')
            .length,
          inactivePersonals: personals.filter((p) => p.status === 'INATIVO')
            .length,
          activeSubs: subs.filter((s) => s.status === 'ACTIVE').length,
          inactiveSubs: subs.filter((s) => s.status !== 'ACTIVE').length,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        toast.error('Erro ao carregar estatísticas')
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Personais',
      value: stats.totalPersonals.toString(),
      description: `${stats.activePersonals} ativos, ${stats.inactivePersonals} inativos`,
      icon: Users,
    },
    {
      title: 'Solicitações Pendentes',
      value: stats.pendingPersonals.toString(),
      description: 'Aguardando aprovação',
      icon: UserPlus,
      alert: stats.pendingPersonals > 0,
    },
    {
      title: 'Assinaturas Ativas',
      value: stats.activeSubs.toString(),
      description: 'Total de planos vigentes',
      icon: CreditCard,
    },
    {
      title: 'Planos Encerrados',
      value: stats.inactiveSubs.toString(),
      description: 'Cancelados ou expirados',
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
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 ${
                  stat.alert ? 'text-orange-500' : 'text-muted-foreground'
                }`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stat.alert ? 'text-orange-600' : ''
                }`}
              >
                {stat.value}
              </div>
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
