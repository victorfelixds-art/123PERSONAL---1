import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { Subscription } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

interface SubscriptionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
}

export function SubscriptionHistoryDialog({
  open,
  onOpenChange,
  userId,
  userName,
}: SubscriptionHistoryDialogProps) {
  const [data, setData] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && userId) {
      const fetchHistory = async () => {
        setLoading(true)
        const { data: subs } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (subs) setData(subs as Subscription[])
        setLoading(false)
      }
      fetchHistory()
    }
  }, [open, userId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Histórico de Planos - {userName}</DialogTitle>
        </DialogHeader>
        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum histórico encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.plan_name}</TableCell>
                    <TableCell>
                      {format(new Date(sub.start_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(sub.end_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sub.status === 'ACTIVE'
                            ? 'default'
                            : sub.status === 'CANCELED'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {sub.status === 'ACTIVE'
                          ? 'Ativo'
                          : sub.status === 'CANCELED'
                            ? 'Cancelado'
                            : 'Expirado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(sub.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
