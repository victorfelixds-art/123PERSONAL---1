import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function PublicReferral() {
  const { trainerId } = useParams()

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center animate-fade-in">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Convite Especial</CardTitle>
          <CardDescription>
            Você foi indicado por um Personal Trainer parceiro (ID: {trainerId})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Cadastre-se agora e ganhe benefícios exclusivos no seu
            acompanhamento.
          </p>
          <Button className="w-full font-bold">Aceitar Convite</Button>
        </CardContent>
      </Card>
    </div>
  )
}
