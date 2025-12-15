import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
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
import { Plus, Dumbbell, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Treinos = () => {
  const { workouts, clients, addWorkout, removeWorkout } = useAppStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    clientId: '',
    exerciseCount: 1,
  })

  const handleAddWorkout = () => {
    if (!newWorkout.title) return

    const client = clients.find((c) => c.id === newWorkout.clientId)

    addWorkout({
      id: Math.random().toString(36).substr(2, 9),
      title: newWorkout.title,
      clientId: newWorkout.clientId,
      clientName: client ? client.name : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      exercises: Array(newWorkout.exerciseCount).fill({
        name: 'Exercício Exemplo',
        sets: 3,
        reps: '10',
      }),
    })
    setNewWorkout({ title: '', clientId: '', exerciseCount: 1 })
    setIsDialogOpen(false)
    toast.success('Treino criado com sucesso!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Criar Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Plano de Treino</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Nome do Treino</Label>
                <Input
                  id="title"
                  value={newWorkout.title}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, title: e.target.value })
                  }
                  placeholder="Ex: Hipertrofia A"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Aluno (Opcional)</Label>
                <Select
                  onValueChange={(val) =>
                    setNewWorkout({ ...newWorkout, clientId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWorkout}>Criar Treino</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Nenhum treino criado.
          </p>
          <Button variant="link" onClick={() => setIsDialogOpen(true)}>
            Criar primeiro treino
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <Card
              key={workout.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle>{workout.title}</CardTitle>
                <CardDescription>
                  {workout.clientName
                    ? `Para: ${workout.clientName}`
                    : 'Sem aluno atribuído'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {workout.exercises.length} exercícios cadastrados
                </div>
                <ul className="text-sm space-y-1">
                  {workout.exercises.slice(0, 3).map((ex, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{ex.name}</span>
                      <span className="text-muted-foreground">
                        {ex.sets}x{ex.reps}
                      </span>
                    </li>
                  ))}
                  {workout.exercises.length > 3 && (
                    <li className="text-xs text-muted-foreground pt-1">
                      e mais {workout.exercises.length - 3}...
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm">
                  Detalhes
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeWorkout(workout.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Treinos
