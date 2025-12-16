import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Organize seus horários e aulas."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Agendar Aula
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-12 animate-fade-in-up">
        <Card className="md:col-span-4 lg:col-span-3">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm w-full flex justify-center"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-8 lg:col-span-9">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">
                Nenhum evento para este dia
              </h3>
              <p className="text-muted-foreground">
                Selecione outra data ou adicione um novo agendamento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
