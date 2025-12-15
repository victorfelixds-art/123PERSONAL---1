import { useState } from 'react'
import { Client } from '@/lib/types'
import { Ruler, Target, Scale, Edit2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WeightUpdateForm } from '@/components/forms/WeightUpdateForm'
import useAppStore from '@/stores/useAppStore'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudentSummaryProps {
  client: Client
}

export function StudentSummary({ client }: StudentSummaryProps) {
  const { addWeightEntry } = useAppStore()
  const [isWeightFormOpen, setIsWeightFormOpen] = useState(false)

  const initialWeight = client.initialWeight || 0
  const currentWeight = client.weight || 0
  const targetWeight = client.targetWeight || 0

  let percentage = 0
  if (initialWeight && targetWeight && initialWeight !== targetWeight) {
    const totalDiff = Math.abs(targetWeight - initialWeight)
    const currentDiff = Math.abs(currentWeight - initialWeight)
    // Cap at 100%
    percentage = Math.min(Math.round((currentDiff / totalDiff) * 100), 100)
  }

  const handleUpdateWeight = (
    weight: number,
    date: string,
    observations: string,
  ) => {
    addWeightEntry(client.id, weight, date, observations)
    toast.success('Peso atualizado com sucesso!')
    setIsWeightFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weight Progress Card */}
        <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" /> Progresso de Peso
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWeightFormOpen(true)}
                className="h-8"
              >
                <Edit2 className="h-3 w-3 mr-2" /> Atualizar Peso
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Inicial
                </p>
                <p className="text-xl font-bold">
                  {initialWeight ? `${initialWeight} kg` : '-'}
                </p>
              </div>
              <div className="space-y-1 border-x border-border/50">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Atual
                </p>
                <p className="text-2xl font-extrabold text-primary">
                  {currentWeight ? `${currentWeight} kg` : '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Meta
                </p>
                <p className="text-xl font-bold">
                  {targetWeight ? `${targetWeight} kg` : '-'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Progresso da Meta</span>
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2.5" />
            </div>
          </CardContent>
        </Card>

        {/* Other Stats */}
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-muted/30 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Ruler className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Altura</p>
            <p className="text-xl font-bold tracking-tight">
              {client.height ? `${client.height} m` : '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-muted/30 transition-colors">
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

      <Dialog open={isWeightFormOpen} onOpenChange={setIsWeightFormOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Atualizar Peso</DialogTitle>
          </DialogHeader>
          <WeightUpdateForm
            currentWeight={currentWeight}
            onSave={handleUpdateWeight}
            onCancel={() => setIsWeightFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
