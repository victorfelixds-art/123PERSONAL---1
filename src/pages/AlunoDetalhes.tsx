import { useParams, useNavigate, Link } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Edit,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  CreditCard,
  Ban,
  Plus,
  Dumbbell,
  Utensils,
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { StudentForm } from '@/components/forms/StudentForm'
import { isBefore, parseISO, addMonths, addDays, format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WorkoutForm } from '@/components/forms/WorkoutForm'
import { DietForm } from '@/components/forms/DietForm'
import { Workout, Diet } from '@/lib/types'

const AlunoDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    clients,
    removeClient,
    updateClient,
    workouts,
    addWorkout,
    updateWorkout,
    removeWorkout,
    assignWorkout,
    diets,
    addDiet,
    updateDiet,
    removeDiet,
    assignDiet,
    settings,
    profile,
    plans,
    events,
    addEvent,
    removeEvent,
  } = useAppStore()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isWorkoutFormOpen, setIsWorkoutFormOpen] = useState(false)
  const [isDietFormOpen, setIsDietFormOpen] = useState(false)
  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false)
  const [isAssignDietOpen, setIsAssignDietOpen] = useState(false)
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)

  // Selection states
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
  })

  const client = clients.find((c) => c.id === id)
  const clientWorkouts = workouts.filter((w) => w.clientId === id)
  const clientDiets = diets.filter((d) => d.clientId === id)
  const clientEvents = events
    .filter((e) => e.studentId === id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (!client) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Aluno não encontrado</h2>
        <Button onClick={() => navigate('/alunos')}>Voltar para Lista</Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (
      confirm(
        'Tem certeza que deseja remover este aluno? Esta ação é irreversível.',
      )
    ) {
      removeClient(client.id)
      toast.success('Aluno removido com sucesso')
      navigate('/alunos')
    }
  }

  const handleInactivate = () => {
    updateClient({ ...client, status: 'inactive' })
    toast.success('Aluno inativado.')
  }

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

  // Plan logic
  const planExpirationDate =
    client.planStartDate && client.planId
      ? addMonths(
          parseISO(client.planStartDate),
          plans.find((p) => p.id === client.planId)?.durationInMonths || 1,
        )
      : null

  const handlePlanAction = (action: 'renew' | 'end' | 'change') => {
    if (action === 'end') {
      updateClient({
        ...client,
        planId: undefined,
        planName: 'Sem Plano',
        planValue: 0,
        planStartDate: undefined,
      })
      toast.success('Plano encerrado.')
    } else {
      // Logic for renew/change would ideally open a dialog. For MVP, we can re-open edit profile
      setIsEditingProfile(true)
      toast.info('Edite as informações do plano no perfil.')
    }
  }

  // Workouts
  const handleCreateWorkout = (data: Partial<Workout>) => {
    addWorkout({
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      clientId: client.id,
      clientName: client.name,
      exercises: data.exercises || [],
      isLifetime: true, // Default
    } as Workout)
    setIsWorkoutFormOpen(false)
    toast.success('Treino criado para o aluno!')
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

  // Diets
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
    toast.success('Dieta criada para o aluno!')
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

  // Events
  const handleAddEvent = () => {
    if (!newEvent.title) return
    const dateObj = new Date(`${newEvent.date}T${newEvent.time}`)
    addEvent({
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      description: newEvent.description,
      date: dateObj,
      type: 'meeting',
      studentId: client.id,
    })
    setIsEventFormOpen(false)
    toast.success('Evento agendado!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => navigate('/alunos')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          {client.status === 'active' ? (
            <Button
              variant="outline"
              onClick={handleInactivate}
              className="text-orange-600 hover:text-orange-700"
            >
              <Ban className="mr-2 h-4 w-4" /> Inativar
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => updateClient({ ...client, status: 'active' })}
              className="text-green-600 hover:text-green-700"
            >
              Reativar
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Profile Card */}
        <Card className="md:w-1/3 h-fit">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={client.avatar} />
              <AvatarFallback>{client.name[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl text-center">{client.name}</CardTitle>
            <Badge
              variant={client.status === 'active' ? 'default' : 'secondary'}
              className="mt-2"
            >
              {client.status.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chamar no WhatsApp
            </Button>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Desde {new Date(client.since).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Peso</p>
                <p className="font-semibold">{client.weight || '-'} kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Altura</p>
                <p className="font-semibold">{client.height || '-'} m</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Objetivo</p>
              <p className="font-medium">{client.objective || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <div className="md:w-2/3">
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="dados">Dados do Aluno</TabsTrigger>
              <TabsTrigger value="treinos">Treinos</TabsTrigger>
              <TabsTrigger value="dietas">Dietas</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>

            {/* Dados Tab */}
            <TabsContent value="dados" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Informações do Plano</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg bg-card/50">
                    <div>
                      <p className="text-sm font-medium">Plano Atual</p>
                      <p className="text-2xl font-bold">
                        {client.planName || 'Sem Plano'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Valor</p>
                      <p className="text-xl">R$ {client.planValue}</p>
                    </div>
                  </div>

                  {client.planId && planExpirationDate && (
                    <div className="flex items-center gap-2 text-sm p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        Vence em:{' '}
                        {planExpirationDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handlePlanAction('change')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" /> Trocar/Renovar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handlePlanAction('end')}
                    >
                      <Ban className="mr-2 h-4 w-4" /> Encerrar Plano
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treinos Tab */}
            <TabsContent value="treinos" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Treinos Atribuídos</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAssignWorkoutOpen(true)}
                  >
                    Atribuir Existente
                  </Button>
                  <Button size="sm" onClick={() => setIsWorkoutFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Criar Novo
                  </Button>
                </div>
              </div>

              {clientWorkouts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Nenhum treino atribuído.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {clientWorkouts.map((w) => {
                    const isExpired =
                      !w.isLifetime &&
                      w.expirationDate &&
                      isBefore(parseISO(w.expirationDate), new Date())
                    return (
                      <Card key={w.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{w.title}</h4>
                              {isExpired && (
                                <Badge variant="destructive">Vencido</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {w.objective}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Vence:{' '}
                              {w.isLifetime
                                ? 'Vitalício'
                                : new Date(
                                    w.expirationDate!,
                                  ).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => removeWorkout(w.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Dietas Tab */}
            <TabsContent value="dietas" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dietas Atribuídas</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAssignDietOpen(true)}
                  >
                    Atribuir Existente
                  </Button>
                  <Button size="sm" onClick={() => setIsDietFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Criar Nova
                  </Button>
                </div>
              </div>

              {clientDiets.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Nenhuma dieta atribuída.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {clientDiets.map((d) => {
                    const isExpired =
                      !d.isLifetime &&
                      d.expirationDate &&
                      isBefore(parseISO(d.expirationDate), new Date())
                    return (
                      <Card key={d.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{d.title}</h4>
                              {isExpired && (
                                <Badge variant="destructive">Vencida</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {d.type}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Vence:{' '}
                              {d.isLifetime
                                ? 'Vitalício'
                                : new Date(
                                    d.expirationDate!,
                                  ).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => removeDiet(d.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Agenda Tab */}
            <TabsContent value="agenda" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Agenda do Aluno</h3>
                <Button size="sm" onClick={() => setIsEventFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Agendar
                </Button>
              </div>

              <div className="space-y-4">
                {clientEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nada agendado para este aluno.
                  </p>
                ) : (
                  clientEvents.map((e) => (
                    <Card key={e.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{e.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {e.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                            <Calendar className="h-3 w-3" />
                            {format(e.date, 'dd/MM/yyyy HH:mm')}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeEvent(e.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
              toast.success('Perfil atualizado!')
            }}
            onCancel={() => setIsEditingProfile(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWorkoutFormOpen} onOpenChange={setIsWorkoutFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Treino para {client.name}</DialogTitle>
          </DialogHeader>
          <WorkoutForm
            onSave={handleCreateWorkout}
            onCancel={() => setIsWorkoutFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignWorkoutOpen} onOpenChange={setIsAssignWorkoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Treino Existente</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Selecione o Modelo</Label>
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
          </div>
          <DialogFooter>
            <Button
              onClick={handleAssignExistingWorkout}
              disabled={!selectedTemplateId}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDietFormOpen} onOpenChange={setIsDietFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Dieta para {client.name}</DialogTitle>
          </DialogHeader>
          <DietForm
            onSave={handleCreateDiet}
            onCancel={() => setIsDietFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDietOpen} onOpenChange={setIsAssignDietOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Dieta Existente</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Selecione o Modelo</Label>
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
          </div>
          <DialogFooter>
            <Button
              onClick={handleAssignExistingDiet}
              disabled={!selectedTemplateId}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Evento para {client.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Título</Label>
              <Input
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="Ex: Avaliação"
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddEvent}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AlunoDetalhes
