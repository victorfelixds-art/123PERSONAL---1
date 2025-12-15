import { useState, useEffect } from 'react'
import { CalendarEvent } from '@/lib/types'
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
import useAppStore from '@/stores/useAppStore'
import { format } from 'date-fns'

interface EventFormProps {
  initialData?: CalendarEvent
  onSave: (data: Omit<CalendarEvent, 'id'>) => void
  onCancel: () => void
  preSelectedStudentId?: string
}

export function EventForm({
  initialData,
  onSave,
  onCancel,
  preSelectedStudentId,
}: EventFormProps) {
  const { clients } = useAppStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    type: 'workout' as const,
    studentId: 'none',
    completed: false,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        time: format(new Date(initialData.date), 'HH:mm'),
        type: initialData.type,
        studentId: initialData.studentId || 'none',
        completed: initialData.completed,
      })
    } else if (preSelectedStudentId) {
      setFormData((prev) => ({ ...prev, studentId: preSelectedStudentId }))
    }
  }, [initialData, preSelectedStudentId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    const [hours, minutes] = formData.time.split(':').map(Number)
    const eventDate = new Date(formData.date)
    eventDate.setHours(hours, minutes)

    onSave({
      title: formData.title,
      description: formData.description,
      date: eventDate,
      type: formData.type,
      studentId: formData.studentId !== 'none' ? formData.studentId : undefined,
      completed: formData.completed,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Treino Personalizado"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Hora</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="studentId">Associar Aluno (Opcional)</Label>
        <Select
          value={formData.studentId}
          onValueChange={(val) => setFormData({ ...formData, studentId: val })}
          disabled={!!preSelectedStudentId && preSelectedStudentId !== 'none'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            {clients
              .filter((c) => c.status === 'active')
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Detalhes do compromisso..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  )
}
