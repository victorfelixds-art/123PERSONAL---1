import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Alunos() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <p className="text-muted-foreground">
          Gerencie seus alunos e seus progressos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em construção...</p>
        </CardContent>
      </Card>
    </div>
  )
}
