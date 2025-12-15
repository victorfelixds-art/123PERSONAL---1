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
  subDays,
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
  updateTheme: (theme: 'light' | 'dark') => void
  updateThemeColor: (
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red',
  ) => void
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

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts)
  const [diets, setDiets] = useState<Diet[]>(mockDiets)
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions)
  const [links, setLinks] = useState<LinkItem[]>(mockLinks)
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [settings, setSettings] = useState<AppSettings>(mockSettings)
  const [plans, setPlans] = useState<Plan[]>(mockPlans)
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals)
  const [referralViews, setReferralViews] = useState(15)
  const [referralConversions, setReferralConversions] = useState(3)

  // Status Check Effect
  useEffect(() => {
    // Check for expired plans and update status automatically
    const today = new Date()
    setClients((prev) =>
      prev.map((client) => {
        if (!client.planEndDate || client.status === 'inactive') return client

        const endDate = parseISO(client.planEndDate)
        if (isBefore(endDate, today)) {
          return { ...client, status: 'inactive' }
        } else if (client.status === 'inactive' && isAfter(endDate, today)) {
          // Reactivate if date is valid (though rare case without manual intervention)
          return { ...client, status: 'active' }
        }
        return client
      }),
    )
  }, []) // Run once on mount

  // Apply Theme Effect
  useEffect(() => {
    // Mode
    if (settings.theme === 'dark')
      document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    // Color
    const themes = [
      'theme-blue',
      'theme-green',
      'theme-orange',
      'theme-purple',
      'theme-red',
    ]
    document.documentElement.classList.remove(...themes)
    if (settings.themeColor) {
      document.documentElement.classList.add(`theme-${settings.themeColor}`)
    }
  }, [settings.theme, settings.themeColor])

  const assignPlan = (
    clientId: string,
    planData: {
      id?: string
      name: string
      value: number
      durationInMonths: number
      startDate: string
    },
  ) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return

    const startDate = parseISO(planData.startDate)
    const endDate = addMonths(startDate, planData.durationInMonths)
    const endDateStr = format(endDate, 'yyyy-MM-dd')

    // Create Transaction (One-time payment for the plan period)
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: `Plano ${planData.name} - ${client.name}`,
      amount: planData.value,
      type: 'income',
      category: 'Planos',
      studentId: client.id,
      studentName: client.name,
      planId: planData.id, // Can be undefined for custom plans
      planName: planData.name,
      status: 'paid', // Automatically Paid
      dueDate: planData.startDate,
      paidAt: planData.startDate,
    }

    setTransactions((prev) => [...prev, newTransaction])

    // Update Client
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          // Archive old plan if exists
          const history = c.planHistory ? [...c.planHistory] : []
          if (c.planName && c.planStartDate && c.planEndDate) {
            history.push({
              id: Math.random().toString(36).substr(2, 9),
              name: c.planName,
              value: c.planValue || 0,
              startDate: c.planStartDate,
              endDate: c.planEndDate,
              paymentStatus: 'paid', // Assuming past was paid
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
            planHistory: history,
            status: 'active', // Automatically Active
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

    assignPlan(clientId, {
      id: planId,
      name,
      value,
      durationInMonths: duration,
      startDate: newStartDateStr,
    })
  }

  const addClient = (client: Client) => {
    // Logic to handle if initial plan is provided
    if (client.planName && client.planValue && client.planStartDate) {
      // We will delegate to assignPlan logic implicitly by creating transaction
      // But assignPlan is cleaner. Let's create the transaction here manually to respect the "One Response" rule properly without complex calls
      const duration = client.planDuration || 1
      const startDate = parseISO(client.planStartDate)
      const endDate = addMonths(startDate, duration)
      const endDateStr = format(endDate, 'yyyy-MM-dd')

      const clientWithPlanDates = {
        ...client,
        planEndDate: endDateStr,
        planDuration: duration,
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
        status: 'paid', // Auto paid
        dueDate: client.planStartDate,
        paidAt: client.planStartDate,
      }
      setTransactions((prev) => [...prev, newTransaction])
    } else {
      setClients((prev) => [...prev, client])
    }

    // Create recurring weight update event
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
          // Sort history by date descending
          history.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )

          return {
            ...c,
            weight: weight, // Update current weight
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
        meals: mealsCopy,
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
    // Logic for recurring event completion
    if (updated.completed && updated.isRecurring && updated.frequency) {
      const previousEvent = events.find((e) => e.id === updated.id)
      // Only trigger recurrence if it wasn't already completed
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
  const updateTheme = (theme: 'light' | 'dark') => {
    setSettings((prev) => ({ ...prev, theme }))
  }
  const updateThemeColor = (
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red',
  ) => {
    setSettings((prev) => ({ ...prev, themeColor: color }))
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
        updateThemeColor,
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
