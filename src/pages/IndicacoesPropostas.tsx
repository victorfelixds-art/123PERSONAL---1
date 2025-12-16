import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Plus,
  Copy,
  Share2,
  FileText,
  Eye,
  MessageCircle,
  Download,
  Trash2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProposalForm } from '@/components/forms/ProposalForm'
import { Proposal } from '@/lib/types'
import { generateProposalPDF } from '@/lib/pdfGenerator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const IndicacoesPropostas = () => {
  const {
    proposals,
    addProposal,
    removeProposal,
    updateProposal,
    profile,
    settings,
    referralViews,
    referralConversions,
  } = useAppStore()
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)

  // Link Generation Logic
  const baseUrl = window.location.origin
  const trainerId = profile.id || 'trainer-123'

  const referralLink = `${baseUrl}/ref/${trainerId}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copiado para a área de transferência!')
  }

  const shareViaWhatsApp = (link: string, message: string) => {
    const encodedMessage = encodeURIComponent(`${message} ${link}`)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const handleCreateProposal = (
    data: Omit<Proposal, 'id' | 'createdAt' | 'status'>,
  ) => {
    addProposal({
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'sent',
    })
    setIsProposalDialogOpen(false)
    toast.success('Proposta criada com sucesso!')
  }

  const handleExportPDF = (proposal: Proposal) => {
    generateProposalPDF(proposal, profile, settings.theme)
    toast.success('PDF da proposta gerado!')
  }

  const handleShareProposal = (proposal: Proposal) => {
    const message = `Olá ${proposal.clientName}, aqui está sua proposta de consultoria: [Link da Proposta]`
    shareViaWhatsApp('', message)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in max-w-7xl">
      <h1 className="text-4xl font-extrabold tracking-tight uppercase border-b pb-6">
        Indicações & Propostas
      </h1>

      <Tabs defaultValue="indicacoes" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="indicacoes" className="font-bold">
            Indicações
          </TabsTrigger>
          <TabsTrigger value="propostas" className="font-bold">
            Propostas
          </TabsTrigger>
        </TabsList>

        {/* INDICAÇÕES TAB */}
        <TabsContent value="indicacoes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Referral Link Card */}
            <Card className="col-span-2 md:col-span-1 border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 uppercase">
                  <Share2 className="h-5 w-5 text-primary" />
                  Link de Indicação
                </CardTitle>
                <CardDescription>
                  Compartilhe seu trabalho e receba novos alunos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-secondary rounded-lg border border-border text-sm break-all font-mono">
                  {referralLink}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl text-center border border-border">
                    <div className="text-3xl font-extrabold text-foreground flex items-center justify-center gap-2">
                      <Eye className="h-6 w-6 text-muted-foreground" />{' '}
                      {referralViews}
                    </div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">
                      Visualizações
                    </p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-xl text-center border border-primary/20">
                    <div className="text-3xl font-extrabold text-primary flex items-center justify-center gap-2">
                      <MessageCircle className="h-6 w-6" />{' '}
                      {referralConversions}
                    </div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">
                      Cliques
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 font-bold"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copiar
                  </Button>
                  <Button
                    className="flex-1 font-bold bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                    onClick={() =>
                      shareViaWhatsApp(
                        referralLink,
                        'Conheça meu trabalho como Personal Trainer:',
                      )
                    }
                  >
                    <Share2 className="mr-2 h-4 w-4" /> WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PROPOSTAS TAB */}
        <TabsContent value="propostas" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold uppercase">
                Propostas Comerciais
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Envie propostas para fechar mais alunos.
              </p>
            </div>
            <Button size="lg" onClick={() => setIsProposalDialogOpen(true)}>
              <Plus className="mr-2 h-5 w-5" /> Nova Proposta
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proposals.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Nenhuma proposta criada.</p>
                <Button
                  variant="link"
                  onClick={() => setIsProposalDialogOpen(true)}
                  className="font-bold text-primary mt-2"
                >
                  Criar agora
                </Button>
              </div>
            ) : (
              proposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  className="flex flex-col hover:border-primary/50 transition-all border-l-4 border-l-transparent hover:border-l-primary"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold truncate pr-2">
                        {proposal.clientName}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {proposal.status === 'accepted' && (
                          <span className="text-[10px] font-bold text-white bg-green-700 px-2 py-1 rounded uppercase tracking-wide">
                            Aceita
                          </span>
                        )}
                        {proposal.status === 'rejected' && (
                          <span className="text-[10px] font-bold text-white bg-red-700 px-2 py-1 rounded uppercase tracking-wide">
                            Recusada
                          </span>
                        )}
                        {proposal.status === 'sent' && (
                          <span className="text-[10px] font-bold text-white bg-blue-700 px-2 py-1 rounded uppercase tracking-wide">
                            Enviada
                          </span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="flex items-center flex-wrap gap-2 mt-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        {new Date(proposal.createdAt).toLocaleDateString(
                          'pt-BR',
                        )}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted-foreground font-bold text-xs uppercase">
                        Plano
                      </span>
                      <span className="font-bold truncate max-w-[150px]">
                        {proposal.planName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted-foreground font-bold text-xs uppercase">
                        Valor
                      </span>
                      <span className="font-extrabold text-primary text-lg">
                        R$ {proposal.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-muted-foreground font-bold text-xs uppercase">
                        Status
                      </span>
                      <Select
                        defaultValue={proposal.status}
                        onValueChange={(val: any) =>
                          updateProposal({ ...proposal, status: val })
                        }
                      >
                        <SelectTrigger className="h-8 w-[110px] text-xs font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sent">Enviada</SelectItem>
                          <SelectItem value="accepted">Aceita</SelectItem>
                          <SelectItem value="rejected">Recusada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t bg-muted/10 grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold"
                      onClick={() => handleExportPDF(proposal)}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" /> PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-green-600 hover:text-green-500 hover:bg-green-900/20"
                      onClick={() => handleShareProposal(proposal)}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1" /> Whats
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeProposal(proposal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isProposalDialogOpen}
        onOpenChange={setIsProposalDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Proposta</DialogTitle>
          </DialogHeader>
          <ProposalForm
            onSave={handleCreateProposal}
            onCancel={() => setIsProposalDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IndicacoesPropostas
