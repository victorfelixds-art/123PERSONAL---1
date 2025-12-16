import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function Configuracoes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Ajuste as preferências do aplicativo.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Configurações em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
