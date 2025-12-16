import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Configuracoes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Ajuste as preferências do aplicativo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em construção...</p>
        </CardContent>
      </Card>
    </div>
  )
}
