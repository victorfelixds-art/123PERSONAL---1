import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)

    if (error) {
      toast.error(error.message || 'Erro ao criar conta')
    } else {
      // Supabase auto-signs in or sends confirmation email.
      // Assuming auto-sign in or redirect to check email.
      // If auto-signed in, `useAuth` will handle redirect to pending based on status.
      // If email confirmation is required, we should inform user.
      toast.success('Conta criada com sucesso!')
      // Navigate to pending which will be handled by ProtectedRoute or directly if session active
      // For safety, push to pending page directly if no error, though auth state change will likely trigger redirect.
      navigate('/account/pending')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-extrabold uppercase tracking-tight">
            Criar Conta
          </CardTitle>
          <CardDescription>
            Cadastro exclusivo para Personal Trainers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full font-bold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
