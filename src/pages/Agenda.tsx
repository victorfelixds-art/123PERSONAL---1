import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
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
import { toast } from 'sonner'
import { format, isSameDay } from 'date-fns'

const Agenda = () => {
  const { events, addEvent } = useAppStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '10:00',
    type: 'workout' as const,
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
    })
    setNewEvent({ title: '', time: '10:00', type: 'workout' })
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
              <DialogTitle>
                Novo Evento para {date ? format(date, 'dd/MM') : ''}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Treino com..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEvent}>Agendar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-none">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
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
            <CardTitle>
              Eventos de{' '}
              {date
                ? format(date, "d 'de' MMMM", { locale: ptBR })
                : 'Selecione uma data'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <ul className="space-y-4">
                {selectedDateEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <li
                      key={event.id}
                      className="flex items-start p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="mr-4 flex flex-col items-center justify-center bg-primary/10 text-primary h-12 w-12 rounded-lg">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(event.date, 'HH:mm')} - {event.description}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum evento agendado para esta data.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Agenda
