import { StyleSheet, View } from 'react-native'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import LogoutButton from '@/src/shared/components/buttons/LogoutButton'
import { useAuthState } from '@/src/store/authState'
import VersionDisplay from '@/src/shared/components/app-version'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LanguageSelector } from '@/src/shared/components/language-selector'

export default function TabTwoScreen() {
    const { user } = useAuthState()

    return (
        <SafeAreaView style={styles.container}>
            <VersionDisplay />
            <LanguageSelector />

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
