export type UserRole = 'ADMIN' | 'PERSONAL' | 'STUDENT'
export type UserStatus = 'ATIVO' | 'INATIVO' | 'PENDENTE'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  created_at: string
  avatar_url?: string | null
  phone?: string | null
  updated_at?: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_name: string
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELED'
  start_date: string
  end_date: string
  created_at: string
}
