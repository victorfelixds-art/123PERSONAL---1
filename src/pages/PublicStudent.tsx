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
} from '@/components/ui/card'
import { toast } from 'sonner'
import { CheckCircle2, UserCircle2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

const PublicStudent = () => {
  const { linkId } = useParams()
  const { clients, updateClient } = useAppStore()
  const [client, setClient] = useState(clients.find((c) => c.linkId === linkId))
  const [formData, setFormData] = useState({
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
        weight: found.weight?.toString() || '',
        height: found.height?.toString() || '',
        objective: found.objective || '',
      })
    }
  }, [linkId, clients])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) return

    updateClient({
      ...client,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      objective: formData.objective,
    })
    setSubmitted(true)
    toast.success('Informações atualizadas com sucesso!')
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Dados Enviados!</CardTitle>
            <CardDescription>
              Obrigado, {client.name}. Seu personal trainer já recebeu suas
              informações atualizadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Editar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {client.avatar ? (
              <img
                src={client.avatar}
                alt={client.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md"
              />
            ) : (
              <UserCircle2 className="w-20 h-20 mx-auto text-gray-300" />
            )}
          </div>
          <CardTitle>Atualizar Medidas</CardTitle>
          <CardDescription>
            Olá, {client.name}! Mantenha seus dados atualizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="grid gap-2">
              <Label htmlFor="objective">Objetivo</Label>
              <Textarea
                id="objective"
                placeholder="Ex: Emagrecer, Hipertrofia..."
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar Informações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PublicStudent
