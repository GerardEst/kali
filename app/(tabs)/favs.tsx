import { StyleSheet, View } from 'react-native'
import { useAuthState } from '@/hooks/authState'
import VersionDisplay from '@/components/snippets/app-version'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Favs() {
    const { user } = useAuthState()

    return (
        <SafeAreaView style={styles.container}>
            <VersionDisplay />
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
