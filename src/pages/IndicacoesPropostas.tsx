import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function IndicacoesPropostas() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Propostas e Indicações"
        description="Gerencie seus leads e propostas enviadas."
      />
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
          <FileText className="h-8 w-8 opacity-50" />
          <p>Lista de propostas será exibida aqui</p>
        </CardContent>
      </Card>
    </div>
  )
}
