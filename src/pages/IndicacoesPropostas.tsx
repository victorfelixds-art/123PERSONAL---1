import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function IndicacoesPropostas() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Indicações e Propostas"
        description="Gerencie suas propostas comerciais e links de indicação."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Proposta
          </Button>
        }
      />

      <Tabs defaultValue="proposals" className="w-full">
        <TabsList>
          <TabsTrigger value="proposals">Propostas</TabsTrigger>
          <TabsTrigger value="referrals">Indicações</TabsTrigger>
        </TabsList>
        <TabsContent value="proposals" className="mt-4 animate-fade-in-up">
          <Card className="py-12 flex flex-col items-center justify-center text-center border-dashed">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Nenhuma Proposta Criada</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Crie propostas personalizadas para enviar aos seus potenciais
              alunos.
            </p>
            <Button>Criar Nova Proposta</Button>
          </Card>
        </TabsContent>
        <TabsContent value="referrals" className="mt-4 animate-fade-in-up">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum link de indicação ativo.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
