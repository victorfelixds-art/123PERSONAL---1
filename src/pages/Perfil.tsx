import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function Perfil() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais e profissionais."
      />
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.email}</h2>
              <p className="text-muted-foreground">Personal Trainer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
