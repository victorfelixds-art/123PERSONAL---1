import { useState, useEffect } from 'react'
import { Workout, Exercise } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkoutFormProps {
  initialData?: Partial<Workout>
  onSave: (data: Partial<Workout>) => void
  onCancel: () => void
}

export function WorkoutForm({
  initialData,
  onSave,
  onCancel,
}: WorkoutFormProps) {
  const [formData, setFormData] = useState<Partial<Workout>>({
    title: '',
    objective: '',
    level: 'Iniciante',
    observations: '',
    exercises: [],
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        exercises: initialData.exercises || [],
      })
    }
  }, [initialData])

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...(prev.exercises || []),
        { name: '', sets: 3, reps: '10', weight: '', rest: '', notes: '' },
      ],
    }))
  }

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index),
    }))
  }

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises?.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex,
      ),
    }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Nome do Treino *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ex: Hipertrofia A"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="objective">Objetivo *</Label>
            <Input
              id="objective"
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              placeholder="Ex: Ganho de massa"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="level">Nível *</Label>
            <Select
              value={formData.level}
              onValueChange={(val: any) =>
                setFormData({ ...formData, level: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Iniciante">Iniciante</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="observations">Observações Gerais *</Label>
          <Textarea
            id="observations"
            value={formData.observations}
            onChange={(e) =>
              setFormData({ ...formData, observations: e.target.value })
            }
            placeholder="Instruções gerais para o aluno..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Exercícios</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExercise}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Exercício
            </Button>
          </div>

          {formData.exercises?.length === 0 && (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
              <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum exercício adicionado.</p>
            </div>
          )}

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {formData.exercises?.map((exercise, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-3 bg-muted/20 relative group"
              >
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeExercise(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Label>Nome do Exercício</Label>
                  <Input
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(index, 'name', e.target.value)
                    }
                    placeholder="Ex: Supino Reto"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="grid gap-1">
                    <Label className="text-xs">Séries</Label>
                    <Input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        updateExercise(index, 'sets', Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Repetições</Label>
                    <Input
                      value={exercise.reps}
                      onChange={(e) =>
                        updateExercise(index, 'reps', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Carga (Opcional)</Label>
                    <Input
                      value={exercise.weight || ''}
                      onChange={(e) =>
                        updateExercise(index, 'weight', e.target.value)
                      }
                      placeholder="kg"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Descanso</Label>
                    <Input
                      value={exercise.rest || ''}
                      onChange={(e) =>
                        updateExercise(index, 'rest', e.target.value)
                      }
                      placeholder="seg"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label className="text-xs">Observação</Label>
                  <Input
                    value={exercise.notes || ''}
                    onChange={(e) =>
                      updateExercise(index, 'notes', e.target.value)
                    }
                    placeholder="Detalhes de execução..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.title}>
          Salvar Treino
        </Button>
      </div>
    </div>
  )
}
