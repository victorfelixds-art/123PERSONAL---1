import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Client } from '@/lib/types'
import { toast } from 'sonner'
import { StudentSummary } from '@/components/student/StudentSummary'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function AlunoDetalhes() {
  const { id } = useParams()
  const [student, setStudent] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStudent = async () => {
    if (!id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setStudent(data as Client)
    } catch (error) {
      console.error('Error fetching student details:', error)
      toast.error('Erro ao carregar detalhes do aluno')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudent()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-semibold">Aluno não encontrado</h2>
        <Button asChild>
          <Link to="/students">Voltar para lista</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/students">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
            <AvatarImage src={student.avatar_url || ''} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {student.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {student.name}
              <Badge
                variant={student.status === 'ATIVO' ? 'default' : 'secondary'}
                className="text-xs font-normal"
              >
                {student.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
        </div>
      </div>

      <StudentSummary client={student} onUpdate={fetchStudent} />
    </div>
  )
}
