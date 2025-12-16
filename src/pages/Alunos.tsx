import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function Alunos() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Meus Alunos"
        description="Gerencie seus alunos e acompanhe o progresso."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full h-[400px] flex items-center justify-center border-dashed">
          <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
            <Users className="h-8 w-8 opacity-50" />
            <p>Lista de alunos será exibida aqui</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
