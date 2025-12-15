import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Utensils,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Alunos', path: '/alunos', icon: Users },
  { name: 'Treinos', path: '/treinos', icon: Dumbbell },
  { name: 'Dieta', path: '/dieta', icon: Utensils },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
  { name: 'Financeiro', path: '/financeiro', icon: DollarSign },
  { name: 'Links', path: '/links', icon: LinkIcon },
  { name: 'Perfil', path: '/perfil', icon: User },
  { name: 'Configurações', path: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-30">
      <div className="p-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Meu Personal
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center px-4 py-2 text-sm text-muted-foreground">
          <span className="text-xs">v0.0.1 © 2024</span>
        </div>
      </div>
    </div>
  )
}
