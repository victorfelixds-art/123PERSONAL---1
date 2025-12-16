import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Treinos() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
        <p className="text-muted-foreground">
          Crie e gerencie fichas de treino.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em construção...</p>
        </CardContent>
      </Card>
    </div>
  )
}
