import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Workout } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Dumbbell, Trash2, Copy, Edit, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const Treinos = () => {
  const {
    workouts,
    clients,
    addWorkout,
    updateWorkout,
    removeWorkout,
    duplicateWorkout,
  } = useAppStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Workout>>({
    title: '',
    clientId: 'none',
    isLifetime: true,
    expirationDate: '',
  })

  const openNew = () => {
    setEditingId(null)
    setFormData({
      title: '',
      clientId: 'none',
      isLifetime: true,
      expirationDate: '',
    })
    setIsDialogOpen(true)
  }

  const openEdit = (workout: Workout) => {
    setEditingId(workout.id)
    setFormData({
      ...workout,
      clientId: workout.clientId || 'none',
      expirationDate: workout.expirationDate || '',
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.title) return

    const client =
      formData.clientId !== 'none'
        ? clients.find((c) => c.id === formData.clientId)
        : undefined

    const workoutData = {
      title: formData.title,
      clientId: client?.id,
      clientName: client?.name,
      isLifetime: formData.isLifetime,
      expirationDate: formData.isLifetime ? null : formData.expirationDate,
      exercises:
        (editingId
          ? workouts.find((w) => w.id === editingId)?.exercises
          : []) ||
        Array(3).fill({ name: 'Exercício Padrão', sets: 3, reps: '10' }),
      createdAt: new Date().toISOString(),
    }

    if (editingId) {
      updateWorkout({ ...workoutData, id: editingId } as Workout)
      toast.success('Treino atualizado')
    } else {
      addWorkout({
        ...workoutData,
        id: Math.random().toString(36).substr(2, 9),
      } as Workout)
      toast.success('Treino criado')
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Treino
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Treino' : 'Novo Treino'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Aluno</Label>
              <Select
                value={formData.clientId}
                onValueChange={(val) =>
                  setFormData({ ...formData, clientId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem aluno</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isLifetime}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isLifetime: checked })
                }
              />
              <Label>Sem data de validade</Label>
            </div>
            {!formData.isLifetime && (
              <div className="grid gap-2">
                <Label>Validade</Label>
                <Input
                  type="date"
                  value={formData.expirationDate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, expirationDate: e.target.value })
                  }
                />
              </div>
            )}
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <CardTitle>{workout.title}</CardTitle>
              <CardDescription>{workout.clientName || 'Geral'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <Clock className="h-3 w-3" />
                {workout.isLifetime
                  ? 'Vitalício'
                  : `Vence em ${workout.expirationDate}`}
              </div>
              <p className="text-sm text-muted-foreground">
                {workout.exercises.length} exercícios
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => duplicateWorkout(workout.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(workout)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeWorkout(workout.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Treinos
