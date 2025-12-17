import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Users, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Client } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function Alunos() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('personal_id', user?.id)
        .eq('role', 'STUDENT')
        .order('name')

      if (error) throw error
      setStudents(data as Client[])
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Erro ao carregar lista de alunos')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchStudents()
    }
  }, [user, fetchStudents])

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie seus alunos e acompanhe o progresso.
          </p>
        </div>
        <Button onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
          <UserPlus className="mr-2 h-4 w-4" /> Novo Aluno
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar aluno..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-md border p-12 text-center text-muted-foreground flex flex-col items-center justify-center border-dashed">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            Nenhum aluno encontrado
          </h3>
          <p className="text-sm max-w-sm">
            {searchTerm
              ? 'Tente buscar com outros termos.'
              : 'Comece adicionando seu primeiro aluno para acompanhar treinos e dietas.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Link key={student.id} to={`/students/${student.id}`}>
              <Card className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-background">
                      <AvatarImage src={student.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {student.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {student.status}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
