import { create } from 'zustand'

type User = {
    user: any;
    session: any;
} | null;

interface AuthState {
    user: User;
    setUser: (user: User) => void;
    cleanUser: () => void
}

export const useAuthState = create<AuthState>((set,get) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    cleanUser: () => set({ user: null })
}))