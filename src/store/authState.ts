import { create } from 'zustand'
import {
    GoogleSignin,
    isSuccessResponse,
    isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/src/core/supabase'
import { logger } from '@/src/shared/utils/logger'

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
            GoogleSignin.configure({
                webClientId:
                    '134329457349-952c6sm81q8dvc6jbcl3rjmv2c3gbgsi.apps.googleusercontent.com',
            })

            try {
                const response: any = await GoogleSignin.signInSilently()

                if (isSuccessResponse(response)) {
                    // Signin user to supabase
                    const { data: authData, error: authError } =
                        await supabase.auth.signInWithIdToken({
                            provider: 'google',
                            token: response.data.idToken as any,
                        })

                    if (authError) throw authError

                    // xapusa jeje
                    const isAdmin =
                        authData.user.email === 'gesteve.12@gmail.com' ||
                        authData.user.email ===
                            'davidestevebusquets@gmail.com' ||
                        authData.user.email === 'rosamariabn@hotmail.com'

                    // Update the user state
                    set({ user: { ...authData.user, isAdmin } })

                    logger({
                        type: 'success',
                        title: 'Auto startup signin',
                        message:
                            response.data.user.email +
                            ' successfully signed in',
                    })
                } else if (isNoSavedCredentialFoundResponse(response)) {
                    throw new Error('No saved credentials found response')
                }
            } catch (error: any) {
                throw new Error(
                    'Failed to login on supabase with given token with message: ' +
                        error.message
                )
            }
        } catch (error: any) {
            logger({
                type: 'error',
                title: 'Auto startup signin failed',
                message: error.message,
            })

            // Clean up on error
            await GoogleSignin.signOut()
            set({ user: null })
        }
    },
}))
