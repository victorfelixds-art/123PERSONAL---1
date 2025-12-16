import { Button } from '@/components/ui/button'
import { Utensils, Plus } from 'lucide-react'

export default function Dieta() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Planos Alimentares
          </h1>
          <p className="text-muted-foreground">
            Gerencie dietas e modelos de refeição.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Dieta
        </Button>
      </div>

      <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-fade-in-up">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Utensils className="h-6 w-6 text-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Sem planos alimentares</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Crie modelos de dieta para atribuir facilmente aos seus alunos.
        </p>
      </div>
    </div>
  )
}
