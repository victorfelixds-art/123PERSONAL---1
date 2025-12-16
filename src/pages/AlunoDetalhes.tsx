import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AlunoDetalhes() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalhes do Aluno"
        description={`Visualizando informações do aluno ID: ${id}`}
        backButton
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="workouts">Treinos</TabsTrigger>
          <TabsTrigger value="diet">Dieta</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Informações detalhadas serão exibidas aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workouts" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                Nenhum treino atribuído.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diet" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                Nenhuma dieta atribuída.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                Histórico vazio.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
