import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import {
  Users,
  UserCheck,
  UserX,
  User,
  CreditCard,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface DashboardMetrics {
  totalPersonals: number
  activePersonals: number
  pendingPersonals: number
  inactivePersonals: number
  activeSubscriptions: number
  expiredSubscriptions: number
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPersonals: 0,
    activePersonals: 0,
    pendingPersonals: 0,
    inactivePersonals: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
  })

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const { data: personals, error: personalsError } = await supabase
        .from('users_profile')
        .select('status')
        .eq('role', 'PERSONAL')

      if (personalsError) throw personalsError

      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('status')

      if (subsError) throw subsError

      setMetrics({
        totalPersonals: personals?.length || 0,
        activePersonals:
          personals?.filter((p) => p.status === 'ATIVO').length || 0,
        pendingPersonals:
          personals?.filter((p) => p.status === 'PENDENTE').length || 0,
        inactivePersonals:
          personals?.filter((p) => p.status === 'INATIVO').length || 0,
        activeSubscriptions:
          subscriptions?.filter((s) => s.status === 'ACTIVE').length || 0,
        expiredSubscriptions:
          subscriptions?.filter((s) => s.status === 'EXPIRED').length || 0,
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
      toast.error('Erro ao carregar métricas do dashboard')
    }
  }

  const cards = [
    {
      title: 'Total de Personais',
      value: metrics.totalPersonals,
      icon: Users,
      desc: 'Total cadastrado',
    },
    {
      title: 'Personais Ativos',
      value: metrics.activePersonals,
      icon: UserCheck,
      desc: 'Com acesso liberado',
    },
    {
      title: 'Personais Pendentes',
      value: metrics.pendingPersonals,
      icon: User,
      desc: 'Aguardando aprovação',
    },
    {
      title: 'Personais Inativos',
      value: metrics.inactivePersonals,
      icon: UserX,
      desc: 'Acesso bloqueado',
    },
    {
      title: 'Assinaturas Ativas',
      value: metrics.activeSubscriptions,
      icon: CreditCard,
      desc: 'Planos vigentes',
    },
    {
      title: 'Assinaturas Vencidas',
      value: metrics.expiredSubscriptions,
      icon: AlertCircle,
      desc: 'Planos expirados',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral e métricas do sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
