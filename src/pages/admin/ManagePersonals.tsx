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
import { UserProfile } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ShieldCheck, Ban, Trash2 } from 'lucide-react'
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

type PersonalWithSub = UserProfile & {
  currentPlan?: string
  planEndDate?: string
}

export default function ManagePersonals() {
  const [data, setData] = useState<PersonalWithSub[]>([])
  const [loading, setLoading] = useState(true)
  const [actionUser, setActionUser] = useState<PersonalWithSub | null>(null)
  const [actionType, setActionType] = useState<
    'approve' | 'deactivate' | 'reactivate' | 'delete' | null
  >(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: users, error: usersError } = await supabase
        .from('users_profile')
        .select('*')
        .eq('role', 'PERSONAL')
        .order('created_at', { ascending: false })

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
          currentPlan: activeSub?.plan_name,
          planEndDate: activeSub?.end_date,
        }
      })
      setData(enrichedData)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar lista de personais')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAction = async () => {
    if (!actionUser || !actionType) return

    try {
      let error: any
      if (actionType === 'delete') {
        const { error: delError } = await supabase
          .from('users_profile')
          .delete()
          .eq('id', actionUser.id)
        error = delError
      } else {
        const newStatus =
          actionType === 'approve' || actionType === 'reactivate'
            ? 'ATIVO'
            : 'INATIVO'
        const { error: upError } = await supabase
          .from('users_profile')
          .update({ status: newStatus })
          .eq('id', actionUser.id)
        error = upError
      }

      if (error) throw error
      toast.success('Ação realizada com sucesso')
      fetchData()
    } catch (err) {
      toast.error('Erro ao realizar ação. Verifique suas permissões.')
    } finally {
      setActionUser(null)
      setActionType(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestão de Personais
        </h1>
        <p className="text-muted-foreground">
          Gerencie todos os personal trainers cadastrados.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Plano Atual</TableHead>
              <TableHead>Fim do Plano</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'ATIVO'
                          ? 'default'
                          : user.status === 'PENDENTE'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{user.currentPlan || '-'}</TableCell>
                  <TableCell>
                    {user.planEndDate
                      ? format(new Date(user.planEndDate), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.status === 'PENDENTE' && (
                          <DropdownMenuItem
                            onClick={() => {
                              setActionUser(user)
                              setActionType('approve')
                            }}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" /> Aprovar
                            conta
                          </DropdownMenuItem>
                        )}
                        {user.status === 'ATIVO' && (
                          <DropdownMenuItem
                            onClick={() => {
                              setActionUser(user)
                              setActionType('deactivate')
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" /> Desativar conta
                          </DropdownMenuItem>
                        )}
                        {user.status === 'INATIVO' && (
                          <DropdownMenuItem
                            onClick={() => {
                              setActionUser(user)
                              setActionType('reactivate')
                            }}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" /> Reativar
                            conta
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setActionUser(user)
                            setActionType('delete')
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir conta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!actionUser}
        onOpenChange={(open) => !open && setActionUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'delete'
                ? `Tem certeza que deseja excluir permanentemente a conta de ${actionUser?.name}? Esta ação não pode ser desfeita.`
                : `Tem certeza que deseja alterar o status de ${actionUser?.name} para ${
                    actionType === 'approve' || actionType === 'reactivate'
                      ? 'ATIVO'
                      : 'INATIVO'
                  }?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                actionType === 'delete'
                  ? 'bg-destructive hover:bg-destructive/90'
                  : ''
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
