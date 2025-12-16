import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Share2 } from 'lucide-react'

export default function IndicacoesPropostas() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Share2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Indicações e Propostas
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e propostas comerciais.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Nenhuma proposta ativa.</p>
        </CardContent>
      </Card>
    </div>
  )
}
