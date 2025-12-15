import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Client } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Search, User, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { isBefore, addDays } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const Alunos = () => {
  const { clients, addClient, workouts, diets, events, transactions } =
    useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<
    'todos' | 'ativos' | 'inativos' | 'atencao'
  >('todos')
  const [newClientName, setNewClientName] = useState('')

  const checkAttention = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (client?.status === 'inactive') return false

    // 1. Payment Attention (Overdue or Due Soon)
    const hasPaymentAttention = transactions.some(
      (t) =>
        t.studentId === clientId &&
        ((t.status === 'pending' &&
          isBefore(new Date(t.dueDate), addDays(new Date(), 5))) ||
          t.status === 'overdue'),
    )

    // 2. Workout Expired
    const hasExpiredWorkout = workouts.some(
      (w) =>
        w.clientId === clientId &&
        !w.isLifetime &&
        w.expirationDate &&
        isBefore(new Date(w.expirationDate), new Date()),
    )

    // 3. Diet Expired
    const hasExpiredDiet = diets.some(
      (d) =>
        d.clientId === clientId &&
        !d.isLifetime &&
        d.expirationDate &&
        isBefore(new Date(d.expirationDate), new Date()),
    )

    // 4. Agenda Event Today or Overdue
    const hasEventAttention = events.some(
      (e) =>
        e.studentId === clientId &&
        (isBefore(e.date, new Date()) ||
          new Date(e.date).toDateString() === new Date().toDateString()),
    )

    return (
      hasPaymentAttention ||
      hasExpiredWorkout ||
      hasExpiredDiet ||
      hasEventAttention
    )
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterType === 'todos'
        ? true
        : filterType === 'atencao'
          ? checkAttention(client.id)
          : filterType === 'ativos'
            ? client.status === 'active'
            : client.status === 'inactive'

    return matchesSearch && matchesStatus
  })

  const handleCreateClient = () => {
    if (!newClientName.trim()) {
      toast.error('Nome é obrigatório')
      return
    }

    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClientName,
      email: '',
      phone: '',
      status: 'active',
      profileStatus: 'incomplete',
      linkActive: false,
      since: new Date().toISOString().split('T')[0],
      planName: 'Indefinido',
      planValue: 0,
    }

    addClient(newClient)
    toast.success('Aluno adicionado com sucesso!')
    setNewClientName('')
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <Button
          onClick={() => {
            setNewClientName('')
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar alunos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {(['todos', 'ativos', 'inativos', 'atencao'] as const).map(
              (type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  onClick={() => setFilterType(type)}
                  className="capitalize whitespace-nowrap"
                >
                  {type === 'atencao' ? 'Com Atenção' : type}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Aluno</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Aluno</Label>
              <Input
                id="name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ex: João Silva"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateClient()}
              />
              <p className="text-xs text-muted-foreground">
                Você poderá preencher o restante dos dados depois ou enviar o
                link para o aluno.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateClient}>Criar Aluno</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Link key={client.id} to={`/alunos/${client.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full relative overflow-hidden group">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 bg-muted">
                    <AvatarFallback className="text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {checkAttention(client.id) && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-background animate-pulse">
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
                  <div className="flex gap-2 mt-1">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase',
                        client.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800',
                      )}
                    >
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                    {client.profileStatus === 'incomplete' &&
                      client.status === 'active' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-yellow-100 text-yellow-800">
                          Incompleto
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
          <p>Nenhum aluno encontrado para o filtro selecionado.</p>
        </div>
      )}
    </div>
  )
}

export default Alunos
