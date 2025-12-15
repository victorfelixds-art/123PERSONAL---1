import { useState, useEffect } from 'react'
import { Client } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore from '@/stores/useAppStore'
import { Textarea } from '@/components/ui/textarea'

interface StudentFormProps {
  initialData?: Client
  onSave: (data: Partial<Client>) => void
  onCancel: () => void
}

export function StudentForm({
  initialData,
  onSave,
  onCancel,
}: StudentFormProps) {
  const { plans } = useAppStore()
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    weight: undefined,
    height: undefined,
    objective: '',
    planName: '',
    planValue: 0,
    status: 'active',
    planStartDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handlePlanChange = (planId: string) => {
    const selectedPlan = plans.find((p) => p.id === planId)
    if (selectedPlan) {
      setFormData({
        ...formData,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planValue: selectedPlan.value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = { ...formData }
    // Fallback if user somehow didn't select a plan ID but typed a name (legacy support)
    if (!dataToSave.planName) {
      dataToSave.planName = 'Personalizado'
    }

    // Auto-complete profile if all required fields are present
    if (dataToSave.weight && dataToSave.height && dataToSave.objective) {
      dataToSave.profileStatus = 'complete'
    }

    onSave(dataToSave)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Telefone (WhatsApp)</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Ex: 11999999999"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight || ''}
            onChange={(e) =>
              setFormData({ ...formData, weight: Number(e.target.value) })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="height">Altura (m)</Label>
          <Input
            id="height"
            type="number"
            step="0.01"
            value={formData.height || ''}
            onChange={(e) =>
              setFormData({ ...formData, height: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="objective">Objetivo</Label>
        <Textarea
          id="objective"
          value={formData.objective}
          onChange={(e) =>
            setFormData({ ...formData, objective: e.target.value })
          }
          placeholder="Ex: Hipertrofia"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="planId">Selecionar Plano</Label>
        <Select value={formData.planId} onValueChange={handlePlanChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um plano" />
          </SelectTrigger>
          <SelectContent>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} - R$ {plan.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="planValue">Valor (R$)</Label>
          <Input
            id="planValue"
            type="number"
            value={formData.planValue}
            onChange={(e) =>
              setFormData({ ...formData, planValue: Number(e.target.value) })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="planStartDate">Início do Plano</Label>
          <Input
            id="planStartDate"
            type="date"
            value={formData.planStartDate || ''}
            onChange={(e) =>
              setFormData({ ...formData, planStartDate: e.target.value })
            }
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(val: any) =>
            setFormData({ ...formData, status: val })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  )
}
