import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Utensils } from 'lucide-react'

export default function Dieta() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dietas" description="Planos alimentares e macros." />
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
          <Utensils className="h-8 w-8 opacity-50" />
          <p>Gestão de dietas será exibida aqui</p>
        </CardContent>
      </Card>
    </div>
  )
}
