import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Calendar, Dumbbell, Home, Users } from 'lucide-react'

export function BottomNav() {
  const location = useLocation()

  const items = [
    { title: 'Início', url: '/', icon: Home },
    { title: 'Agenda', url: '/agenda', icon: Calendar },
    { title: 'Alunos', url: '/alunos', icon: Users },
    { title: 'Treinos', url: '/treinos', icon: Dumbbell },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-2 md:hidden">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const isActive = location.pathname === item.url
          return (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
