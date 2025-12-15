import React, { createContext, useContext, useState, ReactNode } from 'react'
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
import {
  mockClients,
  mockWorkouts,
  mockDiets,
  mockEvents,
  mockTransactions,
  mockLinks,
  mockProfile,
  mockSettings,
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
  addClient: (client: Client) => void
  removeClient: (id: string) => void
  addWorkout: (workout: Workout) => void
  removeWorkout: (id: string) => void
  addDiet: (diet: Diet) => void
  removeDiet: (id: string) => void
  addEvent: (event: CalendarEvent) => void
  addTransaction: (transaction: Transaction) => void
  addLink: (link: LinkItem) => void
  removeLink: (id: string) => void
  updateProfile: (profile: UserProfile) => void
  updateSettings: (settings: AppSettings) => void
  updateTheme: (theme: 'light' | 'dark') => void
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

  const addClient = (client: Client) => setClients((prev) => [...prev, client])
  const removeClient = (id: string) =>
    setClients((prev) => prev.filter((c) => c.id !== id))

  const addWorkout = (workout: Workout) =>
    setWorkouts((prev) => [...prev, workout])
  const removeWorkout = (id: string) =>
    setWorkouts((prev) => prev.filter((w) => w.id !== id))

  const addDiet = (diet: Diet) => setDiets((prev) => [...prev, diet])
  const removeDiet = (id: string) =>
    setDiets((prev) => prev.filter((d) => d.id !== id))

  const addEvent = (event: CalendarEvent) =>
    setEvents((prev) => [...prev, event])

  const addTransaction = (transaction: Transaction) =>
    setTransactions((prev) => [...prev, transaction])

  const addLink = (link: LinkItem) => setLinks((prev) => [...prev, link])
  const removeLink = (id: string) =>
    setLinks((prev) => prev.filter((l) => l.id !== id))

  const updateProfile = (newProfile: UserProfile) => setProfile(newProfile)

  const updateSettings = (newSettings: AppSettings) => setSettings(newSettings)

  const updateTheme = (theme: 'light' | 'dark') => {
    setSettings((prev) => ({ ...prev, theme }))
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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
        addClient,
        removeClient,
        addWorkout,
        removeWorkout,
        addDiet,
        removeDiet,
        addEvent,
        addTransaction,
        addLink,
        removeLink,
        updateProfile,
        updateSettings,
        updateTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppStore = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}

export default useAppStore
