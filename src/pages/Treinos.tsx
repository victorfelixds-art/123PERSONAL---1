import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Dumbbell } from 'lucide-react'

export default function Treinos() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Treinos"
        description="Biblioteca de treinos e atribuições."
      />
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
          <Dumbbell className="h-8 w-8 opacity-50" />
          <p>Biblioteca de treinos será exibida aqui</p>
        </CardContent>
      </Card>
    </div>
  )
}
