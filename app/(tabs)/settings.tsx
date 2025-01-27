import { StyleSheet, View } from 'react-native'
import GoogleSign from '@/components/auth/signInButton'
import LogoutButton from '@/components/auth/logoutButton'
import { useAuthState } from '@/hooks/authState'
import VersionDisplay from '@/components/snippets/app-version'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabTwoScreen() {
    const { user } = useAuthState()

    return (
        <SafeAreaView style={styles.container}>
            <VersionDisplay />

            <View style={styles.authContainer}>
                {user ? <LogoutButton /> : <GoogleSign />}
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
})
