import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { User } from 'lucide-react'
import { useParams } from 'react-router-dom'

export default function AlunoDetalhes() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalhes do Aluno"
        description={`Gerenciamento do aluno #${id}`}
      />
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
          <User className="h-8 w-8 opacity-50" />
          <p>Detalhes do aluno serão exibidos aqui</p>
        </CardContent>
      </Card>
    </div>
  )
}
