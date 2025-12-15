import {
  Client,
  Workout,
  Diet,
  CalendarEvent,
  Transaction,
  LinkItem,
  UserProfile,
  AppSettings,
  Plan,
  Proposal,
} from '@/lib/types'
import { addDays, addMonths, subMonths, format } from 'date-fns'

export const mockPlans: Plan[] = [
  { id: '1', name: 'Mensal', value: 200, durationInMonths: 1 },
  { id: '2', name: 'Trimestral', value: 550, durationInMonths: 3 },
  { id: '3', name: 'Semestral', value: 1000, durationInMonths: 6 },
  { id: '4', name: 'Anual', value: 1800, durationInMonths: 12 },
]

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '5511999991234',
    status: 'active',
    since: '2024-01-15',
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
    planId: '1',
    planName: 'Mensal',
    planValue: 200,
    planStartDate: '2024-03-01',
    linkId: 'joao-silva-123',
    weight: 80,
    height: 1.8,
    objective: 'Hipertrofia',
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria@example.com',
    phone: '5511988885678',
    status: 'active',
    since: '2024-02-01',
    avatar: 'https://img.usecurling.com/ppl/medium?gender=female&seed=2',
    planId: '2',
    planName: 'Trimestral',
    planValue: 550,
    planStartDate: '2024-02-01',
    linkId: 'maria-souza-456',
    weight: 60,
    height: 1.65,
    objective: 'Emagrecimento',
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro@example.com',
    phone: '5511977779012',
    status: 'inactive',
    since: '2023-11-20',
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=3',
    planName: 'Mensal',
    planValue: 200,
    linkId: 'pedro-santos-789',
  },
]

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Hipertrofia A',
    objective: 'Ganho de Massa Muscular',
    level: 'Intermediário',
    observations: 'Focar na fase excêntrica do movimento.',
    clientId: '1',
    clientName: 'João Silva',
    createdAt: '2024-03-10',
    exercises: [
      {
        name: 'Supino Reto',
        sets: 4,
        reps: '8-10',
        weight: '60kg',
        rest: '90s',
      },
      {
        name: 'Crucifixo',
        sets: 3,
        reps: '12',
        weight: '14kg',
        rest: '60s',
      },
      {
        name: 'Tríceps Corda',
        sets: 3,
        reps: '12-15',
        weight: '20kg',
        rest: '45s',
      },
    ],
    isLifetime: true,
  },
  {
    id: '2',
    title: 'Cardio + Abs',
    objective: 'Queima de Gordura e Resistência',
    level: 'Iniciante',
    observations: 'Manter hidratação constante.',
    clientId: '2',
    clientName: 'Maria Souza',
    createdAt: '2024-03-12',
    exercises: [
      {
        name: 'Esteira',
        sets: 1,
        reps: '30 min',
        notes: 'Intensidade moderada',
      },
      {
        name: 'Abdominal Supra',
        sets: 4,
        reps: '20',
        rest: '30s',
      },
    ],
    isLifetime: false,
    expirationDate: '2024-04-12',
    startDate: '2024-03-12',
  },
  {
    id: '3',
    title: 'Treino de Pernas (Modelo)',
    objective: 'Força e Hipertrofia',
    level: 'Avançado',
    observations: 'Treino base para alunos avançados.',
    createdAt: '2024-03-01',
    exercises: [
      {
        name: 'Agachamento Livre',
        sets: 5,
        reps: '5-8',
        rest: '120s',
      },
      {
        name: 'Leg Press 45',
        sets: 4,
        reps: '10-12',
        rest: '90s',
      },
    ],
    isLifetime: true,
  },
]

export const mockDiets: Diet[] = [
  {
    id: '1',
    title: 'Perda de Peso',
    objective: 'Emagrecimento',
    type: 'Low Carb',
    observations: 'Beber 3L de água por dia.',
    clientId: '2',
    clientName: 'Maria Souza',
    calories: 1500,
    createdAt: '2024-03-10',
    meals: [
      {
        id: 'm1',
        name: 'Café da Manhã',
        items: [
          {
            id: 'i1',
            name: 'Ovos',
            quantity: '2',
            unit: 'unid',
            notes: 'Mexidos',
          },
          {
            id: 'i2',
            name: 'Café preto',
            quantity: '1',
            unit: 'xícara',
            notes: 'Sem açúcar',
          },
        ],
      },
      {
        id: 'm2',
        name: 'Almoço',
        items: [
          {
            id: 'i3',
            name: 'Frango grelhado',
            quantity: '150',
            unit: 'g',
          },
          {
            id: 'i4',
            name: 'Salada Verde',
            quantity: '1',
            unit: 'prato',
            notes: 'À vontade',
          },
        ],
      },
    ],
    isLifetime: false,
    expirationDate: '2024-05-01',
  },
]

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Treino com João',
    date: new Date(),
    type: 'workout',
    description: 'Treino de Peito',
    studentId: '1',
    completed: false,
  },
  {
    id: '2',
    title: 'Avaliação Física Maria',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'meeting',
    description: 'Reavaliação mensal',
    studentId: '2',
    completed: false,
  },
]

const today = new Date()

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Mensalidade Mensal',
    amount: 200,
    type: 'income',
    category: 'Mensalidade',
    studentId: '1',
    studentName: 'João Silva',
    planId: '1',
    planName: 'Mensal',
    status: 'paid',
    dueDate: format(subMonths(today, 1), 'yyyy-MM-dd'),
    paidAt: format(subMonths(today, 1), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    description: 'Mensalidade Trimestral (1/3)',
    amount: 183.33,
    type: 'income',
    category: 'Mensalidade',
    studentId: '2',
    studentName: 'Maria Souza',
    planId: '2',
    planName: 'Trimestral',
    status: 'paid',
    dueDate: format(subMonths(today, 1), 'yyyy-MM-dd'),
    paidAt: format(subMonths(today, 1), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    description: 'Mensalidade Mensal',
    amount: 200,
    type: 'income',
    category: 'Mensalidade',
    studentId: '1',
    studentName: 'João Silva',
    planId: '1',
    planName: 'Mensal',
    status: 'pending',
    dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), // Due soon
  },
  {
    id: '4',
    description: 'Mensalidade Trimestral (2/3)',
    amount: 183.33,
    type: 'income',
    category: 'Mensalidade',
    studentId: '2',
    studentName: 'Maria Souza',
    planId: '2',
    planName: 'Trimestral',
    status: 'overdue',
    dueDate: format(addDays(today, -2), 'yyyy-MM-dd'), // Overdue
  },
]

export const mockLinks: LinkItem[] = [
  {
    id: '1',
    title: 'Meu Instagram',
    url: 'https://instagram.com',
    description: 'Divulgação de trabalho',
  },
]

export const mockProposals: Proposal[] = [
  {
    id: '1',
    type: 'default',
    clientName: 'Ana Clara',
    clientObjective: 'Definição e Perda de Gordura',
    description:
      'Acompanhamento online com treinos personalizados e ajuste de dieta mensal.',
    planName: 'Consultoria Trimestral',
    value: 600,
    duration: '3 meses',
    observations: 'Início imediato após confirmação.',
    createdAt: format(subMonths(today, 0), 'yyyy-MM-dd'),
    status: 'sent',
  },
  {
    id: '2',
    type: 'conversion70',
    clientName: 'Bruno Oliveira',
    clientObjective: 'Ganho de Massa e Força',
    clientAge: '28',
    clientHeight: '1.82',
    clientWeight: '75',
    clientTargetWeight: '85',
    deliveryType: 'hybrid',
    discountedValue: 1200,
    planName: 'Projeto Viking',
    value: 997,
    duration: '6 meses',
    description: '',
    services: [
      {
        id: '1',
        title: 'AVALIAÇÃO',
        description: 'Bioimpedância e dobras',
      },
      {
        id: '2',
        title: 'TREINOS',
        description: 'Periodização completa',
      },
    ],
    createdAt: format(subMonths(today, 0), 'yyyy-MM-dd'),
    status: 'sent',
  },
]

export const mockProfile: UserProfile = {
  name: 'Carlos Personal',
  specialization: 'Musculação e Funcional',
  email: 'carlos@meupersonal.com',
  phone: '5511912345678',
  bio: 'Transformando vidas através do movimento há 5 anos.',
  avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=99',
}

export const mockSettings: AppSettings = {
  theme: 'light',
  themeColor: 'blue',
  notifications: {
    workouts: true,
    payments: true,
    messages: false,
  },
  whatsappMessageTemplate:
    'Olá {studentName}! Aqui é o {personalName}. Segue o link do seu treino: {link}',
}
