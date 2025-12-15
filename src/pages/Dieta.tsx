import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
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
import { Plus, Utensils, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Dieta = () => {
  const { diets, clients, addDiet, removeDiet } = useAppStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDiet, setNewDiet] = useState({
    title: '',
    clientId: '',
    calories: 2000,
  })

  const handleAddDiet = () => {
    if (!newDiet.title) return

    const client = clients.find((c) => c.id === newDiet.clientId)

    addDiet({
      id: Math.random().toString(36).substr(2, 9),
      title: newDiet.title,
      clientId: newDiet.clientId,
      clientName: client ? client.name : undefined,
      calories: newDiet.calories,
      meals: [
        { name: 'Café da Manhã', items: ['Ovos', 'Fruta'] },
        { name: 'Almoço', items: ['Proteína', 'Carbo', 'Vegetais'] },
        { name: 'Jantar', items: ['Proteína Leve', 'Salada'] },
      ],
    })
    setNewDiet({ title: '', clientId: '', calories: 2000 })
    setIsDialogOpen(false)
    toast.success('Dieta criada com sucesso!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dietas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Criar Nova Dieta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Plano Alimentar</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Nome da Dieta</Label>
                <Input
                  id="title"
                  value={newDiet.title}
                  onChange={(e) =>
                    setNewDiet({ ...newDiet, title: e.target.value })
                  }
                  placeholder="Ex: Emagrecimento"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calories">Calorias (Kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newDiet.calories}
                  onChange={(e) =>
                    setNewDiet({ ...newDiet, calories: Number(e.target.value) })
                  }
                  placeholder="2000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Aluno (Opcional)</Label>
                <Select
                  onValueChange={(val) =>
                    setNewDiet({ ...newDiet, clientId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDiet}>Criar Dieta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {diets.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Nenhuma dieta criada.
          </p>
          <Button variant="link" onClick={() => setIsDialogOpen(true)}>
            Criar primeira dieta
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {diets.map((diet) => (
            <Card key={diet.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{diet.title}</CardTitle>
                <CardDescription>
                  {diet.clientName
                    ? `Para: ${diet.clientName}`
                    : 'Sem aluno atribuído'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {diet.calories}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    kcal
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {diet.meals.length} refeições planejadas
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm">
                  Detalhes
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeDiet(diet.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dieta
