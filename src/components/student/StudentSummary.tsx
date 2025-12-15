import { Client } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Weight, Ruler, Target } from 'lucide-react'

interface StudentSummaryProps {
  client: Client
}

export function StudentSummary({ client }: StudentSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center gap-1">
          <Weight className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Peso
          </span>
          <span className="font-semibold text-lg">
            {client.weight ? `${client.weight} kg` : '-'}
          </span>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center gap-1">
          <Ruler className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Altura
          </span>
          <span className="font-semibold text-lg">
            {client.height ? `${client.height} m` : '-'}
          </span>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center gap-1">
          <Target className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Objetivo
          </span>
          <span className="font-semibold text-sm line-clamp-2 leading-tight">
            {client.objective || '-'}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
