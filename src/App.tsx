import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from '@/components/Layout'
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'
import Login from '@/pages/Login'
import Index from '@/pages/Index'
import Register from '@/pages/Register'
import ManagePersonals from '@/pages/admin/ManagePersonals'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import PendingPersonals from '@/pages/admin/PendingPersonals'
import ManagePlans from '@/pages/admin/ManagePlans'
import Alunos from '@/pages/Alunos'
import Treinos from '@/pages/Treinos'
import Dieta from '@/pages/Dieta'
import Agenda from '@/pages/Agenda'
import Financeiro from '@/pages/Financeiro'
import IndicacoesPropostas from '@/pages/IndicacoesPropostas'
import Configuracoes from '@/pages/Configuracoes'
import Perfil from '@/pages/Perfil'
import NotFound from '@/pages/NotFound'

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />

            {/* Admin Routes */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/personals" element={<ManagePersonals />} />
              <Route path="/admin/pending" element={<PendingPersonals />} />
              <Route path="/admin/plans" element={<ManagePlans />} />
            </Route>

            {/* Personal Routes */}
            <Route path="/students" element={<Alunos />} />
            <Route path="/workouts" element={<Treinos />} />
            <Route path="/diet" element={<Dieta />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/finance" element={<Financeiro />} />
            <Route path="/referrals" element={<IndicacoesPropostas />} />
            <Route path="/settings" element={<Configuracoes />} />
            <Route path="/profile" element={<Perfil />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
)

export default App
