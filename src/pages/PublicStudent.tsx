import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function PublicStudent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in text-center">
      <h1 className="text-4xl font-extrabold mb-4">Área do Aluno</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Acesso público para alunos visualizarem treinos (se configurado).
      </p>
      <Button asChild>
        <Link to="/login">Voltar para Login</Link>
      </Button>
    </div>
  )
}
