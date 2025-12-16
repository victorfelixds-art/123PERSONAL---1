import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PublicStudent() {
  const { linkId } = useParams()

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Acesso do Aluno</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Acessando link público:{' '}
            <span className="font-bold text-foreground">{linkId}</span>
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              Esta é a página pública onde seu aluno poderá ver treinos e dietas
              compartilhados.
            </p>
          </div>
          <Button className="w-full">Entrar</Button>
        </CardContent>
      </Card>
    </div>
  )
}
