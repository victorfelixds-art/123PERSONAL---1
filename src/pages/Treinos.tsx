import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Dumbbell } from 'lucide-react'

export default function Treinos() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Treinos"
        description="Biblioteca de treinos e exercícios."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Criar Treino
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
        <Card className="col-span-full py-12 flex flex-col items-center justify-center text-center border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Biblioteca Vazia</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Comece criando modelos de treino para agilizar suas prescrições.
          </p>
          <Button>Criar Primeiro Modelo</Button>
        </Card>
      </div>
    </div>
  )
}
