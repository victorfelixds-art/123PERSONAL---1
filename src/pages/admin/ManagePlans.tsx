import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function ManagePlans() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Planos
          </h1>
          <p className="text-muted-foreground">
            Configure os planos de assinatura disponíveis.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Plano Básico</CardTitle>
            <CardDescription>Para iniciantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 49,90/mês</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Até 10 alunos</li>
              <li>Treinos ilimitados</li>
              <li>Suporte básico</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Plano Pro</CardTitle>
            <CardDescription>O mais popular</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 99,90/mês</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Até 50 alunos</li>
              <li>Treinos e Dietas</li>
              <li>Suporte prioritário</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
