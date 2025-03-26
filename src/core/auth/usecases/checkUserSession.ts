import {
    GoogleSignin,
    isSuccessResponse,
    isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/src/core/supabase'
import { webClientId } from '../config'
import { getProfile } from '@/src/api/profiles/profile-api'

export const checkUserSession = async () => {
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

                // Get the profile data from user
                const { userData, userError } = await getProfile(
                    authData.user.id
                )

                if (userError) throw userError

                return { ...authData.user, ...userData }
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
        // Clean up on error
        await GoogleSignin.signOut()

        return { error }
    }
}
