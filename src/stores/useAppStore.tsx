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
} from '@/data/mockData'

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
  addClient: (client: Client) => void
  updateClient: (client: Client) => void
  removeClient: (id: string) => void
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

  const addClient = (client: Client) => setClients((prev) => [...prev, client])
  const updateClient = (updated: Client) =>
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id))
    // Cascade delete: Remove associated Workouts, Diets and Events
    setWorkouts((prev) => prev.filter((w) => w.clientId !== id))
    setDiets((prev) => prev.filter((d) => d.clientId !== id))
    setEvents((prev) => prev.filter((e) => e.studentId !== id))
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
        clientId: undefined, // Reset client when duplicating as template
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
      // Deep copy meals
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
      // Deep copy meals for assigned diet
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
  const updateEvent = (updated: CalendarEvent) =>
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  const removeEvent = (id: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== id))

  const addTransaction = (transaction: Transaction) =>
    setTransactions((prev) => [...prev, transaction])

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
        addClient,
        updateClient,
        removeClient,
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
        addLink,
        removeLink,
        updateProfile,
        updateSettings,
        updateTheme,
        updateThemeColor,
        addPlan,
        updatePlan,
        removePlan,
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
