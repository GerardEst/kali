import { create } from 'zustand'
  
type User = {
    app_metadata: any,
    aud: string,
    confirmed_at?: string,
    created_at:string,
    email?: string
    email_confirmed_at?: string,
    id: string,
    user_metadata: any,
    identities?: any
} | null;

interface AuthState {
    user: User;
    setUser: (user: User) => void;
    cleanUser: () => void
}

export const useAuthState = create<AuthState>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    cleanUser: () => set({ user: null })
}))