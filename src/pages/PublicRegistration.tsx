import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PublicRegistration() {
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center animate-fade-in">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Cadastro de Aluno</CardTitle>
          <CardDescription>Preencha seus dados para iniciar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" placeholder="Seu nome" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <Button className="w-full">Confirmar Cadastro</Button>
        </CardContent>
      </Card>
    </div>
  )
}
