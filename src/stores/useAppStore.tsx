import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
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
  WeightEntry,
  PlanHistoryItem,
  AppTheme,
} from '@/lib/types'
import {
  mockClients,
  mockWorkouts,
  mockDiets,
  mockEvents,
  mockTransactions,
  mockLinks,
  mockProfile,
  mockSettings,
  mockPlans,
  mockProposals,
} from '@/data/mockData'
import {
  addMonths,
  format,
  parseISO,
  addDays,
  isBefore,
  isAfter,
} from 'date-fns'

interface AppContextType {
  clients: Client[]
  workouts: Workout[]
  diets: Diet[]
  events: CalendarEvent[]
  transactions: Transaction[]
  links: LinkItem[]
  profile: UserProfile
  settings: AppSettings
  plans: Plan[]
  proposals: Proposal[]
  referralViews: number
  referralConversions: number
  addClient: (client: Client) => void
  updateClient: (client: Client) => void
  removeClient: (id: string) => void
  assignPlan: (
    clientId: string,
    planData: {
      id?: string
      name: string
      value: number
      durationInMonths: number
      startDate: string
      type: 'fixed' | 'individual'
    },
  ) => void
  renewPlan: (
    clientId: string,
    keepConditions: boolean,
    newConditions?: {
      value: number
      durationInMonths: number
    },
  ) => void
  concludePlan: (clientId: string) => void
  cancelPlan: (clientId: string) => void
  generateStudentLink: (clientId: string) => void
  regenerateStudentLink: (clientId: string) => void
  deactivateStudentLink: (clientId: string) => void
  addWeightEntry: (
    clientId: string,
    weight: number,
    date: string,
    observations?: string,
  ) => void
  addWorkout: (workout: Workout) => void
  updateWorkout: (workout: Workout) => void
  duplicateWorkout: (id: string) => void
  removeWorkout: (id: string) => void
  assignWorkout: (
    workoutId: string,
    studentIds: string[],
    startDate: string,
    expirationDate: string | null,
    isLifetime: boolean,
  ) => void
  addDiet: (diet: Diet) => void
  updateDiet: (diet: Diet) => void
  duplicateDiet: (id: string) => void
  removeDiet: (id: string) => void
  assignDiet: (
    dietId: string,
    studentIds: string[],
    startDate: string,
    expirationDate: string | null,
    isLifetime: boolean,
  ) => void
  addEvent: (event: CalendarEvent) => void
  updateEvent: (event: CalendarEvent) => void
  removeEvent: (id: string) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transaction: Transaction) => void
  markTransactionAsPaid: (id: string) => void
  addLink: (link: LinkItem) => void
  removeLink: (id: string) => void
  updateProfile: (profile: UserProfile) => void
  updateSettings: (settings: AppSettings) => void
  updateTheme: (theme: AppTheme) => void
  addPlan: (plan: Plan) => void
  updatePlan: (plan: Plan) => void
  removePlan: (id: string) => void
  addProposal: (proposal: Proposal) => void
  updateProposal: (proposal: Proposal) => void
  removeProposal: (id: string) => void
  incrementReferralViews: () => void
  incrementReferralConversions: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Custom hook for persisted state
function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, state])

  return [state, setState] as const
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = usePersistedState<Client[]>(
    'mp-clients',
    mockClients,
  )
  const [workouts, setWorkouts] = usePersistedState<Workout[]>(
    'mp-workouts',
    mockWorkouts,
  )
  const [diets, setDiets] = usePersistedState<Diet[]>('mp-diets', mockDiets)
  const [events, setEvents] = usePersistedState<CalendarEvent[]>(
    'mp-events',
    mockEvents,
  )
  const [transactions, setTransactions] = usePersistedState<Transaction[]>(
    'mp-transactions',
    mockTransactions,
  )
  const [links, setLinks] = usePersistedState<LinkItem[]>('mp-links', mockLinks)
  const [profile, setProfile] = usePersistedState<UserProfile>(
    'mp-profile',
    mockProfile,
  )
  const [settings, setSettings] = usePersistedState<AppSettings>(
    'mp-settings',
    mockSettings,
  )
  const [plans, setPlans] = usePersistedState<Plan[]>('mp-plans', mockPlans)
  const [proposals, setProposals] = usePersistedState<Proposal[]>(
    'mp-proposals',
    mockProposals,
  )
  const [referralViews, setReferralViews] = usePersistedState<number>(
    'mp-ref-views',
    15,
  )
  const [referralConversions, setReferralConversions] =
    usePersistedState<number>('mp-ref-conv', 3)

  // Status Check Effect
  useEffect(() => {
    const today = new Date()
    setClients((prev) =>
      prev.map((client) => {
        if (!client.planEndDate || client.status === 'inactive') return client

        const endDate = parseISO(client.planEndDate)
        if (isBefore(endDate, today)) {
          return { ...client, status: 'inactive' }
        } else if (client.status === 'inactive' && isAfter(endDate, today)) {
          return { ...client, status: 'active' }
        }
        return client
      }),
    )
  }, [setClients])

  // Apply Theme Effect
  useEffect(() => {
    const root = document.documentElement
    const theme = settings.theme

    root.classList.remove(
      'dark',
      'theme-dark-performance',
      'theme-light-performance',
      'theme-performance-blue',
      'theme-white',
    )
    root.classList.add(`theme-${theme}`)
    if (theme !== 'white' && theme !== 'light-performance') {
      root.classList.add('dark')
    }
  }, [settings.theme])

  const assignPlan = (
    clientId: string,
    planData: {
      id?: string
      name: string
      value: number
      durationInMonths: number
      startDate: string
      type: 'fixed' | 'individual'
    },
  ) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return

    const startDate = parseISO(planData.startDate)
    const endDate = addMonths(startDate, planData.durationInMonths)
    const endDateStr = format(endDate, 'yyyy-MM-dd')

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: `Plano ${planData.name} - ${client.name}`,
      amount: planData.value,
      type: 'income',
      category: 'Planos',
      studentId: client.id,
      studentName: client.name,
      planId: planData.id,
      planName: planData.name,
      planType: planData.type,
      status: 'pending',
      dueDate: planData.startDate,
      paidAt: undefined,
    }

    setTransactions((prev) => [...prev, newTransaction])

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const history: PlanHistoryItem[] = c.planHistory
            ? [...c.planHistory]
            : []
          // Move current active plan to history if exists
          if (c.planName && c.planStartDate && c.planEndDate) {
            history.push({
              id: Math.random().toString(36).substr(2, 9),
              name: c.planName,
              value: c.planValue || 0,
              startDate: c.planStartDate,
              endDate: c.planEndDate,
              paymentStatus: 'paid', // Assuming past plans were resolved
              status: 'renewed',
              type: c.planType,
            })
          }

          return {
            ...c,
            planId: planData.id,
            planName: planData.name,
            planValue: planData.value,
            planStartDate: planData.startDate,
            planDuration: planData.durationInMonths,
            planEndDate: endDateStr,
            planType: planData.type,
            planHistory: history,
            status: 'active',
          }
        }
        return c
      }),
    )
  }

  const renewPlan = (
    clientId: string,
    keepConditions: boolean,
    newConditions?: {
      value: number
      durationInMonths: number
    },
  ) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client || !client.planEndDate) return

    const oldEndDate = parseISO(client.planEndDate)
    const newStartDate = addDays(oldEndDate, 1)
    const newStartDateStr = format(newStartDate, 'yyyy-MM-dd')

    const duration = keepConditions
      ? client.planDuration || 1
      : newConditions?.durationInMonths || 1
    const value = keepConditions
      ? client.planValue || 0
      : newConditions?.value || 0
    const name = client.planName || 'Plano'
    const planId = client.planId
    const type = client.planType || 'fixed'

    assignPlan(clientId, {
      id: planId,
      name,
      value,
      durationInMonths: duration,
      startDate: newStartDateStr,
      type,
    })
  }

  const concludePlan = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const history: PlanHistoryItem[] = c.planHistory
            ? [...c.planHistory]
            : []
          if (c.planName && c.planStartDate && c.planEndDate) {
            history.push({
              id: Math.random().toString(36).substr(2, 9),
              name: c.planName,
              value: c.planValue || 0,
              startDate: c.planStartDate,
              endDate: format(new Date(), 'yyyy-MM-dd'),
              paymentStatus: 'paid',
              status: 'completed',
              type: c.planType,
            })
          }

          return {
            ...c,
            planId: undefined,
            planName: undefined,
            planValue: undefined,
            planStartDate: undefined,
            planEndDate: undefined,
            planDuration: undefined,
            planType: undefined,
            status: 'inactive',
            planHistory: history,
          }
        }
        return c
      }),
    )
  }

  const cancelPlan = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return

    if (client.planValue) {
      const refundTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        description: `Estorno - ${client.planName} - ${client.name}`,
        amount: -Math.abs(client.planValue),
        type: 'income', // Negative income works as refund
        category: 'Estorno',
        studentId: client.id,
        studentName: client.name,
        planName: client.planName,
        planType: client.planType,
        status: 'paid',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        paidAt: format(new Date(), 'yyyy-MM-dd'),
      }
      setTransactions((prev) => [...prev, refundTransaction])
    }

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const history: PlanHistoryItem[] = c.planHistory
            ? [...c.planHistory]
            : []
          if (c.planName && c.planStartDate && c.planEndDate) {
            history.push({
              id: Math.random().toString(36).substr(2, 9),
              name: c.planName,
              value: c.planValue || 0,
              startDate: c.planStartDate,
              endDate: format(new Date(), 'yyyy-MM-dd'),
              paymentStatus: 'refunded',
              status: 'cancelled',
              type: c.planType,
            })
          }

          return {
            ...c,
            planId: undefined,
            planName: undefined,
            planValue: undefined,
            planStartDate: undefined,
            planEndDate: undefined,
            planDuration: undefined,
            planType: undefined,
            status: 'inactive',
            planHistory: history,
          }
        }
        return c
      }),
    )
  }

  const addClient = (client: Client) => {
    if (client.planName && client.planValue && client.planStartDate) {
      const duration = client.planDuration || 1
      const startDate = parseISO(client.planStartDate)
      const endDate = addMonths(startDate, duration)
      const endDateStr = format(endDate, 'yyyy-MM-dd')

      const clientWithPlanDates = {
        ...client,
        planEndDate: endDateStr,
        planDuration: duration,
        planType: client.planType || 'fixed',
      }

      setClients((prev) => [...prev, clientWithPlanDates])

      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        description: `Plano ${client.planName} - ${client.name}`,
        amount: client.planValue,
        type: 'income',
        category: 'Planos',
        studentId: client.id,
        studentName: client.name,
        planId: client.planId,
        planName: client.planName,
        planType: client.planType || 'fixed',
        status: 'pending',
        dueDate: client.planStartDate,
      }
      setTransactions((prev) => [...prev, newTransaction])
    } else {
      setClients((prev) => [...prev, client])
    }

    if (client.status === 'active') {
      addEvent({
        id: Math.random().toString(36).substr(2, 9),
        title: 'Atualizar peso do aluno',
        date: new Date(),
        type: 'other',
        description: 'Acompanhamento semanal de peso',
        studentId: client.id,
        completed: false,
        isRecurring: true,
        frequency: 7,
      })
    }
  }

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id))
    setWorkouts((prev) => prev.filter((w) => w.clientId !== id))
    setDiets((prev) => prev.filter((d) => d.clientId !== id))
    setEvents((prev) => prev.filter((e) => e.studentId !== id))
    setTransactions((prev) => prev.filter((t) => t.studentId !== id))
  }

  const generateStudentLink = (clientId: string) => {
    const linkId = Math.random().toString(36).substr(2, 9)
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, linkId: linkId, linkActive: true } : c,
      ),
    )
  }

  const regenerateStudentLink = (clientId: string) => {
    generateStudentLink(clientId)
  }

  const deactivateStudentLink = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, linkActive: false } : c)),
    )
  }

  const addWeightEntry = (
    clientId: string,
    weight: number,
    date: string,
    observations?: string,
  ) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const newEntry: WeightEntry = {
            id: Math.random().toString(36).substr(2, 9),
            date,
            weight,
            observations,
          }
          const history = c.weightHistory ? [...c.weightHistory] : []
          history.push(newEntry)
          history.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )

          return {
            ...c,
            weight: weight,
            weightHistory: history,
          }
        }
        return c
      }),
    )
  }

  const addWorkout = (workout: Workout) =>
    setWorkouts((prev) => [...prev, workout])
  const updateWorkout = (updated: Workout) =>
    setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
  const duplicateWorkout = (id: string) => {
    const workout = workouts.find((w) => w.id === id)
    if (workout) {
      addWorkout({
        ...workout,
        id: Math.random().toString(36).substr(2, 9),
        title: `${workout.title} (Cópia)`,
        createdAt: new Date().toISOString().split('T')[0],
        clientId: undefined,
        clientName: undefined,
        startDate: undefined,
      })
    }
  }
  const removeWorkout = (id: string) =>
    setWorkouts((prev) => prev.filter((w) => w.id !== id))

  const assignWorkout = (
    workoutId: string,
    studentIds: string[],
    startDate: string,
    expirationDate: string | null,
    isLifetime: boolean,
  ) => {
    const workout = workouts.find((w) => w.id === workoutId)
    if (!workout) return

    const newWorkouts: Workout[] = studentIds.map((studentId) => {
      const student = clients.find((c) => c.id === studentId)
      return {
        ...workout,
        id: Math.random().toString(36).substr(2, 9),
        clientId: studentId,
        clientName: student?.name,
        startDate,
        expirationDate,
        isLifetime,
        createdAt: new Date().toISOString(),
      }
    })

    setWorkouts((prev) => [...prev, ...newWorkouts])
  }

  const addDiet = (diet: Diet) => setDiets((prev) => [...prev, diet])
  const updateDiet = (updated: Diet) =>
    setDiets((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
  const duplicateDiet = (id: string) => {
    const diet = diets.find((d) => d.id === id)
    if (diet) {
      const mealsCopy = diet.meals.map((meal) => ({
        ...meal,
        id: Math.random().toString(36).substr(2, 9),
        items: meal.items.map((item) => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        })),
      }))

      addDiet({
        ...diet,
        id: Math.random().toString(36).substr(2, 9),
        title: `${diet.title} (Cópia)`,
        meals: mealsCopy,
        clientId: undefined,
        clientName: undefined,
        startDate: undefined,
        createdAt: new Date().toISOString(),
      })
    }
  }
  const removeDiet = (id: string) =>
    setDiets((prev) => prev.filter((d) => d.id !== id))

  const assignDiet = (
    dietId: string,
    studentIds: string[],
    startDate: string,
    expirationDate: string | null,
    isLifetime: boolean,
  ) => {
    const diet = diets.find((d) => d.id === dietId)
    if (!diet) return

    const newDiets: Diet[] = studentIds.map((studentId) => {
      const student = clients.find((c) => c.id === studentId)
      const mealsCopy = diet.meals.map((meal) => ({
        ...meal,
        id: Math.random().toString(36).substr(2, 9),
        items: meal.items.map((item) => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        })),
      }))

      return {
        ...diet,
        id: Math.random().toString(36).substr(2, 9),
        clientId: studentId,
        clientName: student?.name,
        startDate,
        expirationDate,
        isLifetime,
        createdAt: new Date().toISOString(),
        meals: mealsCopy,
      }
    })

    setDiets((prev) => [...prev, ...newDiets])
  }

  const addEvent = (event: CalendarEvent) =>
    setEvents((prev) => [...prev, event])

  const updateEvent = (updated: CalendarEvent) => {
    if (updated.completed && updated.isRecurring && updated.frequency) {
      const previousEvent = events.find((e) => e.id === updated.id)
      if (previousEvent && !previousEvent.completed) {
        const nextDate = addDays(new Date(), updated.frequency)
        addEvent({
          ...updated,
          id: Math.random().toString(36).substr(2, 9),
          date: nextDate,
          completed: false,
        })
      }
    }

    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  const removeEvent = (id: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== id))

  const addTransaction = (transaction: Transaction) =>
    setTransactions((prev) => [...prev, transaction])

  const updateTransaction = (updated: Transaction) =>
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t)),
    )

  const markTransactionAsPaid = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'paid',
              paidAt: new Date().toISOString().split('T')[0],
            }
          : t,
      ),
    )
  }

  const addLink = (link: LinkItem) => setLinks((prev) => [...prev, link])
  const removeLink = (id: string) =>
    setLinks((prev) => prev.filter((l) => l.id !== id))

  const updateProfile = (newProfile: UserProfile) => setProfile(newProfile)
  const updateSettings = (newSettings: AppSettings) => setSettings(newSettings)
  const updateTheme = (theme: AppTheme) => {
    setSettings((prev) => ({ ...prev, theme }))
  }

  const addPlan = (plan: Plan) => setPlans((prev) => [...prev, plan])
  const updatePlan = (updated: Plan) =>
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  const removePlan = (id: string) =>
    setPlans((prev) => prev.filter((p) => p.id !== id))

  const addProposal = (proposal: Proposal) =>
    setProposals((prev) => [...prev, proposal])
  const updateProposal = (updated: Proposal) =>
    setProposals((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  const removeProposal = (id: string) =>
    setProposals((prev) => prev.filter((p) => p.id !== id))

  const incrementReferralViews = () => setReferralViews((prev) => prev + 1)
  const incrementReferralConversions = () =>
    setReferralConversions((prev) => prev + 1)

  return (
    <AppContext.Provider
      value={{
        clients,
        workouts,
        diets,
        events,
        transactions,
        links,
        profile,
        settings,
        plans,
        proposals,
        referralViews,
        referralConversions,
        addClient,
        updateClient,
        removeClient,
        assignPlan,
        renewPlan,
        concludePlan,
        cancelPlan,
        generateStudentLink,
        regenerateStudentLink,
        deactivateStudentLink,
        addWeightEntry,
        addWorkout,
        updateWorkout,
        duplicateWorkout,
        removeWorkout,
        assignWorkout,
        addDiet,
        updateDiet,
        duplicateDiet,
        removeDiet,
        assignDiet,
        addEvent,
        updateEvent,
        removeEvent,
        addTransaction,
        updateTransaction,
        markTransactionAsPaid,
        addLink,
        removeLink,
        updateProfile,
        updateSettings,
        updateTheme,
        addPlan,
        updatePlan,
        removePlan,
        addProposal,
        updateProposal,
        removeProposal,
        incrementReferralViews,
        incrementReferralConversions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppStore = () => {
  const context = useContext(AppContext)
  if (context === undefined)
    throw new Error('useAppStore must be used within an AppProvider')
  return context
}

export default useAppStore
