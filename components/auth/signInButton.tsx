import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/lib/supabase'
import { useAuthState } from '@/hooks/authState'
import { Alert } from 'react-native'
import { useEffect } from 'react'

type GoogleSignProps = {
    onError?: (error: Error) => void
    onSuccess?: (user: any) => void
    onAuthStart?: () => void
}

export default function GoogleSign({
    onError,
    onSuccess,
    onAuthStart,
}: GoogleSignProps) {
    const { user, setUser } = useAuthState()

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '134329457349-952c6sm81q8dvc6jbcl3rjmv2c3gbgsi.apps.googleusercontent.com',
        })
    }, [])

    const handleSignin = async () => {
        try {
            // Log the start of the sign-in process
            await supabase.from('log').insert([
                {
                    message: 'Starting Google sign-in process',
                    type: 'info',
                },
            ])

            // Check Play Services
            const playServicesAvailable = await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            }).catch(async (error) => {
                await supabase.from('log').insert([
                    {
                        message: `Play Services Error: ${JSON.stringify(error)}`,
                        type: 'error',
                    },
                ])
                throw error
            })

            // Attempt sign in
            const userInfo = await GoogleSignin.signIn().catch(
                async (error) => {
                    await supabase.from('log').insert([
                        {
                            message: `SignIn Error: ${JSON.stringify(error)}`,
                            type: 'error',
                        },
                    ])
                    throw error
                }
            )

            // Log successful Google sign-in
            await supabase.from('log').insert([
                {
                    message: `Google SignIn Success: ${JSON.stringify(userInfo)}`,
                    type: 'info',
                },
            ])

            if (!userInfo?.data?.idToken) {
                throw new Error(
                    'No ID token present in Google sign-in response'
                )
            }

            // Attempt Supabase sign-in
            const { data: authData, error: authError } = await supabase.auth
                .signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                })
                .catch(async (error) => {
                    await supabase.from('log').insert([
                        {
                            message: `Supabase Auth Error: ${JSON.stringify(error)}`,
                            type: 'error',
                        },
                    ])
                    throw error
                })

            if (authError) {
                throw authError
            }

            // Log successful Supabase sign-in
            await supabase.from('log').insert([
                {
                    message: `Supabase SignIn Success: ${JSON.stringify(authData)}`,
                    type: 'info',
                },
            ])

            setUser(authData.user)
            onSuccess?.(authData.user)
        } catch (error: any) {
            // Enhanced error logging
            const errorMessage = {
                code: error.code,
                message: error.message,
                stack: error.stack,
                details: JSON.stringify(error),
            }

            await supabase.from('log').insert([
                {
                    message: `Final Error Handler: ${JSON.stringify(errorMessage)}`,
                    type: 'error',
                },
            ])

            // Show alert for better debugging in production
            Alert.alert(
                'Sign In Error',
                `Error Code: ${error.code}\nMessage: ${error.message}`,
                [{ text: 'OK' }]
            )

            onError?.(error)

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
            }
        }
    }

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleSignin}
        />
    )
}
