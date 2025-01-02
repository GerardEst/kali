import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import GoogleSign from '@/components/auth/signInButton'
import LogoutButton from '@/components/auth/logoutButton'
import { useAuthState } from '@/hooks/authState'
import VersionDisplay from '@/components/snippets/app-version'
import { SafeAreaView } from 'react-native-safe-area-context'
import { logger } from '@/lib/logger'

export default function TabTwoScreen() {
    const { user } = useAuthState()
    const [authStatus, setAuthStatus] = useState<
        'idle' | 'loading' | 'error' | 'success'
    >('idle')

    const onError = async (error: any) => {
        setAuthStatus('error')

        // Log the error to Supabase
        logger({
            type: 'error',
            title: 'Auth Error',
            message: JSON.stringify(error),
        })
    }

    const onSuccess = async (message: any) => {
        setAuthStatus('success')

        // Log the success
        logger({
            type: 'success',
            title: 'Auth Success',
            message: JSON.stringify(message),
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <VersionDisplay />

            <View style={styles.authContainer}>
                {user ? (
                    <LogoutButton />
                ) : (
                    <GoogleSign onError={onError} onSuccess={onSuccess} />
                )}

                <View style={styles.messageContainer}>
                    <Text style={[styles.message]}>
                        Auth status: {authStatus}
                    </Text>
                </View>
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
})
