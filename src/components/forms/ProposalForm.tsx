import { useState } from 'react'
import { Proposal } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ProposalFormProps {
  onSave: (data: Omit<Proposal, 'id' | 'createdAt' | 'status'>) => void
  onCancel: () => void
}

export function ProposalForm({ onSave, onCancel }: ProposalFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientObjective: '',
    description: '',
    planName: '',
    value: '',
    duration: '',
    observations: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName) return

    onSave({
      ...formData,
      value: Number(formData.value),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="clientName">Nome do Potencial Cliente *</Label>
        <Input
          id="clientName"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          placeholder="Ex: João Souza"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="clientObjective">Objetivo do Cliente</Label>
        <Input
          id="clientObjective"
          value={formData.clientObjective}
          onChange={(e) =>
            setFormData({ ...formData, clientObjective: e.target.value })
          }
          placeholder="Ex: Emagrecimento, Hipertrofia..."
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrição do Acompanhamento</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Descreva como será o trabalho (treinos, dieta, suporte...)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="planName">Plano Oferecido</Label>
          <Input
            id="planName"
            value={formData.planName}
            onChange={(e) =>
              setFormData({ ...formData, planName: e.target.value })
            }
            placeholder="Ex: Consultoria Trimestral"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duração</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="Ex: 3 meses"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="value">Valor (R$)</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder="0.00"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="observations">Observações Finais</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) =>
            setFormData({ ...formData, observations: e.target.value })
          }
          placeholder="Ex: Condições de pagamento, bônus..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!formData.clientName}>
          Gerar Proposta
        </Button>
      </div>
    </form>
  )
}
