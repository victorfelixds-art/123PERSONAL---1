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
  Utensils,
  MoreVertical,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
    generateDietPDF(diet, profile, settings.theme)
    toast.success('PDF da dieta gerado!')
  }

  const handleWhatsApp = (diet: Diet) => {
    const message = `Olá! Segue a dieta: ${diet.title}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const getStatus = (diet: Diet) => {
    if (!diet.clientId)
      return { label: 'MODELO', color: 'bg-muted text-muted-foreground' }

    if (
      !diet.isLifetime &&
      diet.expirationDate &&
      isBefore(parseISO(diet.expirationDate), new Date())
    ) {
      return { label: 'VENCIDA', color: 'bg-red-900 text-white' }
    }

    return { label: 'ATIVA', color: 'bg-green-900 text-white' }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">
          Dietas
        </h1>
        <Button size="lg" onClick={handleOpenNew}>
          <Plus className="mr-2 h-5 w-5" /> Criar Dieta
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {diets.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5">
            <Utensils className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhuma dieta criada.</p>
          </div>
        ) : (
          diets.map((diet) => {
            const status = getStatus(diet)
            return (
              <Card
                key={diet.id}
                className="flex flex-col h-full hover:border-primary/60 transition-all border-l-4 border-l-transparent hover:border-l-primary"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="outline"
                      className={`${status.color} font-bold border-transparent`}
                    >
                      {status.label}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mr-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setAssignDietId(diet.id)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" /> Atribuir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => duplicateDiet(diet.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(diet)}>
                          <Download className="mr-2 h-4 w-4" /> PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteDietId(diet.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-xl leading-tight line-clamp-1 uppercase">
                    {diet.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {diet.type}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
                      Objetivo
                    </p>
                    <p className="text-sm font-medium">{diet.objective}</p>
                  </div>
                  {diet.clientName && (
                    <div className="bg-muted/30 p-2 rounded-lg border border-border/50">
                      <p className="text-xs font-bold uppercase text-primary mb-1 flex items-center gap-1">
                        <UserPlus className="h-3 w-3" /> Aluno
                      </p>
                      <p className="text-sm font-bold truncate">
                        {diet.clientName}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {diet.isLifetime
                      ? 'Vitalícia'
                      : diet.expirationDate
                        ? `Vence: ${new Date(diet.expirationDate).toLocaleDateString()}`
                        : '-'}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/10">
                  <div className="flex justify-between w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 font-bold"
                      onClick={() => handleOpenEdit(diet)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <Button
                      className="flex-1 font-bold bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                      onClick={() => handleWhatsApp(diet)}
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Whats
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })
        )}
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
            <AlertDialogTitle>Excluir Dieta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. A dieta será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Dieta
