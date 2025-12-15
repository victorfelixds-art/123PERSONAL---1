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
  CheckCircle2,
  XCircle,
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
import { Badge } from '@/components/ui/badge'

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
  // Mock trainer ID for now (in a real app this would be profile.id)
  const trainerId = 'trainer-123'

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
    generateProposalPDF(proposal, profile, settings.themeColor)
    toast.success('PDF da proposta gerado!')
  }

  const handleShareProposal = (proposal: Proposal) => {
    // In a real app, this would point to a public proposal view
    // For now, we simulate sharing a message
    const message = `Olá ${proposal.clientName}, aqui está sua proposta de consultoria: [Link da Proposta]`
    shareViaWhatsApp('', message)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">
        Indicações & Propostas
      </h1>

      <Tabs defaultValue="indicacoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="indicacoes">Indicações</TabsTrigger>
          <TabsTrigger value="propostas">Propostas</TabsTrigger>
        </TabsList>

        {/* INDICAÇÕES TAB */}
        <TabsContent value="indicacoes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Referral Link Card */}
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Link de Indicação
                </CardTitle>
                <CardDescription>
                  Divulgue seu trabalho! Compartilhe este link em redes sociais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-md border text-sm break-all font-mono">
                  {referralLink}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 p-3 rounded-lg text-center border border-primary/10">
                    <div className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                      <Eye className="h-5 w-5" /> {referralViews}
                    </div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Visualizações
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                    <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                      <MessageCircle className="h-5 w-5" />{' '}
                      {referralConversions}
                    </div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Cliques no WhatsApp
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copiar
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
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
              <h2 className="text-xl font-semibold">Propostas Comerciais</h2>
              <p className="text-sm text-muted-foreground">
                Crie e envie propostas profissionais para fechar mais alunos.
              </p>
            </div>
            <Button onClick={() => setIsProposalDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Criar Proposta
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {proposals.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma proposta criada ainda.</p>
                <Button
                  variant="link"
                  onClick={() => setIsProposalDialogOpen(true)}
                >
                  Criar minha primeira proposta
                </Button>
              </div>
            ) : (
              proposals.map((proposal) => (
                <Card key={proposal.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {proposal.clientName}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {proposal.status === 'accepted' && (
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Aceita
                          </span>
                        )}
                        {proposal.status === 'rejected' && (
                          <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Recusada
                          </span>
                        )}
                        {proposal.status === 'sent' && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                            Enviada
                          </span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="flex items-center flex-wrap gap-2 mt-1">
                      <span>
                        {new Date(proposal.createdAt).toLocaleDateString(
                          'pt-BR',
                        )}
                      </span>
                      {proposal.type === 'transformation' && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1"
                        >
                          Projeto (Antigo)
                        </Badge>
                      )}
                      {proposal.type === 'conversion70' && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 px-1 bg-primary/10 text-primary hover:bg-primary/20 border-none"
                        >
                          Conversão 70%
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plano:</span>
                      <span className="font-medium">{proposal.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-medium">
                        R$ {proposal.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Select
                        defaultValue={proposal.status}
                        onValueChange={(val: any) =>
                          updateProposal({ ...proposal, status: val })
                        }
                      >
                        <SelectTrigger className="h-6 w-[100px] text-xs">
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
                  <CardFooter className="pt-2 border-t grid grid-cols-3 gap-1 p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex flex-col h-auto py-2 gap-1"
                      onClick={() => handleExportPDF(proposal)}
                    >
                      <Download className="h-4 w-4" /> PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex flex-col h-auto py-2 gap-1 text-green-600 hover:text-green-700"
                      onClick={() => handleShareProposal(proposal)}
                    >
                      <Share2 className="h-4 w-4" /> Whats
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex flex-col h-auto py-2 gap-1 text-destructive hover:text-destructive"
                      onClick={() => removeProposal(proposal.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Excluir
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
            <DialogTitle>Nova Proposta Comercial</DialogTitle>
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
