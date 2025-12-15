import { Workout, Diet, UserProfile, AppSettings, Client } from '@/lib/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Share2 } from 'lucide-react'
import { generateWorkoutPDF, generateDietPDF } from '@/lib/pdfGenerator'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface DeliverablesTabProps {
  client: Client
  workouts: Workout[]
  diets: Diet[]
  profile: UserProfile
  settings: AppSettings
}

export function DeliverablesTab({
  client,
  workouts,
  diets,
  profile,
  settings,
}: DeliverablesTabProps) {
  const handleDownloadWorkout = (workout: Workout) => {
    generateWorkoutPDF(workout, profile, settings.themeColor)
    toast.success('PDF do treino gerado!')
  }

  const handleDownloadDiet = (diet: Diet) => {
    generateDietPDF(diet, profile, settings.themeColor)
    toast.success('PDF da dieta gerado!')
  }

  const handleShare = (type: 'Treino' | 'Dieta', title: string) => {
    // Simulate sharing
    const message = `Olá ${client.name}, aqui está o PDF do seu ${type}: ${title}.`
    const encodedMessage = encodeURIComponent(message)
    const phone = client.phone.replace(/\D/g, '')
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
    } else {
      toast.error('Telefone do aluno não cadastrado.')
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Workouts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              PDFs de Treino
            </CardTitle>
            <CardDescription>
              Gere e compartilhe os treinos do aluno.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workouts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum treino atribuído.
              </p>
            ) : (
              workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card/50"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-medium truncate">{workout.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Criado em{' '}
                      {format(new Date(workout.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownloadWorkout(workout)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleShare('Treino', workout.title)}
                      title="Compartilhar"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Diets Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              PDFs de Dieta
            </CardTitle>
            <CardDescription>
              Gere e compartilhe as dietas do aluno.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {diets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma dieta atribuída.
              </p>
            ) : (
              diets.map((diet) => (
                <div
                  key={diet.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card/50"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-medium truncate">{diet.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Criado em {format(new Date(diet.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownloadDiet(diet)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleShare('Dieta', diet.title)}
                      title="Compartilhar"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
