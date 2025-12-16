import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AlunoDetalhes() {
  const { id } = useParams()

  return (
    <div className="space-y-6 animate-fade-in">
      <Button asChild variant="ghost" className="gap-2 -ml-4">
        <Link to="/alunos">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Alunos
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalhes do Aluno
          </h1>
          <p className="text-muted-foreground">ID: {id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Dados do aluno em construção...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
