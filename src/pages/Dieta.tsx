import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Diet } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Plus,
  Trash2,
  Copy,
  Edit,
  Clock,
  Download,
  UserPlus,
  Share2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { generateDietPDF } from '@/lib/pdfGenerator'
import { DietForm } from '@/components/forms/DietForm'
import { DietAssignmentDialog } from '@/components/DietAssignmentDialog'
import { Badge } from '@/components/ui/badge'
import { isBefore, parseISO } from 'date-fns'

const Dieta = () => {
  const {
    diets,
    addDiet,
    updateDiet,
    removeDiet,
    duplicateDiet,
    profile,
    settings,
  } = useAppStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDiet, setEditingDiet] = useState<Diet | undefined>(undefined)
  const [assignDietId, setAssignDietId] = useState<string | null>(null)
  const [deleteDietId, setDeleteDietId] = useState<string | null>(null)

  const handleOpenNew = () => {
    setEditingDiet(undefined)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (diet: Diet) => {
    setEditingDiet(diet)
    setIsFormOpen(true)
  }

  const handleSave = (data: Partial<Diet>) => {
    if (!data.title) return

    const dietData = {
      ...data,
      meals: data.meals || [],
      // Ensure strings for required fields
      objective: data.objective || 'Geral',
      type: data.type || 'Balanceada',
      observations: data.observations || '',
    }

    if (editingDiet) {
      updateDiet({ ...editingDiet, ...dietData } as Diet)
      toast.success('Dieta atualizada!')
    } else {
      addDiet({
        ...dietData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        isLifetime: true,
      } as Diet)
      toast.success('Dieta criada com sucesso!')
    }
    setIsFormOpen(false)
  }

  const handleDelete = () => {
    if (deleteDietId) {
      removeDiet(deleteDietId)
      toast.success('Dieta excluída!')
      setDeleteDietId(null)
    }
  }

  const handleDownload = (diet: Diet) => {
    generateDietPDF(diet, profile, settings.themeColor)
    toast.success('PDF da dieta gerado!')
  }

  const handleWhatsApp = (diet: Diet) => {
    const template =
      settings.whatsappMessageTemplate ||
      'Olá {studentName}! Aqui é o {personalName}.'
    const linkPlaceholder = '{link}'

    // Simulate sending PDF
    let message = template
      .replace('{studentName}', diet.clientName || 'Aluno')
      .replace('{personalName}', profile.name)

    if (message.includes(linkPlaceholder)) {
      message = message.replace(linkPlaceholder, '[PDF da Dieta Anexado]')
    } else {
      message += ' Segue sua dieta.'
    }

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const getStatus = (diet: Diet) => {
    if (!diet.clientId)
      return { label: 'Sem Aluno', color: 'bg-gray-200 text-gray-800' }

    if (
      !diet.isLifetime &&
      diet.expirationDate &&
      isBefore(parseISO(diet.expirationDate), new Date())
    ) {
      return { label: 'Vencida', color: 'bg-red-100 text-red-800' }
    }

    return { label: 'Ativa', color: 'bg-green-100 text-green-800' }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dietas</h1>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" /> Criar Nova Dieta
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDiet ? 'Editar Dieta' : 'Nova Dieta'}
            </DialogTitle>
          </DialogHeader>
          <DietForm
            initialData={editingDiet}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DietAssignmentDialog
        dietId={assignDietId}
        open={!!assignDietId}
        onOpenChange={(open) => !open && setAssignDietId(null)}
      />

      <AlertDialog
        open={!!deleteDietId}
        onOpenChange={(open) => !open && setDeleteDietId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente a
              dieta e removerá a associação com alunos, se houver.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {diets.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            <p>Nenhuma dieta criada ainda.</p>
          </div>
        ) : (
          diets.map((diet) => {
            const status = getStatus(diet)
            return (
              <Card
                key={diet.id}
                className="flex flex-col h-full hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                    <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {diet.type}
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">
                    {diet.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Objetivo
                    </p>
                    <p className="text-sm">{diet.objective}</p>
                  </div>
                  {diet.clientName && (
                    <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 p-2 rounded">
                      <UserPlus className="h-4 w-4" />
                      Aluno: {diet.clientName}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {diet.isLifetime
                        ? 'Vitalícia'
                        : diet.expirationDate
                          ? `Vence: ${new Date(diet.expirationDate).toLocaleDateString()}`
                          : '-'}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {diet.meals.length} refeições cadastradas
                  </p>
                </CardContent>
                <CardFooter className="pt-2 border-t grid grid-cols-5 gap-1 p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Atribuir"
                    onClick={() => setAssignDietId(diet.id)}
                    className="h-8 w-full"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Duplicar"
                    onClick={() => duplicateDiet(diet.id)}
                    className="h-8 w-full"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Editar"
                    onClick={() => handleOpenEdit(diet)}
                    className="h-8 w-full"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Compartilhar WhatsApp"
                    onClick={() => handleWhatsApp(diet)}
                    className="h-8 w-full text-green-600 hover:text-green-700"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Visualizar/Imprimir"
                    onClick={() => handleDownload(diet)}
                    className="h-8 w-full"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </CardFooter>
                <div className="px-2 pb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteDietId(diet.id)}
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Dieta
