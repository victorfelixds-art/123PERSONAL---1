import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus } from 'lucide-react'

export default function Alunos() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie seus alunos e seus progressos.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Novo Aluno
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar aluno..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border p-8 text-center text-muted-foreground">
        <p>Nenhum aluno encontrado ou lista vazia.</p>
        <p className="text-sm">Comece adicionando um novo aluno.</p>
      </div>
    </div>
  )
}
