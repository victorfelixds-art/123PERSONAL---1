import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

export default function Financeiro() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Acompanhe seus rendimentos e pendências."
      />
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
          <DollarSign className="h-8 w-8 opacity-50" />
          <p>Dashboard financeiro será exibido aqui</p>
        </CardContent>
      </Card>
    </div>
  )
}
