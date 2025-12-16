import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Agenda() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground">Gerencie seus horários e aulas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em construção...</p>
        </CardContent>
      </Card>
    </div>
  )
}
