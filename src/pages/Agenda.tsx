import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Plus, User } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { format, isSameDay } from 'date-fns'

const Agenda = () => {
  const { events, addEvent, clients } = useAppStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '10:00',
    type: 'workout' as const,
    studentId: 'none',
  })

  const selectedDateEvents = events.filter(
    (e) => date && isSameDay(e.date, date),
  )

  const handleAddEvent = () => {
    if (!date || !newEvent.title) return

    const [hours, minutes] = newEvent.time.split(':').map(Number)
    const eventDate = new Date(date)
    eventDate.setHours(hours, minutes)

    addEvent({
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      date: eventDate,
      type: newEvent.type,
      description: 'Novo evento agendado',
      studentId: newEvent.studentId !== 'none' ? newEvent.studentId : undefined,
    })
    setNewEvent({
      title: '',
      time: '10:00',
      type: 'workout',
      studentId: 'none',
    })
    setIsDialogOpen(false)
    toast.success('Evento agendado!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Evento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Título</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Ex: Treino"
                />
              </div>
              <div className="grid gap-2">
                <Label>Horário</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Aluno (Opcional)</Label>
                <Select
                  value={newEvent.studentId}
                  onValueChange={(val) =>
                    setNewEvent({ ...newEvent, studentId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
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
              <Button onClick={handleAddEvent}>Agendar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-none h-fit">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              modifiers={{
                booked: (d) => events.some((e) => isSameDay(e.date, d)),
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'var(--primary)',
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Eventos do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <ul className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(event.date, 'HH:mm')}
                      </p>
                    </div>
                    {event.studentId && (
                      <div className="flex items-center text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                        <User className="mr-1 h-3 w-3" />
                        {clients.find((c) => c.id === event.studentId)?.name}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                Nada agendado.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Agenda
