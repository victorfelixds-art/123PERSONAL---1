import { useState, useEffect } from 'react'
import { Client, CustomField } from '@/lib/types'
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
import { ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    weight: undefined,
    initialWeight: undefined,
    targetWeight: undefined,
    height: undefined,
    objective: '',
    planName: '',
    planValue: 0,
    status: 'active',
    planStartDate: new Date().toISOString().split('T')[0],
    customFields: [],
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

  const addCustomField = () => {
    const newField: CustomField = {
      id: Math.random().toString(36).substr(2, 9),
      label: '',
      value: '',
    }
    setFormData((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }))
  }

  const updateCustomField = (
    id: string,
    field: keyof CustomField,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields?.map((f) =>
        f.id === id ? { ...f, [field]: value } : f,
      ),
    }))
  }

  const removeCustomField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields?.filter((f) => f.id !== id),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = { ...formData }
    if (!dataToSave.planName) {
      dataToSave.planName = 'Personalizado'
    }

    if (dataToSave.weight && dataToSave.height && dataToSave.objective) {
      dataToSave.profileStatus = 'complete'
    }

    onSave(dataToSave)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-2 w-12 rounded-full transition-all',
                step >= s ? 'bg-primary' : 'bg-secondary',
              )}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          Passo {step} de 3
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-lg">Identificação</h3>
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone (WhatsApp)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Ex: 11999999999"
              />
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

            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Informações Adicionais</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                >
                  <Plus className="h-3 w-3 mr-1" /> Campo
                </Button>
              </div>
              {formData.customFields?.map((field) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="Título (ex: Lesões)"
                    value={field.label}
                    onChange={(e) =>
                      updateCustomField(field.id, 'label', e.target.value)
                    }
                    className="w-1/3 text-xs"
                  />
                  <Input
                    placeholder="Valor (ex: Joelho direito)"
                    value={field.value}
                    onChange={(e) =>
                      updateCustomField(field.id, 'value', e.target.value)
                    }
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomField(field.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-lg">Dados Corporais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Peso Atual (kg)</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="initialWeight">Peso Inicial (kg)</Label>
                <Input
                  id="initialWeight"
                  type="number"
                  value={formData.initialWeight || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initialWeight: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="targetWeight">Meta de Peso (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={formData.targetWeight || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetWeight: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-lg">Plano e Objetivo</h3>
            <div className="grid gap-2">
              <Label htmlFor="objective">Objetivo</Label>
              <Textarea
                id="objective"
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
                placeholder="Ex: Hipertrofia, Perda de gordura..."
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
                    setFormData({
                      ...formData,
                      planValue: Number(e.target.value),
                    })
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
          </div>
        )}

        <div className="flex justify-between pt-6 border-t mt-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            >
              {step === 1 ? (
                'Cancelar'
              ) : (
                <>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Próximo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit">Salvar Aluno</Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
