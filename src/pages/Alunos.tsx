import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Alunos() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
            <p className="text-muted-foreground">
              Gerencie seus alunos e seus progressos.
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Nenhum aluno cadastrado.</p>
        </CardContent>
      </Card>
    </div>
  )
}
