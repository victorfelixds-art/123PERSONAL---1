import { useState, useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  DollarSign,
  Users,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
  isBefore,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { generateFinancialPDF } from '@/lib/pdfGenerator'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Financeiro = () => {
  const {
    transactions,
    clients,
    markTransactionAsPaid,
    updateTransaction,
    profile,
    settings,
    plans,
  } = useAppStore()

  // Filters
  const [periodFilter, setPeriodFilter] = useState('current_month')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [customRange, setCustomRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  })

  // Edit Due Date State
  const [editingTransaction, setEditingTransaction] = useState<string | null>(
    null,
  )
  const [newDueDate, setNewDueDate] = useState('')

  // Compute date range based on filter
  const dateRange = useMemo(() => {
    const today = new Date()
    switch (periodFilter) {
      case 'current_month':
        return { start: startOfMonth(today), end: endOfMonth(today) }
      case 'last_3_months':
        return { start: subMonths(today, 3), end: today }
      case 'last_6_months':
        return { start: subMonths(today, 6), end: today }
      case 'custom':
        return {
          start: parseISO(customRange.start),
          end: parseISO(customRange.end),
        }
      default:
        return { start: startOfMonth(today), end: endOfMonth(today) }
    }
  }, [periodFilter, customRange])

  // Filter Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = parseISO(t.dueDate)
      const inDateRange = isWithinInterval(tDate, dateRange)

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'overdue'
            ? t.status === 'overdue' ||
              (t.status === 'pending' && isBefore(tDate, new Date()))
            : t.status === statusFilter

      const matchesPlan =
        planFilter === 'all'
          ? true
          : t.planId === planFilter || t.planName === planFilter

      return inDateRange && matchesStatus && matchesPlan
    })
  }, [transactions, dateRange, statusFilter, planFilter])

  // Metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredTransactions
      .filter((t) => t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalPending = filteredTransactions
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalOverdue = filteredTransactions
      .filter(
        (t) =>
          t.status === 'overdue' ||
          (t.status === 'pending' && isBefore(parseISO(t.dueDate), new Date())),
      )
      .reduce((sum, t) => sum + t.amount, 0)

    const activeStudentsCount = clients.filter(
      (c) => c.status === 'active',
    ).length
    const mrr = clients
      .filter((c) => c.status === 'active' && c.planValue && c.planId)
      .reduce((acc, c) => {
        const plan = plans.find((p) => p.id === c.planId)
        return acc + c.planValue / (plan?.durationInMonths || 1)
      }, 0)

    const avgTicket = activeStudentsCount > 0 ? mrr / activeStudentsCount : 0

    return {
      totalRevenue,
      totalPending,
      totalOverdue,
      activeStudentsCount,
      mrr,
      avgTicket,
    }
  }, [filteredTransactions, clients, plans])

  // Chart Config
  const chartConfig = {
    revenue: {
      label: 'Receita',
      color: 'hsl(var(--primary))',
    },
    paid: {
      label: 'Pago',
      color: 'hsl(var(--success))',
    },
    pending: {
      label: 'Pendente',
      color: 'hsl(var(--muted-foreground))',
    },
    overdue: {
      label: 'Vencido',
      color: 'hsl(var(--destructive))',
    },
  } satisfies ChartConfig

  // Charts Data
  const revenueData = useMemo(() => {
    const grouped = filteredTransactions
      .filter((t) => t.status === 'paid')
      .reduce(
        (acc, t) => {
          const monthKey = format(parseISO(t.dueDate), 'MMM/yy', {
            locale: ptBR,
          })
          acc[monthKey] = (acc[monthKey] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  const planData = useMemo(() => {
    const grouped = filteredTransactions.reduce(
      (acc, t) => {
        const key = t.planName || 'Outros'
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  const statusData = useMemo(() => {
    const counts = { paid: 0, pending: 0, overdue: 0 }
    filteredTransactions.forEach((t) => {
      if (t.status === 'paid') counts.paid += t.amount
      else if (
        t.status === 'overdue' ||
        (t.status === 'pending' && isBefore(parseISO(t.dueDate), new Date()))
      )
        counts.overdue += t.amount
      else counts.pending += t.amount
    })

    return [
      { name: 'paid', value: counts.paid, fill: 'var(--color-paid)' },
      { name: 'pending', value: counts.pending, fill: 'var(--color-pending)' },
      { name: 'overdue', value: counts.overdue, fill: 'var(--color-overdue)' },
    ]
  }, [filteredTransactions])

  const handleExport = () => {
    let periodLabel = ''
    if (periodFilter === 'current_month') periodLabel = 'Mês Atual'
    if (periodFilter === 'last_3_months') periodLabel = 'Últimos 3 Meses'
    if (periodFilter === 'last_6_months') periodLabel = 'Últimos 6 Meses'
    if (periodFilter === 'custom')
      periodLabel = `${format(parseISO(customRange.start), 'dd/MM/yy')} até ${format(parseISO(customRange.end), 'dd/MM/yy')}`

    generateFinancialPDF(
      filteredTransactions,
      profile,
      settings.theme,
      periodLabel,
      metrics,
    )
    toast.success('Relatório gerado!')
  }

  const handleSaveDueDate = () => {
    if (editingTransaction && newDueDate) {
      const transaction = transactions.find((t) => t.id === editingTransaction)
      if (transaction) {
        updateTransaction({ ...transaction, dueDate: newDueDate })
        toast.success('Data de vencimento atualizada!')
        setEditingTransaction(null)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in pb-24 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">
          Financeiro
        </h1>
        <Button onClick={handleExport} size="lg">
          <Download className="mr-2 h-5 w-5" /> Exportar Relatório
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">Mês Atual</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="last_6_months">Últimos 6 Meses</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {periodFilter === 'custom' && (
              <div className="space-y-2 sm:col-span-2 lg:col-span-1 flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Início</Label>
                  <Input
                    type="date"
                    value={customRange.start}
                    onChange={(e) =>
                      setCustomRange({ ...customRange, start: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Fim</Label>
                  <Input
                    type="date"
                    value={customRange.end}
                    onChange={(e) =>
                      setCustomRange({ ...customRange, end: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-500">
              R$ {metrics.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              MRR
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-500">
              R$ {metrics.mrr.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Alunos Ativos
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">
              {metrics.activeStudentsCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">
              R$ {metrics.avgTicket.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="uppercase">Receita</CardTitle>
            <CardDescription>Valores recebidos por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                  name="Receita"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="uppercase">Status</CardTitle>
            <CardDescription>Pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="uppercase">Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="uppercase font-bold text-xs">
                  Aluno
                </TableHead>
                <TableHead className="uppercase font-bold text-xs">
                  Plano
                </TableHead>
                <TableHead className="uppercase font-bold text-xs">
                  Valor
                </TableHead>
                <TableHead className="uppercase font-bold text-xs">
                  Vencimento
                </TableHead>
                <TableHead className="uppercase font-bold text-xs">
                  Status
                </TableHead>
                <TableHead className="text-right uppercase font-bold text-xs">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Nenhum pagamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((t) => {
                  const isOverdue =
                    (t.status === 'overdue' || t.status === 'pending') &&
                    isBefore(parseISO(t.dueDate), new Date())
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-bold">
                        {t.studentName || '-'}
                      </TableCell>
                      <TableCell>{t.planName || '-'}</TableCell>
                      <TableCell className="font-medium">
                        R$ {t.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(t.dueDate), 'dd/MM/yyyy')}
                        {isOverdue && t.status !== 'paid' && (
                          <span className="ml-2 text-xs text-destructive font-bold">
                            !
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
                            t.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : isOverdue
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800',
                          )}
                        >
                          {t.status === 'paid'
                            ? 'Pago'
                            : isOverdue
                              ? 'Vencido'
                              : 'Pendente'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {t.status !== 'paid' && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => markTransactionAsPaid(t.id)}
                            title="Marcar como Pago"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingTransaction(t.id)
                            setNewDueDate(t.dueDate)
                          }}
                          title="Editar Vencimento"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Data de Vencimento</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Nova Data</Label>
            <Input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingTransaction(null)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveDueDate}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Financeiro
