import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function Alunos() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alunos"
        description="Gerencie seus alunos e seus progressos."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Aluno
          </Button>
        }
      />

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar alunos..." className="pl-8" />
        </div>
      </div>

      <Card className="animate-fade-in-up">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum aluno cadastrado ainda.
          </p>
          <Button variant="link" className="mt-2">
            Cadastrar primeiro aluno
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
