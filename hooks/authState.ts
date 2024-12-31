import { create } from 'zustand'

type User = {
    id: string;
    email: string;
} | null;

interface AuthState {
    user: any;
    setUser: (user: User) => void;
    cleanUser: () => void;
    //isAuthenticated: () => boolean;
}

export const useAuthState = create<any>((set,get) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    cleanUser: () => set({ user: null }),
    //isAuthenticated: () => !!get().user
}))