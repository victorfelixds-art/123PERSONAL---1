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
