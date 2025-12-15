import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'

interface WeightUpdateFormProps {
  onSave: (weight: number, date: string, observations: string) => void
  onCancel: () => void
  currentWeight?: number
}

export function WeightUpdateForm({
  onSave,
  onCancel,
  currentWeight,
}: WeightUpdateFormProps) {
  const [weight, setWeight] = useState(currentWeight?.toString() || '')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [observations, setObservations] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!weight || !date) return

    onSave(Number(weight), date, observations)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="date">Data da Pesagem</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="weight">Peso Atual (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Ex: 75.5"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Ex: Em jejum, após treino..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Peso</Button>
      </div>
    </form>
  )
}
