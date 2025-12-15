import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { CalendarEvent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Plus,
  User,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
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
import { format, isSameDay, isBefore, addDays, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { EventForm } from '@/components/forms/EventForm'
import { Badge } from '@/components/ui/badge'

type FilterType = 'hoje' | 'proximos' | 'todos'

const Agenda = () => {
  const { events, addEvent, updateEvent, removeEvent, clients } = useAppStore()
  const [filter, setFilter] = useState<FilterType>('hoje')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(
    undefined,
  )
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  const getEventStatus = (event: CalendarEvent) => {
    if (event.completed) return 'concluido'
    const now = new Date()
    const eventDate = new Date(event.date)

    if (isBefore(eventDate, now)) return 'atrasado'
    if (isSameDay(eventDate, now)) return 'hoje'
    return 'futuro'
  }

  const filteredEvents = events
    .filter((event) => {
      const today = new Date()
      const eventDate = new Date(event.date)

      if (filter === 'hoje') {
        return isSameDay(eventDate, today)
      }
      if (filter === 'proximos') {
        // Next 7 days including today
        const nextWeek = addDays(today, 7)
        return (
          (isSameDay(eventDate, today) || isAfter(eventDate, today)) &&
          isBefore(eventDate, nextWeek)
        )
      }
      return true
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const handleSave = (data: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent({ ...editingEvent, ...data })
      toast.success('Compromisso atualizado!')
    } else {
      addEvent({
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      })
      toast.success('Compromisso criado!')
    }
    setIsFormOpen(false)
  }

  const handleDelete = () => {
    if (deleteEventId) {
      removeEvent(deleteEventId)
      toast.success('Compromisso excluído!')
      setDeleteEventId(null)
    }
  }

  const handleComplete = (event: CalendarEvent) => {
    updateEvent({ ...event, completed: true })
    toast.success('Compromisso concluído!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <Button
          onClick={() => {
            setEditingEvent(undefined)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Criar Compromisso
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Button
          variant={filter === 'hoje' ? 'default' : 'outline'}
          onClick={() => setFilter('hoje')}
        >
          Hoje
        </Button>
        <Button
          variant={filter === 'proximos' ? 'default' : 'outline'}
          onClick={() => setFilter('proximos')}
        >
          Próximos 7 dias
        </Button>
        <Button
          variant={filter === 'todos' ? 'default' : 'outline'}
          onClick={() => setFilter('todos')}
        >
          Todos
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum compromisso encontrado para este período.</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const status = getEventStatus(event)
            const clientName = event.studentId
              ? clients.find((c) => c.id === event.studentId)?.name
              : null

            return (
              <Card
                key={event.id}
                className={cn(
                  'transition-all hover:shadow-md border-l-4',
                  status === 'concluido'
                    ? 'border-l-green-500 opacity-80'
                    : status === 'atrasado'
                      ? 'border-l-red-500'
                      : status === 'hoje'
                        ? 'border-l-blue-500'
                        : 'border-l-gray-300',
                )}
              >
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          'font-semibold text-lg',
                          status === 'concluido' &&
                            'line-through text-muted-foreground',
                        )}
                      >
                        {event.title}
                      </h3>
                      {status === 'atrasado' && (
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" /> Atrasado
                        </Badge>
                      )}
                      {status === 'hoje' && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          Hoje
                        </Badge>
                      )}
                      {status === 'concluido' && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50"
                        >
                          Concluído
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(event.date), "dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.date), 'HH:mm')}
                      </div>
                      {clientName && (
                        <div className="flex items-center gap-1 text-primary">
                          <User className="h-3 w-3" />
                          {clientName}
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {status !== 'concluido' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleComplete(event)}
                        title="Marcar como concluído"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingEvent(event)
                        setIsFormOpen(true)
                      }}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteEventId(event.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Editar Compromisso' : 'Novo Compromisso'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={editingEvent}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteEventId}
        onOpenChange={(open) => !open && setDeleteEventId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir compromisso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Agenda
