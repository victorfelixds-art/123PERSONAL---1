import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Treinos() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
            <p className="text-muted-foreground">
              Crie e gerencie fichas de treino.
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Treino
        </Button>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Biblioteca de treinos vazia.</p>
        </CardContent>
      </Card>
    </div>
  )
}
