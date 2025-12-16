import { create } from 'zustand'
import { UserProfile } from '@/lib/types'

interface AppState {
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile | null) => void
  isLoadingProfile: boolean
  setIsLoadingProfile: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  isLoadingProfile: true,
  setIsLoadingProfile: (loading) => set({ isLoadingProfile: loading }),
}))

export default useAppStore
