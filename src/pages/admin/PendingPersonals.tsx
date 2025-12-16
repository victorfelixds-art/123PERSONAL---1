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
import { ShieldCheck, UserX } from 'lucide-react'

export default function PendingPersonals() {
  const [data, setData] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: users, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('status', 'PENDENTE')
        .eq('role', 'PERSONAL')
        .order('created_at', { ascending: false })

      if (error) throw error
      setData(users as UserProfile[])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar solicitações')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'ATIVO' : 'INATIVO'
      const { error } = await supabase
        .from('users_profile')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success(
        action === 'approve' ? 'Usuário aprovado!' : 'Solicitação rejeitada.',
      )
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao processar ação')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Solicitações Pendentes
        </h1>
        <p className="text-muted-foreground">
          Aprove ou rejeite novos cadastros de personal trainers.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Nenhuma solicitação pendente.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleAction(user.id, 'reject')}
                      >
                        <UserX className="h-4 w-4 mr-1" /> Rejeitar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction(user.id, 'approve')}
                      >
                        <ShieldCheck className="h-4 w-4 mr-1" /> Aprovar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
