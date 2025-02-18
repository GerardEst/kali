import { create } from 'zustand'
import {
    GoogleSignin,
    isSuccessResponse,
    isNoSavedCredentialFoundResponse,
    SignInSilentlyResponse,
} from '@react-native-google-signin/google-signin'
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
            GoogleSignin.configure({
                webClientId:
                    '134329457349-952c6sm81q8dvc6jbcl3rjmv2c3gbgsi.apps.googleusercontent.com',
            })

            console.log('Check existing user session')

            try {
                const response: any = await GoogleSignin.signInSilently()
                if (isSuccessResponse(response)) {
                    logger({
                        type: 'success',
                        title: 'Auto Auth signin',
                        message: 'successfully signInSilently',
                    })

                    // Auth in supabase with the correct token (autorefreshed)
                    // TODO - Sembla que el signInSilently refresca el token bé, però després supabase peta
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
                        title: 'Auto Auth Success',
                        message: authData.user.email,
                    })
                } else if (isNoSavedCredentialFoundResponse(response)) {
                    logger({
                        type: 'error',
                        title: 'Auto Auth signin',
                        message: 'signInSilently failed',
                    })
                }
            } catch (error) {
                logger({
                    type: 'error',
                    title: 'signInSilently failed 2',
                    message: error,
                })
            }
        } catch (error) {
            console.log({ error })

            logger({
                type: 'error',
                title: 'Auto Auth Error 2',
                message:
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
            })

            // Clean up on error
            await GoogleSignin.signOut()
            set({ user: null })
        }
    },
}))
