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
import { ShieldCheck } from 'lucide-react'
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

export default function PendingPersonals() {
  const [data, setData] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: users, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('role', 'PERSONAL')
        .eq('status', 'PENDENTE')
        .order('created_at', { ascending: false })

      if (error) throw error
      setData(users as UserProfile[])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar personais pendentes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async () => {
    if (!selectedUser) return
    try {
      const { error } = await supabase
        .from('users_profile')
        .update({ status: 'ATIVO' })
        .eq('id', selectedUser.id)

      if (error) throw error
      toast.success('Conta aprovada com sucesso!')
      fetchData()
    } catch (err) {
      toast.error('Erro ao aprovar conta.')
    } finally {
      setSelectedUser(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Personais Pendentes
        </h1>
        <p className="text-muted-foreground">
          Aprove o cadastro de novos personal trainers.
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
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhum personal pendente.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" /> Aprovar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar cadastro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja aprovar o cadastro de {selectedUser?.name}?
              O usuário terá acesso imediato ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>
              Confirmar Aprovação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
