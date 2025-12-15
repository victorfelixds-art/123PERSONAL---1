import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

const Perfil = () => {
  const { profile, updateProfile } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(profile)

  const handleSave = () => {
    updateProfile(editForm)
    setIsEditing(false)
    toast.success('Perfil atualizado!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Avatar className="w-full h-full">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>PF</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{profile.name}</CardTitle>
          <p className="text-muted-foreground">{profile.specialization}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Telefone</Label>
              <p className="font-medium">{profile.phone}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">Bio</Label>
            <p className="text-sm leading-relaxed">{profile.bio}</p>
          </div>

          <div className="pt-4 flex justify-center">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditForm(profile)}>
                  Editar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Informações</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="spec">Especialização</Label>
                    <Input
                      value={editForm.specialization}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          specialization: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSave}>Salvar Alterações</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Perfil
