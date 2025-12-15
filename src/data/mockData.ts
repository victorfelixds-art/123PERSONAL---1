import {
  Client,
  Workout,
  Diet,
  CalendarEvent,
  Transaction,
  LinkItem,
  UserProfile,
  AppSettings,
} from '@/lib/types'

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-1234',
    status: 'active',
    since: '2024-01-15',
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
    planType: 'mensal',
    planValue: 200,
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria@example.com',
    phone: '(11) 98888-5678',
    status: 'active',
    since: '2024-02-01',
    avatar: 'https://img.usecurling.com/ppl/medium?gender=female&seed=2',
    planType: 'trimestral',
    planValue: 550,
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro@example.com',
    phone: '(11) 97777-9012',
    status: 'inactive',
    since: '2023-11-20',
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=3',
    planType: 'mensal',
    planValue: 200,
  },
]

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Hipertrofia A',
    clientId: '1',
    clientName: 'João Silva',
    createdAt: '2024-03-10',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: '8-10' },
      { name: 'Crucifixo', sets: 3, reps: '12' },
      { name: 'Tríceps Corda', sets: 3, reps: '12-15' },
    ],
    isLifetime: true,
  },
  {
    id: '2',
    title: 'Cardio + Abs',
    clientId: '2',
    clientName: 'Maria Souza',
    createdAt: '2024-03-12',
    exercises: [
      { name: 'Esteira', sets: 1, reps: '30 min' },
      { name: 'Abdominal Supra', sets: 4, reps: '20' },
    ],
    isLifetime: false,
    expirationDate: '2024-04-12',
  },
]

export const mockDiets: Diet[] = [
  {
    id: '1',
    title: 'Perda de Peso',
    clientId: '2',
    clientName: 'Maria Souza',
    calories: 1500,
    meals: [
      { name: 'Café da Manhã', items: ['Ovos mexidos', 'Fruta', 'Café preto'] },
      {
        name: 'Almoço',
        items: ['Frango grelhado', 'Salada', 'Arroz integral'],
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
  },
  {
    id: '2',
    title: 'Avaliação Física Maria',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'meeting',
    description: 'Reavaliação mensal',
    studentId: '2',
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Mensalidade João',
    amount: 200,
    type: 'income',
    date: '2024-03-05',
    category: 'Mensalidade',
  },
  {
    id: '2',
    description: 'Mensalidade Maria',
    amount: 200,
    type: 'income',
    date: '2024-03-06',
    category: 'Mensalidade',
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

export const mockProfile: UserProfile = {
  name: 'Carlos Personal',
  specialization: 'Musculação e Funcional',
  email: 'carlos@meupersonal.com',
  phone: '(11) 91234-5678',
  bio: 'Transformando vidas através do movimento há 5 anos.',
  avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=99',
}

export const mockSettings: AppSettings = {
  theme: 'light',
  notifications: {
    workouts: true,
    payments: true,
    messages: false,
  },
}
