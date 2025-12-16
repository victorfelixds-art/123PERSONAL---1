import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function Financeiro() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Controle seus ganhos e despesas."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Transação
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 0,00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 0,00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ 0,00</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Histórico de transações vazio.
        </CardContent>
      </Card>
    </div>
  )
}
