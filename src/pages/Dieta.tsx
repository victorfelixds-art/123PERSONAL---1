import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dieta() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dieta</h1>
        <p className="text-muted-foreground">Elabore planos alimentares.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos Alimentares</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em construção...</p>
        </CardContent>
      </Card>
    </div>
  )
}
