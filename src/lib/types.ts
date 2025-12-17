export type UserRole = 'ADMIN' | 'PERSONAL' | 'STUDENT'
export type UserStatus = 'ATIVO' | 'INATIVO' | 'PENDENTE'
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED'

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
  // Client specific fields
  personal_id?: string | null
  height?: number | null
  weight?: number | null
  initial_weight?: number | null
  target_weight?: number | null
  objective?: string | null
}

export interface Subscription {
  id: string
  user_id: string
  plan_name: string
  status: SubscriptionStatus
  start_date: string
  end_date: string
  created_at: string
}

export type Client = UserProfile
