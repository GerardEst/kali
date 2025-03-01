import { create } from 'zustand'
import { User } from '../core/auth/models'

interface AuthState {
    user: User
    setUser: (user: User) => void
    cleanUser: () => void
}

export const useAuthState = create<AuthState>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    cleanUser: () => set({ user: null }),
}))
