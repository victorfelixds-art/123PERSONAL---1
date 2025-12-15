import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { format, addMonths } from 'date-fns'

interface WorkoutAssignmentDialogProps {
  workoutId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkoutAssignmentDialog({
  workoutId,
  open,
  onOpenChange,
}: WorkoutAssignmentDialogProps) {
  const { clients, assignWorkout, workouts } = useAppStore()
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isLifetime, setIsLifetime] = useState(false)
  const [expirationDate, setExpirationDate] = useState(
    format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  )

  const activeClients = clients.filter((c) => c.status === 'active')
  const workout = workouts.find((w) => w.id === workoutId)

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    )
  }

  const handleAssign = () => {
    if (!workoutId || selectedStudents.length === 0) {
      toast.error('Selecione pelo menos um aluno')
      return
    }

    assignWorkout(
      workoutId,
      selectedStudents,
      startDate,
      isLifetime ? null : expirationDate,
      isLifetime,
    )

    toast.success(`Treino atribuído para ${selectedStudents.length} aluno(s)!`)
    onOpenChange(false)
    setSelectedStudents([])
    setIsLifetime(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir Treino: {workout?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Selecione os Alunos</Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {activeClients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">
                  Nenhum aluno ativo encontrado.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`student-${client.id}`}
                        checked={selectedStudents.includes(client.id)}
                        onCheckedChange={() => handleToggleStudent(client.id)}
                      />
                      <label
                        htmlFor={`student-${client.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {client.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              {selectedStudents.length} aluno(s) selecionado(s)
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Data de Início</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <Switch
              id="lifetime"
              checked={isLifetime}
              onCheckedChange={setIsLifetime}
            />
            <Label htmlFor="lifetime">Acesso Vitalício</Label>
          </div>

          {!isLifetime && (
            <div className="grid gap-2">
              <Label>Data de Vencimento</Label>
              <Input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAssign}>Confirmar Atribuição</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
