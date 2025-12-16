import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function Agenda() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Calendar className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie seus horários e aulas.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Funcionalidade de calendário em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
