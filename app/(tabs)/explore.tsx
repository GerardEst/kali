import { StyleSheet, Text, Image, Platform, View } from 'react-native'
import GoogleSign from '@/components/auth/signInButton'
import LogoutButton from '@/components/auth/logoutButton'
import { useAuthState } from '@/hooks/authState'

export default function TabTwoScreen() {
    const { user } = useAuthState()
    console.log(user)
    return (
        <View>
            <Text>Holaaa</Text>
            {user ? <LogoutButton></LogoutButton> : <GoogleSign></GoogleSign>}
        </View>
    )
}
