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
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
  MoreHorizontal,
  MessageCircle,
  Link as LinkIcon,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
  Plus,
  Mail,
  Phone,
  Dumbbell,
  Utensils,
  Clock,
  RefreshCw,
  PowerOff,
  ClipboardCopy,
} from 'lucide-react'
import { toast } from 'sonner'
import { StudentForm } from '@/components/forms/StudentForm'
import { StudentSummary } from '@/components/student/StudentSummary'
import { DeliverablesTab } from '@/components/student/DeliverablesTab'
import { PlanTab } from '@/components/student/PlanTab'
import { cn } from '@/lib/utils'
import { WorkoutForm } from '@/components/forms/WorkoutForm'
import { DietForm } from '@/components/forms/DietForm'
import { EventForm } from '@/components/forms/EventForm'
import { Workout, Diet, CalendarEvent } from '@/lib/types'
import { format, parseISO, isBefore, addDays } from 'date-fns'
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
import { Separator } from '@/components/ui/separator'

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
    regenerateStudentLink,
    deactivateStudentLink,
    settings,
    profile,
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
      <div className="container mx-auto p-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Aluno não encontrado</h2>
        <Button onClick={() => navigate('/alunos')}>Voltar para Lista</Button>
      </div>
    )
  }

  // Derived Status Logic for Display
  const getDisplayStatus = () => {
    if (client.status === 'inactive') return 'Inativo'
    if (client.planEndDate) {
      const endDate = parseISO(client.planEndDate)
      const today = new Date()
      if (isBefore(endDate, today)) return 'Inativo'
      if (isBefore(endDate, addDays(today, 5))) return 'Atenção'
    }
    return 'Ativo'
  }
  const displayStatus = getDisplayStatus()

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

  const handleGenerateLink = () => {
    generateStudentLink(client.id)
    toast.success('Link gerado com sucesso!')
  }

  const handleCopyLink = () => {
    if (client.linkId && client.linkActive) {
      const link = `${window.location.origin}/p/${client.linkId}`
      navigator.clipboard.writeText(link)
      toast.success('Link copiado!')
    }
  }

  const handleRegenerateLink = () => {
    regenerateStudentLink(client.id)
    toast.success('Novo link gerado! O anterior foi invalidado.')
  }

  const handleDeactivateLink = () => {
    deactivateStudentLink(client.id)
    toast.success('Link desativado.')
  }

  const handleDeleteClient = () => {
    removeClient(client.id)
    toast.success('Aluno removido')
    navigate('/alunos')
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
    <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-fade-in pb-24">
      {/* Revised Header */}
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/alunos')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Alunos
        </Button>

        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 border-b pb-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground uppercase">
                {client.name}
              </h1>
              {displayStatus === 'Ativo' ? (
                <Badge className="bg-green-600 text-white hover:bg-green-700 border-none px-3 py-1">
                  Ativo
                </Badge>
              ) : displayStatus === 'Atenção' ? (
                <Badge className="bg-yellow-600 text-white hover:bg-yellow-700 border-none px-3 py-1">
                  Atenção
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-3 py-1">
                  Inativo
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Desde {new Date(client.since).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />
              <div className="flex items-center gap-1.5">
                {client.profileStatus === 'complete' ? (
                  <span className="flex items-center gap-1.5 text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> Perfil Completo
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-yellow-400">
                    <AlertTriangle className="h-4 w-4" /> Perfil Incompleto
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md border-none"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-4">
                  Ações <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Gerenciar Aluno</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsEditingProfile(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar Dados
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuLabel>Link de Preenchimento</DropdownMenuLabel>
                {client.linkId && client.linkActive ? (
                  <>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <ClipboardCopy className="mr-2 h-4 w-4" /> Copiar Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRegenerateLink}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Regenerar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDeactivateLink}
                      className="text-destructive focus:text-destructive"
                    >
                      <PowerOff className="mr-2 h-4 w-4" /> Desativar Link
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleGenerateLink}>
                    <LinkIcon className="mr-2 h-4 w-4" /> Gerar Link Público
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    updateClient({
                      ...client,
                      status:
                        client.status === 'active' ? 'inactive' : 'active',
                    })
                  }
                >
                  <Ban className="mr-2 h-4 w-4" />{' '}
                  {client.status === 'active'
                    ? 'Inativar Aluno'
                    : 'Reativar Aluno'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este aluno?')) {
                      handleDeleteClient()
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir Aluno
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-8"
      >
        <div className="border-b pb-1 overflow-x-auto">
          <TabsList className="bg-transparent h-auto p-0 space-x-8 justify-start">
            {[
              'Dados',
              'Plano',
              'Treinos',
              'Dietas',
              'Agenda',
              'Entregáveis',
            ].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')}
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-4 text-base font-semibold text-muted-foreground data-[state=active]:text-foreground transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* DADOS TAB */}
        <TabsContent value="dados" className="space-y-8 animate-fade-in-up">
          <section>
            <StudentSummary client={client} />
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary rounded-full">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Email
                    </p>
                    <p className="text-base font-medium text-foreground">
                      {client.email || 'Não informado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary rounded-full">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Telefone
                    </p>
                    <p className="text-base font-medium text-foreground">
                      {client.phone || 'Não informado'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Plano</CardTitle>
              </CardHeader>
              <CardContent>
                {client.planName ? (
                  <>
                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                          Plano Atual
                        </p>
                        <p className="text-2xl font-extrabold">
                          {client.planName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Valor
                        </p>
                        <p className="text-2xl font-bold">
                          R$ {client.planValue?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {client.planEndDate && (
                      <p className="text-sm font-medium text-muted-foreground mt-4 text-center">
                        Vence em{' '}
                        {format(parseISO(client.planEndDate), 'dd/MM/yyyy')}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-2">Sem plano ativo.</p>
                    <Button
                      variant="link"
                      onClick={() => setActiveTab('plano')}
                      className="text-primary font-bold"
                    >
                      Adicionar agora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {client.customFields && client.customFields.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações Adicionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {client.customFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        {field.label}
                      </p>
                      <p className="text-base font-medium text-foreground">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* PLANO TAB */}
        <TabsContent value="plano" className="animate-fade-in-up">
          <PlanTab client={client} />
        </TabsContent>

        {/* TREINOS TAB */}
        <TabsContent value="treinos" className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold tracking-tight uppercase">
                Treinos
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Gerencie a rotina de exercícios
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssignWorkoutOpen(true)}
              >
                Atribuir Modelo
              </Button>
              <Button size="sm" onClick={() => setIsWorkoutFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Criar Novo
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clientWorkouts.length === 0 ? (
              <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-muted/10">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">
                  Nenhum treino atribuído a este aluno.
                </p>
              </div>
            ) : (
              clientWorkouts.map((w) => (
                <Card
                  key={w.id}
                  className="group hover:border-primary/50 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className="bg-secondary text-foreground border-border font-bold"
                      >
                        {w.level || 'Geral'}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeWorkout(w.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-xl leading-tight mt-3">
                      {w.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em] font-medium">
                      {w.objective}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      <Clock className="h-3 w-3 mr-1" />
                      Criado em {format(new Date(w.createdAt), 'dd/MM/yyyy')}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* DIETAS TAB */}
        <TabsContent value="dietas" className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold tracking-tight uppercase">
                Dietas
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Gerencie os planos alimentares
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssignDietOpen(true)}
              >
                Atribuir Modelo
              </Button>
              <Button size="sm" onClick={() => setIsDietFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Criar Nova
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clientDiets.length === 0 ? (
              <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-muted/10">
                <Utensils className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">
                  Nenhuma dieta atribuída a este aluno.
                </p>
              </div>
            ) : (
              clientDiets.map((d) => (
                <Card
                  key={d.id}
                  className="group hover:border-primary/50 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className="bg-secondary text-foreground border-border font-bold"
                      >
                        {d.type || 'Geral'}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeDiet(d.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-xl leading-tight mt-3">
                      {d.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em] font-medium">
                      {d.objective}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      <Clock className="h-3 w-3 mr-1" />
                      Criado em {format(new Date(d.createdAt), 'dd/MM/yyyy')}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* AGENDA TAB */}
        <TabsContent value="agenda" className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold tracking-tight uppercase">
                Agenda
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Compromissos e aulas
              </p>
            </div>
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

          <div className="space-y-3">
            {clientEvents.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed rounded-xl bg-muted/10">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">
                  Nenhum agendamento encontrado.
                </p>
              </div>
            ) : (
              clientEvents.map((e) => (
                <div
                  key={e.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl border bg-card transition-all hover:shadow-md',
                    e.completed && 'opacity-60 bg-muted/30',
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={cn(
                        'flex flex-col items-center justify-center h-14 w-14 rounded-xl border-2',
                        e.completed
                          ? 'bg-muted text-muted-foreground border-border'
                          : 'bg-primary/5 text-primary border-primary/20',
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {format(new Date(e.date), 'MMM')}
                      </span>
                      <span className="text-xl font-black leading-none">
                        {format(new Date(e.date), 'dd')}
                      </span>
                    </div>
                    <div>
                      <p
                        className={cn(
                          'font-bold text-lg',
                          e.completed && 'line-through decoration-2',
                        )}
                      >
                        {e.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Clock className="h-3 w-3" />
                        {format(new Date(e.date), 'HH:mm')}
                        {e.completed && (
                          <span className="text-green-400 font-bold ml-2 uppercase text-xs">
                            • Concluído
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {!e.completed && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-green-400 hover:text-green-500 hover:bg-green-50/10"
                        onClick={() => updateEvent({ ...e, completed: true })}
                        title="Concluir"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteEventId(e.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="entregaveis" className="animate-fade-in-up">
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
            <DialogTitle>Atribuir Modelo de Treino</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um treino..." />
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignWorkoutOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAssignExistingWorkout}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDietOpen} onOpenChange={setIsAssignDietOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Modelo de Dieta</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma dieta..." />
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDietOpen(false)}
            >
              Cancelar
            </Button>
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
            <AlertDialogTitle>Excluir Compromisso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível.
            </AlertDialogDescription>
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
