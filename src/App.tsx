import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/components/Layout'
import { AppProvider } from '@/stores/useAppStore'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'

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

// Auth Pages
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import AccountPending from '@/pages/AccountPending'
import AccountInactive from '@/pages/AccountInactive'

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account/pending" element={<AccountPending />} />
            <Route path="/account/inactive" element={<AccountInactive />} />

            {/* Public External Routes (No auth needed, or specific checks) */}
            <Route path="/p/:linkId" element={<PublicStudent />} />
            <Route path="/register-student" element={<PublicRegistration />} />
            <Route path="/ref/:trainerId" element={<PublicReferral />} />

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
