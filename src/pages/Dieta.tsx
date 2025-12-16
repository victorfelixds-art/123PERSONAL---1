import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Dieta() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dieta</h1>
            <p className="text-muted-foreground">Elabore planos alimentares.</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Nenhum plano alimentar criado.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
