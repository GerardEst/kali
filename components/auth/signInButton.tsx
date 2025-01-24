import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/lib/supabase'
import { useAuthState } from '@/hooks/authState'
import { Alert } from 'react-native'
import { useEffect } from 'react'
import { logger } from '@/lib/logger'

type GoogleSignProps = {
    onError?: (error: Error) => void
    onSuccess?: (user: any) => void
}

export default function GoogleSign({ onError, onSuccess }: GoogleSignProps) {
    const { user, setUser } = useAuthState()

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '134329457349-952c6sm81q8dvc6jbcl3rjmv2c3gbgsi.apps.googleusercontent.com',
        })
        checkExistingSession()
    }, [])

    const checkExistingSession = async () => {
        try {
            const currentUser = await GoogleSignin.getCurrentUser()
            if (currentUser?.idToken) {
                const { data: authData, error: authError } =
                    await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: currentUser.idToken,
                    })

                if (authError) throw authError

                setUser(authData.user)
                onSuccess?.(authData.user)

                logger({
                    type: 'success',
                    title: 'Auto Auth Success',
                    message: authData.user.email,
                })
            }
        } catch (error: any) {
            logger({
                type: 'error',
                title: 'Auto Auth Error',
                message: JSON.stringify(error),
            })
        }
    }

    const handleSignin = async () => {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            })
            const userInfo = await GoogleSignin.signIn()
            const userToken = userInfo?.data?.idToken

            if (!userToken) {
                throw new Error(
                    'No ID token present in Google sign-in response'
                )
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

            setUser(authData.user)
            onSuccess?.(authData.user)

            // Log the success
            logger({
                type: 'success',
                title: 'Auth Success',
                message: authData.user.email,
            })
        } catch (error: any) {
            onError?.(error)

            // Log the error to Supabase
            logger({
                type: 'error',
                title: 'Auth Error',
                message: JSON.stringify(error),
            })

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert(
                    'Sign In Cancelled',
                    'User cancelled the login flow'
                )
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert(
                    'In Progress',
                    'Sign in operation already in progress'
                )
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert(
                    'Services Unavailable',
                    'Google Play services is not available'
                )
            } else {
                Alert.alert(
                    'Error de registro',
                    `Error Code: ${error.code}\nMensaje: ${error.message}`,
                    [{ text: 'OK' }]
                )
            }
        }
    }

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Light}
            onPress={handleSignin}
        />
    )
}
