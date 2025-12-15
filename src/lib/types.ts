export interface Plan {
  id: string
  name: string
  value: number
  durationInMonths: number
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  since: string
  avatar?: string
  planId?: string
  planName: string
  planValue: number
  planStartDate?: string
  weight?: number
  height?: number
  objective?: string
  linkId: string
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  weight?: string
  rest?: string
  notes?: string
}

export interface Workout {
  id: string
  title: string
  objective?: string
  level?: 'Iniciante' | 'Intermediário' | 'Avançado'
  observations?: string
  clientId?: string
  clientName?: string
  exercises: Exercise[]
  createdAt: string
  startDate?: string | null
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
  themeColor: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  notifications: {
    workouts: boolean
    payments: boolean
    messages: boolean
  }
  whatsappMessageTemplate: string
}
