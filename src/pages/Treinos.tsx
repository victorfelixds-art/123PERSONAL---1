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
  Dumbbell,
  MoreVertical,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
        clientId: undefined,
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
    generateWorkoutPDF(workout, profile, settings.theme)
    toast.success('PDF do treino gerado!')
  }

  const handleWhatsApp = (workout: Workout) => {
    const message = `Olá! Segue o treino: ${workout.title}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const getStatus = (workout: Workout) => {
    if (!workout.clientId)
      return { label: 'MODELO', color: 'bg-muted text-muted-foreground' }

    if (
      !workout.isLifetime &&
      workout.expirationDate &&
      isBefore(parseISO(workout.expirationDate), new Date())
    ) {
      return { label: 'VENCIDO', color: 'bg-red-100 text-red-800' }
    }

    return { label: 'ATIVO', color: 'bg-green-100 text-green-800' }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">
          Treinos
        </h1>
        <Button size="lg" onClick={handleOpenNew}>
          <Plus className="mr-2 h-5 w-5" /> Criar Treino
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5">
            <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum treino criado.</p>
          </div>
        ) : (
          workouts.map((workout) => {
            const status = getStatus(workout)
            return (
              <Card
                key={workout.id}
                className="flex flex-col h-full hover:border-primary/60 transition-all border-l-4 border-l-transparent hover:border-l-primary"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="outline"
                      className={`${status.color} font-bold border-transparent`}
                    >
                      {status.label}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mr-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setAssignWorkoutId(workout.id)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" /> Atribuir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => duplicateWorkout(workout.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownload(workout)}
                        >
                          <Download className="mr-2 h-4 w-4" /> PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteWorkoutId(workout.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-xl leading-tight line-clamp-1 uppercase">
                    {workout.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {workout.level}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
                      Objetivo
                    </p>
                    <p className="text-sm font-medium">
                      {workout.objective || '-'}
                    </p>
                  </div>
                  {workout.clientName && (
                    <div className="bg-muted/30 p-2 rounded-lg border border-border/50">
                      <p className="text-xs font-bold uppercase text-primary mb-1 flex items-center gap-1">
                        <UserPlus className="h-3 w-3" /> Aluno
                      </p>
                      <p className="text-sm font-bold truncate">
                        {workout.clientName}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {workout.isLifetime
                      ? 'Vitalício'
                      : workout.expirationDate
                        ? `Vence: ${new Date(workout.expirationDate).toLocaleDateString()}`
                        : '-'}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/10">
                  <div className="flex justify-between w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 font-bold"
                      onClick={() => handleOpenEdit(workout)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <Button
                      className="flex-1 font-bold bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                      onClick={() => handleWhatsApp(workout)}
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Whats
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

      <WorkoutAssignmentDialog
        workoutId={assignWorkoutId}
        open={!!assignWorkoutId}
        onOpenChange={(open) => !open && setAssignWorkoutId(null)}
      />

      <AlertDialog
        open={!!deleteWorkoutId}
        onOpenChange={(open) => !open && setDeleteWorkoutId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Treino?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. O treino será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

export default Treinos
