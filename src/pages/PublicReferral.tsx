import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function PublicReferral() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in text-center">
      <h1 className="text-4xl font-extrabold mb-4">Indique um Amigo</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Compartilhe seu link exclusivo e ganhe benefícios.
      </p>
      <Button asChild>
        <Link to="/login">Voltar para Login</Link>
      </Button>
    </div>
  )
}
