import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GenderState {
  activeGender: 'men' | 'women' | null
  setGender: (gender: 'men' | 'women' | null) => void
}

export const useGenderStore = create<GenderState>()(
  persist(
    (set) => ({
      activeGender: null,
      setGender: (gender) => set({ activeGender: gender }),
    }),
    { name: 'active_gender' }
  )
)
