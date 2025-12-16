import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  description?: string
  backButton?: boolean
  action?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  backButton,
  action,
}: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 animate-fade-in">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {backButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="-ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
