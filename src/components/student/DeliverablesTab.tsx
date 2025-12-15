import { Workout, Diet, UserProfile, AppSettings, Client } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { FileText, Download, Share2, FileType } from 'lucide-react'
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
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Workouts Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
              <FileType className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Treinos PDF
              </h3>
              <p className="text-sm text-muted-foreground">
                Documentos de treino gerados
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum treino disponível.
                </p>
              </div>
            ) : (
              workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-semibold truncate text-foreground">
                      {workout.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Criado em{' '}
                      {format(new Date(workout.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleDownloadWorkout(workout)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleShare('Treino', workout.title)}
                      title="Compartilhar"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Diets Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-700">
              <FileType className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Dietas PDF
              </h3>
              <p className="text-sm text-muted-foreground">
                Documentos de dieta gerados
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {diets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma dieta disponível.
                </p>
              </div>
            ) : (
              diets.map((diet) => (
                <div
                  key={diet.id}
                  className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-semibold truncate text-foreground">
                      {diet.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Criado em {format(new Date(diet.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleDownloadDiet(diet)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleShare('Dieta', diet.title)}
                      title="Compartilhar"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
