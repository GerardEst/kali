import {
    GoogleSignin,
    isSuccessResponse,
    isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/src/core/supabase'
import { logger } from '@/src/shared/utils/logger'
import { webClientId } from './config'
import { useAuthState } from '@/src/store/authState'

export const checkExistingSession = async () => {
    const { setUser, cleanUser } = useAuthState()

    GoogleSignin.configure({
        webClientId,
    })

    try {
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
                    authData.user.email === 'davidestevebusquets@gmail.com' ||
                    authData.user.email === 'rosamariabn@hotmail.com'

                // Update the user state
                setUser({ ...authData.user, isAdmin })

                logger({
                    type: 'success',
                    title: 'Auto startup signin',
                    message:
                        response.data.user.email + ' successfully signed in',
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
        cleanUser()
    }
}
