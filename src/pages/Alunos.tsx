import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Client } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  User,
  ChevronRight,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { StudentForm } from '@/components/forms/StudentForm'
import { isBefore, addDays } from 'date-fns'

const Alunos = () => {
  const {
    clients,
    addClient,
    updateClient,
    workouts,
    diets,
    events,
    transactions,
  } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<
    'todos' | 'ativos' | 'inativos' | 'atencao'
  >('todos')
  const [editingClient, setEditingClient] = useState<Client | undefined>(
    undefined,
  )
  const [generatedLinkClient, setGeneratedLinkClient] = useState<
    Client | undefined
  >(undefined)

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

  const generateLink = () => {
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Aluno (Link)',
      email: 'pendente@email.com',
      phone: '',
      status: 'active',
      since: new Date().toISOString().split('T')[0],
      linkId: Math.random().toString(36).substr(2, 9),
      planName: 'Indefinido',
      planValue: 0,
      avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=new',
    }
    addClient(newClient)
    setGeneratedLinkClient(newClient)
    toast.success('Link gerado e aluno provisório criado!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <Button
          onClick={() => {
            setEditingClient(undefined)
            setGeneratedLinkClient(undefined)
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Editar Aluno' : 'Novo Aluno'}
            </DialogTitle>
          </DialogHeader>

          {editingClient ? (
            <StudentForm
              initialData={editingClient}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          ) : (
            <Tabs defaultValue="manual">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="link">Link de Cadastro</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <StudentForm
                  initialData={undefined}
                  onSave={handleSave}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </TabsContent>
              <TabsContent value="link" className="space-y-4 py-4">
                {!generatedLinkClient ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Gere um link único para enviar ao seu aluno. Ele poderá
                      preencher os dados iniciais (Peso, Altura, Objetivo).
                    </p>
                    <Button onClick={generateLink} className="w-full">
                      Gerar Link Único
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <p className="text-sm font-medium">Link gerado:</p>
                      <div className="flex items-center gap-2 bg-background p-2 rounded border">
                        <code className="text-xs flex-1 truncate">
                          {window.location.origin}/p/
                          {generatedLinkClient.linkId}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/p/${generatedLinkClient.linkId}`,
                            )
                            toast.success('Copiado!')
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={`/p/${generatedLinkClient.linkId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        O aluno "Novo Aluno (Link)" foi criado na sua lista.
                        Você pode editá-lo posteriormente.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full"
                    >
                      Fechar
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

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
          <p>Nenhum aluno encontrado para o filtro selecionado.</p>
        </div>
      )}
    </div>
  )
}

export default Alunos
