import { create } from 'zustand'
import { UserProfile } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'

interface AppState {
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile | null) => void
  isLoadingProfile: boolean
  setIsLoadingProfile: (loading: boolean) => void
  addWeightEntry: (
    userId: string,
    weight: number,
    date: string,
    observations: string,
  ) => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  isLoadingProfile: true,
  setIsLoadingProfile: (loading) => set({ isLoadingProfile: loading }),
  addWeightEntry: async (userId, weight, date, observations) => {
    try {
      // Insert into weight_history
      const { error: historyError } = await supabase
        .from('weight_history')
        .insert({
          user_id: userId,
          weight,
          date,
          observations,
        })

      if (historyError) throw historyError

      // Update current weight in users_profile
      const { error: profileError } = await supabase
        .from('users_profile')
        .update({ weight })
        .eq('id', userId)

      if (profileError) throw profileError
    } catch (error) {
      console.error('Error adding weight entry:', error)
      throw error
    }
  },
}))

export default useAppStore
