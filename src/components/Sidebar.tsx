import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Utensils,
  Calendar,
  DollarSign,
  FileText,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Alunos', path: '/alunos', icon: Users },
  { name: 'Treinos', path: '/treinos', icon: Dumbbell },
  { name: 'Dieta', path: '/dieta', icon: Utensils },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
  { name: 'Financeiro', path: '/financeiro', icon: DollarSign },
  {
    name: 'Indicações & Propostas',
    path: '/indicacoes-propostas',
    icon: FileText,
  },
  { name: 'Perfil', path: '/perfil', icon: User },
  { name: 'Configurações', path: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-30 shadow-xl transition-colors duration-300">
      <div className="p-6 flex items-center justify-center gap-3">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 w-auto object-contain"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <h1 className="text-2xl font-bold text-sidebar-primary tracking-tight">
          123personal
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
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 transition-colors',
                  isActive
                    ? 'text-sidebar-primary-foreground'
                    : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-destructive" />
          Sair
        </button>
        <div className="flex items-center justify-between px-2 py-1 text-sm text-muted-foreground">
          <span className="text-xs font-medium">v0.0.32</span>
          <span className="text-[10px] opacity-60">© 2024</span>
        </div>
      </div>
    </div>
  )
}
