import { Database } from './supabase/types'

export type UserRole = Database['public']['Enums']['user_role']
export type UserStatus = Database['public']['Enums']['user_status']

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  created_at: string
}

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED'

export interface Subscription {
  id: string
  user_id: string
  plan_name: string
  start_date: string
  end_date: string
  status: SubscriptionStatus
  created_at: string
  updated_at: string
}
