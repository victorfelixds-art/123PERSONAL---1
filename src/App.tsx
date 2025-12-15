import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/components/Layout'
import { AppProvider } from '@/stores/useAppStore'

// Pages
import Index from '@/pages/Index'
import Alunos from '@/pages/Alunos'
import AlunoDetalhes from '@/pages/AlunoDetalhes'
import Treinos from '@/pages/Treinos'
import Dieta from '@/pages/Dieta'
import Agenda from '@/pages/Agenda'
import Financeiro from '@/pages/Financeiro'
import IndicacoesPropostas from '@/pages/IndicacoesPropostas'
import Perfil from '@/pages/Perfil'
import Configuracoes from '@/pages/Configuracoes'
import PublicStudent from '@/pages/PublicStudent'
import PublicRegistration from '@/pages/PublicRegistration'
import PublicReferral from '@/pages/PublicReferral'
import NotFound from '@/pages/NotFound'

const App = () => (
  <AppProvider>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/alunos/:id" element={<AlunoDetalhes />} />
            <Route path="/treinos" element={<Treinos />} />
            <Route path="/dieta" element={<Dieta />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route
              path="/indicacoes-propostas"
              element={<IndicacoesPropostas />}
            />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          {/* Public Routes outside Layout */}
          <Route path="/p/:linkId" element={<PublicStudent />} />
          <Route path="/register" element={<PublicRegistration />} />
          <Route path="/ref/:trainerId" element={<PublicReferral />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
