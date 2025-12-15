import { Client } from '@/lib/types'
import { Weight, Ruler, Target } from 'lucide-react'

interface StudentSummaryProps {
  client: Client
}

export function StudentSummary({ client }: StudentSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:bg-muted/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Weight className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Peso Atual
          </p>
          <p className="text-2xl font-bold tracking-tight">
            {client.weight ? `${client.weight} kg` : '-'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:bg-muted/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Ruler className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Altura</p>
          <p className="text-2xl font-bold tracking-tight">
            {client.height ? `${client.height} m` : '-'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:bg-muted/30 sm:col-span-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            Objetivo Principal
          </p>
          <p
            className="text-lg font-bold tracking-tight truncate leading-tight"
            title={client.objective}
          >
            {client.objective || '-'}
          </p>
        </div>
      </div>
    </div>
  )
}
