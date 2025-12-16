import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Ajustes do aplicativo e preferências."
      />
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
          <Settings className="h-8 w-8 opacity-50" />
          <p>Configurações serão exibidas aqui</p>
        </CardContent>
      </Card>
    </div>
  )
}
