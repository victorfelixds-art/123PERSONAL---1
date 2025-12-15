import { useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, MessageCircle, Star } from 'lucide-react'

const PublicReferral = () => {
  const { profile, incrementReferralViews, incrementReferralConversions } =
    useAppStore()

  useEffect(() => {
    incrementReferralViews()
  }, []) // Run once on mount

  const handleWhatsAppClick = () => {
    incrementReferralConversions()
    const message = `Olá ${profile.name}, vim através do seu link de indicação e gostaria de saber mais sobre a consultoria.`
    const encodedMessage = encodeURIComponent(message)
    const phone = profile.phone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <div className="bg-primary h-32 relative rounded-t-lg">
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>PT</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardHeader className="pt-20 text-center pb-2">
          <CardTitle className="text-3xl font-bold">{profile.name}</CardTitle>
          <CardDescription className="text-lg font-medium text-primary">
            {profile.specialization}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center pt-4">
          <p className="text-muted-foreground leading-relaxed">
            "{profile.bio}"
          </p>

          <div className="space-y-3 text-left bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold text-center mb-2">
              Por que treinar comigo?
            </h3>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 shrink-0" />
              <span className="text-sm">
                Treinos 100% personalizados para seu objetivo
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 shrink-0" />
              <span className="text-sm">Acompanhamento contínuo e suporte</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 shrink-0" />
              <span className="text-sm">Resultados reais e foco na saúde</span>
            </div>
          </div>

          <div className="flex justify-center gap-1 text-yellow-500">
            <Star className="fill-current w-5 h-5" />
            <Star className="fill-current w-5 h-5" />
            <Star className="fill-current w-5 h-5" />
            <Star className="fill-current w-5 h-5" />
            <Star className="fill-current w-5 h-5" />
          </div>
        </CardContent>
        <CardFooter className="pb-8">
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-lg h-14 shadow-lg animate-pulse hover:animate-none transition-all"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="mr-2 h-6 w-6" /> Falar no WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PublicReferral
