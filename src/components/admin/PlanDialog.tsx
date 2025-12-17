import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { UserProfile, Subscription } from '@/lib/types'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  user_id: z.string().min(1, 'Selecione um personal'),
  plan_name: z
    .string()
    .min(3, 'Nome do plano deve ter pelo menos 3 caracteres'),
  start_date: z.string().min(1, 'Data de início obrigatória'),
  end_date: z.string().min(1, 'Data de término obrigatória'),
})

interface PlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription?: Subscription | null
  userId?: string
  onSuccess: () => void
}

export function PlanDialog({
  open,
  onOpenChange,
  subscription,
  userId,
  onSuccess,
}: PlanDialogProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: '',
      plan_name: '',
      start_date: '',
      end_date: '',
    },
  })

  useEffect(() => {
    if (open) {
      fetchUsers()
      if (subscription) {
        form.reset({
          user_id: subscription.user_id,
          plan_name: subscription.plan_name,
          start_date: subscription.start_date.split('T')[0],
          end_date: subscription.end_date.split('T')[0],
        })
      } else {
        form.reset({
          user_id: userId || '',
          plan_name: '',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
        })
      }
    }
  }, [open, subscription, userId, form])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('users_profile')
      .select('*')
      .eq('role', 'PERSONAL')
      .order('name')
    if (data) setUsers(data as UserProfile[])
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      const payload = {
        user_id: values.user_id,
        plan_name: values.plan_name,
        start_date: new Date(values.start_date).toISOString(),
        end_date: new Date(values.end_date).toISOString(),
        status: subscription ? subscription.status : 'ACTIVE', // Keep status on edit, set ACTIVE on create
      }

      let error
      if (subscription) {
        const { error: upError } = await supabase
          .from('subscriptions')
          .update(payload)
          .eq('id', subscription.id)
        error = upError
      } else {
        const { error: inError } = await supabase
          .from('subscriptions')
          .insert([payload])
        error = inError
      }

      if (error) throw error
      toast.success(
        subscription ? 'Plano atualizado!' : 'Plano criado com sucesso!',
      )
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar plano.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {subscription ? 'Editar Plano' : 'Novo Plano'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!subscription || !!userId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um personal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plan_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Plano Anual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Término</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
