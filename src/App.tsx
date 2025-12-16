import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { AppProvider } from '@/stores/useAppStore'
import { Toaster } from '@/components/ui/sonner'

import Login from '@/pages/Login'
import Register from '@/pages/Register'
import AccountInactive from '@/pages/AccountInactive'
import AccountPending from '@/pages/AccountPending'
import PublicReferral from '@/pages/PublicReferral'
import PublicRegistration from '@/pages/PublicRegistration'
import PublicStudent from '@/pages/PublicStudent'

import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Index from '@/pages/Index'
import Agenda from '@/pages/Agenda'
import Alunos from '@/pages/Alunos'
import AlunoDetalhes from '@/pages/AlunoDetalhes'
import Treinos from '@/pages/Treinos'
import Dieta from '@/pages/Dieta'
import Financeiro from '@/pages/Financeiro'
import IndicacoesPropostas from '@/pages/IndicacoesPropostas'
import Perfil from '@/pages/Perfil'
import Configuracoes from '@/pages/Configuracoes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/public/referral" element={<PublicReferral />} />
            <Route
              path="/public/registration"
              element={<PublicRegistration />}
            />
            <Route path="/public/student" element={<PublicStudent />} />

            <Route path="/inactive" element={<AccountInactive />} />
            <Route path="/pending" element={<AccountPending />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/alunos/:id" element={<AlunoDetalhes />} />
                <Route path="/treinos" element={<Treinos />} />
                <Route path="/dieta" element={<Dieta />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/indicacoes" element={<IndicacoesPropostas />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
