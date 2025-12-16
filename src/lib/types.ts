export interface Plan {
  id: string
  name: string
  value: number
  durationInMonths: number
}

export interface WeightEntry {
  id: string
  date: string
  weight: number
  observations?: string
}

export interface PlanHistoryItem {
  id: string
  name: string
  value: number
  startDate: string
  endDate: string
  paymentStatus: 'paid' | 'pending' | 'refunded'
  status?: 'active' | 'completed' | 'cancelled' | 'expired' | 'renewed'
  type?: 'fixed' | 'individual'
}

export interface CustomField {
  id: string
  label: string
  value: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  profileStatus: 'complete' | 'incomplete'
  since: string

  // Plan Data
  planId?: string
  planName?: string
  planValue?: number
  planStartDate?: string
  planEndDate?: string
  planDuration?: number // in months
  planType?: 'fixed' | 'individual'
  planHistory?: PlanHistoryItem[]

  weight?: number // Current weight
  initialWeight?: number
  targetWeight?: number // Meta de peso
  height?: number
  objective?: string
  linkId?: string
  linkActive: boolean
  weightHistory?: WeightEntry[]

  // Custom/Dynamic Fields
  customFields?: CustomField[]
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
  date: Date | string
  type: 'workout' | 'meeting' | 'other'
  description?: string
  studentId?: string
  completed: boolean
  isRecurring?: boolean
  frequency?: number // days
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
  planType?: 'fixed' | 'individual'
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
  // Header Info
  customHeaderTitle?: string

  // Technical Sheet
  clientName: string
  clientObjective: string
  clientAge?: string
  clientHeight?: string
  clientWeight?: string
  clientTargetWeight?: string
  deliveryType?: DeliveryType

  // Content
  introText?: string
  deadline?: string // Prazo
  summary?: string // Optional Summary

  // Investment
  planName: string
  value: number // Final Price
  discountedValue?: number // Original/List Price
  duration: string
  validityDate?: string

  // Details
  description: string // Keeping for compatibility, usually mapped to intro or specific block
  observations?: string
  services?: ProposalService[]

  // System
  createdAt: string
  status: 'sent' | 'accepted' | 'rejected'
}

export type UserRole = 'ADMIN' | 'PERSONAL'
export type UserStatus = 'PENDENTE' | 'ATIVO' | 'INATIVO'

export interface UserProfile {
  id: string
  name: string
  specialization: string
  email: string
  phone: string
  bio: string
  avatar: string
  role?: UserRole
  status?: UserStatus
}

export type AppTheme =
  | 'dark-performance'
  | 'light-performance'
  | 'performance-blue'
  | 'white'

export interface AppSettings {
  theme: AppTheme
  notifications: {
    workouts: boolean
    payments: boolean
    messages: boolean
  }
  whatsappMessageTemplate: string
}
