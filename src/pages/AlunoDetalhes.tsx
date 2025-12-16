import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams } from 'react-router-dom'

export default function AlunoDetalhes() {
  const { id } = useParams()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes do Aluno</h1>
        <p className="text-muted-foreground">
          Gerencie as informações do aluno ID: {id}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em construção...</p>
        </CardContent>
      </Card>
    </div>
  )
}
