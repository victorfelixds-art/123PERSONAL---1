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
import { supabase } from '@/lib/supabase/client'
import { UserProfile, Subscription } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, FileClock, XCircle, Pencil } from 'lucide-react'
import { PlanDialog } from '@/components/admin/PlanDialog'
import { SubscriptionHistoryDialog } from '@/components/admin/SubscriptionHistoryDialog'
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

type PersonalWithPlan = UserProfile & {
  activeSubscription?: Subscription
}

export default function ManagePlans() {
  const [data, setData] = useState<PersonalWithPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PersonalWithPlan | null>(
    null,
  )
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null)
  const [cancelSubscription, setCancelSubscription] =
    useState<Subscription | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: users, error: usersError } = await supabase
        .from('users_profile')
        .select('*')
        .eq('role', 'PERSONAL')
        .neq('status', 'PENDENTE') // Only manage plans for approved users
        .order('name')

      if (usersError) throw usersError

      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'ACTIVE')

      if (subsError) throw subsError

      const enrichedData = users.map((user) => {
        const activeSub = subs?.find((s) => s.user_id === user.id)
        return {
          ...(user as UserProfile),
          activeSubscription: activeSub as Subscription | undefined,
        }
      })
      setData(enrichedData)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCancelSubscription = async () => {
    if (!cancelSubscription) return

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'CANCELED' })
        .eq('id', cancelSubscription.id)

      if (error) throw error

      toast.success('Assinatura cancelada com sucesso')
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao cancelar assinatura')
    } finally {
      setCancelSubscription(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Assinaturas
          </h1>
          <p className="text-muted-foreground">
            Controle os planos de assinatura dos personals.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null)
            setSelectedSubscription(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Personal</TableHead>
              <TableHead>Status Conta</TableHead>
              <TableHead>Plano Atual</TableHead>
              <TableHead>Vigência</TableHead>
              <TableHead>Status Plano</TableHead>
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
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'ATIVO' ? 'default' : 'destructive'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.activeSubscription?.plan_name || 'Nenhum plano ativo'}
                  </TableCell>
                  <TableCell>
                    {user.activeSubscription
                      ? `${format(new Date(user.activeSubscription.start_date), 'dd/MM/yy')} - ${format(
                          new Date(user.activeSubscription.end_date),
                          'dd/MM/yy',
                        )}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {user.activeSubscription ? (
                      <Badge
                        variant="outline"
                        className="border-green-600 text-green-600"
                      >
                        ATIVO
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
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
                            setSelectedUser(user)
                            setHistoryOpen(true)
                          }}
                        >
                          <FileClock className="mr-2 h-4 w-4" /> Histórico
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!user.activeSubscription ? (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setSelectedSubscription(null)
                              setDialogOpen(true)
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Plano
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setSelectedSubscription(
                                  user.activeSubscription || null,
                                )
                                setDialogOpen(true)
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Editar Plano
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setCancelSubscription(user.activeSubscription!)
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Cancelar
                              Plano
                            </DropdownMenuItem>
                          </>
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
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subscription={selectedSubscription}
        userId={selectedUser?.id}
        onSuccess={fetchData}
      />

      {selectedUser && (
        <SubscriptionHistoryDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          userId={selectedUser.id}
          userName={selectedUser.name}
        />
      )}

      <AlertDialog
        open={!!cancelSubscription}
        onOpenChange={(open) => !open && setCancelSubscription(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar o plano "
              {cancelSubscription?.plan_name}"? O status será alterado para
              CANCELADO imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive hover:bg-destructive/90"
            >
              Cancelar Plano
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
