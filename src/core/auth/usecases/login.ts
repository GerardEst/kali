import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { supabase } from '../../supabase'
import { logger } from '@/src/shared/utils/logger'
import { webClientId } from '../config'

type GoogleSignProps = {
    onError?: (error: Error) => void
    onSuccess?: (user: any) => void
}
export const loginUser = async () => {
    GoogleSignin.configure({
        webClientId,
    })

    try {
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
        })
        const userInfo = await GoogleSignin.signIn()
        const userToken = userInfo?.data?.idToken

        if (!userToken) {
            throw new Error('No ID token present in Google sign-in response')
        }

        // Attempt Supabase sign-in
        const { data: authData, error: authError } =
            await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userToken,
            })

        if (authError) {
            throw new Error(
                `Signed correctly on google, but failed on auth to Supabase: ${authError}`
            )
        }

        const isAdmin = authData.user.email === 'gesteve.12@gmail.com'

        // Log the success
        logger({
            type: 'success',
            title: 'Auth Success',
            message: authData.user.email,
        })

        const user = { ...authData.user, isAdmin }

        return user
    } catch (error: any) {
        // Log the error to Supabase
        logger({
            type: 'error',
            title: 'Auth Error',
            message: JSON.stringify(error),
        })

        return error
    }
}
