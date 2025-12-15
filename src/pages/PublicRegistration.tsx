import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { CheckCircle2, Dumbbell } from 'lucide-react'
import { Client } from '@/lib/types'

const PublicRegistration = () => {
  const { addClient } = useAppStore()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    weight: '',
    height: '',
    objective: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: 'active', // Pending activation normally, but active for demo
      since: new Date().toISOString().split('T')[0],
      linkId: Math.random().toString(36).substr(2, 9),
      planName: 'A Definir',
      planValue: 0,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      objective: formData.objective,
      avatar: `https://img.usecurling.com/ppl/medium?gender=male&seed=${Math.random()}`,
    }

    addClient(newClient)
    setSubmitted(true)
    toast.success('Cadastro realizado com sucesso!')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg border-primary/20">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4 animate-in zoom-in">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Cadastro Recebido!</CardTitle>
            <CardDescription className="text-base mt-2">
              Obrigado, {formData.name}. Seus dados já foram enviados para o
              Personal Trainer. Em breve entraremos em contato.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Ficha de Cadastro</CardTitle>
            <CardDescription>
              Preencha seus dados para iniciar seu acompanhamento.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">WhatsApp *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="Ex: 75"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="height">Altura (m)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  placeholder="Ex: 1.75"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="objective">Qual seu principal objetivo?</Label>
              <Textarea
                id="objective"
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
                placeholder="Ex: Emagrecer, ganhar massa muscular, saúde..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full size-lg mt-4">
              Enviar Cadastro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PublicRegistration
