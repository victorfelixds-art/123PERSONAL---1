import { PageHeader } from '@/components/PageHeader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Personalize o sistema de acordo com suas preferências."
      />

      <div className="space-y-4 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Gerencie como você deseja ser notificado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Novos Alunos</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificação quando um novo aluno se cadastrar.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Pagamentos</Label>
                <p className="text-sm text-muted-foreground">
                  Ser avisado sobre pagamentos recebidos ou atrasados.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Personalize a aparência do aplicativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Alternar entre tema claro e escuro.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
