import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  MoreVertical,
  MessageCircle,
  Link as LinkIcon,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { StudentForm } from '@/components/forms/StudentForm'
import { StudentSummary } from '@/components/student/StudentSummary'
import { DeliverablesTab } from '@/components/student/DeliverablesTab'
import { cn } from '@/lib/utils'
import { WorkoutForm } from '@/components/forms/WorkoutForm'
import { DietForm } from '@/components/forms/DietForm'
import { EventForm } from '@/components/forms/EventForm'
import { Workout, Diet, CalendarEvent } from '@/lib/types'
import { format, parseISO, isBefore, addMonths, isSameDay } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const AlunoDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    clients,
    removeClient,
    updateClient,
    workouts,
    addWorkout,
    removeWorkout,
    assignWorkout,
    diets,
    addDiet,
    removeDiet,
    assignDiet,
    events,
    addEvent,
    updateEvent,
    removeEvent,
    generateStudentLink,
    settings,
    profile,
    plans,
  } = useAppStore()

  // State
  const [activeTab, setActiveTab] = useState('dados')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isWorkoutFormOpen, setIsWorkoutFormOpen] = useState(false)
  const [isDietFormOpen, setIsDietFormOpen] = useState(false)
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false)
  const [isAssignDietOpen, setIsAssignDietOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(
    undefined,
  )
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  const client = clients.find((c) => c.id === id)
  const clientWorkouts = workouts.filter((w) => w.clientId === id)
  const clientDiets = diets.filter((d) => d.clientId === id)
  const clientEvents = events
    .filter((e) => e.studentId === id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab) setActiveTab(tab)
  }, [])

  if (!client) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Aluno não encontrado</h2>
        <Button onClick={() => navigate('/alunos')}>Voltar para Lista</Button>
      </div>
    )
  }

  // Actions
  const handleWhatsApp = () => {
    const template =
      settings.whatsappMessageTemplate ||
      'Olá {studentName}! Aqui é o {personalName}.'
    const message = template
      .replace('{studentName}', client.name)
      .replace('{personalName}', profile.name)
    const encodedMessage = encodeURIComponent(message)
    const phone = client.phone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
  }

  const handleLinkAction = () => {
    if (!client.linkId || !client.linkActive) {
      generateStudentLink(client.id)
      toast.success('Link gerado!')
    } else {
      const link = `${window.location.origin}/p/${client.linkId}`
      navigator.clipboard.writeText(link)
      toast.success('Link copiado!')
    }
  }

  const handleDeleteClient = () => {
    if (
      confirm(
        'Tem certeza que deseja remover este aluno? Esta ação é irreversível.',
      )
    ) {
      removeClient(client.id)
      toast.success('Aluno removido')
      navigate('/alunos')
    }
  }

  // Handlers for Workout/Diet/Event
  const handleCreateWorkout = (data: Partial<Workout>) => {
    addWorkout({
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      clientId: client.id,
      clientName: client.name,
      exercises: data.exercises || [],
      isLifetime: true,
    } as Workout)
    setIsWorkoutFormOpen(false)
    toast.success('Treino criado!')
  }

  const handleCreateDiet = (data: Partial<Diet>) => {
    addDiet({
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      clientId: client.id,
      clientName: client.name,
      meals: data.meals || [],
      isLifetime: true,
    } as Diet)
    setIsDietFormOpen(false)
    toast.success('Dieta criada!')
  }

  const handleEventSave = (data: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) updateEvent({ ...editingEvent, ...data })
    else addEvent({ id: Math.random().toString(36).substr(2, 9), ...data })
    setIsEventFormOpen(false)
    toast.success('Compromisso salvo')
  }

  const handleAssignExistingWorkout = () => {
    if (!selectedTemplateId) return
    assignWorkout(
      selectedTemplateId,
      [client.id],
      new Date().toISOString().split('T')[0],
      null,
      true,
    )
    setIsAssignWorkoutOpen(false)
    toast.success('Treino atribuído!')
  }

  const handleAssignExistingDiet = () => {
    if (!selectedTemplateId) return
    assignDiet(
      selectedTemplateId,
      [client.id],
      new Date().toISOString().split('T')[0],
      null,
      true,
    )
    setIsAssignDietOpen(false)
    toast.success('Dieta atribuída!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in pb-24">
      {/* Revised Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => navigate('/alunos')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                variant={client.status === 'active' ? 'default' : 'secondary'}
              >
                {client.status.toUpperCase()}
              </Badge>
              {client.profileStatus === 'incomplete' ? (
                <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-200 bg-yellow-50"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" /> Perfil Incompleto
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-200 bg-green-50"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Perfil Completo
                </Badge>
              )}
              <span className="text-sm text-muted-foreground ml-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Desde {new Date(client.since).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-wrap gap-2">
        <Button
          className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
        </Button>
        <Button
          variant="outline"
          className="flex-1 md:flex-none"
          onClick={handleLinkAction}
        >
          <LinkIcon className="mr-2 h-4 w-4" />{' '}
          {client.linkId ? 'Copiar Link' : 'Gerar Link'}
        </Button>
        <Button
          variant="outline"
          className="flex-1 md:flex-none"
          onClick={() => setIsEditingProfile(true)}
        >
          <Edit className="mr-2 h-4 w-4" /> Editar Dados
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                updateClient({
                  ...client,
                  status: client.status === 'active' ? 'inactive' : 'active',
                })
              }
            >
              <Ban className="mr-2 h-4 w-4" />{' '}
              {client.status === 'active' ? 'Inativar' : 'Reativar'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDeleteClient}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Summary Cards */}
      <StudentSummary client={client} />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 gap-1">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="plano">Plano</TabsTrigger>
          <TabsTrigger value="treinos">Treinos</TabsTrigger>
          <TabsTrigger value="dietas">Dietas</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger
            value="entregaveis"
            className="bg-primary/5 text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Entregáveis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{client.email || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{client.phone || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plano" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-lg font-bold">{client.planName}</p>
                <p className="text-muted-foreground">
                  R$ {client.planValue?.toFixed(2)}
                </p>
                {client.planStartDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Início:{' '}
                    {format(parseISO(client.planStartDate), 'dd/MM/yyyy')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treinos" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Treinos Ativos</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssignWorkoutOpen(true)}
              >
                Atribuir
              </Button>
              <Button size="sm" onClick={() => setIsWorkoutFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Novo
              </Button>
            </div>
          </div>
          {clientWorkouts.map((w) => (
            <Card key={w.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{w.title}</p>
                  <p className="text-xs text-muted-foreground">{w.objective}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeWorkout(w.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {clientWorkouts.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhum treino.
            </p>
          )}
        </TabsContent>

        <TabsContent value="dietas" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Dietas Ativas</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssignDietOpen(true)}
              >
                Atribuir
              </Button>
              <Button size="sm" onClick={() => setIsDietFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Nova
              </Button>
            </div>
          </div>
          {clientDiets.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.type}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeDiet(d.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {clientDiets.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhuma dieta.
            </p>
          )}
        </TabsContent>

        <TabsContent value="agenda" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Agenda</h3>
            <Button
              size="sm"
              onClick={() => {
                setEditingEvent(undefined)
                setIsEventFormOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Agendar
            </Button>
          </div>
          {clientEvents.map((e) => (
            <Card
              key={e.id}
              className={cn('mb-2', e.completed && 'opacity-60')}
            >
              <CardContent className="p-3 flex justify-between items-center">
                <div>
                  <p
                    className={cn('font-medium', e.completed && 'line-through')}
                  >
                    {e.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(e.date), "dd/MM 'às' HH:mm")}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!e.completed && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-green-600"
                      onClick={() => updateEvent({ ...e, completed: true })}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteEventId(e.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {clientEvents.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhum agendamento.
            </p>
          )}
        </TabsContent>

        <TabsContent value="entregaveis" className="mt-4">
          <DeliverablesTab
            client={client}
            workouts={clientWorkouts}
            diets={clientDiets}
            profile={profile}
            settings={settings}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <StudentForm
            initialData={client}
            onSave={(data) => {
              updateClient({ ...client, ...data })
              setIsEditingProfile(false)
              toast.success('Atualizado!')
            }}
            onCancel={() => setIsEditingProfile(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWorkoutFormOpen} onOpenChange={setIsWorkoutFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Treino</DialogTitle>
          </DialogHeader>
          <WorkoutForm
            onSave={handleCreateWorkout}
            onCancel={() => setIsWorkoutFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDietFormOpen} onOpenChange={setIsDietFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Dieta</DialogTitle>
          </DialogHeader>
          <DietForm
            onSave={handleCreateDiet}
            onCancel={() => setIsDietFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Editar' : 'Novo'} Compromisso
            </DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={editingEvent}
            preSelectedStudentId={client.id}
            onSave={handleEventSave}
            onCancel={() => setIsEventFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignWorkoutOpen} onOpenChange={setIsAssignWorkoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Treino</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {workouts
                .filter((w) => !w.clientId)
                .map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleAssignExistingWorkout}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDietOpen} onOpenChange={setIsAssignDietOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Dieta</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {diets
                .filter((d) => !d.clientId)
                .map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleAssignExistingDiet}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteEventId}
        onOpenChange={(open) => !open && setDeleteEventId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir?</AlertDialogTitle>
            <AlertDialogDescription>Irreversível.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteEventId) removeEvent(deleteEventId)
                setDeleteEventId(null)
              }}
              className="bg-destructive"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AlunoDetalhes
