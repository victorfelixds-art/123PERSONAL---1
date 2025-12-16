import { createContext, useContext, useState, ReactNode } from 'react'

interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setLoading] = useState(false)

  const value = {
    sidebarOpen,
    setSidebarOpen,
    isLoading,
    setLoading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

const useAppStore = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}

export default useAppStore
