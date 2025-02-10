import { create } from 'zustand'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

type User = {
    app_metadata: any
    aud: string
    confirmed_at?: string
    created_at: string
    email?: string
    email_confirmed_at?: string
    id: string
    user_metadata: any
    identities?: any
    isAdmin?: boolean
} | null

interface AuthState {
    user: User
    setUser: (user: User) => void
    cleanUser: () => void
    checkExistingSession: () => void
}

export const useAuthState = create<AuthState>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    cleanUser: () => set({ user: null }),
    checkExistingSession: async () => {
        try {
            console.log('Check existing user session')

            const currentUser = GoogleSignin.getCurrentUser()
            if (currentUser?.idToken) {
                const { data: authData, error: authError } =
                    await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: currentUser.idToken,
                    })

                if (authError) throw authError

                // TODO - Fer millor
                const isAdmin =
                    authData.user.email === 'gesteve.12@gmail.com' ||
                    authData.user.email === 'davidestevebusquets@gmail.com' ||
                    authData.user.email === 'rosamariabn@hotmail.com'

                set({ user: { ...authData.user, isAdmin } })

                logger({
                    type: 'success',
                    title: 'Auto Auth Success',
                    message: authData.user.email,
                })

                return
            }
        } catch (error: any) {
            logger({
                type: 'error',
                title: 'Auto Auth Error',
                message: JSON.stringify(error),
            })
        }
    },
}))
