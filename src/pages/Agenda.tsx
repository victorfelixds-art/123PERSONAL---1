import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function Agenda() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Gerencie seus horários e sessões de treino."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full h-[400px] flex items-center justify-center border-dashed">
          <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
            <Calendar className="h-8 w-8 opacity-50" />
            <p>Calendário será exibido aqui</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
