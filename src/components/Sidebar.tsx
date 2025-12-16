import {
  Calendar,
  Dumbbell,
  LayoutDashboard,
  Settings,
  User,
  Users,
  Utensils,
  DollarSign,
  Share2,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

const items = [
  {
    title: 'Início',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Agenda',
    url: '/agenda',
    icon: Calendar,
  },
  {
    title: 'Alunos',
    url: '/alunos',
    icon: Users,
  },
  {
    title: 'Treinos',
    url: '/treinos',
    icon: Dumbbell,
  },
  {
    title: 'Dieta',
    url: '/dieta',
    icon: Utensils,
  },
  {
    title: 'Financeiro',
    url: '/financeiro',
    icon: DollarSign,
  },
  {
    title: 'Indicações & Propostas',
    url: '/indicacoes',
    icon: Share2,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { signOut, profile } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-bold tracking-tight text-primary">
          MEU PERSONAL
        </h1>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/perfil'}
                >
                  <Link to="/perfil">
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/configuracoes'}
                >
                  <Link to="/configuracoes">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          {profile && (
            <div className="text-xs text-muted-foreground truncate">
              Logado como: {profile.name}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
