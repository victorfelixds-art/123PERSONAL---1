import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Client } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, User, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { StudentForm } from '@/components/forms/StudentForm'
import { isBefore } from 'date-fns'

const Alunos = () => {
  const { clients, addClient, updateClient, workouts, diets, events } =
    useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>(
    undefined,
  )

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSave = (data: Partial<Client>) => {
    if (editingClient) {
      updateClient({ ...editingClient, ...data } as Client)
      toast.success('Aluno atualizado!')
    } else {
      addClient({
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: 'active',
        since: new Date().toISOString().split('T')[0],
        avatar: `https://img.usecurling.com/ppl/medium?gender=${Math.random() > 0.5 ? 'male' : 'female'}&seed=${Math.random()}`,
      } as Client)
      toast.success('Aluno adicionado!')
    }
    setIsDialogOpen(false)
    setEditingClient(undefined)
  }

  const checkAttention = (clientId: string) => {
    const hasExpiredWorkout = workouts.some(
      (w) =>
        w.clientId === clientId &&
        !w.isLifetime &&
        w.expirationDate &&
        isBefore(new Date(w.expirationDate), new Date()),
    )
    const hasExpiredDiet = diets.some(
      (d) =>
        d.clientId === clientId &&
        !d.isLifetime &&
        d.expirationDate &&
        isBefore(new Date(d.expirationDate), new Date()),
    )
    const hasEventToday = events.some(
      (e) =>
        e.studentId === clientId &&
        new Date(e.date).toDateString() === new Date().toDateString(),
    )
    return hasExpiredWorkout || hasExpiredDiet || hasEventToday
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <Button
          onClick={() => {
            setEditingClient(undefined)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Editar Aluno' : 'Novo Aluno'}
            </DialogTitle>
          </DialogHeader>
          <StudentForm
            initialData={editingClient}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar alunos..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Link key={client.id} to={`/alunos/${client.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full relative overflow-hidden group">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {checkAttention(client.id) && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-background">
                      <AlertCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {client.name}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium',
                      client.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                    )}
                  >
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault()
                      setEditingClient(client)
                      setIsDialogOpen(true)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {filteredClients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum aluno encontrado.</p>
        </div>
      )}
    </div>
  )
}

export default Alunos
