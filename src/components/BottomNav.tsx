import { Link, useLocation } from 'react-router-dom'
import { Calendar, Users, Dumbbell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const location = useLocation()

  const items = [
    { href: '/agenda', icon: Calendar, label: 'Agenda' },
    { href: '/alunos', icon: Users, label: 'Alunos' },
    { href: '/treinos', icon: Dumbbell, label: 'Treinos' },
    { href: '/perfil', icon: User, label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-2 md:hidden">
      <div className="flex justify-around">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
