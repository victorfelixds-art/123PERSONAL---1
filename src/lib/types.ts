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

export interface FoodItem {
  id: string
  name: string
  quantity: string
  unit: string
  notes?: string
}

export interface Meal {
  id: string
  name: string
  items: FoodItem[]
  time?: string
  notes?: string
}

export interface Diet {
  id: string
  title: string
  objective: string
  type: string
  observations?: string
  clientId?: string
  clientName?: string
  calories?: number
  meals: Meal[]
  createdAt: string
  startDate?: string | null
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
  completed: boolean
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  studentId?: string
  studentName?: string
  planId?: string
  planName?: string
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  dueDate: string
  paidAt?: string
}

export interface LinkItem {
  id: string
  title: string
  url: string
  description?: string
}

export interface ProposalService {
  id: string
  title: string
  description: string
}

export type ProposalType = 'default' | 'transformation' | 'conversion70'
export type DeliveryType = 'online' | 'presencial' | 'hybrid'

export interface Proposal {
  id: string
  type: ProposalType
  clientName: string
  clientObjective: string
  // Additional fields for Transformation model & Conversion70
  clientAge?: string
  clientHeight?: string
  clientWeight?: string
  clientTargetWeight?: string // "Meta de peso"

  // New fields for Conversion70
  deliveryType?: DeliveryType
  discountedValue?: number // "Valor sem desconto"

  description: string
  planName: string
  value: number
  duration: string
  observations?: string

  services?: ProposalService[]

  createdAt: string
  status: 'sent' | 'accepted' | 'rejected'
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
