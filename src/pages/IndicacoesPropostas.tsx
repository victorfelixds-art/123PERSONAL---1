import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IndicacoesPropostas() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Indicações e Propostas
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus leads e propostas comerciais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Propostas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em construção...</p>
        </CardContent>
      </Card>
    </div>
  )
}
