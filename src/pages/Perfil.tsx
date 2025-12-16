import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'

export default function Perfil() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais e profissionais."
      />

      <div className="grid gap-6 md:grid-cols-12 animate-fade-in-up">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>
              Sua foto de perfil visível para os alunos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={profile?.avatar} />
              <AvatarFallback className="text-4xl">
                {profile?.name?.charAt(0).toUpperCase() || 'P'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline">Alterar Foto</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue={profile?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={profile?.email} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Especialização</Label>
              <Input
                id="specialization"
                defaultValue={profile?.specialization || 'Personal Trainer'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre sua experiência e metodologia..."
                className="min-h-[120px]"
                defaultValue={profile?.bio}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button>Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
