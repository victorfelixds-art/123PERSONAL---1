import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { CheckCircle2, UserCircle2, Ban } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

const PublicStudent = () => {
  const { linkId } = useParams()
  const { clients, updateClient } = useAppStore()
  const [client, setClient] = useState(clients.find((c) => c.linkId === linkId))
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    weight: '',
    height: '',
    objective: '',
  })
  const [submitted, setSubmitted] = useState(false)

  // Update local client if store changes or on mount
  useEffect(() => {
    const found = clients.find((c) => c.linkId === linkId)
    setClient(found)
    if (found) {
      setFormData({
        email: found.email || '',
        phone: found.phone || '',
        weight: found.weight?.toString() || '',
        height: found.height?.toString() || '',
        objective: found.objective || '',
      })
    }
  }, [linkId, clients])

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email && !formData.phone) {
        toast.error('Por favor, preencha pelo menos um contato.')
        return
      }
    }
    setStep(step + 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) return

    updateClient({
      ...client,
      email: formData.email,
      phone: formData.phone,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      objective: formData.objective,
      profileStatus: 'complete',
    })
    setSubmitted(true)
    toast.success('Informações atualizadas com sucesso!')
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-card">
          <CardHeader>
            <CardTitle>Link Inválido</CardTitle>
            <CardDescription>
              Não encontramos um aluno com este link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!client.linkActive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-card">
          <CardHeader>
            <div className="mx-auto bg-red-900 p-3 rounded-full w-fit mb-4">
              <Ban className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Link Expirado ou Inativo</CardTitle>
            <CardDescription>
              Este link não está mais disponível. Entre em contato com seu
              personal trainer.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-card">
          <CardHeader>
            <div className="mx-auto bg-green-900 p-3 rounded-full w-fit mb-4">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Dados Enviados!</CardTitle>
            <CardDescription>
              Obrigado, {client.name}. Seu perfil foi completado com sucesso.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <UserCircle2 className="w-20 h-20 mx-auto text-muted-foreground" />
          </div>
          <CardTitle>Preencha seu Perfil</CardTitle>
          <CardDescription>Passo {step} de 3</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
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
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid gap-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 75.5"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height">Altura (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 1.75"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid gap-2">
                  <Label htmlFor="objective">
                    Qual seu principal objetivo?
                  </Label>
                  <Textarea
                    id="objective"
                    placeholder="Ex: Emagrecer, Hipertrofia..."
                    value={formData.objective}
                    onChange={(e) =>
                      setFormData({ ...formData, objective: e.target.value })
                    }
                    required
                    rows={4}
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Voltar
            </Button>
          ) : (
            <div></div> // Spacer
          )}

          {step < 3 ? (
            <Button onClick={handleNext}>Próximo</Button>
          ) : (
            <Button onClick={handleSubmit}>Finalizar</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default PublicStudent
