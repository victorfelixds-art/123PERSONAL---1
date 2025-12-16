import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Users,
  LayoutDashboard,
  Calendar,
  Dumbbell,
  Utensils,
  CreditCard,
  Settings,
  UserCircle,
  LogOut,
  UserPlus,
  FileText,
  ShieldCheck,
  Home,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'

export function Sidebar() {
  const location = useLocation()
  const { signOut } = useAuth()
  const { userProfile } = useAppStore()
  const pathname = location.pathname

  const isAdmin = userProfile?.role === 'ADMIN'

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Personais', href: '/admin/personals', icon: Users },
    { name: 'Pendentes', href: '/admin/pending', icon: UserPlus },
    { name: 'Planos', href: '/admin/plans', icon: FileText },
  ]

  const personalLinks = [
    { name: 'Alunos', href: '/students', icon: Users },
    { name: 'Treinos', href: '/workouts', icon: Dumbbell },
    { name: 'Dieta', href: '/diet', icon: Utensils },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Financeiro', href: '/finance', icon: CreditCard },
    { name: 'Indicações', href: '/referrals', icon: ShieldCheck },
  ]

  const commonLinks = [
    { name: 'Configurações', href: '/settings', icon: Settings },
    { name: 'Perfil', href: '/profile', icon: UserCircle },
  ]

  const links = isAdmin ? adminLinks : personalLinks

  return (
    <SidebarPrimitive>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">M</span>
          </div>
          <span className="font-bold text-lg">Meu Personal</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild isActive={pathname === link.href}>
                    <Link to={link.href}>
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
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
              {commonLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild isActive={pathname === link.href}>
                    <Link to={link.href}>
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2 px-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {userProfile?.name || 'Usuário'}
            </span>
            <span className="text-xs text-muted-foreground">
              {userProfile?.role || '...'}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
