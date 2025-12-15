import { useParams, useNavigate, Link } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Edit,
  ExternalLink,
  Share2,
  MessageCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StudentForm } from '@/components/forms/StudentForm'

const AlunoDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    clients,
    removeClient,
    updateClient,
    workouts,
    diets,
    settings,
    profile,
  } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)

  const client = clients.find((c) => c.id === id)
  const clientWorkouts = workouts.filter((w) => w.clientId === id)
  const clientDiets = diets.filter((d) => d.clientId === id)

  if (!client) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Aluno não encontrado</h2>
        <Button onClick={() => navigate('/alunos')}>Voltar para Lista</Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      removeClient(client.id)
      toast.success('Aluno removido com sucesso')
      navigate('/alunos')
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/p/${client.linkId}`
    navigator.clipboard.writeText(link)
    toast.success('Link copiado para a área de transferência!')
  }

  const handleWhatsApp = () => {
    const template = settings.whatsappMessageTemplate || 'Olá {studentName}!'
    const message = template
      .replace('{studentName}', client.name)
      .replace('{personalName}', profile.name)

    const encodedMessage = encodeURIComponent(message)
    const phone = client.phone.replace(/\D/g, '') // Remove non-digits

    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-slide-up">
      <Button
        variant="ghost"
        className="mb-4 pl-0"
        onClick={() => navigate('/alunos')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3 h-fit">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={client.avatar} />
              <AvatarFallback>{client.name[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl text-center">{client.name}</CardTitle>
            <Badge
              variant={client.status === 'active' ? 'default' : 'secondary'}
              className="mt-2"
            >
              {client.status.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 justify-center pb-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleWhatsApp}
                className="w-full"
              >
                <MessageCircle className="mr-2 h-4 w-4 text-green-600" />{' '}
                WhatsApp
              </Button>
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Link do Aluno
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopyLink}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs truncate bg-background p-2 rounded border">
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {window.location.origin}/p/{client.linkId}
                </span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Peso</p>
                <p className="font-semibold">
                  {client.weight ? `${client.weight} kg` : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Altura</p>
                <p className="font-semibold">
                  {client.height ? `${client.height} m` : '-'}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Objetivo</p>
              <p className="font-medium">
                {client.objective || 'Não definido'}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Cliente desde{' '}
                  {new Date(client.since).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <Separator />
            <div className="text-sm">
              <p className="font-semibold mb-1">Plano</p>
              <p className="capitalize text-muted-foreground">
                {client.planType} - R$ {client.planValue}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Remover Aluno
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:w-2/3 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Treinos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                {clientWorkouts.length > 0 ? (
                  <ul className="space-y-2">
                    {clientWorkouts.map((w) => (
                      <li
                        key={w.id}
                        className="text-sm border-b pb-2 flex justify-between items-center"
                      >
                        <span className="font-medium">{w.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum treino</p>
                )}
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link to="/treinos">Gerenciar Treinos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dietas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                {clientDiets.length > 0 ? (
                  <ul className="space-y-2">
                    {clientDiets.map((d) => (
                      <li
                        key={d.id}
                        className="text-sm border-b pb-2 flex justify-between items-center"
                      >
                        <span className="font-medium">{d.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma dieta</p>
                )}
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link to="/dieta">Gerenciar Dietas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
          </DialogHeader>
          <StudentForm
            initialData={client}
            onSave={(data) => {
              updateClient({ ...client, ...data })
              setIsEditing(false)
              toast.success('Aluno atualizado')
            }}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AlunoDetalhes
