export interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  since: string
  avatar?: string
}

export interface Workout {
  id: string
  title: string
  clientId?: string
  clientName?: string // simplified for mock
  exercises: { name: string; sets: number; reps: string }[]
  createdAt: string
}

export interface Diet {
  id: string
  title: string
  clientId?: string
  clientName?: string
  calories: number
  meals: { name: string; items: string[] }[]
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'workout' | 'meeting' | 'other'
  description?: string
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
}
