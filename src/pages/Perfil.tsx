import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Perfil() {
  const { user } = useAuth()
  const { userProfile } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Visualize e edite suas informações pessoais.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userProfile?.avatar_url || ''} />
            <AvatarFallback className="text-2xl">
              {userProfile?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{userProfile?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <div className="text-xs text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full w-fit">
              {userProfile?.role}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" defaultValue={userProfile?.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email || ''} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              defaultValue={userProfile?.phone || ''}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="flex justify-end">
            <Button>Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
