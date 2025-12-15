import { useParams, useNavigate, Link } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, Phone, Calendar, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const AlunoDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { clients, removeClient, workouts, diets } = useAppStore()

  const client = clients.find((c) => c.id === id)
  const clientWorkouts = workouts.filter(
    (w) => w.clientId === id || w.clientName === client?.name,
  )
  const clientDiets = diets.filter(
    (d) => d.clientId === id || d.clientName === client?.name,
  )

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

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-slide-up">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
        onClick={() => navigate('/alunos')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Alunos
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3 h-fit">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={client.avatar} />
              <AvatarFallback>{client.name[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl text-center">{client.name}</CardTitle>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
              {client.status.toUpperCase()}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <Separator className="my-4" />

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Remover Aluno
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:w-2/3 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Treinos Atribuídos</CardTitle>
              </CardHeader>
              <CardContent>
                {clientWorkouts.length > 0 ? (
                  <ul className="space-y-2">
                    {clientWorkouts.map((w) => (
                      <li
                        key={w.id}
                        className="text-sm border-b pb-2 last:border-0 last:pb-0"
                      >
                        <Link
                          to="/treinos"
                          className="font-medium hover:text-primary"
                        >
                          {w.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {w.exercises.length} exercícios
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum treino atribuído.
                  </p>
                )}
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link to="/treinos">Gerenciar Treinos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dietas Atribuídas</CardTitle>
              </CardHeader>
              <CardContent>
                {clientDiets.length > 0 ? (
                  <ul className="space-y-2">
                    {clientDiets.map((d) => (
                      <li
                        key={d.id}
                        className="text-sm border-b pb-2 last:border-0 last:pb-0"
                      >
                        <Link
                          to="/dieta"
                          className="font-medium hover:text-primary"
                        >
                          {d.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {d.calories} kcal
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma dieta atribuída.
                  </p>
                )}
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link to="/dieta">Gerenciar Dietas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlunoDetalhes
