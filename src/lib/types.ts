export interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  since: string
  avatar?: string
  planType: 'mensal' | 'trimestral' | 'semestral' | 'anual'
  planValue: number
  weight?: number
  height?: number
  objective?: string
  linkId: string
}

export interface Workout {
  id: string
  title: string
  clientId?: string
  clientName?: string
  exercises: { name: string; sets: number; reps: string }[]
  createdAt: string
  expirationDate?: string | null
  isLifetime: boolean
}

export interface Diet {
  id: string
  title: string
  clientId?: string
  clientName?: string
  calories: number
  meals: { name: string; items: string[] }[]
  expirationDate?: string | null
  isLifetime: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'workout' | 'meeting' | 'other'
  description?: string
  studentId?: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
}

export interface LinkItem {
  id: string
  title: string
  url: string
  description?: string
}

export interface UserProfile {
  name: string
  specialization: string
  email: string
  phone: string
  bio: string
  avatar: string
}

export interface AppSettings {
  theme: 'light' | 'dark'
  notifications: {
    workouts: boolean
    payments: boolean
    messages: boolean
  }
  whatsappMessageTemplate: string
}
