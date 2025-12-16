import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Utensils } from 'lucide-react'

export default function Dieta() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dietas e Nutrição"
        description="Gerencie planos alimentares e modelos de dieta."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Dieta
          </Button>
        }
      />

      <div className="grid gap-6 animate-fade-in-up">
        <Card className="py-12 flex flex-col items-center justify-center text-center border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Nenhuma Dieta Cadastrada</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Crie modelos de dieta ou planos alimentares específicos para seus
            alunos.
          </p>
          <Button>Criar Plano Alimentar</Button>
        </Card>
      </div>
    </div>
  )
}
