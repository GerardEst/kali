import { StyleSheet, Text, Image, Platform, View } from 'react-native'
import GoogleSign from '@/components/auth/signInButton'
import LogoutButton from '@/components/auth/logoutButton'
import { useAuthState } from '@/hooks/authState'
import VersionDisplay from '@/components/snippets/app-version'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabTwoScreen() {
    const { user } = useAuthState()
    console.log(user)
    return (
        <SafeAreaView>
            <VersionDisplay />
            {user ? <LogoutButton></LogoutButton> : <GoogleSign></GoogleSign>}
        </SafeAreaView>
    )
}
