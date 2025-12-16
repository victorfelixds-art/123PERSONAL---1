import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export default function PublicRegistration() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in text-center">
      <div className="mb-6 bg-primary/10 p-4 rounded-full">
        <UserPlus className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-extrabold mb-4">Registro Público</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Página pública de registro de alunos.
      </p>
      <Button asChild size="lg">
        <Link to="/login">Voltar para Login</Link>
      </Button>
    </div>
  )
}
