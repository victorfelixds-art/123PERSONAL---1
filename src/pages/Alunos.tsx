import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Client } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Search,
  ChevronRight,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
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
import { isBefore, addDays, parseISO } from 'date-fns'
import { Badge } from '@/components/ui/badge'

const Alunos = () => {
  const { clients, addClient } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<
    'todos' | 'ativos' | 'inativos' | 'atencao'
  >('todos')
  const [newClientName, setNewClientName] = useState('')

  const getClientStatus = (client: Client) => {
    if (client.status === 'inactive') return 'inactive'
    if (client.planEndDate) {
      const endDate = parseISO(client.planEndDate)
      const today = new Date()
      if (isBefore(endDate, today)) return 'inactive'
      if (isBefore(endDate, addDays(today, 5))) return 'attention'
    }
    return 'active'
  }

  const filteredClients = clients.filter((client) => {
    const status = getClientStatus(client)
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterType === 'todos'
        ? true
        : filterType === 'atencao'
          ? status === 'attention'
          : filterType === 'ativos'
            ? status === 'active'
            : status === 'inactive'

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
    }

    addClient(newClient)
    toast.success('Aluno adicionado com sucesso!')
    setNewClientName('')
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">
          Alunos
        </h1>
        <Button
          size="lg"
          onClick={() => {
            setNewClientName('')
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-5 w-5" /> Adicionar
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {(['todos', 'ativos', 'inativos', 'atencao'] as const).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type)}
              className="capitalize whitespace-nowrap h-12 px-6 rounded-lg font-bold"
            >
              {type === 'atencao' ? 'Atenção' : type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => {
          const status = getClientStatus(client)
          return (
            <Link
              key={client.id}
              to={`/alunos/${client.id}`}
              className="block h-full"
            >
              <Card className="h-full hover:border-primary/60 transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold truncate pr-2">
                        {client.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {client.objective || 'Sem objetivo definido'}
                      </p>
                    </div>
                    {status === 'attention' && (
                      <div className="animate-pulse text-yellow-400">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex gap-2">
                      <Badge
                        variant={status === 'active' ? 'default' : 'secondary'}
                        className="font-bold"
                      >
                        {status === 'active'
                          ? 'ATIVO'
                          : status === 'attention'
                            ? 'ATENÇÃO'
                            : 'INATIVO'}
                      </Badge>
                      {client.planName && (
                        <Badge
                          variant="outline"
                          className="font-medium bg-transparent"
                        >
                          {client.planName}
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/5 border-2 border-dashed rounded-xl">
          <TrendingUp className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">Nenhum aluno encontrado.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Aluno</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ex: João Silva"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateClient()}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateClient}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Alunos
