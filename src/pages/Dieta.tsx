import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Diet } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Copy, Edit, Clock, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { generateDietPDF } from '@/lib/pdfGenerator'

const Dieta = () => {
  const {
    diets,
    clients,
    addDiet,
    updateDiet,
    removeDiet,
    duplicateDiet,
    profile,
  } = useAppStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Diet>>({
    title: '',
    clientId: 'none',
    calories: 2000,
    isLifetime: true,
    expirationDate: '',
  })

  const openNew = () => {
    setEditingId(null)
    setFormData({
      title: '',
      clientId: 'none',
      calories: 2000,
      isLifetime: true,
      expirationDate: '',
    })
    setIsDialogOpen(true)
  }

  const openEdit = (diet: Diet) => {
    setEditingId(diet.id)
    setFormData({
      ...diet,
      clientId: diet.clientId || 'none',
      expirationDate: diet.expirationDate || '',
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.title) return

    const client =
      formData.clientId !== 'none'
        ? clients.find((c) => c.id === formData.clientId)
        : undefined

    const dietData = {
      title: formData.title,
      clientId: client?.id,
      clientName: client?.name,
      calories: formData.calories,
      isLifetime: formData.isLifetime,
      expirationDate: formData.isLifetime ? null : formData.expirationDate,
      meals: (editingId
        ? diets.find((d) => d.id === editingId)?.meals
        : []) || [{ name: 'Refeição 1', items: ['Item A', 'Item B'] }],
    }

    if (editingId) {
      updateDiet({ ...dietData, id: editingId } as Diet)
      toast.success('Dieta atualizada')
    } else {
      addDiet({
        ...dietData,
        id: Math.random().toString(36).substr(2, 9),
      } as Diet)
      toast.success('Dieta criada')
    }
    setIsDialogOpen(false)
  }

  const handleDownload = (diet: Diet) => {
    generateDietPDF(diet, profile.name)
    toast.success('PDF da dieta gerado!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dietas</h1>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Nova Dieta
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Dieta' : 'Nova Dieta'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Calorias</Label>
              <Input
                type="number"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Aluno</Label>
              <Select
                value={formData.clientId}
                onValueChange={(val) =>
                  setFormData({ ...formData, clientId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem aluno</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isLifetime}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isLifetime: checked })
                }
              />
              <Label>Sem validade</Label>
            </div>
            {!formData.isLifetime && (
              <div className="grid gap-2">
                <Label>Data de Término</Label>
                <Input
                  type="date"
                  value={formData.expirationDate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, expirationDate: e.target.value })
                  }
                />
              </div>
            )}
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {diets.map((diet) => (
          <Card key={diet.id}>
            <CardHeader>
              <CardTitle>{diet.title}</CardTitle>
              <CardDescription>{diet.clientName || 'Geral'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {diet.calories} kcal
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {diet.isLifetime
                  ? 'Vitalício'
                  : `Vence em ${diet.expirationDate}`}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="ghost"
                size="icon"
                title="Baixar PDF"
                onClick={() => handleDownload(diet)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => duplicateDiet(diet.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(diet)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeDiet(diet.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dieta
