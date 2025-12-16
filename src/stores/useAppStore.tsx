import { createContext, useContext, createElement, type ReactNode } from 'react'

interface AppContextType {
  version: string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppStore = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    version: '1.0.0',
  }

  return createElement(AppContext.Provider, { value }, children)
}
