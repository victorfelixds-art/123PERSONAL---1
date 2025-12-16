import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Send } from 'lucide-react'

export default function IndicacoesPropostas() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Indicações e Propostas
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas propostas comerciais e programa de indicações.
          </p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Link de Indicação</CardTitle>
            <CardDescription>
              Compartilhe seu link exclusivo e ganhe benefícios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-3 text-sm font-mono">
              https://meupersonal.app/r/seu-codigo
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
