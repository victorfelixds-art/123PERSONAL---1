import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { Subscription } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Ban, Plus, Search, History } from 'lucide-react'
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
import { PlanDialog } from '@/components/admin/PlanDialog'

type SubscriptionWithUser = Subscription & {
  user_name?: string
  user_email?: string
}

export default function ManagePlans() {
  const [data, setData] = useState<SubscriptionWithUser[]>([])
  const [filteredData, setFilteredData] = useState<SubscriptionWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [actionSub, setActionSub] = useState<Subscription | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (subsError) throw subsError

      const { data: users, error: usersError } = await supabase
        .from('users_profile')
        .select('id, name, email')

      if (usersError) throw usersError

      const enriched = subs.map((sub) => {
        const user = users.find((u) => u.id === sub.user_id)
        return {
          ...sub,
          user_name: user?.name,
          user_email: user?.email,
        }
      })
      setData(enriched as SubscriptionWithUser[])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar planos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = data
    if (!showHistory) {
      filtered = filtered.filter((sub) => sub.status === 'ACTIVE')
    }
    if (search) {
      const lowerSearch = search.toLowerCase()
      filtered = filtered.filter(
        (sub) =>
          sub.user_name?.toLowerCase().includes(lowerSearch) ||
          sub.plan_name.toLowerCase().includes(lowerSearch),
      )
    }
    setFilteredData(filtered)
  }, [data, search, showHistory])

  const handleCancelPlan = async () => {
    if (!actionSub) return
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'CANCELED' })
        .eq('id', actionSub.id)

      if (error) throw error
      toast.success('Plano cancelado com sucesso!')
      fetchData()
    } catch (err) {
      toast.error('Erro ao cancelar plano.')
    } finally {
      setActionSub(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Planos
          </h1>
          <p className="text-muted-foreground">
            Administre assinaturas e planos dos personais.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedSub(null)
            setIsFormOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome ou plano..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant={showHistory ? 'default' : 'outline'}
          onClick={() => setShowHistory(!showHistory)}
          className="gap-2"
        >
          <History className="h-4 w-4" />
          {showHistory ? 'Ocultar Histórico' : 'Visualizar Histórico'}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Personal</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Término</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhum plano encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{sub.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {sub.user_email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{sub.plan_name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sub.status === 'ACTIVE'
                          ? 'default'
                          : sub.status === 'EXPIRED'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {sub.status === 'ACTIVE'
                        ? 'Ativo'
                        : sub.status === 'EXPIRED'
                          ? 'Vencido'
                          : 'Cancelado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.start_date), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.end_date), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSub(sub)
                            setIsFormOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar Plano
                        </DropdownMenuItem>
                        {sub.status === 'ACTIVE' && (
                          <DropdownMenuItem
                            onClick={() => setActionSub(sub)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" /> Encerrar Plano
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PlanDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        subscription={selectedSub}
        onSuccess={fetchData}
      />

      <AlertDialog
        open={!!actionSub}
        onOpenChange={(open) => !open && setActionSub(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar plano</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar o plano{' '}
              <strong>{actionSub?.plan_name}</strong> de{' '}
              <strong>{actionSub?.user_name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelPlan}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
