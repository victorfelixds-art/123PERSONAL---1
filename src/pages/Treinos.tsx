import { Button } from '@/components/ui/button'
import { Dumbbell, Plus } from 'lucide-react'

export default function Treinos() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Biblioteca de Treinos
          </h1>
          <p className="text-muted-foreground">
            Crie e organize seus modelos de treino.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Treino
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-fade-in-up">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Dumbbell className="h-6 w-6 text-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Sem treinos</h3>
          <p className="text-sm text-muted-foreground">
            Crie seu primeiro modelo de treino para começar.
          </p>
        </div>
      </div>
    </div>
  )
}
