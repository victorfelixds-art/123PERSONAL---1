import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  User,
  MoreHorizontal,
  Utensils,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const mainNavItems = [
  { name: 'Início', path: '/', icon: LayoutDashboard },
  { name: 'Alunos', path: '/alunos', icon: Users },
  { name: 'Treinos', path: '/treinos', icon: Dumbbell },
  { name: 'Perfil', path: '/perfil', icon: User },
]

const moreNavItems = [
  { name: 'Dieta', path: '/dieta', icon: Utensils },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
  { name: 'Financeiro', path: '/financeiro', icon: DollarSign },
  { name: 'Links', path: '/links', icon: LinkIcon },
  { name: 'Configurações', path: '/configuracoes', icon: Settings },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 z-50 flex items-center justify-around shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      {mainNavItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path))
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}

      <Sheet>
        <SheetTrigger asChild>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-xl">
          <SheetHeader className="mb-4">
            <SheetTitle>Menu Completo</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-4">
            {moreNavItems.map((item) => (
              <SheetClose key={item.path} asChild>
                <Link
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors',
                    location.pathname.startsWith(item.path) &&
                      'border-primary bg-primary/5',
                  )}
                >
                  <div
                    className={cn(
                      'p-3 rounded-full mb-2',
                      location.pathname.startsWith(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-center">
                    {item.name}
                  </span>
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
