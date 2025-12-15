import { useState } from 'react'
import {
  Proposal,
  ProposalService,
  ProposalType,
  DeliveryType,
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface ProposalFormProps {
  onSave: (data: Omit<Proposal, 'id' | 'createdAt' | 'status'>) => void
  onCancel: () => void
}

const DEFAULT_SERVICES: ProposalService[] = [
  {
    id: '1',
    title: '🧠 AVALIAÇÃO FÍSICA',
    description:
      'Análise completa da composição corporal, postura e mobilidade para definir o ponto de partida.',
  },
  {
    id: '2',
    title: '🏋️ PRESCRIÇÃO DO TREINO',
    description:
      'Planilha de treino personalizada, ajustada para sua rotina, local de treino e nível de experiência.',
  },
  {
    id: '3',
    title: '🔄 ACOMPANHAMENTO E AJUSTES',
    description:
      'Monitoramento constante da evolução com ajustes na intensidade e volume sempre que necessário.',
  },
  {
    id: '4',
    title: '🥗 AVALIAÇÃO ALIMENTAR (opcional)',
    description:
      'Orientações básicas para potencializar seus resultados (não substitui nutricionista).',
  },
]

export function ProposalForm({ onSave, onCancel }: ProposalFormProps) {
  // Always default to 'conversion70' as requested in the user story
  const [proposalType] = useState<ProposalType>('conversion70')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('online')
  const [discountedValue, setDiscountedValue] = useState('')

  const [formData, setFormData] = useState({
    clientName: '',
    clientAge: '',
    clientHeight: '',
    clientWeight: '',
    clientTargetWeight: '', // Meta
    clientObjective: '',
    description: '',
    planName: '',
    value: '',
    duration: '',
    observations: '',
    validityDate: '', // New field
  })

  const [services, setServices] = useState<ProposalService[]>(DEFAULT_SERVICES)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName) return

    onSave({
      ...formData,
      type: proposalType,
      value: Number(formData.value),
      discountedValue: discountedValue ? Number(discountedValue) : undefined,
      deliveryType: deliveryType,
      services: services,
    })
  }

  const addService = () => {
    setServices([
      ...services,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: 'NOVO SERVIÇO',
        description: 'Descrição do serviço...',
      },
    ])
  }

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const updateService = (
    id: string,
    field: keyof ProposalService,
    val: string,
  ) => {
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: val } : s)))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label>Tipo de Proposta</Label>
        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed">
          Modelo 01 — 70% de conversão
        </div>
      </div>

      <div className="grid gap-4 p-4 border rounded-md bg-muted/20">
        <h3 className="font-semibold text-sm text-muted-foreground mb-2">
          Ficha Técnica
        </h3>
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
          <Label>Tipo de Entrega</Label>
          <Select
            value={deliveryType}
            onValueChange={(val: DeliveryType) => setDeliveryType(val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="hybrid">Online + Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="clientAge">Idade</Label>
            <Input
              id="clientAge"
              value={formData.clientAge}
              onChange={(e) =>
                setFormData({ ...formData, clientAge: e.target.value })
              }
              placeholder="Ex: 30 anos"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientHeight">Altura</Label>
            <Input
              id="clientHeight"
              value={formData.clientHeight}
              onChange={(e) =>
                setFormData({ ...formData, clientHeight: e.target.value })
              }
              placeholder="Ex: 1.75m"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="clientWeight">Peso Atual</Label>
            <Input
              id="clientWeight"
              value={formData.clientWeight}
              onChange={(e) =>
                setFormData({ ...formData, clientWeight: e.target.value })
              }
              placeholder="Ex: 80kg"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientTargetWeight">Meta de Peso</Label>
            <Input
              id="clientTargetWeight"
              value={formData.clientTargetWeight}
              onChange={(e) =>
                setFormData({ ...formData, clientTargetWeight: e.target.value })
              }
              placeholder="Ex: 75kg"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="clientObjective">Objetivo Principal</Label>
          <Input
            id="clientObjective"
            value={formData.clientObjective}
            onChange={(e) =>
              setFormData({ ...formData, clientObjective: e.target.value })
            }
            placeholder="Ex: Emagrecimento, Hipertrofia..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Lista de Serviços (Editável)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addService}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Serviço
          </Button>
        </div>
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.id} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => removeService(service.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="p-3 space-y-2">
                <Input
                  value={service.title}
                  onChange={(e) =>
                    updateService(service.id, 'title', e.target.value)
                  }
                  className="font-semibold border-none px-0 h-auto focus-visible:ring-0 focus-visible:border-b rounded-none"
                  placeholder="Título do Serviço"
                />
                <Textarea
                  value={service.description}
                  onChange={(e) =>
                    updateService(service.id, 'description', e.target.value)
                  }
                  className="text-sm min-h-[60px] resize-none"
                  placeholder="Descrição do serviço..."
                />
              </CardContent>
            </Card>
          ))}
          {services.length === 0 && (
            <div className="text-center p-4 border border-dashed rounded text-sm text-muted-foreground">
              Nenhum serviço listado.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="planName">Plano Oferecido / Nome do Projeto</Label>
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
          <Label htmlFor="duration">Duração do Projeto</Label>
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
        <Label htmlFor="validityDate">Data de Validade (Proposta)</Label>
        <Input
          id="validityDate"
          value={formData.validityDate}
          onChange={(e) =>
            setFormData({ ...formData, validityDate: e.target.value })
          }
          placeholder="Ex: 15 dias"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="discountedValue">Valor sem desconto (R$)</Label>
          <Input
            id="discountedValue"
            type="number"
            value={discountedValue}
            onChange={(e) => setDiscountedValue(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="value">Valor Real (com desconto)</Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            placeholder="0.00"
          />
        </div>
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
