import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import GoogleSign from '@/components/auth/signInButton'
import LogoutButton from '@/components/auth/logoutButton'
import { useAuthState } from '@/hooks/authState'
import VersionDisplay from '@/components/snippets/app-version'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'

export default function TabTwoScreen() {
    const { user } = useAuthState()
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [authStatus, setAuthStatus] = useState<
        'idle' | 'loading' | 'error' | 'success'
    >('idle')

    // Log initial mount and user state
    useEffect(() => {
        const logInitialState = async () => {
            try {
                await supabase.from('log').insert([
                    {
                        message: `Screen mounted. User state: ${user ? 'logged in' : 'logged out'}`,
                        type: 'info',
                    },
                ])
            } catch (error) {
                console.error('Failed to log initial state:', error)
            }
        }
        logInitialState()
    }, [])

    const onError = async (error: any) => {
        setIsLoading(false)
        setAuthStatus('error')

        // Create a more detailed error message
        const errorDetail =
            typeof error === 'string'
                ? error
                : `${error.message || 'Unknown error'} (${error.code || 'no code'})`

        setErrorMessage(errorDetail)

        // Log the error to Supabase
        try {
            await supabase.from('log').insert([
                {
                    message: `Auth Error: ${JSON.stringify(error)}`,
                    type: 'error',
                },
            ])
        } catch (logError) {
            console.error('Failed to log error:', logError)
        }
    }

    const onSuccess = async (message: any) => {
        setIsLoading(false)
        setAuthStatus('success')
        setErrorMessage(
            typeof message === 'string' ? message : 'Sign in successful'
        )

        // Log the success
        try {
            await supabase.from('log').insert([
                {
                    message: `Auth Success: ${JSON.stringify(message)}`,
                    type: 'info',
                },
            ])
        } catch (logError) {
            console.error('Failed to log success:', logError)
        }
    }

    const handleAuthStart = () => {
        setIsLoading(true)
        setAuthStatus('loading')
        setErrorMessage('')
    }

    return (
        <SafeAreaView style={styles.container}>
            <VersionDisplay />

            <View style={styles.authContainer}>
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Signing in...</Text>
                    </View>
                )}

                {user ? (
                    <LogoutButton />
                ) : (
                    <GoogleSign
                        onError={onError}
                        onSuccess={onSuccess}
                        onAuthStart={handleAuthStart}
                    />
                )}

                {errorMessage ? (
                    <View style={styles.messageContainer}>
                        <Text
                            style={[
                                styles.message,
                                authStatus === 'error'
                                    ? styles.errorMessage
                                    : styles.successMessage,
                            ]}
                        >
                            {errorMessage}
                        </Text>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    authContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    messageContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
    },
    errorMessage: {
        color: '#dc2626',
    },
    successMessage: {
        color: '#16a34a',
    },
})
