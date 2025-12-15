import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Workout } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Plus,
  Trash2,
  Copy,
  Edit,
  Clock,
  Download,
  UserPlus,
  Share2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { toast } from 'sonner'
import { generateWorkoutPDF } from '@/lib/pdfGenerator'
import { WorkoutForm } from '@/components/forms/WorkoutForm'
import { WorkoutAssignmentDialog } from '@/components/WorkoutAssignmentDialog'
import { Badge } from '@/components/ui/badge'
import { isBefore, parseISO } from 'date-fns'

const Treinos = () => {
  const {
    workouts,
    addWorkout,
    updateWorkout,
    removeWorkout,
    duplicateWorkout,
    profile,
    settings,
  } = useAppStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | undefined>(
    undefined,
  )
  const [assignWorkoutId, setAssignWorkoutId] = useState<string | null>(null)
  const [deleteWorkoutId, setDeleteWorkoutId] = useState<string | null>(null)

  const handleOpenNew = () => {
    setEditingWorkout(undefined)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (workout: Workout) => {
    setEditingWorkout(workout)
    setIsFormOpen(true)
  }

  const handleSave = (data: Partial<Workout>) => {
    if (!data.title) return

    const workoutData = {
      ...data,
      exercises: data.exercises || [],
      // Ensure required fields are set for type safety, though logic should prevent this
      objective: data.objective || '',
      level: data.level || 'Iniciante',
      observations: data.observations || '',
    }

    if (editingWorkout) {
      updateWorkout({ ...editingWorkout, ...workoutData } as Workout)
      toast.success('Treino atualizado!')
    } else {
      addWorkout({
        ...workoutData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        clientId: undefined, // Explicitly template
        isLifetime: true,
      } as Workout)
      toast.success('Treino criado com sucesso!')
    }
    setIsFormOpen(false)
  }

  const handleDelete = () => {
    if (deleteWorkoutId) {
      removeWorkout(deleteWorkoutId)
      toast.success('Treino excluído!')
      setDeleteWorkoutId(null)
    }
  }

  const handleDownload = (workout: Workout) => {
    generateWorkoutPDF(workout, profile, settings.themeColor)
    toast.success('PDF do treino gerado!')
  }

  const handleWhatsApp = (workout: Workout) => {
    const template =
      settings.whatsappMessageTemplate ||
      'Olá {studentName}! Aqui é o {personalName}.'
    const linkPlaceholder = '{link}'

    // Since we don't have a real public link for workouts yet, we simulate a text message
    let message = template
      .replace('{studentName}', workout.clientName || 'Aluno')
      .replace('{personalName}', profile.name)

    if (message.includes(linkPlaceholder)) {
      message = message.replace(linkPlaceholder, '[Link do PDF enviado]')
    } else {
      message += ' Segue seu treino.'
    }

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const getStatus = (workout: Workout) => {
    if (!workout.clientId)
      return { label: 'Sem Aluno', color: 'bg-gray-200 text-gray-800' }

    if (
      !workout.isLifetime &&
      workout.expirationDate &&
      isBefore(parseISO(workout.expirationDate), new Date())
    ) {
      return { label: 'Vencido', color: 'bg-red-100 text-red-800' }
    }

    return { label: 'Ativo (Atribuído)', color: 'bg-green-100 text-green-800' }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" /> Criar Novo Treino
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWorkout ? 'Editar Treino' : 'Novo Treino'}
            </DialogTitle>
          </DialogHeader>
          <WorkoutForm
            initialData={editingWorkout}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <WorkoutAssignmentDialog
        workoutId={assignWorkoutId}
        open={!!assignWorkoutId}
        onOpenChange={(open) => !open && setAssignWorkoutId(null)}
      />

      {/* Delete Alert */}
      <AlertDialog
        open={!!deleteWorkoutId}
        onOpenChange={(open) => !open && setDeleteWorkoutId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o
              treino e removerá a associação com alunos, se houver.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            <p>Nenhum treino criado ainda.</p>
          </div>
        ) : (
          workouts.map((workout) => {
            const status = getStatus(workout)
            return (
              <Card
                key={workout.id}
                className="flex flex-col h-full hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                    <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {workout.level || 'Nível N/A'}
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">
                    {workout.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Objetivo
                    </p>
                    <p className="text-sm">{workout.objective || '-'}</p>
                  </div>
                  {workout.clientName && (
                    <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 p-2 rounded">
                      <UserPlus className="h-4 w-4" />
                      Aluno: {workout.clientName}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.isLifetime
                        ? 'Vitalício'
                        : workout.expirationDate
                          ? `Vence: ${new Date(workout.expirationDate).toLocaleDateString()}`
                          : '-'}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {workout.exercises.length} exercícios cadastrados
                  </p>
                </CardContent>
                <CardFooter className="pt-2 border-t grid grid-cols-5 gap-1 p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Atribuir"
                    onClick={() => setAssignWorkoutId(workout.id)}
                    className="h-8 w-full"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Duplicar"
                    onClick={() => duplicateWorkout(workout.id)}
                    className="h-8 w-full"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Editar"
                    onClick={() => handleOpenEdit(workout)}
                    className="h-8 w-full"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Compartilhar WhatsApp"
                    onClick={() => handleWhatsApp(workout)}
                    className="h-8 w-full text-green-600 hover:text-green-700"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Baixar PDF"
                      onClick={() => handleDownload(workout)}
                      className="h-8 w-full"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
                <div className="px-2 pb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteWorkoutId(workout.id)}
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
