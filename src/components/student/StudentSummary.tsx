import { useState } from 'react'
import { Client } from '@/lib/types'
import { Scale, Edit2, TrendingUp, Target } from 'lucide-react'
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
import { Progress } from '@/components/ui/progress'

interface StudentSummaryProps {
  client: Client
  onUpdate?: () => void
}

export function StudentSummary({ client, onUpdate }: StudentSummaryProps) {
  const { addWeightEntry } = useAppStore()
  const [isWeightFormOpen, setIsWeightFormOpen] = useState(false)

  // Use snake_case properties matching DB/Types
  const initialWeight = client.initial_weight || 0
  const currentWeight = client.weight || 0
  const targetWeight = client.target_weight || 0

  let percentage = 0
  if (initialWeight && targetWeight && initialWeight !== targetWeight) {
    const totalDiff = Math.abs(targetWeight - initialWeight)
    const currentDiff = Math.abs(currentWeight - initialWeight)
    percentage = Math.min(Math.round((currentDiff / totalDiff) * 100), 100)
  }

  const handleUpdateWeight = async (
    weight: number,
    date: string,
    observations: string,
  ) => {
    try {
      await addWeightEntry(client.id, weight, date, observations)
      toast.success('Peso atualizado com sucesso!')
      setIsWeightFormOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error('Erro ao atualizar peso')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight uppercase">
          Evolução de Peso
        </h3>
        <Button onClick={() => setIsWeightFormOpen(true)} variant="outline">
          <Edit2 className="h-4 w-4 mr-2" /> Atualizar
        </Button>
      </div>

      <Card className="overflow-hidden border-2 border-primary/10">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="p-6 text-center">
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-2">
                Inicial
              </p>
              <div className="text-3xl md:text-4xl font-extrabold text-muted-foreground">
                {initialWeight || '-'}{' '}
                <span className="text-base font-medium text-muted-foreground/60">
                  kg
                </span>
              </div>
            </div>
            <div className="p-6 text-center bg-primary/5">
              <p className="text-xs font-bold uppercase text-primary tracking-widest mb-2 flex items-center justify-center gap-1">
                Atual
              </p>
              <div className="text-4xl md:text-5xl font-extrabold text-foreground">
                {currentWeight || '-'}{' '}
                <span className="text-lg font-medium text-muted-foreground">
                  kg
                </span>
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-2 flex items-center justify-center gap-1">
                Meta
              </p>
              <div className="text-3xl md:text-4xl font-extrabold text-primary">
                {targetWeight || '-'}{' '}
                <span className="text-base font-medium text-muted-foreground/60">
                  kg
                </span>
              </div>
            </div>
          </div>

          <div className="bg-secondary p-6 border-t border-border">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold uppercase text-muted-foreground">
                Progresso
              </span>
              <span className="text-2xl font-bold text-primary">
                {percentage}%
              </span>
            </div>
            <Progress
              value={percentage}
              className="h-4 rounded-full bg-border"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-full">
              <Scale className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Altura
              </p>
              <p className="text-xl font-bold">{client.height || '-'} m</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-full">
              <Target className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Objetivo Principal
              </p>
              <p className="text-xl font-bold">{client.objective || '-'}</p>
            </div>
          </CardContent>
        </Card>
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
