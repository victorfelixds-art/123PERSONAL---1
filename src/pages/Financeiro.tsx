import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { DollarSign, Users, PieChart as PieChartIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const Financeiro = () => {
  const { clients } = useAppStore()

  const activeClients = clients.filter((c) => c.status === 'active')
  const totalStudents = activeClients.length

  // Calculate revenue based on assigned planValue
  const estimatedRevenue = activeClients.reduce(
    (acc, curr) => acc + (curr.planValue || 0),
    0,
  )

  const planCounts = activeClients.reduce(
    (acc, curr) => {
      const planName = curr.planName || 'Sem Plano'
      acc[planName] = (acc[planName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const planTypes = Object.keys(planCounts)

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">
        Financeiro (Simulado)
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Estimada (Mensal)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {estimatedRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado nos planos ativos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
          <CardDescription>Como seus alunos estão distribuídos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {planTypes.map((type) => {
            const count = planCounts[type] || 0
            const percentage = totalStudents ? (count / totalStudents) * 100 : 0
            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize font-medium">{type}</span>
                  <span className="text-muted-foreground">
                    {count} aluno(s) ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
          {totalStudents === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <PieChartIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Sem dados suficientes para exibir gráficos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Financeiro
